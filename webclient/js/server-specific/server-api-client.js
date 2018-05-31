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

    performBoolOp(boolOpCommand, callback) {
        axios.post(`${this.stlUrl}/perform`, boolOpCommand)
            .then(response => callback(null, response))
            .catch(error => {
                log(`Error occurred while performing bool op on STLs: ${error}`);
                callback(error, null);
            });
    }
}
