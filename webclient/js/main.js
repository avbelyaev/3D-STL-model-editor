let gl;
let cam;
let selectedFigure;
let idsOfFiguresToBeProcessed;
let figureController;
let operationPerformer;
let serverApiClient;
let logr;
let menu;


const log = (text) => {
    const dateTimeNow = new Date();
    const currentTime = dateTimeNow.getHours() + ":" +
        dateTimeNow.getMinutes() + ":" +
        dateTimeNow.getSeconds() + ":" +
        dateTimeNow.getMilliseconds();

    if ('string' === typeof text && text.toLowerCase().includes('error')) {
        text = `<span class=${H2JS_LOG_CONTENT_ERROR}>${text}</span>`;
    }

    logr.innerHTML += currentTime + "\t" + text + "<br>";
};

let figureAngleDeg = 0;
let figureScale = 1;

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

const saveSelectedModel = () => {
    figureController.selectedFigure.__updateWorldPosition();
};

const updateFigure = () => {
    const figAngleElem = document.getElementById("figAngle");
    figureAngleDeg = figAngleElem.value;

    const figScaleElem = document.getElementById("figScale");
    figureScale = figScaleElem.value;

    idsOfFiguresToBeProcessed = figureController.figuresToBeProcessed;

    const selectedFigure = figureController.selectedFigure;
    selectedFigure.scaleBy(figureScale);
    selectedFigure.rotateBy([figureAngleDeg, figureAngleDeg, 0], null); // TODO rotation point == translationVec?
};

const updateVisibility = (visibilityCheckbox) => {
    const figureId = visibilityCheckbox.getAttribute(figureController.figureIdAttrName);
    const figure = figureController.dynamicFigures.get(figureId);
    figure.visible = !figure.visible;
};

const resize = () => {
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
};


function drawScene() {
    resize();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    figureController.drawFigures();


    requestAnimationFrame(drawScene);
}


const initCamera = () => {
    const distance = 300;
    const horizontalAngleDeg = 30;
    const vertAngleDeg = 30;
    const lookAt = [0, 10, 0];

    return new Camera(distance, horizontalAngleDeg, vertAngleDeg, lookAt);
};

const initGL = () => {
    const canvas = document.getElementById(H2JS_CANVAS);
    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    return gl;
};

const renderUI = () => {
    logr = Sidebar.initLogger();
    Sidebar.renderOperations();
    Sidebar.renderAxis();

    menu = new Menu();
    new MouseControls();
    cam = initCamera();

    log("GUI has started");
};


function main() {
    renderUI();
    indexedDB = IndexedDB.init();
    gl = initGL();
    figureController = new FigureController();
    operationPerformer = new OperationPerformer();
    serverApiClient = new ServerApiClient('localhost', 5000);
    log("FigureController, OperationPerformer have started");


    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // gl.enable(gl.CULL_FACE); // dont draw back-facing (clockwise vertices) triangles


    const grid = new Grid(200, 10, COLORS.WHITE, gl, vsSource, fsSource, 'grid');
    grid.init();
    figureController.addStaticFigure(grid);

    initAxis();


    const trianglePositions = [
        50, -50, 0,
        -100, -50, 0,
        0, -50, 100
    ];
    const triangle = new Figure(trianglePositions, extendRandomColors(trianglePositions), gl, vsSource, fsSource, 'triangle');
    console.log(triangle.positions);
    console.log(triangle.translationVec);
    triangle.init();
    figureController.addDynamicFigure(triangle);


    // const letterF = new Figure(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource, 'letter-F');
    // letterF.init();
    // figureController.addDynamicFigure(letterF);


    log("Starting render loop");
    requestAnimationFrame(drawScene);
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("Launching editor");
    try {
        main();

    } catch (e) {
        console.log('Error: ' + e.message + '\n' + e.stack);
    }
}, false);
