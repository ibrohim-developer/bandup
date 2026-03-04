const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicm9vb29vb21yQGdtYWlsLmNvbSIsImlhdCI6MTc3MjE3Mjc5NCwiZXhwIjoxNzc5OTQ4Nzk0fQ.ni58FfsX0z3Rwj9B3MuJ6lti2TNRYeExqzhtmlJwKSb_DWlhZ-NTlXKrfIyaQCmykPi4dmg-nXlXbIFOxNuBWQ';
// All candidate single-section IDs
const ids = [877, 876, 874, 873, 872, 871, 870, 869, 868, 867, 993, 994, 357, 995, 358, 385, 225, 289];

async function main() {
  const singles = [];
  for (const id of ids) {
    const res = await fetch('https://api.otaboyev-prep.uz/api/listenings/' + id + '?authorization=Bearer ' + token);
    const d = await res.json();
    const parts = ['part1','part2','part3','part4'].filter(k => d[k] !== null);
    if (parts.length === 1) {
      const sec = parts[0].replace('part', 'Section ');
      singles.push({ id, title: d.title, section: sec, questions: d.totalQuestions, duration: Math.round(d.audioDurationSeconds / 60), audioUrl: d.audioUrl });
      console.log(`${id} | ${d.title} | ${sec} | ${d.totalQuestions}q | ~${Math.round(d.audioDurationSeconds / 60)}min`);
    } else {
      console.log(`${id} | ${d.title} | MULTI (${parts.length} parts) - SKIPPED`);
    }
  }
  console.log('\n---');
  console.log(`Total single-section tests: ${singles.length}`);
}
main();
