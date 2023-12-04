/* eslint-disable require-trailing-comma/require-trailing-comma */
/* eslint-disable no-useless-escape */
export default {
  _id: "yX9SGHv6RPPqcsXvh",
  createdAt: "2017-01-28T04:48:49.529Z",
  modifiedAt: "2017-01-28T05:56:37.779Z",
  origId: "yX9SGHv6RPPqcsXvh",
  name: "discus",
  username: "gman",
  avatarUrl: "https://secure.gravatar.com/avatar/dcc0309895c3d6db087631813efaa9d1?default=retro&size=200",
  settings: {
    num: 100000,
    mode: "TRIANGLES",
    sound: "https://soundcloud.com/beatsfar/grand-mas-mandoline",
    lineSize: "NATIVE",
    backgroundColor: [
      1,
      0,
      0,
      1
    ],
    shader: `


#define PI radians(180.)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

mat4 rotY( float angle ) {
    float s = sin( angle );
    float c = cos( angle );
  	
    return mat4( 
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1);  
}


mat4 rotZ( float angle ) {
    float s = sin( angle );
    float c = cos( angle );
  	
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

// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * 0.5 + 0.5;
}

float inv(float v) {
  return 1. - v;
}

uniform float numSides;
#define NUM_EDGE_POINTS_PER_CIRCLE numSides
#define NUM_POINTS_PER_CIRCLE (NUM_EDGE_POINTS_PER_CIRCLE * 6.) 
#define NUM_CIRCLES_PER_GROUP 2.
void getCirclePoint(const float id, const float inner, const float start, const float end, out vec3 pos) {
  float outId = id - floor(id / 3.) * 2. - 1.;   // 0 1 2 3 4 5 6 7 8 .. 0 1 2, 1 2 3, 2 3 4
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx
  float u = ux / NUM_EDGE_POINTS_PER_CIRCLE;
  float v = mix(inner, 1., vy);
  float a = mix(start, end, u) * PI * 2. + PI * 0.0;
  float s = sin(a);
  float c = cos(a);
  float x = c * v;
  float y = s * v;
  float z = 0.;
  pos = vec3(x, y, z);  
}

float goop(float t) {
  return sin(t) + sin(t * 0.27) + sin(t * 0.13) + sin(t * 0.73);
}

float easeInOutSine(float t) {
  return (-0.5 * (cos(PI * t) - 1.));
}

float mixer(float t, float timeOff, float duration) {
  t = mod(t, duration * 2.0);
  t = t - timeOff;
  if (t > duration) {
    t = duration + 1. - t;
  }
  return easeInOutSine(clamp(t, 0., 1.));
}

uniform float speed;
uniform float brightness;
uniform vec3 color1;
uniform vec3 color2;
uniform float rotation;
uniform float split;

void main() {
  float circleId = floor(vertexId / NUM_POINTS_PER_CIRCLE);
  float groupId = floor(circleId / NUM_CIRCLES_PER_GROUP);
  float pointId = mod(vertexId, NUM_POINTS_PER_CIRCLE);
  float sliceId = mod(floor(vertexId / 6.), 2.);
  float side = mix(-1., 1., step(0.5, mod(circleId, 2.)));
  float numCircles = floor(vertexCount / NUM_POINTS_PER_CIRCLE);
  float numGroups = floor(numCircles / NUM_CIRCLES_PER_GROUP); 
  float cu = circleId / numCircles;
  float gv = groupId / numGroups;
  float cgId = mod(circleId, NUM_CIRCLES_PER_GROUP);
  float cgv = cgId / NUM_CIRCLES_PER_GROUP;
  float ncgv = 1. - cgv;
  
  
  float tm = time - cgv * 0.2;
  float su = hash(groupId);
  float snd = texture2D(sound, vec2(mix(0.01, 0.14, su), gv * 0.05)).a;
  
  //snd = pow(snd, mix(2., 0.5, su));
  
  
  vec3 pos;
  float inner = mix(0.0, 1. - pow(snd, 4.), cgId);
  float start = 0.;//fract(hash(sideId * 0.33) + sin(time * 0.1 + sideId) * 1.1);
  float end   = 1.; //start + hash(sideId + 1.);
  getCirclePoint(pointId, inner, start, end, pos); 
  pos.z = cgv;
  
//  float historyX = mix(0.01, 0.14, u);
//  snd = pow(snd, mix(2., 0.5, u));
  
  

  // ----
  float gDown = floor(sqrt(numGroups));
  float gAcross = floor(numGroups / gDown);
  vec3 offset0 = vec3(
    mod(groupId, gAcross) - (gAcross - 1.) / 2.,
    floor(groupId / gAcross) - (gDown - 1.) / 2.,
    0) * 0.2;
  
  // ----
  float ang = gv * 10.0;
  vec3 offset1 = vec3(cos(ang), sin(ang), 0) * gv * 0.5;

  // ----
  vec3 offset2 = (vec3(hash(groupId), hash(groupId * 0.37), 0) * 2. - 1.) * 0.8;
  
  // ----
  ang = gv * 20.0;
  float rad = floor(groupId / pow(2., gv + 3.));
  vec3 offset3 = vec3(cos(ang), sin(ang), 0) * mix(0.3, 0.7, rad);
  
  // 0-6  
  float m = 0.;tm; //mod(tm, 4. * 3.);
  float mix01 = mixer(m, 0., 3.);
  float mix23 = mixer(m, 0., 3.);
  float mix0123 = mixer(m, 0., 6.);
  vec3 offset = 
     mix(
       mix(offset0, offset1, mix01),
       mix(offset2, offset3, mix23),
       mix0123);
    
//  vec3 offset = vec3(hash(groupId) * 0.8, m1p1(hash(groupId * 0.37)), cgv);
//  offset.x += m1p1(pow(snd, 5.0) + goop(groupId + time * 0.) * 0.1);
//  offset.y += goop(groupId + time * 0.) * 0.1;
  vec3 aspect = vec3(1, resolution.x / resolution.y, 1);
  
  mat4 mat = ident(); 
  mat *= scale(aspect / gAcross * 12.);
  mat *= trans(vec3(0.25,0,0));
  mat *= rotZ(rotation);
  mat *= trans(offset);
  mat *= rotZ(offset.x * offset.y);
  float sp = pow(snd, 5.0);
  
  mat *= uniformScale(mix(sp, 1. - sp, cgId) * 0.1 + sliceId * 0.0);
  gl_Position = vec4((mat * vec4(pos, 1)).xyz, 1);
  gl_PointSize = 4.;

  float hue = tm * 0.0 + mix(0., 20.2, hash(groupId * 0.23));
  float sat = 1. - pow(snd, 5.);
  float pump = step(snd, split); //pow(snd, 2.);
  float val = pump * brightness;//ncgv;//1.;//mix(0.0, 0.0, fract(circleId * 0.79)) + sliceId * .65;
//  v_color = vec4(mix(color1, hsv2rgb(vec3(hue, sat, val)), pump), 1);
  v_color = vec4(mix(color1, color2, pump), 1);
  v_color.rgb *= v_color.a;
}
`
  },
  revisionId: "yX9SGHv6RPPqcsXvh",
  revisionUrl: "https://www.vertexshaderart.com/art/yX9SGHv6RPPqcsXvh/revision/yX9SGHv6RPPqcsXvh",
  artUrl: "https://www.vertexshaderart.com/art/yX9SGHv6RPPqcsXvh",
  origUrl: "https://www.vertexshaderart.com/art/yX9SGHv6RPPqcsXvh"
};
