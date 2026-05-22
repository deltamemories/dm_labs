type Edge = [number, number];

class GraphAnalyzer {
    public vertices: number;
    public edges: Edge[];
    public adjMatrix: number[][];
    public adjList: number[][];

    constructor(vertices: number, edges: Edge[]) {
        this.vertices = vertices;
        this.edges = edges;
        this.adjMatrix = Array.from({ length: vertices }, () => Array(vertices).fill(0));
        this.adjList = Array.from({ length: vertices }, () => []);

        for (const [u, v] of edges) {
            this.adjMatrix[u][v] = 1;
            this.adjMatrix[v][u] = 1;
            this.adjList[u].push(v);
            this.adjList[v].push(u);
        }

        for (let i = 0; i < vertices; i++) {
            this.adjList[i].sort((a, b) => a - b);
        }
    }

    public getAdjacencyList(): Record<number, number[]> {
        const list: Record<number, number[]> = {};
        for (let i = 0; i < this.vertices; i++) {
            list[i] = this.adjList[i];
        }
        return list;
    }

    public getAdjacencyMatrix(): number[][] {
        return this.adjMatrix;
    }

    public getIncidenceMatrix(): number[][] {
        const incMatrix = Array.from({ length: this.vertices }, () => Array(this.edges.length).fill(0));
        for (let j = 0; j < this.edges.length; j++) {
            const [u, v] = this.edges[j];
            incMatrix[u][j] = 1;
            incMatrix[v][j] = 1;
        }
        return incMatrix;
    }

    public getDegrees(): number[] {
        return this.adjList.map(neighbors => neighbors.length);
    }

    public getComplementEdges(): Edge[] {
        const compEdges: Edge[] = [];
        for (let i = 0; i < this.vertices; i++) {
            for (let j = i + 1; j < this.vertices; j++) {
                if (this.adjMatrix[i][j] === 0) {
                    compEdges.push([i, j]);
                }
            }
        }
        return compEdges;
    }

    public findK4(): number[] | null {
        for (let i = 0; i < this.vertices; i++) {
            for (let j = i + 1; j < this.vertices; j++) {
                for (let k = j + 1; k < this.vertices; k++) {
                    for (let l = k + 1; l < this.vertices; l++) {
                        if (
                            this.adjMatrix[i][j] && this.adjMatrix[i][k] && this.adjMatrix[i][l] &&
                            this.adjMatrix[j][k] && this.adjMatrix[j][l] &&
                            this.adjMatrix[k][l]
                        ) {
                            return [i, j, k, l];
                        }
                    }
                }
            }
        }
        return null;
    }

    public findLongCycles(count: number, minLength: number = 5): number[][] {
        const cycles: number[][] = [];
        const visited = new Array(this.vertices).fill(false);

        const dfs = (current: number, start: number, path: number[]) => {
            if (cycles.length >= count) return;
            visited[current] = true;
            path.push(current);

            for (const neighbor of this.adjList[current]) {
                if (neighbor === start && path.length >= minLength) {
                    cycles.push([...path]);
                    if (cycles.length >= count) return;
                } else if (!visited[neighbor]) {
                    dfs(neighbor, start, path);
                }
            }

            path.pop();
            visited[current] = false;
        };

        for (let i = 0; i < this.vertices; i++) {
            if (cycles.length >= count) break;
            dfs(i, i, []);
            visited[i] = true;
        }
        return cycles;
    }
}

function findIsomorphism(g1: GraphAnalyzer, g2: GraphAnalyzer): number[] | null {
    if (g1.vertices !== g2.vertices || g1.edges.length !== g2.edges.length) {
        return null;
    }

    const deg1 = g1.getDegrees().sort((a, b) => a - b).join(',');
    const deg2 = g2.getDegrees().sort((a, b) => a - b).join(',');
    if (deg1 !== deg2) {
        return null;
    }

    let mapping: number[] | null = null;
    const n = g1.vertices;
    const used = new Array(n).fill(false);
    const p = new Array(n).fill(0);

    const permute = (depth: number): boolean => {
        if (depth === n) {
            let isIso = true;
            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    if (g1.adjMatrix[i][j] !== g2.adjMatrix[p[i]][p[j]]) {
                        isIso = false;
                        break;
                    }
                }
                if (!isIso) break;
            }
            if (isIso) {
                mapping = [...p];
                return true;
            }
            return false;
        }

        for (let i = 0; i < n; i++) {
            if (!used[i]) {
                if (g1.getDegrees()[depth] !== g2.getDegrees()[i]) continue;
                used[i] = true;
                p[depth] = i;
                if (permute(depth + 1)) return true;
                used[i] = false;
            }
        }
        return false;
    };

    permute(0);
    return mapping;
}

const edgesG1: Edge[] = [
    [0, 1], [0, 5], [0, 7], [0, 8], [1, 2], [1, 9], [2, 3], [2, 7], [2, 8], [2, 9],
    [3, 4], [3, 9], [4, 5], [4, 6], [4, 7], [4, 8], [5, 6], [5, 9], [6, 7], [6, 8],
    [6, 9], [7, 8], [7, 9], [8, 9]
];

const edgesG2: Edge[] = [
    [0, 1], [0, 4], [0, 5], [0, 7], [0, 8], [0, 9], [1, 3], [1, 4], [1, 6], [1, 7],
    [2, 5], [2, 8], [2, 9], [3, 8], [3, 9], [4, 6], [4, 7], [4, 9], [5, 6], [5, 7],
    [6, 9], [7, 8], [7, 9], [8, 9]
];

const graph1 = new GraphAnalyzer(10, edgesG1);
const graph2 = new GraphAnalyzer(10, edgesG2);

console.log("Изоморфизм (Отображение вершин G1 -> G2)");
console.log(findIsomorphism(graph1, graph2));

console.log("\nG1: Вектор степеней вершин");
console.log(graph1.getDegrees());

console.log("\nG1: Подграф K4");
console.log(graph1.findK4());

console.log("\nG1: Дополнение графа (Список ребер)");
console.log(graph1.getComplementEdges().map(e => `(${e[0]}, ${e[1]})`).join(', '));

console.log("\nG1: Два длинных цикла");
console.log(graph1.findLongCycles(2, 5));
  
