var ye = Object.defineProperty;
var we = (t, i, e) => i in t ? ye(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var y = (t, i, e) => (we(t, typeof i != "symbol" ? i + "" : i, e), e);
import { ShaderLib as _e, UniformsUtils as Me, MeshDepthMaterial as Te, RGBADepthPacking as De, MeshDistanceMaterial as Ae, ShaderChunk as be, InstancedMesh as Ue, MeshBasicMaterial as Fe, InstancedBufferAttribute as Se, DataTexture as Q, RGBAFormat as L, FloatType as C, NearestFilter as b, ClampToEdgeWrapping as k, RepeatWrapping as q, Vector2 as $, Vector4 as he, BufferGeometry as ee, BufferAttribute as R, OrthographicCamera as Pe, Mesh as Re, Float32BufferAttribute as ie, ShaderMaterial as Ve, WebGLRenderTarget as Ce, PlaneGeometry as Ie, REVISION as ne, ImageLoader as Oe, Texture as Ee, CanvasTexture as re, SRGBColorSpace as se } from "three";
const pe = /\bvoid\s+main\s*\(\s*\)\s*{/g;
function j(t) {
  const i = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function e(n, r) {
    let s = be[r];
    return s ? j(s) : n;
  }
  return t.replace(i, e);
}
const T = [];
for (let t = 0; t < 256; t++)
  T[t] = (t < 16 ? "0" : "") + t.toString(16);
function $e() {
  const t = Math.random() * 4294967295 | 0, i = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (T[t & 255] + T[t >> 8 & 255] + T[t >> 16 & 255] + T[t >> 24 & 255] + "-" + T[i & 255] + T[i >> 8 & 255] + "-" + T[i >> 16 & 15 | 64] + T[i >> 24 & 255] + "-" + T[e & 63 | 128] + T[e >> 8 & 255] + "-" + T[e >> 16 & 255] + T[e >> 24 & 255] + T[n & 255] + T[n >> 8 & 255] + T[n >> 16 & 255] + T[n >> 24 & 255]).toUpperCase();
}
const U = Object.assign || function() {
  let t = arguments[0];
  for (let i = 1, e = arguments.length; i < e; i++) {
    let n = arguments[i];
    if (n)
      for (let r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
  }
  return t;
}, ze = Date.now(), ae = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new Map();
let He = 1e10;
function N(t, i) {
  const e = Ge(i);
  let n = ae.get(t);
  if (n || ae.set(t, n = /* @__PURE__ */ Object.create(null)), n[e])
    return new n[e]();
  const r = `_onBeforeCompile${e}`, s = function(o, h) {
    t.onBeforeCompile.call(this, o, h);
    const g = this.customProgramCacheKey() + "|" + o.vertexShader + "|" + o.fragmentShader;
    let c = oe[g];
    if (!c) {
      const f = Le(this, o, i, e);
      c = oe[g] = f;
    }
    o.vertexShader = c.vertexShader, o.fragmentShader = c.fragmentShader, U(o.uniforms, this.uniforms), i.timeUniform && (o.uniforms[i.timeUniform] = {
      get value() {
        return Date.now() - ze;
      }
    }), this[r] && this[r](o);
  }, a = function() {
    return l(i.chained ? t : t.clone());
  }, l = function(o) {
    const h = Object.create(o, u);
    return Object.defineProperty(h, "baseMaterial", { value: t }), Object.defineProperty(h, "id", { value: He++ }), h.uuid = $e(), h.uniforms = U({}, o.uniforms, i.uniforms), h.defines = U({}, o.defines, i.defines), h.defines[`TROIKA_DERIVED_MATERIAL_${e}`] = "", h.extensions = U({}, o.extensions, i.extensions), h._listeners = void 0, h;
  }, u = {
    constructor: { value: a },
    isDerivedMaterial: { value: !0 },
    type: {
      get: () => t.type,
      set: (o) => {
        t.type = o;
      }
    },
    isDerivedFrom: {
      writable: !0,
      configurable: !0,
      value: function(o) {
        const h = this.baseMaterial;
        return o === h || h.isDerivedMaterial && h.isDerivedFrom(o) || !1;
      }
    },
    customProgramCacheKey: {
      writable: !0,
      configurable: !0,
      value: function() {
        return t.customProgramCacheKey() + "|" + e;
      }
    },
    onBeforeCompile: {
      get() {
        return s;
      },
      set(o) {
        this[r] = o;
      }
    },
    copy: {
      writable: !0,
      configurable: !0,
      value: function(o) {
        return t.copy.call(this, o), !t.isShaderMaterial && !t.isDerivedMaterial && (U(this.extensions, o.extensions), U(this.defines, o.defines), U(this.uniforms, Me.clone(o.uniforms))), this;
      }
    },
    clone: {
      writable: !0,
      configurable: !0,
      value: function() {
        const o = new t.constructor();
        return l(o).copy(this);
      }
    },
    /**
     * Utility to get a MeshDepthMaterial that will honor this derived material's vertex
     * transformations and discarded fragments.
     */
    getDepthMaterial: {
      writable: !0,
      configurable: !0,
      value: function() {
        let o = this._depthMaterial;
        return o || (o = this._depthMaterial = N(
          t.isDerivedMaterial ? t.getDepthMaterial() : new Te({ depthPacking: De }),
          i
        ), o.defines.IS_DEPTH_MATERIAL = "", o.uniforms = this.uniforms), o;
      }
    },
    /**
     * Utility to get a MeshDistanceMaterial that will honor this derived material's vertex
     * transformations and discarded fragments.
     */
    getDistanceMaterial: {
      writable: !0,
      configurable: !0,
      value: function() {
        let o = this._distanceMaterial;
        return o || (o = this._distanceMaterial = N(
          t.isDerivedMaterial ? t.getDistanceMaterial() : new Ae(),
          i
        ), o.defines.IS_DISTANCE_MATERIAL = "", o.uniforms = this.uniforms), o;
      }
    },
    dispose: {
      writable: !0,
      configurable: !0,
      value() {
        const { _depthMaterial: o, _distanceMaterial: h } = this;
        o && o.dispose(), h && h.dispose(), t.dispose.call(this);
      }
    }
  };
  return n[e] = a, new a();
}
function Le(t, { vertexShader: i, fragmentShader: e }, n, r) {
  let {
    vertexDefs: s,
    vertexMainIntro: a,
    vertexMainOutro: l,
    vertexTransform: u,
    fragmentDefs: o,
    fragmentMainIntro: h,
    fragmentMainOutro: g,
    fragmentColorTransform: c,
    customRewriter: f,
    timeUniform: m
  } = n;
  if (s = s || "", a = a || "", l = l || "", o = o || "", h = h || "", g = g || "", (u || f) && (i = j(i)), (c || f) && (e = e.replace(
    /^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,
    `
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`
  ), e = j(e)), f) {
    let p = f({ vertexShader: i, fragmentShader: e });
    i = p.vertexShader, e = p.fragmentShader;
  }
  if (c) {
    let p = [];
    e = e.replace(
      /^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,
      // [^]+? = non-greedy match of any chars including newlines
      (d) => (p.push(d), "")
    ), g = `${c}
${p.join(`
`)}
${g}`;
  }
  if (m) {
    const p = `
uniform float ${m};
`;
    s = p + s, o = p + o;
  }
  return u && (i = `vec3 troika_position_${r};
vec3 troika_normal_${r};
vec2 troika_uv_${r};
${i}
`, s = `${s}
void troikaVertexTransform${r}(inout vec3 position, inout vec3 normal, inout vec2 uv) {
  ${u}
}
`, a = `
troika_position_${r} = vec3(position);
troika_normal_${r} = vec3(normal);
troika_uv_${r} = vec2(uv);
troikaVertexTransform${r}(troika_position_${r}, troika_normal_${r}, troika_uv_${r});
${a}
`, i = i.replace(/\b(position|normal|uv)\b/g, (p, d, w, _) => /\battribute\s+vec[23]\s+$/.test(_.substr(0, w)) ? d : `troika_${d}_${r}`), t.map && t.map.channel > 0 || (i = i.replace(/\bMAP_UV\b/g, `troika_uv_${r}`))), i = le(i, r, s, a, l), e = le(e, r, o, h, g), {
    vertexShader: i,
    fragmentShader: e
  };
}
function le(t, i, e, n, r) {
  return (n || r || e) && (t = t.replace(
    pe,
    `
${e}
void troikaOrigMain${i}() {`
  ), t += `
void main() {
  ${n}
  troikaOrigMain${i}();
  ${r}
}`), t;
}
function ke(t, i) {
  return t === "uniforms" ? void 0 : typeof i == "function" ? i.toString() : i;
}
let Ne = 0;
const ue = /* @__PURE__ */ new Map();
function Ge(t) {
  const i = JSON.stringify(t, ke);
  let e = ue.get(i);
  return e == null && ue.set(i, e = ++Ne), e;
}
const Ze = {
  MeshDepthMaterial: "depth",
  MeshDistanceMaterial: "distanceRGBA",
  MeshNormalMaterial: "normal",
  MeshBasicMaterial: "basic",
  MeshLambertMaterial: "lambert",
  MeshPhongMaterial: "phong",
  MeshToonMaterial: "toon",
  MeshStandardMaterial: "physical",
  MeshPhysicalMaterial: "physical",
  MeshMatcapMaterial: "matcap",
  LineBasicMaterial: "basic",
  LineDashedMaterial: "dashed",
  PointsMaterial: "points",
  ShadowMaterial: "shadow",
  SpriteMaterial: "sprite"
};
function Be(t) {
  let i = Ze[t.type];
  return i ? _e[i] : t;
}
function ce(t) {
  let i = /\buniform\s+(int|float|vec[234]|mat[34])\s+([A-Za-z_][\w]*)/g, e = /* @__PURE__ */ Object.create(null), n;
  for (; (n = i.exec(t)) !== null; )
    e[n[2]] = n[1];
  return e;
}
function Ke(t) {
  let i = [], e = "";
  const n = N(t, {
    chained: !0,
    customRewriter({ vertexShader: s, fragmentShader: a }) {
      let l = [], u = [], o = [], h = ce(s), g = ce(a);
      return i.forEach((c) => {
        let f = h[c], m = g[c];
        const p = f || m;
        if (p) {
          const d = new RegExp(`\\buniform\\s+${p}\\s+${c}\\s*;`, "g"), w = new RegExp(`\\b${c}\\b`, "g"), _ = `troika_attr_${c}`, x = `troika_vary_${c}`;
          if (l.push(`attribute ${p} ${_};`), f && (s = s.replace(d, ""), s = s.replace(w, _)), m) {
            a = a.replace(d, ""), a = a.replace(w, x);
            let v = `varying ${m} ${x};`;
            l.push(v), o.push(v), u.push(`${x} = ${_};`);
          }
        }
      }), s = `${l.join(`
`)}
${s.replace(pe, `
$&
${u.join(`
`)}`)}`, o.length && (a = `${o.join(`
`)}
${a}`), { vertexShader: s, fragmentShader: a };
    }
  });
  n.setUniformNames = function(s) {
    i = s || [];
    const a = i.sort().join("|");
    a !== e && (e = a, this.needsUpdate = !0);
  };
  const r = n.customProgramCacheKey();
  return n.customProgramCacheKey = function() {
    return r + "|" + e;
  }, n.isInstancedUniformsMaterial = !0, n;
}
class je extends Ue {
  constructor(i, e, n) {
    super(i, e, n), this._maxCount = n, this._instancedUniformNames = [];
  }
  /*
   * Getter/setter for automatically wrapping the user-supplied geometry with one that will
   * carry our extra InstancedBufferAttribute(s). We do the wrapping lazily on _read_ rather
   * than write to avoid unnecessary wrapping on transient values.
   */
  get geometry() {
    let i = this._derivedGeometry;
    const e = this._baseGeometry;
    return (!i || i.baseGeometry !== e) && (i = this._derivedGeometry = Object.create(e), i.baseGeometry = e, i.attributes = Object.create(e.attributes), e.addEventListener("dispose", function n() {
      e.removeEventListener("dispose", n), i.dispose();
    })), i;
  }
  set geometry(i) {
    this._baseGeometry = i;
  }
  /*
   * Getter/setter for automatically wrapping the user-supplied material with our upgrades. We do the
   * wrapping lazily on _read_ rather than write to avoid unnecessary wrapping on transient values.
   */
  get material() {
    let i = this._derivedMaterial;
    const e = this._baseMaterial || this._defaultMaterial || (this._defaultMaterial = new Fe());
    return (!i || i.baseMaterial !== e) && (i = this._derivedMaterial = Ke(e), e.addEventListener("dispose", function n() {
      e.removeEventListener("dispose", n), i.dispose();
    })), i.setUniformNames(this._instancedUniformNames), i;
  }
  set material(i) {
    if (Array.isArray(i))
      throw new Error("InstancedUniformsMesh does not support multiple materials");
    for (; i && i.isInstancedUniformsMaterial; )
      i = i.baseMaterial;
    this._baseMaterial = i;
  }
  get customDepthMaterial() {
    return this.material.getDepthMaterial();
  }
  set customDepthMaterial(i) {
  }
  get customDistanceMaterial() {
    return this.material.getDistanceMaterial();
  }
  set customDistanceMaterial(i) {
  }
  /**
   * Set the value of a shader uniform for a single instance.
   * @param {string} name - the name of the shader uniform
   * @param {number} index - the index of the instance to set the value for
   * @param {number|Vector2|Vector3|Vector4|Color|Array|Matrix3|Matrix4|Quaternion} value - the uniform value for this instance
   */
  setUniformAt(i, e, n) {
    const r = this.geometry.attributes, s = `troika_attr_${i}`;
    let a = r[s];
    if (!a) {
      const l = We(this._baseMaterial, i), u = Ye(l);
      if (a = r[s] = new Se(new Float32Array(u * this._maxCount), u), l !== null)
        for (let o = 0; o < this._maxCount; o++)
          fe(a, o, l);
      this._instancedUniformNames = [...this._instancedUniformNames, i];
    }
    fe(a, e, n), a.needsUpdate = !0;
  }
  /**
   * Unset all instance-specific values for a given uniform, reverting back to the original
   * uniform value for all.
   * @param {string} name
   */
  unsetUniform(i) {
    this.geometry.deleteAttribute(`troika_attr_${i}`), this._instancedUniformNames = this._instancedUniformNames.filter((e) => e !== i);
  }
}
function fe(t, i, e) {
  let n = t.itemSize;
  n === 1 ? t.setX(i, e) : n === 2 ? t.setXY(i, e.x, e.y) : n === 3 ? e.isColor ? t.setXYZ(i, e.r, e.g, e.b) : t.setXYZ(i, e.x, e.y, e.z) : n === 4 ? t.setXYZW(i, e.x, e.y, e.z, e.w) : e.toArray ? e.toArray(t.array, i * n) : t.set(e, i * n);
}
function We(t, i) {
  let e = t.uniforms;
  return e && e[i] || (e = Be(t).uniforms, e && e[i]) ? e[i].value : null;
}
function Ye(t) {
  return t == null ? 0 : typeof t == "number" ? 1 : t.isVector2 ? 2 : t.isVector3 || t.isColor ? 3 : t.isVector4 || t.isQuaternion ? 4 : t.elements ? t.elements.length : Array.isArray(t) ? t.length : 0;
}
const Xe = (t, i) => {
  const e = t.split(`
`), n = /vMapUv|vAlphaMapUv|vNormalMapUv/g;
  return e.map((s) => !s.includes("varying") && !s.includes("uniform") ? s.replace(n, i) : s).join(`
`);
}, Je = (t, i) => {
  const e = {
    USE_UV: ""
  };
  return i && (e.TRI_GEOMETRY = ""), N(t, {
    defines: e,
    uniforms: {
      /** GPGPU animation driven data */
      animationData: { value: null },
      animationDataSize: { value: 0 },
      /* Repeat animation in a loop */
      billboarding: { value: 0 },
      /** flip uvs on x */
      flipX: { value: 0 },
      /** flip uvs on y */
      flipY: { value: 0 },
      /**
       * DataArrayTexture - data stored in columns. Rows are:
       * 0 - Frames declaration - RGBA[x,y,w,h]
       * 1 - Animation lengths RGBA[length,0,0,0]
       * 2 - Animation0 - RGBA [id,duration, 0,0]
       * 3 - Animation1 - RGBA [id,duration, 0,0]
       * ....etc
       */
      spritesheetData: { value: null },
      /**util for reading data texture in spritesheetData */
      dataSize: { value: new $(0, 0) },
      /**
       * Tinting - Vector4 (enabled 0/1, H (0-3), S (0-1), V(0-1))
       */
      tint: { value: new he(0, 0, 0, 0) }
    },
    /**
     *
     * VERTEX
     * - billboarding
     *
     * */
    vertexDefs: (
      /*glsl*/
      `
    uniform float billboarding;
    flat varying int vId;
    `
    ),
    vertexMainOutro: (
      /*glsl*/
      `
    vId = gl_InstanceID;
    if(billboarding == 1.){
      vec3 instancePosition = vec3(instanceMatrix[3]);
      vec3 instanceScale = vec3(length(instanceMatrix[0]), length(instanceMatrix[1]), length(instanceMatrix[2]));

      vec3 cameraRight_worldspace = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
      vec3 cameraUp_worldspace = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);

      vec3 vertexPosition_worldspace = instancePosition
        + cameraRight_worldspace * position.x * instanceScale.x
        + cameraUp_worldspace * position.y * instanceScale.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition_worldspace, 1.0);
    }
    `
    ),
    /**
     *
     * FRAGMENT REWRITER
     *
     * */
    customRewriter: ({ vertexShader: r, fragmentShader: s }) => {
      const a = (
        /*glsl*/
        `
			uniform sampler2D animationData;
      uniform int animationDataSize;
			uniform sampler2D spritesheetData;
      uniform float startTime;
			uniform float time;
			uniform float flipX;
			uniform float flipY;
			uniform vec2 dataSize;
      uniform vec4 tint;

      flat varying int vId;
			`
      ), l = (
        /*glsl*/
        `
			vec4 readData(float col, float row) {
				float wStep = 1.f / dataSize.x;
				float wHalfStep = wStep * 0.5f;
				float hStep = 1.f / dataSize.y;
				float hHalfStep = 1.f / dataSize.y * 0.5f;
				return texture2D(spritesheetData, vec2(col * wStep + wHalfStep, row * hStep + hHalfStep));
			}

      vec2 zoomUV(vec2 uv, vec2 zoomCenter, float zoomFactor) {
        // Shift UVs so that the zoom center is the origin
        vec2 shiftedUV = uv - zoomCenter;

        // Scale (zoom) the UV coordinates
        shiftedUV *= zoomFactor;

        // Shift back
        shiftedUV += zoomCenter;

        return shiftedUV;
    }
			`
      ), u = (
        /*glsl*/
        `
      float y = float(vId / animationDataSize) / float(animationDataSize);
      float x = mod(float(vId),float(animationDataSize)) / float(animationDataSize);

      float spritesheetFrameId = texture2D(animationData, vec2(x,y)).r;

			// x,y,w,h
			vec4 frameMeta = readData(spritesheetFrameId, 0.f);

			vec2 fSize = frameMeta.zw;
			vec2 fOffset = vec2(frameMeta.xy);

      vec2 transformedPlaneUv = vUv + vec2(0.,0.);

      // todo  == 1. caused a flickering bug. look into Precision/interpolation?
      if(flipX > 0.){
        transformedPlaneUv.x = 1. - transformedPlaneUv.x;
      }
      if(flipY > 0.){
        transformedPlaneUv.y = 1. - transformedPlaneUv.y;
      }

			vec2 spriteUv = fSize * transformedPlaneUv + fOffset ;

      #ifdef TRI_GEOMETRY
        // Shift UVs if mesh uses triangle geometry
        // TODO optimize ugly math
        if(vUv.y>0.5 || vUv.x<0.25 || vUv.x>0.75){
          discard;
        }

        vec2 zoomCenter = vec2(fSize.x * 0.5,0.) + fOffset;
        float zoomFactor = 2.;
        vec2 shiftedUV = spriteUv - zoomCenter;
        shiftedUV *= zoomFactor;
        shiftedUV += zoomCenter;
        spriteUv = shiftedUV;
      #endif



			`
      );
      return s = s.replace(
        "void main() {",
        `void main() {${u}`
      ), s = `
			${a}
			${l}
			${s}
			`, s = s.replace(
        "vec4 sampledDiffuseColor = texture2D( map, vMapUv );",
        /*glsl*/
        `
        vec4 sampledDiffuseColor = texture2D( map, vMapUv );
        if(tint.w == 1.){
          vec3 hue_term = 1.0 - min(abs(vec3(tint.x) - vec3(0,2.0,1.0)), 1.0);
          hue_term.x = 1.0 - dot(hue_term.yz, vec2(1));
          vec3 res = vec3(dot(sampledDiffuseColor.xyz, hue_term.xyz), dot(sampledDiffuseColor.xyz, hue_term.zxy), dot(sampledDiffuseColor.xyz, hue_term.yzx));
          res = mix(vec3(dot(res, vec3(0.2, 0.5, 0.3))), res, tint.y);
          res = res * tint.z;

          sampledDiffuseColor = vec4(res, sampledDiffuseColor.a);
        }

        // sampledDiffuseColor = vec4(texture2D(animationData, vUv).rgb, 1.);
      `
      ), s = Xe(s, "spriteUv"), { vertexShader: r, fragmentShader: s };
    }
  });
}, Yt = (t) => {
  const i = [], e = [], n = {}, r = [], s = t.meta.size.w, a = t.meta.size.h, l = [
    t.meta.size.w,
    t.meta.size.h
  ];
  for (const u in t.frames) {
    const o = t.frames[u];
    i.push([o.frame.x / s, o.frame.y / a, o.frame.w / s, o.frame.h / a]), e.push(o.duration);
  }
  for (const u of t.meta.frameTags) {
    n[u.name] = [];
    for (let o = u.from; o <= u.to; o++)
      n[u.name].push([o, e[o]]);
    r.push(n[u.name].length);
  }
  return { frames: i, animations: n, sheetSize: l, animationLengths: r };
}, Qe = (t) => {
  const { frames: i, animationLengths: e, animations: n } = t, r = Math.max(
    i.length,
    e.length,
    ...Object.values(n).map((f) => f.length)
  ), s = 2 + Object.values(n).length, a = i.flat().concat(new Array((r - i.length) * 4).fill(0)), l = e.map((f) => [f, 0, 0, 0]).flat().concat(new Array((r - e.length) * 4).fill(0)), u = [], o = /* @__PURE__ */ new Map();
  for (let f = 0; f < Object.keys(n).length; f++) {
    const m = Object.keys(n)[f];
    o.set(m, f);
    const p = n[m].map((d) => [...d, 0, 0]).flat().concat(new Array((r - n[m].length) * 4).fill(0));
    u.push(...p);
  }
  const h = [
    ...a,
    ...l,
    ...u
  ], g = new Float32Array(h);
  g.set(h);
  const c = new Q(
    g,
    r,
    s,
    L,
    C
  );
  return c.type = C, c.minFilter = b, c.magFilter = b, c.wrapS = k, c.wrapT = q, c.needsUpdate = !0, { dataTexture: c, dataWidth: r, dataHeight: s, animMap: o };
}, qe = () => {
  const t = new ee(), i = new Float32Array([
    // top
    0,
    1,
    0,
    // bot-left
    -1,
    -1,
    0,
    // bot-right
    1,
    -1,
    0
  ]);
  t.setAttribute("position", new R(i, 3));
  const e = new Float32Array([
    // top
    0.5,
    1,
    // bot-left
    0,
    0,
    // bot-right
    1,
    0
  ]);
  return t.setAttribute("uv", new R(e, 2)), t.computeVertexNormals(), t;
}, et = new Pe(-1, 1, 1, -1, 0, 1);
class tt extends ee {
  constructor() {
    super(), this.setAttribute("position", new ie([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new ie([0, 2, 0, 0, 2, 0], 2));
  }
}
const it = new tt();
class nt {
  constructor(i) {
    this._mesh = new Re(it, i);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(i) {
    i.render(this._mesh, et);
  }
  get material() {
    return this._mesh.material;
  }
  set material(i) {
    this._mesh.material = i;
  }
}
class rt {
  constructor(i, e, n) {
    this.variables = [], this.currentTextureIndex = 0;
    let r = C;
    const s = {
      passThruTexture: { value: null }
    }, a = o(g(), s), l = new nt(a);
    this.setDataType = function(c) {
      return r = c, this;
    }, this.addVariable = function(c, f, m) {
      const p = this.createShaderMaterial(f), d = {
        name: c,
        initialValueTexture: m,
        material: p,
        dependencies: null,
        renderTargets: [],
        wrapS: null,
        wrapT: null,
        minFilter: b,
        magFilter: b
      };
      return this.variables.push(d), d;
    }, this.setVariableDependencies = function(c, f) {
      c.dependencies = f;
    }, this.init = function() {
      if (n.capabilities.maxVertexTextures === 0)
        return "No support for vertex shader textures.";
      for (let c = 0; c < this.variables.length; c++) {
        const f = this.variables[c];
        f.renderTargets[0] = this.createRenderTarget(i, e, f.wrapS, f.wrapT, f.minFilter, f.magFilter), f.renderTargets[1] = this.createRenderTarget(i, e, f.wrapS, f.wrapT, f.minFilter, f.magFilter), this.renderTexture(f.initialValueTexture, f.renderTargets[0]), this.renderTexture(f.initialValueTexture, f.renderTargets[1]);
        const m = f.material, p = m.uniforms;
        if (f.dependencies !== null)
          for (let d = 0; d < f.dependencies.length; d++) {
            const w = f.dependencies[d];
            if (w.name !== f.name) {
              let _ = !1;
              for (let x = 0; x < this.variables.length; x++)
                if (w.name === this.variables[x].name) {
                  _ = !0;
                  break;
                }
              if (!_)
                return "Variable dependency not found. Variable=" + f.name + ", dependency=" + w.name;
            }
            p[w.name] = { value: null }, m.fragmentShader = `
uniform sampler2D ` + w.name + `;
` + m.fragmentShader;
          }
      }
      return this.currentTextureIndex = 0, null;
    }, this.compute = function() {
      const c = this.currentTextureIndex, f = this.currentTextureIndex === 0 ? 1 : 0;
      for (let m = 0, p = this.variables.length; m < p; m++) {
        const d = this.variables[m];
        if (d.dependencies !== null) {
          const w = d.material.uniforms;
          for (let _ = 0, x = d.dependencies.length; _ < x; _++) {
            const v = d.dependencies[_];
            w[v.name].value = v.renderTargets[c].texture;
          }
        }
        this.doRenderTarget(d.material, d.renderTargets[f]);
      }
      this.currentTextureIndex = f;
    }, this.getCurrentRenderTarget = function(c) {
      return c.renderTargets[this.currentTextureIndex];
    }, this.getAlternateRenderTarget = function(c) {
      return c.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    }, this.dispose = function() {
      l.dispose();
      const c = this.variables;
      for (let f = 0; f < c.length; f++) {
        const m = c[f];
        m.initialValueTexture && m.initialValueTexture.dispose();
        const p = m.renderTargets;
        for (let d = 0; d < p.length; d++)
          p[d].dispose();
      }
    };
    function u(c) {
      c.defines.resolution = "vec2( " + i.toFixed(1) + ", " + e.toFixed(1) + " )";
    }
    this.addResolutionDefine = u;
    function o(c, f) {
      f = f || {};
      const m = new Ve({
        name: "GPUComputationShader",
        uniforms: f,
        vertexShader: h(),
        fragmentShader: c
      });
      return u(m), m;
    }
    this.createShaderMaterial = o, this.createRenderTarget = function(c, f, m, p, d, w) {
      return c = c || i, f = f || e, m = m || k, p = p || k, d = d || b, w = w || b, new Ce(c, f, {
        wrapS: m,
        wrapT: p,
        minFilter: d,
        magFilter: w,
        format: L,
        type: r,
        depthBuffer: !1
      });
    }, this.createTexture = function() {
      const c = new Float32Array(i * e * 4), f = new Q(c, i, e, L, C);
      return f.needsUpdate = !0, f;
    }, this.renderTexture = function(c, f) {
      s.passThruTexture.value = c, this.doRenderTarget(a, f), s.passThruTexture.value = null;
    }, this.doRenderTarget = function(c, f) {
      const m = n.getRenderTarget(), p = n.xr.enabled, d = n.shadowMap.autoUpdate;
      n.xr.enabled = !1, n.shadowMap.autoUpdate = !1, l.material = c, n.setRenderTarget(f), l.render(n), l.material = a, n.xr.enabled = p, n.shadowMap.autoUpdate = d, n.setRenderTarget(m);
    };
    function h() {
      return `void main()	{

	gl_Position = vec4( position, 1.0 );

}
`;
    }
    function g() {
      return `uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`;
    }
  }
}
const st = (
  /*glsl*/
  `
  #include <common>
  uniform sampler2D instructionsTexture;

  uniform sampler2D spritesheetData;
  uniform vec2 dataSize;
  uniform float fps;
  uniform float deltaTime;

  // read spritesheet metadata
  vec4 readData(float col, float row, sampler2D tex) {
    float wStep = 1.f / dataSize.x;
    float wHalfStep = wStep * 0.5f;
    float hStep = 1.f / dataSize.y;
    float hHalfStep = 1.f / dataSize.y * 0.5f;
    return texture2D(spritesheetData, vec2(col * wStep + wHalfStep, row * hStep + hHalfStep));
  }



  void main()	{

    // OUTPUT FROM THIS SHADER
    // progressValue.r - picked animation frame
    // progressValue.g - previous progress state (for pause, reverse & pingpong consistency)
    // progressValue.b - not used yet
    // progressValue.a - previous animationID

    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;


    vec4 progressValue = texture2D( progress, uv );

    vec4 instructions = texture2D( instructionsTexture, uv);

    // FREEZE FRAME - return to save calculations?
    if(instructions.a >=10.){
      progressValue.r = instructions.a - 10.;
      progressValue.a = instructions.x;
      progressValue.g = progressValue.g;
      gl_FragColor = progressValue;
      return;
    }


    progressValue.b = 0.;

    // todo shouldn't be rounding here, pick
    float animationId = round(instructions.x);

    float offset = instructions.g;

    float animLength = readData(animationId, 1.f, spritesheetData).r;
    float totalTime = animLength / fps;

    // new delta is % of animation
    float newProgress = deltaTime / totalTime;
    // add new delta to saved progress
    float frameTimedId = mod(progressValue.g + newProgress, 1.);
    // frameTimedId = 0.;
    // float frameTimedId = progressValue.g;
    // save for use in next frame



    float playMode = mod(instructions.b, 10.);

    // forward
    if(playMode == 0.){
      frameTimedId = progressValue.g + newProgress;
    }
    // reverse
    if(playMode == 1.){
      frameTimedId = progressValue.g - newProgress;
    }
    // 2 - pause - do nothing
    if(playMode == 2.){
      frameTimedId = progressValue.g;
    }

    // //todo pingpong
    // if(playMode == 3.){
    // }

    // loop (play once over 10.)
    if(instructions.b < 10.){
      frameTimedId = mod(frameTimedId, 1.);
    }

    // todo This could be optional and user would reset manually,
    // todo allowing for consistent movement across multiple animations
    // todo for example - running steps being syncec
    // start anim from beginning if animationID changes
    if(progressValue.a != instructions.x){
      frameTimedId = 0.;
    }

    float frameId = floor(animLength * frameTimedId);
    float spritesheetFrameId = readData(frameId, 2.f + animationId, spritesheetData).r;



    // Picked sprite frame that goes to material
    progressValue.r = spritesheetFrameId;

    progressValue.a = instructions.x;
    progressValue.g = frameTimedId;

    gl_FragColor = progressValue;
  }
`
), at = (t = 512) => {
  const i = new Float32Array(t ** 2 * 4);
  for (let n = 0; n < t ** 2 * 4; n++)
    i[n] = 0;
  const e = new Q(
    i,
    t,
    t,
    L,
    C
  );
  return e.minFilter = b, e.magFilter = b, e.wrapS = k, e.wrapT = q, e.needsUpdate = !0, e;
}, ot = (t) => {
  if (t <= 0)
    return 1;
  let i = 1;
  for (; i < t; )
    i <<= 1;
  return i;
}, lt = (t, i) => {
  const e = ot(Math.sqrt(i)), n = new rt(
    e,
    e,
    t
  ), r = n.createTexture(), s = n.addVariable(
    "progress",
    st,
    r
  ), a = at(e);
  s.material.uniforms.instructionsTexture = {
    value: a
  }, s.material.uniforms.spritesheetData = { value: null }, s.material.uniforms.fps = { value: 0 }, s.material.uniforms.deltaTime = { value: 0 }, s.material.uniforms.dataSize = { value: new $() }, n.setVariableDependencies(s, [s]);
  const l = n.init();
  l !== null && console.error(l);
  let u = !1;
  return {
    gpuCompute: n,
    animationRunner: s,
    progressDataTexture: a,
    utils: {
      updateAnimationAt: (m, p) => {
        const d = m * 4;
        a.image.data[d] = p, u = !0;
      },
      updateOffsetAt: (m, p) => {
        const d = m * 4;
        a.image.data[d + 1] = p, u = !0;
      },
      updatePlaymodeAt: (m, p) => {
        const d = m * 4;
        a.image.data[d + 2] = p, u = !0;
      },
      updateFrameAt: (m, p) => {
        const d = m * 4;
        a.image.data[d + 3] = p + 10, u = !0;
      }
    },
    update: () => {
      u && (a.needsUpdate = !0, u = !1), n.compute();
    }
  };
};
class ut {
  constructor() {
    y(this, "_previousTime");
    y(this, "_currentTime");
    y(this, "_startTime");
    y(this, "_delta");
    y(this, "_elapsed");
    y(this, "_timescale");
    y(this, "_useFixedDelta");
    y(this, "_fixedDelta");
    y(this, "_usePageVisibilityAPI");
    y(this, "_pageVisibilityHandler");
    this._previousTime = 0, this._currentTime = 0, this._startTime = B(), this._delta = 0, this._elapsed = 0, this._timescale = 1, this._useFixedDelta = !1, this._fixedDelta = 16.67, this._usePageVisibilityAPI = typeof document < "u" && document.hidden !== void 0, this._usePageVisibilityAPI === !0 && (this._pageVisibilityHandler = ct.bind(this), document.addEventListener(
      "visibilitychange",
      this._pageVisibilityHandler,
      !1
    ));
  }
  disableFixedDelta() {
    return this._useFixedDelta = !1, this;
  }
  dispose() {
    return this._usePageVisibilityAPI === !0 && document.removeEventListener(
      "visibilitychange",
      this._pageVisibilityHandler
    ), this;
  }
  enableFixedDelta() {
    return this._useFixedDelta = !0, this;
  }
  getDelta() {
    return this._delta / 1e3;
  }
  getElapsed() {
    return this._elapsed / 1e3;
  }
  getFixedDelta() {
    return this._fixedDelta / 1e3;
  }
  getTimescale() {
    return this._timescale;
  }
  reset() {
    return this._currentTime = B() - this._startTime, this;
  }
  setFixedDelta(i) {
    return this._fixedDelta = i * 1e3, this;
  }
  setTimescale(i) {
    return this._timescale = i, this;
  }
  update() {
    return this._useFixedDelta === !0 ? this._delta = this._fixedDelta : (this._previousTime = this._currentTime, this._currentTime = B() - this._startTime, this._delta = this._currentTime - this._previousTime), this._delta *= this._timescale, this._elapsed += this._delta, this;
  }
}
function B() {
  return (typeof performance > "u" ? Date : performance).now();
}
function ct() {
  document.hidden === !1 && this.reset();
}
const K = {
  FORWARD: 0,
  REVERSE: 1,
  PAUSE: 2,
  PINGPONG: 3
};
class Xt extends je {
  constructor(e, n, r, s = {
    geometry: "quad"
  }) {
    let a;
    s.geometry || (s.geometry = "quad"), s.geometry === "tri" && (a = qe()), s.geometry === "quad" && (a = new Ie(1, 1)), s.geometry && typeof s.geometry != "string" && (a = s.geometry);
    const l = Je(
      e,
      (s == null ? void 0 : s.geometry) === "tri"
    );
    super(a, l, n);
    y(this, "_spriteMaterial");
    y(this, "_spritesheet");
    y(this, "_animationMap");
    y(this, "_fps", 15);
    y(this, "_timer");
    y(this, "compute");
    ne >= 159 ? (this.instanceMatrix.clearUpdateRanges(), this.instanceMatrix.addUpdateRange(0, n * 16)) : this.instanceMatrix.updateRange.count = n * 16, this.instanceColor && (ne >= 159 ? (this.instanceColor.clearUpdateRanges(), this.instanceColor.addUpdateRange(0, n * 3)) : this.instanceColor.updateRange.count = n * 3), this.compute = lt(r, n), this._spriteMaterial = l, s.spritesheet && this.updateSpritesheet(s.spritesheet), this._timer = new ut(), this._animationMap = /* @__PURE__ */ new Map(), this._spriteMaterial.uniforms.animationData.value = this.compute.gpuCompute.getCurrentRenderTarget(
      this.compute.animationRunner
    ).texture, this._spriteMaterial.uniforms.animationDataSize.value = this.compute.progressDataTexture.image.width;
  }
  updateSpritesheet(e) {
    const { dataTexture: n, dataWidth: r, dataHeight: s, animMap: a } = Qe(e);
    this._spriteMaterial.uniforms.spritesheetData.value = n, this._spriteMaterial.uniforms.dataSize.value.x = r, this._spriteMaterial.uniforms.dataSize.value.y = s, this.compute.animationRunner.material.uniforms.dataSize.value = new $(r, s), this.compute.animationRunner.material.uniforms.spritesheetData.value = n, this._animationMap = a;
  }
  get spritesheet() {
    return this._spritesheet;
  }
  set spritesheet(e) {
    this.updateSpritesheet(e), this._spritesheet = e;
  }
  get animationMap() {
    return this._animationMap;
  }
  get animation() {
    return {
      setAt: (e, n) => {
        this.compute.utils.updateAnimationAt(
          e,
          this._animationMap.get(n) || 0
        );
      }
    };
  }
  get frame() {
    return {
      setAt: (e, n, r) => {
        var a;
        let s = n;
        r && (s = (a = this.spritesheet) == null ? void 0 : a.animations[r][n][0]), this.compute.utils.updateFrameAt(e, s);
      },
      unsetAt: (e) => {
        this.compute.utils.updateFrameAt(e, -10);
      },
      unsetAll: () => {
        for (let e = 0; e < this.count; e++)
          this.compute.utils.updateFrameAt(e, -10);
      }
    };
  }
  get playmode() {
    return {
      setAt: (e, n) => {
        this.compute.utils.updatePlaymodeAt(e, K[n]);
      },
      setAll: (e) => {
        for (let n = 0; n < this.count; n++) {
          const r = this.compute.progressDataTexture.image.data[n * 4 + 2] >= 10 ? 10 : 0;
          this.compute.utils.updatePlaymodeAt(n, r + K[e]);
        }
      }
    };
  }
  get billboarding() {
    return {
      setAt: (e, n) => {
        this.setUniformAt("billboarding", e, n ? 1 : 0);
      },
      setAll: (e) => {
        this._spriteMaterial.uniforms.billboarding.value = e ? 1 : 0;
      },
      unsetAll: () => {
        this.unsetUniform("billboarding");
      }
    };
  }
  get offset() {
    return {
      setAt: (e, n) => {
        this.compute.utils.updateOffsetAt(e, n);
      },
      randomizeAll: (e = 1) => {
        for (let n = 0; n < this.count; n++)
          this.compute.utils.updateOffsetAt(n, Math.random() * e);
      }
    };
  }
  get loop() {
    return {
      setAt: (e, n) => {
        const r = this.compute.progressDataTexture.image.data[e * 4 + 2] % 10;
        this.compute.utils.updatePlaymodeAt(
          e,
          r + (n ? 0 : 10)
        );
      },
      setAll: (e) => {
        for (let n = 0; n < this.count; n++) {
          const r = this.compute.progressDataTexture.image.data[n * 4 + 2] % 10;
          this.compute.utils.updatePlaymodeAt(n, r + (e ? 0 : 10));
        }
      }
    };
  }
  get flipX() {
    return {
      setAt: (e, n) => {
        this.setUniformAt("flipX", e, n ? 1 : 0);
      },
      setGlobal: (e) => {
        this._spriteMaterial.uniforms.flipX.value = e ? 1 : 0;
      },
      unsetAll: () => {
        this.unsetUniform("flipX");
      }
    };
  }
  get flipY() {
    return {
      setAt: (e, n) => {
        this.setUniformAt("flipY", e, n ? 1 : 0);
      },
      setGlobal: (e) => {
        this._spriteMaterial.uniforms.flipY.value = e ? 1 : 0;
      },
      unsetAll: () => {
        this.unsetUniform("flipY");
      }
    };
  }
  play(e, n = !0, r = "FORWARD") {
    return {
      at: (s) => {
        this.compute.utils.updateAnimationAt(
          s,
          this._animationMap.get(e) || 0
        ), this.compute.utils.updatePlaymodeAt(
          s,
          K[r] + (n ? 0 : 10)
        );
      }
    };
  }
  /** HSV shift tinting */
  get hueShift() {
    const e = new he();
    return {
      // TODO - per instance tinting doesnt work - artifacts
      // setAt: (
      //   instanceId: number,
      //   tint?: { h: number; s: number; v: number }
      // ) => {
      //   if (tint) {
      //     tVector.set(tint.h, tint.s, tint.v, 1);
      //   } else {
      //     tVector.setW(0);
      //   }
      //   this.setUniformAt("tint", instanceId, tVector);
      // },
      setGlobal: (n) => {
        n ? e.set(n.h, n.s, n.v, 1) : e.setW(0), this._spriteMaterial.uniforms.tint.value = e;
      }
      // unsetAll: () => {
      //   this.unsetUniform("tint");
      // },
    };
  }
  get fps() {
    return this._fps;
  }
  set fps(e) {
    this._fps = e, this.compute.animationRunner.material.uniforms.fps.value = e;
  }
  update() {
    this._timer.update();
    const e = this._timer.getDelta();
    this.compute.animationRunner.material.uniforms.deltaTime.value = e, this.compute.update();
  }
}
function ft(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var te = { exports: {} };
te.exports = G;
te.exports.default = G;
function G(t, i, e) {
  e = e || 2;
  var n = i && i.length, r = n ? i[0] * e : t.length, s = de(t, 0, r, e, !0), a = [];
  if (!s || s.next === s.prev)
    return a;
  var l, u, o, h, g, c, f;
  if (n && (s = gt(t, i, s, e)), t.length > 80 * e) {
    l = o = t[0], u = h = t[1];
    for (var m = e; m < r; m += e)
      g = t[m], c = t[m + 1], g < l && (l = g), c < u && (u = c), g > o && (o = g), c > h && (h = c);
    f = Math.max(o - l, h - u), f = f !== 0 ? 32767 / f : 0;
  }
  return I(s, a, e, l, u, f, 0), a;
}
function de(t, i, e, n, r) {
  var s, a;
  if (r === X(t, i, e, n) > 0)
    for (s = i; s < e; s += n)
      a = me(s, t[s], t[s + 1], a);
  else
    for (s = e - n; s >= i; s -= n)
      a = me(s, t[s], t[s + 1], a);
  return a && Z(a, a.next) && (E(a), a = a.next), a;
}
function F(t, i) {
  if (!t)
    return t;
  i || (i = t);
  var e = t, n;
  do
    if (n = !1, !e.steiner && (Z(e, e.next) || M(e.prev, e, e.next) === 0)) {
      if (E(e), e = i = e.prev, e === e.next)
        break;
      n = !0;
    } else
      e = e.next;
  while (n || e !== i);
  return i;
}
function I(t, i, e, n, r, s, a) {
  if (t) {
    !a && s && _t(t, n, r, s);
    for (var l = t, u, o; t.prev !== t.next; ) {
      if (u = t.prev, o = t.next, s ? ht(t, n, r, s) : mt(t)) {
        i.push(u.i / e | 0), i.push(t.i / e | 0), i.push(o.i / e | 0), E(t), t = o.next, l = o.next;
        continue;
      }
      if (t = o, t === l) {
        a ? a === 1 ? (t = pt(F(t), i, e), I(t, i, e, n, r, s, 2)) : a === 2 && dt(t, i, e, n, r, s) : I(F(t), i, e, n, r, s, 1);
        break;
      }
    }
  }
}
function mt(t) {
  var i = t.prev, e = t, n = t.next;
  if (M(i, e, n) >= 0)
    return !1;
  for (var r = i.x, s = e.x, a = n.x, l = i.y, u = e.y, o = n.y, h = r < s ? r < a ? r : a : s < a ? s : a, g = l < u ? l < o ? l : o : u < o ? u : o, c = r > s ? r > a ? r : a : s > a ? s : a, f = l > u ? l > o ? l : o : u > o ? u : o, m = n.next; m !== i; ) {
    if (m.x >= h && m.x <= c && m.y >= g && m.y <= f && V(r, l, s, u, a, o, m.x, m.y) && M(m.prev, m, m.next) >= 0)
      return !1;
    m = m.next;
  }
  return !0;
}
function ht(t, i, e, n) {
  var r = t.prev, s = t, a = t.next;
  if (M(r, s, a) >= 0)
    return !1;
  for (var l = r.x, u = s.x, o = a.x, h = r.y, g = s.y, c = a.y, f = l < u ? l < o ? l : o : u < o ? u : o, m = h < g ? h < c ? h : c : g < c ? g : c, p = l > u ? l > o ? l : o : u > o ? u : o, d = h > g ? h > c ? h : c : g > c ? g : c, w = W(f, m, i, e, n), _ = W(p, d, i, e, n), x = t.prevZ, v = t.nextZ; x && x.z >= w && v && v.z <= _; ) {
    if (x.x >= f && x.x <= p && x.y >= m && x.y <= d && x !== r && x !== a && V(l, h, u, g, o, c, x.x, x.y) && M(x.prev, x, x.next) >= 0 || (x = x.prevZ, v.x >= f && v.x <= p && v.y >= m && v.y <= d && v !== r && v !== a && V(l, h, u, g, o, c, v.x, v.y) && M(v.prev, v, v.next) >= 0))
      return !1;
    v = v.nextZ;
  }
  for (; x && x.z >= w; ) {
    if (x.x >= f && x.x <= p && x.y >= m && x.y <= d && x !== r && x !== a && V(l, h, u, g, o, c, x.x, x.y) && M(x.prev, x, x.next) >= 0)
      return !1;
    x = x.prevZ;
  }
  for (; v && v.z <= _; ) {
    if (v.x >= f && v.x <= p && v.y >= m && v.y <= d && v !== r && v !== a && V(l, h, u, g, o, c, v.x, v.y) && M(v.prev, v, v.next) >= 0)
      return !1;
    v = v.nextZ;
  }
  return !0;
}
function pt(t, i, e) {
  var n = t;
  do {
    var r = n.prev, s = n.next.next;
    !Z(r, s) && ge(r, n, n.next, s) && O(r, s) && O(s, r) && (i.push(r.i / e | 0), i.push(n.i / e | 0), i.push(s.i / e | 0), E(n), E(n.next), n = t = s), n = n.next;
  } while (n !== t);
  return F(n);
}
function dt(t, i, e, n, r, s) {
  var a = t;
  do {
    for (var l = a.next.next; l !== a.prev; ) {
      if (a.i !== l.i && Dt(a, l)) {
        var u = xe(a, l);
        a = F(a, a.next), u = F(u, u.next), I(a, i, e, n, r, s, 0), I(u, i, e, n, r, s, 0);
        return;
      }
      l = l.next;
    }
    a = a.next;
  } while (a !== t);
}
function gt(t, i, e, n) {
  var r = [], s, a, l, u, o;
  for (s = 0, a = i.length; s < a; s++)
    l = i[s] * n, u = s < a - 1 ? i[s + 1] * n : t.length, o = de(t, l, u, n, !1), o === o.next && (o.steiner = !0), r.push(Tt(o));
  for (r.sort(xt), s = 0; s < r.length; s++)
    e = vt(r[s], e);
  return e;
}
function xt(t, i) {
  return t.x - i.x;
}
function vt(t, i) {
  var e = yt(t, i);
  if (!e)
    return i;
  var n = xe(e, t);
  return F(n, n.next), F(e, e.next);
}
function yt(t, i) {
  var e = i, n = t.x, r = t.y, s = -1 / 0, a;
  do {
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      var l = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (l <= n && l > s && (s = l, a = e.x < e.next.x ? e : e.next, l === n))
        return a;
    }
    e = e.next;
  } while (e !== i);
  if (!a)
    return null;
  var u = a, o = a.x, h = a.y, g = 1 / 0, c;
  e = a;
  do
    n >= e.x && e.x >= o && n !== e.x && V(r < h ? n : s, r, o, h, r < h ? s : n, r, e.x, e.y) && (c = Math.abs(r - e.y) / (n - e.x), O(e, t) && (c < g || c === g && (e.x > a.x || e.x === a.x && wt(a, e))) && (a = e, g = c)), e = e.next;
  while (e !== u);
  return a;
}
function wt(t, i) {
  return M(t.prev, t, i.prev) < 0 && M(i.next, t, t.next) < 0;
}
function _t(t, i, e, n) {
  var r = t;
  do
    r.z === 0 && (r.z = W(r.x, r.y, i, e, n)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== t);
  r.prevZ.nextZ = null, r.prevZ = null, Mt(r);
}
function Mt(t) {
  var i, e, n, r, s, a, l, u, o = 1;
  do {
    for (e = t, t = null, s = null, a = 0; e; ) {
      for (a++, n = e, l = 0, i = 0; i < o && (l++, n = n.nextZ, !!n); i++)
        ;
      for (u = o; l > 0 || u > 0 && n; )
        l !== 0 && (u === 0 || !n || e.z <= n.z) ? (r = e, e = e.nextZ, l--) : (r = n, n = n.nextZ, u--), s ? s.nextZ = r : t = r, r.prevZ = s, s = r;
      e = n;
    }
    s.nextZ = null, o *= 2;
  } while (a > 1);
  return t;
}
function W(t, i, e, n, r) {
  return t = (t - e) * r | 0, i = (i - n) * r | 0, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t | i << 1;
}
function Tt(t) {
  var i = t, e = t;
  do
    (i.x < e.x || i.x === e.x && i.y < e.y) && (e = i), i = i.next;
  while (i !== t);
  return e;
}
function V(t, i, e, n, r, s, a, l) {
  return (r - a) * (i - l) >= (t - a) * (s - l) && (t - a) * (n - l) >= (e - a) * (i - l) && (e - a) * (s - l) >= (r - a) * (n - l);
}
function Dt(t, i) {
  return t.next.i !== i.i && t.prev.i !== i.i && !At(t, i) && // dones't intersect other edges
  (O(t, i) && O(i, t) && bt(t, i) && // locally visible
  (M(t.prev, t, i.prev) || M(t, i.prev, i)) || // does not create opposite-facing sectors
  Z(t, i) && M(t.prev, t, t.next) > 0 && M(i.prev, i, i.next) > 0);
}
function M(t, i, e) {
  return (i.y - t.y) * (e.x - i.x) - (i.x - t.x) * (e.y - i.y);
}
function Z(t, i) {
  return t.x === i.x && t.y === i.y;
}
function ge(t, i, e, n) {
  var r = H(M(t, i, e)), s = H(M(t, i, n)), a = H(M(e, n, t)), l = H(M(e, n, i));
  return !!(r !== s && a !== l || r === 0 && z(t, e, i) || s === 0 && z(t, n, i) || a === 0 && z(e, t, n) || l === 0 && z(e, i, n));
}
function z(t, i, e) {
  return i.x <= Math.max(t.x, e.x) && i.x >= Math.min(t.x, e.x) && i.y <= Math.max(t.y, e.y) && i.y >= Math.min(t.y, e.y);
}
function H(t) {
  return t > 0 ? 1 : t < 0 ? -1 : 0;
}
function At(t, i) {
  var e = t;
  do {
    if (e.i !== t.i && e.next.i !== t.i && e.i !== i.i && e.next.i !== i.i && ge(e, e.next, t, i))
      return !0;
    e = e.next;
  } while (e !== t);
  return !1;
}
function O(t, i) {
  return M(t.prev, t, t.next) < 0 ? M(t, i, t.next) >= 0 && M(t, t.prev, i) >= 0 : M(t, i, t.prev) < 0 || M(t, t.next, i) < 0;
}
function bt(t, i) {
  var e = t, n = !1, r = (t.x + i.x) / 2, s = (t.y + i.y) / 2;
  do
    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
  while (e !== t);
  return n;
}
function xe(t, i) {
  var e = new Y(t.i, t.x, t.y), n = new Y(i.i, i.x, i.y), r = t.next, s = i.prev;
  return t.next = i, i.prev = t, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, n.prev = s, n;
}
function me(t, i, e, n) {
  var r = new Y(t, i, e);
  return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, r.next = r), r;
}
function E(t) {
  t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), t.nextZ && (t.nextZ.prevZ = t.prevZ);
}
function Y(t, i, e) {
  this.i = t, this.x = i, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
G.deviation = function(t, i, e, n) {
  var r = i && i.length, s = r ? i[0] * e : t.length, a = Math.abs(X(t, 0, s, e));
  if (r)
    for (var l = 0, u = i.length; l < u; l++) {
      var o = i[l] * e, h = l < u - 1 ? i[l + 1] * e : t.length;
      a -= Math.abs(X(t, o, h, e));
    }
  var g = 0;
  for (l = 0; l < n.length; l += 3) {
    var c = n[l] * e, f = n[l + 1] * e, m = n[l + 2] * e;
    g += Math.abs(
      (t[c] - t[m]) * (t[f + 1] - t[c + 1]) - (t[c] - t[f]) * (t[m + 1] - t[c + 1])
    );
  }
  return a === 0 && g === 0 ? 0 : Math.abs((g - a) / a);
};
function X(t, i, e, n) {
  for (var r = 0, s = i, a = e - n; s < e; s += n)
    r += (t[a] - t[s]) * (t[s + 1] + t[a + 1]), a = s;
  return r;
}
G.flatten = function(t) {
  for (var i = t[0][0].length, e = { vertices: [], holes: [], dimensions: i }, n = 0, r = 0; r < t.length; r++) {
    for (var s = 0; s < t[r].length; s++)
      for (var a = 0; a < i; a++)
        e.vertices.push(t[r][s][a]);
    r > 0 && (n += t[r - 1].length, e.holes.push(n));
  }
  return e;
};
var Ut = te.exports;
const Ft = /* @__PURE__ */ ft(Ut);
new $();
new $();
function St(t, i) {
  var e = t % i, n = Math.floor(t / i);
  return [e, n];
}
function Pt(t, i, e) {
  for (var n = 0, r = 0; n < t.length; n += i, r++)
    if (i === 3) {
      var s = e([t[n], t[n + 1], t[n + 2]], r);
      t.set(s, n);
    } else
      t.set(e([t[n], t[n + 1]], r), n);
  return t;
}
function Rt(t, i, e, n) {
  var r = e.x - n.x, s = t.x - i.x, a = e.y - n.y, l = t.y - i.y, u = s * a - l * r;
  if (u == 0)
    throw new Error("Number of intersection points is zero or infinity.");
  var o = t.x * i.y - t.y * i.x, h = e.x * n.y - e.y * n.x, g = (o * r - s * h) / u, c = (o * a - l * h) / u, f = { x: g, y: c };
  return f;
}
function Vt(t) {
  for (var i = 0, e = 0, n = t.length; e < n; e++) {
    var r = t[e].x, s = t[e == t.length - 1 ? 0 : e + 1].y, a = t[e == t.length - 1 ? 0 : e + 1].x, l = t[e].y;
    i += r * s * 0.5, i -= a * l * 0.5;
  }
  return Math.abs(i);
}
function Ct([t, i, e]) {
  return Math.abs(
    (t.x * (i.y - e.y) + i.x * (e.y - t.y) + e.x * (t.y - i.y)) / 2
  );
}
function It(t, i = 8) {
  const e = t.slice();
  let n = 0;
  for (; e.length > i && n < 1e3; ) {
    n++;
    let r = 1 / 0, s = null;
    for (let a = 0; a <= e.length - 1; a++) {
      const l = e.length, u = [a, (a + 1) % l, (a + 2) % l, (a + 3) % l], o = e[u[0]], h = e[u[1]], g = e[u[2]], c = e[u[3]];
      try {
        const f = Rt(o, h, g, c), m = Ct([f, h, g]);
        m < r && (r = m, s = {
          point: f,
          area: m,
          indicesToRemove: [u[1], u[2]]
        });
      } catch (f) {
        console.log(f);
      }
    }
    if (s) {
      const a = s.indicesToRemove[0], l = s.indicesToRemove[1];
      l > a ? (e.splice(l, 1), e.splice(a, 1)) : (e.splice(a, 1), e.splice(l, 1)), e.splice(Math.min(a, l), 0, s.point);
    }
  }
  return e;
}
var J;
((t) => {
  function i(r) {
    let s = r.slice();
    return s.sort(t.POINT_COMPARATOR), t.makeHullPresorted(s);
  }
  t.makeHull = i;
  function e(r) {
    if (r.length <= 1)
      return r.slice();
    let s = [];
    for (let l = 0; l < r.length; l++) {
      const u = r[l];
      for (; s.length >= 2; ) {
        const o = s[s.length - 1], h = s[s.length - 2];
        if ((o.x - h.x) * (u.y - h.y) >= (o.y - h.y) * (u.x - h.x))
          s.pop();
        else
          break;
      }
      s.push(u);
    }
    s.pop();
    let a = [];
    for (let l = r.length - 1; l >= 0; l--) {
      const u = r[l];
      for (; a.length >= 2; ) {
        const o = a[a.length - 1], h = a[a.length - 2];
        if ((o.x - h.x) * (u.y - h.y) >= (o.y - h.y) * (u.x - h.x))
          a.pop();
        else
          break;
      }
      a.push(u);
    }
    return a.pop(), s.length == 1 && a.length == 1 && s[0].x == a[0].x && s[0].y == a[0].y ? s : s.concat(a);
  }
  t.makeHullPresorted = e;
  function n(r, s) {
    return r.x < s.x ? -1 : r.x > s.x ? 1 : r.y < s.y ? -1 : r.y > s.y ? 1 : 0;
  }
  t.POINT_COMPARATOR = n;
})(J || (J = {}));
function Ot(t, i) {
  const e = new Float32Array(t);
  for (let n = 0; n < t; n++)
    e[n * 3] = i[0], e[n * 3 + 1] = i[1], e[n * 3 + 2] = i[2];
  return e;
}
function Et(t, i, e = () => Math.random()) {
  const n = i + 1, r = new Float32Array(t.length / i * n);
  for (let s = 0; s < t.length; s += i) {
    let a = s / i * n;
    r[a] = t[s], r[a + 1] = t[s + 1], i === 2 && (r[a + 2] = e(a)), i === 3 && (r[a + 2] = t[s + 2], r[a + 3] = e(a));
  }
  return r;
}
function $t(t) {
  const i = new Float32Array(t.length * 2);
  for (let e = 0; e < t.length; e++)
    i[e * 2] = t[e].x, i[e * 2 + 1] = t[e].y;
  return i;
}
function zt(t, i, e) {
  const n = [], r = t % (i * 4) / 4, s = Math.floor(t / (i * 4)), a = s - 1, l = s + 1, u = r - 1, o = r + 1;
  return a >= 0 ? n.push(a * i + r) : n.push(null), l < e ? n.push(l * i + r) : n.push(null), u >= 0 ? n.push(s * i + u) : n.push(null), o < i ? n.push(s * i + o) : n.push(null), n;
}
const Ht = (t) => (...i) => i[3] / 255 > 0, Lt = {
  threshold: 0.01,
  slices: [1, 1],
  indices: [0, 0],
  scale: 1,
  filter: Ht
};
class kt {
  constructor(i, e, n) {
    y(this, "points", []);
    y(this, "data", {
      areaReduction: 0
    });
    y(this, "debug", !0);
    y(this, "index");
    y(this, "positions");
    y(this, "uv");
    y(this, "defaultSettings", Lt);
    y(this, "settings");
    this.vertices = n, this.settings = { ...this.defaultSettings, ...e };
    const { slices: r } = this.settings, s = Nt("bvc-image", i.width, i.height);
    this.points = this.getPoints(i, s);
    let a = J.makeHull(this.points);
    const l = It(a, n), u = l.map((c) => {
      let f = Gt(c, [i.width, i.height], r);
      return f.y = -1 * f.y, f;
    }), { scale: o } = this.settings;
    this.data.areaReduction = 1 - Vt(l) / (i.width / r[0] * (i.height / r[1])) * o;
    const h = $t(u), g = Ft(h, null, 2);
    this.positions = Et(h, 2, () => 0), this.index = Uint32Array.from(g), this.uv = Pt(h.slice(0), 2, (c) => {
      let f = c[0] + 0.5;
      f = f / this.settings.slices[0] + 1 / this.settings.slices[0] * this.settings.indices[0];
      let m = c[1] + 0.5;
      return m = m / this.settings.slices[1] + 1 - 1 / this.settings.slices[1] * (this.settings.indices[1] + 1), [f, m];
    });
  }
  getImageData(i, e) {
    const n = e.getContext("2d");
    n.drawImage(i, 0, 0);
    const [r, s] = this.settings.indices, [a, l] = this.settings.slices, u = e.width / a, o = e.height / l;
    return n.getImageData(u * r, o * s, u, o);
  }
  /**
   * Iterates over the image and returns an array of points that are over the alpha threshold.
   * It reduces the number of returned points by excluding points that are surrounded by solid pixels.
   *
   * @param img An image element with the image already loaded
   * @param canvas A canvas element to draw the image on in order to get the color values
   * @returns
   */
  getPoints(i, e) {
    const n = this.getImageData(i, e), r = n.data, s = [], a = this.settings.filter(this.settings.threshold), l = (u) => u !== null && a(
      r[u * 4],
      r[u * 4 + 1],
      r[u * 4 + 2],
      r[u * 4 + 3]
    );
    for (let u = 0; u < r.length; u += 4)
      if (a(
        r[u + 0],
        r[u + 1],
        r[u + 2],
        r[u + 3]
      )) {
        if (zt(u, e.width, e.height).every(l))
          continue;
        const [g, c] = St(u / 4, n.width);
        s.push({ x: g, y: c });
      }
    return s;
  }
}
const Nt = (t = "debug-canvas", i, e) => {
  const n = document.querySelector(`#${t}`) || document.createElement("canvas");
  return n.id = t, n.width = i, n.height = e, n.id = t, n;
}, Gt = (t, i, e) => ({
  x: (t.x - i[0] / (2 * e[0])) / (i[0] / e[0]),
  y: (t.y - i[1] / (2 * e[1])) / (i[1] / e[1])
}), Zt = {
  threshold: 0.01,
  slices: [1, 1],
  indices: [1, 1]
};
class Bt extends ee {
  constructor(e, n = 8, r = 0.01, s = [1, 1], a = [0, 0]) {
    super();
    y(this, "image");
    y(this, "vertices", 8);
    y(this, "settings", Zt);
    this.vertices = n, this.settings = {
      ...this.settings,
      threshold: r,
      slices: s,
      indices: a
    }, this.image = "image" in e ? e.image : e, this.build();
  }
  build() {
    const e = new kt(
      this.image,
      this.settings,
      this.vertices
    ), n = e.positions.length, r = new R(e.index, 1), s = new R(e.positions, 3), a = new R(Ot(n, [0, 0, 1]), 3), l = new R(e.uv, 2);
    this.userData.reduction = e.data.areaReduction, this.setIndex(r), this.setAttribute("position", s), this.setAttribute("normal", a), this.setAttribute("uv", l);
  }
}
const Jt = () => new Kt();
class Kt {
  constructor() {
    y(this, "animations");
    this.animations = [];
  }
  add(i, e, n) {
    const r = {
      name: "",
      imageUrl: i
    };
    return Array.isArray(n) ? r.multiAnimations = n : r.name = n, e.type == "rowColumn" && (r.auto = {
      type: "rowColumn",
      width: e.width,
      height: e.height
    }), e.type == "frameSize" && (r.auto = {
      type: "frameSize",
      width: e.width,
      height: e.height
    }), this.animations.push(r), this;
  }
  async build(i = {}) {
    const e = new Oe(), n = {
      frames: [],
      animations: {},
      sheetSize: [0, 0],
      animationLengths: []
    };
    let r = new Ee();
    const s = [];
    let a = 0, l = 0;
    for (const p of this.animations) {
      const d = await e.loadAsync(p.imageUrl), w = d.width, _ = d.height;
      a = Math.max(a, w), l += _, s.push({
        img: d,
        w,
        h: _
      });
    }
    const u = document.createElement("canvas");
    u.width = a, u.height = l;
    const o = u.getContext("2d");
    let h = 0;
    for (const { img: p, h: d } of s)
      o == null || o.drawImage(p, 0, h, p.width, p.height), h += d;
    r = new re(u), r.needsUpdate = !0;
    let g = 0, c = 0, f = 0, m = 64;
    for (const p of this.animations) {
      const d = s[g];
      let w = 0;
      if (p.auto) {
        let _ = 0, x = 0;
        p.auto.type == "frameSize" && (x = d.w / p.auto.width, _ = d.h / p.auto.height), p.auto.type == "rowColumn" && (x = p.auto.width, _ = p.auto.height);
        const v = d.w / x, S = d.h / _;
        w = _ * x, p.multiAnimations || (n.animations[p.name] = []);
        const P = /* @__PURE__ */ new Map();
        for (let D = 0; D < _; D++) {
          f += S;
          for (let A = 0; A < x; A++) {
            if (n.frames.push([
              d.w / x * A / a,
              1 - f / l,
              v / a,
              S / l
            ]), p.multiAnimations) {
              const ve = D * x + A;
              P.set(ve, c);
            } else
              n.animations[p.name].push([c, 1]);
            c++;
          }
        }
        if (p.multiAnimations)
          for (const D of p.multiAnimations) {
            n.animations[D.name] = [], n.animationLengths.push(
              D.frameRange[1] - D.frameRange[0] + 1
            );
            for (let A = D.frameRange[0]; A <= D.frameRange[1]; A++)
              n.animations[D.name].push([P.get(A), 1]);
          }
        else
          n.animationLengths.push(w);
      }
      g++;
    }
    if (r.matrixAutoUpdate = !1, r.generateMipmaps = !1, r.premultiplyAlpha = !1, r.wrapS = r.wrapT = q, r.magFilter = r.minFilter = b, r.colorSpace = se, n.sheetSize = [a, l], i.makeSlimGeometry) {
      const p = document.createElement("canvas");
      p.width = m, p.height = m;
      const d = p.getContext("2d"), w = a / m, _ = l / m;
      for (let S = 0; S < w; S++)
        for (let P = 0; P < _; P++) {
          const D = S * m, A = P * m;
          d == null || d.drawImage(u, D, A, m, m, 0, 0, m, m);
        }
      const x = new re(p);
      x.magFilter = r.minFilter = b, x.colorSpace = se;
      const v = new Bt(
        x,
        // an already loaded HTMLImageElement or a ThreeJS texture
        i.slimOptions ? i.slimOptions.vertices : 8,
        i.slimOptions ? i.slimOptions.alphaThreshold : 0
        // alphaThreshold, 0 means only fully transparent pixels will be discarded
      );
      return { spritesheet: n, texture: r, geometry: v };
    }
    return { spritesheet: n, texture: r };
  }
}
export {
  Xt as InstancedSpriteMesh,
  K as PLAY_MODE,
  Jt as createSpritesheet,
  Qe as makeDataTexture,
  Yt as parseAseprite
};
