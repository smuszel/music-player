declare const cy = typeof import('cypress');
declare module '*.mp3' {
    const path: string;
    export = path;
}

declare type State = {
    currentFile: Blob | File;
    playing: boolean;
    analyzer: AnalyserNode;
    audioContext: AudioContext;
    mediaSource: MediaElementAudioSourceNode;
    opacity: number;
    byteFrequency: Uint8Array;
    canvasContext: CanvasRenderingContext2D;
};

declare type T4<T> = [T, T, T, T];
