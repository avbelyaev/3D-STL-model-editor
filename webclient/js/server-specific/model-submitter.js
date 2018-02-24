/**
 * Created by anthony on 24.02.2018.
 */


class ModelSubmitter {
    constructor() {
        log(`constructing Model Submitter`);

        this.modelSubmitterElement = document.getElementsByClassName('menu__model-submitter--input')[0];
        this.canBeSubmitted = true;
    }

    submitModel() {

    }

    submitFile() {
        const file = this.modelSubmitterElement.files[0];
        log(`converting '${this.modelSubmitterElement.value}' file to base64`);

        if (file && this.canBeSubmitted) {
            ServerApiClient.convertToBase64(file, (base64ed) => {
                log(`base64: ${base64ed.substring(0, 30)}...`);

                serverApiClient.extractMeshFromStl(Models.extractMeshModel(base64ed), (err, mesh) => {
                    if (!err) {
                        const meshModel = mesh.data;
                        log(meshModel);

                        log('extracting mesh from meshModel');
                        const extractedMesh = Mesh.ofMeshModel(meshModel, this.modelSubmitterElement.value);
                        extractedMesh.init();
                        figureController.addDynamicFigure(extractedMesh);

                    }
                    this.canBeSubmitted = true;
                });
            });

            this.canBeSubmitted = false;

        } else {
            log('nothing to submit or already submitted');
        }
    }
}
