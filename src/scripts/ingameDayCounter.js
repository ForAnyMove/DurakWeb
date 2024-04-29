import { statistics, updateStatistics } from "./gameStatistics.js";
import { Action } from "./globalEvents.js";
import { load, save } from "./save_system/SaveSystem.js"

let dayCounterUpdated = new Action();

let data = {
    time: -1,
    lastDay: 0
}

data = load("day_counter", {
    time: -1,
    lastDay: 0
});

if (data.lastDay == 0) {
    data.time = Date.now();
    data.lastDay = 1;

    statistics.ingameDayCount = 1;
    updateStatistics();

    dayCounterUpdated.invoke();

    save("day_counter", data);
}


function check() {
    let currentTime = Date.now() + getDayInSecond();

    let difference = currentTime - data.time;

    let secs = difference / 1000;

    let daysFromStart = Math.floor(secs / getDayInSecond());

    if (daysFromStart >= 1) {
        data.lastDay++;
        data.time = Date.now();
        save("day_counter", data);

        statistics.ingameDayCount = data.lastDay;
        updateStatistics();

        dayCounterUpdated.invoke();
    }
}

check();


function getDayInSecond() {
    return 24 * 60 * 60;
}

let inDayGameCount = () => data.lastDay;

export { inDayGameCount }