export async function textToAudio(audioContext: AudioContext, text: string): Promise<AudioBuffer> {
    const freq = 44100;
    const seconds_per_char = 0.125;
    const samples_per_char = freq * seconds_per_char;
    const samples_total = samples_per_char * text.length;
    const array = new Float32Array(samples_total);
    const omega = 2 * Math.PI / freq * 4;
    const volume = 1;
    for (let i = 0; i < text.length; i++) {
        const prev = i > 0 ? text.charCodeAt(i - 1) : null;
        const c = text.charCodeAt(i);
        for (let j = 0; j < samples_per_char; j++) {
            const t = i * samples_per_char + j;
            if(c != 10)
                array[t] = Math.sin(omega * j * c) / 2 * volume;
            if(prev !== null && prev != 10)
                array[t] += Math.sin(omega * j * prev) / 4 * volume * Math.cos(Math.PI / 2 * j / samples_per_char);
        }
    }
    const buffer = audioContext.createBuffer(1, array.length, freq);
    buffer.copyToChannel(array, 0);
    return buffer;
}
