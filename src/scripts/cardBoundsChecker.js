
// const closedCardOffset = 0.5;
// const openedCardOffset = 1.5;

import { isTwoElementsOverlaps } from "./helpers.js";
import { battleground } from "./playgroundBattle.js";

class BoundsChecker {
    registerColumns = function (columns) {
        this.columns = columns;
    }

    isCardInPlayground = function (card) {
        const playground = document.getElementsByClassName('playground-zone')[0];
        const isOperlap = isTwoElementsOverlaps(playground, card.domElement);

        return isOperlap;
    }

    getBattleZoneByCard = function (card) {
        const zones = battleground.zones;

        const overlapZones = [];
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            if (isTwoElementsOverlaps(zone.wrapper.domElement, card.domElement)) {
                overlapZones.push(zone);
            }
        }

        if (overlapZones.length == 0) return null;
        return overlapZones[0];
    }
}

const boundsChecker = new BoundsChecker();

export { boundsChecker }