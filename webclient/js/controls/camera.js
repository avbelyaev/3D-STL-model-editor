/**
 * Created by anthony on 09.02.2018.
 */

const CAM_HEIGHT_MAX = 600;
const CAM_HEIGHT_MIN = -600;
const CAM_DIST_MAX = 500;
const CAM_DIST_MIN = 50;

class Camera {
    constructor(initDist, initAngleDeg, initHeight, initPos) {
        this.distance = initDist;
        this.angleDeg = initAngleDeg;
        this.height = initHeight;
        this.positionVec = initPos;
    }

    updatePosition() {
        this.positionVec[0] = Math.sin(degToRad(this.angleDeg)) * this.distance;
        this.positionVec[1] = this.height;
        this.positionVec[2] = Math.cos(degToRad(this.angleDeg)) * this.distance;
    }

    updateAngleDeg(updateFunc) {
        this.angleDeg = updateFunc(this.angleDeg);
        this.updatePosition();
    }

    updateDistance(updateFunc) {
        this.distance = updateFunc(this.distance);

        this.distance = this.distance < CAM_DIST_MAX ? this.distance : CAM_DIST_MAX;
        this.distance = this.distance > CAM_DIST_MIN ? this.distance : CAM_DIST_MIN;
        this.updatePosition();
    }

    updateHeight(updateFunc) {
        this.height = updateFunc(this.height);

        this.height = this.height < CAM_HEIGHT_MAX ? this.height : CAM_HEIGHT_MAX;
        this.height = this.height > CAM_HEIGHT_MIN ? this.height : CAM_HEIGHT_MIN;
        this.updatePosition();
    }

    setLookAtMatrix(lookAtPosition, top) {
        this.lookAtPos = lookAtPosition;
        this.top = top;
    }

    static setValueFunction(newValue) {
        // currentValue is ignored
        return (currValue) => parseInt(newValue);
    };

    static incValueFunction(newValue) {
        return (currValue) => currValue + parseInt(newValue);
    };
}
