/**
 * Created by anthony on 14.01.2018.
 */

class Triangle {
    constructor(gl) {
        this.gl = gl;

        logr("Triangle");
    }

    setShaderSource(vertexShaderSource, fragmentShaderSource) {
        this.shaderProgram = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    initBuffer() {
        const gl = this.gl;
        const posNumComponents = 2;
        const positions = [
            100, 200,
            800, 200,
            100, 300,
            100, 300,
            800, 200,
            800, 300,
        ];
        const positionBufferInfo = createBufferInfo(gl, positions, posNumComponents);


        const colors = [
            1.0,  0.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  0.0,  1.0,
            0.0,  1.0,  0.0,
            1.0,  0.0,  0.0,
            0.0,  1.0,  0.0
        ];
        const colorBufferInfo = createBufferInfo(gl, colors, 3);

        const numElements = countNumElem(positions, posNumComponents, colors);
        checkAgainstColors(numElements, colors);


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
            drawMode: gl.TRIANGLE_STRIP,
            type: TYPE_TRIANGLE
        };
    }
}
