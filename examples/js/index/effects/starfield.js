/* eslint-disable require-trailing-comma/require-trailing-comma */
/* eslint-disable no-useless-escape */
export default {
  _id: "pfa9757K3NJx6euhN",
  createdAt: "2019-02-21T11:38:22.742Z",
  modifiedAt: "2019-02-26T06:41:10.489Z",
  origId: null,
  name: "starfield",
  username: "gman",
  avatarUrl: "https://secure.gravatar.com/avatar/dcc0309895c3d6db087631813efaa9d1?default=retro&size=200",
  settings: {
    num: 100000,
    mode: "POINTS",
    sound: "",
    lineSize: "NATIVE",
    backgroundColor: [
      0,
      0,
      0,
      1
    ],
    shader: `#define PI radians(180.0)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


mat4 rotX(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
    return mat4( 
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1);  
}

mat4 rotY(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
    return mat4( 
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1);  
}

mat4 rotZ(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
    return mat4( 
      c,-s, 0, 0, 
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1); 
}

mat4 trans(vec3 trans) {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    trans, 1);
}

mat4 ident() {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);
}

mat4 scale(vec3 s) {
  return mat4(
    s[0], 0, 0, 0,
    0, s[1], 0, 0,
    0, 0, s[2], 0,
    0, 0, 0, 1);
}

mat4 uniformScale(float s) {
  return mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1);
}

mat4 persp(float fov, float aspect, float zNear, float zFar) {
  float f = tan(PI * 0.5 - 0.5 * fov);
  float rangeInv = 1.0 / (zNear - zFar);

  return mat4(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2., 0);
}

mat4 trInv(mat4 m) {
  mat3 i = mat3(
    m[0][0], m[1][0], m[2][0], 
    m[0][1], m[1][1], m[2][1], 
    m[0][2], m[1][2], m[2][2]);
  vec3 t = -i * m[3].xyz;
    
  return mat4(
    i[0], t[0], 
    i[1], t[1],
    i[2], t[2],
    0, 0, 0, 1);
}

mat4 transpose(mat4 m) {
  return mat4(
    m[0][0], m[1][0], m[2][0], m[3][0], 
    m[0][1], m[1][1], m[2][1], m[3][1],
    m[0][2], m[1][2], m[2][2], m[3][2],
    m[0][3], m[1][3], m[2][3], m[3][3]);
}

mat4 lookAt(vec3 eye, vec3 target, vec3 up) {
  vec3 zAxis = normalize(eye - target);
  vec3 xAxis = normalize(cross(up, zAxis));
  vec3 yAxis = cross(zAxis, xAxis);

  return mat4(
    xAxis, 0,
    yAxis, 0,
    zAxis, 0,
    eye, 1);
}

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

mat4 cameraLookAt(vec3 eye, vec3 target, vec3 up) {
  #if 1
  return inverse(lookAt(eye, target, up));
  #else
  vec3 zAxis = normalize(target - eye);
  vec3 xAxis = normalize(cross(up, zAxis));
  vec3 yAxis = cross(zAxis, xAxis);

  return mat4(
    xAxis, 0,
    yAxis, 0,
    zAxis, 0,
    -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1);  
  #endif
  
}



// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

// times 2 minus 1
float t2m1(float v) {
  return v * 2. - 1.;
}

// times .5 plus .5
float t5p5(float v) {
  return v * 0.5 + 0.5;
}

float inv(float v) {
  return 1. - v;
}


void main() {
  
  float near = 0.01;
  float far = 25.0;
  mat4 pmat = persp(radians(60.0), resolution.x / resolution.y, near, far);
  mat4 cmat = ident();
  cmat *= rotX(mouse.y *  PI);
  cmat *= rotY(mouse.x * -PI);
  mat4 vmat = inverse(cmat);
  
  vec3 pos = vec3(
      hash(vertexId * 0.123), 
      hash(vertexId * 0.357), 
  //    fract(hash(vertexId * 0.531) - time * .01)) * vec3(2, 2, -40) - vec3(1, 1, -20);
      fract(hash(vertexId * 0.531) + time * .05)) * 2. - 1.;
  float d = length(pos);
  pos *= vec3(2);
  
  vec3 boxMin = (cmat * vec4(-1, -1, 0, 1)).xyz;
  vec3 boxMax = (cmat * vec4(1, 1, -20, 1)).xyz;
  
  
  

  /*

  +--------+--------+--------+--------+
  |        |        |        |        |
  |        |\       |        |        |
  |        | \      |        |        |
  |        |  \     |        |        |
  +--------+--------+--------+--------+
  |        |    \   |        |        |
  |        |     \  |        |        |
  |        |      \ |        |        |
  |        |       \|        |        |
  +--------+--------c--------+--------+
  |        |       /|        |        |
  |        |      / |        |        |
  |        |     /  |        |        |
  |        |    /   |        |        |
  +--------+--------+--------+--------+
  |        |  /     |        |        |
  |        | /      |        |        |
  |        |/       |        |        |
  |        |        |        |        |
  +--------+--------+--------+--------+

  */
  
  
  //mat[2][2] /= far;
  //mat[2][3] /= far;
  
  gl_Position = pmat * vmat * vec4(pos, 1);
 // gl_Position.z = gl_Position.z * gl_Position.w / far;  

  
  /*
mat4 persp(float fov, float aspect, float zNear, float zFar) {
  float f = tan(PI * 0.5 - 0.5 * fov);
  float rangeInv = 1.0 / (zNear - zFar);

  return mat4(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2., 0);
}

   rangeInv = 1.0 / (near - far)
   rangnInv = 1.0 / (0.01 - 25.0)
   rangeInv = 1.0 / -24.99
   rangeInv = -0.040016006402561027

     -0.1 * (0.1 + 25.0) * -0.04001 + 1 * (0.1 * 25.0  * -0.04001) * 2 =  -0.000996
     -20  * (0.1 + 25.0) * -0.04001 + 1 * (0.1 * 25.0  * -0.04001) * 2 =  0.1988


  */
  
  vec4 f = gl_Position;
  float depth = f.z * .5 + .5;
  
  gl_PointSize = mix(10.0, 1.0, depth);
  v_color = vec4(hsv2rgb(vec3(hash(vertexId * 0.237), 0.25, 1)), 1. - d);
  v_color.rgb *= v_color.a;
//  v_color = vec4(hsv2rgb(vec3(depth, 1, 1)), 1);
}`
  },
  revisionId: "oTpAmrwEQsSFL3L3y",
  revisionUrl: "https://www.vertexshaderart.com/art/pfa9757K3NJx6euhN/revision/oTpAmrwEQsSFL3L3y",
  artUrl: "https://www.vertexshaderart.com/art/undefined"
};
