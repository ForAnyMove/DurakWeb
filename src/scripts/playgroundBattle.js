import { CardsPairWrapper } from "./cardModel.js";
import { Delay } from "./dotween/dotween.js";
import { createElement } from "./helpers.js";

function canBeatCard(cardAttack, cardDefend) {
    if (cardDefend.suit == trumpSuit && cardAttack.suit == trumpSuit) {
        return cardAttack.rank > cardDefend.rank;
    } else if (cardDefend.suit == trumpSuit) {
        return false;
    } else if (cardAttack.suit == trumpSuit) {
        return true;
    } else {
        return cardAttack.suit == cardDefend.suit && cardAttack.rank > cardDefend.rank;
    }
}

class BattleZone {
    constructor() {
        this.wrapper = null;

        this.createDomElement();
        this.cards = [];
    }

    createDomElement() {
        const playgroundZone = document.getElementsByClassName('playground-zone')[0]
        const element = createElement('div', ['playground-pare-element']);
        this.wrapper = new CardsPairWrapper(element);

        this.wrapper.cardAddedEvent.addListener(this.addCard);

        playgroundZone.appendChild(element);
    }

    addCard = (card) => {
        this.cards.push(card);
        // console.log(this.cards);
    }

    canBeat(card) {
        if (this.cards.length == 0) {
            return true;
        } else if (this.cards.length >= 2) {
            return false;
        }

        const zoneCard = this.cards[0];

        return canBeatCard(card, zoneCard)
    }
}

class Battleground {
    constructor() {
        this.zones = [];
    }

    createZone() {
        const zone = new BattleZone();
        this.zones.push(zone);

        return zone;
    }

    tryBeatZone(card, zone) {
        let selectedZone = null;
        for (let i = 0; i < this.zones.length; i++) {
            selectedZone = this.zones[i];
            if (zone == selectedZone) {
                break;
            }
        }

        if (selectedZone == null) return false;

        return selectedZone.canBeat(card);
    }

    canTransfareByRule(cards) {
        // return false;

        const zoneCards = this.getCards();

        if (zoneCards.length != this.zones.length) return false;

        return zoneCards.length + 1 <= cards.length
    }

    canTransfare(card) {
        const cards = this.getCards();

        if (cards.length != this.zones.length) return false;

        let prevRank = cards[0].rank;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.rank != prevRank) return false;
        }

        return card.rank == prevRank;
    }

    canToss(card) {
        const cards = this.getCards();
        for (let i = 0; i < cards.length; i++) {
            const zoneCard = cards[i];
            if (card.rank == zoneCard.rank) {
                return true;
            }
        }

        return false;
    }

    async clearZones() {
        for (let i = 0; i < this.zones.length; i++) {
            const element = this.zones[i];
            element.wrapper.domElement.remove();
            this.zones[i] = null;
        }

        this.zones = [];
        await Delay(0.05 / globalGameSpeed);
    }

    clear() {
        for (let i = 0; i < this.zones.length; i++) {
            const element = this.zones[i];
            element.wrapper.domElement.remove();
            this.zones[i] = null;
        }

        this.zones = [];
    }

    getCards = function () {
        const cards = [];
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            for (let i = 0; i < zone.cards.length; i++) {
                const card = zone.cards[i];
                cards.push(card);
            }
        }

        return cards;
    }
}

const battleground = new Battleground();

export { battleground, canBeatCard }