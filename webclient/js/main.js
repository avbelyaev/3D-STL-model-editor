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
    attribute vec3 aNormal;
    
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat4 uWorldInverseTranspose;
    
    varying vec3 fragColor;
    varying vec3 v_normal;
    
    void main() {
        mat4 mvp = uProjection * uView * uModel;
        gl_Position = mvp * vec4(aPosition, 1);
      
        fragColor = aColor;
        v_normal = mat3(uWorldInverseTranspose) * aNormal;
    }
  `;

const fsSource = `
    precision highp float;
    
    varying vec3 fragColor;
    varying vec3 v_normal;
    uniform vec3 uReverseLightDirection;
    
    void main() {
        vec3 normal = normalize(v_normal);
        float light = dot(normal, uReverseLightDirection);
    
        gl_FragColor = vec4(fragColor, 1.0);
        // gl_FragColor = vec4(1.0, 0.0, 0, 0);
        
        gl_FragColor.rgb *= light;
    }
  `;


function drawScene() {
    resizeCanvas();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.6, 0.6, 0.6, 1.0);
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
    serverApiClient = new ServerApiClient('https', 'localhost', 443);
    log("FigureController, OperationPerformer have started");


    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // gl.enable(gl.CULL_FACE); // dont draw back-facing (clockwise vertices) triangles


    Grid.initDefaultGrid();
    Axis.initDefaultAxis();
    Cropper.initCroppers();


    // const letterF = new Figure(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource, 'letter-F', DRAWABLES.FIGURE);
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
