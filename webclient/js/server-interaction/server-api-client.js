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

    extractMesh(meshData, callback) {
        axios.post(`${this.meshUrl}/extract`, meshData)
            .then(response => callback(response))
            .catch(error => {
                log(`Error occurred while extracting Mesh: ${error}`);
            });
    }

    static convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function (event) {
            callback(event.target.result);
        };
        reader.onerror = function (error) {
            log('Error: ', error);
        };
        reader.readAsDataURL(file);
    };
}
