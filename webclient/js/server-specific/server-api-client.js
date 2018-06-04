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

    performBoolOpRequest(boolOpCommand, callback) {
        if (boolOpCommand.hasOwnProperty('operation')
            && boolOpCommand.hasOwnProperty('stl1')
            && boolOpCommand.hasOwnProperty('stl2')) {

            // XHR uses SPDY and gzip natively
            // if server supports them
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.stlUrl}/perform`, true);
            xhr.setRequestHeader("Content-type", "application/json");

            xhr.responseType = 'json';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {

                    if (xhr.status >= 200 && xhr.status < 300) {
                        callback(null, xhr.response);

                    } else {
                        callback(Error('XHR error'), null);
                    }
                }
            };
            xhr.send(JSON.stringify({
                operation: boolOpCommand.operation,
                stl1: boolOpCommand.stl1,
                stl2: boolOpCommand.stl2
            }));

        } else {
            log('XHR error: not enough request data to complete POST');
        }
    }
}
