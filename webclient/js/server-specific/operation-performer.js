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

                    const mesh = new Figure(vertices, extendRandomColors(vertices), gl,
                        vsSource, fsSource, filename);
                    mesh.init();
                    figureController.addDynamicFigure(mesh);

                    log(`saving ${filename} to local storage`);
                    Converter.convertFileToBase64(file, (err, res) => {
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
        const stl1 = localStorage.getItem(idsOfFiguresToBeProcessed[0]);
        const stl2 = localStorage.getItem(idsOfFiguresToBeProcessed[1]);
        const cmd = Models.performOnStlModel('union', stl1, stl2);

        if (this.canBePerformed) {
            serverApiClient.performBoolOp(cmd, (err, res) => {
                if (!err) {
                    try {
                        const data = res.data;
                        log(data);

                        const boolOpResult = Figure.ofInnerRepresentation(data, 'boolOpResult');
                        boolOpResult.init();
                        figureController.addDynamicFigure(boolOpResult);

                    } catch (e) {
                        log('Error while performing bool op: ' + e.message + '\n' + e.stack);
                    }
                }
                this.canBePerformed = true;
            });
            this.canBePerformed = false;

        } else {
            log('nothing to perform already performed');
        }
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
                            const blob = Converter.convertBase64ToBlob(stlData, mimeTypeStl, 512);
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
