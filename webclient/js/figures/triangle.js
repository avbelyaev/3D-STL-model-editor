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
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ];
        const positionBufferInfo = createBufferInfo(gl, positions, posNumComponents);


        // const colors = [
        //     1.0,  0.0,  0.0,
        //     0.0,  1.0,  0.0,
        //     0.0,  0.0,  1.0,
        //     0.0,  1.0,  0.0,
        //     1.0,  0.0,  0.0,
        //     0.0,  1.0,  0.0
        // ];
        // const colorBufferInfo = createBufferInfo(gl, colors, 3);

        const numElements = countNumElem(positions, posNumComponents);
        // checkAgainstColors(numElements, colors);


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
            colorBufferInfo: [],
            numElements,
            programInfo,
            drawMode: gl.TRIANGLES,
            type: TYPE_TRIANGLE
        };
    }
}
