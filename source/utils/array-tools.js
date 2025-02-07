

/**
 * Convert an array such as
 * 0 1 2 3 4 5 6 7 8 9 10
 * and use a startIndex of 6 would become
 * 5 6 4 7 3 8 2 9 1 10 0
 * 
 * 0 1 2 3 4 5 6 7 8 9 10
 * and use a startIndex of 1 would become
 * 1 2 0 3 4 5 6 7 8 9 10
 * 
 * 0 1 2 3 4 5 6 7 8 9 10
 * and with a startIndex of 7 would become
 * 6 7 5 8 4 9 3 10 2 1 0
 * @param {Array} array 
 * @param {Number} startIndex 
 */
/*
export const rearrangeArrayBySnake = (array, startIndex) => {
	let extent = 0
	let flipper = 1
	const output = []
	let index

	for (let i=0, l=array.length; i<l; ++i)
	{	
		if (i===0)
		{
			index = startIndex

		}else if (i===1){

			extent += 1
			index = startIndex + extent

		}else{

			flipper *= -1
			index = array[startIndex + (extent * flipper) ]
			
			if (!index)
			{
				// that hole was not found
				extent += 1
				flipper *= -1
				index = array[startIndex + (extent * flipper) ]
		
			}else{
				
				const isEven = i%2 === 0
		
				if (isEven)
				{
					extent += 1
				}	
				
			}

		}
	
		output.push( array[index] )
	}
	return output
}
*/

export const rearrangeArrayBySnake = (arr, startIndex) => {
    const positions = [];
    
    for (let i = arr.length - 1; i >= 0; i--) {
        positions.push(startIndex + Math.floor((startIndex - i) / 2));
        
        // Move forward from the end of the array if necessary
        if ((positions[positions.length - 1] % 2 !== startIndex % 2 && (arr.length - positions.length)) || positions[positions.length - 1] >= arr.length) break;
    }
    return positions
}