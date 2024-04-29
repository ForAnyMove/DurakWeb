import { animator } from "../animator.js";

const Ease = {
    Linear: 0,
    ExpoInOut: 1,
    ExpoOut: 2,
    ExpoIn: 3,
    CircOut: 4,
    CircIn: 5,
    CircInOut: 6,
    QuadOut: 7,
    QuadIn: 8,
    QuadInOut: 9,
    SineOut: 10,
    SineIn: 11,
    SineInOut: 12,
    CubicOut: 13,
    CubicIn: 14,
    CubicInOut: 15,
    QuartIn: 16,
    QuartOut: 17,
    QuartInOut: 18,
    QuintIn: 19,
    QuintOut: 20,
    QuintInOut: 21,
    ElasticIn: 22,
    ElasticOut: 23,
    ElasticInOut: 24,
    BounceIn: 25,
    BounceOut: 26,
    BounceInOut: 27,
    BackIn: 28,
    BackOut: 29,
    BackInOut: 30,
}

class Tweener {
    constructor() {
        this.tweens = [];
    }

    addTween = function (tween) {
        if (this.tweens.includes(tween)) {
            return;
        }

        this.tweens.push(tween);

        animator.addRequest(this.update);
    }

    removeTween = function (tween) {
        if (!this.tweens.includes(tween)) {
            return;
        }

        this.tweens.splice(this.tweens.indexOf(tween), 1);

        if (this.tweens.length == 0) {
            animator.removeRequest(this.update);
        }
    }

    update = (dt) => {
        for (let i = this.tweens.length - 1; i >= 0; i--) {
            const element = this.tweens[i];
            if (element == null) {
                continue;
            }
            element.update(dt);
        }
    }
}

class Sequence {
    constructor() {
        this.tweens = [];
        this.currentTweenIndex = 0;
        this.isLaunched = false;

        this.completedCallback = null;
    }

    clear = function () {
        this.tweens = [];
        this.currentTweenIndex = 0;
        this.isLaunched = false;
    }

    append = function (tween) {
        tween.isLaunched = false;
        this.tweens.push([tween]);

        if (this.tweens.length == 1) {
            this.launch();
        }
    }

    join = function (tween) {
        tween.isLaunched = false;
        if (this.tweens.length == 0) {
            this.tweens.push([tween]);
        } else {
            console.log('join');
            this.tweens[this.tweens.length - 1].push(tween);
        }

        if (this.tweens.length == 1) {
            this.launch();
        }
    }

    launch = function () {
        if (this.isLaunched) return;
        this.isLaunched = true;
        this.currentTweenIndex = 0;

        this.startTween(this.currentTweenIndex);
    }

    startTween = function (index) {
        const tweens = this.tweens[index];

        let maxDuration = 0;
        let maxDurationTween = null;
        for (let i = 0; i < tweens.length; i++) {
            const tween = tweens[i];
            if (tween.duration > maxDuration) {
                maxDuration = tween.duration;
                maxDurationTween = tween;
            }

            tween.isLaunched = true;
        }

        maxDurationTween.onComplete(() => {
            if (index < this.tweens.length - 1) {
                this.startTween(++index);
            } else {
                this.completedCallback?.();
            }
        })
    }
    onComplete = function (completedCallback) {
        this.completedCallback = completedCallback;
    }

    kill = function () {
        for (let i = 0; i < this.tweens.length; i++) {
            const el1 = this.tweens[i];
            for (let i = 0; i < el1.length; i++) {
                const el2 = el1[i];
                el2.destroy(false);
            }
        }

        this.clear();
    }
}

class Tween {
    constructor(dur, initVal, val, ease, onUpdate) {
        this.duration = dur;
        this.initialValue = initVal;
        this.targetValue = val;
        this.ease = ease;
        this.onUpdate = onUpdate;
        this.currentTime = 0;
        this.completedCallback = [];
        this.isLaunched = true;
    }

    update = (dt) => {
        if (this.onUpdate != null && this.isLaunched) {
            this.onUpdate(this);
            this.currentTime += dt / 60;
        }
    }

    destroy = function (withCallback = true) {
        tweener.removeTween(this);

        if (withCallback) {
            for (let i = 0; i < this.completedCallback.length; i++) {
                this.completedCallback[i]?.();
            }
        }
    }

    onComplete = function (completedCallback) {
        this.completedCallback.push(completedCallback);
    }
}

let tweener = new Tweener();

function createTweener() {
    tweener = new Tweener();
}

//#region Container

