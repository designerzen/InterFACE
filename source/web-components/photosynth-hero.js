/**
 * PhotoSynth Hero Web Component
 * Animated SVG hero with text reveal animations
 * Renders as light DOM for full CSS cascade compatibility
 */
const CSS = `
photosynth-hero {
	color: var(--color, currentColor);
	--mixer: black;
	--bg: color-mix(currentColor, var(--mixer) 50%);
	--stroke: color-mix(currentColor, var(--mixer) 50%);
	--duration: 1s;
	--overlap: 0.25;
	--time-quick: 80ms;

	@media (prefers-color-scheme: dark) {
		--mixer: white;
	}

	a {
		text-decoration: none;
	}

	figure {
		display: grid;
		place-items: center;
		max-height: 100vh;
		max-height: 100dvh;
		max-width:100vw;
		width:100%;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		position: relative;
		fill: currentColor;

		& > * {
			grid-area: 1 / 1;
			height: 100%;
			color: inherit;
		}
	}

	svg {
		width: 100%;
		height: 100%;

		& text {
			pointer-events: none;
		}

		& textPath {
			transition: opacity 1s linear;
		}
	}

	canvas {
		z-index: -2;
	}

	& .wallpaper {
		--duration: 1s;
		--overlap: 0.87;
		background-color: var(--bg);
		max-width: none;
		width: auto;
		height: 100vh;
		max-height: 100vh;
		object-fit: fill;
		transform: translateX(-50%);
		position: absolute;
		left: 50%;
		z-index: 0;
		top: 0;
	}

	& .wallpaper-path {
		fill: currentColor;
		stroke: var(--stroke);
		stroke-width: 1px;
		--delay: calc(-1 * var(--i, 0) * var(--overlap, 1) * var(--duration, 1s));
		animation: 
			Shouting var(--duration, 1s) ease-in-out var(--delay, 0s) infinite both alternate-reverse,
			RainbowColor calc(3 * var(--duration, 1s)) linear var(--delay, 0s) infinite both;
	}

	& .bg {
		fill: currentColor;
		opacity: 0.3;
        filter: invert(1) brightness(2.5);
	}

	& .details {
		max-height: 100vh;
		z-index :1;
	}

	& .content {
		padding: 3%;
	}

	& .texts {
		filter: url(#filter-threshold) blur(0.6px);

		& text {
			--fraction: 2;
			--rate: 8;
			--y: 3%;
			--blur: min(1px * var(--rate) / var(--fraction) - var(--rate), 100px);
			--delay: calc(var(--i, 0) * var(--overlap, 1) * var(--duration, 1s));
			font-family: 'Oxanium', 'ReadexPro', 'Proxima Nova', metropolis, sans-serif;
			font-weight: 700;
			fill: currentColor;
		}
	}

	& .overlay {
		z-index: 3;
		position: relative;
		width: 100%;
		overflow:visible;
	}

	& .mouth {
		transform-origin: 50%;
	}

	& .eye {
		pointer-events: none;
	}

	& .instructions {
		--y: 11px;
		position: absolute;
		bottom: 9%;
		height: fit-content;
		border-radius: 11px;
		padding: 20px;
		margin: 0;
		animation: 
			Fade 1s linear 3.5s 1 both,
			Translate 0.4s ease-out 3.5s 1 both;
		font-family: inherit;
	}
}

[hidden] {
	display: none !important;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

[data-key="A"], [data-key="A#"] {
	--col-accent: var(--col-orange, orange);
}
[data-key="B"] {
	--col-accent: var(--col-red, red);
}
[data-key="C"], [data-key="C#"] {
	--col-accent: var(--col-plum, purple);
}
[data-key="D"], [data-key="D#"] {
	--col-accent: var(--col-pink, hotpink);
}
[data-key="E"] {
	--col-accent: var(--col-purple, purple);
}
[data-key="F"], [data-key="F#"] {
	--col-accent: var(--col-blue,blue);
}
[data-key="G"], [data-key="G#"] {
	--col-accent: var(--col-green, green);
}

.overlaid-notes {
	--duration: 9000ms;
	--offset-variatons: 1;

	--path-simple: path("M20,20 C20,100 200,0 200,100");
	--path-wave: path("M0,0 C100,0 200,100 300,50 C400,0 500,100 600,50");
	--path-double-wave: path("M0,50 C100,0 200,100 300,50 C400,0 500,100 600,50 C700,0 800,100 900,50");
	--path-ripple: path("M0,50 C100,0 150,100 250,50 C350,0 400,100 500,50");
	--path-float: path("M0,100 C150,50 250,150 400,100 C550,50 650,150 800,100");
	--path-gentle: path("M0,50 C200,0 300,100 500,50 C700,0 800,100 1000,50");
	--path-smooth: path("M0,0 C100,100 300,0 400,100 C500,200 700,100 800,200");
	--path-sine: path("M0,50 C50,0 150,100 200,50 C250,0 350,100 400,50");
	--path-arc: path("M0,200 C200,200 300,0 500,0 C700,0 800,200 1000,200");
	--path-swing: path("M0,0 C100,0 200,100 300,0 C400,-100 500,100 600,0");
	--path-bounce: path("M0,50 C100,100 200,0 300,50 C400,100 500,0 600,50");

	--path-wave-left: path("M0,50 C-100,50 -200,0 -300,50 C-400,50 -500,0 -600,50");
	--path-double-wave-left: path("M0,50 C-100,50 -200,0 -300,50 C-400,50 -500,0 -600,50 C-700,50 -800,0 -900,50");
	--path-ripple-left: path("M0,50 C-100,50 -150,0 -250,50 C-350,50 -400,0 -500,50");
	--path-float-left: path("M0,100 C-150,100 -250,50 -400,100 C-550,100 -650,50 -800,100");
	--path-gentle-left: path("M0,50 C-200,50 -300,0 -500,50 C-700,50 -800,0 -1000,50");
	--path-smooth-left: path("M0,100 C-100,100 -300,50 -400,100 C-500,100 -700,50 -800,100");
	--path-sine-left: path("M0,50 C-50,50 -150,0 -200,50 C-250,50 -350,0 -400,50");
	--path-arc-left: path("M0,0 C-200,0 -300,100 -500,100 C-700,100 -800,0 -1000,0");
	--path-swing-left: path("M0,50 C-100,50 -200,0 -300,50 C-400,50 -500,0 -600,50");
	--path-bounce-left: path("M0,50 C-100,0 -200,100 -300,50 C-400,0 -500,100 -600,50");

	position: sticky;
	top: 0;
	height: var(--notes-height, 100vh);
	width: 100%;
	max-width: 100vw;
	max-height: 100%;
	overflow: hidden;
	overflow: clip;
	z-index: 909;
	order: -9;
	grid-area: 1/1/-1/-1;
}

.note-animated {
	--size: 44px;
	opacity: 0;
	position: absolute;
	top: 33%;
	left: 50%;
	width: var(--size);
	height: var(--size);
	z-index: 202;
	transition: opacity var(--time-quick, 90ms) linear;
	offset-path: var(--path, var(--path-wave));

	&::before {
		color: var(--col-accent, var(--col-plum));
		font-family: 'noto-music', sans-serif;
		font-size: 440%;
		content: "𝅗𝅥";
	}

	&:nth-child(0) { offset-path: var(--path, var(--path-wave-left)); }
	&:nth-child(1) { offset-path: var(--path, var(--path-wave)); }
	&:nth-child(2) { offset-path: var(--path, var(--path-double-wave-left)); }
	&:nth-child(3) { offset-path: var(--path, var(--path-double-wave)); }
	&:nth-child(4) { offset-path: var(--path, var(--path-float-left)); }
	&:nth-child(5) { offset-path: var(--path, var(--path-float)); }
	&:nth-child(6) { offset-path: var(--path, var(--path-smooth-left)); }
	&:nth-child(7) { offset-path: var(--path, var(--path-smooth)); }
	&:nth-child(8) { offset-path: var(--path, var(--path-sine-left)); }
	&:nth-child(9) { offset-path: var(--path, var(--path-sine)); }
	&:nth-child(10) { offset-path: var(--path, var(--path-float-left)); }
	&:nth-child(11) { offset-path: var(--path, var(--path-float)); }
	&:nth-child(12) { offset-path: var(--path, var(--path-ripple-left)); }

	&.inactive {
		opacity: 0;
	}

	&.active {
		offset-rotate: auto 180deg;
		opacity: 1;
		animation:
			FadeEnd var(--duration) var(--delay, 0s) var(--offset-variatons) linear both,
			TravelAlongPathRight var(--duration) var(--delay, 0s) var(--offset-variatons) ease-out;

		&::before {
			animation: Notation var(--duration) var(--delay, 0s) var(--offset-variatons) linear;
		}
	}

	&:nth-child(odd).active {
		offset-rotate: auto;
		animation:
			FadeEnd var(--duration) var(--delay, 0s) var(--offset-variatons) linear both,
			TravelAlongPathLeft var(--duration) var(--delay, 0s) var(--offset-variatons) ease-out;

		&::before {
			animation: Notation var(--duration) var(--delay, 0s) var(--offset-variatons) linear;
		}
	}
}

@keyframes Shouting {
	0% { filter: blur(120px); }
	100% { filter: blur(50px); }
}

@keyframes Unblur {
	from { filter: blur(120px); }
}

@keyframes Fade {
	from { opacity: 0; }
}

@keyframes Translate {
	from { transform: translate(var(--x, 0), var(--y, 0)); }
}

@keyframes RainbowColor {
	0% { color: hsl(0, 96%, 51%); }
	33% { color: hsl(120, 96%, 51%); }
	66% { color: hsl(240, 96%, 51%); }
	100% { color: hsl(360, 96%, 51%); }
}

@keyframes TextColor {
	0% { color: hsl(0, 96%, 51%); }
	100% { color: hsl(360, 96%, 51%); }
}

@keyframes AppearText {
	0% {
		transform: translateY(var(--y, 0)) scale(var(--scale, 1));
		opacity: 0.2;
	}
	100% {
		transform: translateY(0) scale(var(--scale, 1));
		opacity: 1;
	}
}

@keyframes FadeEnd {
    0%{
        opacity: 0;
    }
    3%, 90% {
      opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@keyframes TravelAlongPathLeft {
    0% {
         offset-distance: 0%;
    }
    100% {
        offset-distance: 100%;
    }
}

@keyframes Notation {
    0%{
        content:"";
		opacity:0
    }
    1%{
        content:"𝅘𝅥𝅯";
		opacity:1;
    }
    20%{
        content:"𝅘𝅥𝅯";
    }
    40%{
    	content:"𝅘𝅥𝅮";
    }
    60%{
        content:"𝅘𝅥";
    }
    80%{
        content:"𝅗𝅥";
    }
    100%{   
        content:"𝅗𝅥";
        scale:2;
    }
}

`
const HTML = `
<a class="content flood">
	<figure role="figure">
		<svg id="filters" hidden>
			<defs>
				<filter id="filter-threshold">
					<feColorMatrix in="SourceGraphic"
						type="matrix"
						values="1 0 0 0 0
								0 1 0 0 0
								0 0 1 0 0
								0 0 0 255 -140" />
				</filter>
			</defs>
		</svg>
		
		<svg class="wallpaper" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="9000" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5" clip-rule="evenodd" viewBox="0 0 9000 2160">
			<path d="M3438.07 2160h-946.6l1443.62-808.29L3438.07 2160" class="wallpaper-path" style="--i:0"/>
			<path d="M3438.07 2160h-946.6l1443.62-808.29L3438.07 2160" class="wallpaper-path" style="--i:1" transform="rotate(180 4484.315 1078.38)"/>
			<path d="M0 1699.83V598.155l1223.16 549.075L0 1699.83Z" class="wallpaper-path" style="--i:2" transform="matrix(-3.1051 0 0 -1.22375 8999.98 2363.34)"/>
			<path d="m2491.47 0 981.39-3.245 571.38 1273.195L2491.47 0Z" class="wallpaper-path" style="--i:3" transform="rotate(180 4484.315 1078.38)"/>
			<path d="M0 1699.83V598.155l1223.16 549.075L0 1699.83Z" class="wallpaper-path" style="--i:4" transform="matrix(3.1051 0 0 1.22375 -31.35 -206.576)"/>
			<path d="m2491.47 0 981.39-3.245 571.38 1273.195L2491.47 0Z" class="wallpaper-path" style="--i:5" />
		</svg>

		<svg class="details" 
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			xml:space="preserve" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"
			stroke-miterlimit="1.5" clip-rule="evenodd" width="1313" height="2160" viewBox="0 0 1313 2160">

			<title>Instant Musical Superpowers</title>

			<path class="bg" d="M1312.72,52.508c0,-28.98,-23.533,-52.508,-52.51,-52.508h-1207.7c-28.981,0,-52.511,23.528,-52.511,52.508v2054.99c0,28.977,23.53,52.508,52.51,52.508h1207.7c28.976,0,52.509,-23.531,52.509,-52.508v-2054.99z" />
			
			<!-- Eyes -->
			<ellipse fill="currentColor" class="eye left-eye" cx="851.651" cy="833.592" rx="132.017" ry="318.098" transform="matrix(.69464 0 0 .698 -117.855 -115.526)" />
			<g class="right eye">
				<defs>
					<path id="eye-line" 
						fill="currentColor" 
						stroke="currentColor" 
						stroke-width="131.64"
						d="m1821.03 876.34 243.92-164.707" />
				</defs>
				<use xlink:href="#eye-line" stroke-width="131.64" transform="matrix(.69464 0 0 .698 -488.473 -139.24)" />
				<use xlink:href="#eye-line" stroke-width="131.4" transform="scale(.69465 .698) rotate(64.03 1628.963 214.242)" />
				<use xlink:href="#eye-line" stroke-width="131.35" transform="matrix(.57569 .39061 -.38874 .57846 68.82 -745.804)" />
			</g>

			<path 
				fill="currentColor"
				class="mouth"
				d="M1236.22 802.544c0-17.28-13.954-31.3-31.163-31.3h-1097.4c-17.21 0-31.163 14.02-31.163 31.3 0 321.582 259.824 582.66 579.863 582.66 320.039 0 579.863-261.078 579.863-582.66Zm-534.286 142.43c-4.017-7.373-8.23-31.432-8.296-35.812-.013-.435-.013-.87-.013-1.319 0-37.487 22.854-70.344 54.504-70.344.288 0 .564 0 .84.013 66.37 1.398 162.96 126.588 162.96 232.27 0 137.523-114.521 249.166-255.572 249.166-141.05 0-255.572-111.643-255.572-249.166 0-105.682 77.516-230.463 162.96-232.27.276-.013.552-.013.84-.013 31.65 0 54.504 32.857 54.504 70.344 0 .436 0 .87-.013 1.32-.066 4.392-4.28 28.438-8.283 35.811-9.334 17.174-25.06 36.92-25.31 37.184-15.003 16.053-31.701 31.327-44.763 48.475-16.934 22.226-28.341 47.3-28.341 78.456 0 81.78 64.52 148.168 143.978 148.168 79.458 0 143.965-66.387 143.965-148.168 0-31.604-11.25-55.61-28.263-77.427-12.602-16.159-28.958-30.958-44.264-48.594-.985-1.174-14.755-17.635-25.86-38.094Z" />

			<g class="texts">
				<!-- INSTANT -->
				<g>
					<text x="655.385" y="636.188" font-size="170.833" transform="matrix(.30443 -.72253 .71876 .3063 -443.978 609.644)">I</text>
					<text x="676.563" y="599.824" font-size="170.833" transform="matrix(.46334 -.6314 .62817 .46604 -468.854 446.753)">N</text>
					<text x="766.379" y="528.319" font-size="170.833" transform="matrix(.63785 -.45214 .44992 .64143 -451.86 234.3)">S</text>
					<text x="849.666" y="495.624" font-size="170.833" transform="matrix(.74133 -.24546 .24438 .7454 -420.137 24.104)">T</text>
					<text x="943.326" y="487.841" font-size="170.833" transform="matrix(.78057 -.00094 .0012 .78477 -337.006 -221.882)">A</text>
					<text x="1044" y="511.839" font-size="170.833" transform="matrix(.73451 .26582 -.26416 .73838 -150.965 -497.62)">N</text>
					<text x="1138.2" y="577.337" font-size="170.833" transform="matrix(.61687 .48106 -.47828 .62004 138.926 -717.16)">T</text>
				</g>    

				<text x="690.356" y="2870.18" font-size="491.988" transform="matrix(.24145 0 0 .24261 566.845 -463.167)">MUSICAL</text>

				<path id="subheadline-circle-upper" 
					fill="none"
					d="M3056.5-278a2400 2400 0 10-4800 0 2400 2400 0 104800 0" />

				<path id="subheadline-circle-lower" fill="none"
					d="M2656.5 30a2000 2000 0 10-4000 0 2000 2000 0 104000 0" />

				<path id="headline-circle-upper" fill="none"
					d="M2056.5 403a1400 1400 0 10-2800 0 1400 1400 0 102800 0" />

				<path 
					id="headline-circle-lower" 
					fill="none"
					d="M1706.5 550a1050 1050 0 10-2100 0 1050 1050 0 102100 0" />

				<text textLength="55%"><textPath class="text-h1" font-size="200" xlink:href="#headline-circle-lower" startOffset="70%" textLength="55%" alignment-baseline="bottom">SUPER</textPath></text>
				<text textLength="94%"><textPath class="text-h2" font-size="280" alignment-baseline="bottom" xlink:href="#headline-circle-upper" startOffset="68.5%" textLength="94%">POWERS</textPath></text>
				<text textLength="70%"><textPath class="text-h3" font-size="90" alignment-baseline="bottom" xlink:href="#subheadline-circle-lower" startOffset="70.25%" textLength="90%">YO YO YO</textPath></text>
				<text textLength="1205"><textPath class="text-h4" font-size="84" xlink:href="#subheadline-circle-upper" alignment-baseline="bottom" startOffset="71%" textLength="1205">• TAG •</textPath></text>
			</g>
		</svg>

		<div inert class="overlay overlaid-notes" aria-hidden="true">
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
			<i class="note-animated" aria-hidden="true"></i>
		</div>
		
		<p class="instructions">Click to Learn more!</p>

		<figcaption class="sr-only"></figcaption>
	</figure>
</a>`

