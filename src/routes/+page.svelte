<script lang="ts">
	import { htmlEncode } from '$lib/util';
	import { audioBufferToWavBlob, textToAudio } from '$lib/audio';
	let fileInput: HTMLInputElement;
	let file: File;
	let fileContent: string;
	let codePreview: HTMLElement;
	let track: AudioBuffer | null;
	let audioContext: AudioContext;
	let source: AudioBufferSourceNode;
	async function createAudioContext() {
		audioContext = new AudioContext();
	}
	async function readCode() {
		track = null;
		source?.stop();
		file = fileInput.files!![0];
		const reader = new FileReader();
		reader.addEventListener('load', (e) => {
			fileContent = e.target!!.result as string;
			codePreview.innerHTML = htmlEncode(fileContent);
		});
		if (file) reader.readAsText(file);
		else codePreview.innerHTML = '';
	}
	async function generate() {
		source?.stop();
		track = null;
		track = await textToAudio(audioContext, fileContent);
	}
	async function download() {
		const blob = await audioBufferToWavBlob(audioContext, track!!);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = file.name + '.wav';
		a.click();
	}
	async function play() {
		source?.stop();
		source = audioContext.createBufferSource();
		source.buffer = track!!;
		source.connect(audioContext.destination);
		source.start();
	}
</script>

<svelte:head>
	<title>Code as a Music</title>
</svelte:head>

<div class="h-viewport flex-col">
	<h1>Code as a Music</h1>
	<div class="flex-row">
		{#if !audioContext}
			<button on:click={createAudioContext}>Create AudioContext</button>
		{:else}
			<input
				type="file"
				bind:this={fileInput}
				on:change={readCode}
				accept={/* ".json, .xml, .yml, .yaml, .md" */ ''}
			/>
			<button disabled={!file} on:click={generate}>Generate</button>
			<button disabled={!file || !track} on:click={download}>Download</button>
			<button disabled={!file || !track} on:click={play}>Play</button>
		{/if}
	</div>
	<div id="code-preview" bind:this={codePreview} />
</div>

<style>
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
