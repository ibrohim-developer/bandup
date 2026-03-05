import fs from 'fs'
const data = JSON.parse(fs.readFileSync('./scripts/cache/readings-data.json', 'utf-8'))
for (const item of data) {
  for (const pk of ['part1', 'part2', 'part3']) {
    const part = item.reading[pk]
    if (!part) continue
    for (const g of part.questions) {
      if (g.type === 'MATCHING_SENTENCE_ENDINGS') {
        console.log('Reading:', item.listItem.id)
        console.log('Group options:', g.options?.length, g.options?.map(o => o.optionText?.substring(0, 60)))
        console.log('Context:', g.questionText?.substring(0, 200))
        console.log('Questions:', g.questions?.map(q => ({ num: q.questionNumber, text: q.questionText?.substring(0, 60) })))
        console.log()
      }
    }
  }
}
