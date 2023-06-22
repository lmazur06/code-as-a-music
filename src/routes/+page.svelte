<svelte:head>
	<title>Code as a Music</title>
</svelte:head>

<script lang="ts">
	import { htmlEncode } from '$lib/util';
    import { textToAudio } from '$lib/audio';
	let fileInput: HTMLInputElement;
	let file: File;
	let fileContent: string;
	let codePreview: HTMLElement;
	async function readCode() {
		file = fileInput.files!![0];
		const reader = new FileReader();
		reader.addEventListener('load', (e) => {
			fileContent = e.target!!.result as string;
			codePreview.innerHTML = htmlEncode(fileContent);
		});
		if (file) reader.readAsText(file);
		else codePreview.innerHTML = '';
	}
    async function download() {
        const audioContext = new AudioContext();
        const track: AudioBuffer = await textToAudio(audioContext, fileContent);
        const data = new Int16Array(track.getChannelData(0).map(v => Math.round(v * 0x7fff)));
        const header = new Uint8Array(44);
        const dsize = data.length * 2;
        const size = dsize + 44;
        header.set("RIFF".split('').map(c => c.charCodeAt(0)), 0);
        header.set([size & 0xff, (size >> 8) & 0xff, (size >> 16) & 0xff, (size >> 24) & 0xff], 4);
        header.set("WAVE".split('').map(c => c.charCodeAt(0)), 8);
        header.set("fmt ".split('').map(c => c.charCodeAt(0)), 12);
        header.set([0x10, 0x00, 0x00, 0x00], 16); // 16
        header.set([0x01, 0x00], 20); // 1
        header.set([0x01, 0x00], 22); // 1
        header.set([0x44, 0xac, 0x00, 0x00], 24); // 48100
        header.set([0x40, 0xc4, 0x0a, 0x00], 28); // 48100 * 16 * 1
        header.set([0x04, 0x00, 0x00, 0x00], 32); // 2 * 16 / 8
        header.set([0x10, 0x00], 34); // 16
        header.set("data".split('').map(c => c.charCodeAt(0)), 36);
        header.set([dsize & 0xff, (dsize >> 8) & 0xff, (dsize >> 16) & 0xff, (dsize >> 24) & 0xff], 40);
        const blob = new Blob([header, data], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name + '.wav';
        a.click();
    }
    async function play() {
        const audioContext = new AudioContext();
        const track = await textToAudio(audioContext, fileContent);
        const source = audioContext.createBufferSource();
        source.buffer = track;
        source.connect(audioContext.destination);
        source.start();
    }
</script>

<div class="root flex-col">
	<h1>Code as a Music</h1>
	<div class="flex-row">
		<input
			type="file"
			bind:this={fileInput}
			on:change={readCode}
			accept={/* ".json, .xml, .yml, .yaml, .md" */ ''}
		/>
		<button disabled={!file} on:click={download}>Download</button>
		<button disabled={!file} on:click={play}>Play</button>
	</div>
	<div id="code-preview" bind:this={codePreview} />
</div>

<style>
	:root {
		font-family: sans-serif;
		background-color: #333;
		color: #ddd;
	}
	h1 {
		text-align: center;
	}

	button,
	input {
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		cursor: pointer;
		background-color: #444;
		border: #ddd solid 1px;
		color: #ddd;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	button:not(:disabled):hover,
	input:hover {
		background-color: #555;
	}
	::file-selector-button {
		display: none;
	}

	.root {
		height: 100vh;
	}

	#code-preview {
		font-family: monospace;
		background-color: #444;
		border: #ddd solid 1px;
		padding: 10px;
		margin: 10px;
		margin-bottom: 20px;
		overflow: auto;
		flex-grow: 1;
		color: #ddd;
		width: calc(100% - 40px);
	}

	#code-preview::selection {
		background-color: #dd2;
		color: #111;
	}
	#code-preview:empty {
		display: none;
	}
</style>
