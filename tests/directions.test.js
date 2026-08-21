import { createDirections } from '../source/models/directions.js'
import PersonalProgress from '../source/people/person-progress.js'

describe('directions', () => {
	const directionsData = {
		groups:{
			smiles:[
				{emoji:'🙂', points:5, congratulation:'Small smile!'},
				{emoji:'😁', points:20, congratulation:'Big grin!'}
			],
			rare:[
				{emoji:'🤪', points:30, congratulation:'Rare face!'}
			]
		},
		basic:{
			complete:{
				icon:'complete',
				message:'All directions complete!'
			},
			default:[
				{
					id:'smile-hard',
					title:'Smile Challenge',
					icon:'sun',
					message:'Smile hard!',
					congratulation:'You smiled!',
					expects:{
						type:'expression',
						group:'smiles'
					}
				},
				{
					id:'make-a-face',
					title:'Face Challenge',
					message:'Make a face!',
					points:10,
					congratulation:'Face made!',
					expects:{
						type:'expression',
						groups:['rare'],
						emoji:[
							'😜',
							{emoji:'🤪', points:40, congratulation:'Extra rare face!'}
						]
					}
				}
			],
			blocks:[]
		}
	}

	test('returns prompts whose expected emojis have not already been achieved', () => {
		const directions = createDirections(directionsData, {advancedMode:false, now:() => 0})
		const person = {
			getExperiencedExpressions:() => ['🙂']
		}

		expect(directions.getNextDirection([person]).id).toBe('make-a-face')
	})

	test('normalises direction icons into feedback classes', () => {
		const directions = createDirections(directionsData, {advancedMode:false, now:() => 0})

		expect(directions.getNextDirection([])).toEqual(expect.objectContaining({
			className:'direction direction-sun'
		}))
	})

	test('completes a direction with the matched emoji score and congratulation', () => {
		const directions = createDirections(directionsData, {advancedMode:false, now:() => 0})

		expect(directions.getNextDirection([]).id).toBe('smile-hard')
		const completion = directions.completeExpression('😁')

		expect(completion).toEqual(expect.objectContaining({
			directionId:'smile-hard',
			title:'Smile Challenge',
			emoji:'😁',
			points:20,
			message:'Big grin!'
		}))
		expect(directions.getCompletedDirectionIds().has('smile-hard')).toBe(true)
	})

	test('uses the highest points when direct emoji and group entries overlap', () => {
		const directions = createDirections(directionsData, {advancedMode:false, now:() => 0})

		directions.getNextDirection([])
		directions.completeExpression('🙂')
		expect(directions.getNextDirection([]).id).toBe('make-a-face')

		const completion = directions.completeExpression('🤪')
		expect(completion.points).toBe(40)
		expect(completion.message).toBe('Extra rare face!')
	})

	test('bonus direction points are added to personal progress', () => {
		const progress = new PersonalProgress()

		progress.addBonusPoints(20)

		expect(progress.achievementPoints).toBe(20)
	})

	test('shows the all-complete message once and resets the prompt cycle', () => {
		const directions = createDirections(directionsData, {advancedMode:false, now:() => 0})
		const person = {
			getExperiencedExpressions:() => ['😁', '🤪']
		}

		const completed = directions.getNextDirection([person])
		expect(completed).toEqual(expect.objectContaining({
			id:'directions-complete',
			message:'All directions complete!',
			className:'direction direction-complete',
			complete:true
		}))
		expect(directions.getCompletedDirectionIds().size).toBe(0)
		expect(directions.getNextDirection([person])).toBe(null)
		expect(directions.getNextDirection([]).id).toBe('smile-hard')
	})
})
