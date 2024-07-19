import { getElements } from "./helpers.js";
import { log } from "./logger.js";
import { load, save } from "./save_system/SaveSystem.js";
import { SoundIDs } from "./statics/staticValues.js";

class AudioManager {
    constructor(musicUrl, soundUrl) {
        this.musicUrl = musicUrl;
        this.soundUrl = soundUrl;

        this.musicEnabled = load('music', true);
        this.soundEnabled = load('sound', true);

        this.isMuted = false;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.buffers = [];
        this.audioSourcePool = [];

        this.musicSource = null;
        this.musicStartTime = 0;
        this.musicPauseTime = 0;

        this.isFouced = true;
        this.lastPausePriority = 0;

        this.initialize();
    }

    async initialize() {
        log(`AudioManager INITIALIZATION...`, "audioManager");
        await this.loadAudio(this.musicUrl, 'music');
        await this.loadAudio(this.soundUrl, SoundIDs.ButtonClick);

        if (this.musicEnabled) {
            log(`Try play MUSIC on start`, "audioManager");
            this.playMusic();
        }

        this.clickables = getElements(document, { tags: ['button', 'a', 'img'] });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.isFouced = false;
                this.pause();
            } else {
                this.isFouced = true;
                this.unpause();
            }
        });

        const listener = () => {
            this.playMusic();
            document.removeEventListener('click', listener);
        }

        document.addEventListener('click', listener);
    }

    getBuffer(id) {
        for (let i = 0; i < this.buffers.length; i++) {
            const element = this.buffers[i];
            if (element.id == id) return element.buffer;
        }

        return null;
    }

    async loadAudio(url, id) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        let bufferStruct = this.getBuffer(id);
        if (bufferStruct == null) {
            const newBufferStruct = {
                id: id,
                buffer: audioBuffer
            }
            this.buffers.push(newBufferStruct);
        } else {
            bufferStruct.buffer = audioBuffer;
        }
    }

    setMusicState(isMusicEnabled) {
        this.musicEnabled = isMusicEnabled;
        if (!this.musicEnabled && this.musicSource) {
            log(`Try set MUSIC state to FALSE`, "audioManager");
            this.pauseMusic();
        } else if (this.musicEnabled && !this.musicSource) {
            log(`Try set MUSIC state to TRUE`, "audioManager");
            this.playMusic();
        }

        save('music', this.musicEnabled);
    }

    setSoundState(isSoundEnabled) {
        this.soundEnabled = isSoundEnabled;

        save('sound', this.soundEnabled);
    }

    playMusic() {
        this.pauseMusic();

        const buffer = this.getBuffer('music');

        if (this.musicEnabled && buffer) {
            this.musicSource = this.audioContext.createBufferSource();
            this.musicSource.buffer = buffer;
            this.musicSource.loop = true;
            this.musicSource.connect(this.audioContext.destination);

            const offset = this.musicPauseTime % buffer.duration;
            this.musicStartTime = this.audioContext.currentTime - offset;
            this.musicSource.start(0, offset);

            log(`Play MUSIC`, "audioManager");
        }
    }

    pause(priority = 0) {
        if (priority < this.lastPausePriority) return;

        this.lastPausePriority = priority;
        this.pauseMusic();
        this.pauseSound();
    }

    unpause(priority = 0) {
        if (priority < this.lastPausePriority) return;
        this.lastPausePriority = 0;

        if (!this.isFouced) return;


        this.playMusic();
        this.unpauseSound();
    }

    pauseMusic() {
        if (this.musicSource) {

            this.musicPauseTime = this.audioContext.currentTime - this.musicStartTime;
            this.musicSource.stop();
            this.musicSource = null;

            log(`Pause MUSIC`, "audioManager");
        }
    }

    playSound(id = SoundIDs.ButtonClick) {
        if (this.isMuted) return;

        const buffer = this.getBuffer(id);

        if (this.soundEnabled && buffer) {

            const soundSource = this.getSource();
            soundSource.buffer = buffer;
            soundSource.isPlaying = true;
            soundSource.start(0);

            log(`Play SOUND ${id}`, "audioManager");
        }
    }

    pauseSound() {
        this.isMuted = true;
        this.audioSourcePool.forEach(source => {
            if (source.isPlaying) {
                source.stop();
                source.isPlaying = false;
            }
        });
    }

    unpauseSound() {
        this.isMuted = false;
    }

    getSource() {
        const newSource = this.audioContext.createBufferSource();
        newSource.connect(this.audioContext.destination);

        newSource.isPlaying = false;

        newSource.onended = () => {
            this.audioSourcePool = this.audioSourcePool.filter(src => src !== newSource);
        };

        this.audioSourcePool.push(newSource);
        log(this.audioSourcePool.length);

        return newSource;
    }

    addClickableToPull = function (clickable) {
        this.clickables.push(clickable);
        clickable.addEventListener('click', () => {
            this.playSound();
        })
    }

    switchSoundState = function () {
        this.setSoundState(!this.soundEnabled);
    }

    switchMusicState = function () {
        this.setMusicState(!this.musicEnabled);
    }
}

export { AudioManager }