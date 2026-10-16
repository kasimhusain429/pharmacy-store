import os
import cv2
import numpy as np
import subprocess

def process_video():
    input_path = "Pill_organizer_lids_opening_20261016015951.mp4"
    temp_dir = "scratch/clean_frames"
    os.makedirs(temp_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Processing {total_frames} frames at {fps} fps...")
    
    frame_idx = 0
    bg_color = np.array([240, 244, 238], dtype=np.float32) # BGR for #eef4f0
    
    while True:
        ret, img = cap.read()
        if not ret:
            break
            
        h, w = img.shape[:2]
        
        # Detect green background and contact shadows on green screen
        # Green hue or G significantly higher than R and B
        b = img[:, :, 0].astype(np.int16)
        g = img[:, :, 1].astype(np.int16)
        r = img[:, :, 2].astype(np.int16)
        
        is_green = (g > 115) & (r < 95) & (b < 105)
        # Also include dark contact shadows that are predominantly green
        is_shadow_green = (g > r + 15) & (g > b + 15) & (g < 120) & (g > 40)
        green_candidate = (is_green | is_shadow_green).astype(np.uint8)
        
        # Connected components on green_candidate
        num_labels, labels = cv2.connectedComponents(green_candidate)
        
        # Find labels touching image boundaries
        border_labels = set()
        border_labels.update(labels[0, :])
        border_labels.update(labels[h-1, :])
        border_labels.update(labels[:, 0])
        border_labels.update(labels[:, w-1])
        border_labels.discard(0)
        
        bg_mask = np.isin(labels, list(border_labels))
        
        # Clear bottom-right AI watermark (sparkle)
        bg_mask[560:, 1080:] = True
        
        # Despill perimeter
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        dilated_bg = cv2.dilate(bg_mask.astype(np.uint8), kernel)
        edge = (dilated_bg == 1) & (~bg_mask)
        
        b_c = img[:, :, 0].copy()
        g_c = img[:, :, 1].copy()
        r_c = img[:, :, 2].copy()
        max_allowed_g = np.maximum(r_c, b_c)
        g_c[edge] = np.minimum(g_c[edge], max_allowed_g[edge])
        cleaned_bgr = cv2.merge([b_c, g_c, r_c])
        
        # Antialiased soft alpha edge
        alpha = (~bg_mask).astype(np.uint8) * 255
        alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
        alpha_f = (alpha / 255.0)[:, :, np.newaxis]
        
        # Composite onto #eef4f0
        comp = (cleaned_bgr.astype(np.float32) * alpha_f + bg_color * (1.0 - alpha_f)).astype(np.uint8)
        
        # RGBA for transparent webm (use comp as RGB so fallback without alpha is #eef4f0, NEVER green!)
        rgba = np.dstack([comp, alpha])
        
        out_frame_path = os.path.join(temp_dir, f"frame_{frame_idx:04d}.png")
        cv2.imwrite(out_frame_path, comp)
        
        # Save first frame as poster
        if frame_idx == 0:
            cv2.imwrite("public/pill_organizer_poster.jpg", comp)
        
        # Save RGBA frames for webm
        rgba_dir = "scratch/rgba_frames"
        os.makedirs(rgba_dir, exist_ok=True)
        cv2.imwrite(os.path.join(rgba_dir, f"frame_{frame_idx:04d}.png"), rgba)
        
        frame_idx += 1
        
    cap.release()
    print(f"Processed {frame_idx} frames. Now encoding with ffmpeg...")
    
    # 1. Encode MP4 (Composited on #eef4f0 background, H.264 High Profile, faststart for instant streaming)
    cmd_mp4 = [
        "ffmpeg", "-y", "-framerate", str(fps),
        "-i", os.path.join(temp_dir, "frame_%04d.png"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-profile:v", "high", "-level", "4.0",
        "-movflags", "+faststart",
        "-crf", "18", "-preset", "fast",
        "public/pill_organizer_clean.mp4"
    ]
    subprocess.run(cmd_mp4, check=True)
    print("public/pill_organizer_clean.mp4 created successfully!")
    
    # 2. Encode WebM (with Alpha channel yuva420p)
    cmd_webm = [
        "ffmpeg", "-y", "-framerate", str(fps),
        "-i", "scratch/rgba_frames/frame_%04d.png",
        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
        "-b:v", "2M", "-auto-alt-ref", "0",
        "public/pill_organizer_transparent.webm"
    ]
    subprocess.run(cmd_webm, check=True)
    print("public/pill_organizer_transparent.webm created successfully!")

if __name__ == "__main__":
    process_video()
