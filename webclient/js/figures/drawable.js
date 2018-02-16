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

    draw() {
        Drawable.__throwNotImplementedError();
    }

    init() {
        this.__initProgram();
        this.__initBuffers();
        this.__setShaderArgLocations();
    }

    __initProgram() {
        log('initProgram');
        this.program = initShaderProgram(this.gl, this.vsSource, this.fsSource);
    }

    __initBuffers() {
        Drawable.__throwNotImplementedError();
    }

    __setShaderArgLocations() {
        Drawable.__throwNotImplementedError();
    }

    static __throwNotImplementedError() {
        throw new TypeError('Method is not implemented!');
    }
}
