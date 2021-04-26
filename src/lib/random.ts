export function randNum(lower: number, upper: number) {
	return Math.random() * (upper - lower) + lower;
}

export function randInt(lower: number, upper: number) {
	lower = Math.ceil(lower);
	upper = Math.ceil(upper);
	return Math.ceil(Math.random() * (lower - upper)) + lower;
}

export function isOccurred(probability: number) {
	return Math.random() < probability;
}
