uniform sampler2D tDiffuse;
varying vec2 vUV;

void main(){
    vec4 diffuse = texture2D(tDiffuse, vUV);
    gl_FragColor = diffuse;
}
