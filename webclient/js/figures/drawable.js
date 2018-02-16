/**
 * Created by anthony on 04.02.2018.
 */

class Drawable {
    constructor(gl, vsSource, fsSource) {
        log('constructing Drawable');
        this.gl = gl;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
    }

    init() {
        this.initProgram();
        this.initBuffers();
        this.setShaderArgLocations();
    }

    initProgram() {
        log('initProgram');
        this.program = initShaderProgram(this.gl, this.vsSource, this.fsSource);
    }

    initBuffers() {
        Drawable.__throwNotImplementedError();
    }

    setShaderArgLocations() {
        Drawable.__throwNotImplementedError();
    }

    draw(mModel, mView, mProjection) {
        Drawable.__throwNotImplementedError();
    }

    static __throwNotImplementedError() {
        throw new TypeError('Method is not implemented!');
    }
}
