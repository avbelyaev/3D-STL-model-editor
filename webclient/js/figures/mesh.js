/**
 * Created by anthony on 23.02.2018.
 */

// Deprecated
class Mesh {
    constructor(drawableFigures, originalTriangles, id) {
        throw Error('Error! Deprecated');

        // noinspection UnreachableCodeJS
        this.id = `mesh-${id}`;
        log(`constructing Mesh ${this.id}`);

        this.posMultiplicationFactor = 100;
        this.drawableFigures = drawableFigures;
        this.originalTriangles = originalTriangles;

        log(`Mesh with drawable figures amount: ${this.drawableFigures.length}`);
    }

    init() {
        this.drawableFigures.map(figure => figure.init());
    }

    draw() {
        this.drawableFigures.map(figure => figure.draw());
    }

    translateByX(additionalX) {
        this.drawableFigures.map(figure => figure.translateByX(additionalX));
    }

    translateByY(additionalY) {
        this.drawableFigures.map(figure => figure.translateByY(additionalY));
    }

    translateByZ(additionalZ) {
        this.drawableFigures.map(figure => figure.translateByZ(additionalZ));
    }

    scaleBy(scaleCoeff) {
        this.drawableFigures.map(figure => figure.scaleBy(scaleCoeff));
    }

    rotateBy(rotationDegreeVec) {
        this.drawableFigures.map(figure => figure.rotateBy(rotationDegreeVec));
    }

    static ofMeshModel(meshModel, meshId) {
        const drawableFigures = [];
        const originalTriangles = meshModel['triangles'];

        const mesh = new Mesh(drawableFigures, originalTriangles, meshId);
        let i = 0;
        originalTriangles.forEach(t => {
            const positions = [];
            positions.push(...t['a']);
            positions.push(...t['b']);
            positions.push(...t['c']);

            positions.map(pos => parseInt(pos) * this.posMultiplicationFactor);

            const id = `${mesh.id}-${i}`;
            const drawableFigure = new Figure(positions, COLORS.RANDOM(), gl, vsSource, fsSource, id);
            drawableFigures.push(drawableFigure);
            i++;
        });
        return mesh;
    }
}
