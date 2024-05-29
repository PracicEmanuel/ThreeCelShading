uniform sampler2D tDiffuse, secGraphic;
varying vec2 vUV;


void main(){
    vec4 diffuse = texture2D(tDiffuse, vUV);
    vec4 SecurityColor = texture2D(secGraphic, vUV) + 0.5;
    vec4 finalColor = vec4(SecurityColor.x, SecurityColor.y, SecurityColor.z, 1.0) * diffuse;
    if(diffuse == vec4(1.0,1.0,1.0,1.0) || diffuse == vec4(0.0,0.0,.0,1.0)){
        finalColor = diffuse;
    }
    gl_FragColor = finalColor;
}