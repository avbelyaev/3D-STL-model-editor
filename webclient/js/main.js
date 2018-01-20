
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
let angleInRadians = 0;
let camAngleRadians = 0;
let scale = 1;
const figureTranslation = [0, 0, 0];

const changeRange = () => {
    const rngX = document.getElementById("rngX");
    translation[0] = rngX.value;

    const rngY = document.getElementById("rngY");
    translation[1] = rngY.value;

    const rngZ = document.getElementById("rngZ");
    translation[2] = rngZ.value;

    const rngA = document.getElementById("rngA");
    angleInRadians = rngA.value * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);

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

function initMatrices(isMovable) {
    let perspective = mat4.create();
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 1000;
    const fieldOfViewRadians = Math.PI / 3;
    perspective = mat4.perspective(perspective, fieldOfViewRadians, aspect, zNear, zFar);

    // const translated = mat4.translate(perspective, perspective, [0, 0, -300]);
    const move = isMovable ? figureTranslation : [0, 0, 0];
    const translated = mat4.translate(perspective, perspective, move); // place objects at center
    let rotated = mat4.rotateX(translated, translated, 0);
    rotated = mat4.rotateY(rotated, rotated, -angleInRadians);
    rotated = mat4.rotateZ(rotated, rotated, -angleInRadians);
    const scaled = mat4.scale(rotated, rotated, [scale, scale, scale]);


    let cameraMatrix = mat4.create();
    cameraMatrix = mat4.rotateY(cameraMatrix, cameraMatrix, camAngleRadians);
    cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, [translation[0], translation[1], translation[2]]);
    const viewMatrix = mat4.invert(cameraMatrix, cameraMatrix);
    //
    // cameraMatrix = mat4.lookAt(perspective, [1, 1, 1], [0, 0, -300], [0, 1, 0]);
    // const viewMatrix = mat4.invert(cameraMatrix, cameraMatrix);

    const viewProjectionMatrix = mat4.multiply(scaled, scaled, viewMatrix);

    return viewProjectionMatrix;
}

function drawScene() {

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    gl.viewport(0, 0, w, h);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    figures.forEach((f) => {
        const figure = f.figureInfo;

        const programInfo = figure.programInfo;
        gl.useProgram(programInfo.program);

        // vertices
        enableAndBindBuffer(programInfo.attribLocations.vertexPosition, figure.positionBufferInfo);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,
            figure.positionBufferInfo.numComponents, gl.FLOAT, false, 0, 0);


        // colors
        bindBufferToAttribute(programInfo.attribLocations.vertexColors, figure.colorBufferInfo);


        //TODO set buffers and attribs

        const matrix = initMatrices(figure.movable);
        // set uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.uMatrix, false, matrix);

        gl.drawArrays(figure.drawMode, 0, figure.numElements);
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
    axisX.initBuffer();
    figures.push(axisX);

    const axisY = new Line(gl, [0, -400, 0], [0, 400, 0], [0, 255, 0]);
    axisY.setShaderSource(vsSource, fsSource);
    axisY.initBuffer();
    figures.push(axisY);

    const axisZ = new Line(gl, [0, 0, -400], [0, 0, 400], [0, 0, 255]);
    axisZ.setShaderSource(vsSource, fsSource);
    axisZ.initBuffer();
    figures.push(axisZ);

    const triangle = new Triangle(gl);
    triangle.setShaderSource(vsSource, fsSource);
    triangle.initBuffer();
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


