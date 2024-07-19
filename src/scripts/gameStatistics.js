import { EntityMode, GameMode } from "./battleFlow.js";
import { Action } from "./globalEvents.js";
import { load, save } from "./save_system/SaveSystem.js";

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

function initializeStatistics() {
    updateEvent = new Action();
    statistics = load("game_statistics", {
        ingameDayCount: 0,
        gameCount: {
            byGameMode: [
                { gameMode: GameMode.DurakDefault, count: 0 },
                { gameMode: GameMode.DurakTransfare, count: 0 },
            ],
            byEntityMode: [
                { entityMode: EntityMode.Self, count: 0 },
                { entityMode: EntityMode.Pair, count: 0 },
            ],
            overall: 0
        },
        winCount: {
            byGameMode: [
                { gameMode: GameMode.DurakDefault, count: 0 },
                { gameMode: GameMode.DurakTransfare, count: 0 },
            ],
            byEntityMode: [
                { entityMode: EntityMode.Self, count: 0 },
                { entityMode: EntityMode.Pair, count: 0 },
            ],
            overall: 0
        },
        loseCount: {
            byGameMode: [
                { gameMode: GameMode.DurakDefault, count: 0 },
                { gameMode: GameMode.DurakTransfare, count: 0 },
            ],
            byEntityMode: [
                { entityMode: EntityMode.Self, count: 0 },
                { entityMode: EntityMode.Pair, count: 0 },
            ],
            overall: 0
        },
        winInARow: {
            byGameMode: [
                { gameMode: GameMode.DurakDefault, count: 0 },
                { gameMode: GameMode.DurakTransfare, count: 0 },
            ],
            byEntityMode: [
                { entityMode: EntityMode.Self, count: 0 },
                { entityMode: EntityMode.Pair, count: 0 },
            ],
            overall: 0
        },
        draw: {
            byGameMode: [
                { gameMode: GameMode.DurakDefault, count: 0 },
                { gameMode: GameMode.DurakTransfare, count: 0 },
            ],
            byEntityMode: [
                { entityMode: EntityMode.Self, count: 0 },
                { entityMode: EntityMode.Pair, count: 0 },
            ],
            overall: 0
        },
        throwedCards: 0,
        transfaredCards: 0,
        maxCurrencyCollected: 0,
        lostWithAces: 0
    });
}

export { updateStatistics, updateCurrencyStatistics, initializeStatistics }