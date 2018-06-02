/**
 * Created by anthony on 11.01.2018.
 */

// since line should not be lighten up
// we can remove all "light-related" evaluations from shaders
// all shader inputs are the same but no computations in shader
const vsSourceNoLight = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec3 aNormal;
    
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat4 uWorldInverseTranspose;
    
    varying vec3 fragColor;
    varying vec3 v_normal;
    
    void main() {
        mat4 mvp = uProjection * uView * uModel;
        gl_Position = mvp * vec4(aPosition, 1);
      
        fragColor = aColor;
    }
  `;

const fsSourceNoLight = `
    precision highp float;
    
    varying vec3 fragColor;
    varying vec3 v_normal;
    uniform vec3 uReverseLightDirection;
    
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
        // gl_FragColor = vec4(1.0, 0.0, 0, 0);    
    }
  `;


function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const typeStr = gl.VERTEX_SHADER === type
            ? 'VERTEX'
            : gl.FRAGMENT_SHADER === type ? 'FRAGMENT' : 'UNKNOWN';
        let errMsg = typeStr + ' shader compilation error: ' + gl.getShaderInfoLog(shader);
        errMsg += guessError(errMsg);

        gl.deleteShader(shader);
        throw Error(errMsg);

    } else {
        return shader;
    }
}


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));

    } else {
        return shaderProgram;
    }
}


const guessError = (errorMsg) => {
    if (-1 !== errorMsg.toLowerCase().indexOf('syntax error')) {
        return 'GUESS: check semicolons ";" at the end of strings\n';
    }
    return '';
};
