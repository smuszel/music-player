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

const state: State = {
    currentFile: null,
    playing: false,
    analyzer: null,
    opacity: 0,
    audioContext: null,
    mediaSource: null,
    byteFrequency: new Uint8Array(),
    canvasContext: dom.canvas.getContext('2d'),
};

const renderMain = () => {
    if (state.playing && state.currentFile) {
        dom.play.disabled = true;
        dom.pause.disabled = false;
        dom.canvas.classList.add('playing');
        state.opacity = 0.8;
    } else if (state.currentFile) {
        dom.play.disabled = false;
        dom.pause.disabled = true;
        dom.canvas.classList.add('loaded');
        dom.canvas.classList.remove('playing');
        state.opacity = 0.5;
    } else {
        dom.play.disabled = true;
        dom.pause.disabled = true;
        dom.canvas.classList.remove('loaded');
        dom.canvas.classList.remove('playing');
        state.opacity = 0.2;
    }

    renderFrame();
    requestAnimationFrame(renderMain);
};

const renderFrame = () => {
    const w = dom.canvas.width;
    const h = dom.canvas.height;

    const reset = () => {
        state.canvasContext.fillStyle = '#fff';
        state.canvasContext.fillRect(0, 0, w, h);
    };

    const drawGradient = () => {
        const gradientPos: T4<number> = [(1 / 3) * w, h, (2 / 3) * h, 0];
        const gradient = state.canvasContext.createLinearGradient(
            ...gradientPos,
        );

        gradient.addColorStop(0.0, `rgba(41, 10, 89, ${state.opacity})`);
        gradient.addColorStop(1.0, `rgba(255, 124, 0, ${state.opacity})`);

        state.canvasContext.fillStyle = gradient;
        state.canvasContext.fillRect(0, 0, w, h);
    };

    const drawMusicBars = () => {
        const bitCount = state.analyzer.frequencyBinCount;
        const barWidth = (w / bitCount) * 2.5;
        let barPosition = 0;

        // If track is paused the analyzer does not pause populating the
        // byte frequencies. We have to manually stop it :/
        if (state.playing) {
            state.analyzer.getByteFrequencyData(state.byteFrequency);
        }

        state.byteFrequency.forEach((barHeight, ix) => {
            const r = barHeight + 5 * (ix / bitCount);
            const g = 200 * (ix / bitCount);
            const b = 80;

            state.canvasContext.fillStyle = `rgb(${[r, g, b].join(',')})`;
            const rect: T4<number> = [
                barPosition,
                h - barHeight / 3,
                barWidth,
                barHeight,
            ];

            state.canvasContext.fillRect(...rect);

            barPosition += barWidth + 1;
        });
    };

    reset();
    drawGradient();

    if (state.analyzer) {
        drawMusicBars();
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

    state.byteFrequency = new Uint8Array(analyzer.frequencyBinCount);
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

const resetBars = () => (state.byteFrequency = new Uint8Array());

const setLoadedTrack = (obj: File | Blob) => {
    state.currentFile = obj;
    dom.audio.src = URL.createObjectURL(state.currentFile);
};

window.addEventListener('load', () => {
    dom.play.addEventListener('click', startPlaying);
    dom.pause.addEventListener('click', stopPlaying);

    dom.randomMusic.addEventListener('click', async () => {
        stopPlaying();
        const blob = await fetch(pianoMusic).then(r => r.blob());
        setLoadedTrack(blob);
        resetBars();
    });

    dom.upload.addEventListener('change', () => {
        stopPlaying();
        setLoadedTrack(dom.upload.files[0]);
        resetBars();
    });

    renderMain();
});
