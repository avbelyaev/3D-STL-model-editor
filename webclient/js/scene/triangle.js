/**
 * Created by anthony on 14.01.2018.
 */

class Triangle {
    constructor(gl) {
        this.gl = gl
    }

    setShaderSource(vertexShaderSource, fragmentShaderSource) {
        this.shaderProgram = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    initBuffer() {
        const gl = this.gl;
        const posNumComponents = 2;
        const positions = [
            0, 0,
            0, 100.0,
            300.0, 0
        ];
        const positionBufferInfo = createBufferInfo(gl, positions, posNumComponents);


        const colors = [
            1.0,  0.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  0.0,  1.0
        ];
        const colorBufferInfo = createBufferInfo(gl, colors, 3);


        const shaderProgram = this.shaderProgram;
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
                vertexColors: gl.getAttribLocation(shaderProgram, 'aColor')
            },
            uniformLocations: {
                stageWidth: gl.getUniformLocation(shaderProgram, 'stageWidth'),
                stageHeight: gl.getUniformLocation(shaderProgram, 'stageHeight'),
                moveX: gl.getUniformLocation(shaderProgram, 'moveX'),
                moveY: gl.getUniformLocation(shaderProgram, 'moveY'),
            },
        };

        return {
            positionBufferInfo,
            colorBufferInfo,
            numElements: countNumElem(positions.length, posNumComponents),
            programInfo,
            drawMode: gl.TRIANGLE_STRIP
        };
    }
}
