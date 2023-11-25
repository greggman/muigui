/* eslint-disable require-trailing-comma/require-trailing-comma */
/* eslint-disable no-useless-escape */
export default {
  _id: "bbsF39W6bJo3j4R3j",
  createdAt: "2016-01-09T08:24:22.209Z",
  modifiedAt: "2016-01-25T18:24:26.127Z",
  origId: "xvg4vyvfWjCvKZQfW",
  name: "cyty",
  username: "gman",
  avatarUrl: "https://secure.gravatar.com/avatar/dcc0309895c3d6db087631813efaa9d1?default=retro&size=200",
  settings: {
    num: 100000,
    mode: "TRIANGLES",
    sound: "https://soundcloud.com/stuart-king/kraftwerk-the-model-stuart",
    lineSize: "NATIVE",
    backgroundColor: [
      1,
      1,
      1,
      1
    ],
    shader: `/*

 ___      ___ _______   ________  _________  _______      ___    ___ 
|\  \    /  /|\  ___ \ |\   __  \|\___   ___|\  ___ \    |\  \  /  /|
\ \  \  /  / \ \   __/|\ \  \|\  \|___ \  \_\ \   __/|   \ \  \/  / /
 \ \  \/  / / \ \  \_|/_\ \   _  _\   \ \  \ \ \  \_|/__  \ \    / / 
  \ \    / /   \ \  \_|\ \ \  \\  \|   \ \  \ \ \  \_|\ \  /     \/  
   \ \__/ /     \ \_______\ \__\\ _\    \ \__\ \ \_______\/  /\   \  
    \|__|/       \|_______|\|__|\|__|    \|__|  \|_______/__/ /\ __\ 
                                                         |__|/ \|__| 
                                                                     
                                                                     
 ________  ___  ___  ________  ________  _______   ________          
|\   ____\|\  \|\  \|\   __  \|\   ___ \|\  ___ \ |\   __  \         
\ \  \___|\ \  \\\  \ \  \|\  \ \  \_|\ \ \   __/|\ \  \|\  \        
 \ \_____  \ \   __  \ \   __  \ \  \ \\ \ \  \_|/_\ \   _  _\       
  \|____|\  \ \  \ \  \ \  \ \  \ \  \_\\ \ \  \_|\ \ \  \\  \|      
    ____\_\  \ \__\ \__\ \__\ \__\ \_______\ \_______\ \__\\ _\      
   |\_________\|__|\|__|\|__|\|__|\|_______|\|_______|\|__|\|__|     
   \|_________|                                                      
                                                                     
                                                                     
 ________  ________  _________                                       
|\   __  \|\   __  \|\___   ___\                                     
\ \  \|\  \ \  \|\  \|___ \  \_|                                     
 \ \   __  \ \   _  _\   \ \  \                                      
  \ \  \ \  \ \  \\  \|   \ \  \                                     
   \ \__\ \__\ \__\\ _\    \ \__\                                    
    \|__|\|__|\|__|\|__|    \|__|                                    
                                                                     
                                                                     
                                                                     






























*/

vec3 gSunColor = vec3(1.0, 1.2, 1.4) * 10.;  

vec3 gSkyTop =  vec3( 0.1, 0.2, 0.8 ) * 0.5;
vec3 gSkyBottom = vec3( 0.5, 0.8, 1.0 ) * 1.5;

vec3 gCubeColor = vec3(1.0, 1.0, 1.0);
float gExposure = 0.3;

float gCubeColorRandom = 0.0;

#define MOVE_OUTWARDS

float fAOAmount = 0.8;
float gFloorHeight = -1.0;
float g_cameraFar = 1000.0;

#define PI radians( 180.0 )


vec3 GetSunDir()
{
  	return normalize( vec3( 20.0, 40.3, -10.4 ) );
}


void GetQuadInfo( const float vertexIndex, out vec2 quadVertId, out float quadId )
{
    float twoTriVertexIndex = mod( vertexIndex, 6.0 );
    float triVertexIndex = mod( vertexIndex, 3.0 );
  
    if 		( twoTriVertexIndex < 0.5 ) quadVertId = vec2( 0.0, 0.0 );
    else if	( twoTriVertexIndex < 1.5 )	quadVertId = vec2( 1.0, 0.0 );
    else if ( twoTriVertexIndex < 2.5 )	quadVertId = vec2( 0.0, 1.0 );
    else if ( twoTriVertexIndex < 3.5 )	quadVertId = vec2( 1.0, 0.0 );
    else if ( twoTriVertexIndex < 4.5 )	quadVertId = vec2( 1.0, 1.0 );
    else 								quadVertId = vec2( 0.0, 1.0 );

    quadId = floor( vertexIndex / 6.0 );
}


void GetQuadTileInfo( const vec2 quadVertId, const float quadId, const vec2 vDim, out vec2 vQuadTileIndex, out vec2 vQuadUV )
{
    vQuadTileIndex.x = floor( mod( quadId, vDim.x ) );
    vQuadTileIndex.y = floor( quadId / vDim.x );

  	vQuadUV.x = floor(quadVertId.x + vQuadTileIndex.x);
    vQuadUV.y = floor(quadVertId.y + vQuadTileIndex.y);

    vQuadUV = vQuadUV * (1.0 / vDim);
}


void GetQuadTileInfo( const float vertexIndex, const vec2 vDim, out vec2 vQuadTileIndex, out vec2 vQuadUV )
{
  	vec2 quadVertId;
  	float quadId;
	GetQuadInfo( vertexIndex, quadVertId, quadId );  
  	GetQuadTileInfo( quadVertId, quadId, vDim, vQuadTileIndex, vQuadUV );   
}


void GetMatrixFromZY( const vec3 vZ, const vec3 vY, out mat3 m )
{
   vec3 vX = normalize( cross( vY, vZ ) );
   vec3 vOrthoY = normalize( cross( vZ, vX ) );
   m[0] = vX;
   m[1] = vOrthoY;
   m[2] = vZ;
}


void GetMatrixFromZ( vec3 vZAxis, out mat3 m )
{
  	vec3 vZ = normalize(vZAxis);
   	vec3 vY = vec3( 0.0, 1.0, 0.0 );
  	if ( abs(vZ.y) > 0.99 )
    {
       vY = vec3( 1.0, 0.0, 0.0 );
    }
  	GetMatrixFromZY( vZ, vY, m );
}


struct SceneVertex
{
  	vec3 vWorldPos;
  	vec3 vColor;
  	float fAlpha;
};


float GetCosSunRadius()
{
  return 0.01;
}


float GetSunIntensity()
{  	
  	return 0.001;
}


vec3 GetSkyColor( vec3 vViewDir )
{
	return mix( gSkyBottom, gSkyTop, max( 0.0, vViewDir.y ) );
}
#define g_cubeFaces					6.0
#define g_cubeVerticesPerFace		( 2.0 * 3.0 )
#define g_cubeVertexCount 			( g_cubeVerticesPerFace * g_cubeFaces )

//                   6          7
//                    +----------+
//                   /|         /|
//                2 / |       3/ |
//                 +----------+  |
//                 |  |       |  |
//      Y   Z      | 4|       | 5|
//                 |  +-------|--+
//      ^ /        | /        | /
//      |/        0|/        1|/
//      +--> X     +----------+
  
vec3 GetCubeVertex( float fVertexIndex )
{
	vec3 fResult = vec3( 1.0 );
  
  	float f = fVertexIndex / 8.0;
  	if ( fract( f * 4.0 ) < 0.5 )
    {
    	fResult.x = -fResult.x;
    }
  
  	if ( fract( f * 2.0 ) < 0.5 )
    {
    	fResult.y = -fResult.y;
    }

  	if ( fract( f ) < 0.5 )
    {
    	fResult.z = -fResult.z;
    }
  
  	return fResult;
}


void GetCubeVertex( const float vertexIndex, const mat4 mat, out vec3 vWorldPos, out vec3 vWorldNormal )
{
  	float fFaceIndex = floor( vertexIndex / g_cubeFaces );

  	vec3 v0, v1, v2, v3;
  
  	if ( fFaceIndex < 0.5 )
    {
      	v0 = GetCubeVertex( 0.0 );
      	v1 = GetCubeVertex( 2.0 );
      	v2 = GetCubeVertex( 3.0 );
      	v3 = GetCubeVertex( 1.0 );
    }
  	else if ( fFaceIndex < 1.5 )
    {
      	v0 = GetCubeVertex( 5.0 );
      	v1 = GetCubeVertex( 7.0 );
      	v2 = GetCubeVertex( 6.0 );
      	v3 = GetCubeVertex( 4.0 );
    }
  	else if ( fFaceIndex < 2.5 )
    {
      	v0 = GetCubeVertex( 1.0 );
      	v1 = GetCubeVertex( 3.0 );
      	v2 = GetCubeVertex( 7.0 );
      	v3 = GetCubeVertex( 5.0 );
    }
  	else if ( fFaceIndex < 3.5 )
    {
      	v0 = GetCubeVertex( 4.0 );
      	v1 = GetCubeVertex( 6.0 );
      	v2 = GetCubeVertex( 2.0 );
      	v3 = GetCubeVertex( 0.0 );
    }
  	else if ( fFaceIndex < 4.5 )
    {
      	v0 = GetCubeVertex( 2.0 );
      	v1 = GetCubeVertex( 6.0 );
      	v2 = GetCubeVertex( 7.0 );
      	v3 = GetCubeVertex( 3.0 );
    }
  	else
    {
      	v0 = GetCubeVertex( 1.0 );
      	v1 = GetCubeVertex( 5.0 );
      	v2 = GetCubeVertex( 4.0 );
      	v3 = GetCubeVertex( 0.0 );
    }
  #if 0
  	v0 = (vec4(v0, 1) * mat).xyz;
  	v1 = (vec4(v1, 1) * mat).xyz;
  	v2 = (vec4(v2, 1) * mat).xyz;
  	v3 = (vec4(v3, 1) * mat).xyz;
  #else
  	v0 = (mat * vec4(v0, 1)).xyz;
  	v1 = (mat * vec4(v1, 1)).xyz;
  	v2 = (mat * vec4(v2, 1)).xyz;
  	v3 = (mat * vec4(v3, 1)).xyz;
  #endif
  	float fFaceVertexIndex = mod( vertexIndex, 6.0 );
  
  	if ( fFaceVertexIndex < 0.5 )
    {
	  	vWorldPos = v0;
    }
  	else if ( fFaceVertexIndex < 1.5 )
    {
	  	vWorldPos = v1;
    }
  	else if ( fFaceVertexIndex < 2.5 )
    {
	  	vWorldPos = v2;
    }
  	else if ( fFaceVertexIndex < 3.5 )
    {
	  	vWorldPos = v0;
    }
  	else if ( fFaceVertexIndex < 4.5 )
    {
	  	vWorldPos = v2;
    }
  	else
    {
	  	vWorldPos = v3;
    }
  
  	vWorldNormal = normalize( cross( v1 - v0, v2 - v0 ) );  
}


vec3 GetSunLighting( const vec3 vNormal )
{
  	vec3 vLight = -GetSunDir();
  
  	float NdotL = max( 0.0, dot( vNormal, -vLight ) );
 	  
  	return gSunColor * NdotL;
}


vec3 GetSunSpec( const vec3 vPos, const vec3 vNormal, const vec3 vCameraPos )
{
  	vec3 vLight = -GetSunDir();

  	vec3 vView = normalize( vCameraPos - vPos );
  
  	vec3 vH = normalize( vView - vLight );
  
  	float NdotH = max( 0.0, dot( vNormal, vH ) );
  	float NdotL = max( 0.0, dot( vNormal, -vLight ) );
 
  	float f = mix( 0.01, 1.0, pow( 1.0 - NdotL, 5.0 ) );
  
  	return gSunColor * pow( NdotH, 20.0 ) * NdotL * f * 4.0;
}


vec3 GetSkyLighting( const vec3 vNormal )
{
  	vec3 vSkyLight = normalize( vec3( -1.0, -2.0, -0.5 ) );
  
  	float fSkyBlend = vNormal.y * 0.5 + 0.5;
 
  	return mix( gSkyBottom, gSkyTop, fSkyBlend );
}


void GenerateCubeVertex( const float vertexIndex, const mat4 mat, const vec3 vCubeCol, const vec3 vCameraPos, out SceneVertex outSceneVertex )
{  
  vec3 vNormal;

  GetCubeVertex( vertexIndex, mat, outSceneVertex.vWorldPos, vNormal );

  outSceneVertex.vColor = vec3( 0.0 );

  outSceneVertex.fAlpha = 1.0;  

  float h = outSceneVertex.vWorldPos.y - gFloorHeight;
  outSceneVertex.vColor += GetSkyLighting( vNormal );
  outSceneVertex.vColor *= mix( 1.0, fAOAmount, clamp( h, 0.0, 1.0 ) );

  outSceneVertex.vColor += GetSunLighting( vNormal );

  outSceneVertex.vColor *= vCubeCol;      

  outSceneVertex.vColor += GetSunSpec( outSceneVertex.vWorldPos, vNormal, vCameraPos );
}



// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p)
{
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
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
  #if 0
  return mat4(
    1, 0, 0, trans[0],
    0, 1, 0, trans[1],
    0, 0, 1, trans[2],
    0, 0, 0, 1);
  #else
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    trans, 1);
  #endif
}

mat4 ident() {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);
}

mat4 uniformScale(float s) {
  return mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1);
}

mat4 scale(vec3 s) {
  return mat4(
    s[0], 0, 0, 0,
    0, s[1], 0, 0,
    0, 0, s[2], 0,
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


float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * .5 + .5;
}

float inRange(float v, float minV, float maxV) {
  return step(minV, v) * step(v, maxV);
}

float at(float v, float target) {
  return inRange(v, target - 0.1, target + 0.1);
}


const float perBlock = 4.;

void GetCubePosition( float fCubeId, float numCubes, out mat4 mat, out vec4 vCubeCol )
{  
  	float fSeed = fCubeId;
  	float fPositionBase = fCubeId;
  	float fSize = 1.0;

  	vec3 vCubeOrigin = vec3( 0.0, 0.0, 0.0 );
  
    float across = 48.;
    float down = 32.;
    float uId = mod(fCubeId, across);
    float vId = floor(fCubeId / across);
    float u = uId / (across - .1);
    float v = vId / down;
    float bxId = floor(uId / perBlock);
    float bzId = floor(vId / perBlock);
    float numRows = floor(numCubes / across);
    float numBlocks = floor(numRows / perBlock);

    float snd = texture2D(sound, vec2(mix(0.015, 0.015, u), v * 0.1)).a;
    float s2 = texture2D(sound, vec2(mix(0.02, 0.04, hash(u + v + 2.34)), hash(v) * 0.05)).a;
  
    vCubeOrigin.x += m1p1(u) * across * 1.05 + bxId;
    float vSpace = numRows * 2.05 + numBlocks * 2.;
    float z = v * down * 2.05 + bzId * 2.;
    vCubeOrigin.z += fract(-time * 0.2 + z / vSpace) * vSpace;
    float height = mix(0.1, 0.5, hash(fCubeId)) + smoothstep(0.75, 1., s2) * 1.;
    vCubeOrigin.y += height;;
  
    mat  = ident();
    mat *= trans(vCubeOrigin);
    mat *= scale(vec3(1, height, 1));
  
  	vec3 vRandCol;

  
    vCubeCol.rgb = vec3(1);//mix(vec3(0.5), vec3(1,1,1), pow(s2, 40.0));  
    vCubeCol.rgb = mix(vCubeCol.rgb, vec3(0,0.5,1), step(0.75,s2));
    //vCubeCol.rgb = vec3(1. - pow(s2, 3.));
    vCubeCol.a = vCubeOrigin.z / vSpace;
}

float goop(float t) {
  return sin(t) * sin(t * 0.27) * sin(t * 0.13) * sin(t * 0.73);
}


void main()
{ 
  	SceneVertex sceneVertex;
  
  	float fov = 1.8;
  
  	vec3 vCameraTarget = vec3( 10, 5.6, 1.0 );
  	vec3 vCameraPos = vec3(10.1, 6., -0.);
    float ca = 0.;
  
 // get sick!
 // ca = time + sin(time) * 2.;
  	vec3 vCameraUp = vec3( sin(ca), cos(ca), 0.0 );
  
  	vec3 vCameraForwards = normalize(vCameraTarget - vCameraPos);
  
  	mat3 mCamera;
    GetMatrixFromZY( vCameraForwards, normalize(vCameraUp), mCamera );
  
  	float vertexIndex = vertexId;
  
  
    float fCubeId = floor( vertexIndex / g_cubeVertexCount );
    float fCubeVertex = mod( vertexIndex, g_cubeVertexCount );
    float fNumCubes = floor( vertexCount / g_cubeVertexCount );
  
    mat4 mCube;
    vec4 vCubeCol;

    GetCubePosition( fCubeId, fNumCubes, mCube, vCubeCol );

    GenerateCubeVertex( fCubeVertex, mCube, vCubeCol.xyz, vCameraPos, sceneVertex );

    mat4 m = persp(radians(45.), resolution.x / resolution.y, 0.1, 1000.);
    m *= cameraLookAt(vCameraPos, vCameraTarget, vCameraUp);
    gl_Position = m * vec4(sceneVertex.vWorldPos, 1);
    
  	// Final output color
  	float fExposure = gExposure;// min( gExposure, time * 0.1 );
  	vec3 vFinalColor = sqrt( vec3(1.0) - exp2( sceneVertex.vColor * -fExposure ) );
  
  	v_color = mix(vec4(vFinalColor, 1), background, vCubeCol.a);
  
}`
  },
  revisionId: "8z2whXqEmXfeJTPD8",
  revisionUrl: "https://www.vertexshaderart.com/art/bbsF39W6bJo3j4R3j/revision/8z2whXqEmXfeJTPD8",
  artUrl: "https://www.vertexshaderart.com/art/undefined",
  origUrl: "https://www.vertexshaderart.com/art/xvg4vyvfWjCvKZQfW"
};
