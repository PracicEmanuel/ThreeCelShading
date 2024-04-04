uniform vec3 modelColor;                                                        //base color of the model
uniform vec3 ambient;                                                           //ambient light
uniform vec3 lightSourcePosition;                                               //position of the light source
varying vec3 vNormal;                                                           //vertex/surface normal
varying vec3 vPosition;                                                         //vertex position


void main() {
    
    //vec3 lightColor = vec3(0.0,0.0,0.0);
    //vec3 lightSource = normalize(lightSourcePosition - vPosition);

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
        celShadingColor = 0.3;
    }
    vec3 color = modelColor * celShadingColor;
    if(diffuseStrength > 0.99){
        color = vec3(1.0);
    }

    
    gl_FragColor = vec4(color, 1.0);
}

    /*vec3 lightDirection = normalize(uDirLightPos);
    float intensity = dot(vNormal, lightDirection);
    vec3 celShadingColor = vec3(0.0);
    if (intensity > 0.95) {
        celShadingColor = vec3(1.0);
    } else if (intensity > 0.5) {
        celShadingColor = vec3(0.7);
    } else if (intensity > 0.25) {
        celShadingColor = vec3(0.5);
    } else {
        celShadingColor = vec3(0.3);
    }

    vec3 finalColor = celShadingColor * uDirLightColor + uAmbientLightColor;*/