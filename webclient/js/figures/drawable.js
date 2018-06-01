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
        if (!id) {
            throw new Error('Drawable id is null or empty');
        }

        this.id = `${id}_${getRandomInt(100000, 999999)}`;
        this.gl = gl;
        this.vsSource = vsSource;
        this.fsSource = fsSource;

        this.positions = positions.slice();
        this.worldPositions = positions.slice();
        this.colors = colors;


        // args for further model matrix creation
        this.movable = true;
        this.translationVec = [0, 0, 0];
        this.scaleVec = [1, 1, 1];
        this.rotationVec = [0, 0, 0];

        this.type = type;

        this.visible = true;

        // only for objects made of triangles
        if (DRAWABLES.FIGURE === this.type) {
            // update world positions -> vertices -> triangles -> normals
            this.vertices = reduceArrayToTriples(this.worldPositions);
            this.triangles = reduceArrayToTriples(this.vertices);

            this.updateFigure();
        }
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

    updateFigure() {
        console.log('updating figure');
        this.__updateNormals();

        // update using recounted world positions
        this.__updateVertices();
        this.__updateTriangles();
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

    /**
     * all matrices are updated here to render object relatively to world+camera+frustum
     */
    __updateMatrices() {
        this.mModel = makeModelMatrix(this.movable, this.scaleVec, this.translationVec, this.rotationVec);
        this.mView = makeViewMatrix();
        this.mProj = makeProjectionMatrix();
    }

    __updateVertices() {
        console.log('updating vertices');
        this.vertices = reduceArrayToTriples(this.worldPositions);
    }

    __updateTriangles() {
        console.log('updating triangles');
        this.triangles = reduceArrayToTriples(this.vertices);
    }

    /**
     * model matrix places object to the right place in the world.
     * => to know where the object is situated at the moment we have to update worldPositions on every change.
     * worldPositions are counted like this: position_row<vec4> * ModelMatrix<mat4>
     * FYI shader counts position like this: MVPMatrix<mat4> * position_col<vec4>
     */
    __updateWorldPositions() {
        console.log('updating world positions');

        this.__updateVertices();
        this.__updateTriangles();

        const modelMatrix = makeModelMatrix(true, this.scaleVec, this.translationVec, this.rotationVec);

        this.worldPositions = new Array(this.positions.length);
        let j = 0;
        this.vertices.forEach(vertex => {
            const originPosition = vec4.fromValues(vertex[0], vertex[1], vertex[2], 1);

            const positionInTheWorld = multiplyVec4ByMat4(originPosition, modelMatrix);

            this.worldPositions[j++] = positionInTheWorld[0];
            this.worldPositions[j++] = positionInTheWorld[1];
            this.worldPositions[j++] = positionInTheWorld[2];
        });

        console.log("---------- World Positions ----------");
        console.log(this.worldPositions);
    }

    __updateNormals() {
        console.log('updating normals');

        this.__updateWorldPositions();

        this.normals = new Array(Math.round(this.positions.length / 9));
        let j = 0;
        this.triangles.forEach(triangle => {
            this.normals[j++] = Surface.countNormal(triangle[0], triangle[1], triangle[2]);
        });
        console.log("----- normals -----");
        console.log(this.normals);

        return this.normals;
    }

    static __throwNotImplementedError() {
        throw new TypeError('Method is not implemented!');
    }
}
