/**
 * Created by anthony on 23.02.2018.
 */


class Mesh {
    constructor(data) {
        log('constructing Mesh');

        this.posMultiplicationFactor = 100;
        this.drawableFigures = [];

        this.triangles = data['triangles'];
        this.triangles.forEach(t => {
            const positions = [];
            positions.push(...t['a']);
            positions.push(...t['b']);
            positions.push(...t['c']);

            positions.map(pos => parseInt(pos) * this.posMultiplicationFactor);

            const triangle = new Polygon(positions, COLORS.RANDOM(), gl, vsSource, fsSource);
            this.drawableFigures.push(triangle);
        });
        log(`Mesh with triangles amount: ${this.triangles.length}`);
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

    static getMeshStub(callback) {
        const meshStubUrl = `${GS_API_URL}/mesh/stub`;
        axios.get(meshStubUrl)
            .then(response => callback(response))
            .catch(error => {
                log(`Error occurred while getting Mesh Stub: ${error}`);
            });
    }
}
