
void main(){
    float InterpolatedColor = smoothstep(0.6, 0.65, InterpolatedColor);
    color = vec4(gl_FragColor - shadeValue/0.6, color.y - shadeValue/0.6, color.z - shadeValue/0.6, 1.0);
}