/**
 * Created by anthony on 04.02.2018.
 */

class Drawable {
    constructor(gl, vsSource, fsSource) {
        this.gl = gl;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
    }

    init() {
        this.initProgram();
        this.initVertexBuffer();
        this.initColorBuffer();
    }

    initVertexBuffer() {
        Drawable._throwNotImplementedError();
    }
  
    initColorBuffer() {
        Drawable._throwNotImplementedError();
    }

    initProgram() {
        this.program = initShaderProgram(this.gl, this.vsSource, this.fsSource);
    }

    draw() {
        Drawable._throwNotImplementedError();
    }

    static _throwNotImplementedError() {
        throw new TypeError('Method is not implemented!');
    }
}
