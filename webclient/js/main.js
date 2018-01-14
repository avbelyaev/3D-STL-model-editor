
let gl, figures;


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
    
    varying vec3 fragColor;
    
    uniform float stageWidth;
    uniform float stageHeight;
    
    uniform float moveX;
    uniform float moveY;
    
    // TODO move normalize out from shader
    vec3 normalizeCoords(vec2 position) {
        float x = position[0];
        float y = position[1];
        float z = 1.0;
        
        // [0..w]/w -> [0..1]*2 -> [0..2]-1 -> [-1;1]
        float normalized_x = ((x + moveX) / stageWidth) * 2.0;    // -1.0
        float normalized_y = ((y + moveY) / stageHeight) * 2.0;   // -1.0
        
        return vec3(normalized_x, normalized_y, z);
    }
    
    void main() {
      gl_Position = vec4(normalizeCoords(aPosition).xyz, 1.0);
      
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

    gl.clearColor(0.3, 0.3, 0.3, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    figures.forEach((figure) => {
        const programInfo = figure.programInfo;

        bindBufferInfo(programInfo.attribLocations.vertexPosition, figure.positionBufferInfo);
        bindBufferInfo(programInfo.attribLocations.vertexColors, figure.colorBufferInfo);

        gl.useProgram(programInfo.program);

        //TODO set buffers and attribs

        // set uniforms
        gl.uniform1f(programInfo.uniformLocations.stageWidth, gl.canvas.clientWidth);
        gl.uniform1f(programInfo.uniformLocations.stageHeight, gl.canvas.clientHeight);

        gl.uniform1f(programInfo.uniformLocations.moveX, lastMouseX);
        gl.uniform1f(programInfo.uniformLocations.moveY, lastMouseY);


        gl.drawArrays(figure.drawMode, 0, figure.numElements);

    });

    requestAnimationFrame(drawScene);
}


function main() {
    gl = initGL();

    // use black scene as fallback
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    figures = [];

    const axisX = new Axis(gl, [-400, 0], [400, 0], [1, 0, 0]);
    axisX.setShaderSource(vsSource, fsSource);
    figures.push(axisX.initBuffer(vsSource, fsSource));

    const axisY = new Axis(gl, [0, -400], [0, 400], [0, 0, 1]);
    axisY.setShaderSource(vsSource, fsSource);
    figures.push(axisY.initBuffer(vsSource, fsSource));


    const triangle = new Triangle(gl);
    triangle.setShaderSource(vsSource, fsSource);
    figures.push(triangle.initBuffer(vsSource, fsSource));


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


