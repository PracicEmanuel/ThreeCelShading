uniform sampler2D textureSampler;
uniform vec2 textureSize;

varying vec2 vUV;

void main() {
    vec2 texCoord = vUV;

    // Gaussian kernel
    float kernel[5] = float[](0.06136, 0.24477, 0.38774, 0.24477, 0.06136);

    vec4 sum = vec4(0.0);

            // Horizontal blur
    for (int i = -2; i <= 2; ++i) {
        sum += texture(textureSampler, texCoord + vec2(float(i) / textureSize.x, 0.0)) * kernel[i + 2];
    }

            // Vertical blur
    for (int i = -2; i <= 2; ++i) {
        sum += texture(textureSampler, texCoord + vec2(0.0, float(i) / textureSize.y)) * kernel[i + 2];
    }

    gl_FragColor = sum;
}