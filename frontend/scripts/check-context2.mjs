import fs from 'fs'
const data = JSON.parse(fs.readFileSync('./scripts/cache/readings-data.json', 'utf-8'))

// Check questionText on groups for 1313
const r = data.find(d => d.listItem.id === 1313)
const part = r.reading.part1
for (const g of part.questions) {
  console.log(`\nGroup ${g.type} (id:${g.id}):`)
  console.log('  questionText:', g.questionText ? g.questionText.substring(0, 500) : 'NULL')
  console.log('  instruction:', g.instruction ? g.instruction.substring(0, 200) : 'NULL')
  console.log('  sub-questions:')
  for (const sq of g.questions) {
    console.log(`    Q${sq.questionNumber}: text="${sq.questionText ? sq.questionText.substring(0, 100) : 'empty'}"`)
  }
}
