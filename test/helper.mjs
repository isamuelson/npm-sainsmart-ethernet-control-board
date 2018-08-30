export async function randomState () {
	const state = Array(16).fill(0);
	const count = Math.floor(Math.random() * 16) ;
	
	for (var i = 0; i < count; i++) {
		const l = Math.floor(Math.random() * 16);
		state[l] = Math.floor(Math.random() * 3) ;
	}

	return state;
}