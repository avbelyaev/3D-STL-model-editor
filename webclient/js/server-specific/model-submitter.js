/**
 * Created by anthony on 24.02.2018.
 */


class ModelSubmitter {
    constructor() {
        log(`constructing Model Submitter`);

        this.modelSubmitterElement = document.getElementsByClassName('menu__model-submitter--input')[0];
        this.canBeSubmitted = true;
    }

    submitFile() {
        const file = this.modelSubmitterElement.files[0];

        if (file && this.canBeSubmitted) {
            STLLoader.parseBinarySTL(file, (err, meshData) => {
                if (!err) {
                    const vertices = meshData.vertices;
                    log(vertices);

                    // const multiplyCoeff = 1000;
                    // log(`multiplying by ${multiplyCoeff}`);
                    // vertices.map(vertex => parseInt(vertex) * multiplyCoeff);

                    const mesh = new Figure(vertices, COLORS.RANDOM(), gl,
                        vsSource, fsSource, file.name);
                    mesh.init();
                    figureController.addDynamicFigure(mesh);

                    // save to local storage
                    log(`converting to base64 and saving into local storage`);
                    ServerApiClient.convertToBase64(file, (err, res) => {
                        if (!err) {
                            localStorage.setItem(mesh.id, res);
                        }
                    });
                }
                this.canBeSubmitted = true;
            });
            this.canBeSubmitted = false;

        } else {
            log('nothing to submit or already submitted');
        }
    }

    performBoolOp() {
        const stl1 = localStorage.getItem('stl1');
        const stl2 = localStorage.getItem('stl2');
    }
}
