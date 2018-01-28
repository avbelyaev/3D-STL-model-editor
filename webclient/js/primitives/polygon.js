/**
 * Created by anthony on 25.01.2018.
 */

class Polygon {
    constructor(gl) {
        this.gl = gl;
        logr('Poly');
    }

    initFigure() {
        const posNumComponents = 3;
        this.positionBufferInfo = createBufferInfo(this.gl, this.positions, posNumComponents, gl.FLOAT, false);

        this.colorBufferInfo = createBufferInfo(this.gl, this.colors, 3, gl.UNSIGNED_BYTE, true);

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

        this.drawMode = gl.TRIANGLES;
        this.movable = true;
    };

    draw(matrix) {
        this.gl.useProgram(this.program);

        // vertices
        bindBufferToAttribute(this.attribLocations.vertexPosition, this.positionBufferInfo);

        // colors
        bindBufferToAttribute(this.attribLocations.vertexColor, this.colorBufferInfo);

        // uniforms
        // const m = initMatrices(this.movable);
        this.gl.uniformMatrix4fv(this.uniformLocations.uMatrix, false, matrix);

        // draw
        this.gl.drawArrays(this.drawMode, 0, this.numElements);
    }

    setVertices(verticesVec) {
        this.positions = new Float32Array(verticesVec);
        this.positionsVec = verticesVec;
    }

    setColors(colorsVec) {
        this.colors = new Uint8Array(colorsVec);
        this.colorsVec = colorsVec;
    }

    setShaderSource(vertexShaderSource, fragmentShaderSource) {
        this.program = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }
}
