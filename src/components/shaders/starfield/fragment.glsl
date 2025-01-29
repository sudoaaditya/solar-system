uniform sampler2D pointTexture;
uniform float uTime;

varying vec3 vColor;
varying float vRandom;

void main() {

    vec4 color = vec4(vColor, 1.0);

    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
    color *= textureColor;

    float time = uTime * vRandom;
    float twinkle = 0.5 + 0.5 * sin(time  * 10.0);
    color.a *= twinkle;

    gl_FragColor = color;
}