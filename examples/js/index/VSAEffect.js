/* eslint-disable no-underscore-dangle */

import * as twgl from '../../3rdParty/twgl-full.module.js';

const m4 = twgl.m4;

const kMaxCount = 100000;

const s_vsHeader = `
attribute float vertexId;

uniform vec2 mouse;
uniform vec2 resolution;
uniform vec4 background;
uniform float time;
uniform float vertexCount;
uniform sampler2D sound;
uniform vec2 soundRes;
uniform float _dontUseDirectly_pointSize;

varying vec4 v_color;
`;

const s_fs = `
precision mediump float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;


const s_historyVS = `
attribute vec4 position;
attribute vec2 texcoord;
uniform mat4 u_matrix;
varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * position;
  v_texcoord = texcoord;
}
`;

const s_historyFS = `
precision mediump float;

uniform sampler2D u_texture;
uniform float u_mix;
uniform float u_mult;
varying vec2 v_texcoord;

void main() {
  vec4 color = texture2D(u_texture, v_texcoord);
  gl_FragColor = mix(color.aaaa, color.rgba, u_mix) * u_mult;
}
`;

const s_rectVS = `
attribute vec4 position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * position;
}
`;

const s_rectFS = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`;

class HistoryTexture {
  constructor(gl, options) {
    this.gl = gl;
    const _width = options.width;
    const type  = options.type || gl.UNSIGNED_BYTE;
    const format = options.format || gl.RGBA;
    const Ctor  = twgl.getTypedArrayTypeForGLType(type);
    const numComponents = twgl.getNumComponentsForFormat(format);
    const size  = _width * numComponents;
    const _buffer = new Ctor(size);
    const _texSpec = {
      src: _buffer,
      height: 1,
      min: options.min || gl.LINEAR,
      mag: options.mag || gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
      format: format,
      auto: false,  // don't set tex params or call genmipmap
    };
    const _tex = twgl.createTexture(gl, _texSpec);

    const _length = options.length;
    const _historyAttachments = [
      {
        format: options.historyFormat || gl.RGBA,
        type: type,
        mag: options.mag || gl.LINEAR,
        min: options.min || gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
      },
    ];

    let _srcFBI = twgl.createFramebufferInfo(gl, _historyAttachments, _width, _length);
    let _dstFBI = twgl.createFramebufferInfo(gl, _historyAttachments, _width, _length);

    const _historyUniforms = {
      u_mix: 0,
      u_mult: 1,
      u_matrix: m4.identity(),
      u_texture: undefined,
    };

    this.buffer = _buffer;

    this.update = (gl, historyProgramInfo, quadBufferInfo) => {
      const temp = _srcFBI;
      _srcFBI = _dstFBI;
      _dstFBI = temp;

      twgl.setTextureFromArray(gl, _tex, _texSpec.src, _texSpec);

      gl.useProgram(historyProgramInfo.program);
      twgl.bindFramebufferInfo(gl, _dstFBI);

      // copy from historySrc to historyDst one pixel down
      m4.translation([0, 2 / _length, 0], _historyUniforms.u_matrix);
      _historyUniforms.u_mix = 1;
      _historyUniforms.u_texture = _srcFBI.attachments[0];

      twgl.setUniforms(historyProgramInfo, _historyUniforms);
      twgl.drawBufferInfo(gl, quadBufferInfo);

      // copy audio data into top row of historyDst
      _historyUniforms.u_mix = format === gl.ALPHA ? 0 : 1;
      _historyUniforms.u_texture = _tex;
      m4.translation(
          [0, -(_length - 0.5) / _length, 0],
          _historyUniforms.u_matrix);
      m4.scale(
          _historyUniforms.u_matrix,
          [1, 1 / _length, 1],
          _historyUniforms.u_matrix);

      twgl.setUniforms(historyProgramInfo, _historyUniforms);
      twgl.drawBufferInfo(gl, quadBufferInfo);
    };

    this.getTexture = () => {
      return _dstFBI.attachments[0];
    };
  }
}

