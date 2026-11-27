"""
Builds the pharmacy packaging kit and exports it to public/models/pharmacy-kit.glb.

Run inside Blender (tested with 5.2):
    blender --background --python scripts/blender/build_kit.py
or exec it through the Blender MCP bridge with KIT_OUT set.

Units: 1 Blender unit = 10 cm. Every model is a root Empty named after the
packaging type, with child meshes whose material names are used by the site
to assign WebGL materials (AmberGlass, CapWhite, LabelPaper, ...).
Label meshes have a 0..1 UV wrap so the site can print product labels onto them.
"""
import bpy, bmesh, math, os
from mathutils import Vector

OUT = os.environ.get("KIT_OUT") or os.path.join(
    os.path.dirname(os.path.abspath(__file__ if "__file__" in globals() else ".")), "..", "..", "public", "models", "pharmacy-kit.glb"
)


def clear_scene():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for d in list(coll):
            coll.remove(d)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)


def mat(name, color, rough=0.4, metal=0.0, transmission=0.0, ior=1.5, coat=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Transmission Weight"].default_value = transmission
    b.inputs["IOR"].default_value = ior
    b.inputs["Coat Weight"].default_value = coat
    return m


def fillet(points, n=5):
    """points: (r, z, radius). Rounds each interior corner with a quadratic curve."""
    out = []
    for i, (r, z, rad) in enumerate(points):
        if rad <= 0 or i == 0 or i == len(points) - 1:
            out.append((r, z))
            continue
        p0 = Vector(points[i - 1][:2]); p1 = Vector((r, z)); p2 = Vector(points[i + 1][:2])
        a = p1 + (p0 - p1).normalized() * rad
        b = p1 + (p2 - p1).normalized() * rad
        for s in range(n + 1):
            t = s / n
            q = (1 - t) ** 2 * a + 2 * (1 - t) * t * p1 + t * t * b
            out.append((q.x, q.y))
    return out


def link(ob, parent):
    bpy.context.scene.collection.objects.link(ob)
    if parent:
        ob.parent = parent


def smooth_by_angle(ob, angle):
    for o in bpy.context.selected_objects:
        o.select_set(False)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))