const template = document.createElement('template')
template.innerHTML = `<style>${CSS}</style>${HTML}`

class PhotoSynthHero extends HTMLElement {

	// Props (get from attributes or defaults)
	get id() { return this.getAttribute('id') || 'figure' }
	get title() { return this.getAttribute('title') || 'The PhotoSYNTH : Smile Powered Music!' }
	get posterLink() { return this.getAttribute('link') || '/' }
	get showHint() { return this.hasAttribute('show-hint') ? this.getAttribute('show-hint') !== 'false' : true }
	get showNotes() { return this.hasAttribute('show-notes') ? this.getAttribute('show-notes') !== 'false' : true }
	get showWallpaper() { return this.hasAttribute('show-walpaper') ? this.getAttribute('show-walpaper') !== 'false' : true }
	get animateNotes() { return this.hasAttribute('animate-notes') ? this.getAttribute('animate-notes') !== 'false' : true }
	get h1() { return this.getAttribute('h1')?.split('|').map(s => s.trim()) || ['SUPER'] }
	get h2() { return this.getAttribute('h2')?.split('|').map(s => s.trim()) || ['POWERS'] }
	get h3() { return this.getAttribute('h3')?.split('|').map(s => s.trim()) || ['FOR YOU AND YOUR FRIENDS!'] }
	get h4() { return this.getAttribute('h4')?.split('|').map(s => s.trim()) || ['SMILE POWERED SYNTHESIZER'] }
	get delayH1() { return parseInt(this.getAttribute('delay-h1'), 10) || 500 }
	get delayH2() { return parseInt(this.getAttribute('delay-h2'), 10) || 1000 }
	get delayH3() { return parseInt(this.getAttribute('delay-h3'), 10) || 1500 }
	get delayH4() { return parseInt(this.getAttribute('delay-h4'), 10) || 2000 }
	get durationH1() { return parseInt(this.getAttribute('duration-h1'), 10) || 4000 }
	get durationH2() { return parseInt(this.getAttribute('duration-h2'), 10) || 4000 }
	get durationH3() { return parseInt(this.getAttribute('duration-h3'), 10) || 4000 }
	get durationH4() { return parseInt(this.getAttribute('duration-h4'), 10) || 4000 }

