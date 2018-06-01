/**
 * Created by anthony on 04.02.2018.
 */

const DRAWABLES = Object.freeze({
    FIGURE: "figure",
    GRID: "grid",
    AXIS: "axis"
});

class Drawable {
    constructor(positions, colors, gl, vsSource, fsSource, id, type) {
        log(`constructing Drawable ${id}`);
        if (!id) {
            throw new Error('Drawable id is null or empty');
        }

        this.id = `${id}_${getRandomInt(100000, 999999)}`;
        this.gl = gl;
        this.vsSource = vsSource;
        this.fsSource = fsSource;

        this.positions = positions.slice();
        this.worldPositions = positions.slice();
        this.normals = null;
        this.colors = colors;


        // args for further model matrix creation
        this.movable = true;
        this.translationVec = [0, 0, 0];
        this.scaleVec = [1, 1, 1];
        this.rotationVec = [0, 0, 0];

        this.type = type;

        // stats
        this.stats = {};
        this.stats.trianglesNum = parseInt("" + this.positions.length / 9);

        this.visible = true;
    }

    draw() {
        Drawable.__throwNotImplementedError();
    }

    scaleBy(scaleCoefficient) {
        // scale by all axes
        const scale = parseFloat(scaleCoefficient);
        this.scaleVec = [scale, scale, scale];
    }

    translateByX(additionalX) {
        this.translationVec[0] += parseFloat(additionalX);
    }

    translateByY(additionalY) {
        this.translationVec[1] += parseFloat(additionalY);
    }

    translateByZ(additionalZ) {
        this.translationVec[2] += parseFloat(additionalZ);
    }

    rotateBy(rotationDegreeVec, rotationPoint) {
        this.rotationVec = rotationDegreeVec
            .map(angleDegree => degToRad(parseFloat(angleDegree)));
    }

    init() {
        log(`init Drawable ${this.id}`);
        this.__initProgram();
        this.__initBuffers();
        this.__initShaderArgLocations();
    }

    setNormals(normalsVec) {
        this.normals = normalsVec;
    }

    __initProgram() {
        // log('initProgram');
        this.program = initShaderProgram(this.gl, this.vsSource, this.fsSource);
    }

    __initBuffers() {
        // log('initBuffers');

        const posNumComponents = 3;
        this.positionBufferInfo = createBufferInfo(
            this.gl, new Float32Array(this.positions), posNumComponents, gl.FLOAT, false);

        this.colorBufferInfo = createBufferInfo(
            this.gl, new Uint8Array(this.colors), 3, gl.UNSIGNED_BYTE, true);

        const numElements = countNumElem(this.positions, posNumComponents);
        checkAgainstColors(numElements, this.colors);
        this.numElements = numElements;
    }

    __initShaderArgLocations() {
        // log('initShaderArgLocations');

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

    __updateMatrices() {
        this.mModel = makeModelMatrix(this.movable, this.scaleVec, this.translationVec, this.rotationVec);
        this.mView = makeViewMatrix();
        this.mProj = makeProjectionMatrix();
    }

    static __throwNotImplementedError() {
        throw new TypeError('Method is not implemented!');
    }
}
