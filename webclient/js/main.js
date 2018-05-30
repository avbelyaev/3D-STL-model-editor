let gl;
let cam;
let selectedFigure;
let idsOfFiguresToBeProcessed;
let figureController;
let modelSubmitter;
let serverApiClient;

let logr;

const initLogger = () => {
    const logElement = document.getElementsByClassName(H2JS_LOG)[0];
    const logContentHolder = logElement.getElementsByClassName(H2JS_LOG_CONTENT)[0];

    // make logger resizable
    const logElementClass = '.' + H2JS_LOG;
    interact(logElementClass)
        .resizable({
            edges: {
                top: true,
                bottom: false
            },
            restrictEdges: {
                outer: 'parent',
                endOnly: true,
            },
            restrictSize: {
                min: {
                    height: 150
                }
            }
        })
        .on('resizemove', function (event) {
            const target = event.target;
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + 0 + 'px,' + y + 'px)';

            target.setAttribute('data-y', y);
        });

    return logContentHolder;
};


const log = (text) => {
    const dateTimeNow = new Date();
    const currentTime = dateTimeNow.getHours() + ":" +
        dateTimeNow.getMinutes() + ":" +
        dateTimeNow.getSeconds() + ":" +
        dateTimeNow.getMilliseconds();

    if ('string' === typeof text && text.toLowerCase().includes('error')) {
        text = `<span class=${H2JS_LOG_CONTENT_ERROR}>${text}</span>`;
    }

    logr.innerHTML += currentTime + " " + text + "<br>";
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

const updateFigure = () => {
    const figAngleElem = document.getElementById("figAngle");
    figureAngleDeg = figAngleElem.value;

    const figScaleElem = document.getElementById("figScale");
    figureScale = figScaleElem.value;

    idsOfFiguresToBeProcessed = figureController.figuresToBeProcessed;

    selectedFigure = figureController.selectedFigure;
    selectedFigure.scaleBy(figureScale);
    selectedFigure.rotateBy([0, figureAngleDeg, 0], null);
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
    const distance = 200;
    const horizontalAngleDeg = 30;
    const vertAngleDeg = 30;
    const lookAt = [0, 10, 0];

    return new Camera(distance, horizontalAngleDeg, vertAngleDeg, lookAt);
};

const initGLControls = () => {
    const canvas = document.getElementById(H2JS_CANVAS);
    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    const controls = new MouseControls(canvas);

    return gl;
};

const renderGUI = () => {
    GuiRenderer.renderOperations();
    GuiRenderer.renderAxis();
};


function main() {
    renderGUI();
    gl = initGLControls();
    cam = initCamera();
    figureController = new FigureController();
    modelSubmitter = new ModelSubmitter();
    serverApiClient = new ServerApiClient('localhost', 8000);


    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // gl.enable(gl.CULL_FACE); // dont draw back-facing (clockwise vertices) triangles


    const axisY = new Line([0, -400, 0], [0, 400, 0], COLORS.GREEN, gl, vsSource, fsSource, 'axisY');
    axisY.init();
    figureController.addStaticFigure(axisY);

    const grid = new Grid(200, 10, COLORS.WHITE, gl, vsSource, fsSource, 'griddy');
    grid.init();
    figureController.addStaticFigure(grid);


    const trianglePositions = [
        50, -50, 0,
        -100, -50, 0,
        0, -50, 100
    ];
    const triangle = new Figure(trianglePositions, COLORS.RANDOM(), gl, vsSource, fsSource, 'triangle');
    triangle.init();
    figureController.addDynamicFigure(triangle);

    const letterF = new Figure(LetterF.positions(), LetterF.colors(), gl, vsSource, fsSource, 'letter-F');
    letterF.init();
    figureController.addDynamicFigure(letterF);


    // add mesh stub from geometry server
    serverApiClient.meshStub(response => {
        const data = response.data;
        log(data);

        const stub = Figure.ofInnerRepresentation(data, 'stub');
        stub.init();
        figureController.addDynamicFigure(stub);
    });


    requestAnimationFrame(drawScene);
}

window.addEventListener("DOMContentLoaded", () => {
    logr = initLogger();
    log("DOM content loaded");
    try {
        main();

    } catch (e) {
        log('Error: ' + e.message + '\n' + e.stack);
    }
}, false);
