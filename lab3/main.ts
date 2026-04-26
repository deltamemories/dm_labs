const task1 = () => {
	const text = "abstract";
	const binaryStr = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
	const block1 = binaryStr.substring(0, 32);
	const block2 = binaryStr.substring(32, 64);

	const encodeHamming = (data: string): number[] => {
		let m = data.length;
		let r = 0;
		while (Math.pow(2, r) < m + r + 1) r++;
		const encoded = new Array(m + r + 1).fill(0);
		let j = 0;
		for (let i = 1; i <= encoded.length - 1; i++) {
			if ((i & (i - 1)) === 0) continue;
			encoded[i] = parseInt(data[j]!);
			j++;
		}
		for (let i = 0; i < r; i++) {
			const pos = Math.pow(2, i);
			let parity = 0;
			for (let k = 1; k < encoded.length; k++) {
				if ((k & pos) !== 0) parity ^= encoded[k];
			}
			encoded[pos] = parity;
		}
		return encoded;
	};

	const fixHamming = (encoded: number[]): { fixed: number[], errorPos: number } => {
		const r = Math.floor(Math.log2(encoded.length - 1)) + 1;
		let errorPos = 0;
		for (let i = 0; i < r; i++) {
			const pos = Math.pow(2, i);
			let parity = 0;
			for (let k = 1; k < encoded.length; k++) {
				if ((k & pos) !== 0) parity ^= encoded[k]!;
			}
			if (parity !== 0) errorPos += pos;
		}
		const fixed = [...encoded];
		if (errorPos > 0 && errorPos < fixed.length) {
			fixed[errorPos]! ^= 1;
		}
		return { fixed, errorPos };
	};

	const encoded1 = encodeHamming(block1);
	const encoded2 = encodeHamming(block2);

	encoded1[5]! ^= 1;
	encoded2[21]! ^= 1;

	const result1 = fixHamming(encoded1);
	const result2 = fixHamming(encoded2);

	console.log("=== 1. Код Хемминга ===");
	console.log(`Блок 1 (ошибка в 5): Найдена ошибка на позиции ${result1.errorPos}`);
	console.log(`Блок 2 (ошибка в 21): Найдена ошибка на позиции ${result2.errorPos}`);
};

const task2 = () => {
	const codesD2 = ["0000", "0011", "0101", "0110", "1001", "1010", "1100", "1111"];
	const errorSimD2 = "0001";
	const isErrorD2 = !codesD2.includes(errorSimD2);

	const codesD3 = ["0000000", "0001011", "0010110", "0011101", "0100111", "0101100", "0110001", "0111010"];
	const errorSimD3 = "0001010";

	const getDistance = (a: string, b: string): number => {
		let d = 0;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
		return d;
	};

	let fixedD3 = "";
	let minD = Infinity;
	for (const code of codesD3) {
		const d = getDistance(errorSimD3, code);
		if (d < minD) {
			minD = d;
			fixedD3 = code;
		}
	}

	console.log("\n=== 2. Расстояние Хемминга ===");
	console.log(`D=2: Обнаружение ошибки в "${errorSimD2}" -> ${isErrorD2}`);
	console.log(`D=3: Исправление ошибки в "${errorSimD3}" -> ${fixedD3}`);
};

const task3 = () => {
	const str = "aaaaadgggggggggggggggghtyiklooooop";
	const encoded: any[] = [];
	let i = 0;

	while (i < str.length) {
		let count = 1;
		while (i + count < str.length && str[i] === str[i + count]) {
			count++;
		}
		if (count > 1) {
			encoded.push(count, str[i]);
			i += count;
		} else {
			let nonRep = "";
			while (i < str.length) {
				let cCount = 1;
				while (i + cCount < str.length && str[i] === str[i + cCount]) cCount++;
				if (cCount > 1) break;
				nonRep += str[i];
				i++;
			}
			encoded.push(0, nonRep.length, nonRep);
		}
	}

	const origBytes = str.length;
	let compBytes = 0;
	for (const item of encoded) {
		if (typeof item === 'number') compBytes += 1;
		else compBytes += item.length;
	}

	console.log("\n=== 3. RLE ===");
	console.log(`Сжатая последовательность: ${JSON.stringify(encoded)}`);
	console.log(`Степень сжатия: ${(origBytes / compBytes).toFixed(2)}`);
	console.log(`Коэффициент сжатия: ${(compBytes / origBytes).toFixed(2)}`);
};

