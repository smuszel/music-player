import 'regenerator-runtime/runtime';
import pianoMusic from '../cypress/fixtures/piano.mp3';

const dom = {
    upload: document.querySelector('input'),
    play: document.querySelector<HTMLButtonElement>('.play'),
    pause: document.querySelector<HTMLButtonElement>('.pause'),
    randomMusic: document.querySelector<HTMLButtonElement>('.random-music'),
    canvas: document.querySelector('canvas'),
    audio: document.createElement('audio'),
};

const canvasContext = dom.canvas.getContext('2d');
const canvasWidth = () => dom.canvas.width;
const canvasHeight = () => dom.canvas.height;

const state: State = {
    currentFile: null,
    playing: false,
    analyzer: null,
    progress: 0,
    audioContext: null,
    mediaSource: null,
};

const render = () => {
    if (state.playing && state.currentFile) {
        dom.play.disabled = true;
        dom.pause.disabled = false;
        dom.canvas.classList.add('animated');
        animateMusicFrame();
    } else if (state.currentFile) {
        dom.play.disabled = false;
        dom.pause.disabled = true;
        dom.canvas.classList.add('loaded');
        dom.canvas.classList.remove('animated');
    } else {
        dom.play.disabled = true;
        dom.pause.disabled = true;
        dom.canvas.classList.add('loaded');
        dom.canvas.classList.remove('animated');
    }
};

const startPlaying = () => {
    !dom.audio.paused && dom.audio.load();
    const audioContext = state.audioContext || new AudioContext();
    const analyzer = state.analyzer || audioContext.createAnalyser();
    const mediaSource =
        state.mediaSource || audioContext.createMediaElementSource(dom.audio);
    mediaSource.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256;

    state.analyzer = analyzer;
    state.audioContext = audioContext;
    state.mediaSource = mediaSource;
    state.playing = true;
    dom.audio.play();
};

const stopPlaying = () => {
    dom.audio.pause();
    state.playing = false;
};

const animateMusicFrame = () => {
    resetCanvas();
    const bitCount = state.analyzer.frequencyBinCount;
    const barWidth = (canvasWidth() / bitCount) * 2.5;
    const byteFrequency = new Uint8Array(bitCount);
    state.analyzer.getByteFrequencyData(byteFrequency);
    let barPosition = 0;
    byteFrequency.forEach((barHeight, ix) => {
        const r = barHeight + 5 * (ix / bitCount);
        const g = 200 * (ix / bitCount);
        const b = 80;

        canvasContext.fillStyle = `rgb(${[r, g, b].join(',')})`;
        canvasContext.fillRect(
            barPosition,
            canvasHeight() - barHeight / 3,
            barWidth,
            barHeight,
        );

        barPosition += barWidth + 1;
    });
};

const resetCanvas = () => {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasWidth(), canvasHeight());
};

window.addEventListener('load', () => {
    dom.play.addEventListener('click', startPlaying);
    dom.pause.addEventListener('click', stopPlaying);

    dom.randomMusic.addEventListener('click', async () => {
        stopPlaying();
        resetCanvas();
        const blob = await fetch(pianoMusic).then(r => r.blob());
        state.currentFile = blob;
        dom.audio.src = URL.createObjectURL(state.currentFile);
    });

    dom.upload.addEventListener('change', () => {
        state.currentFile = dom.upload.files[0];
        resetCanvas();
        dom.audio.src = URL.createObjectURL(state.currentFile);
    });

    resetCanvas();
    setInterval(render, 20);
});
