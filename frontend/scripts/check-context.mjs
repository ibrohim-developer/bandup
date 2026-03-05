import fs from 'fs'
const data = JSON.parse(fs.readFileSync('./scripts/cache/readings-data.json', 'utf-8'))

// Check reading 1313 (Reef Fish Study)
const r = data.find(d => d.listItem.id === 1313)
const part = r.reading.part1
for (const g of part.questions) {
  const keys = Object.keys(g).filter(k => g[k] !== null && g[k] !== '')
  console.log('Group', g.type, 'non-null keys:', keys.join(', '))
  if (g.context) console.log('  context:', g.context.substring(0, 300))
  if (g.tableData) console.log('  tableData:', JSON.stringify(g.tableData).substring(0, 300))
  if (g.headingOptions) console.log('  headingOptions:', JSON.stringify(g.headingOptions).substring(0, 300))
}

// Also check a reading with MATCHING_HEADINGS to see headingOptions
console.log('\n--- Reading 1804 (Day 15: Living Dunes) ---')
const r2 = data.find(d => d.listItem.id === 1804)
for (const pk of ['part1','part2','part3']) {
  const part2 = r2.reading[pk]
  if (!part2) continue
  for (const g of part2.questions) {
    const keys = Object.keys(g).filter(k => g[k] !== null && g[k] !== '')
    console.log('Group', g.type, 'non-null keys:', keys.join(', '))
    if (g.context) console.log('  context:', g.context.substring(0, 300))
    if (g.tableData) console.log('  tableData:', JSON.stringify(g.tableData).substring(0, 300))
    if (g.headingOptions) console.log('  headingOptions:', JSON.stringify(g.headingOptions).substring(0, 300))
  }
}

// Check a TABLE_COMPLETION reading
console.log('\n--- Reading 1794 (Day 19: Development of Plastics) ---')
const r3 = data.find(d => d.listItem.id === 1794)
for (const pk of ['part1','part2','part3']) {
  const part3 = r3.reading[pk]
  if (!part3) continue
  for (const g of part3.questions) {
    const keys = Object.keys(g).filter(k => g[k] !== null && g[k] !== '')
    console.log('Group', g.type, 'non-null keys:', keys.join(', '))
    if (g.context) console.log('  context:', g.context.substring(0, 500))
    if (g.tableData) console.log('  tableData:', JSON.stringify(g.tableData).substring(0, 500))
  }
}
