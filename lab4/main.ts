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


const rawText = readText('text.txt')
const text = formatText(rawText)
const aaaa = staticAnalyzeText(text)
console.log(aaaa.charCounts)


// 2. of task

type HuffmanNode = LeafNode | InternalNode

interface BaseNode {
    weight: number
}

interface LeafNode extends BaseNode {
    char: string
}

interface InternalNode extends BaseNode {
    left: LeafNode
    right: LeafNode
}

function createLeafNode(char: string, freq: number): LeafNode {
    return { char: char, weight: freq }
}

function createInternalNode(freq: number, left: LeafNode, right: LeafNode): InternalNode {
    return { weight: freq, left: left, right: right }
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
}

const testMap = new Map([['a', 16], ['o', 10], ['b', 4], ['f', 2]])

console.log(testMap)

const testQueue = new OrderedQueue(testMap)

console.log(testQueue)
