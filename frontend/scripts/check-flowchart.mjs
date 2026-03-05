import fs from 'fs'
const data = JSON.parse(fs.readFileSync('./scripts/cache/readings-data.json', 'utf-8'))
const r = data.find(d => d.listItem.id === 1665)
for (const pk of ['part1', 'part2', 'part3']) {
  const part = r.reading[pk]
  if (!part) continue
  for (const g of part.questions) {
    if (g.type === 'FLOW_CHART_COMPLETION') {
      console.log(JSON.stringify(g, null, 2))
    }
  }
}
