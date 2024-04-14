varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

void main(){
    vPosition = position;
    vNormal = normal;
    vUV = uv;

    vec4 modelViewPosition = modelViewMatrix * vec4(vPosition, 1.0);
    vec4 projectedPosition = projectionMatrix * modelViewPosition;

    gl_Position = projectedPosition;
}
