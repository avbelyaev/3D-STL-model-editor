/**
 * Created by anthony on 24.02.2018.
 */


class ModelSubmitter {
    constructor() {
        log(`constructing Model Submitter`);

        const controlAdditionElem = document.getElementById(H2JS_CONTROL_ADDITION);
        this.modelSubmitterElement = controlAdditionElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];
        this.canBeSubmitted = true;
        this.canBePerformed = true;
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
        const stl1 = localStorage.getItem(idsOfFiguresToBeProcessed[0]);
        const stl2 = localStorage.getItem(idsOfFiguresToBeProcessed[1]);
        const cmd = Models.performOnStlModel('union', stl1, stl2);

        if (this.canBePerformed) {
            serverApiClient.performBoolOp(cmd, (err, res) => {
                if (!err) {
                    const data = res.data;
                    log(data);

                    const boolOpResult = Figure.ofInnerRepresentation(data, 'boolOpResult');
                    boolOpResult.init();
                    figureController.addDynamicFigure(boolOpResult);
                }
                this.canBePerformed = true;
            });
            this.canBePerformed = false;

        }  else {
            log('nothing to perform already performed');
        }
    }
}
