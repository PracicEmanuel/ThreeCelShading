varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
uniform sampler2D textureMap;

void main() {
    vec2 uv = vUV;
    float DimBy = 50.0;
    vec4 color = vec4(0.0, 1.0, 0.5, 1.0);
    float intensity = 60.0;
    float Smoothing = 0.01;

    intensity = intensity / 100.0;
    DimBy = 100.0 / DimBy * 2.0;


    uv -= vec2(0.5);
    uv *= 2.0;
    //dot product

    vec3 viewDirection = normalize(vec3(10,10,0) - vPosition) ;

    float angleDiff = acos(dot(viewDirection, vNormal)/(length(vNormal)*length(viewDirection)));
    
    float shadeValue = (angleDiff / 3.14159);

    shadeValue = smoothstep(intensity, intensity + Smoothing, shadeValue);

    color = vec4(color.x - shadeValue/DimBy, color.y - shadeValue/DimBy, color.z - shadeValue/DimBy, 1.0);

    gl_FragColor = color;

}

