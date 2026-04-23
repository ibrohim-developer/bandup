import { NextResponse } from "next/server";

if (process.env.NODE_ENV !== "development") {
  throw new Error("seed-flashcards route is only available in development");
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

const flashcards = [
  // B1
  { word: "Achieve", definition: "To successfully reach a goal or complete something through effort.", example_sentence: "She worked hard to achieve high marks in her IELTS exam.", category: "vocabulary", difficulty: "b1" },
  { word: "Benefit", definition: "An advantage or positive effect that something provides.", example_sentence: "Regular exercise has many benefits for mental health.", category: "vocabulary", difficulty: "b1" },
  { word: "Challenge", definition: "A difficult task or situation that tests one's abilities.", example_sentence: "Living abroad can be a challenge, but also very rewarding.", category: "vocabulary", difficulty: "b1" },
  { word: "Significant", definition: "Important or large enough to have a noticeable effect.", example_sentence: "There has been a significant increase in online shopping.", category: "vocabulary", difficulty: "b1" },
  { word: "Approach", definition: "A way of dealing with a problem or situation.", example_sentence: "The school uses a modern approach to teaching languages.", category: "vocabulary", difficulty: "b1" },
  { word: "Contribute", definition: "To give or add something in order to help achieve a result.", example_sentence: "Volunteers contribute their time to help the community.", category: "vocabulary", difficulty: "b1" },
  { word: "However", definition: "Used to introduce a contrast or exception to what was just said.", example_sentence: "The plan was expensive; however, it was very effective.", category: "grammar", difficulty: "b1" },
  { word: "In addition", definition: "Used to introduce extra information that supports the main point.", example_sentence: "In addition to reading, she practises writing every day.", category: "collocations", difficulty: "b1" },
  { word: "Take part in", definition: "To participate or be involved in an activity.", example_sentence: "Students are encouraged to take part in class discussions.", category: "collocations", difficulty: "b1" },
  { word: "Break the ice", definition: "To do or say something to make people feel more comfortable.", example_sentence: "He told a joke to break the ice at the meeting.", category: "idioms", difficulty: "b1" },
  { word: "Common", definition: "Happening or found often; widespread.", example_sentence: "It is common for students to feel nervous before exams.", category: "vocabulary", difficulty: "b1" },
  { word: "Develop", definition: "To grow or cause something to grow and become more advanced.", example_sentence: "Children develop language skills very quickly.", category: "vocabulary", difficulty: "b1" },
  { word: "Environment", definition: "The natural world or the conditions surrounding a person or thing.", example_sentence: "We must protect the environment for future generations.", category: "vocabulary", difficulty: "b1" },
  { word: "Purpose", definition: "The reason for which something is done or created.", example_sentence: "The purpose of the report is to summarise the findings.", category: "vocabulary", difficulty: "b1" },
  { word: "Raise awareness", definition: "To increase people's knowledge or understanding of an issue.", example_sentence: "The campaign aimed to raise awareness about climate change.", category: "collocations", difficulty: "b1" },
  // B2
  { word: "Advocate", definition: "To publicly recommend or support a particular cause or policy.", example_sentence: "Many scientists advocate for greater investment in renewable energy.", category: "vocabulary", difficulty: "b2" },
  { word: "Prevalent", definition: "Widespread; common in a particular area or at a particular time.", example_sentence: "Obesity is increasingly prevalent in developed countries.", category: "vocabulary", difficulty: "b2" },
  { word: "Feasible", definition: "Possible and practical to do easily or conveniently.", example_sentence: "Is it feasible to complete the project within one month?", category: "vocabulary", difficulty: "b2" },
  { word: "Coherent", definition: "Logical and consistent; easy to understand.", example_sentence: "Her essay was coherent and well-structured.", category: "academic", difficulty: "b2" },
  { word: "Draw a conclusion", definition: "To decide something is true based on the information available.", example_sentence: "From the data, we can draw the conclusion that pollution has risen.", category: "collocations", difficulty: "b2" },
  { word: "Tackle a problem", definition: "To make a determined effort to deal with a difficult problem.", example_sentence: "Governments must tackle the problem of youth unemployment.", category: "collocations", difficulty: "b2" },
  { word: "On the fence", definition: "Undecided between two options; neither for nor against something.", example_sentence: "She was still on the fence about whether to study abroad.", category: "idioms", difficulty: "b2" },
  { word: "Although vs. Despite", definition: "'Although' is followed by a clause; 'despite' is followed by a noun or gerund.", example_sentence: "Although it rained, they continued. / Despite the rain, they continued.", category: "grammar", difficulty: "b2" },
  { word: "Substantial", definition: "Of considerable importance, size, or worth.", example_sentence: "There was a substantial improvement in test scores this year.", category: "vocabulary", difficulty: "b2" },
  { word: "Implication", definition: "A conclusion that can be drawn from something, though not explicitly stated.", example_sentence: "The implications of climate change are far-reaching.", category: "academic", difficulty: "b2" },
  { word: "Perspective", definition: "A particular way of thinking about something; a point of view.", example_sentence: "From an economic perspective, the policy makes sense.", category: "vocabulary", difficulty: "b2" },
  { word: "Make a contribution", definition: "To give something to help a cause or effort.", example_sentence: "Each student was asked to make a contribution to the group project.", category: "collocations", difficulty: "b2" },
  { word: "Assume", definition: "To accept something as true without proof.", example_sentence: "We should not assume that all readers share the same background.", category: "academic", difficulty: "b2" },
  { word: "A double-edged sword", definition: "Something that has both advantages and disadvantages.", example_sentence: "Social media is a double-edged sword — it connects people but spreads misinformation.", category: "idioms", difficulty: "b2" },
  { word: "Passive Voice", definition: "A grammatical construction where the subject receives the action.", example_sentence: "The experiment was conducted by a team of researchers.", category: "grammar", difficulty: "b2" },
  // C1
  { word: "Empirical", definition: "Based on observation or experiment rather than theory.", example_sentence: "The study provided empirical evidence supporting the hypothesis.", category: "academic", difficulty: "c1" },
  { word: "Methodology", definition: "A system of methods used in a particular area of study.", example_sentence: "The researchers explained their methodology in the introduction.", category: "academic", difficulty: "c1" },
  { word: "Mitigate", definition: "To make something less severe, serious, or painful.", example_sentence: "Planting trees can help mitigate the effects of urban heat.", category: "vocabulary", difficulty: "c1" },
  { word: "Detrimental", definition: "Tending to cause harm or damage.", example_sentence: "Excessive screen time can be detrimental to children's development.", category: "vocabulary", difficulty: "c1" },
  { word: "Hypothesis", definition: "A proposed explanation made as a starting point for investigation.", example_sentence: "The scientist tested the hypothesis through a series of experiments.", category: "academic", difficulty: "c1" },
  { word: "Cut corners", definition: "To do something in the easiest way, sacrificing quality.", example_sentence: "The construction company cut corners, leading to safety issues.", category: "idioms", difficulty: "c1" },
  { word: "Ubiquitous", definition: "Present, appearing, or found everywhere.", example_sentence: "Smartphones have become ubiquitous in modern society.", category: "vocabulary", difficulty: "c1" },
  { word: "Paradigm", definition: "A typical example or pattern; a framework containing basic assumptions.", example_sentence: "The internet brought about a paradigm shift in communication.", category: "academic", difficulty: "c1" },
  { word: "Juxtapose", definition: "To place two things close together to highlight contrast.", example_sentence: "The author juxtaposes wealth and poverty throughout the novel.", category: "vocabulary", difficulty: "c1" },
  { word: "Exacerbate", definition: "To make a problem or bad situation worse.", example_sentence: "Poor nutrition can exacerbate the symptoms of depression.", category: "vocabulary", difficulty: "c1" },
  { word: "Bear fruit", definition: "To produce good results after effort or investment.", example_sentence: "Years of research finally bore fruit when the vaccine was approved.", category: "idioms", difficulty: "c1" },
  { word: "It could be argued that", definition: "A hedging phrase used to present an opinion cautiously.", example_sentence: "It could be argued that technology has widened the education gap.", category: "grammar", difficulty: "c1" },
  { word: "Corroborate", definition: "To confirm or give support to a statement or theory.", example_sentence: "The witness's testimony corroborated the forensic evidence.", category: "academic", difficulty: "c1" },
  { word: "Come to a head", definition: "To reach a crisis point where action must be taken.", example_sentence: "Tensions in the region came to a head after the election.", category: "idioms", difficulty: "c1" },
  { word: "Nuanced", definition: "Showing awareness of subtle distinctions; not simple or straightforward.", example_sentence: "A nuanced understanding of the issue is essential for good policy.", category: "vocabulary", difficulty: "c1" },
  // C2
  { word: "Ameliorate", definition: "To make something bad or unsatisfactory better.", example_sentence: "Aid organisations work to ameliorate the suffering of refugees.", category: "vocabulary", difficulty: "c2" },
  { word: "Perspicacious", definition: "Having a ready insight into things; shrewdly perceptive.", example_sentence: "A perspicacious analyst can detect market trends before they emerge.", category: "vocabulary", difficulty: "c2" },
  { word: "Obfuscate", definition: "To make something unclear or difficult to understand.", example_sentence: "Politicians sometimes obfuscate the truth with vague language.", category: "vocabulary", difficulty: "c2" },
  { word: "Epistemic", definition: "Relating to knowledge or the degree of its validation.", example_sentence: "There is an epistemic problem with relying solely on anecdotal evidence.", category: "academic", difficulty: "c2" },
  { word: "Hegemony", definition: "Leadership or dominance, especially of one country over others.", example_sentence: "The essay examined the cultural hegemony of Western media.", category: "academic", difficulty: "c2" },
  { word: "Reify", definition: "To regard something abstract as a concrete or material thing.", example_sentence: "Media coverage can reify stereotypes, making them seem natural.", category: "academic", difficulty: "c2" },
  { word: "Throw down the gauntlet", definition: "To issue a challenge or invitation to compete.", example_sentence: "The start-up threw down the gauntlet to established industry leaders.", category: "idioms", difficulty: "c2" },
  { word: "Nominal clause", definition: "A clause that functions as a noun within a sentence.", example_sentence: "That she succeeded surprised everyone.", category: "grammar", difficulty: "c2" },
  { word: "Inimical", definition: "Tending to obstruct or harm; hostile.", example_sentence: "Short-term thinking is inimical to sustainable economic development.", category: "vocabulary", difficulty: "c2" },
  { word: "Circumlocution", definition: "The use of many words where fewer would do; evasive talk.", example_sentence: "His circumlocution during the interview made his position hard to understand.", category: "vocabulary", difficulty: "c2" },
  { word: "Dialectical", definition: "Relating to the logical discussion of ideas and opposing arguments.", example_sentence: "The paper employed a dialectical approach to examine both sides of the debate.", category: "academic", difficulty: "c2" },
  { word: "Burn one's bridges", definition: "To do something that makes it impossible to return to a previous situation.", example_sentence: "Resigning so aggressively burned his bridges with former colleagues.", category: "idioms", difficulty: "c2" },
  { word: "Contiguous", definition: "Sharing a common border; next to or touching each other.", example_sentence: "The contiguous regions were merged into a single administrative zone.", category: "vocabulary", difficulty: "c2" },
  { word: "Antithetical", definition: "Directly opposed or contrasted; mutually incompatible.", example_sentence: "Corruption is antithetical to democratic values.", category: "vocabulary", difficulty: "c2" },
  { word: "Inverted conditionals", definition: "Formal conditionals where 'if' is omitted and the auxiliary is fronted.", example_sentence: "Should you require further assistance, please contact us.", category: "grammar", difficulty: "c2" },
];

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ error: "STRAPI_API_TOKEN not set" }, { status: 500 });
  }

  const results: { word: string; status: string }[] = [];

  for (const card of flashcards) {
    const res = await fetch(`${STRAPI_URL}/api/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ data: card }),
    });

    results.push({ word: card.word, status: res.ok ? "ok" : await res.text() });
  }

  const failed = results.filter((r) => r.status !== "ok");
  return NextResponse.json({
    seeded: results.length - failed.length,
    failed,
  });
}
