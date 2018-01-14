
const TYPE_TRIANGLE = 'triangle';
const TYPE_LINE = 'line';

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
    attribute vec2 aPosition;
    attribute vec3 aColor;
    
    uniform vec2 u_resolution;
    
    
    varying vec3 fragColor;
    
    void main() {
        vec2 normalized_xy = aPosition / u_resolution * 2.0 - 1.0;
        gl_Position = vec4(normalized_xy.xy, 0.0, 1.0);
      
        // pass color to fragment shader
        fragColor = aColor;
    }
  `;

const fsSource = `
    precision highp float;
    
    varying vec3 fragColor;

    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
      //gl_FragColor = vec4(1.0, 0.0, 0, 0);
    }
  `;


function drawScene() {

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    figures.forEach((f) => {
        const figure = f.figureInfo;
        const programInfo = figure.programInfo;

        bindBufferToAttribute(programInfo.attribLocations.vertexPosition, figure.positionBufferInfo);
        bindBufferToAttribute(programInfo.attribLocations.vertexColors, figure.colorBufferInfo);

        gl.useProgram(programInfo.program);

        //TODO set buffers and attribs

        // set uniforms
        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        // gl.uniform1f(programInfo.uniformLocations.stageWidth, gl.canvas.clientWidth);
        // gl.uniform1f(programInfo.uniformLocations.stageHeight, gl.canvas.clientHeight);

        // gl.uniform2f(programInfo.uniformLocations.moveXY, lastMouseX);
        // gl.uniform1f(programInfo.uniformLocations.moveY, lastMouseY);


        gl.drawArrays(figure.drawMode, 0, figure.numElements);
    });

    requestAnimationFrame(drawScene);
}


function main() {
    gl = initGL();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    const axisX = new Line(gl, [-400, 0], [400, 0], [1, 0, 0]);
    axisX.setShaderSource(vsSource, fsSource);
    axisX.initBuffer();
    figures.push(axisX);

    const axisY = new Line(gl, [0, -400], [0, 400], [0, 0, 1]);
    axisY.setShaderSource(vsSource, fsSource);
    axisY.initBuffer();
    figures.push(axisY);

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