def lathe(name, profile, material, parent, segments=64, rfunc=None, u_span=1.0, smooth=35):
    """Revolve an (r, z) profile around Z with clean 0..1 UVs (u around, v along profile)."""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    L = [0.0]
    for k in range(1, len(profile)):
        (r0, z0), (r1, z1) = profile[k - 1], profile[k]
        L.append(L[-1] + math.hypot(r1 - r0, z1 - z0))
    tot = L[-1] or 1.0
    full = u_span >= 0.9999
    ncol = segments if full else segments + 1
    rings = []
    for (r, z) in profile:
        if r < 1e-7:
            rings.append(("pole", bm.verts.new((0, 0, z))))
            continue
        ring = []
        for i in range(ncol):
            a = 2 * math.pi * u_span * i / segments
            rr = rfunc(r, z, a) if rfunc else r
            ring.append(bm.verts.new((rr * math.cos(a), rr * math.sin(a), z)))
        rings.append(("ring", ring))
    for k in range(len(profile) - 1):
        A, B = rings[k], rings[k + 1]
        v0, v1 = L[k] / tot, L[k + 1] / tot
        for i in range(segments):
            j = (i + 1) % ncol if full else i + 1
            u0, u1 = i / segments, (i + 1) / segments
            if A[0] == "pole" and B[0] == "pole":
                continue
            if A[0] == "pole":
                vs, uvs = [A[1], B[1][j], B[1][i]], [((u0 + u1) / 2, v0), (u1, v1), (u0, v1)]
            elif B[0] == "pole":
                vs, uvs = [A[1][i], A[1][j], B[1]], [(u0, v0), (u1, v0), ((u0 + u1) / 2, v1)]
            else:
                vs, uvs = [A[1][i], A[1][j], B[1][j], B[1][i]], [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
            try:
                f = bm.faces.new(vs)
            except ValueError:
                continue
            for loop, (uu, vv) in zip(f.loops, uvs):
                loop[uv].uv = (uu, vv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    link(ob, parent)
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(material)
    smooth_by_angle(ob, smooth)
    return ob


def root(name):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.2
    bpy.context.scene.collection.objects.link(e)
    return e


def rounded_box(name, sx, sy, sz, bevel, material, parent, segments=3):
    """Box centred on X/Y, sitting on z=0, with bevelled edges."""
    bpy.ops.mesh.primitive_cube_add(size=1)
    ob = bpy.context.active_object
    ob.name = name
    ob.data.name = name
    ob.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    ob.location = (0, 0, sz / 2)
    bpy.ops.object.transform_apply(location=True)
    mod = ob.modifiers.new("Bevel", "BEVEL")
    mod.width = bevel
    mod.segments = segments
    mod.limit_method = "ANGLE"
    bpy.ops.object.modifier_apply(modifier=mod.name)
    for p in ob.data.polygons:
        p.use_smooth = True
    smooth_by_angle(ob, 40)
    ob.data.materials.clear()
    ob.data.materials.append(material)
    for c in ob.users_collection:
        c.objects.unlink(ob)
    link(ob, parent)
    return ob


def panel(name, width, height, center, normal_axis, material, parent):
    """Flat UV-mapped quad used to print carton artwork. normal_axis: '-Y' (front) or '+X' (side)."""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    cx, cy, cz = center
    hw, hh = width / 2, height / 2
    if normal_axis == "-Y":
        pts = [(cx - hw, cy, cz - hh), (cx + hw, cy, cz - hh), (cx + hw, cy, cz + hh), (cx - hw, cy, cz + hh)]
    else:  # +X
        pts = [(cx, cy - hw, cz - hh), (cx, cy + hw, cz - hh), (cx, cy + hw, cz + hh), (cx, cy - hw, cz + hh)]
    vs = [bm.verts.new(p) for p in pts]
    f = bm.faces.new(vs)
    for loop, uvc in zip(f.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop[uv].uv = uvc
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    me.materials.append(material)
    link(ob, parent)
    return ob


def build():
    clear_scene()
    M = {
        "AmberGlass": mat("AmberGlass", (0.62, 0.27, 0.05), 0.05, transmission=1, ior=1.52),
        "ClearGlass": mat("ClearGlass", (0.95, 0.97, 0.96), 0.03, transmission=1, ior=1.5),
        "FrostedGlass": mat("FrostedGlass", (0.93, 0.94, 0.93), 0.45, transmission=1, ior=1.5),
        "CapWhite": mat("CapWhite", (0.93, 0.93, 0.91), 0.38),
        "LabelPaper": mat("LabelPaper", (0.96, 0.95, 0.92), 0.55),
        "CapsuleA": mat("CapsuleA", (0.72, 0.33, 0.08), 0.2, coat=0.6),
        "CapsuleB": mat("CapsuleB", (0.94, 0.93, 0.9), 0.22, coat=0.6),
        "Softgel": mat("Softgel", (0.85, 0.55, 0.08), 0.08, transmission=0.85, ior=1.45),
        "Tablet": mat("Tablet", (0.95, 0.95, 0.93), 0.7),
        "Rubber": mat("Rubber", (0.04, 0.04, 0.04), 0.55),
        "Collar": mat("Collar", (0.08, 0.08, 0.08), 0.3, metal=0.0),
        "Liquid": mat("Liquid", (0.9, 0.7, 0.35), 0.02, transmission=1, ior=1.36),
        "JarCap": mat("JarCap", (0.78, 0.62, 0.32), 0.25, metal=1.0),
        "PlasticWhite": mat("PlasticWhite", (0.94, 0.94, 0.92), 0.35),
        "PlasticGrey": mat("PlasticGrey", (0.6, 0.62, 0.62), 0.4),
        "Foil": mat("Foil", (0.8, 0.81, 0.8), 0.28, metal=1.0),
        "PVC": mat("PVC", (0.96, 0.97, 0.97), 0.06, transmission=1, ior=1.45),
        "Carton": mat("Carton", (0.95, 0.95, 0.93), 0.6),
        "CartonPrint": mat("CartonPrint", (1, 1, 1), 0.55),
    }

    # --- Amber pharmacy bottle with child-resistant ribbed cap ---------------
    r = root("rx_bottle")
    body = [(0, 0, 0), (0.20, 0, 0), (0.25, 0, 0.03), (0.25, 0.56, 0.05), (0.13, 0.72, 0.06),
            (0.125, 0.74, 0), (0.125, 0.845, 0.008), (0.11, 0.86, 0), (0, 0.86, 0)]
    lathe("Bottle", fillet(body, 6), M["AmberGlass"], r, segments=96)

    def knurl(rad, z, a):
        if 0.795 < z < 0.945 and rad > 0.165:
            return rad + 0.0045 * (0.5 + 0.5 * math.cos(60 * a)) ** 2
        return rad
    cap = [(0, 0.752), (0.15, 0.752), (0.162, 0.754), (0.168, 0.762), (0.168, 0.79), (0.1681, 0.80),
           (0.1681, 0.87), (0.1681, 0.94), (0.168, 0.95), (0.168, 0.966), (0.164, 0.976), (0.155, 0.981), (0, 0.982)]
    lathe("Cap", cap, M["CapWhite"], r, segments=240, rfunc=knurl, smooth=60)
    lathe("Label", [(0.2515, 0.10), (0.2515, 0.50)], M["LabelPaper"], r, segments=96)

    # --- Two-piece hard capsule (size 0), centred, long axis Z --------------
    c = root("capsule")

    def dome(rad, tip, end, up, n=10):
        pts = []
        for i in range(n + 1):
            t = i / n * math.pi / 2
            pts.append((rad * math.sin(t), tip + (rad - rad * math.cos(t)) * (1 if up else -1)))
        pts.append((rad, end))
        return pts
    lathe("CapsuleBody", dome(0.0366, -0.1085, 0.08, True), M["CapsuleB"], c, segments=40, smooth=80)
    lathe("CapsuleCap", list(reversed(dome(0.0383, 0.1085, -0.004, False))), M["CapsuleA"], c, segments=40, smooth=80)

    # --- Softgel -------------------------------------------------------------
    s = root("softgel")
    prof = []
    for i in range(25):
        z = -0.1 + 0.2 * i / 24
        t = min(1.0, abs(z / 0.1))
        prof.append((0.05 * (1 - t ** 2.4) ** (1 / 2.4), z))
    prof[0] = (0, -0.1); prof[-1] = (0, 0.1)
    lathe("SoftgelShell", prof, M["Softgel"], s, segments=40, smooth=80)

    # --- Round biconvex tablet ----------------------------------------------
    t = root("tablet")
    tprof = [(0, -0.022)]
    for i in range(1, 9):
        a = i / 8
        tprof.append((0.047 * math.sin(a * math.pi / 2), -0.022 + 0.01 * (1 - math.cos(a * math.pi / 2))))
    tprof += [(0.05, -0.009), (0.05, 0.009)]
    for i in range(8, 0, -1):
        a = i / 8
        tprof.append((0.047 * math.sin(a * math.pi / 2), 0.022 - 0.01 * (1 - math.cos(a * math.pi / 2))))
    tprof.append((0, 0.022))
    lathe("TabletBody", tprof, M["Tablet"], t, segments=48, smooth=40)

    # --- 30 ml dropper bottle -------------------------------------------------
    d = root("dropper")
    dbody = [(0, 0, 0), (0.15, 0, 0), (0.165, 0, 0.02), (0.165, 0.42, 0.05), (0.085, 0.50, 0.035),
             (0.08, 0.52, 0), (0.08, 0.575, 0.005), (0.07, 0.585, 0), (0, 0.585, 0)]
    lathe("DropperBottle", fillet(dbody, 6), M["AmberGlass"], d, segments=80)
    lathe("DropperLiquid", fillet([(0, 0.012, 0), (0.15, 0.012, 0.015), (0.152, 0.34, 0), (0, 0.34, 0)], 4),
          M["Liquid"], d, segments=64)
    lathe("Pipette", [(0, 0.07), (0.012, 0.075), (0.016, 0.1), (0.016, 0.57), (0, 0.57)], M["ClearGlass"], d, segments=24)
    lathe("DropperCollar", fillet([(0, 0.555, 0), (0.092, 0.555, 0), (0.096, 0.565, 0.006), (0.096, 0.655, 0.006),
                                   (0.088, 0.662, 0), (0, 0.662, 0)], 3), M["Collar"], d, segments=64)
    bulb = [(0, 0.66), (0.055, 0.66), (0.059, 0.672), (0.059, 0.69), (0.052, 0.705), (0.047, 0.74),
            (0.047, 0.8), (0.049, 0.86), (0.046, 0.9), (0.038, 0.93), (0.024, 0.947), (0, 0.952)]
    lathe("DropperBulb", bulb, M["Rubber"], d, segments=48, smooth=50)
    lathe("Label", [(0.1665, 0.07), (0.1665, 0.36)], M["LabelPaper"], d, segments=80)

    # --- Cosmetic jar -----------------------------------------------------------
    j = root("jar")
    jbody = [(0, 0, 0), (0.30, 0, 0.03), (0.30, 0.27, 0.02), (0.272, 0.29, 0), (0.272, 0.33, 0.004), (0.255, 0.335, 0), (0, 0.335, 0)]
    lathe("JarBody", fillet(jbody, 5), M["FrostedGlass"], j, segments=96)
    jcap = [(0, 0.288, 0), (0.305, 0.288, 0), (0.312, 0.30, 0.01), (0.312, 0.43, 0.016), (0.29, 0.446, 0), (0, 0.446, 0)]
    lathe("JarLid", fillet(jcap, 5), M["JarCap"], j, segments=96)
    lathe("Label", [(0.3015, 0.05), (0.3015, 0.245)], M["LabelPaper"], j, segments=96)

    # --- Pump spray bottle --------------------------------------------------------
    sp = root("spray")
    sbody = [(0, 0, 0), (0.165, 0, 0.02), (0.165, 0.58, 0.06), (0.07, 0.66, 0.02), (0.065, 0.68, 0), (0, 0.68, 0)]
    lathe("SprayBottle", fillet(sbody, 6), M["PlasticWhite"], sp, segments=80)
    lathe("SprayCollar", fillet([(0, 0.66, 0), (0.08, 0.66, 0), (0.085, 0.67, 0.004), (0.085, 0.72, 0.004), (0.078, 0.726, 0), (0, 0.726, 0)], 3),
          M["PlasticGrey"], sp, segments=64)
    lathe("SprayActuator", fillet([(0, 0.722, 0), (0.055, 0.722, 0), (0.058, 0.73, 0.004), (0.058, 0.835, 0.012), (0.045, 0.852, 0), (0, 0.852, 0)], 4),
          M["PlasticWhite"], sp, segments=64)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.011, depth=0.03, vertices=24, location=(0, -0.066, 0.80), rotation=(math.radians(90), 0, 0))
    nz = bpy.context.active_object
    nz.name = "SprayNozzle"
    nz.data.materials.append(M["PlasticGrey"])
    for cc in nz.users_collection:
        cc.objects.unlink(nz)
    link(nz, sp)
    lathe("Label", [(0.1665, 0.06), (0.1665, 0.48)], M["LabelPaper"], sp, segments=80)

    # --- Blister strip (2 x 5 tablets), lying flat ----------------------------
    b = root("blister")
    W, H = 0.95, 0.48
    card = rounded_box("BlisterFoil", W, H, 0.006, 0.02, M["Foil"], b, segments=4)
    # planar UVs for printed foil (x -> u, y -> v)
    me = card.data
    if not me.uv_layers:
        me.uv_layers.new(name="UVMap")
    uvl = me.uv_layers.active.data
    for poly in me.polygons:
        for li in poly.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            uvl[li].uv = ((co.x + W / 2) / W, (co.y + H / 2) / H)
    for ix in range(5):
        for iy in range(2):
            x = -W / 2 + 0.11 + ix * (W - 0.22) / 4
            y = -H / 2 + 0.13 + iy * (H - 0.26)
            prof = [(0, 0.044)]
            for k in range(1, 13):
                a = k / 12 * math.pi / 2
                prof.append((0.072 * math.sin(a) ** 0.85, 0.044 * math.cos(a) ** 0.7 + 0.006))
            prof.append((0.078, 0.006))
            dob = lathe(f"Cavity_{ix}_{iy}", prof, M["PVC"], b, segments=40, smooth=70)
            dob.location = (x, y, 0)
            tab = lathe(f"BlisterTablet_{ix}_{iy}", [(p[0] * 0.9, p[1] * 0.9 + 0.022 + 0.006) for p in tprof], M["Tablet"], b, segments=40, smooth=40)
            tab.location = (x, y, 0)

    # --- Medicine carton ----------------------------------------------------------
    ct = root("carton")
    CW, CD, CH = 0.56, 0.24, 0.95
    rounded_box("CartonBox", CW, CD, CH, 0.006, M["Carton"], ct, segments=2)
    panel("CartonFront", CW - 0.012, CH - 0.012, (0, -CD / 2 - 0.0008, CH / 2), "-Y", M["CartonPrint"], ct)
    panel("CartonSide", CD - 0.012, CH - 0.012, (CW / 2 + 0.0008, 0, CH / 2), "+X", M["CartonPrint"], ct)

    # lay out for preview only; the site resets each root to the origin
    for i, name in enumerate(["rx_bottle", "dropper", "jar", "spray", "carton", "blister", "capsule", "softgel", "tablet"]):
        bpy.data.objects[name].location = (i * 0.75 - 3.0, 0, 0)


def export(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for o in bpy.context.selected_objects:
        o.select_set(False)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_texcoords=True,
        export_normals=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        use_selection=False,
        # meshopt keeps the download small; the site's GLTF loader decodes it natively
        export_meshopt_compression_enable=True,
    )
    return os.path.getsize(path)


build()
size = export(os.path.abspath(OUT))
result = {"exported": os.path.abspath(OUT), "bytes": size, "objects": len(bpy.data.objects)}
print(result)
