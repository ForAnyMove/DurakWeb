import { backSkinDatabase, backgroundDatabase, skinDatabase } from "./data/card_skin_database.js"
import { Pattern, SuitMode } from "./statics/enums.js"
import { IconsByItem } from "./statics/staticValues.js"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomFloat(max) {
    return Math.random() * max;
}

function createItem(type, count) {
    return {
        type: type,
        count: count
    }
}

function createDeckTrial(count, description) {
    return {
        decksToComplete: count,
        description: description,
    }
}

function createTrialLevel(order, type, state, rule, rewards, time, levelTrial) {
    return {
        order: order,
        type: type,
        state: state,
        gameRule: rule,
        rewards: rewards,
        time: time,
        trial: levelTrial
    }
}

function createStoryLevel(order, type, state, rule, rewards, pass, lvReq) {
    return {
        order: order,
        type: type,
        state: state,
        gameRule: rule,
        rewards: rewards,
        pass: pass,
        levelRequirement: lvReq
    }
}

function createLevelCompleteRequirement(type, order) {
    return { type: type, order: order }
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let timeString = '';

    timeString += hours.toString().padStart(2, '0') + ':';
    timeString += minutes.toString().padStart(2, '0') + ':';
    timeString += remainingSeconds.toString().padStart(2, '0');

    return timeString;
}

function getIconByItem(itemType) {
    for (let i = 0; i < IconsByItem.length; i++) {
        const element = IconsByItem[i];
        if (element.type == itemType) {
            return element.url;
        }
    }
}

function getIconByContent(id) {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
    for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
        const element = backSkinDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
    for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
        const element = backgroundDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
}


function getSuitName(suit) {
    switch (suit) {
        case SuitMode.OneSuit: return 'Одна масть'
        case SuitMode.TwoSuits: return 'Две масти'
        case SuitMode.FourSuits: return 'Четыре масти'
    }
}
function getSuitLang(suit) {
    switch (suit) {
        case SuitMode.OneSuit: return 'one_suit'
        case SuitMode.TwoSuits: return 'two_suit'
        case SuitMode.FourSuits: return 'four_suit'
    }
}

function getIconBySuit(suit) {
    switch (suit) {
        case SuitMode.OneSuit: return 'Sprites/Icons/Icon_OneSuit.png'
        case SuitMode.TwoSuits: return 'Sprites/Icons/Icon_TwoSuits.png'
        case SuitMode.FourSuits: return 'Sprites/Icons/Icon_FourSuits.png'
    }
}

function getPatternName(pattern) {
    switch (pattern) {
        case Pattern.Spider: return 'Паук'
        case Pattern.SpiderLady: return 'Паучиха'
    }
}

function getPatternLang(pattern) {
    switch (pattern) {
        case Pattern.Spider: return 'spider'
        case Pattern.SpiderLady: return 'spider_w'
    }
}

function getIconByPattern(pattern) {
    switch (pattern) {
        case Pattern.Spider: return 'Sprites/Icons/Icon_Spider.png'
        case Pattern.SpiderLady: return 'Sprites/Icons/Icon_Spider_L.png'
    }
}

function createElement(id, classList, styleList, parent) {
    const element = document.createElement(id);
    element.tabIndex = "-1";

    if (element == null) return null;

    if (classList != null) {
        for (let i = 0; i < classList.length; i++) {
            if (classList[i] === '') continue;

            element.classList.add(classList[i]);
        }
    }

    if (styleList != null) {
        const keys = Object.keys(styleList);
        for (let i = 0; i < keys.length; i++) {
            element.style[keys[i]] = styleList[keys[i]];
        }
    }

    if (parent != null) {
        parent.appendChild(element);
    }

    return element;
}

function createImage(classList, styleList, parent, src) {
    const element = createElement('img', classList, styleList, parent);
    element.draggable = false;
    element.src = src;

    return element;
}

function createButton(classList, styleList, parent, onClick) {
    const element = createElement('button', classList, styleList, parent);

    if (onClick != null) {
        element.onclick = function () {
            audioManager.playSound();

            onClick();
        }
    }
    return element;
}

function createTextP(classList, styleList, parent, text, lang) {
    const element = createElement('p', classList, styleList, parent);
    element.innerText = text;
    if (lang != null) {
        element.lang = lang;
    }
    return element;
}

