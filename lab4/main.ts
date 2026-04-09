import * as fs from 'fs'


function readText(filepath: string) {
    try {
        return fs.readFileSync(filepath, 'utf8')
    } catch (err) {
        throw err
    }
}


function formatText(text: string) {
    text = text.trim()
    text = text.toLowerCase()
    text = text.replaceAll(/[^a-z ]/g, '')
    if (text.length % 2 != 0) text += ' '
    return text
}


interface StaticAnalyzeResult {
    charCounts: Map<string, number>
    charFrequencies: Map<string, number>
    pairsCounts: Map<string, number>
    pairsFrequencies: Map<string, number>
    textLength: number
}


// 1. of task
function staticAnalyzeText(text: string): StaticAnalyzeResult {
    const textLen = text.length

    let charCounts = new Map<string, number>()

    for (const char of text) {
        charCounts.set(char, charCounts.get(char) ? charCounts.get(char)! + 1 : 1)
    }

    let charFreq = new Map<string, number>()
    for (const [char, count] of charCounts) {
        charFreq.set(char, count / textLen)
    }

    let pairCounts = new Map<string, number>()

    for (let i = 0; i<textLen-1; i+=2) {
        const pair = text.slice(i, i + 2)
        pairCounts.set(pair, pairCounts.get(pair) ? pairCounts.get(pair)! + 1 : 1)
    }
    if (textLen > 1 && textLen%2!=0) {
        const pair = text.slice(textLen-2, textLen)
        pairCounts.set(pair, pairCounts.get(pair) ? pairCounts.get(pair)! + 1 : 1)
    }

    let pairFreq = new Map<string, number>()

    for (const [pair, count] of pairCounts) {
        pairFreq.set(pair, count / (textLen - 1))
    }

    return {
        charCounts: charCounts,
        charFrequencies: charFreq,
        pairsCounts: pairCounts,
        pairsFrequencies: pairFreq,
        textLength: textLen
    }
}


// 2. of task
type HuffmanNode = LeafNode | InternalNode

interface BaseNode {
    weight: number
}

interface LeafNode extends BaseNode {
    type: 'leaf'
    char: string
}

interface InternalNode extends BaseNode {
    type: 'internal'
    left: HuffmanNode
    right: HuffmanNode
}

function createLeafNode(char: string, weight: number): LeafNode {
    return { type: 'leaf', char: char, weight: weight }
}

function createInternalNode(weight: number, left: HuffmanNode, right: HuffmanNode): InternalNode {
    return { type: 'internal', weight: weight, left: left, right: right }
}


class OrderedQueue {
    queue: HuffmanNode[] = []

    constructor(charFrequencies: Map<string, number>) {
        for (const [char, freq] of charFrequencies) {
            this.queue.push(createLeafNode(char, freq))
        }

        this.sort()
    }

    private sort() {
        this.queue.sort((a: HuffmanNode, b: HuffmanNode) => a.weight - b.weight) // can be optimized
    }

    public push(node: HuffmanNode) {
        this.queue.push(node)
        this.sort()
    }

    public get(index: number): HuffmanNode | undefined

    public get(startIndex: number, endIndex: number): HuffmanNode[]

    public get(startIndex: number, endIndex?: number): HuffmanNode | HuffmanNode[] | undefined {
        if (endIndex === undefined) {
            return this.queue[startIndex]
        } else {
            return this.queue.slice(startIndex, endIndex)
        }
    }

    public remove(startIndex: number): HuffmanNode | undefined

    public remove(startIndex: number, count: number): HuffmanNode[]

    public remove(startIndex: number, count?: number): HuffmanNode | HuffmanNode[] | undefined {
        if (count === undefined) {
            return this.queue.splice(startIndex, 1)
        } else {
            return this.queue.splice(startIndex, count)
        }
    }
}


function generateHuffmanTree(queue: OrderedQueue): HuffmanNode | undefined {
    while (queue.get(0, 2).length > 1) {
        const [firstNode, secondNode] = queue.get(0, 2)
        const internalNode = createInternalNode(firstNode!.weight + secondNode!.weight, firstNode!, secondNode!)
        queue.remove(0, 2)
        queue.push(internalNode)
    }

    return queue.get(0)
}


function calculateBinaryCodes(tree: HuffmanNode): Map<string, string> {
    let codes = new Map<string, string>()
    if (tree.type === 'leaf') {
        codes.set(tree.char, '0')
        return codes
    }

    calculateBinaryCodeRecursive(tree, '', codes)
    return codes
}

function calculateBinaryCodeRecursive(tree: HuffmanNode, code: string, codes: Map<string, string>) {
    if (tree.type === 'leaf') {
        codes.set(tree.char, code)
    } else {
        calculateBinaryCodeRecursive(tree.left, code + '0', codes)
        calculateBinaryCodeRecursive(tree.right, code + '1', codes)
    }

    return codes
}


