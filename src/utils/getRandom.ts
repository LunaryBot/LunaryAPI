export const getRandom = (array: any, count: number = 1) => {
	const auxArray = Array.from(array) as any[];

	auxArray.reduce((acc, curr, i, a) => a[i] = acc + curr.chance, 0);
  
	const randomArray = new Set();

	for(let i = 0; i < count; i++) {
		const x = array[auxArray.findIndex(w => w > Math.random() * auxArray[auxArray.length-1])];

		if(randomArray.has(x)) {
			i--;
		} else {
			randomArray.add(x);
		}
	}

	return [ ...randomArray.keys() ];
};