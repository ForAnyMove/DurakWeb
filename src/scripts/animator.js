

class Animator {
    constructor() {
        this.requests = [];
        this.lastTimeStamp = -1;
        this.paused = false;

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.paused = true;
                this.clearFramer();
            } else {
                this.paused = false;
                this.createFramer();
            }
        });
    }

    reset = function () {
        this.requests = [];
        this.lastTimeStamp = -1;
        this.paused = false;
    }

    addRequest = function (callback) {
        if (this.requests.includes(callback)) return;

        let lastRequestsLength = this.requests.length;

        this.requests.push(callback)

        if (lastRequestsLength <= 0) {
            this.createFramer();
        }
    }

    removeRequest = function (callback) {
        if (!this.requests.includes(callback)) {
            return;
        }

        this.requests.splice(this.requests.indexOf(callback), 1);
    }

    createFramer = function () {
        window.requestAnimationFrame(this.update);
    }

    clearFramer = function () {
        this.lastTimeStamp = -1;
    }

    update = (timeStamp) => {
        if (this.lastTimeStamp < 0) {
            this.lastTimeStamp = timeStamp;
        }
        const dt = (timeStamp - this.lastTimeStamp) / 60;

        if (this.requests.length > 0 && !this.paused) {
            for (let i = 0; i < this.requests.length; i++) {
                const callback = this.requests[i];
                if (callback == null) continue;

                callback?.(dt);
            }

            this.lastTimeStamp = timeStamp;
            window.requestAnimationFrame(this.update);

            return;
        }

        this.clearFramer();
    }
}

const animator = new Animator();

export { animator }