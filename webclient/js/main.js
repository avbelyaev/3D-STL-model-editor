
let gl, figures = [];


const logr = (text) => {
    const log = document.getElementById("logr");
    log.textContent += (text + "\n");
    console.log(text);
};

let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;


let camDistance = 200;
let camAngleDeg = 30;
let camHeight = 200;
const camPosition = [300, 200, 300];


let figureAngleInRadians = 0;
let figureScale = 1;
const figureRotation = [0, 1];
const figureTranslation = [0, 0, 0];


const handleMouseDown = (event) => {
    console.log("Down");

    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log("lastX: " + lastMouseX + " lastY: " + lastMouseY);
};

const handleMouseUp = (event) => {
    console.log("Up");

    mouseDown = false;
    console.log("lastX: " + lastMouseX + " lastY: " + lastMouseY);
};

const degToRad = (x) => x * Math.PI / 180;

const handleMouseMove = (event) => {
    if (!mouseDown) {
        return;
    }
    const newX = event.clientX;
    const newY = event.clientY;

    const deltaX = newX - lastMouseX;
    camAngleDeg -= deltaX / 5;

    const deltaY = newY - lastMouseY;
    camHeight += deltaY;
    if (camHeight > 600) {
        camHeight = 600;
    }
    if (camHeight < -600) {
        camHeight = -600;
    }

    lastMouseX = newX;
    lastMouseY = newY;
};

const handleMouseWheel = (e) => {
    let delta = e.wheelDelta ? e.wheelDelta : -e.detail;
    camDistance += parseInt(delta) / 10;
    if (camDistance > 500) {
        camDistance = 500;
    }
    if (camDistance < 50) {
        camDistance = 50;
    }
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

const changeRange = () => {
    const camDistElem = document.getElementById("camDist");
    camDistance = parseInt(camDistElem.value);

    const camHeightElem = document.getElementById("camHeight");
    camHeight = parseInt(camHeightElem.value);

    const camAngleElem = document.getElementById("camAngle");
    camAngleDeg = parseInt(camAngleElem.value);
};

const moveFigure = () => {
    const figXElem = document.getElementById("figX");
    figureTranslation[0] = figXElem.value;

    const figYElem = document.getElementById("figY");
    figureTranslation[1] = figYElem.value;

    const figZElem = document.getElementById("figZ");
    figureTranslation[2] = figZElem.value;

    const figAngleElem = document.getElementById("figAngle");
    figureAngleInRadians = figAngleElem.value * Math.PI / 180;
    figureRotation[0] = Math.sin(figureAngleInRadians);
    figureRotation[1] = Math.cos(figureAngleInRadians);

    const figScaleElem = document.getElementById("figScale");
    figureScale = figScaleElem.value;
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

    const modelMatrix = mat4.create();
    const scaled = mat4.scale(modelMatrix, modelMatrix, [figureScale, figureScale, figureScale]);
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
    let viewMatrix;
    {
        camPosition[0] = Math.sin(degToRad(camAngleDeg)) * camDistance;
        camPosition[1] = camHeight;
        camPosition[2] = Math.cos(degToRad(camAngleDeg)) * camDistance;
    }

    let eye = [camPosition[0], camPosition[1], camPosition[2]];
    let lookAtPosition = [0, 3, 0];
    viewMatrix = mat4.lookAt(mat4.create(), eye, lookAtPosition, [0, 1, 0]);

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

let poly;

function drawScene() {

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    gl.viewport(0, 0, w, h);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    const tmpModel = makeModel(poly.movable);
    mat4.translate(tmpModel, tmpModel, [-100, 0, 100]);
    const tmpView = makeView();
    const tmpProj = makeProjection();
    const modelView = mat4.multiply(mat4.create(), tmpView, tmpModel);
    const modelViewProjection = mat4.multiply(mat4.create(), tmpProj, modelView);
    poly.draw(modelViewProjection);

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

    gl.enable(gl.DEPTH_TEST);
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

    poly = new Polygon(gl);
    poly.setVertices([
        0, 0, 0,
        100, 0, 0,
        0, 200, 100
    ]);
    poly.setColors([
        255, 0, 0,
        0, 255, 0,
        0, 0, 255
    ]);
    poly.setShaderSource(vsSource, fsSource);
    poly.initFigure();


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


