export class Particle{

	x = 0
	y = 0
	z = 0

	targetX
	targetY
	targetZ

	previous
	next

	constructor( x, y, z, speed=0.1){
		this.setPosition( x, y, z )
		this.speed = speed
	}

	setPosition(x,y,z, immedaite=false){
		this.targetX = x
		this.targetY = y
		this.targetZ = z
		if (immedaite)
		{
			this.x = x
			this.y = y
			this.z = z
		}
	}

	update(delta=1){

		const xVariance = (this.targetX - this.x)
		const yVariance = (this.targetY - this.y)
		const zVariance = (this.targetZ - this.z)
		// how much distance do we need to travel to complete

		// position += (target - position) * (1 - exp(- speed * dt))
		// const lerp = variance * speed
		// const lerp = variance * ( 1 - Math.exp( -speed  ) )
		const lerp = 1 - Math.exp( -this.speed * delta ) 
		const remaining = Math.max( xVariance, yVariance, zVariance )
		
		this.x += xVariance * lerp
		this.y += yVariance * lerp
		this.z += zVariance * lerp

		return remaining
	}
}


/**
 * Provide a geometry and a path then this particle will bounce
 * between each node in the geometry in the direction of the path
 * else chronologically
 */
export class ParticleTracer extends Particle{

	index
	geometry
	total
	isFreeRadical
	waiter = 0

	constructor( geometry, paths=null, startIndex=0, speed=0.2, freeRadical=false){

		const positions = geometry.attributes.position.array
		const total = geometry.attributes.position.array.length / 3

		const initialIndex = startIndex%(total-1)

		const index = paths ? paths[ initialIndex ].end * 3 : initialIndex * 3
		const x = positions[index]
		const y = positions[index+1]
		const z = positions[index+2]
		
		super(x,y,z,speed)

		this.geometry = geometry
		this.paths = paths
		this.isFreeRadical = freeRadical
		this.total = total // KEYPOINT_QUANTITY // geometry.attributes.position.array.length / 3
		
		this.setIndex(startIndex)	
	}

	setPositionFromIndex( i ){
		const index = this.paths ? this.paths[ i ].end * 3 : i * 3
		const x = this.geometry.attributes.position.array[index]
		const y = this.geometry.attributes.position.array[index+1]
		const z = this.geometry.attributes.position.array[index+2]
		super.setPosition( x, y, z )
	}

	setIndex(value){
		// limit rounding to within geometry
		value = value%(this.total-1)
		this.index = value
	}

	update(delta=1){
		this.setPositionFromIndex( this.index )
		const remaining = super.update(delta)
		if (this.isFreeRadical)
		{
			if( remaining <= 0.0001 && this.waiter > 10000)
			{
				this.waiter = 0
				this.setIndex( this.index + 1 )
				//console.info("Particle index", this.index, this.total )
				return 0
			}else{
				this.waiter++
			}
		}
		return remaining
	}
}