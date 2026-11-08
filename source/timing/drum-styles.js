// Percussion companions: modal systems and instruments do not prescribe one
// rhythm. Each inspired entry identifies the particular timing approach used.
// These sparse adaptations reuse existing voices, rather than emulate ensembles.
export const DRUM_STYLES = [
	['jazz','Jazz','Jazz','jazz-swing','Triplet ride swing; foot hat on two and four'],
	['blues','Blues','Blues','blues-shuffle','12/8 shuffle with a backbeat'],
	['classical-piano','Classical piano','Keyboard','classical-piano','Even broken-chord accompaniment in 4/4'],
	['baroque-counterpoint','Baroque counterpoint','Keyboard','baroque-counterpoint','Steady interlocking voices in 4/4'],
	['romantic-piano','Romantic piano','Keyboard','romantic-piano','Soft 3/4 waltz with bounded phrase breathing'],
	['ragtime','Ragtime','Keyboard','ragtime','2/4 bass/chord alternation against syncopation'],
	['funk','Funk','Funk','funky-drummer','Syncopated sixteenths and quiet snare ghosts'],
	['reggae-dub','Reggae/dub','Jamaican','reggae','One drop; leave the first beat open'],
	['disco-house','Disco/house','Electronic','disco-house','Four on the floor and offbeat hats'],
	['synth-pop','Synth-pop','Electronic','synth-pop','Straight eighths and a firm two/four backbeat'],
	['synthwave','Synthwave','Electronic','synthwave','Spacious backbeat with alternating eighth-note accents'],
	['bossa-nova','Bossa nova','Brazilian','bossa-nova','Quiet bass pulse with syncopated cross-stick'],
	['drum-and-bass','Drum & bass','Breaks','drum-and-bass','Two-bar break with displaced kicks and snare ghosts'],
	['afrobeat','Afrobeat','West African','afrobeat','Interlocking syncopation over a steady pulse'],
	['highlife','Highlife','Ghanaian','highlife','Offbeat timekeeping and a two-bar bell response'],
	['soukous','Soukous','Congolese','soukous','Cavacha-inspired recurring short/long hat figure'],
	['mbalax','Mbalax','Senegalese','mbalax','Sabar-inspired syncopated low/high drum responses'],
	['ethio-jazz','Ethio-jazz','Ethiopian','ethio-jazz','A compound 6/8 jazz companion'],
	['amapiano','Amapiano','South African','amapiano','Soft house pulse with spaced low-tom syncopation'],
	['gnawa-inspired','Gnawa-inspired','Moroccan','gnawa-inspired','12-pulse metallic ostinato against a duple low pulse'],
	['rai-inspired','Raï-inspired','Algerian','rai-inspired','4/4 low/high drum pattern with offbeat responses'],
	['arabic-maqam-inspired','Arabic maqam-inspired','Arabic','maqsum','Maqsum 4/4 accompaniment; maqam describes pitch'],
	['turkish-folk-inspired','Turkish folk-inspired','Turkish','karsilama-9-8','Karsilama 9/8 grouped 2+2+2+3'],
	['persian-classical-inspired','Persian classical-inspired','Persian','persian-classical-inspired','A metered 6/8 reng-inspired companion'],
	['indian-raga-inspired','Indian raga-inspired','Hindustani','tintal-16','Tintal 16-beat cycle with sam and khali; raga describes melody'],
	['qawwali-inspired','Qawwali-inspired','South Asian','qawwali-inspired','Kaharwa-inspired eight beats in 4+4 with clapping'],
	['gamelan-inspired','Gamelan-inspired','Indonesian','gamelan-inspired','Interlocking parts and a closing gong proxy in a 16-pulse cycle'],
	['japanese-koto-inspired','Japanese koto-inspired','Japanese','japanese-koto-inspired','Sparse duple accompaniment with space for ornament'],
	['chinese-guzheng-inspired','Chinese guzheng-inspired','Chinese','chinese-guzheng-inspired','Measured 4/4 accompaniment with a quiet pickup response'],
	['korean-folk-inspired','Korean folk-inspired','Korean','korean-folk-inspired','Jungjungmori-inspired 12-pulse cycle; accents on one and nine'],
	['irish-jig-inspired','Irish jig-inspired','Irish','irish-jig-inspired','6/8 in two groups of three'],
	['flamenco-inspired','Flamenco-inspired','Flamenco','bulerias-12','Bulerias compas: accents on 12, 3, 6, 8, 10'],
	['klezmer-inspired','Klezmer-inspired','Klezmer','klezmer-inspired','Freylekhs-inspired duple bass and offbeat responses'],
	['balkan-dance-inspired','Balkan dance-inspired','Bulgarian','rachenitsa-7-8','Rachenitsa 7/8 grouped 2+2+3'],
	['tango','Tango','Argentine','tango','Habanera-derived 2/4: 3+1+2+2 sixteenths'],
	['argentine-tango','Argentine tango','Argentine','argentine-tango','A 3+3+2 syncopated variant in 4/4'],
	['samba','Samba','Brazilian','samba','Alternating muted/open surdo responses'],
	['salsa','Salsa','Cuban','salsa-mambo','Two-bar 3-2 son clave and tumbao accompaniment'],
	['cumbia','Cumbia','Colombian','cumbia','Offbeat hand drum and steady shaker'],
	['merengue','Merengue','Dominican','merengue','Driving 2/4 with alternating scrape and drum strokes'],
	['calypso','Calypso','Trinidadian','calypso','Syncopated 2/4 accompaniment'],
	['soca','Soca','Trinidadian','soca','Driving four-beat kick with offbeat percussion'],
	['bluegrass','Bluegrass','Bluegrass','bluegrass','2/4 bass/chop alternation'],
	['rock','Rock','Rock','rock','Straight eighths and two/four snare'],
	['hip-hop','Hip-hop','Breaks','hip-hop','Sparse boom-bap with slightly late snare and swung hats'],
	['trap','Trap','Electronic','trap','Half-time backbeat and a sixteenth-note hat grid'],
].map(([id,title,group,groove,description]) => ({id,title,group,groove,description}))

