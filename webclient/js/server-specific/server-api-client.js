/**
 * Created by anthony on 24.02.2018.
 */


class ServerApiClient {
    constructor(serverHost, serverPort) {
        const baseApiUrl = `http://${serverHost}:${serverPort}/api`;
        this.meshUrl = `${baseApiUrl}/mesh`;
        this.stlUrl = `${baseApiUrl}/stl`;
    }

    meshStub(callback) {
        axios.get(`${this.meshUrl}/stub`)
            .then(response => callback(response))
            .catch(error => {
                log(`Error occurred while getting Mesh Stub: ${error}`);
            });
    }

    extractMeshFromStl(stlData, callback) {
        axios.post(`${this.meshUrl}/extract`, stlData)
            .then(response => callback(null, response))
            .catch(error => {
                log(`Error occurred while extracting Mesh: ${error}`);
                callback(error, null);
            });
    }

    static convertToBase64(file, callback) {
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

    static convertFromBse64(base64String, callback) {

    }
}
