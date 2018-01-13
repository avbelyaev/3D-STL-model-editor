/**
 * Created by anthony on 11.01.2018.
 */

function loadShader(gl, type, source, typeString) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const errMsg = 'An error occurred while compiling ' + typeString + ' shader: ' + gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);

        throw Error(errMsg);
    }
    return shader;
}


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource, 'VERTEX');
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource, 'FRAGMENT');

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const errMsg = 'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram);

        throw Error(errMsg);
    }
    return shaderProgram;
}
