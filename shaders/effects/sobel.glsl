uniform sampler2D tDiffuse;
uniform float kernelSize;
uniform float resX, resY;
uniform vec3 outlineColor;
varying vec2 vUV;
//vec4 Blur();
//float SobelOperator();
vec3 sobel(sampler2D textureSampler, vec2 texCoord, vec2 texelSize);

void main(){
    
    vec3 color = vec3(outlineColor.x, outlineColor.y, outlineColor.z);

    vec3 sobel = sobel(tDiffuse, vUV, vec2(1.0/1920.0, 1.0/1080.0));
    gl_FragColor = texture2D(tDiffuse, vUV);
    if(sobel.x > 0.1){
        gl_FragColor = vec4(sobel * color, 1.0);
    }
    
    
    
    
    
}

vec4 Blur(){
    vec4 addedValues = vec4(0.0);
    for(float i = -3.0; i <= 3.0; i = i + 1.0){
        for(float j = -3.0; j <= 3.0; j++){
            vec4 diffuse = texture2D(tDiffuse, vec2(vUV.x + i/resX, vUV.y + j/resX));
            addedValues += diffuse;
        }
        
    }
    addedValues = addedValues / (3.0 * 3.0);

    return addedValues;
}

float SobelOperator(){
    float sobelX[9] = float[9](-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
    float sobelY[9] = float[9](1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0);
    float GX, GY, index;
    float addedValuesX = 0.0;
    float addedValuesY = 0.0;
    vec3 diffuse = vec3(0.0,0.0,0.0);
    for(float i = -3.0; i <= 3.0; i = i + 1.0){
        for(float j = -3.0; j <= 3.0; j++){
            index = i * 3.0 + j;
            vec4 diffuse = texture2D(tDiffuse, vec2(vUV.x + i/1920.0, vUV.y + j/1080.0));
            float grayscale = (diffuse.x + diffuse.y + diffuse.z) / 3.0;
            addedValuesX += grayscale * sobelX[int(index)];
            addedValuesY += grayscale * sobelY[int(index)];
            
            
        }
        
    }

    float addedValues = sqrt(pow(addedValuesX, 2.0) + pow(addedValuesY, 2.0));
    addedValues /= 4.0;

    return addedValues;
}

vec3 sobel(sampler2D textureSampler, vec2 texCoord, vec2 texelSize) {
    // Sobel filter kernel
    mat3 sobelX = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);
    mat3 sobelY = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);

    vec3 sumX = vec3(0.0);
    vec3 sumY = vec3(0.0);

    // Apply Sobel filter in the horizontal direction
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec3 texSample = texture(textureSampler, texCoord + vec2(float(i), float(j)) * texelSize).rgb;
            sumX += texSample * sobelX[i + 1][j + 1];
            sumY += texSample * sobelY[i + 1][j + 1];
        }
    }

    // Combine the horizontal and vertical Sobel filters
    float sobelMagnitude = length(sumX.rgb) + length(sumY.rgb);
    return vec3(sobelMagnitude);
}