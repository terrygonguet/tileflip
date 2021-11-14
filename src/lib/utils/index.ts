export function arrayWith<T>(n: number, f: (i: number) => T) {
	return new Array(n).fill(0).map((_, i) => f(i))
}
