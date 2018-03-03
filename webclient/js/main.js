
let gl;
let cam;
let selectedFigure;
let idsOfFiguresToBeProcessed;
let figureController;
let modelSubmitter;
let serverApiClient;

const log = (text) => console.log(text);

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
    selectedFigure.rotateBy([figureAngleDeg, figureAngleDeg, 0], null);
};

const updateVisibility = (visibilityCheckbox) => {
    const figureId = visibilityCheckbox.getAttribute(figureController.figureIdAttrName);
    const figure = figureController.dynamicFigures.get(figureId);
    figure.visible = !figure.visible;
};


function drawScene() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    figureController.drawFigures();


    requestAnimationFrame(drawScene);
}

const initCamera = () => {
    const distance = 200;
    const horizontalAngleDeg = 30;
    const vertAngleDeg = 30;
    const lookAt = [0, 30, 0];

    return new Camera(distance, horizontalAngleDeg, vertAngleDeg, lookAt);
};


function main() {
    gl = initGLControls();
    cam = initCamera();
    figureController = new FigureController();
    modelSubmitter = new ModelSubmitter();
    serverApiClient = new ServerApiClient('localhost', 8000);


    gl.clearColor(0.3, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // gl.enable(gl.CULL_FACE); // dont draw back-facing (clockwise vertices) triangles


    const axisX = new Line([-400, 0, 0], [400, 0, 0], COLORS.RED, gl, vsSource, fsSource, 'axisX');
    axisX.init();
    figureController.addStaticFigure(axisX);

    const axisY = new Line([0, -400, 0], [0, 400, 0], COLORS.GREEN, gl, vsSource, fsSource, 'axisY');
    axisY.init();
    figureController.addStaticFigure(axisY);

    const axisZ = new Line([0, 0, -400], [0, 0, 400], COLORS.BLUE, gl, vsSource, fsSource, 'axisZ');
    axisZ.init();
    figureController.addStaticFigure(axisZ);


    const trianglePositions = [
        50, -50, 0,
        -100, -50, 0,
        0, -50, 100
    ];
    const triangle = new Figure(trianglePositions, COLORS.GREEN, gl, vsSource, fsSource, 'triangle');
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
    log("DOM content loaded");
    try {
        main();

    } catch (e) {
        log('Error: ' + e.message + '\n' + e.stack);
    }
}, false);
