/**
 * Created by anthony on 13.01.2018.
 */

class Axis {
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

        const shaderProgram = this.shaderProgram;
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
                vertexColors: gl.getAttribLocation(shaderProgram, 'aColor')
            },
            uniformLocations: {
                stageWidth: gl.getUniformLocation(shaderProgram, 'stageWidth'),
                stageHeight: gl.getUniformLocation(shaderProgram, 'stageHeight')
            },
        };

        return {
            positionBufferInfo,
            colorBufferInfo,
            numElements: countNumElem(this.positions.length, posNumComponents),
            programInfo,
            drawMode: gl.LINE_LOOP
        }
    };
}
