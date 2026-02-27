import * as fs from 'fs'


const asciiLowercase = 'abcdefghijklmnopqrstuvwxyz';


function readText(filepath: string) {
    try {
        return fs.readFileSync(filepath, 'utf8')
    } catch (err) {
        console.log(err)
    }
}

function formatText(text: string) {
    text = text.trim()
    text = text.toLowerCase()
    text = text.replace('\n', '')
    text = text.replace('\t', '')
    text = text.replace(' ', '')

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
    charFrequency: Map<string, number>
    pairsCounts: Map<string, number>
    pairsFrequency: Map<string, number>
}

function staticAnalyzeText(text: string): StaticAnalyzeResult {
    const textLen = text.length

    let charCounts = new Map<string, number>()

    for (const char of text) {
        charCounts.set(char, charCounts.get(char) ? charCounts.get(char) + 1 : 1)
    }

    let charFreq = new Map<string, number>()
    for (const char of Object.keys(charCounts)) {
        charFreq.set(char, charCounts.get(char) / textLen)
    }

    let pairCounts = new Map<string, number>()

    for (let i = 0; i<textLen-1; i++) {
        const pair = text.slice(i, i + 2)
        pairCounts.set(pair, pairCounts.get(pair) ? pairCounts.get(pair) + 1 : 1)
    }

    let pairFreq = new Map<string, number>()

    for (const pair of Object.keys(pairCounts)) {
        pairFreq.set(pair, pairCounts.get(pair) / textLen)
    }

    return {
        charCounts,
        charFreq,
        pairCounts,
        pairFreq
    }

}


const rawText = readText('text.txt')
const text = formatText(rawText)
const aaaa = staticAnalyzeText(text)
console.log(aaaa)
