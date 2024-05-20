import { createLevel } from "./levelCreator.js";

class TutorialFlow {
    constructor(entities, rules) {
        this.entities = entities;

        this.result = createLevel(rules.cardsCount);
        this.mainDeck = this.result.mainCardColumn;
    }

    async distributeCards() {
        let distributionCount = 0
        const distributionDelay = 0.02
        const distributions = [];

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            const cardsCount = entity.wrapper.cards.length;

            const requiredCardsCount = Math.max((6 - cardsCount), 0);
            if (requiredCardsCount > 0) {
                distributionCount += requiredCardsCount;
                distributions.push({
                    index: i,
                    count: requiredCardsCount,
                    placed: 0
                })
            }
        }

        let currentDistribution = 0;
        distributionCount = Math.min(distributionCount, this.mainDeck.cards.length);

        await SequencedDelay(distributionCount, distributionDelay / globalGameSpeed, (i) => {
            let distribution = distributions[currentDistribution];
            if (distribution.placed == distribution.count) {
                currentDistribution++;
                if (currentDistribution > distributions.length - 1) return;

                distribution = distributions[currentDistribution];
            }

            const entity = this.entities[distribution.index];
            const card = this.mainDeck.cards[this.mainDeck.cards.length - 1];

            if (this.mainDeck.cards.length == 1) {
                const copy = card.domElement.cloneNode(true);
                copy.style.transition = 'none';
                copy.style.transform = '';
                copy.style.opacity = 0.5;
                this.mainDeck.domElement.appendChild(copy);
            }

            if (entity.isUser) {
                card.setOpened();
            } else {
                card.setClosed();
            }

            distribution.placed++;
            entity.wrapper.translateCard(card);
        })

        await Delay(0.2 / globalGameSpeed);
    }
}

export { TutorialFlow }