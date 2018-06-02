/**
 * Created by anthony on 24.02.2018.
 */


class OperationPerformer {
    constructor() {
        log(`starting Operation Performer`);

        this.modelSubmitterElement = document.getElementsByClassName(H2JS_CONTROL_ELEMENT_FILE)[0];
        this.canBeSubmitted = true;
        this.canBePerformed = true;
        this.canBeDownloaded = true;

        this.selectedOperation = null;
    }

    performAddition() {
        if (0 === this.modelSubmitterElement.files.length) {
            log('Error! Nothing to submit. Please, select file');
            return;
        }

        const file = this.modelSubmitterElement.files[0];
        const filename = file.name.includes('.')
            ? file.name.substr(0, file.name.indexOf('.'))
            : file.name;

        if (file && this.canBeSubmitted) {
            STLLoader.parseBinarySTL(file, (err, meshData) => {
                if (!err) {
                    log(`file ${filename} has been successfully parsed`);

                    const vertices = meshData.vertices;
                    console.log(vertices);

                    const mesh = new Figure(vertices, extendRandomColors(vertices), gl,
                        vsSource, fsSource, filename, DRAWABLES.FIGURE);
                    mesh.init();
                    figureController.addDynamicFigure(mesh);

                    log(`saving ${filename} to local storage`);
                    B64Converter.convertFileToBase64(file, (err, res) => {
                        if (!err) {
                            const base64Id = OperationPerformer.createIdForBase64Item(mesh.id);
                            IndexedDB.storeItem(base64Id, res);
                        }
                    });

                } else {
                    log(`Error! Could not parse file ${filename}. Are You sure its an STL file? :)`);
                }
                // unlock after parse
                this.canBeSubmitted = true;
            });
            // lock the button while parsing file
            this.canBeSubmitted = false;

        } else {
            log('Error! Nothing to submit or already submitted');
        }
    }

    performBoolOp(op, figure1, figure2) {
        if (this.canBePerformed) {
            IndexedDB.execute((err, db, store, tx) => {
                if (!err) {
                    const base64edStl1Id = OperationPerformer.createIdForBase64Item(figure1.id);
                    const getSTL1 = store.get(base64edStl1Id);

                    getSTL1.onsuccess = function () {
                        const stl1Data = getSTL1.result.modeldata;

                        const base64edStl2Id = OperationPerformer.createIdForBase64Item(figure2.id);
                        const getSTL2 = store.get(base64edStl2Id);

                        getSTL2.onsuccess = function () {
                            const stl2Data = getSTL2.result.modeldata;

                            const cmd = Models.performOnStlModel(op.id, stl1Data, stl2Data);
                            operationPerformer.performRequest(cmd);
                        };
                    }

                } else {
                    log(`Error! Could not access DB: ${err.message}`);
                }
                this.canBeDownloaded = true;
            });

        } else {
            log('Error! Already performing');
        }
    }

    performRequest(cmd) {
        serverApiClient.performBoolOp(cmd, (err, response) => {
            if (!err) {
                log('converting base64 to blob and then to a file');

                const res = response.data.res;
                const mimeTypeStl = "application/sla";
                const blob = B64Converter.convertBase64ToBlob(res, mimeTypeStl, 512);
                const filename = "result.stl";
                const file = new File([blob], filename);

                STLLoader.parseBinarySTL(file, (err, meshData) => {
                    if (!err) {
                        log('Result has been successfully parsed');

                        const mesh = new Figure(meshData.vertices, extendRandomColors(meshData.vertices),
                            gl, vsSource, fsSource, filename, DRAWABLES.FIGURE);
                        mesh.init();
                        figureController.addDynamicFigure(mesh);

                        //save into DB
                        const base64Id = OperationPerformer.createIdForBase64Item(mesh.id);
                        IndexedDB.storeItem(base64Id, res);

                    } else {
                        log(`Error! Could not parse file ${filename}`);
                    }
                });

            } else {
                log(`Error while processing request: ${err.message}`);
            }
        });
    }

    performDownload() {
        if (this.canBeDownloaded && null !== figureController.selectedFigure) {
            this.canBeDownloaded = false;

            const selectedFigureId = figureController.selectedFigure.id;
            log(`Figure ${selectedFigureId} download in progress...`);
            const base64edFigureId = OperationPerformer.createIdForBase64Item(selectedFigureId);

            IndexedDB.execute((err, db, store, tx) => {
                    if (!err) {
                        const getSTL = store.get(base64edFigureId);

                        getSTL.onsuccess = function () {
                            const stlData = getSTL.result.modeldata;

                            log('converting base64 to blob. generating download url');
                            const mimeTypeStl = "application/sla";
                            const blob = B64Converter.convertBase64ToBlob(stlData, mimeTypeStl, 512);
                            const blobUrl = URL.createObjectURL(blob);

                            // assign name to blob via invisible link
                            const link = document.createElement("a");
                            document.body.appendChild(link);
                            link.style = "display: none";
                            link.href = blobUrl;
                            link.download = selectedFigureId + ".stl";
                            link.click();

                            // remove link, revoke url
                            URL.revokeObjectURL(blobUrl);
                            document.body.removeChild(link);
                        }

                    } else {
                        log(`Error! Could not read ${base64edFigureId} from db: ${err.message}`);
                    }
                this.canBeDownloaded = true;
            });

        } else {
            log(`Error! Nothing to download or already in progress`);
        }
    }

    static createIdForBase64Item(itemName) {
        return `${itemName}_base64`;
    }
}
