function extendedGcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
    if (b === 0n) {
        return [a, 1n, 0n];
    }
    const [gcd, x1, y1] = extendedGcd(b, a % b);
    return [gcd, y1, x1 - (a / b) * y1];
}

function solveDiophantine(a: bigint, b: bigint, c: bigint): [bigint, bigint] | null {
    const [gcd, x0, y0] = extendedGcd(a, b);
    if (c % gcd !== 0n) {
        return null;
    }
    const factor = c / gcd;
    return [x0 * factor, y0 * factor];
}

function solvePell(d: bigint): [bigint, bigint] {
    const m = BigInt(Math.floor(Math.sqrt(Number(d))));
    let p0 = 1n;
    let q0 = 0n;
    let p1 = m;
    let q1 = 1n;
    let g = 0n;
    let h = 1n;
    let a = m;

    while (p1 * p1 - d * q1 * q1 !== 1n) {
        g = a * h - g;
        h = (d - g * g) / h;
        a = (m + g) / h;
        const p2 = a * p1 + p0;
        const q2 = a * q1 + q0;
        p0 = p1;
        q0 = q1;
        p1 = p2;
        q1 = q2;
    }
    return [p1, q1];
}

function getCubeRootFraction(n: number, terms: number): number[] {
    const result: number[] = [];
    let x = Math.pow(n, 1 / 3);
    for (let i = 0; i < terms; i++) {
        const floorVal = Math.floor(x);
        result.push(floorVal);
        x = 1 / (x - floorVal);
    }
    return result;
}

function powerMod(base: bigint, exp: bigint, mod: bigint): bigint {
    let res = 1n;
    let b = base % mod;
    let e = exp;
    while (e > 0n) {
        if (e % 2n === 1n) {
            res = (res * b) % mod;
        }
        b = (b * b) % mod;
        e /= 2n;
    }
    return res;
}

function solveCongruenceEuler(a: bigint, c: bigint, m: bigint): bigint | null {
    const [gcd] = extendedGcd(a, m);
    if (c % gcd !== 0n) {
        return null;
    }
    const a1 = a / gcd;
    const c1 = c / gcd;
    const m1 = m / gcd;

    let phi = m1;
    let temp = m1;
    for (let i = 2n; i * i <= temp; i++) {
        if (temp % i === 0n) {
            while (temp % i === 0n) {
                temp /= i;
            }
            phi -= phi / i;
        }
    }
    if (temp > 1n) {
        phi -= phi / temp;
    }

    const inv = powerMod(a1, phi - 1n, m1);
    return (c1 * inv) % m1;
}

const diophantineRes = solveDiophantine(53111n, 59973n, 1n);
if (diophantineRes) {
    const [x, yPrime] = diophantineRes;
    console.log(`Задание 1: x = ${x}, y = ${-yPrime}`);
}

const [pellX, pellY] = solvePell(1635n);
console.log(`Задание 2: X1 = ${pellX}, Y1 = ${pellY}`);

const cubeRootTerms = getCubeRootFraction(3, 11);
console.log(`Задание 3: [${cubeRootTerms.join(", ")}]`);

const congruenceX = solveCongruenceEuler(15n, 6n, 107n);
console.log(`Задание 4: x = ${congruenceX}`);
