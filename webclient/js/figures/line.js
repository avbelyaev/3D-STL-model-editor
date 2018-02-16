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

        // args for further model matrix creation
        this.movable = true;
        this.translationVec = [0, 0, 0];
        this.scaleVec = [1, 1, 1];
        this.rotationVec = [0, 0, 0];

        // draw mode
        this.drawMode = gl.LINE_LOOP;
    }

    __initBuffers() {
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

    __setShaderArgLocations() {
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
    }

    draw() {
        this.gl.useProgram(this.program);

        // vertices
        bindBufferToAttribute(this.attribLocations.vertexPosition, this.positionBufferInfo);

        // colors
        bindBufferToAttribute(this.attribLocations.vertexColor, this.colorBufferInfo);

        // uniforms
        this.gl.uniformMatrix4fv(this.uniformLocations.uModel, false, this.mModel);
        this.gl.uniformMatrix4fv(this.uniformLocations.uView, false, this.mView);
        this.gl.uniformMatrix4fv(this.uniformLocations.uProjection, false, this.mProj);

        // draw
        this.gl.drawArrays(this.drawMode, 0, this.numElements);
    }

    __updateMatrices() {
        this.mModel = makeModelMatrix(this.movable, this.scaleVec, this.translationVec, this.rotationVec);
        this.mView = makeView();
        this.mProj = makeProjection();
        // copy current matrix-state into figure
        // mat4.fromMat4(this.mModel, matrixModel);
        // mat4.fromMat4(this.mView, matrixView);
        // mat4.fromMat4(this.mProj, matrixProjection);
    }

    scaleBy(scaleCoefficient) {
        // scale by all axes
        this.scaleVec = [scaleCoefficient, scaleCoefficient, scaleCoefficient];
    }

    translateBy(translateVec) {
        this.translationVec = translateVec;
        this.__updateMatrices();
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
