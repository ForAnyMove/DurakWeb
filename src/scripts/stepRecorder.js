import { Action } from "./globalEvents.js";

class StepRecorder {
    constructor() {
        this.backActions = [];
        this.stepCount = 0;

        this.stepRecordedEvent = new Action();
    }

    reset = function () {
        this.backActions = [];
        this.stepCount = 0;

        this.stepRecordedEvent = new Action();
    }

    record = function (backAction) {
        this.backActions.push(backAction);
        this.stepCount++;

        this.stepRecordedEvent.invoke(this.stepCount);
    }

    undo = function () {
        if (this.backActions.length > 0) {
            this.backActions[this.backActions.length - 1]?.();

            this.backActions.splice(this.backActions.length - 1, 1);
            this.stepCount--;

            this.stepRecordedEvent.invoke(this.stepCount);
            return true;
        }

        return false;
    }
}

const stepRecorder = new StepRecorder();

export { stepRecorder }