const pattern = (stepsPerBar, meter, groups, parts, feelOptions={}) => {
	const length = Math.ceil(Math.max(stepsPerBar, ...Object.values(parts).flat().map(([step]) => step + 1)) / stepsPerBar) * stepsPerBar
	const lanes = Object.fromEntries(['kick','snare','hat','clap'].map(part => [part,Array(length).fill(0)]))
	for (const [part, hits] of Object.entries(parts)) {
		lanes[part] ??= Array(length).fill(0)
		for (const [step, velocity] of hits) lanes[part][step] = velocity
	}
	return {...lanes,stepsPerBar,meter,groups,feel:'asymmetric',feelOptions,protectedLanes:Object.keys(lanes)}
}

// Sources for structural choices: DigiTabla (Kaharawa), KBS World
// (jungjungmori), IrishSession (jig), Smithsonian Folkways (gong cycles),
// Splice's Congolese and Laye Ndiaye performer collections (soukous/sabar).
// https://digitabla.com/reference/tals-and-thekas/kaharawa-tal/
// https://world.kbs.co.kr/service/contents_view.htm?board_seq=42231&lang=e
// https://irishsession.net/wordpress/jig/
// https://folkways-media.si.edu/docs/folkways/artwork/SFW50411.pdf
// Original sparse arrangements, not transcriptions of recorded performances.
export const STYLE_DRUM_GROOVES = {
	'blues-shuffle':pattern(12,[12,8],[3,3,3,3],{
		kick:[[0,210],[6,180],[8,95]],snare:[[3,210],[9,220]],
		hat:[[0,150],[2,85],[3,130],[5,80],[6,145],[8,90],[9,135],[11,90]],
	}),
	'classical-piano':pattern(8,[4,4],[1,1,1,1],{
		kick:[[0,115],[4,100]],woodblockLow:[[2,75],[6,80]],
		woodblockHigh:[[1,65],[3,60],[5,70],[7,60]],
	}),
	'baroque-counterpoint':pattern(16,[4,4],[1,1,1,1],{
		congaLow:[[0,115],[4,90],[8,105],[12,95]],
		congaHigh:[[2,85],[6,80],[10,90],[14,80]],
		crossStick:[[5,55],[7,50],[13,60],[15,50]],
	}),
	'romantic-piano':pattern(12,[3,4],[1,1,1],{
		kick:[[0,105]],crossStick:[[4,70],[8,65]],triangleMute:[[2,45],[6,50],[10,40]],
	},{variation:0.02,pulseOffsets:[0,0.005,0.015,0.02,0.025,0.04,0.055,0.065,0.07,0.06,0.04,0.02]}),
	'ragtime':pattern(8,[2,4],[1,1],{
		kick:[[0,160],[4,145]],crossStick:[[2,110],[6,120]],
		woodblockHigh:[[1,85],[3,105],[6,90],[7,75]],
	}),
	'disco-house':pattern(8,[4,4],[1,1,1,1],{
		kick:[[0,220],[2,215],[4,220],[6,215]],snare:[[2,200],[6,210]],
		hat:[[1,150],[3,145],[5,155],[7,150]],
	}),
	'synth-pop':pattern(8,[4,4],[1,1,1,1],{
		kick:[[0,220],[4,200],[5,130]],snare:[[2,215],[6,220]],
		hat:[[0,135],[1,85],[2,120],[3,90],[4,140],[5,85],[6,125],[7,100]],
	}),
	'synthwave':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,220],[6,160],[8,210]],snare:[[4,220],[12,230]],
		hat:[[0,120],[2,80],[4,110],[6,85],[8,125],[10,80],[12,115],[14,90]],tomFloorLow:[[15,100]],
	}),
	'drum-and-bass':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,225],[10,185],[16,225],[23,130],[26,190]],
		snare:[[4,235],[11,55],[12,230],[20,235],[27,65],[28,240]],
		hat:[[0,140],[2,95],[4,130],[6,100],[8,140],[10,95],[12,135],[14,105],
			[16,140],[18,95],[20,130],[22,100],[24,145],[26,100],[28,135],[30,110]],
	},{delays:{snare:0.002}}),
	'highlife':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,170],[8,155],[16,170],[24,155]],crossStick:[[4,145],[12,155],[20,145],[28,160]],
		hat:[[2,105],[6,110],[10,100],[14,115],[18,105],[22,110],[26,100],[30,115]],
		agogoHigh:[[0,115],[6,90],[10,100],[16,115],[22,90],[28,100]],
	}),
	'soukous':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,190],[4,165],[8,185],[12,165]],crossStick:[[4,135],[12,145]],
		hat:[[0,130],[2,80],[3,100],[4,115],[6,80],[7,105],[8,135],[10,80],[11,105],[12,120],[14,85],[15,110]],
	}),
	'mbalax':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,180],[8,170]],congaLow:[[3,150],[6,140],[11,155],[14,145]],
		congaHigh:[[2,115],[7,150],[10,120],[13,155],[15,110]],
		crossStick:[[4,120],[12,130]],hat:[[0,85],[4,80],[8,90],[12,80]],
	}),
	'ethio-jazz':pattern(6,[6,8],[3,3],{
		kick:[[0,175]],crossStick:[[3,140]],ride:[[0,130],[2,80],[3,115],[5,90]],congaHigh:[[1,70],[4,80]],
	}),
	'amapiano':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,145],[4,135],[8,145],[12,135]],crossStick:[[4,110],[12,115]],
		cabasa:[[0,65],[2,95],[4,65],[6,100],[8,65],[10,95],[12,65],[14,105]],
		tomFloorLow:[[3,155],[10,180],[15,145]],
	}),
	'gnawa-inspired':pattern(12,[12,8],[3,3,3,3],{
		kick:[[0,160],[4,135],[8,145]],
		castanets:[[0,145],[2,90],[3,120],[5,85],[6,145],[8,90],[9,125],[11,95]],
	}),
	'rai-inspired':pattern(8,[4,4],[1,1,1,1],{
		congaLow:[[0,190],[4,180]],congaMute:[[1,115],[3,140],[5,120],[6,155]],
		clap:[[2,135],[6,145]],tambourine:[[1,65],[3,75],[5,65],[7,80]],
	}),
	'persian-classical-inspired':pattern(6,[6,8],[3,3],{
		congaLow:[[0,180],[3,150]],congaMute:[[1,90],[2,120],[4,95],[5,130]],
	}),
	'qawwali-inspired':pattern(8,[8,4],[4,4],{
		congaLow:[[0,200],[1,145],[6,170]],congaMute:[[2,125],[3,140],[4,100],[5,120],[7,135]],
		clap:[[1,140],[3,150],[5,140],[7,155]],
	}),
	'gamelan-inspired':pattern(16,[8,4],[4,4],{
		agogoHigh:[[0,100],[2,80],[4,95],[6,80],[8,100],[10,80],[12,95],[14,80]],
		agogoLow:[[1,75],[3,85],[5,75],[7,90],[9,75],[11,85],[13,75]],
		timbaleLow:[[3,95],[7,105],[11,95]],tomFloorLow:[[15,165]],
	}),
	'japanese-koto-inspired':pattern(8,[4,4],[2,2],{
		congaLow:[[0,100],[4,80]],congaMute:[[2,60],[7,65]],triangleMute:[[5,40]],
	}),
	'chinese-guzheng-inspired':pattern(16,[4,4],[2,2],{
		congaLow:[[0,105],[8,85]],congaMute:[[4,75],[10,60],[12,80],[15,55]],triangleMute:[[6,45]],
	}),
	'korean-folk-inspired':pattern(12,[12,8],[3,3,3,3],{
		congaLow:[[0,195],[6,125],[8,180]],congaHigh:[[3,120],[5,75],[9,135],[11,90]],crossStick:[[2,65],[7,70]],
	}),
	'irish-jig-inspired':pattern(6,[6,8],[3,3],{
		tomFloorLow:[[0,185],[3,160]],crossStick:[[2,85],[5,100]],hat:[[1,60],[4,65]],
	}),
	'klezmer-inspired':pattern(8,[2,4],[1,1],{
		kick:[[0,180],[4,160]],crossStick:[[2,135],[6,145]],hat:[[0,80],[2,65],[4,75],[6,65]],tambourine:[[3,60],[7,75]],
	}),
	'tango':pattern(8,[2,4],[3,1,2,2],{
		kick:[[0,185],[4,155]],crossStick:[[3,130],[6,150]],hat:[[0,70],[3,65],[4,70],[6,80]],
	}),
	'argentine-tango':pattern(8,[4,4],[3,3,2],{
		kick:[[0,185],[3,160],[6,175]],crossStick:[[2,85],[5,95],[7,115]],
	}),
	'merengue':pattern(8,[2,4],[1,1],{
		congaLow:[[0,180],[4,165]],congaMute:[[2,140],[6,155],[7,85]],
		guiroLong:[[0,100],[4,105]],guiroShort:[[2,90],[3,65],[6,95],[7,70]],
	}),
	'calypso':pattern(8,[2,4],[1,1],{
		kick:[[0,180],[6,150]],crossStick:[[3,130],[6,145]],
		hat:[[0,90],[2,70],[4,85],[6,75]],congaHigh:[[1,95],[5,100],[7,80]],
	}),
	'soca':pattern(8,[4,4],[1,1,1,1],{
		kick:[[0,220],[2,200],[4,215],[6,205]],snare:[[2,185],[6,195]],
		cabasa:[[0,65],[1,100],[2,65],[3,110],[4,70],[5,105],[6,70],[7,115]],congaHigh:[[3,125],[7,135]],
	}),
	'bluegrass':pattern(4,[2,4],[1,1],{
		kick:[[0,150],[2,130]],crossStick:[[1,115],[3,120]],
	}),
	'rock':pattern(8,[4,4],[1,1,1,1],{
		kick:[[0,225],[4,205],[5,135]],snare:[[2,230],[6,240]],
		hat:[[0,150],[1,95],[2,140],[3,100],[4,155],[5,95],[6,145],[7,110]],
	}),
	'hip-hop':pattern(16,[4,4],[1,1,1,1],{
		kick:[[0,220],[7,135],[10,190]],snare:[[4,225],[12,235]],
		hat:[[0,125],[2,85],[5,65],[6,100],[8,130],[10,90],[13,70],[14,105]],
	},{swing:0.16,delays:{snare:0.009}}),
}