	constructor() {
		super()
		this._animationTimers = []
	}

	connectedCallback() {
		if (!this._rendered) {
			this.render()
		}
		this.setupAnimations()
	}

	disconnectedCallback() {
		this._animationTimers.forEach(id => clearTimeout(id))
		this._animationTimers = []
	}

	render() {
		const content = template.content.cloneNode(true)

		// Apply dynamic attribute values
		content.querySelector('a').href = this.posterLink
		content.querySelector('figure').id = this.id
		content.querySelector('.details title').textContent = this.title
		content.querySelector('figcaption').textContent = this.title

		// Toggle visibility of optional sections
		content.querySelector('.overlaid-notes').hidden = !this.showNotes
		content.querySelector('.instructions').hidden = !this.showHint
		content.querySelector('.wallpaper').hidden = !this.showWallpaper

		this.innerHTML = ''
		this.appendChild(content)
		this._rendered = true
	}

	_updateVisibility() {
		const notes = this.querySelector('.overlaid-notes')
		const hint = this.querySelector('.instructions')
		if (notes) notes.hidden = !this.showNotes
		if (hint) hint.hidden = !this.showHint
	}

	setupAnimations() {
		const h1 = this.querySelector('.text-h1')
		const h2 = this.querySelector('.text-h2')
		const h3 = this.querySelector('.text-h3')
		const h4 = this.querySelector('.text-h4')

		// Reveal text with animations
		this.revealText(h1, this.h1, 0, this.delayH1, this.durationH1)
		this.revealText(h2, this.h2, 0, this.delayH2, this.durationH2)
		this.revealText(h3, this.h3, 0, this.delayH3, this.durationH3)
		this.revealText(h4, this.h4, 0, this.delayH4, this.durationH4)

		// Sync mouth animation with h1 timing via JS
		const mouth = this.querySelector('.mouth')
		if (mouth) {
			mouth.animate(
				[
					{ transform: 'scale(0.9)' },
					{ transform: 'scale(1)', offset: 0.05 },
					{ transform: 'scale(0.9)' }
				],
				{
					duration: this.durationH1 + this.delayH1,
					//delay: this.delayH1,
					easing: 'ease-out',
					iterations: Infinity,
					fill: 'both'
				}
			)
		}

		// Setup note animations via css
		if (this.animateNotes)
		{
			this.querySelectorAll('.note-animated').forEach((el, index) => {
				if (this.animateNotes) {
					el.classList.add('active')
					el.style.setProperty('--delay', `${index * 0.2}s`)
					el.style.setProperty('--col-accent', `hsla(${Math.random() * 360}%, 0.5, 0.5, 0.5)`)
				} else {
					el.classList.remove('active')
				}
			})			
		}
	}

