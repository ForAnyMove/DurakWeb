import { EntityMode, GameMode } from "./battleFlow.js";
import { Action } from "./globalEvents.js";
import { load, save } from "./save_system/SaveSystem.js";

let updateEvent = new Action();

let statistics = {
    ingameDayCount: 0,
    gameCount: {
        byGameMode: [
            { rule: GameMode.DurakDefault, count: 0 },
            { rule: GameMode.DurakTransfare, count: 0 },
        ],
        byEntityMode: [
            { rule: EntityMode.Self, count: 0 },
            { rule: EntityMode.Pair, count: 0 },
        ],
        overall: 0
    },
    winCount: {
        byGameMode: [
            { rule: GameMode.DurakDefault, count: 0 },
            { rule: GameMode.DurakTransfare, count: 0 },
        ],
        byEntityMode: [
            { rule: EntityMode.Self, count: 0 },
            { rule: EntityMode.Pair, count: 0 },
        ],
        overall: 0
    },
    loseCount: {
        byGameMode: [
            { rule: GameMode.DurakDefault, count: 0 },
            { rule: GameMode.DurakTransfare, count: 0 },
        ],
        byEntityMode: [
            { rule: EntityMode.Self, count: 0 },
            { rule: EntityMode.Pair, count: 0 },
        ],
        overall: 0
    },
    winInARow: {
        byGameMode: [
            { rule: GameMode.DurakDefault, count: 0 },
            { rule: GameMode.DurakTransfare, count: 0 },
        ],
        byEntityMode: [
            { rule: EntityMode.Self, count: 0 },
            { rule: EntityMode.Pair, count: 0 },
        ],
        overall: 0
    },
    draw: {
        byGameMode: [
            { rule: GameMode.DurakDefault, count: 0 },
            { rule: GameMode.DurakTransfare, count: 0 },
        ],
        byEntityMode: [
            { rule: EntityMode.Self, count: 0 },
            { rule: EntityMode.Pair, count: 0 },
        ],
        overall: 0
    },
    throwedCards: 0,
    transfaredCards: 0,
    maxCurrencyCollected: 0,
    lostWithAces: 0
};

statistics = load("game_statistics", statistics);

function updateCurrencyStatistics(currentCurrencyValue) {
    if (statistics.maxCurrencyCollected < currentCurrencyValue) {
        statistics.maxCurrencyCollected = currentCurrencyValue;

        updateStatistics();
    }
}

function updateStatistics() {
    updateEvent.invoke();

    save("game_statistics", statistics);
}

export { statistics, updateStatistics, updateCurrencyStatistics, updateEvent }