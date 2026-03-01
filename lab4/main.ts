import * as fs from 'fs'


const asciiLowercase = 'abcdefghijklmnopqrstuvwxyz';


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
    text = text.replaceAll('\n', '')
    text = text.replaceAll('\t', '')
    text = text.replaceAll(' ', '')

    let resultText = ''
    for (const char of text) {
        if (asciiLowercase.includes(char)) {
            resultText += char
        }
    }
    return resultText
}


interface StaticAnalyzeResult {
    charCounts: Map<string, number>
    charFrequencies: Map<string, number>
    pairsCounts: Map<string, number>
    pairsFrequencies: Map<string, number>
}

// 1. of task
function staticAnalyzeText(text: string): StaticAnalyzeResult {
    const textLen = text.length

    let charCounts = new Map<string, number>()

    for (const char of text) {
        charCounts.set(char, charCounts.get(char) ? charCounts.get(char)! + 1 : 1)
    }

    let charFreq = new Map<string, number>()
    for (const char of charCounts.keys()) {
        charFreq.set(char, charCounts.get(char)! / textLen)
    }

    let pairCounts = new Map<string, number>()

    for (let i = 0; i<textLen-1; i++) {
        const pair = text.slice(i, i + 2)
        pairCounts.set(pair, pairCounts.get(pair) ? pairCounts.get(pair)! + 1 : 1)
    }

    let pairFreq = new Map<string, number>()

    for (const pair of pairCounts.keys()) {
        pairFreq.set(pair, pairCounts.get(pair)! / textLen)
    }

    return {
        charCounts: charCounts,
        charFrequencies: charFreq,
        pairsCounts: pairCounts,
        pairsFrequencies: pairFreq
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
        this.queue.sort((a: HuffmanNode, b: HuffmanNode) => a.weight - b.weight)
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


const rawText = readText('text.txt')
const text = formatText(rawText)
const staticAnalyzedText = staticAnalyzeText(text)

const queue = new OrderedQueue(staticAnalyzedText.charFrequencies)
const tree = generateHuffmanTree(queue)
if (tree !== undefined) {
    const codes = calculateBinaryCodes(tree)
    console.log(codes)
}

function generateFixedLenghtCodes(chars: string[]): Map<string, string> {
    const codeLenght = Math.ceil(Math.log2(chars.length))
    const codes = new Map<string, string>()

    for (const [index, char] of chars.entries()) {
        const binaryCode = index.toString(2).padStart(codeLenght, '0')
        codes.set(char, binaryCode)
    }

    return codes
}

console.log(generateFixedLenghtCodes(asciiLowercase.split('')))