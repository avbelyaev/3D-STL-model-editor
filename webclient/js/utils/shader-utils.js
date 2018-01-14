/**
 * Created by anthony on 11.01.2018.
 */

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const typeStr = gl.VERTEX_SHADER === type
            ? 'VERTEX'
            : gl.FRAGMENT_SHADER === type ? 'FRAGMENT' : '?UNKNOWN?';
        const errMsg = typeStr + ' shader compilation error: ' + gl.getShaderInfoLog(shader);

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
