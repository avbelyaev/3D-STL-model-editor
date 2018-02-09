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

    incAngle(angleDegDelta) {
        Camera.validateValue(angleDegDelta);

        this.angleDeg += parseInt(angleDegDelta);
        this.updatePosition();
    }

    incDistance(distanceDelta) {
        Camera.validateValue(distanceDelta);

        this.distance += distanceDelta;

        this.distance = this.distance < CAM_DIST_MAX ? this.distance : CAM_DIST_MAX;
        this.distance = this.distance > CAM_DIST_MIN ? this.distance : CAM_DIST_MIN;
        this.updatePosition();
    }

    incHeight(heightAmount) {
        Camera.validateValue(heightAmount);

        this.height += heightAmount;

        this.height = this.height < CAM_HEIGHT_MAX ? this.height : CAM_HEIGHT_MAX;
        this.height = this.height > CAM_HEIGHT_MIN ? this.height : CAM_HEIGHT_MIN;
        this.updatePosition();
    }

    setLookAtMatrix(lookAtPosition, top) {
        this.lookAtPos = lookAtPosition;
        this.top = top;
    }

    static validateValue(value) {
        try {
            parseInt(value);

        } catch (e) {
            throw Error('Invalid value was provided to camera');
        }
    }
}
