/**
 * Created by anthony on 31.05.2018.
 */

class Converter {
    constructor() {
        // empty
    }

    static convertFileToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function (event) {
            // base64 has default prefix like this: data:;base64,****
            // cut off prefix (including comma) since base64 uses only chars [a-z, A-Z, 0-9, +, /]
            const prefixRemoved = event.target.result.split(',')[1];
            callback(null, prefixRemoved);
        };
        reader.onerror = function (error) {
            log(`Error occured while converting to base64: ${error}`);
            callback(error, null);
        };
        reader.readAsDataURL(file);
    };

    static convertBase64ToBlob(b64Data, contentType, sliceSize) {
        sliceSize = sliceSize || 512;
        const byteCharacters = atob(b64Data);

        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {

            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }
}
