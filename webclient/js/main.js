
const logr = (text) => {
    const log = document.getElementById("logr");
    log.textContent += (text + "\n");
};


const vsSource = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    
    varying vec3 fragColor;
    
    uniform float stageWidth;
    uniform float stageHeight;
    
    
    vec3 normalizeCoords(vec2 position) {
        float x = position[0];
        float y = position[1];
        float z = 1.0;
        
        // [0..w]/w -> [0..1]*2 -> [0..2]-1 -> [-1;1]
        float normalized_x = (x / stageWidth) * 2.0;    // -1.0
        float normalized_y = (y / stageHeight) * 2.0;   // -1.0
        
        return vec3(normalized_x, normalized_y, z);
    }
    
    void main() {
      gl_Position = vec4(normalizeCoords(aPosition).xyz, 1.0);
      
      // pass color to fragment shader
      fragColor = aColor;
    }
  `;

const fsSource = `
    precision highp float;
    
    varying vec3 fragColor;

    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
    }
  `;


function initBuffer(gl) {

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0, 0,
        0, 100.0,
        300.0, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colors = [
        // 1.0,  1.0,  1.0,
        1.0,  0.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  0.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    return {
        position: positionBuffer,
        color: colorBuffer
    };
}


function initMatrices(gl) {
    gl.clearColor(0.3, 0.3, 0.3, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    const screenHeight = 480;
    const screenWidth = 640;
    const resolutionMatrix = [
        1/screenWidth, 0, 0, 0,
        0, 1/screenHeight, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 0
    ];


    return {
        projectionMatrix: projectionMatrix,
        modelViewMatrix: modelViewMatrix,
        resolutionMatrix: resolutionMatrix
    }
}


function drawScene(gl, programInfo, buffers) {
    logr("drawing");

    const matrices = initMatrices(gl);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        const offset = 0;         // how many bytes inside the buffer to start from

        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);

    }

    // colors
    {
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColors);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);

        const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = true;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        const offset = 0;         // how many bytes inside the buffer to start from

        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColors,
            numComponents,
            type,
            normalize,
            stride,
            offset);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    // gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, matrices.projectionMatrix);
    // gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, matrices.modelViewMatrix);
    // gl.uniformMatrix4fv(programInfo.uniformLocations.resolutionMatrix, false, matrices.resolutionMatrix);
    // gl.uniform4f(programInfo.uniformLocations.offset, 0.5, 0.0, 0.0, 0.0);

    logr("w: " + gl.canvas.clientWidth + " h: " + gl.canvas.clientHeight);

    gl.uniform1f(programInfo.uniformLocations.stageWidth, gl.canvas.clientWidth);
    gl.uniform1f(programInfo.uniformLocations.stageHeight, gl.canvas.clientHeight);

    {
        const offset = 0;
        const vertexCount = 3;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}


function initGL() {
    const canvas = document.getElementById("glCanvas");
    canvas.width = 1024;
    canvas.height = 700;

    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return null;

    } else {
        return gl;
    }
}


function main() {
    const gl = initGL();

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);


    const buffers =  initBuffer(gl);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
            vertexColors: gl.getAttribLocation(shaderProgram, 'aColor')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            stageWidth: gl.getUniformLocation(shaderProgram, 'stageWidth'),
            stageHeight: gl.getUniformLocation(shaderProgram, 'stageHeight'),
            offset: gl.getUniformLocation(shaderProgram, 'uOffset')
        },
    };

    drawScene(gl, programInfo, buffers);
}

window.addEventListener("DOMContentLoaded", function () {
    logr("DOM content loaded");

    main();
}, false);


