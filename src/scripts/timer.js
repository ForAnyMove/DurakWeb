import { animator } from "./animator.js";
import { Action } from "./globalEvents.js";
import { secondsToTime } from "./helpers.js";

class Timer {
    constructor(id, textElements) {
        this.id = id;
        this.textElements = textElements;
        this.onTimerFinished = new Action();
        this.timer = 0;
    }

    startTimerUnscaled(seconds, finishCallback) {
        this.onTimerFinished.addListener(finishCallback);

        this.timer = seconds;

        if (this.timer <= 0) {
            this.onTimerFinished.invoke();
            this.clear();
            return;
        }

        for (let i = 0; i < this.textElements.length; i++) {
            this.textElements[i].innerText = secondsToTime(Math.floor(this.timer));
        }
        this.unscaledInterval = setInterval(() => {
            this.timer -= 1;
            for (let i = 0; i < this.textElements.length; i++) {
                this.textElements[i].innerText = secondsToTime(Math.floor(this.timer));
            }

            if (this.timer <= 0) {
                this.onTimerFinished.invoke();
                this.clear();
            }
        }, 1000);
    }

    startTimer(seconds, finishCallback) {
        this.onTimerFinished.addListener(finishCallback);

        this.timer = seconds;

        if (this.timer <= 0) {
            this.onTimerFinished.invoke();
            this.clear();
            return;
        }

        let lastSecond = 0;
        const request = (dt) => {
            this.timer -= dt * 60 / 1000;

            const second = Math.floor(this.timer);
            if (lastSecond != second) {
                lastSecond = second;
                for (let i = 0; i < this.textElements.length; i++) {
                    this.textElements[i].innerText = secondsToTime(second);
                }

                if (second <= 0) {
                    this.onTimerFinished.invoke();
                    animator.removeRequest(this.id);
                }
            }
        }

        animator.removeRequest(this.id);
        animator.addRequest(this.id, request);
    }

    clear() {
        for (let i = 0; i < this.textElements.length; i++) {
            this.textElements[i].innerText = '';
        }

        animator.removeRequest(this.id);
        this.onTimerFinished.removeAllListeners();

        clearInterval(this.unscaledInterval);
    }
}

export { Timer }