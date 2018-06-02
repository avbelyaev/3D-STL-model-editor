let gl;
let cam;
let figureController;
let operationPerformer;
let serverApiClient;
let logr;
let menu;
let sidebar;

const log = (text) => Menu.log(text);

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

const resizeCanvas = () => {
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
};


function drawScene() {
    resizeCanvas();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    figureController.drawFigures();


    requestAnimationFrame(drawScene);
}


const initCamera = () => {
    const distance = 600;
    const horizontalAngleDeg = 0; //angle = AOZ where A is a cam vec
    const vertAngleDeg = 60;
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
    menu = new Menu();
    logr = menu.getLogger();
    new MouseControls();
    cam = initCamera();
    sidebar = new Sidebar();

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


    const letterF = new Figure(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource, 'letter-F');
    letterF.init();
    figureController.addDynamicFigure(letterF);

    const letterFF = new Figure(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource, 'letter-F');
    letterFF.init();
    figureController.addDynamicFigure(letterFF);


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
