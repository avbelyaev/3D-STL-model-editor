
let gl;
const oldFigures = [];
const figures = [];
const axes = [];
let cam;

const log = (text) => {
    console.log(text);
};

let figureAngleInRadians = 0;
let figureScale = 1;
const figureTranslation = [0, 0, 0];

const COLOR_WHITE = [255, 255, 255];
const COLOR_BLACK = [0, 0, 0];
const COLOR_YELLOW = [255, 255, 0];
const COLOR_RED = [255, 0, 0];
const COLOR_GREEN = [0, 255, 0];
const COLOR_BLUE = [0, 0, 255];

const vsSourceExplicitMatrices = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    varying vec3 fragColor;
    
    void main() {
        mat4 mvp = uProjection * uView * uModel;
        gl_Position = mvp * vec4(aPosition, 1);
      
        fragColor = aColor;
    }
  `;


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

const updateCamera = () => {
    const camDistElem = document.getElementById("camDist");
    cam.updateDistance(Camera.setValueFunction(camDistElem.value));

    const camHeightElem = document.getElementById("camHeight");
    cam.updateHeight(Camera.setValueFunction(camHeightElem.value));

    const camAngleElem = document.getElementById("camAngle");
    cam.updateAngleDeg(Camera.setValueFunction(camAngleElem.value));
};

const moveFigure = () => {
    const figXElem = document.getElementById("figX");
    figureTranslation[0] = parseInt(figXElem.value);

    const figYElem = document.getElementById("figY");
    figureTranslation[1] = parseInt(figYElem.value);

    const figZElem = document.getElementById("figZ");
    figureTranslation[2] = parseInt(figZElem.value);

    const figAngleElem = document.getElementById("figAngle");
    figureAngleInRadians = degToRad(parseInt(figAngleElem.value));

    const figScaleElem = document.getElementById("figScale");
    figureScale = parseInt(figScaleElem.value);
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
    let eye = cam.positionVec;
    let lookAtPosition = cam.lookAtPos;
    viewMatrix = mat4.lookAtPos(mat4.create(), eye, lookAtPosition, cam.top);

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

let whiteLine, blackLine, yellowLine;


function drawScene() {

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    gl.viewport(0, 0, w, h);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    whiteLine.translateBy([50, -20, 50]);
    whiteLine.rotateBy([0, -figureAngleInRadians / 3, 0], null);
    whiteLine.draw();

    yellowLine.translateBy([0, 100, 0]);
    yellowLine.rotateBy([0, figureAngleInRadians, 0], null);
    yellowLine.draw();

    blackLine.draw();
    blackLine.rotateBy([0, -figureAngleInRadians * 2, 0], null);


    axes.map(axis => axis.draw());
    figures.map(fig => fig.draw());

    oldFigures.forEach((f) => {

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

const initCamera = () => {
    const distance = 200;
    const angleDeg = 30;
    const height = 200;
    const position = [300, 200, 300];

    const camera = new Camera(distance, angleDeg, height, position);

    // for lookAtMatrix only
    const lookAt = [0, 3, 0];
    const straightTop = [0, 1, 0];
    camera.setLookAtMatrix(lookAt, straightTop);

    return camera;
};


function main() {
    gl = initGLControls();
    cam = initCamera();

    gl.clearColor(0.3, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE); // dont draw back-facing (clockwise vertices) triangles


    const axisX = new Line(gl, vsSourceExplicitMatrices, fsSource, [-400, 0, 0], [400, 0, 0], COLOR_RED);
    axisX.init();
    axes.push(axisX);

    const axisY = new Line(gl, vsSourceExplicitMatrices, fsSource, [0, -400, 0], [0, 400, 0], COLOR_GREEN);
    axisY.init();
    axes.push(axisY);

    const axisZ = new Line(gl, vsSourceExplicitMatrices, fsSource, [0, 0, -400], [0, 0, 400], COLOR_BLUE);
    axisZ.init();
    axes.push(axisZ);


    const figure = new Figure(gl);
    figure.setShaderSource(vsSource, fsSource);
    figure.initFigure();
    oldFigures.push(figure);


    whiteLine = new Line(gl, vsSourceExplicitMatrices, fsSource, [100, 0, 80], [-100, 0, -80], COLOR_WHITE);
    whiteLine.init();

    blackLine = new Line(gl, vsSourceExplicitMatrices, fsSource, [-100, 0, 100], [100, 0, -100], COLOR_BLACK);
    blackLine.init();

    yellowLine = new Line(gl, vsSourceExplicitMatrices, fsSource, [-50, 0, 100], [50, 0, -100], COLOR_YELLOW);
    yellowLine.init();

    const trianglePositions = [
        50, -50, 0,
        -100, -50, 0,
        0, -50, 100
    ];
    const triangle = new Triangle(gl, vsSourceExplicitMatrices, fsSource, trianglePositions, COLOR_GREEN);
    triangle.init();
    figures.push(triangle);


    requestAnimationFrame(drawScene);
}

window.addEventListener("DOMContentLoaded", () => {
    log("DOM content loaded");
    try {
        main();

    } catch (e) {
        log('Error: ' + e.message + '\n' + e.stack);
    }
}, false);


