/**
 * Created by anthony on 13.01.2018.
 */

class Line {
    constructor(gl, startPointVec2, endPointVec2, colorVec3) {
        this.gl = gl;
        this.positions = startPointVec2.concat(endPointVec2);
        this.colors = colorVec3.concat(colorVec3);

        logr("Axis: pos: [" + this.positions + "] col: [" + this.colors + "]");
    }

    setShaderSource(vertexShaderSource, fragmentShaderSource) {
        this.shaderProgram = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    initBuffer() {
        const gl = this.gl;
        const posNumComponents = 2;
        const positionBufferInfo = createBufferInfo(gl, this.positions, posNumComponents);

        const colorBufferInfo = createBufferInfo(gl, this.colors, 3);

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
                resolution: gl.getUniformLocation(shaderProgram, 'u_resolution')
            },
        };

        this.figureInfo = {
            positionBufferInfo,
            colorBufferInfo,
            numElements,
            programInfo,
            drawMode: gl.LINE_LOOP,
            type: TYPE_LINE
        }
    };
}
