// Hydra Auto Content Engine
// Generates content based on SCALE / TEST / KILL decisions

import fetch from 'node-fetch'

const API = 'http://localhost:3000/api/scale'

async function runEngine() {
  const res = await fetch(API)
  const data = await res.json()

  const { decisions } = data

  Object.keys(decisions).forEach(char => {
    const decision = decisions[char]

    if (decision === 'SCALE') {
      generateContent(char, 5)
    }

    if (decision === 'TEST') {
      generateVariations(char, 2)
    }

    if (decision === 'KILL') {
      console.log(`Stopping content for ${char}`)
    }
  })
}

function generateContent(character, count) {
  for (let i = 0; i < count; i++) {
    console.log(`Posting ${character} content #${i + 1}`)
  }
}

function generateVariations(character, count) {
  for (let i = 0; i < count; i++) {
    console.log(`Testing variation ${i + 1} for ${character}`)
  }
}

runEngine()
