/**
 * Created by anthony on 21.01.2018.
 */

class MatrixStack {
    constructor() {
        this.stack = [];
        this.restore();
    }

    restore() {
        this.stack.pop();
        if (1 > this.stack.length) {
            this.stack[0] = mat4.create();
        }
    }

    save() {
        this.stack.push(this.getCurrentMatrix());
    }

    getCurrentMatrix() {
        return this.stack[this.stack.length - 1].slice();
    }

    setCurrentMatrix(m) {
        this.stack[this.stack.length - 1] = m;
        return m;
    }

    // matrix ops

    translate(translationVec3) {
        const m = this.getCurrentMatrix();
        const translated = mat4.translate(m, m, translationVec3);
        this.setCurrentMatrix(translated);
        return translated;
    }

    rotateY(angleInRadians) {
        const m = this.getCurrentMatrix();
        const rotated = mat4.rotateY(m, m, angleInRadians);
        this.setCurrentMatrix(rotated);
        return rotated;
    }
}
