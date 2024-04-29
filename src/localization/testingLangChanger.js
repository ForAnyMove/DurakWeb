import { createElement } from "../scripts/helpers.js";
import { locales } from "../scripts/statics/staticValues.js";
import { initialLocale } from "./translator.js";

function createDropdown() {
    let interval = null;

    const parent = document.getElementsByTagName('body')[0];

    const plane = createElement('div', null, { position: 'absolute', left: '1vw', top: '1vh', display: 'flex', zIndex: 2000 }, parent);
    const label = createElement('label', null, null, plane);
    label.for = 'lang-names';

    const select = createElement('select', null, { width: '10vw', height: '2vh', minWidth: '10vh', borderRadius: '0.3vh', }, plane);
    select.name = 'lang-names';
    select.id = 'lang-names';

    const titleValues = [
        ['Russian', 'ru'],
        ['English', 'en'],
        ['German', 'de'],
        ['Japanese', 'ja'],
        ['Hindi', 'hi'],
        ['Portuguese', 'pt'],
        ['Spanish', 'es'],
        ['Turkish', 'tr'],
    ]

    titleValues.forEach(element => {
        const op = createElement('option', null, null, select);
        op.value = element[1];
        op.innerText = element[0];

    });

    select.addEventListener("change", function () {
        const selectedValue = select.value;
        languageChangeEvent.invoke(selectedValue);
    });

    select.value = initialLocale

    const checkBox = createElement('input', null, { height: '2vh', width: '2vh', marginLeft: '0.5vh' }, plane);
    checkBox.type = "checkbox"

    checkBox.addEventListener('change', function () {
        if (checkBox.checked) {

            let testIndex = (locales.indexOf(select.value) + 1) % locales.length;
            interval = setInterval(() => {
                select.value = locales[testIndex]
                languageChangeEvent.invoke(locales[testIndex]);
                testIndex < 7 ? testIndex++ : testIndex = 0
            }, 500);

        } else {
            clearInterval(interval);
        }
    })
}

createDropdown();