/**
 * Created by anthony on 10.02.2018.
 */


class Line extends Drawable {
    constructor(gl, vsSource, fsSource, startPoint, endPoint, color) {
        log('constructing Line');
        super(gl, vsSource, fsSource);
        this.positions = [...startPoint, ...endPoint];
        this.colors = [...color, ...color];

        log("Line: pos: [" + this.positions + "] col: [" + this.colors + "]");
    }

    initBuffers() {
        log('initBuffers');

        const posNumComponents = 3;
        this.positionBufferInfo = createBufferInfo(
            this.gl, new Float32Array(this.positions), posNumComponents, gl.FLOAT, false);

        this.colorBufferInfo = createBufferInfo(
            this.gl, new Uint8Array(this.colors), 3, gl.UNSIGNED_BYTE, true);

        const numElements = countNumElem(this.positions, posNumComponents);
        checkAgainstColors(numElements, this.colors);
        this.numElements = numElements;
    }

    setShaderArgLocations() {
        log('setShaderArgLocations');

        this.attribLocations = {
            vertexPosition: this.gl.getAttribLocation(this.program, 'aPosition'),
            vertexColor: this.gl.getAttribLocation(this.program, 'aColor')
        };
        this.uniformLocations = {
            uModel: this.gl.getUniformLocation(this.program, 'uModel'),
            uView: this.gl.getUniformLocation(this.program, 'uView'),
            uProjection: this.gl.getUniformLocation(this.program, 'uProjection')
        };

        this.drawMode = gl.LINE_LOOP;
        this.movable = false;
    }

    draw(matrixModel, matrixView, matrixProjection) {
        this.gl.useProgram(this.program);

        // vertices
        bindBufferToAttribute(this.attribLocations.vertexPosition, this.positionBufferInfo);

        // colors
        bindBufferToAttribute(this.attribLocations.vertexColor, this.colorBufferInfo);

        // uniforms
        this.gl.uniformMatrix4fv(this.uniformLocations.uModel, false, matrixModel);
        this.gl.uniformMatrix4fv(this.uniformLocations.uView, false, matrixView);
        this.gl.uniformMatrix4fv(this.uniformLocations.uProjection, false, matrixProjection);

        // draw
        this.gl.drawArrays(this.drawMode, 0, this.numElements);
    }

    scaleBy(scaleVec) {
        // get current matrix state
        // scale it by
    }

    tanslateBy(translateVec) {

    }

    rotateBy(rotateVec, rotationPoint) {
        let currMatrix;
        // push
        let translated = currMatrix;
        if (rotationPoint) {
            translated = mat4.translate(translated, translated, rotationPoint);
        }
        mat4.rotateX(translated, translated, rotateVec[0]);
        mat4.rotateY(translated, translated, rotateVec[1]);
        mat4.rotateZ(translated, translated, rotateVec[2]);
        // pop
    }
}
