/**
 * Created by anthony on 10.02.2018.
 */


class Line extends Drawable {
    constructor(gl, vsSource, fsSource, startPoint, endPoint, color) {
        super(gl, vsSource, fsSource);
        this.positions = [...startPoint, ...endPoint];
        this.colors = [...color, ...color];

        log("Line: pos: [" + this.positions + "] col: [" + this.colors + "]");
    }

    initVertexBuffer() {

    }

    initColorBuffer() {

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

    draw() {

    }
}
