uniform vec3 modelColor;
uniform vec3 lightSourcePosition;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;
uniform sampler2D textureMap;
uniform sampler2D toneMap;

void main() {
    


    vec3 color = texture2D(textureMap, vUV).rgb;
    vec3 viewDirection = normalize(lightSourcePosition - vPosition) ;
    float diffuseStrength = max(0.0, dot(viewDirection, vNormal));

    float celShadingColor = 0.0;
    if (diffuseStrength > 0.9) {
        celShadingColor = 1.0;
    } else if (diffuseStrength > 0.5) {
        celShadingColor = 0.8;
    } else if (diffuseStrength > 0.25) {
        celShadingColor = 0.5;
    }
    else{
        celShadingColor = 0.0;
    }

    color = modelColor * celShadingColor;
    if(diffuseStrength > 0.99){
        color = vec3(1.0);
    }

    
    gl_FragColor = vec4(color.rgb, 1.0);
}