function generateFixedLengthCodes(chars: string[]): Map<string, string> {
    const codeLength = Math.ceil(Math.log2(chars.length))
    const codes = new Map<string, string>()

    for (const [index, char] of chars.entries()) {
        const binaryCode = index.toString(2).padStart(codeLength, '0')
        codes.set(char, binaryCode)
    }

    return codes
}


/** Entropy in bits */
type Entropy = number

/** Length of message in bits */
type MessageLength = number


function calculateShannonEntropy(staticAnalyze: StaticAnalyzeResult): Entropy {
    let entropy: Entropy = 0
    for (const freq of staticAnalyze.charFrequencies.values()) {
        entropy -= freq * Math.log2(freq)
    }

    return entropy
}

function calculateShannonTotalLength(staticAnalyze: StaticAnalyzeResult, entropy: Entropy): MessageLength {
    return staticAnalyze.textLength * entropy
}


function encodeText(text: string, codes: Map<string, string>): string {
    if (codes.size === 0) {
        throw new Error("Map with codes should not be empty")
    }

    const codeLength = codes.keys().next().value!.length
    const encodedText: string[] = new Array(text.length / codeLength)

    for (let i = 0; i < text.length; i+=codeLength) {
        const token = text.slice(i, i+codeLength)!;
        const code = codes.get(token);
        if (code === undefined) {
            throw new Error(`Can't find code for token: ${token}`)
        }
        encodedText[i] = code
    }

    return encodedText.join('')
}


// 3. of task
/** Tokens map for encoding */
type TokensEncodeMap = Map<string, number>

class LempelZivWelchCoder {
    tokensEncodeMap: TokensEncodeMap = new Map()
    readonly text: string
    readonly chars: string[]

    constructor(text: string, staticAnalyze: StaticAnalyzeResult) {
        this.text = text
        this.chars = staticAnalyze.charCounts.keys().toArray()
    }

    public encode(): string {
        this.initTokensEncodeMap()

        const encodedText: number[] = []
        let phrase = ''

        for (const char of this.text) {
            const currentPhrase = phrase + char

            if (this.tokensEncodeMap.has(currentPhrase)) {
                phrase = currentPhrase
            } else {
                encodedText.push(this.tokensEncodeMap.get(phrase)!)
                this.tokensEncodeMap.set(currentPhrase, this.tokensEncodeMap.size)
                phrase = char
            }
        }

        if (phrase !== '') {
            encodedText.push(this.tokensEncodeMap.get(phrase)!)
        }

        return this.encodeDigitsCodes(encodedText)
    }

    private encodeDigitsCodes(digits: number[]): string {

    }

    private initTokensEncodeMap() {
        for (let i = 0; i < 256; i++) {
            this.tokensEncodeMap.set(String.fromCharCode(i), i)
        }
    }
}


class LZW {
    public encode(text: string, staticAnalyze: StaticAnalyzeResult) {
        return new LempelZivWelchCoder(text, staticAnalyze).encode()
    }
}


const rawText = readText('smallText.txt')
const text = formatText(rawText)
const staticAnalyzedText = staticAnalyzeText(text)
console.log("staticAnalyzedText:", staticAnalyzedText)

const queue = new OrderedQueue(staticAnalyzedText.charFrequencies)
const tree = generateHuffmanTree(queue)

let codes = undefined
if (tree !== undefined) {
    codes = calculateBinaryCodes(tree)
    console.log("Huffman codes:", codes)
}


const queuePairs = new OrderedQueue(staticAnalyzedText.pairsFrequencies)
const treePairs = generateHuffmanTree(queuePairs)
let codesPairs = undefined
if (treePairs !== undefined) {
    codesPairs = calculateBinaryCodes(treePairs)
    console.log("Huffman codes pairs:", codesPairs)
}

console.log(generateFixedLengthCodes(staticAnalyzedText.charCounts.keys().toArray()))

const fixedLengthCodes = generateFixedLengthCodes(staticAnalyzedText.charCounts.keys().toArray())

console.log("Huffman:", encodeText(text, codes!).length, "bits")
console.log("Huffman pairs:", encodeText(text, codesPairs!).length, "bits")
console.log("Fixed:", encodeText(text, fixedLengthCodes).length, "bits")
console.log("Shannon:", Math.ceil(calculateShannonTotalLength(staticAnalyzedText, calculateShannonEntropy(staticAnalyzedText))), "bits")


const lzw = new LZW()

const lzwText = lzw.encode(text, staticAnalyzeText(text))
console.log(lzwText)
