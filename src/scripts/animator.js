

class Animator {
    constructor() {
        this.requests = [];
        this.lastTimeStamp = -1;
        this.paused = false;

        this.isFramerActive = false;

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.paused = true;
                this.clearFramer();
            } else if (!this.isFramerActive) {
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

    includes = function (request) {
        for (let i = 0; i < this.requests.length; i++) {
            const element = this.requests[i];
            if (element.id == request.id) return true;
        }

        return false;
    }

    includesId = function (id) {
        for (let i = 0; i < this.requests.length; i++) {
            const element = this.requests[i];
            if (element.id == id) return true;
        }

        return false;
    }

    addRequest = function (id, callback) {
        if (this.includesId(id)) return;

        let lastRequestsLength = this.requests.length;

        this.requests.push({ id: id, callback: callback })

        if (lastRequestsLength <= 0) {
            this.createFramer();
        }
    }

    removeRequest = function (id) {
        if (!this.includesId(id)) {
            return;
        }

        for (let i = 0; i < this.requests.length; i++) {
            const element = this.requests[i];
            if (element.id == id) {
                this.requests.splice(i, 1);
                return;
            }
        }
    }

    createFramer = function () {
        if (!this.isFramerActive) {
            this.isFramerActive = true;
            window.requestAnimationFrame(this.update);
        }
    }

    clearFramer = function () {
        this.lastTimeStamp = -1;
        this.isFramerActive = false;
    }

    clearAll = function () {
        this.clearFramer();
        this.requests = [];
    }

    update = (timeStamp) => {
        if (this.lastTimeStamp < 0) {
            this.lastTimeStamp = timeStamp;
        }
        const dt = (timeStamp - this.lastTimeStamp) / 60;

        if (this.requests.length > 0 && !this.paused) {
            for (let i = 0; i < this.requests.length; i++) {
                const callback = this.requests[i].callback;
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