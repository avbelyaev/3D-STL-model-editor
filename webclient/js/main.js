
let gl, figures = [];


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

const vsSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    
    uniform mat4 uMatrix;
    
    varying vec3 fragColor;
    
    void main() {
        gl_Position = uMatrix * vec4(aPosition, 1);
      
        fragColor = aColor;
    }
  `;

const fsSource = `
    precision highp float;
    
    varying vec3 fragColor;

    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
      // gl_FragColor = vec4(1.0, 0.0, 0, 0);
    }
  `;

const translation = [0, 0, 300];
const rotation = [0, 1];
let figureAngleInRadians = 0;
let camAngleRadians = 0;
let scale = 1;
const figureTranslation = [0, 0, -200];

const changeRange = () => {
    const rngX = document.getElementById("rngX");
    translation[0] = rngX.value;

    const rngY = document.getElementById("rngY");
    translation[1] = rngY.value;

    const rngZ = document.getElementById("rngZ");
    translation[2] = rngZ.value;

    const rngA = document.getElementById("rngA");
    figureAngleInRadians = rngA.value * Math.PI / 180;
    rotation[0] = Math.sin(figureAngleInRadians);
    rotation[1] = Math.cos(figureAngleInRadians);

    const rngS = document.getElementById("rngS");
    scale = rngS.value;

    const rngCam = document.getElementById("rngCam");
    camAngleRadians = rngCam.value * Math.PI / 180;
};

const moveFigure = () => {
    const rngX = document.getElementById("fX");
    figureTranslation[0] = rngX.value;

    const rngY = document.getElementById("fY");
    figureTranslation[1] = rngY.value;

    const rngZ = document.getElementById("fZ");
    figureTranslation[2] = rngZ.value;
};


/**
 * generates matrix to move everything from world space into clip space.
 * think of it as about transforming the whole scene into cube ([-1,-1,-1]..[1,1,1])
 * which is later rendered into 2D pane
 * @returns projection matrix
 */
function makeProjection() {
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 1000;
    const fieldOfViewRadians = Math.PI / 3;

    const perspective = mat4.create();
    mat4.perspective(perspective, fieldOfViewRadians, aspect, zNear, zFar);
    return perspective;
}

/**
 * moves everything from model space (coordinates relative to model) into world space
 * @returns model matrix
 */
function makeModel(isMovable) {
    const figureMove = isMovable ? figureTranslation : [0, 0, 0];
    const angle = isMovable ? figureAngleInRadians : 0;

    const model = mat4.create();
    const scaled = mat4.scale(model, model, [scale, scale, scale]);
    const translated = mat4.translate(scaled, scaled, figureMove); // place objects at center
    let rotated = mat4.rotateX(translated, translated, 0);
    rotated = mat4.rotateY(rotated, rotated, -angle);
    rotated = mat4.rotateZ(rotated, rotated, 0);

    return rotated;
}

/**
 * generates human-like POV. move everything from world space into camera space where camera is in the center
 * @returns view matrix
 */
function makeView() {
    let cameraMatrix = mat4.rotateY(mat4.create(), mat4.create(), camAngleRadians);
    cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, [translation[0], translation[1], translation[2]]);
    let viewMatrix = mat4.invert(cameraMatrix, cameraMatrix);
    return viewMatrix;
}

function initMatrices(isMovable) {
    let model = makeModel(isMovable);

    let view = makeView();

    let projection = makeProjection();

    const modelView = mat4.multiply(mat4.create(), view, model);
    const modelViewProjection = mat4.multiply(mat4.create(), projection, modelView);

    return modelViewProjection;
}

function drawScene() {

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    gl.viewport(0, 0, w, h);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    figures.forEach((f) => {

        gl.useProgram(f.program);

        // vertices
        bindBufferToAttribute(f.attribLocations.vertexPosition, f.positionBufferInfo);

        // colors
        bindBufferToAttribute(f.attribLocations.vertexColor, f.colorBufferInfo);

        // uniforms
        const m = initMatrices(f.movable);
        gl.uniformMatrix4fv(f.uniformLocations.uMatrix, false, m);

        // draw
        gl.drawArrays(f.drawMode, 0, f.numElements);
    });

    requestAnimationFrame(drawScene);
}


function main() {
    gl = initGL();

    gl.clearColor(0.3, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST); // check z-buffer for each pixel before rasterizing
    gl.depthFunc(gl.LEQUAL);


    const axisX = new Line(gl, [-400, 0, 0], [400, 0, 0], [255, 0, 0]);
    axisX.setShaderSource(vsSource, fsSource);
    axisX.initFigure();
    figures.push(axisX);

    const axisY = new Line(gl, [0, -400, 0], [0, 400, 0], [0, 255, 0]);
    axisY.setShaderSource(vsSource, fsSource);
    axisY.initFigure();
    figures.push(axisY);

    const axisZ = new Line(gl, [0, 0, -400], [0, 0, 400], [0, 0, 255]);
    axisZ.setShaderSource(vsSource, fsSource);
    axisZ.initFigure();
    figures.push(axisZ);

    const triangle = new Triangle(gl);
    triangle.setShaderSource(vsSource, fsSource);
    triangle.initFigure();
    figures.push(triangle);


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


