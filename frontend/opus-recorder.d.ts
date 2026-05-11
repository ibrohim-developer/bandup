declare module "opus-recorder" {
  export interface OpusRecorderConfig {
    encoderPath?: string;
    sourceNode?: MediaStreamAudioSourceNode;
    numberOfChannels?: number;
    encoderSampleRate?: number;
    encoderApplication?: number;
    encoderBitRate?: number;
    encoderComplexity?: number;
    encoderFrameSize?: number;
    streamPages?: boolean;
    bufferLength?: number;
    mediaTrackConstraints?: boolean | MediaTrackConstraints;
    monitorGain?: number;
    recordingGain?: number;
  }
  export default class Recorder {
    constructor(config?: OpusRecorderConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(flush?: boolean): Promise<void> | void;
    resume(): void;
    close(): void;
    ondataavailable: ((data: Uint8Array) => void) | null;
    onstart: (() => void) | null;
    onstop: (() => void) | null;
    onpause: (() => void) | null;
    onresume: (() => void) | null;
    static isRecordingSupported(): boolean;
    static version: string;
  }
}
