/**
 * Created by anthony on 13.01.2018.
 */

class Line {
    constructor(gl, startPointVec3, endPointVec3, colorVec3) {
        this.gl = gl;
        this.positions = startPointVec3.concat(endPointVec3);
        this.colors = colorVec3.concat(colorVec3);  // both vertices have same color

        logr("Axis: pos: [" + this.positions + "] col: [" + this.colors + "]");
    }

    setShaderSource(vertexShaderSource, fragmentShaderSource) {
        this.program = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    initFigure() {
        const posNumComponents = 3;
        this.positionBufferInfo = createBufferInfo(this.gl, this.positions, posNumComponents, 'float');

        this.colorBufferInfo = createBufferInfo(this.gl, this.colors, 3, 'uint');

        const numElements = countNumElem(this.positions, posNumComponents);
        checkAgainstColors(numElements, this.colors);
        this.numElements = numElements;


        this.attribLocations = {
            vertexPosition: this.gl.getAttribLocation(this.program, 'aPosition'),
            vertexColor: this.gl.getAttribLocation(this.program, 'aColor')
        };
        this.uniformLocations = {
            uMatrix: this.gl.getUniformLocation(this.program, 'uMatrix')
        };

        this.drawMode = gl.LINE_LOOP;
        this.movable = false;
    };
}
