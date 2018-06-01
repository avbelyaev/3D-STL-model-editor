/**
 * Created by anthony on 24.02.2018.
 */


class OperationPerformer {
    constructor() {
        log(`constructing Operation Performer`);

        // const controlAdditionElem = document.getElementById(H2JS_CONTROL_ADDITION);
        this.modelSubmitterElement = document.getElementsByClassName(H2JS_CONTROL_ADDITION_FILE)[0];
        this.canBeSubmitted = true;
        this.canBePerformed = true;
        this.canBeDownloaded = true;
    }

    performAddition() {
        if (0 === this.modelSubmitterElement.files.length) {
            log('nothing to submit');
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

                    // const multiplyCoeff = 1000;
                    // log(`multiplying by ${multiplyCoeff}`);
                    // vertices.map(vertex => parseInt(vertex) * multiplyCoeff);

                    const mesh = new Figure(vertices, extendRandomColors(vertices), gl, vsSource, fsSource, filename);
                    // TODO count by myself or just take from file
                    // mesh.normals = meshData.normals;
                    mesh.init();
                    figureController.addDynamicFigure(mesh);

                    log(`saving ${filename} to local storage`);
                    B64Converter.convertFileToBase64(file, (err, res) => {
                        if (!err) {
                            const base64Id = OperationPerformer.createIdForBase64Item(mesh.id);

                            IndexedDB.execute((err, db, store, tx) => {
                                if (!err) {

                                    store.put({
                                        id: base64Id,
                                        modeldata: res
                                    });
                                    log(`item ${base64Id} has been saved to IndexedDB`);

                                } else {
                                    log('error while saving to db: ' + err.message);
                                }
                            });
                        }
                    });


                } else {
                    log('file parse error: ' + err);
                }
                // unlock after parse
                this.canBeSubmitted = true;
            });
            // lock the button while parsing file
            this.canBeSubmitted = false;

        } else {
            log('nothing to submit or already submitted');
        }
    }

    performBoolOp() {
        if (this.canBePerformed) {
            IndexedDB.execute((err, db, store, tx) => {
                if (!err) {
                    const base64edStl1Id = OperationPerformer.createIdForBase64Item(idsOfFiguresToBeProcessed[0]);
                    const getSTL1 = store.get(base64edStl1Id);

                    getSTL1.onsuccess = function () {
                        const stl1Data = getSTL1.result.modeldata;

                        const base64edStl2Id = OperationPerformer.createIdForBase64Item(idsOfFiguresToBeProcessed[1]);
                        const getSTL2 = store.get(base64edStl2Id);

                        getSTL2.onsuccess = function () {
                            const stl2Data = getSTL2.result.modeldata;

                            const cmd = Models.performOnStlModel(Operations.DIFF_AB.id, stl1Data, stl2Data);
                            operationPerformer.performRequest(cmd);
                        };
                    }

                } else {
                    log(`Error! Could not access DB: ${err.message}`);
                }
                this.canBeDownloaded = true;
            });

        } else {
            log('nothing to perform already performed');
        }
    }

    performRequest(cmd) {
        serverApiClient.performBoolOp(cmd, (err, response) => {
            if (!err) {
                log('converting base64 to blob. generating download url');

                const res = response.data.res;
                const mimeTypeStl = "application/sla";
                const blob = B64Converter.convertBase64ToBlob(res, mimeTypeStl, 512);
                const blobUrl = URL.createObjectURL(blob);

                // assign name to blob via invisible link
                const link = document.createElement("a");
                document.body.appendChild(link);
                link.style = "display: none";
                link.href = blobUrl;
                link.download = "result.stl";
                link.click();

                // remove link, revoke url
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);

            } else {
                log(`Error while processing request: ${err.message}`);
            }
        });
    }

    performDownload() {
        if (this.canBeDownloaded) {
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
            log(`nothing to download or download in progress`);
        }
    }

    static createIdForBase64Item(itemName) {
        return `${itemName}_base64`;
    }

    static createIdForOriginalItem(itemName) {
        return `${itemName}_original`;
    }
}
