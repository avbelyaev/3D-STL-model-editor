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

        const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB;
        // IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

        IndexedDB.operate((err, db, tx, store) => {
            if (!err) {
                log(`IndexedDB ${DB_NAME} with store ${DB_STORE} has been created`);

            } else {
                log('Could not create IndexedDB');
            }
        });

        return indexedDB;
    }

    static operate(callback) {
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

            callback(null, db, transaction, store);

            transaction.oncomplete = function() {
                db.close();
            };
        };

    };
}
