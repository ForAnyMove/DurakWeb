import { Action } from "./globalEvents.js";
import { setRemoveClass } from "./helpers.js";
import { Platform } from "./statics/staticValues.js";

export default class DirectionalInput {
    constructor(initialSelectedElement) {
        this.select(initialSelectedElement);
        this.selectableElements = [];

        // this.updateQuery();
        document.addEventListener('keydown', this.handleKeyDown);

        this.backup = null;
        this.ignoredAxis = [];

        this.saveSelectablePull = [];

        // todo: need to make root class [Input] and put basics there
        this.globalKeyHandlers = [];

        if (platform != null && platform == Platform.TV && SDK != null) {
            SDK.onEvent(SDK.EVENTS.HISTORY_BACK, () => {
                this.handleKey('Escape');
            });
        }

        this.keyWasTriggered = new Action();
    }

    loadBackup = function () {
        if (this.backup == null) return false;

        this.updateQueryCustom(this.backup.selectableElements, this.backup.selected);
        this.backup = null;
        return true;
    }

    clearSavedState = function (key) {
        for (let i = 0; i < this.saveSelectablePull.length; i++) {
            const pull = this.saveSelectablePull[i];
            if (pull.key == key) {
                this.saveSelectablePull.splice(i, 1);
                return;
            }
        }
    }

    saveSelectableState = function (key, selectables, selected) {
        for (let i = 0; i < this.saveSelectablePull.length; i++) {
            const pull = this.saveSelectablePull[i];
            if (pull.key == key) {
                this.saveSelectablePull[i].selectables = selectables;
                this.saveSelectablePull[i].selected = selected;
                return;
            }
        }

        this.saveSelectablePull.push({
            key: key,
            selectables: selectables,
            selected: selected
        })
    }

    loadFromSavedPull = function (key) {
        for (let i = 0; i < this.saveSelectablePull.length; i++) {
            const element = this.saveSelectablePull[i];
            if (element.key == key) {
                this.updateQueryCustom(element.selectables, element.selected?.() ?? element.selected);
                return true;
            }
        }

        this.updateQueryCustom([], { element: null });
        return false;
    }

    preventAxis = function (ignoreList) {
        this.ignoredAxis = ignoreList;
    }

    addGlobalKeyHandle = function (key, handle) {
        this.globalKeyHandlers.push({ key: key, handle: handle });
    }

    tryInvokeGlobalHandle = function (key) {
        for (let i = 0; i < this.globalKeyHandlers.length; i++) {
            const element = this.globalKeyHandlers[i];
            if (element.key == key) {
                element.handle?.();
            }
        }
    }

