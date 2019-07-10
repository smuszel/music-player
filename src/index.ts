const dom = {
    upload: document.querySelector('input'),
    play: document.querySelector<HTMLButtonElement>('.play'),
    pause: document.querySelector<HTMLButtonElement>('.pause'),
    randomMusic: document.querySelector<HTMLButtonElement>('.random-music'),
    canvas: document.querySelector('canvas'),
    audio: document.createElement('audio'),
};
const canvasContext = dom.canvas.getContext('2d');
const canvasWidth = dom.canvas.width;
const canvasHeight = dom.canvas.height;
import pianoMusic from '../cypress/fixtures/piano.mp3';

let currentFile: Blob = null;
let playing = false;
let progress = 0;

const renderState = () => {
    if (playing && currentFile) {
        dom.play.disabled = true;
        dom.pause.disabled = false;
        dom.canvas.classList.add('animated');
    } else if (currentFile) {
        dom.play.disabled = false;
        dom.pause.disabled = true;
        dom.canvas.classList.remove('animated');
    } else {
        dom.play.disabled = true;
        dom.pause.disabled = true;
        dom.canvas.classList.remove('animated');
    }
};

const renderInitial = () => {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
};

dom.play.addEventListener('click', () => {
    playing = true;
    renderState();
});

dom.pause.addEventListener('click', () => {
    playing = false;
    renderState();
});

dom.randomMusic.addEventListener('click', () => {
    playing = false;
    fetch(pianoMusic)
        .then(r => {
            return r.blob();
        })
        .then(b => {
            currentFile = b;
            dom.audio.src = URL.createObjectURL(b);
            play();
        });
    renderState();
});

dom.upload.addEventListener('change', ev => {
    dom.audio.src = URL.createObjectURL(dom.upload.files[0]);
    play();
});

const play = () => {
    dom.audio.load();
    dom.audio.play();

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const mediaSource = audioContext.createMediaElementSource(dom.audio);
    mediaSource.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256;
    const bitCount = analyzer.frequencyBinCount;
    const byteFrequency = new Uint8Array(bitCount);
    const barWidth = (canvasWidth / bitCount) * 2.5;
    let x = 0;

    const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        x = 0;
        canvasContext.fillStyle = '#000';
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        analyzer.getByteFrequencyData(byteFrequency);

        byteFrequency.forEach((barHeight, ix) => {
            const r = barHeight + 5 * (ix / bitCount);
            const g = 200 * (ix / bitCount);
            const b = 80;

            canvasContext.fillStyle = `rgb(${[r, g, b].join(',')})`;
            canvasContext.fillRect(x, canvasHeight - barHeight / 3, barWidth, barHeight);

            x += barWidth + 1;
        });
    };

    dom.audio.play();
    renderFrame();
};

renderInitial();
