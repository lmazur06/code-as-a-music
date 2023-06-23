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
