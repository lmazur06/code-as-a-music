import { textToArray, u16leTou8a, u32leTou8a } from "./util";

export async function textToAudio(audioContext: AudioContext, text: string): Promise<AudioBuffer> {
    const freq = 44100;
    const seconds_per_char = 0.3;
    const samples_per_char = freq * seconds_per_char;
    const samples_total = samples_per_char * text.length;
    const array = new Float32Array(samples_total);
    const omega = 2 * Math.PI / freq * 4;
    const volume = 1;
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        for (let j = 0; j < samples_per_char; j++) {
            const t = i * samples_per_char + j;
            if(c != 10)
                array[t] += Math.sin(omega * j * c) / 2 * volume;
        }
    }
    const buffer = audioContext.createBuffer(1, array.length, freq);
    buffer.copyToChannel(array, 0);
    return buffer;
}

export async function audioBufferToWavBlob(audioContext: AudioContext, buffer: AudioBuffer): Promise<Blob> {
    const data = new Int16Array(buffer.getChannelData(0).map(v => Math.round(v * 0x7fff)));
    const dsize = data.length * 2;
    const size = dsize + 44;
    const header = new Uint8Array([
        ...textToArray('RIFF'),
        ...u32leTou8a(size),
        ...textToArray('WAVE'),
        ...textToArray('fmt '),
        ...u32leTou8a(16),
        ...u16leTou8a(1),
        ...u16leTou8a(1),
        ...u32leTou8a(44100),
        ...u32leTou8a(44100 * 16 * 1),
        ...u16leTou8a(2 * 16 / 8),
        ...u16leTou8a(16),
        ...textToArray('data'),
        ...u32leTou8a(dsize)
    ]);
    return new Blob([header, data], { type: 'audio/wav' });
}
