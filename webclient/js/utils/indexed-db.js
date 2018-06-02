/**
 * Created by anthony on 31.05.2018.
 */

const DB_NAME = "WiggleDB";
const DB_STORE = "STLStore";

class IndexedDB {

    static init() {
        if (!('indexedDB' in window)) {
            log('Error! This browser doesn\'t support IndexedDB');
            return;
        }
        log(`Recreating database`);

        const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB;
        // IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

        IndexedDB.deleteDB();

        IndexedDB.execute((err, db, store, tx) => {
            if (!err) {
                log(`IndexedDB ${DB_NAME} with store ${DB_STORE} has been created`);

            } else {
                log('Could not create IndexedDB');
            }
        });

        return indexedDB;
    }

    static execute(callback) {
        // access db and schema
        const open = indexedDB.open(DB_NAME, 1);

        // access schema
        open.onupgradeneeded = function() {
            const db = open.result;
            const store = db.createObjectStore(DB_STORE, {keyPath: "id"});
        };

        open.onerror = function (event) {
            console.log("Error accessing IndexedDB database");
        };

        open.onsuccess = function (event) {
            log("Success accessing IndexedDB database");
            const db = open.result;
            const transaction = db.transaction(DB_STORE, "readwrite");
            const store = transaction.objectStore(DB_STORE);

            callback(null, db, store, transaction);

            transaction.oncomplete = function() {
                db.close();
            };
        };

    };

    static upsertFigure(figure) {
        // make new binary file
        const mimeTypeStl = "application/sla";
        const byteArrays = STLExporter.exportToBinaryStl(figure);
        const blob = new Blob([byteArrays], {type: mimeTypeStl});

        // update model in DB
        B64Converter.convertFileToBase64(blob, (err, res) => {
            if (!err) {
                const base64Id = OperationPerformer.createIdForBase64Item(figure.id);

                IndexedDB.execute((err, db, store, tx) => {
                    if (!err) {
                        store.put(IndexedDB.storeItem(base64Id, res));
                        log(`item ${base64Id} has been saved to IndexedDB`);

                    } else {
                        log('error while saving to db: ' + err.message);
                    }
                });
            }
        });
    }

    static storeItem(id, data) {
        return {
            id: id,
            modeldata: data
        };
    }

    static deleteDB() {
        const deleteDB = indexedDB.deleteDatabase(DB_NAME);
        deleteDB.onsuccess = function () {
            log("Database has been removed");
        };
        deleteDB.onerror = function () {
            log("Couldn't delete database");
        };
        deleteDB.onblocked = function () {
            log("Couldn't delete database due to the operation being blocked");
        };
    }
}