function createTextSpan(classList, styleList, parent, text, lang) {
    const element = createElement('span', classList, styleList, parent);
    element.innerText = text;
    if (lang != null) {
        element.lang = lang;
    }
    return element;
}

function createTextH3(classList, styleList, parent, text, lang) {
    const element = createElement('h3', classList, styleList, parent);
    element.innerText = text;
    if (lang != null) {
        element.lang = lang;
    }
    return element;
}

function createHSpace(width, parent) {
    const element = createElement('h3', null, { width: width }, parent);
    return element;
}

function createVSpace(height, parent) {
    const element = createElement('h3', null, { height: height }, parent);
    return element;
}

function isSameCard(card, template) {
    return card.id == template.id;
}

function isCardHasRange(cards, card, range, maximumCountOfSameCards) {
    function calculateCount(cardStructure) {
        let count = 0;
        for (let i = 0; i < cards.length; i++)
            if (isSameCard(cards[i], cardStructure))
                count++;

        return count;
    }

    let selectedRank = card.rank;
    let selectedSuit = card.suit;

    for (let i = 0; i < cards.length; i++) {
        let rank = cards[i].rank;
        let suit = cards[i].suit;
        for (let j = 0; j < range + 1; j++)
            if (selectedSuit == suit && (rank == selectedRank - j || rank == selectedRank + j)) {
                let count = calculateCount(cards[i]);

                if (count >= maximumCountOfSameCards)
                    return true;
                return false;
            }
    }

    return false;
}

function compareCards(cardOne, cardTwo) {
    return cardOne.suit == cardTwo.suit && cardOne.rank == cardTwo.rank;
}
function compareCardsFull(rankOne, suitOne, rankTwo, suitTwo) {
    return rankOne == rankTwo && suitOne == suitTwo;
}
function isCardAtRankLower(card, template) {
    return card.suit == template.suit && card.rank == template.rank - 1;
}

function getElementsByClass(root, classNames = []) {
    const elements = [];

    for (let i = 0; i < classNames.length; i++) {
        const className = classNames[i];
        const rootElements = root.getElementsByClassName(className);

        for (let i = 0; i < rootElements.length; i++) {
            const element = rootElements[i];
            elements.push(element);
        }
    }

    return elements;
}

