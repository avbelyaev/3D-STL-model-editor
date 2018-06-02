let gl;
let cam;
let idsOfFiguresToBeProcessed;
let figureController;
let operationPerformer;
let serverApiClient;
let logr;
let menu;
let sidebar;


const log = (text) => Menu.log(text);

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
    console.log('saving selected model');
    figureController.selectedFigure.updateFigure();

    const stlDataView = STLExporter.exportToBinaryStl(figureController.selectedFigure);

    const mimeTypeStl = "application/sla";
    const blob = new Blob([stlDataView], { type: mimeTypeStl });

    const blobUrl = URL.createObjectURL(blob);

    // assign name to blob via invisible link
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display: none";
    link.href = blobUrl;
    link.download = figureController.selectedFigure.id + ".stl";
    link.click();

    // remove link, revoke url
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(link);
};

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
    menu = new Menu();
    logr = menu.createLogger();
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


    // const trianglePositions = [
    //     50, -50, 0,
    //     -100, -50, 0,
    //     0, -50, 100
    // ];
    // const triangle = new Figure(trianglePositions, extendRandomColors(trianglePositions), gl, vsSource, fsSource, 'triangle');
    // console.log(triangle.positions);
    // console.log(triangle.translationVec);
    // triangle.init();
    // figureController.addDynamicFigure(triangle);


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