	revealText(textElement, headerList, index = 0, delay = 0, duration = 4000, durationIn = 606, durationOut = 909) {
		
		if (!textElement) {
			return
		}

		const setTextWithAnimation = () => {
			textElement.textContent = headerList[index]

			const animationIn = textElement.animate(
				[
					{ filter: 'blur(120px)', opacity: 0 },
					{ filter: 'blur(0px)', opacity: 1 }
				],
				{
					duration: durationIn,
					iterations: 1,
				}
			)

			animationIn.onfinish = () => {
				const timerId = setTimeout(() => {
					const animationOut = textElement.animate(
						[
							{ filter: 'blur(0px)', opacity: 1 },
							{ filter: 'blur(120px)', opacity: 0 }
						],
						{
							duration: durationOut,
							iterations: 1,
						}
					)

					animationOut.onfinish = () => {
						index = (index + 1) % headerList.length
						setTextWithAnimation()
					}
				}, duration)

				this._animationTimers.push(timerId)
			}
		}

		const timerId = setTimeout(setTextWithAnimation, delay)
		this._animationTimers.push(timerId)
	}

	// Attribute change handling
	static get observedAttributes() {
		return ['id', 'title', 'link', 'show-hint', 'show-notes', 'animate-notes', 'h1', 'h2', 'h3', 'h4', 'delay-h1', 'delay-h2', 'delay-h3', 'delay-h4', 'duration-h1', 'duration-h2', 'duration-h3', 'duration-h4']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue || !this._rendered) return

		if (name === 'show-hint' || name === 'show-notes') {
			this._updateVisibility()
			return
		}

		if (name === 'animate-notes') {
			this.setupAnimations()
			return
		}

		this._animationTimers.forEach(id => clearTimeout(id))
		this._animationTimers = []
		this.render()
		this.setupAnimations()
	}
}

// Register the component
customElements.define('photosynth-hero', PhotoSynthHero)
export default PhotoSynthHero