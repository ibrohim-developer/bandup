import fs from 'fs'
const data = JSON.parse(fs.readFileSync('./scripts/cache/readings-data.json', 'utf-8'))
for (const item of data) {
  for (const pk of ['part1', 'part2', 'part3']) {
    const part = item.reading[pk]
    if (!part) continue
    for (const g of part.questions) {
      if (g.type === 'MULTIPLE_CHOICE' && g.questions && g.questions.length <= 1) {
        console.log('Reading:', item.listItem.id)
        console.log('Group options:', g.options?.length, g.options?.map(o => o.optionText?.substring(0, 50)))
        console.log('Sub-questions:', g.questions.length)
        if (g.questions[0]) {
          console.log('  Q options:', g.questions[0].options)
          console.log('  Q text:', g.questions[0].questionText?.substring(0, 80))
        }
        console.log('Group questionText:', g.questionText?.substring(0, 100))
        console.log()
        break
      }
    }
  }
}
