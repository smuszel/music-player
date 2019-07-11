declare const cy = typeof import('cypress');
declare module '*.mp3' {
    const path: string;
    export = path;
}

declare type State = {
    currentFile: Blob | File;
    playing: boolean;
    analyzer: AnalyserNode;
    progress: number;
    audioContext: AudioContext;
    mediaSource: MediaElementAudioSourceNode;
};