function getElements(root, options = { classNames, tags, ids }) {
    const elements = [];

    if (options.classNames) {
        for (let i = 0; i < options.classNames.length; i++) {
            const name = options.classNames[i];
            const rootElements = root.getElementsByClassName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }
    if (options.tags) {
        for (let i = 0; i < options.tags.length; i++) {
            const name = options.tags[i];
            const rootElements = root.getElementsByTagName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }
    if (options.ids) {
        for (let i = 0; i < options.ids.length; i++) {
            const name = options.ids[i];
            const rootElements = root.getElementById(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }

    return elements;
}

function getInputElements(root, options = { classNames, tags, ids }) {
    const elements = [];

    if (options.classNames) {
        for (let i = 0; i < options.classNames.length; i++) {
            const name = options.classNames[i];
            const rootElements = root.getElementsByClassName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }
    if (options.tags) {
        for (let i = 0; i < options.tags.length; i++) {
            const name = options.tags[i];
            const rootElements = root.getElementsByTagName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }
    if (options.ids) {
        for (let i = 0; i < options.ids.length; i++) {
            const name = options.ids[i];
            const rootElements = root.getElementById(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }

    return elements;
}

function getValueByKeyInArray(key, array) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const elementKey = Object.keys(element)[0];
        if (elementKey == key) {
            return element[elementKey];
        }
    }

    return null;
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setDynamicContainerText(locale, struct, recursive = true) {
    // await timeout(400);
    let customWidthMultiplier = 1;
    if (locale == 'ru') {
        customWidthMultiplier = 0.9;
    }

    struct.maxFontSizes = [];
    struct.fontSizes = [];

    const textSize = { width: struct.elements[0].offsetWidth, height: 0 }
    let overalFontSize = 0;

    // let log = false;

    // if (struct.container.classList.contains('booster-prompt-container')
    //     // struct.elements[0].lang.includes('trial_prefix_01') || struct.elements[0].lang.includes('undo')
    // ) {
    //     console.log(containerSize);
    //     log = true;
    // }

    for (let i = 0; i < struct.elements.length; i++) {
        const element = struct.elements[i];

        textSize.height += element.offsetHeight;

        const style = window.getComputedStyle(element);

        const maxFontSize = style.getPropertyValue('--target-font-size');
        const targetFontSize = parseFloat(maxFontSize) * (maxFontSize.toString().includes('vh') ? (window.innerHeight / 100) : (window.innerWidth / 100));

        if (maxFontSize == '') {
            // if (recursive) { setDynamicContainerText(locale, struct, false) }
            return;
        }

        element.style.fontSize = maxFontSize;

        struct.fontSizes.push(targetFontSize);

        struct.maxFontSizes.push(maxFontSize);

        overalFontSize += parseFloat(maxFontSize);
    }

    const containerStyle = window.getComputedStyle(struct.container);

    const containerPadding = {
        width: parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight),
        height: parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom)
    }
    const containerSize = {
        width: struct.container.offsetWidth - containerPadding.width,
        height: struct.container.offsetHeight - containerPadding.height
    }

    containerSize.width *= customWidthMultiplier;

    let needToRecursive = false;

    for (let i = 0; i < struct.elements.length; i++) {
        const element = struct.elements[i];

        const maxFontSize = struct.maxFontSizes[i];
        const fs = struct.fontSizes[i];
        const fontRatioCoefficient = parseFloat(maxFontSize) / overalFontSize;

        const textWidth = element.offsetWidth;
        const textHeight = element.offsetHeight / fontRatioCoefficient;

        const fontSize = fs;

        // if (log) {
        //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
        //     if (logEl) {
        //         logEl.innerHTML += `<span>TW: ${textWidth} TH: ${textHeight} // CW: ${containerSize.width} CH: ${containerSize.height} -> ${element.innerText}</span>`
        //     }
        // }

        if (textHeight > containerSize.height || textWidth > containerSize.width) {
            const newFontSize = fontSize * Math.min((containerSize.height / textHeight), 1) * Math.min((containerSize.width / textWidth), 1);
            // if (log) {
            //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
            //     if (logEl) {
            //         logEl.innerHTML += `<span><> CRRENT FONT SIZE: ${element.style.fontSize} = ${parseFloat(element.style.fontSize) * (element.style.fontSize.toString().includes('vh') ? (window.innerHeight / 100) : (window.innerWidth / 100))}px</span>`
            //     }
            // }
            element.style.fontSize = newFontSize + 'px';
            // if (log) {
            //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
            //     if (logEl) {
            //         logEl.innerHTML += `<span><> RECALCULATE: ${newFontSize}px</span>`
            //         logEl.innerHTML += `<span><> NEW FONT SIZE: ${element.style.fontSize}</span>`
            //     }
            // }
        } else {
            // if (log) {
            //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
            //     if (logEl) {
            //         logEl.innerHTML += `<span><> DEFAULT FONT SIZE: ${element.style.fontSize} = ${parseFloat(element.style.fontSize) * (element.style.fontSize.toString().includes('vh') ? (window.innerHeight / 100) : (window.innerWidth / 100))}px</span>`
            //     }
            // }
        }
        // else {
        //     needToRecursive = true;

        //     element.style.fontSize = struct.maxFontSizes[i];
        //     if (log) {
        //         const logEl = document.getElementsByClassName('ignore-DFC')[0];
        //         if (logEl) {
        //             logEl.innerHTML += `<span><> DEFAULT FONT SIZE: ${struct.maxFontSizes[i]}</span>`
        //         }

        //         console.log(struct.maxFontSizes[i]);
        //     }
        // };
    }

    if (needToRecursive && recursive) {
        // if (log) {
        //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
        //     if (logEl) {
        //         logEl.innerHTML += `<span><RECURS></span>`
        //     }
        // }
        setDynamicContainerText(struct, false);
    }

    // if (log) {
    //     const logEl = document.getElementsByClassName('ignore-DFC')[0];
    //     if (logEl) {
    //         logEl.innerHTML += `<span>-</span>`
    //     }
    // }
}

function setDynamicFontSize(text, recursive = false) {
    // function getTextWidth(text, font) {
    //     const span = document.createElement('span');
    //     span.style.visibility = 'hidden';
    //     span.style.position = 'absolute';
    //     span.style.whiteSpace = 'nowrap';
    //     span.style.font = font;
    //     span.textContent = text;
    //     document.body.appendChild(span);
    //     const width = span.offsetWidth;
    //     document.body.removeChild(span);
    //     return width;
    // }
    const textStyle = window.getComputedStyle(text);
    const parentContainer = text.parentElement;

    let height = 0;
    {
        const ptexts = getElements(parentContainer, { tags: ['span'] });
        for (let i = 0; i < ptexts.length; i++) {
            const element = ptexts[i];
            height += element.offsetHeight;
        }

        // console.log(ptexts);
        // console.log(height);
    }

    const parentStyle = window.getComputedStyle(parentContainer)
    const parentHorizontalPadding = parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
    const parentVerticalPadding = parseFloat(parentStyle.paddingTop) + parseFloat(parentStyle.paddingBottom);

    const containerWidth = parentContainer.offsetWidth - parentHorizontalPadding;
    const containerHeight = parentContainer.offsetHeight - parentVerticalPadding;

    const textWidth = text.offsetWidth;
    const textHeight = height;

    const fontSize = parseFloat(textStyle.fontSize);
    if (textHeight > containerHeight || textWidth > containerWidth) {
        const newFontSize = fontSize * Math.min((containerHeight / textHeight), 1) * Math.min((containerWidth / textWidth), 1);
        text.style.fontSize = newFontSize + 'px';
    } else {
        text.style.fontSize = textStyle.getPropertyValue('--target-font-size');
        if (recursive) {
            setDynamicFontSize(text, false);
        }
    }
}

async function preloadImagesAsync(urls) {
    const promises = [];

    urls.forEach(url => {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
            img.src = url;
        });
        promises.push(promise);
    });

    return Promise.all(promises);
}

const getElementRotation = (el) => {
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
        "none";
    if (tm != "none") {
        var values = tm.split('(')[1].split(')')[0].split(',');
        /*
        a = values[0];
        b = values[1];
        angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
        */
        //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
        var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0;
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function getRectPosition(rect) {
    return { x: rect.left, y: rect.top }
}
function getRectSize(rect) {
    return { x: rect.width, y: rect.height }
}

function isTwoElementsOverlaps(one, two) {
    const oneRect = one.getBoundingClientRect();
    const twoRect = two.getBoundingClientRect();

    return !(oneRect.right < twoRect.left ||
        oneRect.left > twoRect.right ||
        oneRect.bottom < twoRect.top ||
        oneRect.top > twoRect.bottom);
}

function setRemoveClass(element, className, condition) {
    if (condition) {
        if (!element.classList.contains(className))
            element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}
function getGlobalScale(element) {
    let scale = 1;

    while (element) {
        const style = window.getComputedStyle(element);
        const styleScale = style.scale;
        if (styleScale != 'none') {
            scale *= parseFloat(styleScale);
        }

        element = element.parentElement;
    }

    return scale;
}

function getRotationDegrees(element) {
    const style = window.getComputedStyle(element);
    const transform = style.transform || style.webkitTransform || style.mozTransform;

    if (transform === 'none') {
        const rotate = style.rotate;
        if (rotate == 'none') return 0;

        return parseFloat(rotate);
    }

    const angle = parseFloat(transform.match(/-?\d+(\.\d+)?/)) * Math.PI * -2;

    return angle;
}

function getGlobalRotation(element) {
    let rotation = 0;

    while (element) {
        const angle = getRotationDegrees(element);
        rotation += angle;

        element = element.parentElement;
    }

    return rotation;
}

async function setScaleBypassingTransition(element, scale) {
    const temp = window.getComputedStyle(element).transition;
    element.style.transition = 'none';
    element.style.scale = scale;
    await new Promise((i) => setTimeout(() => i(), 0));
    element.style.transition = temp;
}

function elementSize(element) {
    const style = window.getComputedStyle(element);
    return { width: style.width, height: style.height };
}

function pullOutElement(element, zIndex, saveParent) {
    const rotation = getGlobalRotation(element);
    const data = {
        transform: null,
        position: null,
        zIndex: null,
        parent: saveParent ? element.parentElement : null
    }

    const pos = getRectData(element).position;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const scale = getGlobalScale(element);

    element.style.position = 'absolute';
    document.body.appendChild(element);

    element.style.scale = scale;

    const left = (pos.x - parseFloat(style.marginLeft)) - rect.width * ((1 / scale - 1) / 2);
    const top = (pos.y - parseFloat(style.marginTop)) - rect.height * ((1 / scale - 1) / 2);

    element.style.left = left + 'px';
    element.style.top = top + 'px';
    element.style.rotate = `${rotation}deg`;
    data.transform = element.style.transform;

    element.style.transform = 'none';

    data.zIndex = element.style.zIndex;
    element.style.zIndex = zIndex;

    return data;
}

function pullOutClear(element, data) {
    element.style.position = data.position;
    element.style.zIndex = data.zIndex;
    element.style.transform = data.transform;
    element.style.rotate = '';
    element.style.scale = '';
    element.style.left = '';
    element.style.top = '';
    if (data.parent != null) {
        data.parent.appendChild(element)
    }
}

function getRectData(element, scaleBased = false) {
    const data = {
        position: { x: 0, y: 0 },
        size: { x: 0, y: 0 },
        center: { x: 0, y: 0 }
    }

    const rect = element.getBoundingClientRect();

    data.position.x = rect.left;
    data.position.y = rect.top;

    data.size.x = rect.width;
    data.size.y = rect.height;

    if (scaleBased) {
        const scale = getGlobalScale(element);
        data.position.x -= data.size.x * ((1 / scale - 1) / 2);
        data.position.y -= data.size.y * ((1 / scale - 1) / 2);
    }

    data.center.x = data.position.x + data.size.x / 2;
    data.center.y = data.position.y + data.size.y / 2;

    return data;
}

function getTargetPosition(elementToTranslate, elementTranslateTo) {
    const from = getRectData(elementToTranslate);
    const to = getRectData(elementTranslateTo);

    return { x: to.center.x - from.size.x / 2, y: to.center.y - from.size.y / 2 };
}

async function removeCard(element) {
    const currentTransition = element.style.transition;
    const currentTransform = element.style.transform;

    element.style.transition = 'none';
    element.style.transform = '';

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const scale = getGlobalScale(element);

    const width = parseFloat(style.width);
    const height = parseFloat(style.height);


    const point = { x: rect.left, y: rect.top };
    const origin = { x: point.x + width / 2, y: point.y + height };

    if (!isNaN(scale) && scale > 0) {
        let direction = { x: point.x - origin.x, y: point.y - origin.y };

        point.x = origin.x + direction.x / scale;
        point.y = origin.y + direction.y / scale;
    }

    element.style.transform = currentTransform;
    await new Promise(p => setTimeout(p, 0));

    element.style.transition = currentTransition;

    element.style.position = 'absolute';
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;

    document.body.appendChild(element);

    return point;
}

export {
    createElement,
    createTextH3,
    createButton, createImage,
    createTextP,
    createTextSpan,
    createHSpace,
    shuffle,
    createItem,
    createDeckTrial,
    createTrialLevel,
    createStoryLevel,
    createLevelCompleteRequirement,
    secondsToTime,
    getSuitName,
    getPatternName,
    getIconByPattern,
    getIconBySuit,
    getIconByItem,
    getIconByContent,
    createVSpace,
    getRandomInt,
    getRandomFloat,
    isCardHasRange,
    isSameCard,
    compareCards,
    compareCardsFull,
    isCardAtRankLower,
    getElementsByClass,
    getElements,
    getInputElements,
    getValueByKeyInArray,
    getSuitLang,
    getPatternLang,
    setDynamicFontSize,
    setDynamicContainerText,
    preloadImagesAsync,
    getElementRotation,
    lerp,
    getRectPosition,
    getRectSize,
    isTwoElementsOverlaps,
    setRemoveClass,
    getGlobalScale,
    setScaleBypassingTransition,
    elementSize,
    pullOutElement,
    pullOutClear,
    getRectData,
    getTargetPosition,
    removeCard
}