function DOChangeXY(getPosition, sendPosition, targetPosition, duration, ease) {
    const position = getPosition();

    const tween = new Tween(duration, position, targetPosition, ease, (tw) => {
        let newX = DOEase(ease, tw.currentTime, tw.initialValue.x, tw.targetValue.x, tw.duration)
        let newY = DOEase(ease, tw.currentTime, tw.initialValue.y, tw.targetValue.y, tw.duration)
        sendPosition?.({ x: newX, y: newY });

        if (tw.currentTime >= tw.duration) {
            tw.destroy();
        }
    });

    tweener.addTween(tween);
    return tween;
}

function DOChangeValue(start, sendScale, target, duration, ease) {
    const value = start();

    const tween = new Tween(duration, value, target, ease, (tw) => {
        let newValue = DOEase(ease, tw.currentTime, tw.initialValue, tw.targetValue, tw.duration)
        sendScale?.(newValue);

        if (tw.currentTime >= tw.duration) {
            tw.destroy();
        }
    });

    tweener.addTween(tween);
    return tween;
}

//#endregion

function DelayedCall(duration, callback) {
    const tween = new Tween(duration, null, null, null, (tw) => {
        if (tw.currentTime >= tw.duration) {
            if (callback != null) {
                callback();
            }
            tw.destroy();
        }
    });

    tweener.addTween(tween);
    return tween;
}

//#region Ease function
function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
}
function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}
function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
}
function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
}
function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}
function easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
}
function easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}
function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}
function easeInQuint(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
}
function easeOutQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}
function easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}
function easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}
function easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}
function easeInOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}
function easeInExpo(t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
}
function easeOutExpo(t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
}
function easeInOutExpo(t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}
function easeInCirc(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
}
function easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}
function easeInOutCirc(t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}
function easeInElastic(t, b, c, d) {
    var s = 1.70158; var p = 0; var a = c;
    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
    if (a < Math.abs(c)) { a = c; var s = p / 4; }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}
function easeOutElastic(t, b, c, d) {
    var s = 1.70158; var p = 0; var a = c;
    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
    if (a < Math.abs(c)) { a = c; var s = p / 4; }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
}
function easeInOutElastic(t, b, c, d) {
    var s = 1.70158; var p = 0; var a = c;
    if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
    if (a < Math.abs(c)) { a = c; var s = p / 4; }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
}
function easeInBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
}
function easeOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}
function easeInOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
function easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
}

function DOEase(type, t, b, c, d) {
    c = (c - b);

    switch (type) {
        case Ease.Linear: return c * t / d + b;
        case Ease.ExpoInOut: return easeInOutExpo(t, b, c, d);
        case Ease.ExpoOut: return easeOutExpo(t, b, c, d);
        case Ease.ExpoIn: return easeInExpo(t, b, c, d);
        case Ease.CircOut: return easeOutCirc(t, b, c, d);
        case Ease.CircIn: return easeInCubic(t, b, c, d);
        case Ease.CircInOut: return easeInOutCirc(t, b, c, d);
        case Ease.QuadOut: return easeOutQuad(t, b, c, d);
        case Ease.QuadIn: return easeInQuad(t, b, c, d);
        case Ease.QuadInOut: return easeInOutQuad(t, b, c, d);
        case Ease.SineOut: { return easeOutSine(t, b, c, d); }
        case Ease.SineIn: return easeInSine(t, b, c, d);
        case Ease.SineInOut: return easeInOutSine(t, b, c, d);
        case Ease.CubicOut: return easeOutCubic(t, b, c, d);
        case Ease.CubicIn: return easeInCubic(t, b, c, d);
        case Ease.CubicInOut: return easeInOutCubic(t, b, c, d);
        case Ease.QuartIn: return easeInQuart(t, b, c, d);
        case Ease.QuartOut: return easeOutQuart(t, b, c, d);
        case Ease.QuartInOut: return easeInOutQuart(t, b, c, d);
        case Ease.QuintIn: return easeInQuint(t, b, c, d);
        case Ease.QuintOut: return easeOutQuint(t, b, c, d);
        case Ease.QuintInOut: return easeInOutQuint(t, b, c, d);
        case Ease.ElasticIn: return easeInElastic(t, b, c, d);
        case Ease.ElasticOut: return easeOutElastic(t, b, c, d);
        case Ease.ElasticInOut: return easeInOutElastic(t, b, c, d);
        case Ease.BounceIn: return easeOutBounce(t, b, c, d);
        case Ease.BounceOut: return easeOutBounce(t, b, c, d);
        case Ease.BounceInOut: return easeOutBounce(t, b, c, d);
        case Ease.BackIn: return easeInBack(t, b, c, d);
        case Ease.BackOut: return easeOutBack(t, b, c, d);
        case Ease.BackInOut: return easeInOutBack(t, b, c, d);
    }
}
//#endregion

export { createTweener, DOChangeXY, DOChangeValue, DelayedCall, Ease, Sequence }