    isVisible = (element) => {
        function isElementHidden(element) {
            var computedStyle = window.getComputedStyle(element);

            if (computedStyle.display === 'none') {
                return true;
            }

            var parent = element.parentElement;
            while (parent) {
                if (window.getComputedStyle(parent).display === 'none') {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        }
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.visibility !== 'hidden' && !isElementHidden(element) && computedStyle.pointerEvents != 'none' && !element.classList.contains('inactive');
    }

    backupCurrentState = function () {
        if (this.backup != null) return;
        this.backup = {};
        this.backup.selectableElements = this.selectableElements;
        this.backup.selected = this.selected;
    }

    updateQuery = function () {
        const query = document.getElementsByTagName('button');
        this.selectableElements = [];

        for (let i = 0; i < query.length; i++) {
            const element = query[i];
            if (this.isVisible(element)) {
                this.selectableElements.push({ element: element });
            }
        }
    }

    updateQueryCustom = function (elements, selectedElement) {
        this.select(selectedElement);
        this.selectableElements = elements;
    }

    deselect = function () {
        if (this.selected == null || this.selected.element == null) return;

        setRemoveClass(this.selected.element, 'selected', false);
        this.selected.onDeselect?.();
        this.selected = null;
    }

    select = function (element) {
        if (element == null || element.element == null) return;

        this.deselect();

        this.selected = element;
        setRemoveClass(this.selected.element, 'selected', true);
        this.selected.onSelect?.();
    }

    selectFromPull = function (element) {
        if (element == null || element.element == null || !this.selectableElements.some(item => item.element == element.element)) return;

        this.select(element)
    }

    findClosestToDirection = (direction) => {
        const visibleCheck = this.isVisible;

        function isObjectInDirection(object, startPosition, direction) {
            const offsetPosition = { x: startPosition.x + direction.x * 10, y: startPosition.y - direction.y * 10 }

            const vectorToObject = { x: object.x - offsetPosition.x, y: object.y - offsetPosition.y };
            return vectorToObject.x * direction.x >= 0 && vectorToObject.y * direction.y <= 0;
        }

        function distance(point1, point2) {
            return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
        }

        function findNearestObject(startPosition, objects) {
            let nearestObject = null;
            let minDistance = Infinity;

            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (visibleCheck(object.selectable.element)) {
                    const dist = distance(startPosition, object.position);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearestObject = object;
                    }
                }
            }

            return nearestObject;
        }

        const data = [];

        for (let i = 0; i < this.selectableElements.length; i++) {
            const selectable = this.selectableElements[i];
            if (selectable.element == this.selected.element) continue;

            const box = selectable.element.getBoundingClientRect();
            const position = { x: box.left + box.width / 2 - direction.x * box.width * .1, y: box.top + box.height / 2 - direction.y * box.height * .1 };
            data.push({ selectable: selectable, position: position });
        }
        const selectedElementBox = this.selected.element.getBoundingClientRect();

        const offset = { x: 0, y: 0 };

        if (direction.x > 0) {
            offset.x = selectedElementBox.width;
            offset.y = selectedElementBox.height / 2;
        } else if (direction.x < 0) {
            offset.x = 0;
            offset.y = selectedElementBox.height / 2;
        } else if (direction.y > 0) {
            offset.x = selectedElementBox.width / 2 - 1;
            offset.y = 0;
        } else if (direction.y < 0) {
            offset.x = selectedElementBox.width / 2 - 1;
            offset.y = selectedElementBox.height;
        }

        const selectedPosition = { x: selectedElementBox.left + offset.x, y: selectedElementBox.top + offset.y };

        const directionedElements = [];

        for (let i = 0; i < data.length; i++) {
            const unit = data[i];
            if (isObjectInDirection(unit.position, selectedPosition, direction)) {
                directionedElements.push(unit);
            }
        }

        const nearest = findNearestObject(selectedPosition, directionedElements);
        if (nearest != null) {
            this.select(nearest.selectable);
        }
    }

    handleKey = (key) => {
        let direction = { x: 0, y: 0 };

        this.tryInvokeGlobalHandle(key);

        this.keyWasTriggered.invoke();

        switch (key) {
            case "ArrowLeft":
                if (this.ignoredAxis.includes('ArrowLeft')) return;
                direction = { x: -1, y: 0 };
                if (this.selected != null) {
                    const result = this.selected.onLeft?.();
                    if (result != null && result.preventDefault) return;
                }
                break;
            case "ArrowRight":
                if (this.ignoredAxis.includes('ArrowRight')) return;
                direction = { x: 1, y: 0 };
                if (this.selected != null) {
                    const result = this.selected.onRight?.();
                    if (result != null && result.preventDefault) return;
                }
                break;
            case "ArrowUp":
                if (this.ignoredAxis.includes('ArrowUp')) return;
                direction = { x: 0, y: 1 };
                if (this.selected != null) {
                    const result = this.selected.onUp?.();
                    if (result != null && result.preventDefault) return;
                }
                break;
            case "ArrowDown":
                if (this.ignoredAxis.includes('ArrowDown')) return;
                direction = { x: 0, y: -1 };
                if (this.selected != null) {
                    const result = this.selected.onDown?.();
                    if (result != null && result.preventDefault) return;
                }
                break;
            case "Enter":
                if (this.selected != null) {
                    this.selected.element?.click();
                    this.selected?.onSubmit?.();
                }
                break;
            case "Escape":
                if (this.selected != null) {
                    this.selected.onBack?.();
                }
                break;
        }

        if (direction.x == 0 && direction.y == 0 || this.selected == null) return;

        this.findClosestToDirection(direction);
    }

    handleKeyDown = (event) => {
        this.handleKey(event.key)
    }
}