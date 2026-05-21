class PriorityQueue {
	data: [number, number][];

	constructor() {
		this.data = [];
	}

	push(val: [number, number]) {
		this.data.push(val);
		this.up(this.data.length - 1);
	}

	pop(): [number, number] | undefined {
		if (this.data.length === 0) return undefined;
		const top = this.data[0];
		const bottom = this.data.pop();
		if (this.data.length > 0 && bottom) {
			this.data[0] = bottom;
			this.down(0);
		}
		return top;
	}

	up(i: number) {
		while (i > 0) {
			const p = Math.floor((i - 1) / 2);
			if (this.data[p][0] <= this.data[i][0]) break;
			const tmp = this.data[p];
			this.data[p] = this.data[i];
			this.data[i] = tmp;
			i = p;
		}
	}

	down(i: number) {
		const len = this.data.length;
		while (true) {
			const left = 2 * i + 1;
			const right = 2 * i + 2;
			let smallest = i;

			if (left < len && this.data[left][0] < this.data[smallest][0]) smallest = left;
			if (right < len && this.data[right][0] < this.data[smallest][0]) smallest = right;

			if (smallest === i) break;

			const tmp = this.data[i];
			this.data[i] = this.data[smallest];
			this.data[smallest] = tmp;
			i = smallest;
		}
	}

	isEmpty() {
		return this.data.length === 0;
	}
}

interface Edge {
	to: number;
	weight: number;
}

function runDijkstra(n: number, adj: Edge[][], start: number) {
	let iterations = 0;
	const dist = new Float64Array(n).fill(Infinity);
	const prev = new Int32Array(n).fill(-1);

	dist[start] = 0;
	const pq = new PriorityQueue();
	pq.push([0, start]);

	while (!pq.isEmpty()) {
		iterations++;
		const curr = pq.pop()!;
		const d = curr[0];
		const u = curr[1];

		if (d > dist[u]) continue;

		for (const edge of adj[u]) {
			iterations++;
			const v = edge.to;
			const alt = dist[u] + edge.weight;
			if (alt < dist[v]) {
				dist[v] = alt;
				prev[v] = u;
				pq.push([alt, v]);
			}
		}
	}
	return { dist, prev, iterations };
}

function runFloydWarshall(n: number, matrix: Float64Array[]) {
	let iterations = 0;
	for (let k = 0; k < n; k++) {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				iterations++;
				const sum = matrix[i][k] + matrix[k][j];
				if (sum < matrix[i][j]) {
					matrix[i][j] = sum;
				}
			}
		}
	}
	return iterations;
}

function getPath(prev: Int32Array, target: number): number[] {
	const path: number[] = [];
	let curr = target;
	while (curr !== -1) {
		path.push(curr);
		curr = prev[curr];
	}
	return path.reverse();
}

function generateGraphAndRun(n: number, runFW: boolean) {
	const edges = new Set<number>();

	const addEdge = (u: number, v: number) => {
		if (u === v) return;
		const min = Math.min(u, v);
		const max = Math.max(u, v);
		edges.add(min * n + max);
	};

	for (let i = 0; i < 6; i++) {
		for (let j = i + 1; j < 6; j++) {
			addEdge(i, j);
		}
	}

	for (let i = 6; i < 10; i++) {
		for (let j = 10; j < 15; j++) {
			addEdge(i, j);
		}
	}

	for (let i = 0; i < n - 1; i++) {
		addEdge(i, i + 1);
	}

	const targetEdges = Math.floor((n * Math.sqrt(n)) / 2);
	while (edges.size < targetEdges) {
		const u = Math.floor(Math.random() * n);
		const v = Math.floor(Math.random() * n);
		addEdge(u, v);
	}

	const adj: Edge[][] = Array.from({ length: n }, () => []);
	let matrix: Float64Array[] = [];

	if (runFW) {
		matrix = Array.from({ length: n }, () => new Float64Array(n).fill(Infinity));
		for (let i = 0; i < n; i++) matrix[i][i] = 0;
	}

	edges.forEach(val => {
		const u = Math.floor(val / n);
		const v = val % n;
		const weight = Math.floor(Math.random() * 10) + 1;

		adj[u].push({ to: v, weight });
		adj[v].push({ to: u, weight });

		if (runFW) {
			matrix[u][v] = weight;
			matrix[v][u] = weight;
		}
	});

	console.log(`\nN = ${n}`);
	console.log(`Edges count: ${edges.size}`);

	const dijkstraResult = runDijkstra(n, adj, 0);
	console.log(`Dijkstra iterations: ${dijkstraResult.iterations}`);

	const path = getPath(dijkstraResult.prev, n - 1);
	console.log(`Path distance 0 -> ${n - 1}: ${dijkstraResult.dist[n - 1]}`);

	if (runFW) {
		const fwIterations = runFloydWarshall(n, matrix);
		console.log(`Floyd-Warshall iterations: ${fwIterations}`);
	} else {
		console.log(`Floyd-Warshall skipped (performance limits).`);
	}
}

function main() {
	const sizes = [1200, 3200, 8000, 20000, 29000];
	for (const n of sizes) {
		const runFW = n <= 1200;
		generateGraphAndRun(n, runFW);
	}
}

main();