const mainRE = /(void[ \t\n\r]+main[ \t\n\r]*\([ \t\n\r]*\)[ \t\n\r]\{)/g;
function applyTemplateToShader(src) {
  let vSrc = s_vsHeader + src;
  vSrc = vSrc.replace(mainRE, function (m) {
    return `${m}gl_PointSize=1.0;`;
  });
  const lastBraceNdx = vSrc.lastIndexOf('}');
  if (lastBraceNdx >= 0) {
    const before = vSrc.substr(0, lastBraceNdx);
    const after = vSrc.substr(lastBraceNdx);
    vSrc = `${before};gl_PointSize = max(0., gl_PointSize*_dontUseDirectly_pointSize);${after}`;
  }
  return vSrc;
}

export default class VSAEffect {
  constructor(gl) {
    this.gl = gl;
    this.time = 0;
    this.then = undefined;
    this.rectProgramInfo = twgl.createProgramInfo(gl, [s_rectVS, s_rectFS]);
    this.historyProgramInfo = twgl.createProgramInfo(gl, [s_historyVS, s_historyFS]);
  }
  #init(gl, analyser) {
    if (this.init) {
      return;
    }
    this.init = true;
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.numSoundSamples = Math.min(maxTextureSize, analyser.frequencyBinCount);
    this.numHistorySamples = 60 * 4; // 4 seconds;

    this.soundHistory = new HistoryTexture(gl, {
      width: this.numSoundSamples,
      length: this.numHistorySamples,
      format: gl.ALPHA,
    });

    const count = new Float32Array(kMaxCount);
    for (let ii = 0; ii < count.length; ++ii) {
      count[ii] = ii;
    }
    const arrays = {
      vertexId: { data: count, numComponents: 1 },
    };
    this.countBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    this.quadBufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: { numComponents: 2, data: [-1, -1, 1, -1, -1, 1, 1, 1] },
      texcoord: [0, 0, 1, 0, 0, 1, 1, 1],
      indices: [0, 1, 2, 2, 1, 3],
    });

    this.uniforms = {
      time: 0,
      vertexCount: 0,
      resolution: [1, 1],
      background: [0, 0, 0, 1],
      mouse: [0, 0],
      sound: undefined,
      floatSound: undefined,
      soundRes: [this.numSoundSamples, this.numHistorySamples],
      _dontUseDirectly_pointSize: 1,
    };

    this.historyUniforms = {
      u_mix: 0,
      u_matrix: m4.identity(),
      u_texture: undefined,
    };
  }
  async setSettings(vsa) {
    try {
      if (vsa === this.currentVsa) {
        // It's the current URL
        return;
      }
      if (vsa === this.pendingVsa) {
        // It's the pending Url
        return;
      }
      this.pendingVsa = vsa;
      if (this.compiling) {
        return;
      }
      // It doesn't matter if the URL is bad, we don't want to try again
      this.currentVsa = this.pendingVsa;
      this.pendingVsa = undefined;
      this.compiling = true;
      const gl = this.gl;
      const vs = applyTemplateToShader(vsa.settings.shader);
      const programInfo = await twgl.createProgramInfoAsync(gl, [vs, s_fs]);
      this.programInfo = programInfo;
      this.vsa = vsa;
    } catch (e) {
      console.error(e);
    }
    this.compiling = false;
    if (this.pendingVsa) {
      const nextVsa = this.pendingVsa;
      this.pendingVsa = undefined;
      this.setSettings(nextVsa);
    }
  }
  reset(/*gl*/) {
  }
  resize() {
  }

  #updateSoundHistory(gl, analysers) {
    // Copy audio data to Nx1 texture
    analysers[0].getByteFrequencyData(this.soundHistory.buffer);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    twgl.setBuffersAndAttributes(gl, this.historyProgramInfo, this.quadBufferInfo);

    this.soundHistory.update(gl, this.historyProgramInfo, this.quadBufferInfo);
  }

  #renderScene(gl, commonUniforms, soundHistoryTex, time) {
    twgl.bindFramebufferInfo(gl);
    const settings = this.vsa.settings;

    const programInfo = this.programInfo;
    if (!programInfo) {
      return;
    }

    const { width, height, left, bottom } = commonUniforms;

    gl.viewport(left, bottom, width, height);
    gl.scissor(left, bottom, width, height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.enable(gl.SCISSOR_TEST);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(...settings.backgroundColor);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const num = settings.num;
    const mode = gl[settings.mode];
    const uniforms = this.uniforms;
    uniforms.time = time;
    uniforms.vertexCount = num;
    uniforms.resolution[0] = width;
    uniforms.resolution[1] = height;
    uniforms.background[0] = settings.backgroundColor[0];
    uniforms.background[1] = settings.backgroundColor[1];
    uniforms.background[2] = settings.backgroundColor[2];
    uniforms.background[3] = settings.backgroundColor[3];
    uniforms._dontUseDirectly_pointSize = 1;
    uniforms.sound = soundHistoryTex;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, this.countBufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.setUniforms(programInfo, commonUniforms);
    twgl.drawBufferInfo(gl, this.countBufferInfo, mode, num);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.SCISSOR_TEST);
  }

  render(gl, commonUniforms, byteBeat, analyzers) {
    if (!this.vsa || !this.programInfo) {
      return;
    }
    this.#init(gl, analyzers[0]);
    const now = byteBeat.getTime() / byteBeat.getDesiredSampleRate();
    const deltaTime = (now - (this.then || now)) * (commonUniforms.speed === undefined ? 1 : commonUniforms.speed);
    this.then = now;
    this.time += deltaTime;

    this.#updateSoundHistory(gl, analyzers, this.time);

    const historyTex = this.soundHistory.getTexture();
    this.#renderScene(gl, commonUniforms, historyTex, this.time);
  }
}