const task4 = () => {
	type HNode = { char: string, freq: number, left?: HNode, right?: HNode };
	const freqs = [
		{ char: 'A', freq: 1 }, { char: 'B', freq: 2 }, { char: 'C', freq: 3 },
		{ char: 'D', freq: 13 }, { char: 'E', freq: 19 }, { char: 'F', freq: 28 },
		{ char: 'G', freq: 34 }
	];

	const nodes: HNode[] = freqs.map(f => ({ ...f }));
	while (nodes.length > 1) {
		nodes.sort((a, b) => a.freq - b.freq);
		const left = nodes.shift()!;
		const right = nodes.shift()!;
		nodes.push({ char: left.char + right.char, freq: left.freq + right.freq, left, right });
	}

	const root = nodes[0];
	const dict: Record<string, string> = {};

	const build = (node: HNode, code: string) => {
		if (!node.left && !node.right) {
			dict[node.char] = code;
			return;
		}
		if (node.left) build(node.left, code + "0");
		if (node.right) build(node.right, code + "1");
	};
	build(root!, "");

	const demoStr = "FACE";
	const demoEnc = demoStr.split('').map(c => dict[c]).join('');

	let demoDec = "";
	let temp = "";
	for (const bit of demoEnc) {
		temp += bit;
		const found = Object.keys(dict).find(k => dict[k] === temp);
		if (found) {
			demoDec += found;
			temp = "";
		}
	}

	const avgLen = freqs.reduce((acc, f) => acc + f.freq * dict[f.char]!.length, 0) / 100;
	const uniformLen = 3;

	console.log("\n=== 4. Алгоритм Хаффмана ===");
	console.log(`Коды: ${JSON.stringify(dict)}`);
	console.log(`Пример (${demoStr}): закодировано -> ${demoEnc}, раскодировано -> ${demoDec}`);
	console.log(`Степень сжатия: ${(uniformLen / avgLen).toFixed(2)}`);
	console.log(`Коэффициент сжатия: ${(avgLen / uniformLen).toFixed(2)}`);
};

const task5 = () => {
	const probs: Record<string, number> = { 'a': 0.05, 'b': 0.10, 'c': 0.05, 'd': 0.55, 'e': 0.15, 'f': 0.10 };
	const lows: Record<string, number> = {};
	const highs: Record<string, number> = {};

	let current = 0;
	for (const [char, p] of Object.entries(probs)) {
		lows[char] = current;
		current += p;
		highs[char] = current;
	}

	const str = "eacdbf";
	let low = 0;
	let high = 1;
	for (const char of str) {
		const range = high - low;
		high = low + range * highs[char]!;
		low = low + range * lows[char]!;
	}

	const target = (low + high) / 2;
	let binStr = "";
	let frac = target;
	for (let i = 0; i < 15; i++) {
		frac *= 2;
		if (frac >= 1) {
			binStr += "1";
			frac -= 1;
		} else {
			binStr += "0";
		}
		if (frac === 0) break;
	}

	const uniformBits = str.length * 3;
	const compBits = binStr.length;

	console.log("\n=== 5. Арифметическое кодирование ===");
	console.log(`Код для ${str}: ${binStr}`);
	console.log(`Степень сжатия: ${(uniformBits / compBits).toFixed(2)}`);
	console.log(`Коэффициент сжатия: ${(compBits / uniformBits).toFixed(2)}`);
};

task1();
task2();
task3();
task4();
task5();