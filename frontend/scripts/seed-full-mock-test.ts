/**
 * Seed a Full Mock Test (all 4 IELTS modules) into Strapi
 *
 * This creates:
 *  - 1 Test entry (is_full_mock_test=true)
 *  - 4 Listening Sections (40 questions total)
 *  - 3 Reading Passages (40 questions total, with question groups)
 *  - 2 Writing Tasks (Task 1 report + Task 2 essay)
 *  - 3 Speaking Topics (Parts 1, 2, 3)
 *
 * Usage: npx tsx scripts/seed-full-mock-test.ts
 *
 * Requires NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN env vars
 * (reads from frontend/.env.local)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("STRAPI_API_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function createEntry(
  collection: string,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (json.error) {
    console.error(`Failed to create ${collection}:`, JSON.stringify(json.error, null, 2));
    throw new Error(`Failed to create ${collection}: ${json.error.message}`);
  }
  return json.data;
}

// ═══════════════════════════════════════════════════════════════════════════
//  LISTENING DATA — 4 Sections, 10 questions each = 40 total
// ═══════════════════════════════════════════════════════════════════════════

const listeningData = [
  {
    sectionNumber: 1,
    transcript: `<p><strong>Section 1</strong></p>
<p>You will hear a conversation between a student and a housing officer about renting accommodation near the university.</p>
<p><strong>Officer:</strong> Good morning, how can I help you?</p>
<p><strong>Student:</strong> Hi, I'm looking for accommodation for the next academic year. I'll be starting my Masters in September.</p>
<p><strong>Officer:</strong> Certainly. We have several options available. Are you looking for university halls or private rentals?</p>
<p><strong>Student:</strong> I'd prefer a private flat, ideally a one-bedroom.</p>
<p><strong>Officer:</strong> OK. We currently have listings on Park Road, Mill Lane, and Church Street. The Park Road flat is 650 pounds per month, the Mill Lane one is 580, and Church Street is 720.</p>
<p><strong>Student:</strong> And what about bills?</p>
<p><strong>Officer:</strong> Park Road includes water in the rent. Mill Lane includes water and internet. Church Street includes all bills.</p>
<p><strong>Student:</strong> My name is Rebecca Thompson — that's T-H-O-M-P-S-O-N, and my student number is UB-7742.</p>`,
    timeLimit: 450,
    questions: [
      { qn: 1, type: "gap_fill", text: "The student is going to start a ______ degree.", answer: "Masters" },
      { qn: 2, type: "gap_fill", text: "The flat on Park Road costs ______ per month.", answer: "650" },
      { qn: 3, type: "gap_fill", text: "The cheapest flat is located on ______ Lane.", answer: "Mill" },
      { qn: 4, type: "gap_fill", text: "Church Street flat costs ______ pounds per month.", answer: "720" },
      { qn: 5, type: "gap_fill", text: "The Park Road flat includes ______ in the rent.", answer: "water" },
      { qn: 6, type: "gap_fill", text: "Mill Lane includes water and ______ in the rent.", answer: "internet" },
      { qn: 7, type: "gap_fill", text: "The student's surname is ______.", answer: "Thompson" },
      { qn: 8, type: "gap_fill", text: "The student's number is UB-______.", answer: "7742" },
      { qn: 9, type: "mcq_single", text: "The student is looking for:", answer: "B", options: ["A university hall", "A one-bedroom flat", "A shared house"] },
      { qn: 10, type: "mcq_single", text: "Which flat includes all bills?", answer: "C", options: ["Park Road", "Mill Lane", "Church Street"] },
    ],
  },
  {
    sectionNumber: 2,
    transcript: `<p><strong>Section 2</strong></p>
<p>You will hear a tour guide speaking about a museum.</p>
<p><strong>Guide:</strong> Welcome to the National Science Museum. I'm going to give you a brief overview of what's available today.</p>
<p>The museum was founded in 1885 and moved to its current location in 1923. The building itself was designed by the architect James Morton.</p>
<p>On the ground floor, you'll find our permanent exhibition on space exploration, which was updated last year. The first floor houses our interactive technology gallery — it's especially popular with younger visitors.</p>
<p>On the second floor, we have our temporary exhibition, which this month focuses on marine biology. This exhibition runs until the 15th of March.</p>
<p>The museum café is on the ground floor next to the gift shop. We're open from 9 AM to 6 PM on weekdays, and 10 AM to 5 PM on weekends. Admission is free, but we suggest a donation of five pounds.</p>`,
    timeLimit: 450,
    questions: [
      { qn: 11, type: "gap_fill", text: "The museum was founded in ______.", answer: "1885" },
      { qn: 12, type: "gap_fill", text: "The building was designed by architect James ______.", answer: "Morton" },
      { qn: 13, type: "gap_fill", text: "The space exploration exhibition is on the ______ floor.", answer: "ground" },
      { qn: 14, type: "gap_fill", text: "The technology gallery is on the ______ floor.", answer: "first" },
      { qn: 15, type: "gap_fill", text: "The temporary exhibition is about ______ biology.", answer: "marine" },
      { qn: 16, type: "gap_fill", text: "The temporary exhibition ends on the 15th of ______.", answer: "March" },
      { qn: 17, type: "mcq_single", text: "On weekdays, the museum closes at:", answer: "C", options: ["5 PM", "5:30 PM", "6 PM"] },
      { qn: 18, type: "mcq_single", text: "The suggested donation is:", answer: "B", options: ["Three pounds", "Five pounds", "Ten pounds"] },
      { qn: 19, type: "mcq_single", text: "The interactive technology gallery is popular with:", answer: "A", options: ["Younger visitors", "Researchers", "Artists"] },
      { qn: 20, type: "mcq_single", text: "The café is located:", answer: "B", options: ["On the first floor", "Next to the gift shop", "On the second floor"] },
    ],
  },
  {
    sectionNumber: 3,
    transcript: `<p><strong>Section 3</strong></p>
<p>You will hear a discussion between two students and a tutor about a research project on renewable energy.</p>
<p><strong>Tutor:</strong> So, how is your project on renewable energy sources coming along?</p>
<p><strong>Student A:</strong> Well, we've decided to focus on three main areas: solar power, wind energy, and hydroelectric power.</p>
<p><strong>Tutor:</strong> Good choice. What approach are you taking?</p>
<p><strong>Student B:</strong> We're comparing the efficiency and environmental impact of each source. We've already gathered data from the Henderson Report published in 2019.</p>
<p><strong>Student A:</strong> Yes, and we're also looking at case studies from Denmark and Germany, which have made significant progress in wind energy adoption.</p>
<p><strong>Tutor:</strong> Have you considered the economic factors?</p>
<p><strong>Student B:</strong> Definitely. The initial installation costs are high for solar, but the long-term savings are substantial. Wind energy has become much more cost-effective in the last decade.</p>
<p><strong>Tutor:</strong> What's your timeline for completion?</p>
<p><strong>Student A:</strong> We plan to finish data collection by the end of this week, write the analysis over the next two weeks, and submit the final report by December 10th.</p>`,
    timeLimit: 450,
    questions: [
      { qn: 21, type: "mcq_single", text: "The project focuses on how many renewable energy sources?", answer: "B", options: ["Two", "Three", "Four"] },
      { qn: 22, type: "mcq_single", text: "The students are comparing efficiency and:", answer: "C", options: ["Cost", "Availability", "Environmental impact"] },
      { qn: 23, type: "gap_fill", text: "The Henderson Report was published in ______.", answer: "2019" },
      { qn: 24, type: "gap_fill", text: "The case studies are from Denmark and ______.", answer: "Germany" },
      { qn: 25, type: "mcq_single", text: "Which energy source has high initial installation costs?", answer: "A", options: ["Solar", "Wind", "Hydroelectric"] },
      { qn: 26, type: "gap_fill", text: "Wind energy has become more ______ in the last decade.", answer: "cost-effective" },
      { qn: 27, type: "gap_fill", text: "Data collection will be finished by the end of this ______.", answer: "week" },
      { qn: 28, type: "gap_fill", text: "The analysis phase will take ______ weeks.", answer: "two" },
      { qn: 29, type: "gap_fill", text: "The final report is due by December ______.", answer: "10th" },
      { qn: 30, type: "mcq_single", text: "The students are working on:", answer: "C", options: ["A laboratory experiment", "A presentation", "A research project"] },
    ],
  },
  {
    sectionNumber: 4,
    transcript: `<p><strong>Section 4</strong></p>
<p>You will hear a university lecture about the psychology of decision-making.</p>
<p><strong>Lecturer:</strong> Today we're going to look at how people make decisions, particularly in situations of uncertainty. This field, known as behavioural economics, was pioneered by Daniel Kahneman and Amos Tversky in the 1970s.</p>
<p>Their research showed that humans don't always make rational choices. Instead, we rely on mental shortcuts called heuristics. While these shortcuts are often useful, they can also lead to systematic errors known as cognitive biases.</p>
<p>One of the most well-known biases is the anchoring effect. This occurs when people rely too heavily on the first piece of information they receive. For example, in negotiations, the first price offered tends to set the range for the entire discussion.</p>
<p>Another important bias is the availability heuristic. People tend to judge the likelihood of an event based on how easily they can recall similar events. This is why people often overestimate the risk of dramatic events like plane crashes, while underestimating common risks like heart disease.</p>
<p>Loss aversion is another key concept. Research has shown that the pain of losing something is about twice as powerful as the pleasure of gaining something of equal value. This explains why investors often hold onto losing stocks too long.</p>`,
    timeLimit: 450,
    questions: [
      { qn: 31, type: "gap_fill", text: "The field of behavioural economics was pioneered in the ______.", answer: "1970s" },
      { qn: 32, type: "gap_fill", text: "Mental shortcuts used in decision-making are called ______.", answer: "heuristics" },
      { qn: 33, type: "gap_fill", text: "Systematic errors in thinking are known as cognitive ______.", answer: "biases" },
      { qn: 34, type: "gap_fill", text: "The ______ effect occurs when people rely on the first piece of information.", answer: "anchoring" },
      { qn: 35, type: "gap_fill", text: "The availability heuristic affects how people judge the ______ of events.", answer: "likelihood" },
      { qn: 36, type: "mcq_single", text: "People tend to overestimate the risk of:", answer: "B", options: ["Heart disease", "Plane crashes", "Car accidents"] },
      { qn: 37, type: "mcq_single", text: "Loss aversion means the pain of losing is about how many times the pleasure of gaining?", answer: "B", options: ["One and a half times", "Twice", "Three times"] },
      { qn: 38, type: "gap_fill", text: "Loss aversion explains why investors hold onto ______ stocks too long.", answer: "losing" },
      { qn: 39, type: "mcq_single", text: "Daniel Kahneman worked with:", answer: "A", options: ["Amos Tversky", "Richard Thaler", "Herbert Simon"] },
      { qn: 40, type: "mcq_single", text: "The lecture is mainly about:", answer: "C", options: ["Financial markets", "Mathematical probability", "The psychology of decision-making"] },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  READING DATA — 3 Passages with question groups, ~13-14 questions each
// ═══════════════════════════════════════════════════════════════════════════

const readingData = [
  {
    passageNumber: 1,
    title: "The Rise of Urban Farming",
    content: `<p>Urban farming—the practice of growing food in cities—has experienced remarkable growth in recent years, driven by concerns about food security, sustainability, and the environmental impact of conventional agriculture. From rooftop gardens in New York to vertical farms in Singapore, city-based food production is transforming the way communities think about their food supply.</p>

<p>The concept is not entirely new. During World War II, "Victory Gardens" were encouraged across the United States and United Kingdom, with urban residents growing vegetables to supplement food rations. However, modern urban farming goes far beyond backyard plots. Today's urban farms incorporate advanced technologies such as hydroponics, aquaponics, and controlled-environment agriculture to maximize yields in minimal space.</p>

<p>One of the primary advantages of urban farming is the reduction in food miles—the distance food travels from farm to consumer. Traditional agriculture often requires transportation across hundreds or even thousands of miles, contributing to greenhouse gas emissions and food spoilage. Urban farms can deliver produce within hours of harvest, ensuring freshness and reducing waste.</p>

<p>Critics argue that urban farming cannot compete with the scale of traditional agriculture. Large-scale grain production, for instance, requires vast tracts of land that cities simply cannot provide. Furthermore, the energy costs associated with indoor growing facilities—particularly lighting and climate control—can be substantial, potentially offsetting some environmental benefits.</p>

<p>Despite these challenges, proponents point to the social benefits of urban farming. Community gardens have been shown to improve mental health, foster social connections, and provide educational opportunities for children. In food deserts—areas with limited access to affordable, nutritious food—urban farms can play a vital role in improving nutrition and reducing health disparities.</p>

<p>Several cities have embraced urban farming through supportive policies. Detroit, once an industrial powerhouse, has converted thousands of vacant lots into productive farmland. Singapore has set a goal of producing 30% of its nutritional needs domestically by 2030, largely through vertical farming technology. These examples suggest that urban farming, while not a complete replacement for traditional agriculture, can be a valuable complement to existing food systems.</p>`,
    wordCount: 310,
    timeLimit: 1200,
    questionGroups: [
      {
        groupNumber: 1,
        type: "tfng",
        instruction: "<p>Do the following statements agree with the information given in the passage? Write <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement contradicts the information, or <strong>NOT GIVEN</strong> if there is no information on this.</p>",
        questions: [
          { qn: 1, text: "Urban farming is an entirely new concept that emerged in the 21st century.", answer: "FALSE" },
          { qn: 2, text: "Victory Gardens were used during World War II to supplement food rations.", answer: "TRUE" },
          { qn: 3, text: "Modern urban farms only use traditional soil-based farming methods.", answer: "FALSE" },
          { qn: 4, text: "Urban farms can deliver produce within hours of harvest.", answer: "TRUE" },
          { qn: 5, text: "The energy costs of indoor growing always outweigh the environmental benefits.", answer: "NOT GIVEN" },
        ],
      },
      {
        groupNumber: 2,
        type: "gap_fill",
        instruction: "<p>Complete the sentences below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>",
        context: `<p>6. The distance food travels from farm to consumer is referred to as food <input type="text" data-question="6" />.</p>
<p>7. Areas with limited access to affordable, nutritious food are called food <input type="text" data-question="7" />.</p>
<p>8. Community gardens have been shown to improve <input type="text" data-question="8" /> health.</p>
<p>9. Singapore aims to produce 30% of its nutritional needs domestically by <input type="text" data-question="9" />.</p>`,
        questions: [
          { qn: 6, text: "The distance food travels from farm to consumer is referred to as food ______.", answer: "miles" },
          { qn: 7, text: "Areas with limited access to affordable, nutritious food are called food ______.", answer: "deserts" },
          { qn: 8, text: "Community gardens have been shown to improve ______ health.", answer: "mental" },
          { qn: 9, text: "Singapore aims to produce 30% of its nutritional needs domestically by ______.", answer: "2030" },
        ],
      },
      {
        groupNumber: 3,
        type: "mcq_single",
        instruction: "<p>Choose the correct letter, <strong>A, B, C, or D</strong>.</p>",
        questions: [
          {
            qn: 10,
            text: "What is mentioned as a criticism of urban farming?",
            answer: "B",
            options: [
              "It is too expensive for consumers",
              "It cannot match the scale of traditional agriculture",
              "It uses too much water",
              "It produces lower quality food",
            ],
          },
          {
            qn: 11,
            text: "Detroit has responded to urban farming by:",
            answer: "C",
            options: [
              "Building new skyscrapers",
              "Importing more food from abroad",
              "Converting vacant lots into farmland",
              "Banning traditional farming",
            ],
          },
          {
            qn: 12,
            text: "According to the passage, urban farming is best described as:",
            answer: "D",
            options: [
              "A replacement for all traditional agriculture",
              "An expensive hobby for urban residents",
              "A temporary trend with no lasting impact",
              "A valuable complement to existing food systems",
            ],
          },
          {
            qn: 13,
            text: "Which technology is NOT mentioned in relation to modern urban farming?",
            answer: "D",
            options: [
              "Hydroponics",
              "Aquaponics",
              "Controlled-environment agriculture",
              "Genetic modification",
            ],
          },
        ],
      },
    ],
  },
  {
    passageNumber: 2,
    title: "The Science of Sleep",
    content: `<p>Sleep, a fundamental biological process, has long been the subject of scientific inquiry. Despite spending roughly a third of our lives asleep, researchers are still uncovering the complex mechanisms that govern this essential activity. Recent advances in neuroscience have shed new light on why we sleep, what happens during sleep, and the consequences of sleep deprivation.</p>

<p>The human sleep cycle consists of several stages, broadly divided into two categories: Non-Rapid Eye Movement (NREM) sleep and Rapid Eye Movement (REM) sleep. NREM sleep is further divided into three stages, each representing progressively deeper levels of sleep. During stage three NREM, also known as slow-wave sleep, the body repairs tissues, builds bone and muscle, and strengthens the immune system. REM sleep, which typically occurs about 90 minutes after falling asleep, is the stage most commonly associated with vivid dreaming.</p>

<p>Professor Matthew Walker, a sleep scientist at the University of California, Berkeley, has described sleep as "the single most effective thing we can do to reset our brain and body health each day." His research has demonstrated that sleep plays a crucial role in memory consolidation—the process by which short-term memories are transferred to long-term storage. Studies have shown that students who get adequate sleep after studying perform significantly better on subsequent tests than those who stay up late cramming.</p>

<p>The consequences of insufficient sleep are far-reaching and well-documented. Chronic sleep deprivation has been linked to an increased risk of cardiovascular disease, obesity, diabetes, and depression. The World Health Organization has classified night-shift work as a probable carcinogen, partly due to the disruption of circadian rhythms—the body's internal clock that regulates sleep-wake cycles.</p>

<p>Despite this growing body of evidence, modern society continues to undervalue sleep. The 24-hour economy, the proliferation of electronic devices, and a culture that often celebrates overwork have contributed to what some researchers call a "global sleep crisis." A survey conducted by the National Sleep Foundation found that approximately 35% of American adults regularly get less than the recommended seven hours of sleep per night.</p>

<p>Addressing this crisis requires both individual and systemic changes. Sleep hygiene practices—such as maintaining a consistent sleep schedule, limiting caffeine intake, and reducing screen time before bed—can help individuals improve their sleep quality. At a societal level, later school start times, flexible work arrangements, and public awareness campaigns have shown promise in promoting healthier sleep habits.</p>`,
    wordCount: 370,
    timeLimit: 1200,
    questionGroups: [
      {
        groupNumber: 1,
        type: "matching_headings",
        instruction: "<p>The reading passage has six paragraphs, <strong>A–F</strong>. Choose the correct heading for each paragraph from the list of headings below.</p>",
        options: [
          "The sleep cycle explained",
          "Individual and societal solutions",
          "Sleep's role in memory",
          "The modern sleep crisis",
          "Why research into sleep matters",
          "Health risks of poor sleep",
          "Historical perspectives on sleep",
          "The stages of wakefulness",
        ],
        questions: [
          { qn: 14, text: "Paragraph A", answer: "Why research into sleep matters" },
          { qn: 15, text: "Paragraph B", answer: "The sleep cycle explained" },
          { qn: 16, text: "Paragraph C", answer: "Sleep's role in memory" },
          { qn: 17, text: "Paragraph D", answer: "Health risks of poor sleep" },
          { qn: 18, text: "Paragraph E", answer: "The modern sleep crisis" },
          { qn: 19, text: "Paragraph F", answer: "Individual and societal solutions" },
        ],
      },
      {
        groupNumber: 2,
        type: "gap_fill",
        instruction: "<p>Complete the summary below. Choose <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> from the passage for each answer.</p>",
        context: `<p>Professor Matthew Walker works at the University of California, <input type="text" data-question="20" />. According to his research, sleep is important for <input type="text" data-question="21" /> consolidation. Chronic sleep deprivation increases the risk of several diseases including <input type="text" data-question="22" /> disease. About <input type="text" data-question="23" /> percent of American adults get less than seven hours of sleep.</p>`,
        questions: [
          { qn: 20, text: "Professor Matthew Walker works at the University of California, ______.", answer: "Berkeley" },
          { qn: 21, text: "Sleep is important for ______ consolidation.", answer: "memory" },
          { qn: 22, text: "Chronic sleep deprivation increases the risk of ______ disease.", answer: "cardiovascular" },
          { qn: 23, text: "About ______ percent of American adults get less than seven hours of sleep.", answer: "35" },
        ],
      },
      {
        groupNumber: 3,
        type: "mcq_single",
        instruction: "<p>Choose the correct letter, <strong>A, B, C, or D</strong>.</p>",
        questions: [
          {
            qn: 24,
            text: "Slow-wave sleep is another name for:",
            answer: "C",
            options: ["REM sleep", "Stage one NREM", "Stage three NREM", "Light sleep"],
          },
          {
            qn: 25,
            text: "REM sleep typically first occurs about how long after falling asleep?",
            answer: "B",
            options: ["60 minutes", "90 minutes", "120 minutes", "45 minutes"],
          },
          {
            qn: 26,
            text: "The WHO has classified night-shift work as a probable carcinogen due to:",
            answer: "A",
            options: [
              "Disruption of circadian rhythms",
              "Exposure to artificial light",
              "Lack of physical exercise",
              "Poor dietary habits",
            ],
          },
          {
            qn: 27,
            text: "Which is NOT mentioned as a sleep hygiene practice?",
            answer: "D",
            options: [
              "Maintaining a consistent sleep schedule",
              "Limiting caffeine intake",
              "Reducing screen time before bed",
              "Taking sleeping pills",
            ],
          },
        ],
      },
    ],
  },
  {
    passageNumber: 3,
    title: "Artificial Intelligence: Promise and Peril",
    content: `<p>Artificial intelligence (AI) has emerged as one of the most transformative technologies of the twenty-first century, with applications ranging from healthcare diagnostics to autonomous vehicles. As AI systems become increasingly sophisticated, the debate over their potential benefits and risks has intensified, drawing contributions from technologists, ethicists, policymakers, and the general public.</p>

<p>The term "artificial intelligence" was first coined by John McCarthy in 1956 at the Dartmouth Conference, where researchers gathered to explore the possibility of creating machines that could "think." Early AI research focused on symbolic reasoning and problem-solving, producing programs that could play chess and prove mathematical theorems. However, progress was slower than expected, leading to periods of reduced funding and interest known as "AI winters."</p>

<p>The current AI revolution is largely driven by advances in machine learning, particularly deep learning—a technique that uses artificial neural networks loosely inspired by the human brain. These networks learn from vast amounts of data, identifying patterns and making predictions with remarkable accuracy. The availability of large datasets, combined with dramatic increases in computing power, has enabled breakthroughs in natural language processing, image recognition, and game playing.</p>

<p>In healthcare, AI systems have demonstrated the ability to detect certain cancers with accuracy comparable to or exceeding that of experienced physicians. Algorithms can analyse medical images, identify drug interactions, and even predict patient outcomes. However, the adoption of AI in clinical settings raises questions about accountability: if an AI system makes an incorrect diagnosis, who bears responsibility—the developer, the hospital, or the physician who relied on the system?</p>

<p>The economic implications of AI are similarly complex. While AI promises to increase productivity and create new industries, it also threatens to displace millions of workers whose jobs can be automated. A 2017 report by McKinsey Global Institute estimated that between 400 million and 800 million jobs worldwide could be automated by 2030. The distribution of these impacts is unlikely to be uniform, with lower-skilled workers and developing nations potentially bearing a disproportionate burden.</p>

<p>Perhaps the most contentious debates concern the long-term trajectory of AI development. Some researchers, including the late Stephen Hawking, have warned that sufficiently advanced AI could pose an existential threat to humanity. Others argue that such concerns are premature and distract from more immediate issues, such as algorithmic bias—the tendency of AI systems to perpetuate or amplify existing social inequalities when trained on biased data.</p>

<p>Regulation of AI remains in its early stages. The European Union has proposed the AI Act, which would classify AI systems by risk level and impose corresponding requirements. In the United States, the approach has been more sector-specific, with agencies developing guidelines for AI use in their particular domains. The challenge for regulators is to encourage innovation while protecting individuals from potential harms—a balance that will require ongoing attention as the technology continues to evolve.</p>`,
    wordCount: 430,
    timeLimit: 1200,
    questionGroups: [
      {
        groupNumber: 1,
        type: "tfng",
        instruction: "<p>Do the following statements agree with the information given in the passage? Write <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement contradicts the information, or <strong>NOT GIVEN</strong> if there is no information on this.</p>",
        questions: [
          { qn: 28, text: "The term 'artificial intelligence' was coined in the 1960s.", answer: "FALSE" },
          { qn: 29, text: "Deep learning uses neural networks inspired by the human brain.", answer: "TRUE" },
          { qn: 30, text: "AI systems have been shown to detect certain cancers as accurately as doctors.", answer: "TRUE" },
          { qn: 31, text: "The McKinsey report was published in 2019.", answer: "FALSE" },
          { qn: 32, text: "Stephen Hawking supported the rapid development of advanced AI.", answer: "FALSE" },
          { qn: 33, text: "China has the most advanced AI regulation in the world.", answer: "NOT GIVEN" },
        ],
      },
      {
        groupNumber: 2,
        type: "gap_fill",
        instruction: "<p>Complete the sentences below. Choose <strong>NO MORE THAN THREE WORDS</strong> from the passage for each answer.</p>",
        context: `<p>34. The current AI revolution is mainly driven by advances in <input type="text" data-question="34" />.</p>
<p>35. Periods of reduced AI funding and interest are called <input type="text" data-question="35" />.</p>
<p>36. The tendency of AI systems to perpetuate social inequalities is known as algorithmic <input type="text" data-question="36" />.</p>
<p>37. The European Union has proposed the <input type="text" data-question="37" /> to regulate artificial intelligence.</p>`,
        questions: [
          { qn: 34, text: "The current AI revolution is driven by advances in ______.", answer: "machine learning" },
          { qn: 35, text: "Periods of reduced funding and interest are called ______.", answer: "AI winters" },
          { qn: 36, text: "The tendency of AI systems to perpetuate inequalities is known as algorithmic ______.", answer: "bias" },
          { qn: 37, text: "The European Union has proposed the ______ to regulate AI.", answer: "AI Act" },
        ],
      },
      {
        groupNumber: 3,
        type: "mcq_single",
        instruction: "<p>Choose the correct letter, <strong>A, B, C, or D</strong>.</p>",
        questions: [
          {
            qn: 38,
            text: "According to the McKinsey report, how many jobs could be automated by 2030?",
            answer: "C",
            options: [
              "100-200 million",
              "200-400 million",
              "400-800 million",
              "Over 1 billion",
            ],
          },
          {
            qn: 39,
            text: "The Dartmouth Conference took place in:",
            answer: "B",
            options: ["1950", "1956", "1960", "1965"],
          },
          {
            qn: 40,
            text: "The passage suggests that AI regulation should:",
            answer: "D",
            options: [
              "Stop all AI development",
              "Focus only on healthcare",
              "Be left entirely to private companies",
              "Balance innovation with individual protection",
            ],
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  WRITING DATA — 2 Tasks (Task 1 Report + Task 2 Essay)
// ═══════════════════════════════════════════════════════════════════════════

const writingData = [
  {
    taskNumber: 1,
    taskType: "report" as const,
    prompt: `The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    minWords: 150,
    timeLimit: 1200,
  },
  {
    taskNumber: 2,
    taskType: "essay" as const,
    prompt: `Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    minWords: 250,
    timeLimit: 2400,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SPEAKING DATA — 3 Parts
// ═══════════════════════════════════════════════════════════════════════════

const speakingData = [
  {
    partNumber: 1,
    topic: "Your Hometown and Daily Routine",
    preparationTime: 0,
    speakingTime: 120,
    questions: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Has your hometown changed much in recent years?",
      "What is your daily routine?",
      "Do you prefer mornings or evenings? Why?",
    ],
  },
  {
    partNumber: 2,
    topic: "Describe a skill you would like to learn",
    preparationTime: 60,
    speakingTime: 120,
    questions: [
      "Describe a skill you would like to learn. You should say: what the skill is, how you would learn it, why you want to learn it, and explain how this skill would be useful to you.",
    ],
  },
  {
    partNumber: 3,
    topic: "Learning and Education in Modern Society",
    preparationTime: 0,
    speakingTime: 180,
    questions: [
      "What skills do you think are most important for young people to learn today?",
      "How has technology changed the way people learn new skills?",
      "Do you think practical skills are more important than academic knowledge?",
      "Should governments invest more in vocational training?",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n🎯 Seeding Full Mock Test into Strapi at ${STRAPI_URL}...\n`);

  // ── 1. Create the Test entry ─────────────────────────────────────────────
  const test = await createEntry("tests", {
    title: "IELTS Full Mock Test 1 — Academic",
    description:
      "A complete IELTS Academic mock test covering all four modules: Listening (40 questions), Reading (40 questions), Writing (2 tasks), and Speaking (3 parts). Simulates real exam conditions with timed sections.",
    difficulty_level: "medium",
    is_published: true,
    is_full_mock_test: true,
    audio_url: "", // You can set a real audio URL here
  });
  const testDocId = test.documentId;
  console.log(`✅ Created test: ${test.title} (${testDocId})\n`);

  // ── 2. Seed Listening Sections + Questions ───────────────────────────────
  console.log("📢 Seeding Listening...");
  for (const section of listeningData) {
    const sectionEntry = await createEntry("listening-sections", {
      test: testDocId,
      section_number: section.sectionNumber,
      transcript: section.transcript,
      time_limit: section.timeLimit,
    });
    console.log(`  ✓ Section ${section.sectionNumber} (${sectionEntry.documentId})`);

    for (const q of section.questions) {
      await createEntry("questions", {
        module_type: "listening",
        listening_section: sectionEntry.documentId,
        question_number: q.qn,
        question_type: q.type,
        question_text: q.text,
        correct_answer: q.answer,
        options: q.options ?? null,
        points: 1,
      });
    }
    console.log(`    ✓ ${section.questions.length} questions created`);
  }
  console.log("");

  // ── 3. Seed Reading Passages + Question Groups + Questions ───────────────
  console.log("📖 Seeding Reading...");
  for (const passage of readingData) {
    const passageEntry = await createEntry("reading-passages", {
      test: testDocId,
      passage_number: passage.passageNumber,
      title: passage.title,
      content: passage.content,
      word_count: passage.wordCount,
      time_limit: passage.timeLimit,
    });
    console.log(`  ✓ Passage ${passage.passageNumber}: "${passage.title}" (${passageEntry.documentId})`);

    for (const group of passage.questionGroups) {
      const groupEntry = await createEntry("question-groups", {
        reading_passage: passageEntry.documentId,
        group_number: group.groupNumber,
        question_type: group.type,
        instruction: group.instruction,
        context: group.context ?? null,
        points: 1,
        options: group.options ?? null,
      });
      console.log(`    ✓ Group ${group.groupNumber} (${group.type})`);

      for (const q of group.questions) {
        await createEntry("questions", {
          module_type: "reading",
          reading_passage: passageEntry.documentId,
          question_group: groupEntry.documentId,
          question_number: q.qn,
          question_type: group.type === "matching_headings" ? "matching_headings" : q.type ?? group.type,
          question_text: q.text,
          correct_answer: q.answer,
          options: q.options ?? null,
          points: 1,
        });
      }
      console.log(`      ✓ ${group.questions.length} questions created`);
    }
  }
  console.log("");

  // ── 4. Seed Writing Tasks ────────────────────────────────────────────────
  console.log("✍️  Seeding Writing...");
  for (const task of writingData) {
    await createEntry("writing-tasks", {
      test: testDocId,
      task_number: task.taskNumber,
      task_type: task.taskType,
      prompt: task.prompt,
      min_words: task.minWords,
      time_limit: task.timeLimit,
    });
    console.log(`  ✓ Task ${task.taskNumber} (${task.taskType})`);
  }
  console.log("");

  // ── 5. Seed Speaking Topics ──────────────────────────────────────────────
  console.log("🎤 Seeding Speaking...");
  for (const topic of speakingData) {
    await createEntry("speaking-topics", {
      test: testDocId,
      part_number: topic.partNumber,
      topic: topic.topic,
      questions: topic.questions,
      preparation_time_seconds: topic.preparationTime,
      speaking_time_seconds: topic.speakingTime,
    });
    console.log(`  ✓ Part ${topic.partNumber}: "${topic.topic}"`);
  }

  console.log(`
════════════════════════════════════════════════════════════
  ✅ Full Mock Test seeded successfully!
  
  Test ID: ${testDocId}
  
  Summary:
    • 4 Listening Sections (40 questions)
    • 3 Reading Passages (40 questions)
    • 2 Writing Tasks
    • 3 Speaking Parts (10 questions)
    
  View at: /dashboard/full-mock-test
════════════════════════════════════════════════════════════
`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
