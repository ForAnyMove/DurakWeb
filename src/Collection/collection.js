import { backSkinDatabase, backgroundDatabase, skinDatabase } from "../scripts/data/card_skin_database.js"
import { trophyDatabase } from "../scripts/data/trophy_database.js";
import { createButton, createElement, createImage, createTextP, createTextSpan } from "../scripts/helpers.js";
import { Statefull } from "../scripts/statics/enums.js"
import { initialLocale } from '../localization/translator.js';
import { ScreenParameters } from "../scripts/navigation/navigation.js";

const checkIconPath = 'Sprites/Icons/Icon_Check.png'
const lockIconPath = 'Sprites/Icons/Icon_Lock.png'

const root = document.getElementById('collection-screen');
const screenParameters = new ScreenParameters();

const skinParent = root.querySelector('#pick-area-1');
const skinBackParent = root.querySelector('#pick-area-2');
const backgroundParent = root.querySelector('#pick-area-3');
const trophyParent = root.querySelector('#pick-area-4');

const tabScreens = [skinParent, skinBackParent, backgroundParent, trophyParent];

screenParameters.defaultSelectedElement = { element: root.querySelector('.main-screen-switch-btn') };
screenParameters.selectableElements.push(screenParameters.defaultSelectedElement);

function createCardSkins() {
  for (let i = 0; i < skinDatabase.skinList.length; i++) {
    const data = skinDatabase.skinList[i];
    skinParent.appendChild(createSkinInstance(data));
  }
}

function createCardBacks() {
  for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
    const data = backSkinDatabase.skinList[i];
    skinBackParent.appendChild(createSkinBackInstance(data));
  }
}

function createBackgrounds() {
  for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
    const data = backgroundDatabase.skinList[i];
    backgroundParent.appendChild(createBackgroundInstance(data));
  }
}

function createTrophies() {
  for (let i = 0; i < trophyDatabase.list.length; i++) {
    const data = trophyDatabase.list[i];
    trophyParent.appendChild(createTrophyInstance(data));
  }
}

function createBackgroundInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.hasUsedContent(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['background-card'], {
    backgroundImage: `url(${data.itemPreviewPath})`
  });

  if (state == Statefull.Locked) {
    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    const textContainer = createElement('div', null, {
      height: '40%',
      paddingLeft: '10%',
      paddingRight: '10%',
    }, requirementTextContainer);
    const unlockDescription = createTextP(['mask-title'], null, textContainer, '');
    unlockDescription.lang = data.unlockDescription;
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    audioManager.addClickableToPull(useButton);

    screenParameters.selectableElements.push({
      element: useButton, onSubmit: () => {
        input.select(input.selectableElements[3]);
      }
    });
    useButton.id = 'play-btn';
    const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    useText.lang = 'use'
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }
    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener(() => {
      if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createSkinInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.hasUsedContent(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['skin-card']);
  const preview = createImage(['card-skin'], null, plane, data.previewPath);

  if (state == Statefull.Locked) {
    preview.classList.add('tonned');

    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    const textContainer = createElement('div', null, {
      height: '40%'
    }, requirementTextContainer);

    const unlockDescription = createTextP(['mask-title'], null, textContainer, '');
    unlockDescription.lang = data.unlockDescription;
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    audioManager.addClickableToPull(useButton);

    screenParameters.selectableElements.push({
      element: useButton, onSubmit: () => {
        input.select(input.selectableElements[1]);
      }
    });

    useButton.id = 'play-btn';
    const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    useText.lang = 'use';
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }
    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener(() => {
      if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createSkinBackInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.hasUsedContent(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['skin-card-back'], {
    backgroundImage: `url(${data.previewPath})`,
    backgroundSize: '100% 100%'
  });

  if (state == Statefull.Locked) {
    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    const textContainer = createElement('div', null, {
      height: '40%'
    }, requirementTextContainer);
    const unlockDescription = createTextP(['mask-title'], null, textContainer, '');
    unlockDescription.lang = data.unlockDescription;
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    audioManager.addClickableToPull(useButton);
    useButton.id = 'play-btn';
    const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    useText.lang = 'use';
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }

    screenParameters.selectableElements.push({
      element: useButton, onSubmit: () => {
        input.select(input.selectableElements[2]);
      }
    });

    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener(() => {
      if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createTrophyInstance(data) {
  const hasTrophy = user.hasItems(data.id);
  const plane = createElement('div', ['trophy-card']);
  createImage(['trophy-skin', (hasTrophy ? '' : 'black')], null, plane, data.previewPath);

  if (!hasTrophy) {
    createElement('div', ['space'], null, plane);
    const requirementTextContainer = createElement('div', null, null, plane);
    const unlockDescription = createTextP(['mask-title'], { height: '100%' }, requirementTextContainer, '');
    unlockDescription.lang = data.unlockDescription;
  }

  return plane;
}

createCardSkins();
createCardBacks();
createBackgrounds();
createTrophies();

setupTabSwitch();

languageChangeEvent.invoke(initialLocale);

export { screenParameters }