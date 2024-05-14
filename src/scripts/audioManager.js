import { getElements } from "./helpers.js";
import { load, save } from "./save_system/SaveSystem.js";

class AudioManager {
    constructor() {
        this.soundSwitchButton = document.getElementById('sound-switch');
        this.musicSwitchButton = document.getElementById('music-switch');

        this.musicAudioElement = document.getElementById('backgroundMusic');
        this.buttonAudionElement = document.getElementById('buttonClick');

        this.isMusicEnabled = load('music', true);
        this.isSoundEnabled = load('sound', true);

        if (this.isMusicEnabled) {
            document.addEventListener("click", () => {
                this.musicAudioElement.play();
            });
        } else {
            this.musicAudioElement.muted = true;
        }

        this.clickables = getElements(document, { tags: ['button', 'a', 'img'] });
        for (let i = 0; i < this.clickables.length; i++) {
            const element = this.clickables[i];
            if (element.click == null) continue;
            element.addEventListener('click', () => {
                this.buttonAudionElement.play();
            })
        }

        if (this.soundSwitchButton) {
            this.soundSwitchButton.addEventListener('click', () => {
                this.switchSoundState();
            });
        }

        if (this.musicSwitchButton) {
            this.musicSwitchButton.addEventListener('click', () => {
                this.switchMusicState();
            });
        }

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                console.log('mute');
                this.musicAudioElement.muted = true;
                this.buttonAudionElement.muted = true;
            } else {
                this.musicAudioElement.muted = !this.isMusicEnabled;
                this.buttonAudionElement.muted = !this.isSoundEnabled;
            }
        });
    }

    pause = function () {
        this.musicAudioElement.muted = true;
        this.buttonAudionElement.muted = true;
    }

    unpause = function () {
        this.musicAudioElement.muted = !this.isMusicEnabled;
        this.buttonAudionElement.muted = !this.isSoundEnabled;
    }

    addClickableToPull = function (clickable) {
        this.clickables.push(clickable);
        clickable.addEventListener('click', () => {
            this.buttonAudionElement.play();
        })
    }

    setSoundState = function (isEnabled) {
        this.isMusicEnabled = isEnabled;
        this.buttonAudionElement.muted = !isEnabled;

        save('sound', this.isMusicEnabled);
    }

    setMusicState = function (isEnabled) {
        this.isSoundEnabled = isEnabled;
        if (isEnabled) {
            this.musicAudioElement.play();
        }
        this.musicAudioElement.muted = !isEnabled;

        save('sound', this.isSoundEnabled);
    }

    switchSoundState = function () {
        this.isSoundEnabled = !this.isSoundEnabled;

        if (this.isSoundEnabled) {
            this.buttonAudionElement.muted = false;
        } else {
            this.buttonAudionElement.muted = true;
        }
        save('sound', this.isSoundEnabled);
    }

    switchMusicState = function () {
        this.isMusicEnabled = !this.isMusicEnabled;
        save('music', this.isMusicEnabled);

        if (this.isMusicEnabled) {
            this.musicAudioElement.play();
            this.musicAudioElement.muted = false;
        } else {
            this.musicAudioElement.muted = true;
        }
    }
}

export { AudioManager }