import {createSessionNotePlayer} from '../source/audio/record/session-note-player.js'

const setup=()=>{
	const oscillators=[],gains=[]
	const context={currentTime:0,destination:{},resume:jest.fn(async()=>{}),
		createGain:()=>{const gain={gain:{value:0,setValueAtTime:jest.fn(),setTargetAtTime:jest.fn()},connect:jest.fn(),disconnect:jest.fn()};gains.push(gain);return gain},
		createOscillator:()=>{const osc={frequency:{setValueAtTime:jest.fn()},connect:jest.fn(),disconnect:jest.fn(),start:jest.fn(),stop:jest.fn()};oscillators.push(osc);return osc}}
	const notes=[{type:'noteOn',track:0,channel:0,note:60,velocity:127,time:0},{type:'noteOff',track:0,channel:0,note:60,velocity:0,time:15000}]
	const reader=jest.fn(async(from,to)=>({noteCount:1,durationMs:60000,events:notes.filter(e=>e.time>=from&&e.time<to),held:from>0&&from<15000?[notes[0]]:[]}))
	const onError=jest.fn(),player=createSessionNotePlayer({getContext:()=>context,onError})
	return {player,context,reader,oscillators,gains,onError}
}
beforeEach(()=>jest.useFakeTimers())
afterEach(()=>jest.useRealTimers())

test('replay pause silences voices, seeking restores held notes, and seeking to the end stops',async()=>{
	const {player,context,reader,oscillators}=setup()
	try{
		await player.load(reader,'saved');await player.play()
		expect(reader).toHaveBeenCalledTimes(1)
		expect(oscillators).toHaveLength(1)
		context.currentTime=1;player.pause()
		expect(player.state()).toMatchObject({playing:false,positionMs:1000})
		expect(oscillators[0].stop).toHaveBeenCalled()
		await player.seek(10000);await player.play()
		expect(reader).toHaveBeenLastCalledWith(10000,40000)
		expect(oscillators).toHaveLength(2)
		await player.seek(999999)
		expect(player.state()).toMatchObject({playing:false,positionMs:60000})
		await player.seek(-100);expect(player.state().positionMs).toBe(0)
	}finally{player.destroy()}
})
test('prefetch uses bounded windows and never routes replay to live instruments',async()=>{
	const {player,context,reader,gains}=setup()
	try{
		await player.load(reader,'saved');await player.play()
		expect(gains[0].connect).toHaveBeenCalledWith(context.destination)
		context.currentTime=25;await jest.advanceTimersByTimeAsync(50)
		expect(reader).toHaveBeenLastCalledWith(30000,60000)
	}finally{player.destroy()}
})
test('pausing during an asynchronous start cannot leave late notes sounding',async()=>{
	const {player,context,reader,oscillators}=setup()
	await player.load(reader,'saved')
	let resolve;context.resume.mockReturnValueOnce(new Promise(r=>{resolve=r}))
	const started=player.play();player.pause();resolve();await started
	expect(player.state().playing).toBe(false)
	expect(oscillators).toHaveLength(0)
	player.destroy()
})
test('empty note recordings produce a clear error',async()=>{
	const {player}=setup()
	await expect(player.load(async()=>({noteCount:0}),'empty')).rejects.toThrow('no saved notes')
	expect(player.state()).toMatchObject({id:null,loading:false,playing:false})
	player.destroy()
})
