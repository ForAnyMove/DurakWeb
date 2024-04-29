import { animator } from "./animator.js";
import { DelayedCall } from "./dotween/dotween.js";
import { Action, CanInteract, disableInteractions, enableInteractions } from "./globalEvents.js";
import { stepRecorder } from "./stepRecorder.js";

class Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        this.mainCardColumn = options.mainCardColumn;
        this.playableCardColumns = options.playableCardColumns;

        this.firstDistribution = [];
        this.defaultDistribution = [];

        this.onDistributionFinished = new Action();
    }

    initialDistribution = function () {
        this.distribute([].concat(this.firstDistribution));
    }

    ingameDistribution = function () {
        this.distribute([].concat(this.defaultDistribution));
        stepRecorder.record(() => {
            const cards = [];

            for (let i = 0; i < this.playableCardColumns.length; i++) {
                const column = this.playableCardColumns[i];

                cards.push(column.getLastCard());
            }

            const mainColumn = this.mainCardColumn;
            mainColumn.translateCardsToColumnWithDelay(cards,
                null,
                { opened: 0.02, closed: 0 },
                { opened: 0, closed: 0 },
                { affectInteraction: false, addCards: true, openOnFinish: false, closeOnFinish: true, delay: 0.03 });
        });
    }

    distribute = function (distributions) {
        if (!CanInteract || distributions.length == 0 || this.mainCardColumn.cards.length == 0) return;

        const mc = this.mainCardColumn;
        const pc = this.playableCardColumns;

        const callback = this.onDistributionFinished;
        let time = 0;
        function update(dt) {
            time += dt * 60 / 1000;
            if (time >= 0.03) {
                if (distributions.length == 0 || mc.cards.length == 0) {
                    animator.removeRequest(update);
                    enableInteractions();

                    DelayedCall(0.15, () => {
                        callback.invoke();
                    });
                    return;
                }

                const dist = distributions[0];
                const card = mc.cards[mc.cards.length - 1];
                pc[dist.column].translateCardsToColumnWithOffset([card], null, { opened: 0, closed: 0 }, { opened: null, closed: null }, { affectInteraction: false, addCards: true, openOnFinish: dist.opened });
                distributions.splice(0, 1);

                time = 0;
            }
        }

        disableInteractions();
        animator.addRequest(update);
    }
}

class SpiderCroupier extends Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        super(options);

        for (let i = 0; i < this.playableCardColumns.length; i++) {
            this.defaultDistribution.push({ column: i, opened: true });
        }
        for (let i = 0; i < 54; i++) { // 54
            const index = i % 10;
            const opened = i > 43; // 43

            this.firstDistribution.push({ column: index, opened: opened });
        }
    }
}

class SpiderLadyCroupier extends Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        super(options);

        for (let i = 0; i < this.playableCardColumns.length; i++) {
            this.defaultDistribution.push({ column: i, opened: true });
        }

        let iterations = 0;
        while (iterations < this.playableCardColumns.length) {
            for (let i = iterations; i < this.playableCardColumns.length; i++) {
                this.firstDistribution.push({ column: i, opened: i == iterations ? true : false })
            }

            iterations++;
        }
    }
}

export { SpiderCroupier, SpiderLadyCroupier }