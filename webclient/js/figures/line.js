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
        this.shaderProgram = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    initBuffer() {
        const gl = this.gl;
        const posNumComponents = 3;
        // this.positions = [
        //     // left column front
        //     0,   0,  0,
        //     0, 150,  0,
        //     30,   0,  0,
        //     0, 150,  0,
        //     30, 150,  0,
        //     30,   0,  0
        // ];
        const positionBufferInfo = createBufferInfo(gl, this.positions, posNumComponents, 'float');

        // this.colors = [
        //     // left column front
        //     200,  70, 120,
        //     200,  70, 120,
        //     200,  70, 120,
        //     200,  70, 120,
        //     200,  70, 120,
        //     200,  70, 120
        // ];
        const colorBufferInfo = createBufferInfo(gl, this.colors, 3, 'uint');

        const numElements = countNumElem(this.positions, posNumComponents);
        checkAgainstColors(numElements, this.colors);


        const shaderProgram = this.shaderProgram;
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
                vertexColors: gl.getAttribLocation(shaderProgram, 'aColor')
            },
            uniformLocations: {
                uMatrix: gl.getUniformLocation(shaderProgram, 'uMatrix')
            },
        };

        this.figureInfo = {
            positionBufferInfo,
            colorBufferInfo,
            numElements,
            programInfo,
            drawMode: gl.LINE_LOOP,
            movable: false
        }
    };
}
