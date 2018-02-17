
let gl;
const figures = [];
const axes = [];
let cam;
let selectedFigure;

const log = (text) => {
    console.log(text);
};

let figureAngleDeg = 0;
let figureScale = 1;
const figureTranslation = [0, 0, 0];

const COLOR_WHITE = [255, 255, 255];
const COLOR_BLACK = [0, 0, 0];
const COLOR_YELLOW = [255, 255, 0];
const COLOR_RED = [255, 0, 0];
const COLOR_GREEN = [0, 255, 0];
const COLOR_BLUE = [0, 0, 255];

const vsSource = `
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

const updateFigure = () => {
    const figXElem = document.getElementById("figX");
    figureTranslation[0] = parseInt(figXElem.value);

    const figYElem = document.getElementById("figY");
    figureTranslation[1] = parseInt(figYElem.value);

    const figZElem = document.getElementById("figZ");
    figureTranslation[2] = parseInt(figZElem.value);

    const figAngleElem = document.getElementById("figAngle");
    figureAngleDeg = parseInt(figAngleElem.value);

    const figScaleElem = document.getElementById("figScale");
    figureScale = parseInt(figScaleElem.value);

    selectedFigure.scaleBy(figureScale);
    selectedFigure.translateBy(figureTranslation);
    selectedFigure.rotateBy([0, figureAngleDeg, 0], null);
};


let whiteLine, blackLine, yellowLine;


function drawScene() {

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    gl.viewport(0, 0, w, h);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    whiteLine.translateBy([50, -20, 50]);
    whiteLine.rotateBy([0, -figureAngleDeg / 3, 0], null);
    whiteLine.draw();

    yellowLine.translateBy([0, 100, 0]);
    yellowLine.rotateBy([0, figureAngleDeg, 0], null);
    yellowLine.draw();

    blackLine.draw();
    blackLine.rotateBy([0, -figureAngleDeg * 2, 0], null);


    axes.map(axis => axis.draw());
    figures.map(fig => fig.draw());


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


    const axisX = new Line([-400, 0, 0], [400, 0, 0], COLOR_RED, gl, vsSource, fsSource);
    axisX.init();
    axes.push(axisX);

    const axisY = new Line([0, -400, 0], [0, 400, 0], COLOR_GREEN, gl, vsSource, fsSource);
    axisY.init();
    axes.push(axisY);

    const axisZ = new Line([0, 0, -400], [0, 0, 400], COLOR_BLUE, gl, vsSource, fsSource);
    axisZ.init();
    axes.push(axisZ);



    whiteLine = new Line([100, 0, 80], [-100, 0, -80], COLOR_WHITE, gl, vsSource, fsSource);
    whiteLine.init();

    blackLine = new Line([-100, 0, 100], [100, 0, -100], COLOR_BLACK, gl, vsSource, fsSource);
    blackLine.init();

    yellowLine = new Line([-50, 0, 100], [50, 0, -100], COLOR_YELLOW, gl, vsSource, fsSource);
    yellowLine.init();


    const trianglePositions = [
        50, -50, 0,
        -100, -50, 0,
        0, -50, 100
    ];
    const triangle = new Polygon(trianglePositions, COLOR_GREEN, gl, vsSource, fsSource);
    triangle.init();
    figures.push(triangle);

    const letterF = new Polygon(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource);
    letterF.init();
    figures.push(letterF);
    selectedFigure = letterF;


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


