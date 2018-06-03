/**
 * Created by anthony on 24.02.2018.
 */


class ServerApiClient {
    constructor(protocol, serverHost, serverPort) {
        const baseApiUrl = `${protocol}://${serverHost}:${serverPort}/api`;
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
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.stlUrl}/perform`, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                callback(null, xhr.response);
            }
        };
        xhr.send(boolOpCommand);

        //     axios.post(`${this.stlUrl}/perform`, boolOpCommand, {
        //         headers: {
        //             'Content-type': 'text/plain'
        //         }
        //     })
        //         .then(response => {
        //             // TODO gzip
        //             callback(null, response);
        //         })
        //         .catch(error => {
        //             log(`Error occurred while performing bool op on STLs: ${error}`);
        //             callback(error, null);
        //         });
    }
}
