/**
 * Created by anthony on 14.01.2018.
 */

class Triangle {
    constructor() {
        // empty
    }

    initBuffers(gl, vsSource, fsSource) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            0, 0,
            0, 100.0,
            300.0, 0,
            // 0, 0,
            // 0, -300,
            // -400, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const posNumComponents = 2;


        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        const colors = [
            1.0,  0.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  0.0,  1.0
            // 1.0,  0.0,  0.0,
            // 0.0,  0.0,  1.0,
            // 1.0,  1.0,  1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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
            positionBufferInfo: {
                buffer: positionBuffer,
                numComponents: posNumComponents
            },
            colorBufferInfo: {
                buffer: colorBuffer,
                numComponents: 3
            },
            numElements: countElem(positions.length, posNumComponents),
            programInfo: programInfo
        };
    }
}
