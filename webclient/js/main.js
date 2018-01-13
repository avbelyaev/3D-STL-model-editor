

let gl, figures;


const logr = (text) => {
    const log = document.getElementById("logr");
    log.textContent += (text + "\n");
    console.log(text);
};

let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;


const normalizeX = (posX) => {
    return (posX - gl.canvas.clientWidth / 2);
};

const normalizeY = (posY) => {
    return -(posY - gl.canvas.clientHeight / 2);
};

const handleMouseDown = (event) => {
    console.log("Down");

    mouseDown = true;
    lastMouseX = normalizeX(event.clientX);
    lastMouseY = normalizeY(event.clientY);
    console.log("lastX: " + lastMouseX + " lastY: " + lastMouseY);
};

const handleMouseUp = (event) => {
    console.log("Up");

    mouseDown = false;
    console.log("lastX: " + lastMouseX + " lastY: " + lastMouseY);
};

const handleMouseMove = (event) => {
    console.log("Move");

    if (!mouseDown) {
        return;
    }
    const newX = normalizeX(event.clientX);
    const newY = normalizeY(event.clientY);

    // const deltaX = newX - lastMouseX;
    // const deltaY = newY - lastMouseY;

    lastMouseX = newX;
    lastMouseY = newY;
};

const vsSourceAxis = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    
    varying vec3 fragColor;
    
    uniform float stageWidth;
    uniform float stageHeight;

    // TODO move normalize out from shader
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

const vsSource = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    
    varying vec3 fragColor;
    
    uniform float stageWidth;
    uniform float stageHeight;
    
    uniform float moveX;
    uniform float moveY;
    
    // TODO move normalize out from shader
    vec3 normalizeCoords(vec2 position) {
        float x = position[0];
        float y = position[1];
        float z = 1.0;
        
        // [0..w]/w -> [0..1]*2 -> [0..2]-1 -> [-1;1]
        float normalized_x = ((x + moveX) / stageWidth) * 2.0;    // -1.0
        float normalized_y = ((y + moveY) / stageHeight) * 2.0;   // -1.0
        
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
      //gl_FragColor = vec4(1.0, 0.0, 0, 0);
    }
  `;


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


function drawScene() {

    gl.clearColor(0.3, 0.3, 0.3, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const matrices = initMatrices(gl);

    figures.forEach((buffer) => {
        const programInfo = buffer.programInfo;

        bindBuffer(programInfo.attribLocations.vertexPosition, buffer.positionBufferInfo);
        bindBuffer(programInfo.attribLocations.vertexColors, buffer.colorBufferInfo);

        gl.useProgram(programInfo.program);

        // Set the shader uniforms
        // gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, matrices.projectionMatrix);
        // gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, matrices.modelViewMatrix);
        // gl.uniformMatrix4fv(programInfo.uniformLocations.resolutionMatrix, false, matrices.resolutionMatrix);

        gl.uniform1f(programInfo.uniformLocations.stageWidth, gl.canvas.clientWidth);
        gl.uniform1f(programInfo.uniformLocations.stageHeight, gl.canvas.clientHeight);

        gl.uniform1f(programInfo.uniformLocations.moveX, lastMouseX);
        gl.uniform1f(programInfo.uniformLocations.moveY, lastMouseY);


        const offset = 0;
        const vertexCount = buffer.numElements;
        gl.drawArrays(gl.LINE_LOOP, offset, vertexCount);

    });

    requestAnimationFrame(drawScene);
}


function main() {
    gl = initGL();

    // use black scene as fallback
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    figures = [];

    const triangle = new Triangle();
    const triangleBuffer = triangle.initBuffers(gl, vsSource, fsSource);
    figures.push(triangleBuffer);

    const axis = new Axis();
    const axisBuffer = axis.initBuffer(gl, vsSourceAxis, fsSource);
    figures.push(axisBuffer);


    requestAnimationFrame(drawScene);
}

window.addEventListener("DOMContentLoaded", () => {
    logr("DOM content loaded");
    try {
        main();

    } catch (e) {
        logr('Error: ' + e.message + '\n' + e.stack);
    }
}, false);


