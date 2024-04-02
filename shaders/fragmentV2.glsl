uniform vec3 modelColor;
uniform vec3 ambient;
uniform vec3 lightSourcePosition;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {
    
    vec3 lightColor = vec3(1.0,1.0,1.0);
    vec3 lightSource = normalize(lightSourcePosition - vPosition);


    float diffuseStrength = max(0.0, dot(lightSource, vNormal));
    vec3 diffuse = diffuseStrength * lightColor;
    vec3 lighting = ambient * 0.0 + diffuse;

    vec3 color = modelColor * lighting;
    float GrayscaleColor = max(color.x, max(color.y, color.z));

    float celShadingColor = 0.0;
    if(GrayscaleColor > 0.99){
        celShadingColor = 2.0;
    }
    else if (GrayscaleColor > 0.95) {
        celShadingColor = 1.0;
    } else if (GrayscaleColor > 0.5) {
        celShadingColor = 0.8;
    } else if (GrayscaleColor > 0.25) {
        celShadingColor = 0.5;
    }
    else{
        celShadingColor = 0.3;
    }
    color = modelColor * celShadingColor;
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