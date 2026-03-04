-- ============================================
-- Combined Reading Challenge seed
-- Tests: 1354, 1358, 1419, 1544, 1555, 1574, 1665, 1762, 1764, 1771, 1794, 1795, 1796, 1797, 1800, 1801, 1802, 1804, 1862
-- Note: Test 1313 (Reef Fish Study) excluded - already imported
-- Generated: 2026-02-26T11:44:18.533Z
-- ============================================

-- ============================================
-- Auto-generated seed for: Day 3: What makes a musical expert?
-- Source API ID: 1354
-- Generated: 2026-02-26T11:43:23.896Z
-- ============================================

-- ============================================
-- Day 3: What makes a musical expert? - Part 3: What makes a musical expert?
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'ee1c39b2-644c-4c55-bd05-25a4110336fe',
    'Day 3: What makes a musical expert? - Part 3: What makes a musical expert?',
    'Cambridge IELTS - What makes a musical expert?',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    'ee1c39b2-644c-4c55-bd05-25a4110336fe',
    1,
    'What makes a musical expert?',
    'How does someone become expert in music? And is it really possible to have a ‘talent’ for music?

Does that class of people acknowledged to be musical experts just have more of the same basic skills we are all endowed with, or do they have a set of abilities – or neural structures – that are totally different from those of the rest of us? Are high levels of musical achievement simply the result of training and practice, or are they based on innate brain structure – what we refer to as ‘talent’? Talent can be defined as something that originates in genetic structures and that is identifiable by trained people who can recognise its existence before a person has achieved exceptional levels of performance. The emphasis on early identification means that to investigate it, we study the development of skills in children.

It is evident that some children acquire skills more rapidly than others: the age of onset for walking and talking varies widely, even between children in the same household. There may be genetic factors at work, but these are closely linked with other factors – with a presumably environmental component – such as motivation and family dynamics. Similar factors can influence musical development and can mask the contribution of genetics to musical ability.

Brain studies, so far, haven’t been of much use in sorting out the issues. Gottfried Schlaug at Harvard collected brain scans of individuals with absolute pitch (‘AP’) and showed that a region in the brain called the planum temporale is larger in these people than in others. This suggests that the planum is involved in AP, but it’s not clear if it starts out larger in people who eventually acquire AP, or if the acquisition of AP makes the planum increase in size.

Results of research into those areas of the brain involved in skilled motor movement are more conclusive. Studies of violin players have shown that the region of the brain responsible for controlling the movement of the left hand (the hand that requires greater precision in violin playing) increases in size as a result of practice. We do not know yet if the propensity for increase pre-exists in some people, or not.

The evidence against talent comes from research on how much training the experts do. Like experts in mathematics, chess, or sports, experts in music require lengthy periods of instruction and practice. In several studies, the very best music students practiced two to three times as much as others. In another study, students were secretly divided into two groups based on the teachers’ perceptions of their talent, and they were given more challenging tasks and more opportunities; the highest performance ratings had far more to do with the extra instruction they had been assigned to, suggesting that practice does not merely correlate with achievement, but causes it.

Anders Ericsson, at Florida State University, approaches the topic of musical expertise as a general problem in cognitive psychology. He takes as a starting point the assumption that there are certain issues involved in becoming an expert at anything; that we can learn about musical expertise by studying expert chess players, athletes, artists, mathematicians, as well as the musicians themselves. The emerging picture from such studies is that ten thousand hours of practice is required to achieve the level of mastery associated with being a world-class expert – in anything. In study after study, of composers, ice skaters, concert pianists, chess players and master criminals, this number comes up again and again. Someone would do this amount of practice if they practiced, for example, roughly 20 hours a week for ten years. Of course, this does not address why some people do not seem to get anywhere when they practice, and why some people get more out of their practice sessions than others. But no-one has yet found a case in which true world-class expertise was accomplished in less time. It seems that it takes the brain this long to assimilate all that it needs to know to achieve true mastery.

The ten-thousand-hour theory is consistent with what we know about how the brain learns. Learning requires the assimilation and consolidation of information in neural tissue. The more experiences we have with something, the stronger the memory/learning trace for that information becomes. Although people differ in how long it takes them to consolidate information neurally, it remains true that increased practice leads to a greater number of neural traces, which create stronger memory representation.

The classic rebuttal to this theory goes something like this: ‘What about Mozart? I hear that he composed his first symphony at the age of four!’ First, there is a factual error here: Mozart did not write it until he was eight. Still, this is unusual, to say the least. However, this early work received little acclaim and was not performed very often. In fact, the only reason we know about it is because the child who wrote it grew up to become Mozart. And Mozart had an expert teacher in his father, who was renowned as a teacher of musicians all over Europe. We do not know how much Mozart practiced, but if he started at age two and worked thirty-two hours a week (quite possible, given that his father was a stern taskmaster) he would have made his ten thousand hours by the time he composed his first symphony. This does not mean that there are no genetic factors involved in Mozart’s greatness, but that inborn traits may not be the only cause.',
    925,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '5fc57b4f-293f-4322-b179-1f40b6dcf538',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    27,
    'mcq_single',
    'Question 27',
    '["Who is aware of being set apart from other people","Whose brain structure is unlike that of other people","Who can perform extremely well in early childhood","Whose essential skills are more varied that those of ordinary people"]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>","context":"<p>In the first paragraph, the writer suggests that a musician who is talented is someone …</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'be232e8c-cab0-4e87-8358-35d520a68d94',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    31,
    'tfng',
    'Anders Ericsson’s work with cognitive psychology has influenced other researchers.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '66a2db97-e7fb-4f38-ab94-125ef4120869',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    32,
    'tfng',
    'Different areas of expertise seem to have one specific thing in common.',
    NULL,
    'YES',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6fe025f5-be17-453f-b97e-6bdb6d51ad81',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    33,
    'tfng',
    'In order to be useful, practice must be carried out regularly every day.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a0b1d089-653b-406b-81bd-92fd4f901bf2',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    34,
    'tfng',
    'Anyone who practices for long enough can reach the level of a world-class expert.',
    NULL,
    'NO',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dd8a4f15-3cb3-4ca6-8868-40d8f4fdd026',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    35,
    'tfng',
    'Occasionally, someone can become an expert at global level with fewer than 10,000 hours’ practice.',
    NULL,
    'NO',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2b3fea2a-09f6-4be3-9e36-e09203648342',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    36,
    'tfng',
    'Existing knowledge of learning and cognitive skills supports the importance of practice.',
    NULL,
    'YES',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>YES</strong> if the statement agrees with the information given in the text, choose <strong>NO</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1e92da66-250e-45a1-bef0-b00ff4179e2d',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    37,
    'summary_completion',
    'Question 37',
    '["popular","artistic","completed","eight","tuition","encouragement","inherited","four","practice","two"]'::jsonb,
    'tuition',
    NULL,
    1,
    '{"instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Mozart</strong></h3><p>The case of Mozart could be quoted as evidence against the 10,000-hour-practice theory. However, the writer points out that the young Mozart received a lot of  ______ from his father, and that the symphony he wrote at the age of  ______ was not  ______ and may be only of academic interest. The case therefore supports the view that expertise is not solely the result of  ______ characteristics.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f8d4aa0d-9fba-4c88-b894-592f9597579f',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    38,
    'summary_completion',
    'Question 38',
    '["popular","artistic","completed","eight","tuition","encouragement","inherited","four","practice","two"]'::jsonb,
    'eight',
    NULL,
    1,
    '{"instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Mozart</strong></h3><p>The case of Mozart could be quoted as evidence against the 10,000-hour-practice theory. However, the writer points out that the young Mozart received a lot of  ______ from his father, and that the symphony he wrote at the age of  ______ was not  ______ and may be only of academic interest. The case therefore supports the view that expertise is not solely the result of  ______ characteristics.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '18a0a551-24b4-4c47-b768-ed4c37fd7a3a',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    39,
    'summary_completion',
    'Question 39',
    '["popular","artistic","completed","eight","tuition","encouragement","inherited","four","practice","two"]'::jsonb,
    'popular',
    NULL,
    1,
    '{"instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Mozart</strong></h3><p>The case of Mozart could be quoted as evidence against the 10,000-hour-practice theory. However, the writer points out that the young Mozart received a lot of  ______ from his father, and that the symphony he wrote at the age of  ______ was not  ______ and may be only of academic interest. The case therefore supports the view that expertise is not solely the result of  ______ characteristics.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '663d64c7-ea02-4488-ab39-ca87b563ec48',
    'reading',
    'd74f6565-a6eb-411d-9df0-ff67042d2dcc',
    40,
    'summary_completion',
    'Question 40',
    '["popular","artistic","completed","eight","tuition","encouragement","inherited","four","practice","two"]'::jsonb,
    'inherited',
    NULL,
    1,
    '{"instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Mozart</strong></h3><p>The case of Mozart could be quoted as evidence against the 10,000-hour-practice theory. However, the writer points out that the young Mozart received a lot of  ______ from his father, and that the symphony he wrote at the age of  ______ was not  ______ and may be only of academic interest. The case therefore supports the view that expertise is not solely the result of  ______ characteristics.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 4: A Brief History of Humans and Food
-- Source API ID: 1358
-- Generated: 2026-02-26T11:43:26.794Z
-- ============================================

-- ============================================
-- Day 4: A Brief History of Humans and Food - Part 1: A Brief History of Humans and Food
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '31b6da8c-5a74-45a5-9aaf-ff0ce56abdf4',
    'Day 4: A Brief History of Humans and Food - Part 1: A Brief History of Humans and Food',
    'Cambridge IELTS - A Brief History of Humans and Food',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    '31b6da8c-5a74-45a5-9aaf-ff0ce56abdf4',
    1,
    'A Brief History of Humans and Food',
    'During the journey from our hunter-gatherer ancestors to the present day, there have been three seismic changes that have impacted the food we eat: the discovery of cooking, the emergence of agriculture, and the invention of methods of preserving food.

The 19th-century scientist Charles Darwin thought that cooking, after language, was the greatest discovery made by man. All of us eat some raw food, such as fruit and vegetables, but the great majority of food we consume is cooked. Cooking can turn plants that are inedible into edible food by destroying toxic chemicals that plants often manufacture to protect themselves against attack by insects or other herbivorous animals. These toxic chemicals are referred to as "plant secondary compounds" because they are not directly involved in the plant''s normal growth, development, and reproduction, and are produced purely as chemical defenses. They give many of the plants we consume, such as coffee or Brussels sprouts, their bitter taste.

Cooked food is often more digestible because heat breaks down tough cellulose cell walls in plants or tough connective tissue in animals. Chewing raw turnip, a plate of uncooked rice, or a raw leg of lamb is much harder work than eating the cooked equivalent. The energy expended in chewing to break down the tough material is replaced by energy from the fuel used in cooking the food, so the ratio of energy gained to energy expended by the body is greater when food is cooked.

Until the development of agriculture, hunter-gatherers spent up to seven hours a day gathering food. This all began to change around 10,500 years ago with the advent of farming, which led to dramatic changes in human societies. People began to create a variety of new tools to aid survival, and in turn, populations increased in size. These changes led to the possibility of specialization of different tasks within society. Around this time, writing became more sophisticated and allowed people to maintain records of the harvest and taxes. Eventually, formalized structures of government were established as people settled in one area.

The arrival of agriculture meant that, for the first time, our ancestors had more food than they could eat immediately. This, combined with the seasonality of production, led them to discover methods of preserving food: smoking, drying, adding acid by fermentation, or adding salt. These four methods all share one feature in common—they make the food a more hostile environment for bacteria that can cause it to spoil. They also tend to slow down natural chemical reactions in the food that would cause decay.

Although foods today are still preserved in these ancient ways, two more recent methods of preserving food have become more common: canning and freezing. Canning was invented by a Frenchman, Nicholas Appert, in the early 19th century. He sealed food in bottles fabricated from glass and then heated them in boiling water to cook the contents. Appert''s method had great advantages over older methods of food preservation: it could be applied to a wide range of foods, and the flavor and texture were similar to freshly cooked products. His idea was soon copied by an Englishman, Peter Durand. Until this point, containers had been too heavy to be widely used, but Durand produced the first ones which were lightweight and resistant to damage. Two years later, in 1812, two Englishmen, Bryan Donkin and John Hall, started the commercial canning of food, although the real rise in popularity of canning had to wait until the invention of the can opener in 1855. Until then, cans were opened with a chisel and hammer. Canning is an extremely effective way of preserving food: one can containing meat, dating back to 1824, was opened in 1939, and the contents were still in good condition.

In the 21st century, the dominance of canning as a method of food preservation has been overtaken by freezing. Chilling food to keep it fresh is an old idea. The earliest mentions of icehouses, thick-walled buildings, half underground, date back to 1700 BC in northwest Iran. In early 16th-century Italy, water was mixed with chemicals to lower its freezing point to -18 degrees Celsius. Several centuries later, frozen fish and other goods were transported by ship from Australia to England. However, the modern frozen food industry was started in the 1920s by an American, Clarence Birdseye. While on a fishing trip with the Inuit in the Canadian Arctic, Birdseye observed that rapid freezing creates smaller ice crystals and therefore causes less damage to food—a discovery he had not expected. Nevertheless, the major growth in demand for frozen food came with the arrival of freezers in ordinary people’s homes. The advantages of frozen over canned food include the fact that the flavor and consistency are often identical to the fresh product, and freezing can be used to preserve a wide variety of foods.',
    808,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0a41782b-d8b8-4f39-ad48-87f667b8fa59',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    1,
    'tfng',
    'According to Darwin, cooking was the most significant development in human history.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b41ef26a-f804-4dfe-90c0-ac937e66df5b',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    2,
    'tfng',
    'The process of cooking gets rid of some plant poisons.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bae4609d-9638-42d8-b165-3b62ec67cfbe',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    3,
    'tfng',
    'Eating cooked food is more energy efficient than eating raw food.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4e15e21c-4966-4c51-bdf1-92a4c6847c3e',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    4,
    'tfng',
    'Clarence Birdseye had previously worked in the Australian food industry.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '02bd501d-e9bf-4a8e-b749-7c80d115629f',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    5,
    'tfng',
    'Birdseye’s trip with the Inuit confirmed what he already believed about rapid freezing.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '77e1314d-56f7-476e-9fee-732485674ea0',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    6,
    'gap_fill',
    'Question 6',
    NULL,
    'populations',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '40f5fcfd-56a3-4eba-8ee2-42c905c931f5',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    7,
    'gap_fill',
    'Question 7',
    NULL,
    'records',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e84773a1-9f9e-4008-bdc9-a1ef26dc703f',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    8,
    'gap_fill',
    'Question 8',
    NULL,
    'salt',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '32ac4371-b664-4c68-ac62-96ef7d363301',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    9,
    'gap_fill',
    'Question 9',
    NULL,
    'glass',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4d6cbf6a-3edc-42a4-b50a-dfe307bcfbb2',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    10,
    'gap_fill',
    'Question 10',
    NULL,
    'texture',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '62f7f0b8-93ca-4073-880f-d0326b1573d1',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    11,
    'gap_fill',
    'Question 11',
    NULL,
    'lightweight',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0336e9f1-f475-458d-90c6-ce8fb6839b4a',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    12,
    'gap_fill',
    'Question 12',
    NULL,
    'chisel',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2e283df2-0cc6-416b-b1ea-c3ceabd7e907',
    'reading',
    '628ffd58-3998-41c2-8455-cc71521c55ec',
    13,
    'gap_fill',
    'Question 13',
    NULL,
    'meat',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the notes below.</strong></p><p>Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>","context":"<h3><strong>The development of agriculture and food preservation</strong></h3><p><strong>The changes agriculture brought about were:</strong></p><ul><li>The development of equipment and larger&nbsp; ______ .</li><li>The ability to keep&nbsp; ______ &nbsp;as writing developed.</li><li>The setting up of organized government.</li></ul><p><strong>Food preservation</strong></p><p>• early methods of food preservation included: smoking, drying and combining food with acid or  ______ .</p><p><strong>Canning</strong></p><ul><li>Nicholas Appert put food into containers made of  ______ .</li><li>Appert''s method resulted in preserved food with the same taste and&nbsp; ______ &nbsp;as fresh food.</li><li>Peter Durand introduced cans which had the advantage of being&nbsp; ______ &nbsp;and hard to break.</li><li>In 1855, the metal can opener replaced the&nbsp; ______ &nbsp;which had been used with a hammer to open cans.</li><li>Some food was still edible after more than 100 years, e.g., an old can of&nbsp; ______ .</li></ul>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 5: Photovoltaics
-- Source API ID: 1419
-- Generated: 2026-02-26T11:43:29.639Z
-- ============================================

-- ============================================
-- Day 5: Photovoltaics - Part 2: Photovoltaics
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '801e7fef-f1cd-4fbd-96c8-919f7c1c776d',
    'Day 5: Photovoltaics - Part 2: Photovoltaics',
    'Cambridge IELTS - Photovoltaics',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    '801e7fef-f1cd-4fbd-96c8-919f7c1c776d',
    1,
    'Photovoltaics',
    'Residential use of photovoltaics – by day excess power is sent to the grid, and by night power is supplied to the home.

A 
In the past, urban home owners have not always had much choice in the way electricity is supplied to their homes. Now, however, there is a choice, and a rapidly increasing number of households worldwide are choosing the solar energy option. Solar energy, the conversion of sunlight into energy, is made possible through the use of ‘photovoltaics’, which are simple appliances that fit onto the roof of a house.

B 
The photovoltaic-powered home remains connected to the power lines, but no storage is required on-site, only a box of electronics (the inverter) to interface between the photovoltaics and the grid network. Figure 1 illustrates the system. During the day, when the home may not be using much electricity, excess power from the solar array is fed back to the grid, to factories offices that need daytime power. At night, power flows the opposite way. The grid network effectively provides storage. If the demand for electricity is well matched to when the sun shines, solar energy is especially valuable. This occurs in places like California in the US and Japan, where air-conditioning loads for offices and factories are large but heating loads for the home are small.

C 
The first systematic exploration of the use of photovoltaics on homes began in the US during the 1970s, a well-conceived program started with the siting of a number of ‘residential experiment stations’ at selected locations around the country, representing different climatic zones. These stations contained a number of ‘dummy’ houses, each with a different solar-energy system design. Homes within the communities close to these stations were monitored to see how well their energy use matched the energy generated by the stations’ dummy roofs. A change in US government priorities in the early 1980s halted this program.

D 
With the US effort dropping away, the Japanese Sunshine Project came to the fore. A large residential test station was installed on Rokko Island beginning in 1986. This installation consists of 18 ‘dummy’ house, each equipped with its own 2-5 kilowatt photovoltaic system (about 20-50 square metres for each system). For the other systems, electronics simulate these household loads. This test station has allowed the technical issues involved in using photovoltaics within the electricity network to be explored in a systematic way, under well-controlled test conditions. With no insurmountable problems identified, the Japanese have used the experience gained from this station to begin their own massive residential photovoltaics campaign.

E 
Meanwhile, Germany began a very important ‘1000 roof program’ in 1990, aimed at installing photovoltaics on the roofs of 1000 private homes. Large federal and regional government subsidies were involved, accounting in most cases for 70 per cent of the total system costs. The program proved immensely popular, forcing its extension to over 2000 homes scattered across Germany. The success of this program stimulated other European countries to launch similar programs.

F 
Japan’s ‘one million roof program’ was prompted by the experience gained in the Rokko Island test site and success of the German 1000 roof program. The initially quoted aims of the Japanese New Energy Development Organisation were to have 70,000 homes equipped with photovoltaics by the year 2000, on the way to one million by 2020. The program made a modest start in 1994, when 539 systems were installed with a government subsidy of 50 per cent. Under this program, entire new suburban developments are using photovoltaics.

G 
The Japanese initiative in embracing residential photovoltaics on a large scale prompted responses in both Europe and the US. The European Commission has called for one million solar residential systems before the year 2010, with 500,000 in Europe and 500,000 in the developing world, to be subsidised by the Commission. In 1997, a similar one million roof target was announced in the US. Since then, several other countries including Germany, Italy, the Netherlands and Australia, have announced their own targets for residential photovoltaics.

H 
This is good news, not only for the photovoltaic industry, but for everyone concerned with the environment. The use of fossil fuels to generate electricity is not only costly in financial terms, but also in terms of environmental damage. Gases produced by the burning of fossil fuels in the production of electricity are a major contributor to the greenhouse effect. To deal with this problem, many governments are now proposing stringent targets on the amount of greenhouse gas emissions permitted. These targets mean that all sources of greenhouse gas emissions, including residential electricity use, will receive closer attention in the future.

I 
It is likely that, in the future, governments will develop building codes that attempt to constrain the energy demands of new housing. For example, the use of photovoltaics or the equivalent may be stipulated to lessen demands on the grid network and hence reduce fossil fuel emissions. Approvals for building renovations may also be conditional upon talking such energy-saving measures. If this were to happen, everyone would benefit. Although there is an initial cost in attaching the system to the rooftop, the householder’s outlay is soon compensated with the savings on energy bills. In addition, everyone living on the planet stands to gain from the more benign environmental impact.',
    883,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9b0cbc87-123b-4437-8421-8d12841b4f16',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    14,
    'matching_info',
    'Examples of countries where electricity use is greater during the day than at night',
    '["","","","","","","","",""]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9c6f8373-ddd0-4b0b-bc9d-78fcd68bbc74',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    15,
    'matching_info',
    'A detailed description of an experiment that led to photovoltaics being promoted throughout the country',
    '["","","","","","","","",""]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a7d6c412-05a0-4a58-b695-1bb1648a61dc',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    16,
    'matching_info',
    'The negative effects of using conventional means of generating electricity',
    '["","","","","","","","",""]'::jsonb,
    'H',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9264ac50-fe10-4243-af63-2024fb42a321',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    17,
    'matching_info',
    'An explanation of the photovoltaic system',
    '["","","","","","","","",""]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0c7c97a7-a422-44a5-9ea3-d993cbc71860',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    18,
    'matching_info',
    'The long-term benefits of using photovoltaics',
    '["","","","","","","","",""]'::jsonb,
    'I',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bf378e04-97b7-4815-ab91-01b88e9b1408',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    19,
    'matching_info',
    'A reference to wealthy countries being prepared to help less wealthy countries have access to photovoltaics',
    '["","","","","","","","",""]'::jsonb,
    'G',
    NULL,
    1,
    '{"instruction":"<p>The text has nine paragraphs, A-I. Which paragraph contains the following information?</p><p><strong>NB</strong> <em>You may choose any paragraph more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd71258b2-bda6-4078-a134-3d0418980516',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    20,
    'tfng',
    'Photovoltaics are used to store electricity.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bbb7016d-4809-4c1c-b5e1-0a57d041e85c',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    21,
    'tfng',
    'Since the 1970s, the US government has provided continuous support for the use of photovoltaics on homes.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f479f6b7-349f-4083-a50f-78ce828db6b9',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    22,
    'tfng',
    'The solar-powered houses on Rokko Island are uninhabited.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c3ff95b6-3aa7-4efa-b7bc-916990ba3fb4',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    23,
    'tfng',
    'In 1994, the Japanese government was providing half the money required for installing photovoltaics on homes.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '89c1ca87-81da-4eaf-be88-05e34e91586f',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    24,
    'tfng',
    'Germany, Italy, the Netherlands and Australia all have strict goals with regard to greenhouse gas emissions.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0c10d8f3-ad8d-4090-88cd-58fc1bd54dbf',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    25,
    'tfng',
    'Residential electricity use is the major source of greenhouse gas emissions.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4f6a89b1-da69-42a0-8b3c-71ebc5334419',
    'reading',
    '65f240bb-0d09-4388-b855-eb1cde0a02d2',
    26,
    'tfng',
    'Energy-saving measures must now be included in the design of all new homes and improvements to buildings.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FAL<span class=\"ql-cursor\">﻿</span>SE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 7: Wood: a valuable resource in New Zealand's economy
-- Source API ID: 1544
-- Generated: 2026-02-26T11:43:32.546Z
-- ============================================

-- ============================================
-- Day 7: Wood: a valuable resource in New Zealand's economy - Part 1: Wood: a valuable resource in New Zealand's economy
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '6d27963c-dfef-4b21-a501-340b23ee0763',
    'Day 7: Wood: a valuable resource in New Zealand''s economy - Part 1: Wood: a valuable resource in New Zealand''s economy',
    'Cambridge IELTS - Wood: a valuable resource in New Zealand''s economy',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    '6d27963c-dfef-4b21-a501-340b23ee0763',
    1,
    'Wood: a valuable resource in New Zealand''s economy',
    'During the settlement of New Zealand by European immigrants, natural timbers played a major role. Wood was easily accessible and relatively cheap. A tradition of wooden houses arose, supported by the recognition that they were less likely to collapse suddenly during earthquakes, a not infrequent event in this part of the world. But in addition to demand from the domestic market, there was also a demand for forest products from overseas.

Early explorers recognised the suitability of the tall, straight trunks of the kauri for constructing sailing vessels. The kauri is a species of coniferous tree found only in small areas of the southern hemisphere. So from the early 1800s, huge amounts of this type of wood were sold to Australia and the UK for that purpose. For a period, the forestry industry was the country’s major export earner, but the rate of harvest was unsustainable and, by the beginning of the 20th century, indigenous timber exports were rapidly declining.

From the 1940s, newly established plantations of an imported species of tree called radiata pine supplied timber and other wood products in increasing quantities. By the 1960s, plantation-grown timber was providing most of the country’s sawn timber needs, especially for construction. Today, less than two percent of timber is cut from indigenous forests, and almost all of that is used for higher-value end uses, such as furniture and fittings. As the pine industry developed, it became apparent that this type of wood was also well suited for many uses. It makes excellent pulp*, and is frequently used for posts, poles, furnishings and mouldings, particleboard, fibreboard, and for plywood and ''engineered'' wood products. Pine by-products are used in the chemical and pharmaceutical industries and residues are consumed for fuel. This amazing versatility has encouraged the development of an integrated forest-products industry which is almost unique in the world.

Exporters of wood products have largely targeted the rapidly growing markets of South and East Asia and Australia. 80 percent of exports by value go to only five markets: Japan, Korea, China, the United States and Australia. The product mix remains heavily based on raw materials, with logs, sawn wood, pulp and paper comprising 75 percent of export value. However, finished wood products such as panels and furniture components are exported to more than 50 countries.

In New Zealand itself, the construction industry is the principal user of solid wood products, servicing around 20,000 new house starts annually. However, the small size of New Zealand’s population (just over four million), plus its small manufacturing and remanufacturing base, limit the forestry industry’s domestic opportunities. For the last few years local wood consumption has been around only four million cubic metres. Accordingly, the development of the export market is the key to the industry’s growth and contribution to the national economy in decades to come.

In 2004, forestry export receipts were about 11 percent of the country’s total export income, their value having increased steadily for ten years, until affected by the exchange fluctuations and shipping costs of recent years. The forestry industry is New Zealand’s third largest export sector, generating around $3.3 billion annually from logs and processed wood products. But it is generally agreed that it is operating well below its capacity and, with the domestic market already at its peak, almost all of the extra wood produced in future will have to be marketed overseas. That presents a major marketing challenge for the industry.

Although the export of logs will continue to provide valuable earnings for forest owners, there is broad acceptance that the industry must be based on value-added products in future. So the industry is investigating various processing, infrastructure and investment strategies with a view to increasing the level of local manufacturing before export. The keys to future success will depend on a variety of factors: better international marketing, product innovation, internationally competitive processing, better infrastructure and a suitable political, regulatory and investment environment. The industry claims that, given the right conditions, by 2025 the forestry sector could be the country’s biggest export earner, generating $20 billion a year and employing 60,000 people.

One competitive advantage that New Zealand has is its ability to source large quantities of softwood from renewable forests. Consumers in several key wood markets are becoming more worried about sustainability, and the industry is supporting the development of national standards as well as the recognition of these internationally. However, New Zealand is not the only country with a plantation-style forestry industry. Chile, Brazil, Argentina, South Africa and Australia all have extensive plantings of fast-growing species (hardwood and softwood), and in the northern hemisphere, Scandinavian countries have all expanded their forests or controlled their use in the interests of future production.

Finally, in addition to competition from other wood producers, New Zealand faces competition from goods such as wood substitutes. These include steel framing for houses. This further underlines the necessity for globally competitive production and marketing strategies.

pulp*: wood which is crushed until soft enough to form the basis of paper.',
    835,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4b2865d6-6a2d-4b08-80f7-410281410fc3',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    1,
    'tfng',
    'Settlers realised that wooden houses were more dangerous than other types of structure.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '5a0bb988-d3f2-400a-8162-424f44b0f061',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    2,
    'tfng',
    'During the 1800s, New Zealand exported wood for use in boat-building.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '300dbd4b-7321-4553-9252-772a1c5a2d7d',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    3,
    'tfng',
    'Plantation-grown wood is generally better for construction than native forest wood.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4caa3463-d701-4d31-bd47-62e08d1a1f84',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    4,
    'tfng',
    'Compared to other types of wood, pine has a narrow range of uses.',
    NULL,
    'FALSE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a8f63788-927b-4cfc-970e-529fb9164734',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    5,
    'tfng',
    'Demand for housing in New Zealand is predicted to fall in the next few years.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e76af9f9-b97b-468d-b9a3-86985c51f8ec',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    6,
    'tfng',
    'In future, the expansion of New Zealand''s wood industry will depend on its exports.',
    NULL,
    'TRUE',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f33becbb-1ed3-4fa0-8083-9650a56fd888',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    7,
    'gap_fill',
    'Question 7',
    NULL,
    'shipping costs',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c3e6c141-7ae8-48a4-b3df-f492cb3b7872',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    8,
    'gap_fill',
    'Question 8',
    NULL,
    'export sector',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b8f25045-dc82-4702-82b5-0a654a6bc846',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    9,
    'gap_fill',
    'Question 9',
    NULL,
    '60,000',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8551f99c-1d06-43c4-937f-0a93005cc4ae',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    10,
    'gap_fill',
    'Question 10',
    NULL,
    'softwood',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '45b41846-b656-44ce-b0c1-359b667af3ae',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    11,
    'gap_fill',
    'Question 11',
    NULL,
    'sustainability',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c558f913-7bbd-49cb-a008-dbf3bcb98646',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    12,
    'gap_fill',
    'Question 12',
    NULL,
    'Scandinavian countries',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ca56c861-c390-4029-9ee8-87381f6fb861',
    'reading',
    '6f841de5-4d05-47da-bb5c-88e94d66fe6e',
    13,
    'gap_fill',
    'Question 13',
    NULL,
    'wood substitutes',
    NULL,
    1,
    '{"instruction":"<p>Answer the questions below. Write&nbsp;<strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>&nbsp;from the passage for each answer.</p>","context":"<p>Apart from exchange rates, which factor has had a negative impact on New Zealand''s forestry exports?  </p><p>______ </p><p>Which part of New Zealand''s economy does the forestry industry rank third in?  </p><p>______ </p><p>According to the New Zealand forestry industry, what could be the size of its workforce by 2025?  </p><p>______ </p><p>What kind of timber product is available in large amounts from renewable forests in New Zealand?  </p><p>______ </p><p>Which aspect of timber production are New Zealand''s main customers increasingly concerned about?</p><p> ______ </p><p>Outside the southern hemisphere, who are New Zealand forestry''s main competitors?</p><p> ______ </p><p>Which group of products is New Zealand''s forestry industry now having to compete with?</p><p> ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 2: Will Eating Less Make You Live Longer?
-- Source API ID: 1555
-- Generated: 2026-02-26T11:43:35.448Z
-- ============================================

-- ============================================
-- Day 2: Will Eating Less Make You Live Longer? - Part 2: Will Eating Less Make You Live Longer?
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '3f0a6207-814b-47e1-9648-425479fc94ac',
    'Day 2: Will Eating Less Make You Live Longer? - Part 2: Will Eating Less Make You Live Longer?',
    'Cambridge IELTS - Will Eating Less Make You Live Longer?',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    '3f0a6207-814b-47e1-9648-425479fc94ac',
    1,
    'Will Eating Less Make You Live Longer?',
    'The latest in a conflicting series of studies suggests calorie restriction could potentially slow ageing in humans

A 
Calorie restriction, or ‘semi-starvation’ as some refer to it, has been proven to extend lifespan in many living organisms from yeast to mice, but the picture for primates, including humans, is not so clear. Research published by a team at the University of Wisconsin in the United States shows that rhesus monkeys also live longer on a calorie-restricted diet. But those findings disagree with research by the National Institute on Aging (NIA) in Maryland, also in the United States. Rozalyn Anderson, of the Wisconsin team, says the research is not intended as a recommendation of calorie restriction. ‘I find the idea monumentally unattractive!’ she says. ‘We study it because it is so effective at delaying ageing and the onset of age-related disease. It’s a way to tease out what it is that creates increased disease vulnerability as a function of age.’

B 
Both groups started long-term trials on rhesus monkeys in the late 1980s to determine whether calorie restriction would extend the lifespan of primates. In mice, many experiments had come to the same finding: feed them a diet with 30% fewer calories and see a lifespan extension of 40%. The monkey trials were set up in a similar way: researchers took the calorie content of a standard monkey diet, cut it by 30% (while continuing to supply all essential nutrients) and monitored whether those monkeys lived longer, healthier lives than those on the standard diet.

C 
In 2009, with the monkeys approaching old age, preliminary findings of the two trials started coming in. For the Wisconsin monkeys, calorie restriction seemed to be working. Compared to well-fed control animals, the lean monkeys were living longer and suffering less from the diseases of ageing: diabetes, heart disease, and brain diseases. However, in 2012 the NIA results emerged with a dramatically different conclusion: their monkeys were not living any longer than the controls, although they were healthier.

D 
The Wisconsin group’s latest results confirm that their calorie-restricted monkeys are living longer than the controls. They also offer a possible explanation of why the two groups’ findings don’t agree, and that lies in the treatment of the control group. The Wisconsin study began with monkeys in early adulthood. Initially, all the monkeys were allowed to eat as much as they liked. A few months into the trial, the monkeys were placed into one of two groups: the controls (who continued to be fed as much as they wished) and the calorie-restricted monkeys (who were given an individualised diet of 30% less than they were previously eating).

E 
The NIA study differed in two ways. First, the control group of monkeys were not allowed to eat as much as they wished. They were given a diet considered to represent a normal calorie count, while the calorie-restricted monkeys were fed 30% less than that. Second, whereas the Wisconsin monkeys were given highly processed food high in sucrose, making it easy to standardize, the NIA diet was based on whole grains, fish oils, and was very low in sugar. These different settings for the normal control diet may provide an explanation of why the two groups showed different results.

F 
The Wisconsin group may in effect have studied the effects of ‘overeating’. Their control animals weighed up to 10% more than average for their age and gender. Compared to them, the calorie-restricted animals not only suffered fewer diseases, they lived longer. Julie Mattison, head of the NIA study, observes that an overweight person who goes to a fast food restaurant every day will obviously benefit if their calories are cut back by 30%.

G 
The NIA study fed their control monkeys what they considered a ‘standard’ caloric intake and saw that longevity for monkeys that were fed 30% less was the same. But in Anderson’s view, the NIA control monkeys were not fed enough; the NIA was calorie restricting both groups of animals. Their older female control monkeys, for example, weighed nearly 20% less than the national average. Indeed, Anderson points out that several of the NIA control monkeys have lived past the age of 40, far exceeding the 27-year average lifespan for captive rhesus monkeys. ‘That’s the maximum lifespan ever detected for the species, so the idea that their intervention is doing nothing is really at odds with the data,’ says Anderson.

H 
However, neither group had the right notion of a standard diet according to Leonie Heilbronn, who researches calorie restriction and healthy ageing at the University of Adelaide in Australia. Heilbronn points out that the NIA controls were a very healthy set of monkeys and leaner than a control monkey should be. On the other hand, she notes, the Wisconsin controls were a little bigger than they had to be. On balance, Heilbronn agrees with the Wisconsin researcher’s argument. ‘I think these studies suggest calorie restriction definitely will increase lifespan,’ she says.

I 
Both studies agree that cutting calories is beneficial to health — in both cases the calorie-restricted monkeys had fewer diseases related to ageing. As to the question of whether calorie restriction extends lifespan in primates, Anderson and Mattison are currently working together to compare the two studies’ raw data. They plan to co-publish a joint analysis. The current data conflict will ultimately provide deeper insights into ageing, Anderson predicts. ‘The fact the two studies were set up differently, asking the same question in different ways — I think we will gain maximally from that.’',
    922,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d5655f4-230c-49b1-b571-437e07a8c0b2',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    14,
    'matching_info',
    'A reference to studies based on the same level of calorie reduction with different animals',
    '["","","","","","","","",""]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3fcee1b8-9fdf-4b55-9d44-f18d80315c25',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    15,
    'matching_info',
    'A comment that some control monkeys in one study reached an older age than normal for animals of their kind',
    '["","","","","","","","",""]'::jsonb,
    'G',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '796f74f0-e890-4f29-9e3b-3906d013bd53',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    16,
    'matching_info',
    'Distinctions between the types of food in each study that may have led to a contrast in findings',
    '["","","","","","","","",""]'::jsonb,
    'E',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e028987b-b8fa-48ee-94a8-804c610fae4f',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    17,
    'matching_info',
    'Examples of health problems which monkeys on calorie-restricted diets were less likely to get',
    '["","","","","","","","",""]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd25b8e49-3c85-44eb-a355-c3102057ebd2',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    18,
    'matching_info',
    'A researcher’s negative opinion of a calorie-restricted diet',
    '["","","","","","","","",""]'::jsonb,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4ea4de2d-8aba-40b6-abca-0fd02edd5eae',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    19,
    'matching_info',
    'A reference to the stage in the monkeys’ lives at which research commenced in one study',
    '["","","","","","","","",""]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>Reading Passage 2 has nine paragraphs,&nbsp;A–I.</p><p>Which paragraph contains the following information?</p><p>Choose the correct letter,&nbsp;A–I, in boxes&nbsp;14–19&nbsp;on your answer sheet.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '67e44d10-89ba-4991-8018-9402c92c3fdf',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    20,
    'matching_info',
    'It is good that the two studies took dissimilar approaches.',
    '["Rozalyn Anderson","Julie Mattison","Leonie Heilbronn"]'::jsonb,
    'A',
    NULL,
    1,
    '{"fromPassage":"\n","instruction":"<p><strong>Look at the following statements (Questions 20–23) and the list of researchers below.</strong></p><p><strong>Match each statement with the correct researcher,&nbsp;A, B&nbsp;or&nbsp;C.</strong></p><p><strong><em>NB:&nbsp;You may use any letter more than once.</em></strong></p>","context":"<h3><strong>List of Researchers</strong></h3><p><strong>A. Rozalyn Anderson</strong></p><p><strong>B. Julie Mattison</strong></p><p><strong>C. Leonie Heilbronn</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6e434190-f696-4fc5-bfbf-9448537f94a3',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    21,
    'matching_info',
    'Neither study used diets that are typical for monkeys.',
    '["Rozalyn Anderson","Julie Mattison","Leonie Heilbronn"]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p><strong>Look at the following statements (Questions 20–23) and the list of researchers below.</strong></p><p><strong>Match each statement with the correct researcher,&nbsp;A, B&nbsp;or&nbsp;C.</strong></p><p><strong><em>NB:&nbsp;You may use any letter more than once.</em></strong></p>","context":"<h3><strong>List of Researchers</strong></h3><p><strong>A. Rozalyn Anderson</strong></p><p><strong>B. Julie Mattison</strong></p><p><strong>C. Leonie Heilbronn</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e71922af-1977-4acd-bc41-9b3d5e80db5b',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    22,
    'matching_info',
    'Calorie restriction is a method of finding out about health issues connected with ageing.',
    '["Rozalyn Anderson","Julie Mattison","Leonie Heilbronn"]'::jsonb,
    'A',
    NULL,
    1,
    '{"instruction":"<p><strong>Look at the following statements (Questions 20–23) and the list of researchers below.</strong></p><p><strong>Match each statement with the correct researcher,&nbsp;A, B&nbsp;or&nbsp;C.</strong></p><p><strong><em>NB:&nbsp;You may use any letter more than once.</em></strong></p>","context":"<h3><strong>List of Researchers</strong></h3><p><strong>A. Rozalyn Anderson</strong></p><p><strong>B. Julie Mattison</strong></p><p><strong>C. Leonie Heilbronn</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c4d9c3f1-f034-42a8-af51-c35e2b271dc7',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    23,
    'matching_info',
    'Calorie reduction will have a positive effect on people who have unhealthy diets.',
    '["Rozalyn Anderson","Julie Mattison","Leonie Heilbronn"]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p><strong>Look at the following statements (Questions 20–23) and the list of researchers below.</strong></p><p><strong>Match each statement with the correct researcher,&nbsp;A, B&nbsp;or&nbsp;C.</strong></p><p><strong><em>NB:&nbsp;You may use any letter more than once.</em></strong></p>","context":"<h3><strong>List of Researchers</strong></h3><p><strong>A. Rozalyn Anderson</strong></p><p><strong>B. Julie Mattison</strong></p><p><strong>C. Leonie Heilbronn</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4deff7ac-ad4b-4042-a7f7-91846d54bfe6',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    24,
    'summary_completion',
    'Question 24',
    NULL,
    'ageing',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the summary below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p><p><strong><em>Write your answers in boxes&nbsp;24–26&nbsp;on your answer sheet.</em></strong></p><p><br></p>","context":"<h3>Agreement between the two studies on calorie restriction in rhesus monkeys</h3><p>The two studies were in agreement that it is beneficial to cut calories, in terms of health. Monkeys whose calories were restricted suffered fewer diseases that are associated with the&nbsp;<strong> ______ </strong>&nbsp;&nbsp;process. Anderson and Mattison have undertaken research to determine if a calorie-restricted diet increases primates’&nbsp; ______ &nbsp;. Although there is a&nbsp; ______ &nbsp;&nbsp;between the two sets of data, Anderson believes they will help researchers reach a better understanding.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '76f25697-dc72-46f3-a608-e9d03830dd12',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    25,
    'summary_completion',
    'Question 25',
    NULL,
    'lifespan',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the summary below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p><p><strong><em>Write your answers in boxes&nbsp;24–26&nbsp;on your answer sheet.</em></strong></p><p><br></p>","context":"<h3>Agreement between the two studies on calorie restriction in rhesus monkeys</h3><p>The two studies were in agreement that it is beneficial to cut calories, in terms of health. Monkeys whose calories were restricted suffered fewer diseases that are associated with the&nbsp;<strong> ______ </strong>&nbsp;&nbsp;process. Anderson and Mattison have undertaken research to determine if a calorie-restricted diet increases primates’&nbsp; ______ &nbsp;. Although there is a&nbsp; ______ &nbsp;&nbsp;between the two sets of data, Anderson believes they will help researchers reach a better understanding.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '41f4f5ed-8bee-470a-9507-5ea20c2aca63',
    'reading',
    '576553d8-ed9b-48be-8ce6-89b4608954e9',
    26,
    'summary_completion',
    'Question 26',
    NULL,
    'conflict',
    NULL,
    1,
    '{"instruction":"<p><strong>Complete the summary below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p><p><strong><em>Write your answers in boxes&nbsp;24–26&nbsp;on your answer sheet.</em></strong></p><p><br></p>","context":"<h3>Agreement between the two studies on calorie restriction in rhesus monkeys</h3><p>The two studies were in agreement that it is beneficial to cut calories, in terms of health. Monkeys whose calories were restricted suffered fewer diseases that are associated with the&nbsp;<strong> ______ </strong>&nbsp;&nbsp;process. Anderson and Mattison have undertaken research to determine if a calorie-restricted diet increases primates’&nbsp; ______ &nbsp;. Although there is a&nbsp; ______ &nbsp;&nbsp;between the two sets of data, Anderson believes they will help researchers reach a better understanding.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 8: Intelligent behaviour in birds
-- Source API ID: 1574
-- Generated: 2026-02-26T11:43:38.402Z
-- ============================================

-- ============================================
-- Day 8: Intelligent behaviour in birds - Part 2: Intelligent behaviour in birds
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '1bcb20cc-c9b1-4af6-b524-d3d5ed289add',
    'Day 8: Intelligent behaviour in birds - Part 2: Intelligent behaviour in birds',
    'Cambridge IELTS - Intelligent behaviour in birds',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    '1bcb20cc-c9b1-4af6-b524-d3d5ed289add',
    1,
    'Intelligent behaviour in birds',
    ' 
[HEADING: A]
Many people are aware of the intelligence of chimpanzees and other mammals. However, birds also demonstrate intelligent behaviour. For centuries, many scholars maintained that humans were the only intelligent organism on Earth. Many traits were considered to be exclusively human examples of acumen – for example, language, tool use, deception, awareness of self and others. However, exciting new research on a number of animals, particularly birds, has called into question using uniqueness of these traits, forcing us to reconsider this opinion.
 
[HEADING: B]
In 1964, people were amazed when naturalist Jane Goodall first discovered chimpanzees making and using tools. But ornithologists, people who study birds, were not overly surprised. Almost 20 years earlier, a renowned ornithologist had shown that tool use was commonplace in populations of woodpecker finches residing on the Galápagos Islands. These tiny birds routinely used twigs to extract grubs from under bark. Since then, the catalogue of tool-using animals has grown. At least three Australian bird species make tools similar to those of the woodpecker finch, and when white-winged choughs come across shellfish they have been known to use rocks as hammers to crack open the recalcitrant shells. Other birds show a more sophisticated level of insight. For example, black kites have been reported dropping bait into lakes to bring fish to the surface of the water, thereby making them easier to catch. A kite may also pick up a smouldering stick from an area recently burned by a bushfire and drop the stick on a patch of unburned grass. The bird then feasts on the small animals that flee from the subsequent fire.
 
[HEADING:C]
Most tool-using behaviours are a means of extracting food, which may provide a clue as to how the mental abilities needed for tool use evolved. The predominant explanation is based on the proverb that ''necessity is the mother of invention''. Essentially, brain tissue is energetically expensive, so animals should have evolved only the necessary intellectual capabilities required to overcome the challenges they face in their environment. Consider a hypothetical duck grazing on a seemingly endless supply of grass. Being particularly intelligent will not help the duck eat more grass. In contrast, other species, such as birds of prey, live in a more challenging environment, where food may be distributed erratically, hidden from view or highly mobile. The food itself may be quite intelligent. So, if there are not enough resources to feed all individuals, then only the smartest in each generation will live and reproduce.
 
[HEADING: D]
New Caledonian crows boast many different tools in their tool kit. They use a hooked tool made by removing all but one of the side branches from a twig. They fashion serrated rakes (using their beaks as scissors) from stiff, leathery pandanus leaves. They also make probes by modifying their own moulted feathers. Each tool is used in slightly different ways to pull grubs from deep within tree trunks. The crows carry their favourite tool from one foraging site to the next. They also store their tools for later re-use in a secure place on their perch.
 
[HEADING: E]
Problem-solving abilities have traditionally been thought to be beyond the reach of animals. Nevertheless, birds are coming up with innovative solutions all the time. Recently, New Caledonian crows were observed moulding a piece of wire, something they had never seen before, into a hook and then using it to retrieve food.

 
[HEADING: F]
Literally hundreds of such reports have accumulated in back copies of scientific journals. Recently, a team of biologists from McGill University in Canada collated them and compared the frequency and size of innovations with the size of the birds'' forebrain (the brain-area responsible for higher-order information processing) relative to the hindbrain. The team uncovered a clear relationship: birds with relatively large forebrains are able to invent fresh solutions to ecological challenges, and to exploit the discoveries and inventions of others, more often than birds with relatively small forebrains.
 
[HEADING: G]
Intelligence in birds may also arise as a result of selection to overcome the dynamic challenges of communal living. Since this involves competition between group members, to be successful, a social animal may need to be able to reflect on its own intentions, as well as those of others. The consequence of being part of a community may be the evolution of a distinctly ''political'' brain. What better way to exercise a political brain than to be deceitful! Perhaps the best example of deception among birds comes from the white-winged choughs. Choughs are cooperative breeders – that is, they form a communal group consisting of one breeding-pair and up to 15 non-breeding ''helpers''. However, because young choughs have so little enthusiasm for foraging, or gathering food, they are often too hungry to help. And because it is socially unacceptable to be part of a group and provide little help, young choughs often act deceptively. For example, when an adult is watching, a young chough will place some food in the mouth of a hungry chick – but it does not release the food. Instead, it waits until the adult departs and then eats it. A chough can also help the group by preening* the chicks. Interestingly, it is more likely to preen the chicks if another bird can see it do so. A chough that has been sitting totally still on the nest while the rest of the group is foraging out of sight will comically spring up and frantically start to preen the chicks as soon as some of its group members come into view. It is likely that these young choughs are only motivated to help when others are watching because they are concerned about their social status. Choughs need other choughs to like them as they cannot breed without them.

preening*: cleaning and arranging feathers on birds',
    969,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b3443295-8efd-44c1-93c3-affb6e3bc93e',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    14,
    'matching_headings',
    'Question 14',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'D',
    'This paragraph explains how the belief that only humans possess intelligence and traits like tool use, language, and deception has been challenged. The author presents new research that forces us to reconsider or "review" these old assumptions.',
    1,
    '{"explanation":"This paragraph explains how the belief that only humans possess intelligence and traits like tool use, language, and deception has been challenged. The author presents new research that forces us to reconsider or \"review\" these old assumptions.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '178432c5-0b1b-4ee2-83a5-b8ece5a27342',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    15,
    'matching_headings',
    'Question 15',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'H',
    'This paragraph gives multiple examples of birds using tools, such as woodpecker finches, Australian birds, and black kites. The focus is on listing various species and their tool-using behaviors.',
    1,
    '{"explanation":"This paragraph gives multiple examples of birds using tools, such as woodpecker finches, Australian birds, and black kites. The focus is on listing various species and their tool-using behaviors.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f64d5f64-aa4b-4ef3-a089-e32bc70dfba9',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    16,
    'matching_headings',
    'Question 16',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'A',
    'This paragraph presents a theory suggesting that tool use developed in birds as a survival strategy in challenging environments. It connects intelligence (used for tool use) to survival advantages.',
    1,
    '{"explanation":"This paragraph presents a theory suggesting that tool use developed in birds as a survival strategy in challenging environments. It connects intelligence (used for tool use) to survival advantages.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd1b8a11b-b83b-482c-acaf-be864fc9a41e',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    17,
    'matching_headings',
    'Question 17',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'E',
    'This paragraph focuses entirely on New Caledonian crows and the variety of tools they use. It describes several distinct tools and how they use them differently, which directly matches the heading.',
    1,
    '{"explanation":"This paragraph focuses entirely on New Caledonian crows and the variety of tools they use. It describes several distinct tools and how they use them differently, which directly matches the heading.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a53f7406-9003-4284-8678-03f4515906dd',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    18,
    'matching_headings',
    'Question 18',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'G',
    'This paragraph introduces the idea that birds can solve new problems using innovative thinking. The mention of shaping wire into a hook—something entirely unfamiliar—serves as strong evidence of cognitive ability.',
    1,
    '{"explanation":"This paragraph introduces the idea that birds can solve new problems using innovative thinking. The mention of shaping wire into a hook—something entirely unfamiliar—serves as strong evidence of cognitive ability.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'aa659c21-f401-4b10-a9c2-b31abe2cf646',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    19,
    'matching_headings',
    'Question 19',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'C',
    'This paragraph presents findings from research showing that birds with larger forebrains are more capable of solving problems and using social learning. This links intelligence with social living and cooperation.',
    1,
    '{"explanation":"This paragraph presents findings from research showing that birds with larger forebrains are more capable of solving problems and using social learning. This links intelligence with social living and cooperation.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '495158b4-4a63-47f1-99d6-719a83e47a76',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    20,
    'matching_headings',
    'Question 20',
    '["The theory linking capacity for tool use in birds and survival","The influence of humans on tool use","The theory linking cognitive ability and living in a society","Reviewing long-held beliefs","One species'' multiple tool-using techniques","How some birds trick each other","Physiological evidence of birds'' intelligence","Several examples of birds who use tools","Intelligence helps birds to remember"]'::jsonb,
    'F',
    'This paragraph explains how white-winged choughs use deception to protect their reputation in the group. They pretend to help when others are watching, which shows socially motivated trickery.',
    1,
    '{"explanation":"This paragraph explains how white-winged choughs use deception to protect their reputation in the group. They pretend to help when others are watching, which shows socially motivated trickery.","instruction":"<p>The passage has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1ca42571-43e2-46bc-94c0-375033120686',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    21,
    'matching_info',
    'Keeping tools that they like to use',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'C',
    'New Caledonian crows were seen carrying their favorite tools from one place to another and even storing them for later use. This shows that they keep tools they like and use them repeatedly, which is unusual and intelligent behavior for birds.',
    1,
    '{"explanation":"New Caledonian crows were seen carrying their favorite tools from one place to another and even storing them for later use. This shows that they keep tools they like and use them repeatedly, which is unusual and intelligent behavior for birds.","fromPassage":"The crows carry their favourite tool from one foraging site to the next. They also store their tools for later re-use in a secure place on their perch.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '76971117-68c3-4fc7-ba76-0b2f476e01ee',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    22,
    'matching_info',
    'Drawing out their prey by frightening it',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'B',
    'Black kites use a clever hunting method by dropping bait into water. This scares the fish and brings them to the surface, making them easier to catch. This behavior involves drawing prey out by frightening it.',
    1,
    '{"explanation":"Black kites use a clever hunting method by dropping bait into water. This scares the fish and brings them to the surface, making them easier to catch. This behavior involves drawing prey out by frightening it.","fromPassage":"Black kites have been reported dropping bait into lakes to bring fish to the surface of the water, thereby making them easier to catch.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '21e71db0-7218-496a-af91-b251c45e1815',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    23,
    'matching_info',
    'The use of tools to remove the outer covering from food',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'A',
    'The passage explains that New Caledonian crows use several specially made tools to extract grubs from deep inside tree trunks. This involves removing the outer layer of food sources with tools, which shows advanced tool use.',
    1,
    '{"explanation":"The passage explains that New Caledonian crows use several specially made tools to extract grubs from deep inside tree trunks. This involves removing the outer layer of food sources with tools, which shows advanced tool use.","fromPassage":"Each tool is used in slightly different ways to pull grubs from deep within tree trunks.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f7755b53-640e-4766-923e-cf0b75ed5102',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    24,
    'matching_info',
    'Using food to attract their prey',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'B',
    'Black kites attract their prey by dropping bait into the water. This bait acts as a lure to bring fish to the surface, so they can catch them easily. It’s a clever use of food to catch more food.',
    1,
    '{"explanation":"Black kites attract their prey by dropping bait into the water. This bait acts as a lure to bring fish to the surface, so they can catch them easily. It’s a clever use of food to catch more food.","fromPassage":"Black kites have been reported dropping bait into lakes to bring fish to the surface of the water, thereby making them easier to catch.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '419cfeec-eb82-4b98-afa6-5401647e0846',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    25,
    'matching_info',
    'The use of unfamiliar materials to make tools',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'C',
    'These crows were observed shaping a piece of wire—something completely unfamiliar to them—into a hook. This shows they can make tools from new materials they’ve never encountered before.',
    1,
    '{"explanation":"These crows were observed shaping a piece of wire—something completely unfamiliar to them—into a hook. This shows they can make tools from new materials they’ve never encountered before.","fromPassage":"Recently, New Caledonian crows were observed moulding a piece of wire, something they had never seen before, into a hook and then using it to retrieve food.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '568e61fc-926e-4d5e-890f-23cc085fd75d',
    'reading',
    '1e2ad7c6-e5a8-410b-9061-a0ce4b449779',
    26,
    'matching_info',
    'Engaging in certain activities for the benefit of observers',
    '["white-winged choughs","black kites","New Caledonian crows"]'::jsonb,
    'A',
    'Young white-winged choughs were seen pretending to help (like preening chicks) only when others were watching. This shows they care about what others think and want to appear helpful, especially in front of observers.',
    1,
    '{"explanation":"Young white-winged choughs were seen pretending to help (like preening chicks) only when others were watching. This shows they care about what others think and want to appear helpful, especially in front of observers.","fromPassage":"A chough that has been sitting totally still on the nest while the rest of the group is foraging out of sight will comically spring up and frantically start to preen the chicks as soon as some of its group members come into view.","instruction":"<p>Look at the following characteristics (Questions 21-26) and the list of birds below. Match each characteristic with the correct bird, A, B, or C. Choose the correct letter, A, B, or C, in boxes 21-26.</p><p><strong>NB</strong>&nbsp;You may use any letter more than once.</p>","context":"<p><strong>List of Birds:</strong></p><p>A. white-winged choughs</p><p>B. black kites</p><p>C. New Caledonian crows</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 9: The History of Chocolate
-- Source API ID: 1665
-- Generated: 2026-02-26T11:43:41.321Z
-- ============================================

-- ============================================
-- Day 9: The History of Chocolate - Part 3: The History of Chocolate
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '8c6d04b6-fea1-44f8-811c-4a56549da098',
    'Day 9: The History of Chocolate - Part 3: The History of Chocolate',
    'Cambridge IELTS - The History of Chocolate',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    '8c6d04b6-fea1-44f8-811c-4a56549da098',
    1,
    'The History of Chocolate',
    'A 
Chocolate is now perceived as a ubiquitous indulgence, whether consumed as confectionery or a beverage, readily accessible in global markets. However, it may come as a surprise that chocolate was once regarded as a commodity of extraordinary value. The discovery of the cocoa tree, the source of chocolate, occurred approximately 2,000 years ago in the lush tropical rain forests of the Americas. The evolution of the chocolate — from a regionally significant Mesoamerican drink to globally consumed confectionery — has been shaped through cross-continental cultural exchanges and the successive influences of multiple civilisations.

B 
Historians suggest that the ancient Maya pioneered cocoa tree cultivation in Mesoamerica, with evidence dating back approximately 2,000 years. They transplanted cocoa trees from the dense rain forest into their domesticated gardens, where cocoa beans were initially roasted and ground into a smooth paste. The paste was combined with spices and water to produce unsweetened chocolate beverages. The Maya also employed a distinctive technique of transferring the liquid back and forth between containers, generating a foamy layer on the drink''s surface.

C 
Cocoa and chocolate were integral to Maya culture, commonly depicted in their architectural structures and artistic works. While the aristocracy, particularly the royal families, consumed chocolate during elaborate ceremonies, even less privileged groups occasionally savoured the drink. Furthermore, cocoa beans served as a powerful emblem of marital union and were ritually exchanged during wedding ceremonies.

D 
The Aztec civilisation in Mexico regarded chocolate as a prestigious commodity, despite being geographically unable to cultivate cocoa trees within their heartland. Accordingly, they sourced cocoa beans through extensive trade networks, even utilising them as currency for tax payments. Chocolate held an exclusive function within Aztec imperial and religious ceremonies, where priests offered cocoa beans as divine offerings and prepared sacred chocolate drinks. Due to the scarcity of cocoa beans, consumption remained restricted to the societal elite, with historical accounts suggesting Emperor Montezuma consumed up to 50 cups daily. Linguists trace the term ''chocolate'' to the Aztec Nahuatl word xocolatl, meaning ''bitter water'' in the Nahuatl language, though some scholars argue that it has hybrid origins combining Maya and Nahuatl linguistic elements.

E 
In 1502, explorer Christopher Columbus introduced cocoa beans to Spain after voyaging to Mesoamerica, and later Spanish explorer Hernán Cortés quickly recognised the potential economic value of chocolate. Upon arriving in present-day Mexico in 1519, Cortés observed that chocolate beverages would appeal to the Spanish. After conquering the Aztec Empire, Spanish forces exported confiscated cocoa supplies to Spain. In response to the growing demand, Spain began cultivating cocoa trees in its American colonies. Spanish elite first developed a taste for sweetened chocolate drinks, but the beverage rapidly spread across Europe. England, the Netherlands, and France followed suit by establishing cocoa plantations in their own colonies. By the 18th century, chocolate remained primarily a luxury restricted to the affluent. However, the Industrial Revolution''s technologies enabled mechanised production, dramatically reducing costs and making chocolate available to a broader population.

F 
Cocoa trees are cultivated across multiple countries in Africa, Mesoamerica, and South America, thriving in cool, shaded environments within equatorial zones. Despite widespread cultivation, cocoa farming remains labour-intensive, due to the trees'' requirement for specific water thresholds, temperature ranges, soil compositions, and protection from environmental threats. Approximately five years after planting, cocoa trees begin to yield large, pod-shaped fruits that grow on the trunk. These pods contain the beans used in chocolate production. While several types of cocoa trees exist, the bulk of the chocolate is produced from the seeds of the most commonly cultivated varieties. However, farmers opt to grow more specialised types, such as Criollo or Trinitario, valued for distinctive flavour profiles. Unexpectedly, cocoa trees grown on farms are more vulnerable to disease and pests than their wild counterparts. Cocoa cultivation presents a strenuous endeavour for farmers, who sell their harvests on futures markets, exposing their incomes to external market fluctuations.

G 
The process of chocolate production involves a series of steps, carried out in specialised factories where cocoa beans are meticulously processed. Workers first sort, clean, and roast the beans before extracting the outer shells, leaving only the inner nibs. These nibs are then ground into a dense paste known as chocolate liquor, which is subsequently separated into two components: cocoa solids and cocoa butter. Following standardised formulations, chocolate manufacturers blend the chocolate liquor with precise ratios of sugar, milk, and cocoa butter. The resulting mixture, often referred to as the ''crumb'', undergoes fine grinding to create a smooth consistency. Finally, the mixture is then subjected to two additional processes — conching and tempering — before being placed into moulds to create various forms, such as bars or other chocolate products.

H 
Chocolate holds significant global economic value, with the manufacturing industry generating over $5 billion annually from cocoa crops, and its reputation remains most prominent in Europe and the United States. For instance, US cocoa product imports reached $1.4 billion in 2005. On average, Americans consume over five kilogrammes of chocolate per person each year. In addition, upscale chocolate boutiques, which offer premium chocolates, have gained significant popularity. Many of these shops specialise in artisanal chocolates, crafted with unique flavour profiles. Renowned chocolate brands such as Cadbury, Godiva, Lindt, and Ferrero Rocher dominate the market. However, the cocoa and chocolate production sectors often face challenges related to fair trade, sustainable development, and environmental preservation. These issues are now being actively addressed by industry stakeholders, including officials, activists, and researchers, who are working closely with farmers to promote faming practices that foster sustainability and protect the environment.',
    924,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '91869709-fb6f-4289-8312-e3ade03c962a',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    27,
    'matching_info',
    'The part of cocoa trees used for chocolate production.',
    '["","","","","","","",""]'::jsonb,
    'F',
    'The passage mentions that the pods of the cocoa tree contain beans, which are the main ingredient used in chocolate production. These beans are harvested, processed, and turned into chocolate products.',
    1,
    '{"explanation":"The passage mentions that the pods of the cocoa tree contain beans, which are the main ingredient used in chocolate production. These beans are harvested, processed, and turned into chocolate products.","fromPassage":"Approximately five years after planting, cocoa trees begin to yield large, pod-shaped fruits that grow on the trunk. These pods contain the beans used in chocolate production.","instruction":"<p><strong>Reading Passage 3 has eight paragraphs, A-H.</strong></p><p><strong>Which paragraph contains the following information?</strong></p><p>Choose the correct letter, A-H, in boxes 27-31.</p><p><strong><em>NB</em></strong><em>&nbsp;You may use any letter more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd67e951b-f488-440a-9c66-1613e374d9da',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    28,
    'matching_info',
    'Annual chocolate consumption per capita in the United States.',
    '["","","","","","","",""]'::jsonb,
    'H',
    'The paragraph talks about the popularity of chocolate in the US and states a specific average amount consumed per person, which directly answers this question.',
    1,
    '{"explanation":"The paragraph talks about the popularity of chocolate in the US and states a specific average amount consumed per person, which directly answers this question.","fromPassage":"On average, Americans consume over five kilogrammes of chocolate per person each year.","instruction":"<p><strong>Reading Passage 3 has eight paragraphs, A-H.</strong></p><p><strong>Which paragraph contains the following information?</strong></p><p>Choose the correct letter, A-H, in boxes 27-31.</p><p><strong><em>NB</em></strong><em>&nbsp;You may use any letter more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d27f5be-78ac-464c-b791-f1091ea62d6a',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    29,
    'matching_info',
    'The higher likelihood of cultivated cocoa trees being attacked by insects.',
    '["","","","","","","",""]'::jsonb,
    'F',
    'The paragraph explains that cocoa trees grown on farms (cultivated) are more vulnerable to disease and pests than wild trees, which clearly answers this question.',
    1,
    '{"explanation":"The paragraph explains that cocoa trees grown on farms (cultivated) are more vulnerable to disease and pests than wild trees, which clearly answers this question.","fromPassage":"Unexpectedly, cocoa trees grown on farms are more vulnerable to disease and pests than their wild counterparts.","instruction":"<p><strong>Reading Passage 3 has eight paragraphs, A-H.</strong></p><p><strong>Which paragraph contains the following information?</strong></p><p>Choose the correct letter, A-H, in boxes 27-31.</p><p><strong><em>NB</em></strong><em>&nbsp;You may use any letter more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'aea3dbe5-d5b8-409d-a50e-e64bd0b47d49',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    30,
    'matching_info',
    'A community which developed a preference for sweetened chocolate beverages',
    '["","","","","","","",""]'::jsonb,
    'E',
    'After cocoa was brought to Spain, the Spanish elite started drinking sweetened chocolate, and this preference later spread across Europe. This shows how that community developed a taste for sweet chocolate drinks.',
    1,
    '{"explanation":"After cocoa was brought to Spain, the Spanish elite started drinking sweetened chocolate, and this preference later spread across Europe. This shows how that community developed a taste for sweet chocolate drinks.","fromPassage":"Spanish elite first developed a taste for sweetened chocolate drinks, but the beverage rapidly spread across Europe.","instruction":"<p><strong>Reading Passage 3 has eight paragraphs, A-H.</strong></p><p><strong>Which paragraph contains the following information?</strong></p><p>Choose the correct letter, A-H, in boxes 27-31.</p><p><strong><em>NB</em></strong><em>&nbsp;You may use any letter more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd536bc75-a84d-42a5-b3ed-b21d167a4ab5',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    31,
    'matching_info',
    'An approach by which ancient Mexicans could acquire cocoa beans.',
    '["","","","","","","",""]'::jsonb,
    'D',
    'The Aztecs couldn’t grow cocoa trees in their region, so they obtained cocoa beans through trade networks. This was their method of acquiring cocoa.',
    1,
    '{"explanation":"The Aztecs couldn’t grow cocoa trees in their region, so they obtained cocoa beans through trade networks. This was their method of acquiring cocoa.","fromPassage":"They sourced cocoa beans through extensive trade networks, even utilising them as currency for tax payments.","instruction":"<p><strong>Reading Passage 3 has eight paragraphs, A-H.</strong></p><p><strong>Which paragraph contains the following information?</strong></p><p>Choose the correct letter, A-H, in boxes 27-31.</p><p><strong><em>NB</em></strong><em>&nbsp;You may use any letter more than once.</em></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cb254ab0-48c6-4dc2-9643-67e200f70f0a',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    32,
    'tfng',
    'The Mayan ruling class forbade the use of cocoa and chocolate in rituals.',
    NULL,
    'FALSE',
    'The passage clearly states that the royal families (i.e., the ruling class) consumed chocolate during elaborate ceremonies. This means they used it in rituals, not forbade it.',
    1,
    '{"explanation":"The passage clearly states that the royal families (i.e., the ruling class) consumed chocolate during elaborate ceremonies. This means they used it in rituals, not forbade it.","fromPassage":"While the aristocracy, particularly the royal families, consumed chocolate during elaborate ceremonies, even less privileged groups occasionally savoured the drink.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6c862876-aafa-4431-87f8-5e3e56744758',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    33,
    'tfng',
    'The Spanish explorer Hernán Cortés had made an investment in chocolate and chocolate beverages.',
    NULL,
    'NOT GIVEN',
    'The passage says Cortés recognized the economic value of chocolate and observed its appeal but does not mention him personally investing in it. So, the information is not given.',
    1,
    '{"explanation":"The passage says Cortés recognized the economic value of chocolate and observed its appeal but does not mention him personally investing in it. So, the information is not given.","fromPassage":"Spanish explorer Hernán Cortés quickly recognised the potential economic value of chocolate. Upon arriving in present-day Mexico in 1519, Cortés observed that chocolate beverages would appeal to the Spanish.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0126d37b-a633-435c-be97-5baf5e8211ed',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    34,
    'tfng',
    'Wild cocoa trees are more susceptible to infectious diseases than cultivated ones.',
    NULL,
    'FALSE',
    'The text says the opposite: cocoa trees grown on farms (cultivated) are more vulnerable than wild ones.',
    1,
    '{"explanation":"The text says the opposite: cocoa trees grown on farms (cultivated) are more vulnerable than wild ones.","fromPassage":"Unexpectedly, cocoa trees grown on farms are more vulnerable to disease and pests than their wild counterparts.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4a7bd14f-2156-45a8-b9f5-3cd24fda0a86',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    35,
    'tfng',
    'During chocolate production, some of the seeds are discarded.',
    NULL,
    'TRUE',
    'During the process, the outer shells of cocoa beans are removed, which means part of the seed is discarded.',
    1,
    '{"explanation":"During the process, the outer shells of cocoa beans are removed, which means part of the seed is discarded.","fromPassage":"Workers first sort, clean, and roast the beans before extracting the outer shells, leaving only the inner nibs.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b60ecfeb-2bc8-42d9-9555-98ae5369c34b',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    36,
    'tfng',
    'Chocolate enjoys more prestige in Europe and the United States than in any other country.',
    NULL,
    'TRUE',
    'The passage says its reputation remains most prominent in Europe and the US, which supports this statement.',
    1,
    '{"explanation":"The passage says its reputation remains most prominent in Europe and the US, which supports this statement.","fromPassage":"Chocolate holds significant global economic value, with the manufacturing industry generating over $5 billion annually from cocoa crops, and its reputation remains most prominent in Europe and the United States.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2f10105d-6cd6-47fa-a486-bd2ca4901ad0',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    37,
    'gap_fill',
    'Question 37',
    '["<h3 class=\"ql-align-center\">Seeds</h3><p class=\"ql-align-center\">classifying, cleaning, and roasting</p><p class=\"ql-align-center\">stripping their  ______ </p>","<h3 class=\"ql-align-center\">Nibs</h3>","<h3 class=\"ql-align-center\">Crushing</h3><p class=\"ql-align-center\">Producing&nbsp; ______ </p><p class=\"ql-align-center\">Mixing with measured quantities of substances such as sweeteners, liquid dairy, and&nbsp; ______ .</p>","<h3 class=\"ql-align-center\">Crumb blending</h3><p class=\"ql-align-center\">crushing finely to obtain a smooth texture</p><p class=\"ql-align-center\">manufacturing diverse shapes of chocolate in  ______ .</p>","<h3 class=\"ql-align-center\">Chocolate</h3>"]'::jsonb,
    'outer shells',
    'The question says "stripping their ______." The word stripping is synonymous with extracting, and the passage clearly states that after roasting, the beans have their outer shells extracted. This means the shells are removed or stripped, making outer shells the correct answer.',
    1,
    '{"explanation":"The question says \"stripping their ______.\" The word stripping is synonymous with extracting, and the passage clearly states that after roasting, the beans have their outer shells extracted. This means the shells are removed or stripped, making outer shells the correct answer.","fromPassage":"Workers first sort, clean, and roast the beans before extracting the outer shells, leaving only the inner nibs.","instruction":"<p>Complete the flow-chart below.</p><p>Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the passage for each answer.</p>","context":"<h3 class=\"ql-align-center\"><strong>From Cocoa Beans to Chocolate</strong></h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd6fdd072-99b4-405b-bc69-001242522b8b',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    38,
    'gap_fill',
    'Question 38',
    '["<h3 class=\"ql-align-center\">Seeds</h3><p class=\"ql-align-center\">classifying, cleaning, and roasting</p><p class=\"ql-align-center\">stripping their  ______ </p>","<h3 class=\"ql-align-center\">Nibs</h3>","<h3 class=\"ql-align-center\">Crushing</h3><p class=\"ql-align-center\">Producing&nbsp; ______ </p><p class=\"ql-align-center\">Mixing with measured quantities of substances such as sweeteners, liquid dairy, and&nbsp; ______ .</p>","<h3 class=\"ql-align-center\">Crumb blending</h3><p class=\"ql-align-center\">crushing finely to obtain a smooth texture</p><p class=\"ql-align-center\">manufacturing diverse shapes of chocolate in  ______ .</p>","<h3 class=\"ql-align-center\">Chocolate</h3>"]'::jsonb,
    'chocolate liquor',
    'The question refers to crushing the nibs and producing something. The passage says nibs are ground into (i.e., crushed into) chocolate liquor. This matches the production process, so chocolate liquor is the correct phrase.',
    1,
    '{"explanation":"The question refers to crushing the nibs and producing something. The passage says nibs are ground into (i.e., crushed into) chocolate liquor. This matches the production process, so chocolate liquor is the correct phrase.","fromPassage":"These nibs are then ground into a dense paste known as chocolate liquor, which is subsequently separated into two components: cocoa solids and cocoa butter.","instruction":"<p>Complete the flow-chart below.</p><p>Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the passage for each answer.</p>","context":"<h3 class=\"ql-align-center\"><strong>From Cocoa Beans to Chocolate</strong></h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4b92a945-2980-44af-b0d7-5a4c94e8d69e',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    39,
    'gap_fill',
    'Question 39',
    '["<h3 class=\"ql-align-center\">Seeds</h3><p class=\"ql-align-center\">classifying, cleaning, and roasting</p><p class=\"ql-align-center\">stripping their  ______ </p>","<h3 class=\"ql-align-center\">Nibs</h3>","<h3 class=\"ql-align-center\">Crushing</h3><p class=\"ql-align-center\">Producing&nbsp; ______ </p><p class=\"ql-align-center\">Mixing with measured quantities of substances such as sweeteners, liquid dairy, and&nbsp; ______ .</p>","<h3 class=\"ql-align-center\">Crumb blending</h3><p class=\"ql-align-center\">crushing finely to obtain a smooth texture</p><p class=\"ql-align-center\">manufacturing diverse shapes of chocolate in  ______ .</p>","<h3 class=\"ql-align-center\">Chocolate</h3>"]'::jsonb,
    'cocoa butter',
    'The question asks for an ingredient added with sweeteners and liquid dairy. According to the passage, the three blended components are sugar, milk, and cocoa butter, so this is the correct answer.',
    1,
    '{"explanation":"The question asks for an ingredient added with sweeteners and liquid dairy. According to the passage, the three blended components are sugar, milk, and cocoa butter, so this is the correct answer.","fromPassage":"Chocolate manufacturers blend the chocolate liquor with precise ratios of sugar, milk, and cocoa butter.","instruction":"<p>Complete the flow-chart below.</p><p>Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the passage for each answer.</p>","context":"<h3 class=\"ql-align-center\"><strong>From Cocoa Beans to Chocolate</strong></h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '96c999d8-6c77-4233-97f9-5fa77fe27fde',
    'reading',
    '4e924be4-3891-4577-bfdf-6830a260a12a',
    40,
    'gap_fill',
    'Question 40',
    '["<h3 class=\"ql-align-center\">Seeds</h3><p class=\"ql-align-center\">classifying, cleaning, and roasting</p><p class=\"ql-align-center\">stripping their  ______ </p>","<h3 class=\"ql-align-center\">Nibs</h3>","<h3 class=\"ql-align-center\">Crushing</h3><p class=\"ql-align-center\">Producing&nbsp; ______ </p><p class=\"ql-align-center\">Mixing with measured quantities of substances such as sweeteners, liquid dairy, and&nbsp; ______ .</p>","<h3 class=\"ql-align-center\">Crumb blending</h3><p class=\"ql-align-center\">crushing finely to obtain a smooth texture</p><p class=\"ql-align-center\">manufacturing diverse shapes of chocolate in  ______ .</p>","<h3 class=\"ql-align-center\">Chocolate</h3>"]'::jsonb,
    'moulds',
    'The question mentions manufacturing different shapes of chocolate in something. The passage says chocolate is placed into moulds to create various forms, which exactly matches the question’s idea. Hence, moulds is the correct answer.',
    1,
    '{"explanation":"The question mentions manufacturing different shapes of chocolate in something. The passage says chocolate is placed into moulds to create various forms, which exactly matches the question’s idea. Hence, moulds is the correct answer.","fromPassage":"Finally, the mixture is then subjected to two additional processes — conching and tempering — before being placed into moulds to create various forms, such as bars or other chocolate products.","instruction":"<p>Complete the flow-chart below.</p><p>Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the passage for each answer.</p>","context":"<h3 class=\"ql-align-center\"><strong>From Cocoa Beans to Chocolate</strong></h3>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 14: Biophilic Design
-- Source API ID: 1762
-- Generated: 2026-02-26T11:43:44.285Z
-- ============================================

-- ============================================
-- Day 14: Biophilic Design - Part 2: Biophilic Design
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'df9043c9-c783-4614-8eea-70931347f34a',
    'Day 14: Biophilic Design - Part 2: Biophilic Design',
    'Cambridge IELTS - Biophilic Design',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    'df9043c9-c783-4614-8eea-70931347f34a',
    1,
    'Biophilic Design',
    'A 
The movement related to green architecture, has gained much momentum within the building community in recent years. The premise of biophilic design seeks both to avoid or minimize harmful impacts on the natural environment, and equally importantly, to provide and restore beneficial contacts between people and nature in the built environment.

B
People have a psychologically developed need to commune with nature but this has frequently been neglected. All too often, architects have put creative originality before the needs of the people who have to live and work in their futuristic constructions, with scant regard for emotional, as well as practical, considerations. Biophilic design does not advocate tree houses or cave-dwelling, but it does provide the nature-based features that maximize human functioning and health. Though not technically a biophilic design, Fallingwater - the stunning house in rural Pennsylvania designed in the 1930s by Frank Lloyd Wright - arguably speaks to the human soul much more than the box-like blocks of flats designed by his contemporary Le Corbusier.

C 
In the modern world, much of our built environment is obstructing the age-old connection between humans and nature. The rates of technological progress are far exceeding rates of psychological evolution, leaving us ill-equipped to cope with our lifestyle, which in turn leads to increased stress. Because biophilia attempts to integrate basic and current needs, it can alleviate the difficulties caused by the brain''s constant attempts to function in a modern environment it has not yet evolved to handle. For example, one crucial element of the natural landscape to human health is sunlight. We are evolutionarily programmed to respond positively to sunny areas over dark or overcast ones, and sense that they will foster restoration, improve emotional well-being and promote health.

D 
Because of its tremendous impact on human psychology, biophilic design plays a vital role in healthcare and healthcare delivery. The current healthcare system contains many flaws, especially in its physical spaces. Hospitals, clinics, and offices are high-stress environments for patients, visitors and healthcare professionals alike. One well-known study looked at the impact of nature on patients after surgery. One group had a view of a tree; the others had a window looking onto a brick wall. The first group had shorter hospital stays, received fewer negative comments from the nurses, required fewer analgesics, and had slightly fewer post-operative complications.

E 
As a consequence of this and other studies, nature and nature-based design have been integrated into the physical design of many hospitals. For example, Dartmouth-Hitchcock Medical Center (DHMC) in New Hampshire boasts an atrium design, illuminating the entire facility. Natural elements also permeate the building, including wood, stone, and numerous live plants. While DHMC was built to incorporate these qualities, other hospitals have had biophilic features added to existing structures. The application of biophilia’s concepts to interior design in hospitals has increased substantially as administrators have witnessed patients’ positive responses to nature.

F 
Many existing buildings contain biophilic elements, but only a few have been built with the specific idea of biophilic design in mind. One such building is the Adam Joseph Lewis Center for Environmental Studies at Oberlin College, in Ohio. The director of Oberlin’s Environmental Studies Program, David Orr, explained the building’s goals were ‘to create not just a place for classes but rather a building that would help to redefine the relationship between humankind and the environment — one that would expand our sense of ecological possibilities’. The Lewis Center is sustainable in a broader sense than in the typical application of the word. It harnesses solar power, utilizes both active and passive air systems, and monitors the weather to adapt to conditions. The Center’s ‘Living Machine’ treats wastewater by combining traditional wastewater technology with wetland ecosystems’ purification processes, producing water that can be used in the toilets and for irrigation. In their design, Orr and his team of architects engineered a healthy and comfortable space for students, while ensuring the surrounding environment was undamaged.

G 
Another example is the University of Guelph-Humber building in Ontario, Canada. It contains a centrally located bio-wall, vertically spanning the building. The wall is covered in dense foliage which not only connects people to nature on the inside of the building, but also functions as a new filtration system prototype. The wall purifies the air and has the potential to fulfill the building’s fresh air intake requirements. This is another example of how biophilic design principles can be applied in a variety of contexts. These examples prove that the built environment need not interfere with biological human needs to commune with nature, nor with existing ecological systems.

H 
Ancient architects built for their cultures, which were almost always more in touch with the earth than western society of the present. They mimicked nature’s forms, producing magnificent structures with which we are still awed - though biophilic design is a novel concept, they certainly employed some of its recommendations. Today, we can add another layer to this tradition and ensure maximal benefit for our planet and ourselves. ',
    835,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'eee6c001-1ad3-4b9f-b81b-9a4f6450fa4b',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    14,
    'matching_info',
    'a description of how rapid change has a negative effect on people',
    '["","","","","","","",""]'::jsonb,
    'C',
    'Paragraph C explains that fast technological changes are happening faster than humans can adapt, which causes negative psychological effects. This directly matches the idea of rapid change harming people.',
    1,
    '{"explanation":"Paragraph C explains that fast technological changes are happening faster than humans can adapt, which causes negative psychological effects. This directly matches the idea of rapid change harming people.","fromPassage":"The rates of technological progress are far exceeding rates of psychological evolution, leaving us ill-equipped to cope with our lifestyle, which in turn leads to increased stress.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd7f6b0c5-4edc-4701-a132-ae43c0c12cd7',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    15,
    'matching_info',
    'a reference to an architect whose designs were uncharacteristic of biophilia',
    '["","","","","","","",""]'::jsonb,
    'B',
    'Paragraph B mentions Le Corbusier, whose modernist, box-like designs did not reflect biophilic principles. He is used as an example of an architect whose work was not aligned with biophilia.',
    1,
    '{"explanation":"Paragraph B mentions Le Corbusier, whose modernist, box-like designs did not reflect biophilic principles. He is used as an example of an architect whose work was not aligned with biophilia.","fromPassage":"Though not technically a biophilic design, Fallingwater… speaks to the human soul much more than the box-like blocks of flats designed by his contemporary Le Corbusier.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '06963dab-666d-4aef-97d3-74198251abc5',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    16,
    'matching_info',
    'a definition of the two main aims of biophilia',
    '["","","","","","","",""]'::jsonb,
    'A',
    'Paragraph A states two main aims of biophilic design: avoiding or reducing harm to nature and restoring positive contact between humans and nature. This is exactly what the question refers to.',
    1,
    '{"explanation":"Paragraph A states two main aims of biophilic design: avoiding or reducing harm to nature and restoring positive contact between humans and nature. This is exactly what the question refers to.","fromPassage":"The premise of biophilic design seeks both to avoid or minimize harmful impacts on the natural environment, and equally importantly, to provide and restore beneficial contacts between people and nature in the built environment.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d04b505-74cc-49a3-9062-93b53c3a03fa',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    17,
    'matching_info',
    'a positive claim about early forms of architecture',
    '["","","","","","","",""]'::jsonb,
    'H',
    'Paragraph H praises ancient architects for creating structures influenced by nature and describes them positively, as “magnificent.” This is the positive claim about early architecture.',
    1,
    '{"explanation":"Paragraph H praises ancient architects for creating structures influenced by nature and describes them positively, as “magnificent.” This is the positive claim about early architecture.","fromPassage":"They mimicked nature’s forms, producing magnificent structures with which we are still awed - though biophilic design is a novel concept, they certainly employed some of its recommendations.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '339dde61-ca48-41d1-b67a-28364465946e',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    18,
    'matching_info',
    'a reference to the fact that many architects are too focused on innovation',
    '["","","","","","","",""]'::jsonb,
    'B',
    'Paragraph B criticizes many architects for prioritizing creativity and originality over human needs. This matches the idea that architects focus too much on innovation.',
    1,
    '{"explanation":"Paragraph B criticizes many architects for prioritizing creativity and originality over human needs. This matches the idea that architects focus too much on innovation.","fromPassage":"All too often, architects have put creative originality before the needs of the people who have to live and work in their futuristic constructions, with scant regard for emotional, as well as practical, considerations.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e6c250a1-ec05-4259-b22f-dc195ad5e629',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    19,
    'matching_info',
    ' a description of features which conserve energy in a biophilic design',
    '["","","","","","","",""]'::jsonb,
    'F',
    'Paragraph F describes how the Lewis Center uses energy-saving features such as solar power and adaptive air systems. These are the energy-conserving elements mentioned.',
    1,
    '{"explanation":"Paragraph F describes how the Lewis Center uses energy-saving features such as solar power and adaptive air systems. These are the energy-conserving elements mentioned.","fromPassage":"It harnesses solar power, utilizes both active and passive air systems, and monitors the weather to adapt to conditions.","instruction":"<p>Which paragraph contains the following information?</p><p>Write the correct letter, <strong>A-H</strong>, in boxes 14-19 on your answer sheet.</p><p><strong>NB </strong>You may use any letter more than once.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fd2cca24-c492-49c3-9412-6f647ca3d118',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    20,
    'gap_fill',
    'Question 20',
    NULL,
    'technological',
    'Paragraph C mentions “technological progress” happening too fast for humans to adapt. The correct one-word answer is “technological.”',
    1,
    '{"explanation":"Paragraph C mentions “technological progress” happening too fast for humans to adapt. The correct one-word answer is “technological.”","fromPassage":"The rates of technological progress are far exceeding rates of psychological evolution, leaving us ill-equipped to cope with our lifestyle, which in turn leads to increased stress.","instruction":"<p>Complete the sentences. Write&nbsp;<strong>NO MORE THAN ONE WORD</strong>&nbsp;from the text for each answer</p>","context":"<p>In the modern world,&nbsp;&nbsp; ______ advancements are happening so quickly that humans are unable to adjust to them.</p><p>Biophilia can help us deal with the&nbsp; ______ &nbsp;caused by the difficulties of our current lifestyles.</p><p>People instinctively feel more comfortable in places which have plenty of&nbsp; ______ &nbsp;something which is necessary for health and well-being.</p><p>An experiment designed to test the effect of nature on patient recovery times found that those who could see a&nbsp;  ______ made a faster recovery.</p><p>There is a biophilic design feature in the University of Guelph-Humber building which improves the quality of the&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9221353e-9676-4c86-b82b-4cf57bed31a0',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    21,
    'gap_fill',
    'Question 21',
    NULL,
    'stress',
    'Paragraph C states that our modern lifestyle creates stress, and biophilia helps reduce these difficulties.',
    1,
    '{"explanation":"Paragraph C states that our modern lifestyle creates stress, and biophilia helps reduce these difficulties.","fromPassage":"leaving us ill-equipped to cope with our lifestyle, which in turn leads to increased stress.","instruction":"<p>Complete the sentences. Write&nbsp;<strong>NO MORE THAN ONE WORD</strong>&nbsp;from the text for each answer</p>","context":"<p>In the modern world,&nbsp;&nbsp; ______ advancements are happening so quickly that humans are unable to adjust to them.</p><p>Biophilia can help us deal with the&nbsp; ______ &nbsp;caused by the difficulties of our current lifestyles.</p><p>People instinctively feel more comfortable in places which have plenty of&nbsp; ______ &nbsp;something which is necessary for health and well-being.</p><p>An experiment designed to test the effect of nature on patient recovery times found that those who could see a&nbsp;  ______ made a faster recovery.</p><p>There is a biophilic design feature in the University of Guelph-Humber building which improves the quality of the&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '64443929-5a4e-42f1-ae08-76481d7c4f53',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    22,
    'gap_fill',
    'Question 22',
    NULL,
    'sunlight',
    'Paragraph C says humans prefer sunny areas because they promote well-being. Therefore, sunlight is necessary for comfort and health.',
    1,
    '{"explanation":"Paragraph C says humans prefer sunny areas because they promote well-being. Therefore, sunlight is necessary for comfort and health.","fromPassage":"For example, one crucial element of the natural landscape to human health is sunlight.","instruction":"<p>Complete the sentences. Write&nbsp;<strong>NO MORE THAN ONE WORD</strong>&nbsp;from the text for each answer</p>","context":"<p>In the modern world,&nbsp;&nbsp; ______ advancements are happening so quickly that humans are unable to adjust to them.</p><p>Biophilia can help us deal with the&nbsp; ______ &nbsp;caused by the difficulties of our current lifestyles.</p><p>People instinctively feel more comfortable in places which have plenty of&nbsp; ______ &nbsp;something which is necessary for health and well-being.</p><p>An experiment designed to test the effect of nature on patient recovery times found that those who could see a&nbsp;  ______ made a faster recovery.</p><p>There is a biophilic design feature in the University of Guelph-Humber building which improves the quality of the&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c94f1ab8-4c9c-463c-9b7a-b3664df865a4',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    23,
    'gap_fill',
    'Question 23',
    NULL,
    'tree',
    'Paragraph D describes a study where patients who could see a tree recovered faster. This matches the required answer.',
    1,
    '{"explanation":"Paragraph D describes a study where patients who could see a tree recovered faster. This matches the required answer.","fromPassage":"One group had a view of a tree; the others had a window looking onto a brick wall.","instruction":"<p>Complete the sentences. Write&nbsp;<strong>NO MORE THAN ONE WORD</strong>&nbsp;from the text for each answer</p>","context":"<p>In the modern world,&nbsp;&nbsp; ______ advancements are happening so quickly that humans are unable to adjust to them.</p><p>Biophilia can help us deal with the&nbsp; ______ &nbsp;caused by the difficulties of our current lifestyles.</p><p>People instinctively feel more comfortable in places which have plenty of&nbsp; ______ &nbsp;something which is necessary for health and well-being.</p><p>An experiment designed to test the effect of nature on patient recovery times found that those who could see a&nbsp;  ______ made a faster recovery.</p><p>There is a biophilic design feature in the University of Guelph-Humber building which improves the quality of the&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'be510573-2b8b-4983-acf2-e33a063f6ac2',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    24,
    'gap_fill',
    'Question 24',
    NULL,
    'air',
    'Paragraph G explains that the bio-wall purifies the air inside the building. So the feature improves air quality.',
    1,
    '{"explanation":"Paragraph G explains that the bio-wall purifies the air inside the building. So the feature improves air quality.","fromPassage":"The wall purifies the air and has the potential to fulfill the building’s fresh air intake requirements.","instruction":"<p>Complete the sentences. Write&nbsp;<strong>NO MORE THAN ONE WORD</strong>&nbsp;from the text for each answer</p>","context":"<p>In the modern world,&nbsp;&nbsp; ______ advancements are happening so quickly that humans are unable to adjust to them.</p><p>Biophilia can help us deal with the&nbsp; ______ &nbsp;caused by the difficulties of our current lifestyles.</p><p>People instinctively feel more comfortable in places which have plenty of&nbsp; ______ &nbsp;something which is necessary for health and well-being.</p><p>An experiment designed to test the effect of nature on patient recovery times found that those who could see a&nbsp;  ______ made a faster recovery.</p><p>There is a biophilic design feature in the University of Guelph-Humber building which improves the quality of the&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c1f4cfd2-81bf-4a9d-93b6-76180594f84c',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    25,
    'mcq_single',
    'Question 25',
    '[" It was the first educational establishment designed with biophilic principles."," It is beneficial for both students and the environment."," It has established new concepts for classroom design.","It aims to inspire new ways of thinking about the environment.","It provides solar power to other buildings in the surrounding area."]'::jsonb,
    'B,D',
    'Paragraph F shows that the Lewis Center is designed to benefit both students (healthy, comfortable learning space) and the environment (solar power, air systems, wastewater treatment).',
    1,
    '{"explanation":"Paragraph F shows that the Lewis Center is designed to benefit both students (healthy, comfortable learning space) and the environment (solar power, air systems, wastewater treatment).","fromPassage":"In their design, Orr and his team of architects engineered a healthy and comfortable space for students, while ensuring the surrounding environment was undamaged.","instruction":"<p>Choose <strong>TWO</strong> letters,<strong> A-E.</strong></p>","context":"<p>Which<strong> TWO</strong> of the following statements does the writer make about the Adam Joseph Lewis Center at Oberlin College?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b7153c09-960a-4fb1-84f3-9f3fee9c2dae',
    'reading',
    'ec14ba98-282e-4635-a86b-892d02e559ee',
    26,
    'mcq_single',
    'Question 26',
    '[" It was the first educational establishment designed with biophilic principles."," It is beneficial for both students and the environment."," It has established new concepts for classroom design.","It aims to inspire new ways of thinking about the environment.","It provides solar power to other buildings in the surrounding area."]'::jsonb,
    'B,D',
    'Paragraph F quotes David Orr, saying the building aims to inspire a new relationship with the environment and “expand our sense of ecological possibilities.” This matches option D.',
    1,
    '{"explanation":"Paragraph F quotes David Orr, saying the building aims to inspire a new relationship with the environment and “expand our sense of ecological possibilities.” This matches option D.","fromPassage":"The director of Oberlin’s Environmental Studies Program, David Orr, explained the building’s goals were ‘to create not just a place for classes but rather a building that would help to redefine the relationship between humankind and the environment — one that would expand our sense of ecological possibilities’.","instruction":"<p>Choose <strong>TWO</strong> letters,<strong> A-E.</strong></p>","context":"<p>Which<strong> TWO</strong> of the following statements does the writer make about the Adam Joseph Lewis Center at Oberlin College?</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 6: Crossing the Threshold
-- Source API ID: 1764
-- Generated: 2026-02-26T11:43:47.214Z
-- ============================================

-- ============================================
-- Day 6: Crossing the Threshold - Part 3: Crossing the Threshold
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '27c16975-265a-4f08-bffc-05fb5a39f9fa',
    'Day 6: Crossing the Threshold - Part 3: Crossing the Threshold',
    'Cambridge IELTS - Crossing the Threshold',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    '27c16975-265a-4f08-bffc-05fb5a39f9fa',
    1,
    'Crossing the Threshold',
    'The renovated Auckland Art Gallery in New Zealand unites old and new, creating an irresistible urge to step inside

Architects are finding it very difficult in today’s cultural landscape. The profession faces a three-way threat: a public that apparently doesn’t understand what architects do, developers who couldn’t care less what they do, and overbearing councils micromanaging every single aspect of what they do. According to sources within the architectural profession, the situation is much worse when architects work on municipal buildings, as architects FJMT and Archimedia discovered with their Auckland Gallery makeover, where a vast number of external pressures threatened the project, and with so many bureaucratic difficulties it looked doomed to fail.

The major challenge of the gallery renovation project was that it involved two parts. The first was to restore the heritage building, dating back to 1888, which contained a network of small spaces, refurbished so often it contained 17 different floor heights. The second was to deliver a new extension that would not only double floor and exhibition space but also attract new patrons, a total necessity. While the old building’s circulation was off-putting, so was something intangible yet just as powerful: its atmosphere. For many, Auckland Art Gallery was just an old building that served a limited range of patrons with highbrow interests, missing its chance to engage with new audiences.

A 2003 survey of young people’s impressions of the gallery confirmed this opinion, sounding more like references to an abandoned building. For the survey authors, ‘threshold fear’ – where certain groups are intimidated from entering certain spaces by their off-putting atmosphere – was the institution’s undoing, something no architect wants anything to do with. For those young people Auckland Art Gallery was undemocratic, ‘dusty’ and ‘cold’ – the epitome of threshold fear. Also, 16% of the sample group had no idea where it even was, despite being interviewed on the pavement right outside it. Clearly, the gallery was fatally out of step at a time when New Zealand’s national museum in Wellington was successfully engaging broader audiences with contemporary branding and marketing, interactive displays and temporary events.

The decision to evolve the gallery was actually made in 2000, although it too eight years for building to commence, the architects fought off heritage committees and conservationists trying stop them. The architects were not just dealing with a disillusioned public, but also with precious timber and the parkland which surrounds the building. Pushing the design through the Environment Court, the body which approves renovations of this scale, alone took three years. During this time the budget blew out by several million dollars, the funding dried up, and the new wing had to be completely redesigned. Even after the redesign, the use of kauri timber, with its significance to New Zealand’s Maori people*, stirred up political debate.

In the new building the architects have used kauri to produce a canopy with a curving interior roof supported by tapered. steel columns, also clad in kauri. The canopy represents a signature public face, its curvature filtering light to the forecourt to the west and creating a visual echo of the canopy of pohutukawa trees in Albert Park to the east. The park also has cultural significance to Maori as it was the site of early settlements.

The connection is reinforced by sculptures from Maori artist Arnold Wilson decorating the columns, while fellow artist Bernard Makoare was a consultant, ensuring the gallery emphasised Maori beliefs. Still that didn’t stop the conservationist Stephen King from accusing the architects of ‘throwing’ kauri at a ‘mediocre building’ and of misappropriating the ‘mana’ (spiritual energy) of the precious material (which is almost extinct: harvesting of both petrified and swamp kauri has been likened to a gold rush). However, the kauri that was used here was from the forest floor, and King’s misconceptions sum up the prejudice that surrounded the project.

Objections also came from the Auckland Regional Council, worrying about the extension’s impact on Albert Park, yet the project’s relationship with parkland is one of the most successful outcomes. Impact is not only minimal, but improves the park’s social function. The extension’s enormous glass atrium opens up the building by directing the gaze from street level to the parkland beyond, while inside, the new art space is fronted along the east by a continuous glass wall incorporating the park into the gallery. The glass becomes a ‘screen’ for viewing the outside world and makes the art accessible to those in the park, a far cry from both ‘white cube’ galleries worldwide, the plain boxes where paintings are hung in antiseptic white surroundings. and also the dusty impermeable Auckland Gallery of old.

Another success is the refurbishment of the heritage building, especially the Mackelvie Gallery, in disrepair after its characteristic early twentieth-century Edwardian decoration had been stripped out or walled away in previous renovations. Remarkably the Mackelvie space has been reconstructed from two old photos, although the problem of multiple floor levels was so serious that scaffolding had to be erected at the highest level, with work progressing downwards, the reverse of normal practice. When it was over, a fascinating detail was retained: the lowest level visible under glass embedded in the new floor, the building itself as artwork, while elsewhere columns from the old gallery have been exposed in the walls of the new wing.

In 2008 the gallery averaged just 190,000 visitors annually. After reopening, it had 300,000 in five months. Cynics will chalk that up to novelty of the new, but the fact is the gallery is now an alluring cultural space which is crawling with young people.',
    935,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7992f56e-8884-419a-8bbe-6288f59bb631',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    27,
    'mcq_single',
    'Question 27',
    '["Criticism of architects by different groups is unfair.","The architectural profession is generally well respected.","The most difficult projects for architects are public buildings.","Failure to deliver buildings is a result of poor communication."]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter, A, B, C or D.</p>","context":"<p>What is the writer’s main point in the first paragraph?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3520a707-5f31-4d43-809f-50b7cb6069a1',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    28,
    'mcq_single',
    'Question 28',
    '["the existing building was old and parts of it had fallen down.","there was a high number of floors in the building.","it needed to satisfy the requirements of the existing patrons.","it involved renovating the existing building and adding a new one."]'::jsonb,
    'D',
    NULL,
    1,
    '{"context":"<p>The Auckland Gallery project was particularly difficult because</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ea3d2b3c-4db8-414f-af2e-c610a0b3e0ed',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    29,
    'mcq_single',
    'Question 29',
    '["The gallery''s visibility was poor.","The gallery was not reaching out to involve young people.","The entrance to the gallery was not well signposted.","The location of the gallery was difficult to access."]'::jsonb,
    'A',
    NULL,
    1,
    '{"context":"<p>What point is the writer making when he says that 16% of the sample group did not know where the museum was?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9d8aef16-6da4-4fca-a42d-464e0ae381b2',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    30,
    'mcq_single',
    'Question 30',
    '["Young people are not interested in galleries.","They did not visit the gallery because of the way it made them feel.","They thought that the gallery buildings were not in use.","The gallery had the reputation of being dirty."]'::jsonb,
    'B',
    NULL,
    1,
    '{"context":"<p>What disturbing information did the architects find out from the survey of young people?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7c885b7b-3634-445f-9081-1bc206b51eaa',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    31,
    'mcq_single',
    'Question 31',
    '["satisfy the concerns of conservationists.","protect sacred materials in the Albert Park site.","make sure the gallery respects Maori culture.","ensure that certain sources of kauri were not used."]'::jsonb,
    'C',
    NULL,
    1,
    '{"context":"<p>Maori artists were used on this project to</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ce60dcd3-d3b0-4c58-a6b8-4717d0f7cb91',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    32,
    'tfng',
    'Before the renovation, the Auckland Art Gallery was regarded as an elitist institution.',
    NULL,
    'YES',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c3e35b4f-488e-4113-ae4b-c1133296885b',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    33,
    'tfng',
    'Stephen King’s intervention in the project shows his understanding of the architects’ use of kauri.',
    NULL,
    'NO',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2b69a030-937e-4218-b89f-1ae1e82da343',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    34,
    'tfng',
    'The way the building interacts with its surroundings is a triumph.',
    NULL,
    'YES',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6313b1d2-c294-4d0c-bebe-ea4dc0e456bc',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    35,
    'tfng',
    'The glass screen along the east wall was one of the most costly items in the rebuild.',
    NULL,
    'NOT GIVEN',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '61372eaf-fd3f-49c3-a878-0029550018c3',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    36,
    'tfng',
    'The design of the extension to the Auckland Art Gallery is similar to the design of ‘white cube’ galleries in other parts of the world.',
    NULL,
    'NO',
    NULL,
    1,
    '{"instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '30a4c38c-2ddb-4094-8855-b48814f064b0',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    37,
    'matching_info',
    'The destruction of Edwardian ornamentation',
    '["resulted in work being done in the opposite direction to that usually followed.","is more than cosmetic and has improved the circulation.","was the clue to rebuilding the Mackelvie Gallery successfully.","has resulted in the building itself becoming a work of art.","means that you should be able to tell whether you are in the old wing or the new one.","was the result of earlier attempts to modernise the building."]'::jsonb,
    'F',
    NULL,
    1,
    '{"instruction":"<p>Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.</p>","context":"<p><strong>A.</strong> resulted in work being done in the opposite direction to that usually followed.</p><p><strong>B.</strong> is more than cosmetic and has improved the circulation.</p><p><strong>C.</strong> was the clue to rebuilding the Mackelvie Gallery successfully.</p><p><strong>D.</strong> has resulted in the building itself becoming a work of art.</p><p><strong>E.</strong> means that you should be able to tell whether you are in the old wing or the new one.</p><p><strong>F.</strong> was the result of earlier attempts to modernise the building.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1149458e-b872-44ac-8984-fcc27c8b61d7',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    38,
    'matching_info',
    'It is extraordinary that a limited number of photographs',
    '["resulted in work being done in the opposite direction to that usually followed.","is more than cosmetic and has improved the circulation.","was the clue to rebuilding the Mackelvie Gallery successfully.","has resulted in the building itself becoming a work of art.","means that you should be able to tell whether you are in the old wing or the new one.","was the result of earlier attempts to modernise the building."]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.</p>","context":"<p><strong>A.</strong> resulted in work being done in the opposite direction to that usually followed.</p><p><strong>B.</strong> is more than cosmetic and has improved the circulation.</p><p><strong>C.</strong> was the clue to rebuilding the Mackelvie Gallery successfully.</p><p><strong>D.</strong> has resulted in the building itself becoming a work of art.</p><p><strong>E.</strong> means that you should be able to tell whether you are in the old wing or the new one.</p><p><strong>F.</strong> was the result of earlier attempts to modernise the building.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ad0b520b-a038-4b31-afaf-fe672c508603',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    39,
    'matching_info',
    'The problem of having so many floor levels to deal with',
    '["resulted in work being done in the opposite direction to that usually followed.","is more than cosmetic and has improved the circulation.","was the clue to rebuilding the Mackelvie Gallery successfully.","has resulted in the building itself becoming a work of art.","means that you should be able to tell whether you are in the old wing or the new one.","was the result of earlier attempts to modernise the building."]'::jsonb,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.</p>","context":"<p><strong>A.</strong> resulted in work being done in the opposite direction to that usually followed.</p><p><strong>B.</strong> is more than cosmetic and has improved the circulation.</p><p><strong>C.</strong> was the clue to rebuilding the Mackelvie Gallery successfully.</p><p><strong>D.</strong> has resulted in the building itself becoming a work of art.</p><p><strong>E.</strong> means that you should be able to tell whether you are in the old wing or the new one.</p><p><strong>F.</strong> was the result of earlier attempts to modernise the building.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '01016185-1b2d-4044-bdec-519216c6f877',
    'reading',
    '02f90a40-5914-4be7-ba84-c725e7183f47',
    40,
    'matching_info',
    'The glass flooring in the Mackelvie Gallery which reveals old features',
    '["resulted in work being done in the opposite direction to that usually followed.","is more than cosmetic and has improved the circulation.","was the clue to rebuilding the Mackelvie Gallery successfully.","has resulted in the building itself becoming a work of art.","means that you should be able to tell whether you are in the old wing or the new one.","was the result of earlier attempts to modernise the building."]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.</p>","context":"<p><strong>A.</strong> resulted in work being done in the opposite direction to that usually followed.</p><p><strong>B.</strong> is more than cosmetic and has improved the circulation.</p><p><strong>C.</strong> was the clue to rebuilding the Mackelvie Gallery successfully.</p><p><strong>D.</strong> has resulted in the building itself becoming a work of art.</p><p><strong>E.</strong> means that you should be able to tell whether you are in the old wing or the new one.</p><p><strong>F.</strong> was the result of earlier attempts to modernise the building.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 10: Dolls Through the Ages
-- Source API ID: 1771
-- Generated: 2026-02-26T11:43:50.117Z
-- ============================================

-- ============================================
-- Day 10: Dolls Through the Ages - Part 1: Dolls Through the Ages
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'e843d22c-5f5c-4f12-ad6e-64f25cc88c9b',
    'Day 10: Dolls Through the Ages - Part 1: Dolls Through the Ages',
    'Cambridge IELTS - Dolls Through the Ages',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    'e843d22c-5f5c-4f12-ad6e-64f25cc88c9b',
    1,
    'Dolls Through the Ages',
    'What is today a simple children’s toy has a surprisingly rich history. Dolls have been a part of humankind for thousands of years. Often depicting religious figures, or used as playthings, early dolls were probably made from primitive materials such as clay, fur, or wood.

Dolls constructed of flat pieces of wood, painted with various designs, and with ‘hair’ made of clay, have often been found in Egyptian graves dating back to 2000 BC. Egyptian tombs of wealthy families have included pottery dolls. Dolls being placed in these graves leads some to believe that they were cherished possessions.

Girls from ancient Greece and Rome offered their wooden dolls to goddesses after they were too ‘grown-up’ to play with dolls. Most ancient dolls that were found in tombs were very simple creations, often made from such materials as clay, rags, wood, or bone. Some of the more unique dolls were made with ivory or wax. The main goal was to make the doll as lifelike as possible. That ideal led to the creation of dolls with movable limbs and removable garments, dating back to 600 BC.

Following the era of the ancient dolls, Europe became a major hub for doll production. These dolls were primarily made of wood. Fewer than 30 examples of primitive wooden stump dolls from England survive today. The Grodnertal area of Germany produced many peg wooden dolls, a type of doll that has very simple peg joints and resembles a clothespin (a device for hanging washing on a clothesline). An alternative to wood was developed in the 1800s.

‘Composition’ is a collective term for mixtures of pulped wood or paper that were used to make doll heads and bodies. These mixtures were moulded under pressure, creating a durable doll that could be mass-produced. Manufacturers closely guarded the recipes for their mixtures, sometimes using strange ingredients like ash or eggshells. Papier-mâché, a type of composition, was one of the most popular mixtures.

In addition to wooden dolls, wax dolls grew in popularity in the 17th and 18th centuries. Munich in Germany was a major manufacturing centre for wax dolls. Wax dollmakers would model a doll’s head in wax or clay, and then cover it with plaster to create a mould. Then they would pour melted wax into the cast. The wax for the head would be very thin, no more than 3 mm. Some of the most distinctive wax dolls were created in England between 1850 and 1930. One of the first dolls that portrayed a baby was made in England from wax at the beginning of the 19th century.

Around the same time, porcelain became popular. It is made by firing special clays in a kiln at more than 2,372 degrees Fahrenheit (1300°C), and only a few clays can withstand firing at such high temperatures. Porcelain is used generically to refer to both china and bisque dolls; china is glazed, whereas bisque is unglazed. Germany, France, and Denmark started creating china heads for dolls in the 1840s. These china heads were replaced in the 1860s by ones made of bisque. Bisque, which is porcelain fired twice with colour added to it after the first firing, looked more like skin than china did.

In France, the bébé was popular in the 1880s, and it has become a highly sought-after doll today. The bébé, first made in the 1850s, was different from its predecessors because it depicted a younger girl. Until then, most French dolls were representations of adults. Although the French dolls were unrivalled in their artistry, German bisque dolls became quite popular because they were not as expensive. Kammer & Reinhardt introduced a bisque character doll in the 1900s, starting a trend of creating realistic dolls.

For many centuries, rag dolls were made by mothers for their children. The term ‘rag doll’ refers generically to dolls made of any fabric. ‘Cloth doll’ refers to a subset of rag dolls made of linen or cotton. Commercially produced rag dolls were first introduced in the 1850s by English and American manufacturers. Although not as sophisticated as dolls made from other materials, rag dolls were well loved, often as a child’s first toy.

Dollmaking did not become an industry in the United States until after the Civil War in the 1860s. Doll production was concentrated in the New England region of the United States, with dolls made from a variety of materials such as leather, rubber, papier-mâché, and cloth. Celluloid was developed in the state of New Jersey in the late 1860s and was used to manufacture dolls until the mid-1950s. German, French, American, and Japanese factories churned out cheaply produced celluloid dolls in mass quantities. However, celluloid fell out of favour because of its extreme flammability and propensity to fade in bright light.

After World War I, dollmakers experimented with plastics. Hard plastic dolls were manufactured in the 1940s. They resembled composition dolls, but they were much more durable. Other materials used in doll manufacturing included rubber, foam rubber, and vinyl in the 1950s and 1960s. Vinyl changed dollmaking, allowing dollmakers to root hair into the head, rather than using wigs or painting the hair. Although most dolls are now mass-manufactured using these modern materials, many modern dollmakers are still using the traditional materials of the past to make collectible dolls.',
    882,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9f5b4935-891a-4b21-a5bf-057bde20db51',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    1,
    'gap_fill',
    'Question 1',
    NULL,
    'clay',
    'The sentence clearly states that clay was used for the hair of early dolls in Egypt. This matches the note: "was used for the hair", so clay is the correct answer.',
    1,
    '{"explanation":"The sentence clearly states that clay was used for the hair of early dolls in Egypt. This matches the note: \"was used for the hair\", so clay is the correct answer.","fromPassage":"Dolls constructed of flat pieces of wood, painted with various designs, and with ‘hair’ made of clay, have often been found in Egyptian graves dating back to 2000 BC.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '39ad77de-9250-4e83-9ef2-a7e84c144d49',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    2,
    'gap_fill',
    'Question 2',
    NULL,
    'goddesses',
    'The note says dolls were given to ___ by older girls. The phrase "offered their wooden dolls to goddesses" fits exactly. So, goddesses is the right answer.',
    1,
    '{"explanation":"The note says dolls were given to ___ by older girls. The phrase \"offered their wooden dolls to goddesses\" fits exactly. So, goddesses is the right answer.","fromPassage":"Girls from ancient Greece and Rome offered their wooden dolls to goddesses after they were too ‘grown-up’ to play with dolls.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '70946a44-fc0b-4f19-8a88-4da7fd18cc66',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    3,
    'gap_fill',
    'Question 3',
    NULL,
    'limbs',
    'The note mentions separate clothes and something that could be moved. This matches with "movable limbs and removable garments". So, limbs is the correct answer.',
    1,
    '{"explanation":"The note mentions separate clothes and something that could be moved. This matches with \"movable limbs and removable garments\". So, limbs is the correct answer.","fromPassage":"That ideal led to the creation of dolls with movable limbs and removable garments, dating back to 600 BC.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'be27b90e-1e58-4f8a-840f-8e03b635ea6e',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    4,
    'gap_fill',
    'Question 4',
    NULL,
    'wax',
    'The note refers to materials dolls were made of in the 17th and 18th centuries. The passage says wax dolls grew in popularity during that time, so wax is correct.',
    1,
    '{"explanation":"The note refers to materials dolls were made of in the 17th and 18th centuries. The passage says wax dolls grew in popularity during that time, so wax is correct.","fromPassage":"In addition to wooden dolls, wax dolls grew in popularity in the 17th and 18th centuries.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '49975a3f-418b-46a8-9d9a-e5ff62ab2b89',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    5,
    'gap_fill',
    'Question 5',
    NULL,
    'plaster',
    'The note refers to the material used for moulds. The sentence directly says plaster was used to create moulds, so this is the right answer.',
    1,
    '{"explanation":"The note refers to the material used for moulds. The sentence directly says plaster was used to create moulds, so this is the right answer.","fromPassage":"Wax dollmakers would model a doll’s head in wax or clay, and then cover it with plaster to create a mould.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f39460a1-2db3-4479-8d0f-27b3c84ec408',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    6,
    'gap_fill',
    'Question 6',
    NULL,
    'composition',
    'The note asks for the name of a group of mixtures. The passage defines composition as this group, so it fits the blank exactly.',
    1,
    '{"explanation":"The note asks for the name of a group of mixtures. The passage defines composition as this group, so it fits the blank exactly.","fromPassage":"Composition’ is a collective term for mixtures of pulped wood or paper that were used to make doll heads and bodies.","instruction":"<p><strong>Complete the notes below.</strong></p><p>Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the passage for each answer.</p>","context":"<h2><strong>Dolls</strong></h2><h3><strong>Earliest known dolls</strong></h3><ul><li>represented religious figures</li><li>used as toys</li></ul><h3><strong>Egypt, 2000 BC</strong></h3><ul><li>bodies were made of wood</li><li> ______ was used for the hair</li></ul><h3><strong>Ancient Greece and Rome</strong></h3><ul><li>dolls were given to&nbsp; ______ by older girls</li></ul><h3><strong>600 BC</strong></h3><ul><li>realistic dolls had separate clothes and&nbsp;______ that could be put in different positions</li></ul><h3><strong>17th and 18th centuries</strong></h3><ul><li>dolls made of&nbsp;______ became more common</li><li>moulds made of&nbsp;______ </li></ul><h3><strong>1800s</strong></h3><ul><li>new manufacturing process developed</li><li>new group of mixtures known as&nbsp;______ </li><li>recipes for these mixtures kept secret</li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd5f0b798-d723-4b37-a8a0-84e16f4c82e5',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    7,
    'tfng',
    'Bisque dolls appear less realistic than dolls made of china.',
    NULL,
    'FALSE',
    'The statement says bisque dolls appear less realistic, but the passage clearly
says they looked more like skin. This directly contradicts the statement, so the
correct answer is FALSE',
    1,
    '{"explanation":"The statement says bisque dolls appear less realistic, but the passage clearly\nsays they looked more like skin. This directly contradicts the statement, so the\ncorrect answer is FALSE","fromPassage":"Bisque, which is porcelain fired twice with colour added to it after the\nfirst firing, looked more like skin than china did.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '76b7d7f1-32b9-4c8b-bcc1-3cdf4e247df8',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    8,
    'tfng',
    'French dolls tended to cost more than German bisque dolls.',
    NULL,
    'TRUE',
    'This means French dolls were more expensive than German bisque dolls, so the
statement is TRUE',
    1,
    '{"explanation":"This means French dolls were more expensive than German bisque dolls, so the\nstatement is TRUE","fromPassage":"Although the French dolls were unrivalled in their artistry, German\nbisque dolls became quite popular because they were not as\nexpensive.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9c704200-4647-47f3-8583-fb821a2b67d3',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    9,
    'tfng',
    'The first rag dolls were made in the 1850s.',
    NULL,
    'FALSE',
    'The question says "The first rag dolls were made in the 1850s." However, the passage clearly states that rag dolls had already existed for many centuries before that time. The 1850s only mark the beginning of commercially produced rag dolls, not the first rag dolls ever. So, the statement in the question is incorrect — rag dolls were made long before the 1850s.',
    1,
    '{"explanation":"The question says \"The first rag dolls were made in the 1850s.\" However, the passage clearly states that rag dolls had already existed for many centuries before that time. The 1850s only mark the beginning of commercially produced rag dolls, not the first rag dolls ever. So, the statement in the question is incorrect — rag dolls were made long before the 1850s.","fromPassage":"For many centuries, rag dolls were made by mothers for their children. The term ‘rag doll’ refers generically to dolls made of any fabric. ‘Cloth doll’ refers to a subset of rag dolls made of linen or cotton. Commercially produced rag dolls were first introduced in the 1850s by English and American manufacturers.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '68fc91e4-26e6-414e-90fb-cab972b27c2a',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    10,
    'tfng',
    'Only dolls made of cotton or linen are classified as cloth dolls.',
    NULL,
    'TRUE',
    'Only dolls made of linen or cotton are classified as cloth dolls. This supports the
statement, so the answer is TRUE.',
    1,
    '{"explanation":"Only dolls made of linen or cotton are classified as cloth dolls. This supports the\nstatement, so the answer is TRUE.","fromPassage":"The term ‘rag doll’ refers generically to dolls made of any fabric. ‘Cloth\ndoll’ refers to a subset of rag dolls made of linen or cotton.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '29d36ac8-9023-48b5-84c1-3210d149b20a',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    11,
    'tfng',
    'Dolls made of celluloid tended to lose their colour.',
    NULL,
    'TRUE',
    'The phrase “propensity to fade” means that celluloid dolls did lose their colour.
This supports the statement, making it TRUE.',
    1,
    '{"explanation":"The phrase “propensity to fade” means that celluloid dolls did lose their colour.\nThis supports the statement, making it TRUE.","fromPassage":"However, celluloid fell out of favour because of its extreme\nflammability and propensity to fade in bright light.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a0b2d960-b89f-4753-9d3e-cc61e54a907b',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    12,
    'tfng',
    'Composition dolls lasted longer than the plastic dolls that were made in the 1940s.',
    NULL,
    'FALSE',
    'Plastic dolls of the 1940s were more durable than composition dolls, not less.
This contradicts the statement, so the correct answer is FALSE.',
    1,
    '{"explanation":"Plastic dolls of the 1940s were more durable than composition dolls, not less.\nThis contradicts the statement, so the correct answer is FALSE.","fromPassage":"They resembled composition dolls, but they were much more\ndurable.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3c0c9cc8-8313-48a1-9905-54b3e7ffa16d',
    'reading',
    '00d220b8-fd2e-4cc1-a6b5-272e14a2ecb6',
    13,
    'tfng',
    'Doll collectors prefer a doll to be dressed in its original clothing.',
    NULL,
    'NOT GIVEN',
    'The passage does not mention whether doll collectors prefer dolls to be dressed
in original clothing. There is no relevant sentence on this topic, so the answer is
NOT GIVEN',
    1,
    '{"explanation":"The passage does not mention whether doll collectors prefer dolls to be dressed\nin original clothing. There is no relevant sentence on this topic, so the answer is\nNOT GIVEN","fromPassage":"Although most dolls are now mass-manufactured using these modern materials, many modern dollmakers are still using the traditional materials of the past to make collectible dolls.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 19: The Development of Plastics
-- Source API ID: 1794
-- Generated: 2026-02-26T11:43:53.262Z
-- ============================================

-- ============================================
-- Day 19: The Development of Plastics - Part 1: The Development of Plastics
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'b3117bcb-9a59-4a3e-9c2d-fb09ea2084bd',
    'Day 19: The Development of Plastics - Part 1: The Development of Plastics',
    'Cambridge IELTS - The Development of Plastics',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    'b3117bcb-9a59-4a3e-9c2d-fb09ea2084bd',
    1,
    'The Development of Plastics',
    'The first plastics were developed as a substitute for natural rubber. Chemically, rubber is a polymer—a compound containing large molecules that are formed by the bonding of many smaller, simpler units, repeated over and over again. The same bonding principle—polymerization—is the basis of the creation of a huge range of plastics by the chemical industry.

The first plastic was developed as a result of a competition in the USA. In the 1860s, $10,000 was offered to anybody who could replace ivory—supplies of which were declining—with something equally good as a material for making billiard balls. The prize was won by John Wesley Hyatt, with a material called celluloid. Celluloid was made by dissolving cellulose, a carbohydrate obtained from plants, in a solution of camphor dissolved in ethanol. This new material rapidly found other applications in the manufacture of everyday products such as knife handles and detachable collars and cuffs. But perhaps the best-known celluloid product was photographic film, without which the film industry could never have taken off at the end of the 19th century.

Celluloid can be repeatedly softened and reshaped by heat, and is known as a thermoplastic. In 1907, Leo Baekeland (1863-1944), a Belgian chemist working in the USA, invented a different kind of plastic, by causing phenol and formaldehyde to react together. Baekeland called it Bakelite, and it was the first of the thermosets—plastic that can be cast and moulded while hot, but cannot be softened by heat and reshaped once they have set. Bakelite was a good insulator, and was resistant to water and acid. With these properties it was soon being used in the manufacture of electrical switches as well as a variety of domestic items.

As the century went on, the range of newly developed plastics increased. Chemists began looking for other small molecules that could be strung together to make polymers. In the 1930s, chemists in Britain discovered that the gas ethylene would polymerize under heat and pressure to form a thermoplastic they called polythene. Polypropylene followed in the 1950s. Both are used to make bottles, pipes, and plastic bags. A small change in the starting material—replacing a hydrogen atom in ethylene with a chlorine atom—produced rigid PVC (polyvinyl chloride), a fireproof plastic suitable for drains and gutters. By adding certain chemicals, a soft form of PVC can be produced, suitable as a substitute for rubber in items such as waterproof clothing. A closely related plastic is Teflon or PTFE (polytetrafluoroethylene). It produces very little friction, making it ideal for products such as non-stick frying pans.

Polystyrene, a hard, clear material like glass, was developed during the 1930s in Germany, and its applications included food containers and toys. Expanded polystyrene is rigid and is widely used in packaging and insulation. Polyurethane, developed in the same country, was commonly produced as a foam which was very useful in the production of insulating materials.

In the 1930s, the first of the man-made fibres was created—nylon. Its inventor was a chemist called Wallace Carothers (1896-1937), who worked for the Du Pont company in the USA. He found that under the right conditions two particular chemicals would form a polymer that could be pumped out through holes and then stretched to form long glossy threads that could be woven like silk. Its first use was to make parachutes for the US armed forces in World War II. In the postwar years, it completely replaced silk in the manufacture of stockings.

Many other synthetic fibres joined nylon, including Orion, Acrilan, and Terylene. Today most garments are made of a blend of natural fibres, such as cotton and wool, and man-made fibres that make fabrics easier to look after.

Despite its enormous usefulness, plastic has its drawbacks. In fact, one of its great strengths—its indestructibility—is its greatest disadvantage. Beaches all over the world, even on the remotest islands, are littered with plastic bottles that nothing can destroy. Nor is it very easy to recycle plastics, as different types of plastics are often found in the same items and call for different treatments. Plastics can be made biodegradable by incorporating into their structure a material such as starch, which is attacked by bacteria and causes the plastic to fall apart. Other materials can be incorporated that gradually decay in sunlight—although bottles made of such materials have to be stored in the dark, to ensure they do not disintegrate before they have been used.',
    734,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f09e8359-12ec-4221-8b78-ffbf075b68d5',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    1,
    'gap_fill',
    'Question 1',
    NULL,
    'photographic film',
    'The passage states that the best-known use of celluloid was photographic film.',
    1,
    '{"explanation":"The passage states that the best-known use of celluloid was photographic film.","fromPassage":"But perhaps the best-known celluloid product was photographic film, without which the film industry could never have taken off at the end of the 19th century.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c14004fb-8df7-4531-a3a6-6e36967d87a1',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    2,
    'gap_fill',
    'Question 2',
    NULL,
    'bakelite',
    'The second type of plastic mentioned (after celluloid) is Bakelite.',
    1,
    '{"explanation":"The second type of plastic mentioned (after celluloid) is Bakelite.","fromPassage":"Baekeland called it Bakelite, and it was the first of the thermosets—plastic that can be cast and moulded while hot, but cannot be softened by heat and reshaped once they have set.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2a94d892-c869-4b57-9369-8c82f46a5b02',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    3,
    'gap_fill',
    'Question 3',
    NULL,
    'electrical switches',
    'Bakelite was used to manufacture electrical switches.',
    1,
    '{"explanation":"Bakelite was used to manufacture electrical switches.","fromPassage":"With these properties it was soon being used in the manufacture of electrical switches as well as a variety of domestic items.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '927afe10-440e-4e14-b1e3-608752966fd0',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    4,
    'gap_fill',
    'Question 4',
    NULL,
    'Britain',
    'Polythene was developed in Britain.',
    1,
    '{"explanation":"Polythene was developed in Britain.","fromPassage":"In the 1930s, chemists in Britain discovered that the gas ethylene would polymerize under heat and pressure to form a thermoplastic they called polythene.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3661d011-1c25-424f-bba5-735160e75e87',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    5,
    'gap_fill',
    'Question 5',
    NULL,
    'fireproof',
    'Rigid PVC is described as a fireproof plastic.',
    1,
    '{"explanation":"Rigid PVC is described as a fireproof plastic.","fromPassage":"A small change in the starting material—replacing a hydrogen atom in ethylene with a chlorine atom—produced rigid PVC (polyvinyl chloride), a fireproof plastic suitable for drains and gutters.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'df365c17-b6ab-4cf2-b86b-16a40d378076',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    6,
    'gap_fill',
    'Question 6',
    NULL,
    'glass',
    'Polystyrene resembles glass.',
    1,
    '{"explanation":"Polystyrene resembles glass.","fromPassage":"Polystyrene, a hard, clear material like glass, was developed during the 1930s in Germany, and its applications included food containers and toys.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '732c1860-de45-4d4f-81d7-0d0caa7c5893',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    7,
    'gap_fill',
    'Question 7',
    NULL,
    'foam',
    'Polyurethane was commonly produced as a foam.',
    1,
    '{"explanation":"Polyurethane was commonly produced as a foam.","fromPassage":"Polyurethane, developed in the same country, was commonly produced as a foam which was very useful in the production of insulating materials.","instruction":"<p>Complete the table. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p><p><br></p><h2>                              Early Types of Plastic</h2>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4fd13a02-a6d2-4170-83f3-b599c3dd4d07',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    8,
    'tfng',
    'The chemical structure of rubber is very different to that of plastics.',
    NULL,
    'FALSE',
    'The passage says rubber and plastics share the same bonding principle—polymerization—so they are not chemically very different in structure.',
    1,
    '{"explanation":"The passage says rubber and plastics share the same bonding principle—polymerization—so they are not chemically very different in structure.","fromPassage":"Chemically, rubber is a polymer—a compound containing large molecules that are formed by the bonding of many smaller, simpler units, repeated over and over again.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '63ef6ff4-d4e6-4333-8e8d-48803df09e6e',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    9,
    'tfng',
    'John Wesley Hyatt was an industrial chemist.',
    NULL,
    'NOT GIVEN',
    'The text does not state whether Hyatt was an industrial chemist or not.',
    1,
    '{"explanation":"The text does not state whether Hyatt was an industrial chemist or not.","fromPassage":"The prize was won by John Wesley Hyatt, with a material called celluloid. Celluloid was made by dissolving cellulose, a carbohydrate obtained from plants, in a solution of camphor dissolved in ethanol.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bb8b2b44-8861-4f85-8e2d-6bffb0348576',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    10,
    'tfng',
    ' Celluloid and Bakelite react in the same way to heat.',
    NULL,
    'FALSE',
    'Celluloid softens with heat; Bakelite cannot be softened after setting. They react differently.',
    1,
    '{"explanation":"Celluloid softens with heat; Bakelite cannot be softened after setting. They react differently.","fromPassage":"Celluloid can be repeatedly softened and reshaped by heat, and is known as a thermoplastic.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9345391a-aa19-48bb-80eb-ead2e471ed91',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    11,
    'tfng',
    'If an object is made of several plastics, these prove hard to break down and reuse.',
    NULL,
    'TRUE',
    'Objects made from several different plastics are hard to recycle because each plastic needs a different treatment.',
    1,
    '{"explanation":"Objects made from several different plastics are hard to recycle because each plastic needs a different treatment.","fromPassage":"Nor is it very easy to recycle plastics, as different types of plastics are often found in the same items and call for different treatments.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7fb52e16-e353-4b6c-85d8-a6ed88050c8d',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    12,
    'tfng',
    'Adding starch to plastic makes it more durable.',
    NULL,
    'FALSE',
    'Adding starch does not make plastic more durable — it makes it biodegradable (breaks apart).',
    1,
    '{"explanation":"Adding starch does not make plastic more durable — it makes it biodegradable (breaks apart).","fromPassage":"Plastics can be made biodegradable by incorporating into their structure a material such as starch, which is attacked by bacteria and causes the plastic to fall apart.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6a23a48e-00ae-4924-a08a-86553b171704',
    'reading',
    '6fff60a3-72e3-4a50-a274-d4076ce29871',
    13,
    'tfng',
    'Containers which are designed to decompose need particular storage conditions.',
    NULL,
    'TRUE',
    'Plastics designed to decay in sunlight must be stored in darkness.',
    1,
    '{"explanation":"Plastics designed to decay in sunlight must be stored in darkness.","fromPassage":"Other materials can be incorporated that gradually decay in sunlight—although bottles made of such materials have to be stored in the dark, to ensure they do not disintegrate before they have been used.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 17: Lean Production Innovation – in Manufacturing Systems
-- Source API ID: 1795
-- Generated: 2026-02-26T11:43:56.403Z
-- ============================================

-- ============================================
-- Day 17: Lean Production Innovation – in Manufacturing Systems - Part 2: Lean Production Innovation – in Manufacturing Systems
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '6c42dc82-8193-4cca-aa32-994251e11ab8',
    'Day 17: Lean Production Innovation – in Manufacturing Systems - Part 2: Lean Production Innovation – in Manufacturing Systems',
    'Cambridge IELTS - Lean Production Innovation – in Manufacturing Systems',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'a57bac95-17bd-451c-b216-d2a75d711807',
    '6c42dc82-8193-4cca-aa32-994251e11ab8',
    1,
    'Lean Production Innovation – in Manufacturing Systems',
    ' 
[HEADING: A]
After the First World War, car makers Henry Ford and Arthur Sloan of General Motors moved world manufacturing from centuries of craft production into the age of mass production. Largely as a result of this, the United States soon dominated the world economy. After the Second World War, and approximately a hundred years after Japan opened up to the modern world, Eiji Toyoda and Taiichi Ohno pioneered the concept of lean production at the Toyota car company. And now, although superimposing the method on existing mass production systems causes pain and upheaval, manufacturers around the world are trying to embrace this innovative system.

 
[HEADING: B] 
Perhaps the best way to describe lean production is to compare it with the two other major manufacturing systems: craft production and mass production. The craft producer uses highly skilled workers and simple but flexible tools to make exactly what the customer asks for – one item at a time. A present-day example of this method is the customised production of a few exotic sports cars. The concept of craft production remains very popular, but the problem with it is obvious. Goods produced by the craft method – as cars once exclusively were – cost too much for most of us to afford. So at the beginning of the twentieth century, mass production was developed as an alternative method. The mass producer uses narrowly skilled professionals to design products which are then made by unskilled or semi-skilled workers, using expensive, single-purpose machines. These churn out standardised products in very high volumes. Because the machinery costs so much, and is so intolerant of disruption, the mass producer keeps standard designs in production for as long as possible. The result is that the customer gets lower costs, but at the expense of variety, and by means of work methods which most employees find boring and dispiriting. By contrast, the lean production system combines the advantages of craft and mass production, while avoiding the high cost of the former and the rigidity of the latter. Towards this end, companies appoint teams of multi-skilled workers to all levels of the organisation, and use highly flexible and increasingly automated machines to produce goods in enormous volume and variety.

 
[HEADING: C]
Lean production is so called because, compared with mass production, it uses less of everything – half the human effort in the factory, half the manufacturing space, half the investment in tools, and half the engineering hours to develop the new product. It also results in far fewer defects.

 
[HEADING: D] 
Perhaps the most striking contrast between mass and lean production systems lies in their production standards. Mass producers set a limited goal for themselves: ''good enough'', which translates into an acceptable number of defects, a maximum acceptable number of inventories, and a narrow range of standardised products. Lean producers, on the other hand, are unwilling to compromise standards in any of these areas.

 
[HEADING: E] 
Although cost reduction is the primary objective of the lean production system, it must meet three other intermediate objectives in order to achieve this: quantity control, quality assurance and respect for humanity. Firstly, the system must be able to adapt to daily and monthly fluctuations in demand. Secondly, each separate process must supply only good units to the subsequent process. Thirdly, in as far as the system uses human resources to attain its cost objectives, respect for human needs must be cultivated. It should be emphasised that none of these three objectives can be achieved separately.

 
[HEADING: F] 
The continuous flow of lean manufacturing production relies on two practical mechanisms: just-in-time and autonamation. Just-in-time means, for example, that in the process of assembling the parts to build a car, components from the preceding process should arrive at the next part of the line at exactly the right time and in the correct quantities. If just-in-time is fully realised throughout the company, then superfluous inventories are completely eliminated from the factory, making stores or warehouses unnecessary. However, relying solely on a central planning approach to control schedules for all stages of the production process simultaneously is very difficult in the case of cars, which consist of thousands of parts. So the lean system looks at the production flow in reverse; in other words, employees go to the preceding process to withdraw the necessary quantity of units at the appropriate time. The preceding process must produce only sufficient quantities of units to replace those that have been withdrawn, and in turn withdraws the requisite number of components from the process that precedes it.

 
[HEADING: G] 
Autonamation is the automatic checking for abnormalities in the production process. In order to realise just-in-time perfectly, only units which are in perfect condition must be allowed to flow to the next process, and this flow must be regular and uninterrupted. In other words, quality control must coexist with just-in-time procedures throughout the system. Autonamation involves building in a mechanism to prevent the multiplication of defects in machines or product lines. For example, in Toyota factories almost all the machines have been fitted with stopping devices, and the concept of autonamation has been extended to manual production lines. If something abnormal happens there, the worker pushes a button to stop the whole line, and lights, which are hung so high in the factory that they are visible to everyone, indicate the position of the problem.',
    896,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd525380a-3797-4078-9a4a-a9b0c3ae4ba6',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    14,
    'matching_headings',
    'Question 14',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'B',
    'Paragraph A describes the history of manufacturing: craft → mass → lean production.',
    1,
    '{"explanation":"Paragraph A describes the history of manufacturing: craft → mass → lean production.","fromPassage":"After the First World War, car makers Henry Ford and Arthur Sloan of General Motors moved world manufacturing from centuries of craft production into the age of mass production.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3773aa26-2037-4dd1-97ed-f6b11c849210',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    15,
    'matching_headings',
    'Question 15',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'D',
    'Paragraph B compares craft production, mass production, and lean production, including advantages and disadvantages.',
    1,
    '{"explanation":"Paragraph B compares craft production, mass production, and lean production, including advantages and disadvantages.","fromPassage":"By contrast, the lean production system combines the advantages of craft and mass production, while avoiding the high cost of the former and the rigidity of the latter.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1d9d8d57-3e04-417d-a439-a6bb328830eb',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    16,
    'matching_headings',
    'Question 16',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'G',
    'Paragraph C explains why it is called “lean” production: because it uses less of everything.',
    1,
    '{"explanation":"Paragraph C explains why it is called “lean” production: because it uses less of everything.","fromPassage":"Lean production is so called because, compared with mass production, it uses less of everything – half the human effort in the factory, half the manufacturing space, half the investment in tools, and half the engineering hours to develop the new product.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f3c82e4c-b839-4165-b24a-a84c538a38d2',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    17,
    'matching_headings',
    'Question 17',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'H',
    'Paragraph D contrasts quality standards between mass production (“good enough”) and lean production (no compromise).',
    1,
    '{"explanation":"Paragraph D contrasts quality standards between mass production (“good enough”) and lean production (no compromise).","fromPassage":"Lean producers, on the other hand, are unwilling to compromise standards in any of these areas.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '84f22ea1-b215-4fd6-a069-728fc7cf20d1',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    18,
    'matching_headings',
    'Question 18',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'J',
    'Paragraph E lists three objectives that must work together to reduce costs.',
    1,
    '{"explanation":"Paragraph E lists three objectives that must work together to reduce costs.","fromPassage":"It should be emphasised that none of these three objectives can be achieved separately.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '99b037e5-5e55-466d-909e-25667f352a14',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    19,
    'matching_headings',
    'Question 19',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'I',
    'Paragraph F explains the just-in-time system — controlling when and how supplies move between processes.',
    1,
    '{"explanation":"Paragraph F explains the just-in-time system — controlling when and how supplies move between processes.","fromPassage":"If just-in-time is fully realised throughout the company, then superfluous inventories are completely eliminated from the factory, making stores or warehouses unnecessary. However, relying solely on a central planning approach to control schedules for all stages of the production process simultaneously is very difficult in the case of cars, which consist of thousands of parts.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '70b43aea-e65c-40cf-b7d8-e3291d5d2c5a',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    20,
    'matching_headings',
    'Question 20',
    '["Global resistance to lean manufacturing","The historical context","Procedures for controlling quality","The pros and cons of different production systems","Working conditions","The impact on profits","The origin of the term","A crucial difference in levels of quality","Procedures for controlling supply","Interdependent strategies for controlling expenditure"]'::jsonb,
    'C',
    'Paragraph G explains autonamation, which is automatic quality checking.',
    1,
    '{"explanation":"Paragraph G explains autonamation, which is automatic quality checking.","fromPassage":"Autonamation is the automatic checking for abnormalities in the production process.","instruction":"<p>The text has<strong>&nbsp;SEVEN</strong>&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ffd411aa-8ed5-4dc6-ad48-c2f6a8d1f1a6',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    21,
    'gap_fill',
    'Question 21',
    NULL,
    'craft production',
    'Paragraph B says exotic sports cars are still produced using craft production.',
    1,
    '{"explanation":"Paragraph B says exotic sports cars are still produced using craft production.","fromPassage":"A present-day example of this method is the customised production of a few exotic sports cars.","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd2117d6d-f2af-453b-9e6f-52988428832b',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    22,
    'gap_fill',
    'Question 22',
    NULL,
    'multi-skilled',
    'Lean production uses teams of multi-skilled workers.',
    1,
    '{"explanation":"Lean production uses teams of multi-skilled workers.","fromPassage":"Towards this end, companies appoint teams of multi-skilled workers to all levels of the organisation","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '539854df-f629-4595-8d6b-2e3590fd2946',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    23,
    'gap_fill',
    'Question 23',
    NULL,
    'manufacturing space',
    'Lean production uses half the manufacturing space.',
    1,
    '{"explanation":"Lean production uses half the manufacturing space.","fromPassage":"Lean production is so called because, compared with mass production, it uses less of everything – half the human effort in the factory, half the manufacturing space, half the investment in tools, and half the engineering hours to develop the new product.","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '16803f48-eb5b-4205-8280-eae38f59fd74',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    24,
    'gap_fill',
    'Question 24',
    NULL,
    'just-in-time',
    'If just-in-time is used, inventories are eliminated and no storage is needed.',
    1,
    '{"explanation":"If just-in-time is used, inventories are eliminated and no storage is needed.","fromPassage":"If just-in-time is fully realised throughout the company, then superfluous inventories are completely eliminated from the factory, making stores or warehouses unnecessary.","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a9c21e0d-8771-46cc-a77b-755c480ca353',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    25,
    'gap_fill',
    'Question 25',
    NULL,
    'abnormalities',
    'Autonamation is designed to detect abnormalities.',
    1,
    '{"explanation":"Autonamation is designed to detect abnormalities.","fromPassage":"Autonamation is the automatic checking for abnormalities in the production process.","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f8ee7b12-3782-49d9-ace9-d550a7fb1105',
    'reading',
    'a57bac95-17bd-451c-b216-d2a75d711807',
    26,
    'gap_fill',
    'Question 26',
    NULL,
    'lights',
    'Lights hang above lines to show where a problem occurred.',
    1,
    '{"explanation":"Lights hang above lines to show where a problem occurred.","fromPassage":"If something abnormal happens there, the worker pushes a button to stop the whole line, and lights, which are hung so high in the factory that they are visible to everyone, indicate the position of the problem.","instruction":"<p>Complete the sentences.&nbsp;Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<p>A small number of unusual cars are still produced by the&nbsp; ______ &nbsp;method.</p><p>Lean production requires staff who are ______ &nbsp;.</p><p>Lean production employs fewer people, and uses less ______ , equipment and time.</p><p>Storage facilities are not needed if a procedure known as&nbsp; ______ &nbsp;is implemented in the lean production method.</p><p>Autonamation is a procedure for spotting any&nbsp; ______ &nbsp;in the products on a production line.</p><p>At Toyota factories,&nbsp; ______ &nbsp;are suspended above manual production lines in order to show where production has to be halted.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 12: Jean Piaget 1896 – 1980
-- Source API ID: 1796
-- Generated: 2026-02-26T11:43:59.550Z
-- ============================================

-- ============================================
-- Day 12: Jean Piaget 1896 – 1980 - Part 3: Jean Piaget 1896 – 1980
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '49df71a9-274a-4d33-89c4-b286e3a6424a',
    'Day 12: Jean Piaget 1896 – 1980 - Part 3: Jean Piaget 1896 – 1980',
    'Cambridge IELTS - Jean Piaget 1896 – 1980',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    '49df71a9-274a-4d33-89c4-b286e3a6424a',
    1,
    'Jean Piaget 1896 – 1980',
    'Seymour Papert looks at the work of the pioneering Swiss philosopher and psychologist

Jean Piaget spent much of his professional life listening to children, watching children and poring over reports of researchers around the world who were doing the same. He found, to put it most succinctly, that children don''t think like grown-ups. After thousands of interactions with young people often barely old enough to talk, Piaget began to suspect that behind their cute and seemingly irrational utterances were thought processes that had their own kind of order and their own special logic. Einstein called it a discovery ''so simple that only a genius could have thought of it.''

Although not an educational reformer, Piaget championed a way of thinking about children that provided the foundation for today''s education-reform movements. It was a shift comparable to the way modern anthropology displaced stories of primitive tribes being ''noble savages'' and ''cannibals''. One might say that Piaget was the first to take children''s thinking seriously.

He has been revered by generations of teachers inspired by the belief that children are not empty vessels to be filled with knowledge (as traditional pedagogical theory had it) but active builders of knowledge—little scientists who are constantly creating and testing their own hypotheses about the world. And though he may not be as famous as Sigmund Freud or even B.F. Skinner, his influence on psychology may be longer lasting.

In 1920, while doing research in a child-psychology laboratory in Paris, Piaget noticed that children of the same age made similar errors on intelligence tests. Fascinated by their reasoning processes, he began to suspect that the key to human knowledge might be discovered by observing how the child''s mind develops. On his return to Switzerland he began watching children play, scrupulously recording their words and actions as their minds raced to find reasons for why things are the way they are. In one of his most famous experiments, Piaget asked children, ''What makes the wind?'' A typical dialogue would be:
Piaget: What makes the wind?
Julia: The trees.
Piaget: How do you know?
Julia: I saw them waving their arms.
Piaget: How does that make the wind?
Julia: (waving her hand in front of his face): Like this. Only they are bigger. And there are lots of trees.

Piaget recognized that five-year-old Julia''s beliefs, while not correct by any adult criterion, are not ''incorrect'' either. They are entirely sensible and coherent within the framework of the child''s way of knowing. Classifying them as ''true'' or ''false'' misses the point and shows a lack of respect for the child. What Piaget was after was a theory that the wind dialogue demonstrated coherence, ingenuity and the practice of a kind of explanatory principle (in this case by referring to body actions) that stands young children in very good stead when they don''t know enough or don''t have enough skill to handle the kind of explanation that grown-ups prefer.

Piaget was not an educator and never laid down rules about how to intervene in such situations. But his work strongly suggests that the automatic reaction of putting the child right may well be counter-productive. If their theories are always greeted by ''Nice try, but this is how it really is...'' they might give up after a while on making theories. As Piaget put it, ''children have real understanding only of that which they invent themselves, and each time that we try to teach them something too quickly, we keep them from inventing it themselves.''

Disciples of Piaget have a tolerance for—indeed a fascination with—children''s primitive laws of physics: that things disappear when they are out of sight; that the moon and the sun follow you around; that big things float and small things sink. Einstein was intrigued by Piaget''s findings, especially by the idea that seven-year-olds insist that going faster can take more time—perhaps because this, like Einstein''s own theories of relativity, runs so contrary to common sense.

Although every teacher in training still memorizes Piaget''s successive stages of childhood development, the greater part of Piaget''s work is less well known, perhaps because schools of education regard it as ''too deep'' for teachers. Piaget never thought of himself as a child psychologist. His real interest was epistemology—the theory of knowledge—which, like physics, was considered a branch of philosophy until Piaget came along and made it a science.

Through epistemology, Piaget explored multiple ways of knowing. He acknowledged them and examined them non-judgementally, yet with a philosopher''s analytic rigour. Since Piaget, the territory has been widely colonized by those who write about women''s ways of knowing, Afrocentric ways of knowing, even the computer''s ways of knowing. Indeed, artificial intelligence and the information-processing model of the mind owe more to Piaget than its proponents may realize.

The core of Piaget''s work is his belief that looking carefully at how knowledge develops in children will elucidate the nature of knowledge in general. Whether this has in fact led to deeper understanding remains, like everything about Piaget, controversial. In the past decade, Piaget has been vigorously challenged by the current fashion of viewing knowledge as an intrinsic property of the brain. Ingenious experiments have demonstrated that newborn infants already have some of the knowledge that Piaget believed children constructed. But for those, like me, who still see Piaget as the giant in the field of cognitive theory, the difference between what the baby brings and what the adult has is so immense that the new discoveries do not significantly reduce the gap, but only increase the mystery.',
    923,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b28fe825-1537-48f2-814b-f08021775506',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    27,
    'mcq_single',
    'Question 27',
    '["the universality of Piaget''s insights into the workings of the mind.","the similarity between children''s thought processing in different cultures.","how Piaget''s work represents a crucial turning-point in our approach to education.","how Piaget''s work has aided our understanding of man''s evolution from primitive origins."]'::jsonb,
    'C',
    'The anthropology example shows a major shift in how we view children’s thinking—just like anthropology changed how we viewed primitive tribes. This illustrates Piaget’s role in transforming modern approaches to children and education.',
    1,
    '{"explanation":"The anthropology example shows a major shift in how we view children’s thinking—just like anthropology changed how we viewed primitive tribes. This illustrates Piaget’s role in transforming modern approaches to children and education.","fromPassage":"Although not an educational reformer, Piaget championed a way of thinking about children that provided the foundation for today''s education-reform movements. It was a shift comparable to the way modern anthropology displaced stories of primitive tribes being ''noble savages'' and ''cannibals''.","instruction":"<p>Choose the correct answer.</p>","context":"<p>In the second paragraph the writer mentions the example of modern anthropology to</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ce128e9f-e624-4dcd-8cb6-24f23eb66834',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    28,
    'mcq_single',
    'Question 28',
    '["The factual accuracy of what children say is of minor significance.","Children want to learn about scientific principles.","Children''s reasoning processes can be amusing to adults.","Children often pretend that they know the answers to questions."]'::jsonb,
    'A',
    'The writer explains that judging children’s answers as true or false “misses the point”—accuracy is not the main issue. What matters is the logic behind their thinking.',
    1,
    '{"explanation":"The writer explains that judging children’s answers as true or false “misses the point”—accuracy is not the main issue. What matters is the logic behind their thinking.","fromPassage":"Piaget recognized that five-year-old Julia''s beliefs, while not correct by any adult criterion, are not ''incorrect'' either.","instruction":"<p>Choose the correct answer.</p>","context":"<p>According to the writer, what point is illustrated by the dialogue about the wind?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '473bfb4e-ec3f-4dd5-b3b2-436f67e5e598',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    29,
    'mcq_single',
    'Question 29',
    '[" preventing children from making false assumptions.","giving children honest feedback on their hypotheses.","showing children how to formulate their own ideas about the world.","maintaining children''s confidence in their ability to interpret the world."]'::jsonb,
    'D',
    'Piaget warned adults not to quickly correct children because doing so may discourage them. He wanted to maintain children’s confidence in developing their own understanding.',
    1,
    '{"explanation":"Piaget warned adults not to quickly correct children because doing so may discourage them. He wanted to maintain children’s confidence in developing their own understanding.","fromPassage":"If their theories are always greeted by ''Nice try, but this is how it really is...'' they might give up after a while on making theories.","instruction":"<p>Choose the correct answer. </p>","context":"<p>Piaget believed in the importance of</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0ce81e2e-70d9-48e9-9bd0-ee3c5ec48c06',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    30,
    'mcq_single',
    'Question 30',
    '["Children''s sense of their surroundings changes as they get older.","Children are able to grasp certain complex ideas as well as adults are.","Even apparently irrational ideas can be worthy of interest."," Sometimes the simplest explanations are the best."]'::jsonb,
    'C',
    'The writer says Piaget’s followers value children’s irrational ideas—like thinking the sun follows them—showing that these ideas have meaning and are worthy of study.',
    1,
    '{"explanation":"The writer says Piaget’s followers value children’s irrational ideas—like thinking the sun follows them—showing that these ideas have meaning and are worthy of study.","fromPassage":"Disciples of Piaget have a tolerance for—indeed a fascination with—children''s primitive laws of physics: that things disappear when they are out of sight; that the moon and the sun follow you around; that big things float and small things sink.","instruction":"<p>Choose the correct answer.</p>","context":"<p>&nbsp;What does the writer suggest in the seventh paragraph?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4ece5a15-d8f4-4450-8b23-863f03b39d97',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    31,
    'mcq_single',
    'Question 31',
    '["outline Piaget''s contribution to a range of scientific fields.","summarize how education has benefited from Piaget''s findings.","discuss Piaget''s role in the development of 20th-century psychology.","express doubts about a number of Piaget''s theories."]'::jsonb,
    'C',
    'The passage focuses on Piaget’s influence on psychology as a field—his theories, his methods, and how his work reshaped cognitive science.',
    1,
    '{"explanation":"The passage focuses on Piaget’s influence on psychology as a field—his theories, his methods, and how his work reshaped cognitive science.","fromPassage":"And though he may not be as famous as Sigmund Freud or even B.F. Skinner, his influence on psychology may be longer lasting.","instruction":"<p>Choose the correct answer. </p>","context":"<p>The writer’s main purpose is to</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b61ca262-d730-49b3-8281-6b06ed7bd3ed',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    32,
    'summary_completion',
    'Question 32',
    '["theories","brain","simple","teachers","psychology","logical ","thought","philosophers"]'::jsonb,
    'logical',
    'Piaget believed children’s thinking had its own structure and logic.',
    1,
    '{"explanation":"Piaget believed children’s thinking had its own structure and logic.","fromPassage":"Piaget began to suspect that behind their cute and seemingly irrational utterances were thought processes that had their own kind of order and their own special logic.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3 class=\"ql-align-center\">Piaget''s Theories on Children''s Cognitive Development</h3><p>Piaget maintained that children''s mental processes were far more&nbsp; ______ &nbsp;than they might appear. He encouraged the view that a child was not a ''blank slate'' waiting to be filled with information, but rather a systematic builder of knowledge who regularly tries out his or her own&nbsp; ______ &nbsp;about the world. Piaget''s impact on the area of&nbsp; ______ &nbsp;could well outlast that of more celebrated pioneers of this discipline. Despite doubts cast over his ideas by the current view associating knowledge exclusively with the ______ , the effects of his work are still strong today. His principles are still widely used in the professional development of&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f539ae11-675a-45f9-8a8f-dcbf65c084f2',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    33,
    'summary_completion',
    'Question 33',
    '["theories","brain","simple","teachers","psychology","logical ","thought","philosophers"]'::jsonb,
    'theories',
    'Piaget saw children as “little scientists” forming and testing their own theories.',
    1,
    '{"explanation":"Piaget saw children as “little scientists” forming and testing their own theories.","fromPassage":"He has been revered by generations of teachers inspired by the belief that children are not empty vessels to be filled with knowledge (as traditional pedagogical theory had it) but active builders of knowledge","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3 class=\"ql-align-center\">Piaget''s Theories on Children''s Cognitive Development</h3><p>Piaget maintained that children''s mental processes were far more&nbsp; ______ &nbsp;than they might appear. He encouraged the view that a child was not a ''blank slate'' waiting to be filled with information, but rather a systematic builder of knowledge who regularly tries out his or her own&nbsp; ______ &nbsp;about the world. Piaget''s impact on the area of&nbsp; ______ &nbsp;could well outlast that of more celebrated pioneers of this discipline. Despite doubts cast over his ideas by the current view associating knowledge exclusively with the ______ , the effects of his work are still strong today. His principles are still widely used in the professional development of&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd266695d-e379-40ce-adff-195674c740f5',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    34,
    'summary_completion',
    'Question 34',
    '["theories","brain","simple","teachers","psychology","logical ","thought","philosophers"]'::jsonb,
    'psychology',
    'The passage highlights Piaget’s lasting impact on psychology.',
    1,
    '{"explanation":"The passage highlights Piaget’s lasting impact on psychology.","fromPassage":"And though he may not be as famous as Sigmund Freud or even B.F. Skinner, his influence on psychology may be longer lasting.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3 class=\"ql-align-center\">Piaget''s Theories on Children''s Cognitive Development</h3><p>Piaget maintained that children''s mental processes were far more&nbsp; ______ &nbsp;than they might appear. He encouraged the view that a child was not a ''blank slate'' waiting to be filled with information, but rather a systematic builder of knowledge who regularly tries out his or her own&nbsp; ______ &nbsp;about the world. Piaget''s impact on the area of&nbsp; ______ &nbsp;could well outlast that of more celebrated pioneers of this discipline. Despite doubts cast over his ideas by the current view associating knowledge exclusively with the ______ , the effects of his work are still strong today. His principles are still widely used in the professional development of&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4d03a949-f397-4805-ab88-3ca9aace798f',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    35,
    'summary_completion',
    'Question 35',
    '["theories","brain","simple","teachers","psychology","logical ","thought","philosophers"]'::jsonb,
    'brain',
    'The passage explains that some recent scientists consider knowledge to be something the brain inherently contains.',
    1,
    '{"explanation":"The passage explains that some recent scientists consider knowledge to be something the brain inherently contains.","fromPassage":"In the past decade, Piaget has been vigorously challenged by the current fashion of viewing knowledge as an intrinsic property of the brain.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3 class=\"ql-align-center\">Piaget''s Theories on Children''s Cognitive Development</h3><p>Piaget maintained that children''s mental processes were far more&nbsp; ______ &nbsp;than they might appear. He encouraged the view that a child was not a ''blank slate'' waiting to be filled with information, but rather a systematic builder of knowledge who regularly tries out his or her own&nbsp; ______ &nbsp;about the world. Piaget''s impact on the area of&nbsp; ______ &nbsp;could well outlast that of more celebrated pioneers of this discipline. Despite doubts cast over his ideas by the current view associating knowledge exclusively with the ______ , the effects of his work are still strong today. His principles are still widely used in the professional development of&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6a1f12bf-1109-43de-90f8-f2682bb7e12d',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    36,
    'summary_completion',
    'Question 36',
    '["theories","brain","simple","teachers","psychology","logical ","thought","philosophers"]'::jsonb,
    'teachers',
    'Piaget’s developmental stages are still taught to educators today.',
    1,
    '{"explanation":"Piaget’s developmental stages are still taught to educators today.","fromPassage":"Although every teacher in training still memorizes Piaget''s successive stages of childhood development, the greater part of Piaget''s work is less well known","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3 class=\"ql-align-center\">Piaget''s Theories on Children''s Cognitive Development</h3><p>Piaget maintained that children''s mental processes were far more&nbsp; ______ &nbsp;than they might appear. He encouraged the view that a child was not a ''blank slate'' waiting to be filled with information, but rather a systematic builder of knowledge who regularly tries out his or her own&nbsp; ______ &nbsp;about the world. Piaget''s impact on the area of&nbsp; ______ &nbsp;could well outlast that of more celebrated pioneers of this discipline. Despite doubts cast over his ideas by the current view associating knowledge exclusively with the ______ , the effects of his work are still strong today. His principles are still widely used in the professional development of&nbsp; ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '85c1c31a-39b5-4f94-820f-1d63abcd2c63',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    37,
    'tfng',
    'Piaget''s early work in Paris involved innovative research techniques.',
    NULL,
    'NOT GIVEN',
    'The text describes Piaget’s early work in Paris but does NOT state whether his research techniques were innovative.',
    1,
    '{"explanation":"The text describes Piaget’s early work in Paris but does NOT state whether his research techniques were innovative.","fromPassage":"In 1920, while doing research in a child-psychology laboratory in Paris, Piaget noticed that children of the same age made similar errors on intelligence tests.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '104c4fbe-6f2f-4732-bbd8-130b599c93a6',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    38,
    'tfng',
    'Piaget gave clear guidelines as to how adults should give information to children.',
    NULL,
    'NO',
    'The text explicitly says Piaget never gave rules about how adults should instruct children.',
    1,
    '{"explanation":"The text explicitly says Piaget never gave rules about how adults should instruct children.","fromPassage":"Piaget was not an educator and never laid down rules about how to intervene in such situations.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9ea7e3d7-7ade-413f-a7c9-24c7c6d3ff4f',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    39,
    'tfng',
    'Piaget made a significant contribution to the field of epistemology.',
    NULL,
    'YES',
    'Piaget treated epistemology as a science and contributed to new ways of examining knowledge.',
    1,
    '{"explanation":"Piaget treated epistemology as a science and contributed to new ways of examining knowledge.","fromPassage":"His real interest was epistemology—the theory of knowledge—which, like physics, was considered a branch of philosophy until Piaget came along and made it a science.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c177d7e6-b335-420d-ad2e-97a63b89281e',
    'reading',
    'a5f17eca-0896-41be-8e5e-f108f53eab6a',
    40,
    'tfng',
    'We still have much to learn about the nature of knowledge.',
    NULL,
    'YES',
    'The writer ends by saying the difference between baby and adult knowledge is so vast that new discoveries “increase the mystery.” This shows we still have much to learn.',
    1,
    '{"explanation":"The writer ends by saying the difference between baby and adult knowledge is so vast that new discoveries “increase the mystery.” This shows we still have much to learn.","fromPassage":"But for those, like me, who still see Piaget as the giant in the field of cognitive theory, the difference between what the baby brings and what the adult has is so immense that the new discoveries do not significantly reduce the gap, but only increase the mystery.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 13: Deep Sea Discovery
-- Source API ID: 1797
-- Generated: 2026-02-26T11:44:02.476Z
-- ============================================

-- ============================================
-- Day 13: Deep Sea Discovery - Part 1: Deep Sea Discovery
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'f2abd209-73c1-457f-91b0-4e47edd28615',
    'Day 13: Deep Sea Discovery - Part 1: Deep Sea Discovery',
    'Cambridge IELTS - Deep Sea Discovery',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    'f2abd209-73c1-457f-91b0-4e47edd28615',
    1,
    'Deep Sea Discovery',
    'Nico Michiels is an ecologist from the University of Tubingen in Germany who spends part of each year in Egypt, where he dives in the Red Sea, observing fish life and gathering data on its coral reefs. In September 2007 he decided to find out how far red light could penetrate the ocean depths. Seawater absorbs different colours at different depths, and as an experienced diver, Michiels was aware that red light is extinguished not far below the surface whereas blue-green light penetrates deeper. To find out the depth at which red disappeared in this particular ocean, however, he attached a special plastic filter to his dive mask which was designed to block out all colours except red. Then he began to descend. In theory, once he reached about 15 metres, he should have been plunged into darkness. Instead, something totally unexpected happened. Sure enough, 20 metres down it was as dark as night. ''All the fish disappeared. With no light from the surface, they were effectively black and had become invisible,'' he says. But it didn''t stay black for long. Then I saw a group of goby fish with bright red eyes lit up against the background. After that red spots began to show up all over the reef.

Even with the red filter removed, Michiels could pick them out without much trouble once his eyes grew accustomed to the gloom. It seems strange that no diver or researcher had spotted all this red before, but as Michiels points out, no one saw it because no one expected to see it. On that one dive Michiels discovered three fish species with prominent red markings, and has found many others since.

But how can fish appear red where there''s no red light? Ordinary red pigments look red because they reflect red light while absorbing all other wavelengths. At 20 metres down, there had to be some other explanation for the red Michiels was seeing. He suspected fluorescence. Fluorescent pigments behave differently from ordinary ones: they receive incoming light of one wavelength, for example blue, and emit light of a longer wavelength, in this case red. On the reef in the Red Sea during daytime, the most likely explanation was that the predominantly blue and green wavelengths at depth triggered the emission of fluorescent red in the fish.

With only a week left in Egypt, and lacking the equipment to confirm that the fish were fluorescent, Michiels photographed as many of them as he could. Then once back in Germany, he bought an assortment of tropical fish and installed them in his lab. Here he confirmed that the fish did indeed fluoresce. In most of the fish he looked at, the fluorescence could be traced to specialised pigment cells that lie in the skin beneath the scales. These cells contain ''guanine crystals'', which scatter light to give fish their silvery sheen. However, Michiels says they are still not sure exactly what is fluorescing. ''It''s not the crystals themselves. It''s probably a fluorescent protein built into the crystals, and we have a suspicion that it might be made by bacteria.''

Intrigued, Michiels began a systematic search for red fluorescence in reef fish. He and his colleagues, Nils Anthes and Dennis Sprenger, have identified some 50 species with red fluorescence. The most common markings tend to be on the body towards the head and to a lesser extent around the eyes, and then the fins. To Michiels, the distribution of these markings is one of the strongest indications that red fluorescence has a very particular function: communication with other members of the species. According to several recent studies, a whole range of animals employ fluorescence as a natural highlighter to boost the visibility of body parts they use to signal, for example to ward off enemies. In reef fish, the red tends to be confined to parts of the body used to signal, suggesting these markings serve a similar function. But instead of highlighting an existing colour, the fluorescence gives the fish a colour that otherwise wouldn''t exist. For example, fish commonly use eye rings to signal that they are present and their direction of gaze, and Michiels suspects that red-eyed gobies use signals to indicate their location and keep their group together.

Red light, whatever its source, doesn''t travel far through water, which suggests signals are intended to be private, seen only by nearby fish of the right species. There are several lines of evidence to support this, says Michiels. And closely related species do not have completely identical markings, which suggests they might be important in species recognition.

Michiels suspects red fluorescence has another important role for some reef fish: helping them blend in. During his first dive with the red filter, he noticed corals glow a dark but faint red too. Against this irregular red background, a fish that glows red all over would be hard to distinguish. More compelling for Michiels is the case of the scorpionfish, which lies perfectly still until food swims past which it then sucks in.

Yet if red plays any part in a fish''s life then it must be able to see it. Fish that live in a world dominated by blue-green light are assumed to have eyes tuned to those wavelengths, and most marine fish that have been studied are thought incapable of seeing red. One exception is the seahorse, whose eyes are sensitive to red. As for the other fish, it remains to be seen.

*pigments: a pigment is a substance that gives something a particular colour',
    925,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c418a588-91d7-4f01-8ae7-053834df81dc',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    1,
    'tfng',
    'During his 2007 dive, Michiels expected to encounter total darkness at about 15 metres.',
    NULL,
    'TRUE',
    'The passage clearly states he expected darkness at 15 meters due to loss of red light.',
    1,
    '{"explanation":"The passage clearly states he expected darkness at 15 meters due to loss of red light.","fromPassage":"In theory, once he reached about 15 metres, he should have been plunged into darkness.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '96fcd563-a48d-4eb7-87b5-dbc46a8514ef',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    2,
    'tfng',
    'Michiels could see the red markings on fish without the aid of the red filter.',
    NULL,
    'TRUE',
    'Paragraph B says he could see the red markings even without the red filter.',
    1,
    '{"explanation":"Paragraph B says he could see the red markings even without the red filter.","fromPassage":"Even with the red filter removed, Michiels could pick them out without much trouble once his eyes grew accustomed to the gloom.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '51bcbbdf-1f1e-4597-afd2-715d79d0f37b',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    3,
    'tfng',
    'Other divers had assumed they would see fish with red markings.',
    NULL,
    'FALSE',
    'No diver had seen the red before because no one expected it.',
    1,
    '{"explanation":"No diver had seen the red before because no one expected it.","fromPassage":"It seems strange that no diver or researcher had spotted all this red before, but as Michiels points out, no one saw it because no one expected to see it.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd6e03897-b125-415c-9b91-6078a80ed1ef',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    4,
    'tfng',
    'All the fish with red markings that Michiels found during his diving expeditions came from the Red Sea.',
    NULL,
    'NOT GIVEN',
    'We are told that he found species in the Red Sea and later in Germany in his lab — but NOT that all red-marked fish were from the Red Sea.',
    1,
    '{"explanation":"We are told that he found species in the Red Sea and later in Germany in his lab — but NOT that all red-marked fish were from the Red Sea.","fromPassage":"On that one dive Michiels discovered three fish species with prominent red markings, and has found many others since.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a82da058-6136-41c4-92f8-fec63895b74f',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    5,
    'tfng',
    'Michiels first thought of the possibility that fish could fluoresce while he was in Germany.',
    NULL,
    'FALSE',
    'He suspected fluorescence during the dive in the Red Sea — not in Germany.',
    1,
    '{"explanation":"He suspected fluorescence during the dive in the Red Sea — not in Germany.","fromPassage":"He suspected fluorescence.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '42b666bf-3355-4dec-b3d9-1c80da827c54',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    6,
    'tfng',
    'Michiels remains uncertain as to what creates fluorescence in fish.',
    NULL,
    'TRUE',
    'He is still unsure what exactly fluoresces.',
    1,
    '{"explanation":"He is still unsure what exactly fluoresces.","fromPassage":"However, Michiels says they are still not sure exactly what is fluorescing. ‘It’s not the crystals themselves. It’s probably a fluorescent protein built into the crystals, and we have a suspicion that it might be made by bacteria.’","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f72abc08-7584-4129-a8f7-0e11c7ebdd33',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    7,
    'gap_fill',
    'Question 7',
    NULL,
    'head',
    'Markings are mainly near the head.',
    1,
    '{"explanation":"Markings are mainly near the head.","fromPassage":"The most common markings tend to be on the body towards the head and to a lesser extent around the eyes, and then the fins.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'af6defa4-6f8e-4134-8592-86771e6946d8',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    8,
    'gap_fill',
    'Question 8',
    NULL,
    'communication',
    'Michiels believes fluorescence serves a communication function.',
    1,
    '{"explanation":"Michiels believes fluorescence serves a communication function.","fromPassage":"To Michiels, the distribution of these markings is one of the strongest indications that red fluorescence has a very particular function: communication with other members of the species.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0e82d1ff-c814-4fcd-957d-cc1a17ea0e3e',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    9,
    'gap_fill',
    'Question 9',
    NULL,
    'enemies',
    'Fluorescence is used to signal and ward off enemies.',
    1,
    '{"explanation":"Fluorescence is used to signal and ward off enemies.","fromPassage":"According to several recent studies, a whole range of animals employ fluorescence as a natural highlighter to boost the visibility of body parts they use to signal, for example to ward off enemies.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8a0ed665-e97b-484f-8182-a3c30dbd0a16',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    10,
    'gap_fill',
    'Question 10',
    NULL,
    'location',
    'Goby fish use fluorescence to show location and stay together.',
    1,
    '{"explanation":"Goby fish use fluorescence to show location and stay together.","fromPassage":"For example, fish commonly use eye rings to signal that they are present and their direction of gaze, and Michiels suspects that red-eyed gobies use signals to indicate their location and keep their group together.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fc757c2d-9834-4634-973e-9cfb5c866dbd',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    11,
    'gap_fill',
    'Question 11',
    NULL,
    'species',
    'Variations in markings help with species recognition.',
    1,
    '{"explanation":"Variations in markings help with species recognition.","fromPassage":"And closely related species do not have completely identical markings, which suggests they might be important in species recognition.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '448fb335-e9e4-4f4b-9887-7e6d9084d846',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    12,
    'gap_fill',
    'Question 12',
    NULL,
    'corals',
    'Red fluorescence helps fish blend in near faintly glowing red corals.',
    1,
    '{"explanation":"Red fluorescence helps fish blend in near faintly glowing red corals.","fromPassage":"During his first dive with the red filter, he noticed corals glow a dark but faint red too. Against this irregular red background, a fish that glows red all over would be hard to distinguish.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'be8e4e1d-075f-48a0-bfad-b709e3979edb',
    'reading',
    'c92ba344-4bd5-4005-a2b3-60a1ccfc2b73',
    13,
    'gap_fill',
    'Question 13',
    NULL,
    'seahorse',
    'The seahorse is the only fish proven to see red.',
    1,
    '{"explanation":"The seahorse is the only fish proven to see red.","fromPassage":"One exception is the seahorse, whose eyes are sensitive to red.","instruction":"<p>Complete the notes. Write&nbsp;<strong>ONE WORD ONLY</strong>&nbsp;from the text for each answer.</p>","context":"<h3>                                             Michiels''s Findings</h3><p><strong>Michiels has observed:</strong></p><ul><li>50 types of fish with red fluorescence in total</li><li>markings mainly near the&nbsp; ______ </li></ul><p><strong>Some of Michiels''s beliefs are that:</strong></p><ul><li>red fluorescence is used specifically for&nbsp; ______ &nbsp;purposes</li><li>fish, like some animals, use fluorescence to keep&nbsp; ______ &nbsp;away</li><li>gobies depend on red fluorescence to show their&nbsp; ______ </li><li>there are variations in the markings of fish among those&nbsp; ______ &nbsp;which are very similar</li></ul><p><strong>Other benefits of red fluorescence:</strong></p><ul><li>fish cannot easily be seen near backgrounds of&nbsp; ______ &nbsp;which give off a red light</li><li>helps some fish catch their prey</li></ul><p><strong>The ability to see red amongst fish:</strong></p><ul><li>the only fish proven to have this ability is the&nbsp; ______ </li></ul>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 20: Jellyfish – The Dominant Species
-- Source API ID: 1800
-- Generated: 2026-02-26T11:44:05.380Z
-- ============================================

-- ============================================
-- Day 20: Jellyfish – The Dominant Species - Part 2: Jellyfish – The Dominant Species
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '02948d83-58e5-43c4-85f2-ccf454b7392e',
    'Day 20: Jellyfish – The Dominant Species - Part 2: Jellyfish – The Dominant Species',
    'Cambridge IELTS - Jellyfish – The Dominant Species',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    '02948d83-58e5-43c4-85f2-ccf454b7392e',
    1,
    'Jellyfish – The Dominant Species',
    'A 
Jellyfish have become the curse of beach holidays, permeating every ocean on the globe, thriving in the Arctic and the tropics. In an ever-changing world where other species struggle to endure, jellyfish populations are on the rise. To the untrained eye, these creatures drift aimlessly on the oceans'' currents and appear benign. In addition, they lack sharp claws, piercing teeth or even a brain. Despite this, they are armed with an amazing arsenal of weapons, especially the stinging power of their tentacles. As a result, jellyfish are among the most-feared, least-understood creatures in the seas.

B 
According to Dr Monty Graham, a jellyfish scientist at the University of South Alabama, US, ''Jellyfish are a pretty good group of animals to track coastal ecosystems. When you start to see jellyfish numbers grow, that usually indicates a stressed system.'' While populations appear to be down this year, Dr Graham sees ''a statistically solid increase'' over the longer term. This increase first gained attention in the 1980s when a huge number of jellyfish, Atlantic Ocean natives named Mnemiopsis leidyi, devastated the Black Sea, an ecosystem already weakened by overfishing of anchovies. Scientists believe that this species of jellyfish came in on the bottom of a ship and then rapidly multiplied, feeding on anchovy eggs and the plankton that young fish rely on.

C 
Dense jellyfish aggregations can be a natural feature of healthy ocean ecosystems, but a clear picture is now emerging of more severe and frequent jellyfish outbreaks worldwide. Dr Anthony Richardson, from the University of Queensland, Australia, explains that once jellyfish gain a foothold, if conditions are right they can establish a massive population at the expense of other ocean life. The problem is that parts of the ocean might switch from being dominated by fish to being dominated by jellyfish.

D 
A study done by Richardson and his colleagues explores the causes behind jellyfish infestation, and the need for swift, decisive action to stem jellyfish takeover. Jellyfish outbreaks are linked directly to human actions, including overfishing, the input of fertilizer and sewage into the ocean, and climate change. Overfishing has removed fish from marine ecosystems at astounding rates. According to Richardson, this has made it possible for jellyfish to take their place. ''This is because small fish appear to keep jellyfish in check by predation (on jellyfish when they are very small) and competition (when feeding). So, once we remove fish, jellyfish can proliferate.'' Eutrophication is another human-caused change in the ocean that has likely contributed to jellyfish explosions. Eutrophication is an increase of nitrogen and phosphorus in the ocean, largely caused by fertilizer and waste run-off. This leads to algae blooms, which lower oxygen in the marine ecosystem, creating so-called ''dead zones'', which have been increasing dramatically around the world. According to Richardson, these low-oxygen waters give jellyfish the advantage. ''Fish avoid low-oxygen waters but jellyfish, having lower oxygen demands, not only survive but can thrive in these conditions as there is less predation and competition from fish.''

E 
Furthermore, Richardson and his colleagues speculate that climate change may expand the traditional geographical range of jellyfish. ''As water warms, tropical species are moving towards the poles. Many venomous jellyfish species are tropical and could move into more densely populated subtropical and temperate regions.''

F 
Once jellyfish appear en masse in an ecosystem they can make it very difficult for fish to stage a comeback. By feeding on fish, the jellyfish successfully prevent fish from returning to their normal population numbers, says Richardson. ''One can thus think of two alternate states with each being stable: one dominated by fish and the other by jellyfish. Unfortunately, where there is a jellyfish-dominated state then this does not support the nutritional needs of other fish, marine mammals, and seabirds.'' In other words an ecosystem that loses fish also loses the species that depend on fish for survival. This state has been defined as a ''monoculture of jellyfish'', an apt analogy since the situation shares similarities with other monocultures. When the rich biodiversity of tropical forests is replaced by plantations growing a single species of tree, an area of rich variety becomes a desert in terms of biodiversity, as do ocean ecosystems when jellyfish become the dominant species. One result of large jellyfish populations is the economic effect it has had on the fishing industry. In the Gulf of Mexico, shrimp fishermen are struggling with a jellyfish boom that fills nets, causing them to break and resulting in millions of dollars in losses.

G 
Experts say that a greater understanding of jellyfish, including their ideal water temperature and feeding habits, is necessary to determine with certainty what is causing the recent massive invasion, and to come up with ways to combat it. Due to the difficulty of turning ecosystems around once jellyfish have become dominant, Richardson and his colleagues propose focusing on ''prevention rather than cure''. They recommend a halt to overfishing small fish that are vital to keeping jellyfish in check, reducing the amount of fertilizer and sewage running off into the oceans, and finally, if possible, confronting climate change.',
    848,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cbfcbbdf-5630-4d4c-b680-f849b5bb926c',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    14,
    'matching_info',
    'A prediction as to the direction in which the jellyfish population may spread',
    '["","","","","","",""]'::jsonb,
    'E',
    'Section E predicts that warming oceans will cause tropical jellyfish to expand their geographical range toward the poles.',
    1,
    '{"explanation":"Section E predicts that warming oceans will cause tropical jellyfish to expand their geographical range toward the poles.","fromPassage":"As water warms, tropical species are moving towards the poles.","instruction":"<p>The text has nine sections&nbsp;<strong>A-I.</strong> Which section contains the following information? Choose the correct sections<strong>&nbsp;A-I.</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd39717f1-a856-4477-a109-f9de5d910e1f',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    15,
    'matching_info',
    'A description of some physical characteristics of jellyfish',
    '["","","","","","",""]'::jsonb,
    'A',
    'Section A describes jellyfish characteristics such as lacking a brain and having stinging tentacles.',
    1,
    '{"explanation":"Section A describes jellyfish characteristics such as lacking a brain and having stinging tentacles.","fromPassage":"In addition, they lack sharp claws, piercing teeth or even a brain.","instruction":"<p>The text has nine sections&nbsp;<strong>A-I.</strong> Which section contains the following information? Choose the correct sections<strong>&nbsp;A-I.</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '35b7bf7d-88e3-401c-a58e-e1b1a815fb98',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    16,
    'matching_info',
    'An account of the consequences of jellyfish as lone survivors',
    '["","","","","","",""]'::jsonb,
    'F',
    'Section F explains what happens when jellyfish become the dominant survivors—fish and other species cannot return.',
    1,
    '{"explanation":"Section F explains what happens when jellyfish become the dominant survivors—fish and other species cannot return.","fromPassage":"Unfortunately, where there is a jellyfish-dominated state then this does not support the nutritional needs of other fish, marine mammals, and seabirds.","instruction":"<p>The text has nine sections&nbsp;<strong>A-I.</strong> Which section contains the following information? Choose the correct sections<strong>&nbsp;A-I.</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4db53b7a-a696-4a57-988d-1e8b2e3f4f02',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    17,
    'matching_info',
    'Suggestions on how to avoid further jellyfish invasions',
    '["","","","","","",""]'::jsonb,
    'G',
    'Section G gives recommendations for preventing jellyfish outbreaks.',
    1,
    '{"explanation":"Section G gives recommendations for preventing jellyfish outbreaks.","fromPassage":"They recommend a halt to overfishing small fish that are vital to keeping jellyfish in check, reducing the amount of fertilizer and sewage running off into the oceans, and finally, if possible, confronting climate change.","instruction":"<p>The text has nine sections&nbsp;<strong>A-I.</strong> Which section contains the following information? Choose the correct sections<strong>&nbsp;A-I.</strong></p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a3d9580f-18ce-44b2-b983-68496223b46a',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    18,
    'mcq_single',
    'Question 18',
    '["They have damaged the tourism industry in some areas.","They have led to a reduction in the oceans'' oxygen levels."," They have contributed to the decline in the Black Sea anchovy population."," They have caused the shrimp business in the Gulf of Mexico to shut down.","They have created financial hardship in the fishing industry."]'::jsonb,
    'C,E',
    'Jellyfish contributed to the collapse of anchovies in the Black Sea.',
    1,
    '{"explanation":"Jellyfish contributed to the collapse of anchovies in the Black Sea.","fromPassage":"This increase first gained attention in the 1980s when a huge number of jellyfish, Atlantic Ocean natives named Mnemiopsis leidyi, devastated the Black Sea, an ecosystem already weakened by overfishing of anchovies.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers.</p>","context":"<p>The list below gives some effects that jellyfish have had on the world. Which <strong>TWO</strong> of these effects are mentioned by the writer of the text?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '18853926-db1c-4dc2-9007-adcb134b7196',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    19,
    'mcq_single',
    'Question 19',
    '["They have damaged the tourism industry in some areas.","They have led to a reduction in the oceans'' oxygen levels."," They have contributed to the decline in the Black Sea anchovy population."," They have caused the shrimp business in the Gulf of Mexico to shut down.","They have created financial hardship in the fishing industry."]'::jsonb,
    'C,E',
    'Jellyfish have caused major financial losses for shrimp fishermen.',
    1,
    '{"explanation":"Jellyfish have caused major financial losses for shrimp fishermen.","fromPassage":"In the Gulf of Mexico, shrimp fishermen are struggling with a jellyfish boom that fills nets, causing them to break and resulting in millions of dollars in losses.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers.</p>","context":"<p>The list below gives some effects that jellyfish have had on the world. Which <strong>TWO</strong> of these effects are mentioned by the writer of the text?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '07d80321-0516-4891-98c1-89cb8288e432',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    20,
    'mcq_single',
    'Question 20',
    '["A shortage of small fish in the oceans","The dumping of chemicals into the oceans","A decline in biodiversity in the oceans"," More competition among other fish in the oceans","A decrease in seabird populations"]'::jsonb,
    'A,B',
    'A shortage of small fish allows jellyfish to multiply.',
    1,
    '{"explanation":"A shortage of small fish allows jellyfish to multiply.","fromPassage":"So, once we remove fish, jellyfish can proliferate.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers.</p>","context":"<p>Which <strong>TWO</strong> of the following are possible causes of an increase in jellyfish numbers?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'da4dabeb-69bc-4125-911a-d3b1ae103741',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    21,
    'mcq_single',
    'Question 21',
    '["A shortage of small fish in the oceans","The dumping of chemicals into the oceans","A decline in biodiversity in the oceans"," More competition among other fish in the oceans","A decrease in seabird populations"]'::jsonb,
    'A,B',
    'Chemical run-off (fertilizer, sewage) leads to eutrophication, helping jellyfish thrive.',
    1,
    '{"explanation":"Chemical run-off (fertilizer, sewage) leads to eutrophication, helping jellyfish thrive.","fromPassage":"According to Richardson, these low-oxygen waters give jellyfish the advantage.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers.</p>","context":"<p>Which <strong>TWO</strong> of the following are possible causes of an increase in jellyfish numbers?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e61d01af-70e2-4834-a747-fcd3386d53d8',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    22,
    'gap_fill',
    'Question 22',
    NULL,
    'eggs',
    'Jellyfish eat fish eggs, preventing fish populations from recovering.',
    1,
    '{"explanation":"Jellyfish eat fish eggs, preventing fish populations from recovering.","fromPassage":"By feeding on fish, the jellyfish successfully prevent fish from returning to their normal population numbers, says Richardson.","instruction":"<p>Complete the sentences below. Write <strong>ONE WORD ONLY </strong>from the passage for each answer.</p>","context":"<p>Some fish in the oceans may be unable to sustain their population as the jellyfish eat their ______ </p><p>The state of jellyfish becoming the main ocean species has been named ______ </p><p>Increasing numbers of jellyfish can damage ______ used for commercial fishing.</p><p>Understanding basic facts about jellyfish, such as the&nbsp; ______ &nbsp;of the ocean which suits them best, may help control their numbers.</p><p>Richardson believes it is better to direct attention to&nbsp; ______ , instead of just trying to solve existing problems.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7f0dd065-a8f1-4b44-ae91-c0978eb8ef59',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    23,
    'gap_fill',
    'Question 23',
    NULL,
    'monoculture',
    'The jellyfish-dominant state is called a "monoculture of jellyfish.',
    1,
    '{"explanation":"The jellyfish-dominant state is called a \"monoculture of jellyfish.","fromPassage":"This state has been defined as a ‘monoculture of jellyfish’, an apt analogy since the situation shares similarities with other monocultures.","instruction":"<p>Complete the sentences below. Write <strong>ONE WORD ONLY </strong>from the passage for each answer.</p>","context":"<p>Some fish in the oceans may be unable to sustain their population as the jellyfish eat their ______ </p><p>The state of jellyfish becoming the main ocean species has been named ______ </p><p>Increasing numbers of jellyfish can damage ______ used for commercial fishing.</p><p>Understanding basic facts about jellyfish, such as the&nbsp; ______ &nbsp;of the ocean which suits them best, may help control their numbers.</p><p>Richardson believes it is better to direct attention to&nbsp; ______ , instead of just trying to solve existing problems.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b3cfcdb1-0a0d-4865-91e3-4fce2ac09a5e',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    24,
    'gap_fill',
    'Question 24',
    NULL,
    'nets',
    'Jellyfish damage commercial fishing nets.',
    1,
    '{"explanation":"Jellyfish damage commercial fishing nets.","fromPassage":"In the Gulf of Mexico, shrimp fishermen are struggling with a jellyfish boom that fills nets, causing them to break and resulting in millions of dollars in losses.","instruction":"<p>Complete the sentences below. Write <strong>ONE WORD ONLY </strong>from the passage for each answer.</p>","context":"<p>Some fish in the oceans may be unable to sustain their population as the jellyfish eat their ______ </p><p>The state of jellyfish becoming the main ocean species has been named ______ </p><p>Increasing numbers of jellyfish can damage ______ used for commercial fishing.</p><p>Understanding basic facts about jellyfish, such as the&nbsp; ______ &nbsp;of the ocean which suits them best, may help control their numbers.</p><p>Richardson believes it is better to direct attention to&nbsp; ______ , instead of just trying to solve existing problems.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '65fc2076-268a-4bce-a095-2e8034a6566a',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    25,
    'gap_fill',
    'Question 25',
    NULL,
    'temperature',
    'Understanding ideal temperature ranges for jellyfish may help control them.',
    1,
    '{"explanation":"Understanding ideal temperature ranges for jellyfish may help control them.","fromPassage":"Experts say that a greater understanding of jellyfish, including their ideal water temperature and feeding habits, is necessary to determine with certainty what is causing the recent massive invasion","instruction":"<p>Complete the sentences below. Write <strong>ONE WORD ONLY </strong>from the passage for each answer.</p>","context":"<p>Some fish in the oceans may be unable to sustain their population as the jellyfish eat their ______ </p><p>The state of jellyfish becoming the main ocean species has been named ______ </p><p>Increasing numbers of jellyfish can damage ______ used for commercial fishing.</p><p>Understanding basic facts about jellyfish, such as the&nbsp; ______ &nbsp;of the ocean which suits them best, may help control their numbers.</p><p>Richardson believes it is better to direct attention to&nbsp; ______ , instead of just trying to solve existing problems.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a286beca-7825-4644-91e9-f5452771f094',
    'reading',
    '8558e998-2aa7-4e7c-82d7-736ac58fa17a',
    26,
    'gap_fill',
    'Question 26',
    NULL,
    'prevention',
    'Richardson says we should focus on prevention rather than cure.',
    1,
    '{"explanation":"Richardson says we should focus on prevention rather than cure.","fromPassage":"Due to the difficulty of turning ecosystems around once jellyfish have become dominant, Richardson and his colleagues propose focusing on ‘prevention rather than cure’.","instruction":"<p>Complete the sentences below. Write <strong>ONE WORD ONLY </strong>from the passage for each answer.</p>","context":"<p>Some fish in the oceans may be unable to sustain their population as the jellyfish eat their ______ </p><p>The state of jellyfish becoming the main ocean species has been named ______ </p><p>Increasing numbers of jellyfish can damage ______ used for commercial fishing.</p><p>Understanding basic facts about jellyfish, such as the&nbsp; ______ &nbsp;of the ocean which suits them best, may help control their numbers.</p><p>Richardson believes it is better to direct attention to&nbsp; ______ , instead of just trying to solve existing problems.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 18: The Pirahã People of Brazil
-- Source API ID: 1801
-- Generated: 2026-02-26T11:44:08.540Z
-- ============================================

-- ============================================
-- Day 18: The Pirahã People of Brazil - Part 3: The Pirahã People of Brazil
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '37f296b9-cefd-486c-9a92-4833021c1aea',
    'Day 18: The Pirahã People of Brazil - Part 3: The Pirahã People of Brazil',
    'Cambridge IELTS - The Pirahã People of Brazil',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    '37f296b9-cefd-486c-9a92-4833021c1aea',
    1,
    'The Pirahã People of Brazil',
    'The Pirahã tribe live deep in Brazil''s Amazon forest, and their language is hotly debated by linguists. Since 1977, the ethnologist Daniel Everett has spent a total of seven years living with the Pirahã and has committed his career to studying their puzzling speech. Indeed, he was uncertain for so long about what he was actually hearing while living among the Pirahã that he waited nearly three decades before publishing his findings.

The debate over the Pirahã language goes right to the core of the riddle regarding how Homo sapiens managed to develop vocal communication. Although bees dance, birds sing and whales even sing with syntax*, human language is unique, if only for the reason that it enables humans to piece together never-before-constructed thoughts, and be infinitely imaginative - think of Shakespeare''s plays or Einstein''s theory of relativity.

Linguistics generally focuses on what features all human languages have in common, but the Pirahã language departs from what some academics have long maintained are essential and inalienable features of all human languages. Most of all, it may be unique for not employing subordinate clauses. Instead of saying, ''When I have finished eating, I will speak to you,'' the Pirahã say, ''I finish eating, I speak with you.'' Equally perplexing, the Pirahã appear not to use numbers. During the time he spent with them, Everett never heard words like ''all'', ''every'' and ''more''. There is one word, ''hoi'', that comes close to the numeral 1, but it can also mean ''small''. And they were never observed to count without language, on their fingers for example, in order to determine important tasks in village life like how many pieces of meat to grill.

Everett''s findings among the Pirahã have brought new life to a controversial theory by the linguist Benjamin Whorf, who suggested that people are only capable of constructing thoughts for which they possess actual words. Or to put it another way, because they have no words for numbers, they cannot even begin to understand the concept of numbers or arithmetic.

The Warlpiri language - spoken by a group of Australian Aborigines - like that of the Pirahã, features only the most rudimentary system of counting. However, the Warlpiri people had no difficulty counting farther than three in a foreign language, in this case English, but when Everett attempted to teach the Pirahã how to count in Portuguese like other Brazilians, not a single person could count to 10.

Everett is at pains to point out that the Pirahã are not unintelligent, for their thinking is not any slower than that of the average university student. And although they reside in a remote part of the forest, they do not live in complete genetic isolation, but mix with people from the surrounding populations and share similar intellectual capacities with their neighbours whose languages do contain numbers.

Eventually, after some 30 years of research, Everett has come up with a surprising explanation for the peculiarities of the Pirahã language. Language, he believes, is created by a people''s way of life, their belief system and values. In this way, variety in human language is almost limitless, a function of the human capacity to live in different ways, such as in the forest. What Everett''s research has revealed is that the central tenet of the Pirahã culture is to live in the here and now. The only thing of importance that is worth communicating to others is what is being experienced at that very moment, though this can often be described with great care and detail. In consequence, the language has no means to conjugate verbs in order to describe ''yesterday'' or ''last week'' or ''when I was a child''. Their very literal view of the world curtails abstract thought, and many features taken for granted among other peoples are absent among the Pirahã, such as a creation myth, story telling and painting. One manifestation of their beliefs is that by tradition the names they give their children are not particularly imaginative. Often they are named after other members of the tribe with whom they share similar character traits. Standing out or being different is not encouraged by the Pirahã, and this is reflected in their perhaps colourless choice of names.

Everett anticipated that these findings would be controversial and the reaction came as expected. Until this point, many linguists had defended the theories of Noam Chomsky, according to which all human languages have a universal grammar. What exactly makes up this universal grammar is the subject of debate, but at its heart is the concept of ''recursion'', which is defined as replication of a structure within its single parts. Without it, humans would not be able to view separate thoughts as subordinate parts of a complex whole. And, most pertinent to Everett''s work, there would not be subordinate clauses, which are responsible for translating the concept of recursion into grammar. But if the Pirahã do not form subordinate clauses, then recursion cannot explain the uniqueness of human language, and this would negate Chomsky''s theories.

The logical way forward now would be to try to prove that the Pirahã can think in a recursive fashion. The only problem is, nobody can confirm or deny Everett''s observations since no other researcher can speak Pirahã as well as he does. Despite this, several researchers - including two of Chomsky''s colleagues - will soon travel to Brazil to check his claims. My concern is that soon the Pirahã will simply become one more scientific oddity with every aspect of their lives being exploited and analysed.',
    927,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1433597c-99ee-4a86-bef5-f104ee9fe1af',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    27,
    'mcq_single',
    'Question 27',
    '["He has lived among the Pirahã since 1977.","It took him seven years to learn the Pirahã language.","No one would publish his research for three decades.","Studying the Pirahã language is the focus of his work."]'::jsonb,
    'D',
    'The passage directly states that Everett devoted his career to studying the Pirahã language. This matches option D.',
    1,
    '{"explanation":"The passage directly states that Everett devoted his career to studying the Pirahã language. This matches option D.","fromPassage":"has committed his career to studying their puzzling speech. ","instruction":"<p>Choose the correct answer. </p>","context":"<p>What are we told about Daniel Everett in the first paragraph?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0779c0bf-05eb-4524-9413-6ef7b3ce12bd',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    28,
    'mcq_single',
    'Question 28',
    '["Humans are the only species to be linguistically creative.","Humans, bees, birds and whales share a characteristic.","Human language is not fully understood by scientists.","Humans are the only species to use syntax."]'::jsonb,
    'A',
    'The paragraph states that human language is unique because it allows infinite creativity — a characteristic no other species possesses.',
    1,
    '{"explanation":"The paragraph states that human language is unique because it allows infinite creativity — a characteristic no other species possesses.","fromPassage":"Although bees dance, birds sing and whales even sing with syntax*, human language is unique, if only for the reason that it enables humans to piece together never-before-constructed thoughts, and be infinitely imaginative - think of Shakespeare''s plays or Einstein''s theory of relativity.","instruction":"<p>Choose the correct answer. </p>","context":"<p>&nbsp;Which of the following is the best summary of the second paragraph?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cae8e071-50cd-4598-b293-5aefdb84bd73',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    29,
    'mcq_single',
    'Question 29',
    '["To criticise the general approach of linguistics.","To compare two features of the Pirahã language."," To explain why the Pirahã language is difficult to learn.","To exemplify an unusual feature of the Pirahã language."]'::jsonb,
    'D',
    'Subordinate clauses are mentioned as a rare or unusual feature because the Pirahã language does not use them.',
    1,
    '{"explanation":"Subordinate clauses are mentioned as a rare or unusual feature because the Pirahã language does not use them.","fromPassage":"Most of all, it may be unique for not employing subordinate clauses.","instruction":"<p>choose the correct answe. </p>","context":"<p>Why does the writer refer to subordinate clauses?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '48733f02-7bf3-424a-a8ea-988e7e43f2e4',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    30,
    'mcq_single',
    'Question 30',
    '["He thought that numbers were common to all human languages.","His theory might be supported by Everett''s research.","His research enabled him to find a new life among the Pirahã.","He predicted that people like the Pirahã would never be found."]'::jsonb,
    'B',
    'The passage says Everett’s discoveries support Whorf’s theory that language limits thought.',
    1,
    '{"explanation":"The passage says Everett’s discoveries support Whorf’s theory that language limits thought.","fromPassage":"Everett''s findings among the Pirahã have brought new life to a controversial theory by the linguist Benjamin Whorf, who suggested that people are only capable of constructing thoughts for which they possess actual words.","instruction":"<p>Choose the correct answer. </p>","context":"<p>What point does the writer make about the work of Whorf?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a6f3ddb9-97c2-4cbf-8cda-840be4b906c4',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    31,
    'mcq_single',
    'Question 31',
    '["Suggest that the Pirahã be taught to count in English.","Show how tribal peoples learn a foreign language.","Compare counting in English and Portuguese.","Illustrate the uniqueness of the Pirahã."]'::jsonb,
    'D',
    'The Warlpiri are used to highlight how unusual the Pirahã are when it comes to counting.',
    1,
    '{"explanation":"The Warlpiri are used to highlight how unusual the Pirahã are when it comes to counting.","fromPassage":"However, the Warlpiri people had no difficulty counting farther than three in a foreign language, in this case English, but when Everett attempted to teach the Pirahã how to count in Portuguese like other Brazilians, not a single person could count to 10.","instruction":"<p>Choose the correct answer. </p>","context":"<p>The writer refers to the Warlpiri people in order to</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '29c103e5-de07-402d-8a44-efe7835e494e',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    32,
    'mcq_single',
    'Question 32',
    '["Pirahã students have not graduated from universities.","He does not want people to criticise their intelligence.","Their isolation makes it difficult to evaluate their intelligence.","He believes their language is more complex than their neighbours’."]'::jsonb,
    'B',
    'Everett stresses that the Pirahã are not unintelligent, which shows he wants to prevent people from judging their intelligence negatively.',
    1,
    '{"explanation":"Everett stresses that the Pirahã are not unintelligent, which shows he wants to prevent people from judging their intelligence negatively.","fromPassage":"And although they reside in a remote part of the forest, they do not live in complete genetic isolation, but mix with people from the surrounding populations and share similar intellectual capacities with their neighbours whose languages do contain numbers.","instruction":"<p>Choose the correct answer. </p>","context":"<p>What is Everett’s point about the Pirahã’s intellectual capacities?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dc76ddf1-1c18-4334-a0af-1e147bebcf35',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    33,
    'summary_completion',
    'Question 33',
    '["present ","past ","time","future","culture ","grammar ","art","individuality","children"]'::jsonb,
    'culture',
    'Everett believes language comes from a people''s way of life — meaning their culture.',
    1,
    '{"explanation":"Everett believes language comes from a people''s way of life — meaning their culture.","fromPassage":"Language, he believes, is created by a people''s way of life, their belief system and values.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Everett’s explanation</strong></h3><p>Everett believes that a group’s language is a product of their ______ and thus language is infinitely varied. During the time he spent living among them, he observed that the Pirahã only place value on the&nbsp; ______ &nbsp;and have no ______ to describe completed events. Similarly, the types of names they use reflect the fact that they do not celebrate ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b5447eaf-514b-490e-adce-df0094210b76',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    34,
    'summary_completion',
    'Question 34',
    '["present ","past ","time","future","culture ","grammar ","art","individuality","children"]'::jsonb,
    'present',
    'The Pirahã value only what is happening now.',
    1,
    '{"explanation":"The Pirahã value only what is happening now.","fromPassage":"The only thing of importance that is worth communicating to others is what is being experienced at that very moment, though this can often be described with great care and detail.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Everett’s explanation</strong></h3><p>Everett believes that a group’s language is a product of their ______ and thus language is infinitely varied. During the time he spent living among them, he observed that the Pirahã only place value on the&nbsp; ______ &nbsp;and have no ______ to describe completed events. Similarly, the types of names they use reflect the fact that they do not celebrate ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '578043bf-2ebc-48e7-be7b-5d900ebedc51',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    35,
    'summary_completion',
    'Question 35',
    '["present ","past ","time","future","culture ","grammar ","art","individuality","children"]'::jsonb,
    'grammar',
    'The Pirahã language has no grammar to express past time.',
    1,
    '{"explanation":"The Pirahã language has no grammar to express past time.","fromPassage":"In consequence, the language has no means to conjugate verbs in order to describe ''yesterday'' or ''last week'' or ''when I was a child''.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Everett’s explanation</strong></h3><p>Everett believes that a group’s language is a product of their ______ and thus language is infinitely varied. During the time he spent living among them, he observed that the Pirahã only place value on the&nbsp; ______ &nbsp;and have no ______ to describe completed events. Similarly, the types of names they use reflect the fact that they do not celebrate ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9c7cd955-a971-4dd9-ba8d-539ccb354945',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    36,
    'summary_completion',
    'Question 36',
    '["present ","past ","time","future","culture ","grammar ","art","individuality","children"]'::jsonb,
    'individuality',
    'Names are simple because the Pirahã do not value individuality.',
    1,
    '{"explanation":"Names are simple because the Pirahã do not value individuality.","fromPassage":"Often they are named after other members of the tribe with whom they share similar character traits.","instruction":"<p>Complete the summary using the list of words. Choose the correct answer and move it into the gap.</p>","context":"<h3><strong>Everett’s explanation</strong></h3><p>Everett believes that a group’s language is a product of their ______ and thus language is infinitely varied. During the time he spent living among them, he observed that the Pirahã only place value on the&nbsp; ______ &nbsp;and have no ______ to describe completed events. Similarly, the types of names they use reflect the fact that they do not celebrate ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6aa369f3-8e2a-49f0-8c6b-36d67458e6b4',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    37,
    'tfng',
    'Everett was surprised by the way his research was greeted.',
    NULL,
    'NO',
    'Everett was not surprised — he expected criticism.',
    1,
    '{"explanation":"Everett was not surprised — he expected criticism.","fromPassage":"Everett anticipated that these findings would be controversial and the reaction came as expected.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bf7cb5c4-53c2-4b59-bb4f-07911d1df026',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    38,
    'tfng',
    'Chomsky has been critical of Everett’s research methodology.',
    NULL,
    'NOT GIVEN',
    'Nowhere in the passage does it say Chomsky criticised Everett’s methodology. Chomsky’s theories are discussed, but NOT his personal comments or criticism.',
    1,
    '{"explanation":"Nowhere in the passage does it say Chomsky criticised Everett’s methodology. Chomsky’s theories are discussed, but NOT his personal comments or criticism.","fromPassage":"And, most pertinent to Everett''s work, there would not be subordinate clauses, which are responsible for translating the concept of recursion into grammar.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a10d1843-f3f3-4bcf-ab56-5103e746391c',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    39,
    'tfng',
    'If ‘recursion’ as a universal concept is disproved, Chomsky’s ideas about language would be wrong.',
    NULL,
    'YES',
    'The passage clearly states that if the Pirahã lack recursion, this would contradict Chomsky’s theory.',
    1,
    '{"explanation":"The passage clearly states that if the Pirahã lack recursion, this would contradict Chomsky’s theory.","fromPassage":"But if the Pirahã do not form subordinate clauses, then recursion cannot explain the uniqueness of human language, and this would negate Chomsky''s theories.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7d41c7e9-d79f-4175-b396-5554fc0c4f45',
    'reading',
    '4b7075cb-0a47-4d57-9a99-972b1f48d7b9',
    40,
    'tfng',
    'The Pirahã will benefit from their new-found status among academics.',
    NULL,
    'NO',
    'The writer is worried the Pirahã will become exploited — meaning they will not benefit.',
    1,
    '{"explanation":"The writer is worried the Pirahã will become exploited — meaning they will not benefit.","fromPassage":"My concern is that soon the Pirahã will simply become one more scientific oddity with every aspect of their lives being exploited and analysed.","instruction":"<p>Choose&nbsp;<strong>YES</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>NO</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT</strong> <strong>GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 16: Rubber
-- Source API ID: 1802
-- Generated: 2026-02-26T11:44:11.642Z
-- ============================================

-- ============================================
-- Day 16: Rubber - Part 1: Rubber
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '24a38492-b7c9-45de-b339-a5d67040854a',
    'Day 16: Rubber - Part 1: Rubber',
    'Cambridge IELTS - Rubber',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    '24a38492-b7c9-45de-b339-a5d67040854a',
    1,
    'Rubber',
    'The plants that produce rubber are spread right across the globe, and grow in many different habitats. One might think it likely, therefore, that humankind has known about rubber for thousands of years. Yet, unlike other crops of economic importance, rubber led a relatively anonymous life until the last 150 years or so. The Indians of South America appear to be the first people to have understood the properties of rubber, and the Aztecs of what is now Mexico were the first to be recorded using the substance; a wall painting dating back to the sixth century depicts a scene of a tributary offering of crude rubber. With the arrival of Columbus in the Americas and the resulting Spanish influx, further evidence starts to appear concerning the Native American use of rubber. Antonio de Herrera y Tordesillas describes a ritual game played with a rubber ball at the court of the Aztec Emperor Montezuma II, and the Mayan and Toltec people are known to have taken part in similar activities. Rubber was also used to make raincoats, shoes, jars, torches and musical instruments, all of which must have been made from the indigenous Castilla elastica, as the Para plant now favoured for rubber cultivation does not grow in the Mexican region.

The first description of latex (liquid rubber) extraction is made by Juan de Torquemada, who noted that if a receptacle was not at hand the Native Americans would place the latex on their bodies to allow it to solidify. However, no real interest in rubber was shown by any European until Charles de la Condamine, a French mathematician, published an account of his journey to South America in 1735. The journey was undertaken on behalf of the Paris Academy of Sciences to measure an arc of the meridian line on the equator, but the journey home was to turn out to be more significant than the true purpose of the trip. Condamine explored Brazil and Peru and discovered how the local people used one single piece of coagulated latex to make boots. The boots were impervious to water and, when smoked, looked like real leather. In 1747 the first description of the rubber tree and latex tapping was made by a military engineer and amateur botanist, François Fresneau, who was posted to French Guiana. The publications of Condamine and Fresneau created considerable excitement among French scientists, and an attempt was made to discover a solvent that could turn the crude rubber into a substance for commercial exploitation.

In 1818 a British medical student named James Syme first used rubber to make waterproof cloth. Another early use of the substance was as an eraser of pencil marks, hence the name ''rubber''. This was complemented by balloons, rubber bands, braces, boots for the army and other ideas that met with varying degrees of success. In 1820 Thomas Hancock, an English manufacturer of rubber goods such as driving belts, industrial rollers and rubber hoses, invented a machine he called the ''piokle'', which chewed up waste strips for re-use. It was discovered that the masticated rubber was more malleable, while maintaining much of its elasticity. In Scotland at the same time Charles Mackintosh had discovered a way of using rubber as waterproofing material, by a process he patented in 1823. Hancock and Mackintosh joined forces in 1834, and three years later Hancock invented a machine for spreading rubber onto material.

Despite their beneficial qualities, such as waterproofing, rubber goods were still not particularly popular as they had some major flaws, including the fact that they dissolved malodorously. They also became pliant when warm and rigid when cold. Then in 1839 the American Charles Goodyear discovered that it was possible to stabilise rubber by mixing it with sulphur while exposing it to heat - a process he called vulcanisation - and the full versatility of this extraordinary substance became apparent.

Rubber goods could now be manufactured which had all the beneficial qualities of the material, such as durability, elasticity and variability, but which were not sticky, soluble or governed by the vagaries of the weather. The economic potential of rubber was now clearly evident. It played an important role in the Industrial Revolution, being employed in the steam engines found in factories, mills, mines and railways. It made a triumphant entrance as a new and innovative material at the Great Exhibition of 1851, where shoes, airbeds, furniture and clothing made out of newly improved rubber were proudly displayed.

One of the most important rubber inventions was made in 1888, when an Irishman called John Boyd Dunlop produced the first pneumatic tyre. Solid rubber tyres had been used for the previous 18 years, but Dunlop''s new design, which he updated in 1890, immediately became popular. In 1895 Dunlop''s tyres were first used in motor cars, and with the mass production of cars just over the horizon the rubber industry had never looked healthier. The import levels of rubber over the nineteenth century bear witness to its irrepressible rise. In 1830 Britain had imported just 211 kg of crude rubber. This had risen to 10,000kg in 1857, and by 1874 levels were just under six times as much again.',
    863,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f1ccb264-46cd-4d84-8b17-d3b8cbcbdcb4',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    1,
    'tfng',
    'Rubber plants grow only in certain regions of the world.',
    NULL,
    'FALSE',
    'The passage says rubber plants grow across the globe and in many habitats, not only in limited regions.',
    1,
    '{"explanation":"The passage says rubber plants grow across the globe and in many habitats, not only in limited regions.","fromPassage":"The plants that produce rubber are spread right across the globe, and grow in many different habitats.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '12063e1c-8524-4e2e-ae89-c8e1718cd69f',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    2,
    'tfng',
    'Rubber was extracted in Mexico as early as the sixth century.',
    NULL,
    'TRUE',
    'The passage states that a sixth-century painting showed people offering rubber, which means it was used in Mexico at that time.',
    1,
    '{"explanation":"The passage states that a sixth-century painting showed people offering rubber, which means it was used in Mexico at that time.","fromPassage":"a wall painting dating back to the sixth century depicts a scene of a tributary offering of crude rubber.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '31903fb3-f744-4319-8434-ae0e9c8e8eeb',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    3,
    'tfng',
    'Rubber from the Castilla elastica plant is of poorer quality than that from the Para plant.',
    NULL,
    'NOT GIVEN',
    'The passage says Castilla elastica was used by ancient peoples and Para rubber does not grow there — but it never compares the quality of the two types. Therefore, the statement cannot be confirmed.',
    1,
    '{"explanation":"The passage says Castilla elastica was used by ancient peoples and Para rubber does not grow there — but it never compares the quality of the two types. Therefore, the statement cannot be confirmed.","fromPassage":"all of which must have been made from the indigenous Castilla elastica, as the Para plant now favoured for rubber cultivation does not grow in the Mexican region.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0a21d0e3-692e-45c0-9b08-f06c29f09fc0',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    4,
    'tfng',
    'A French mathematician inspired real interest in rubber amongst Europeans.',
    NULL,
    'TRUE',
    'The passage clearly says that Europeans showed no interest in rubber until Condamine’s report was published.',
    1,
    '{"explanation":"The passage clearly says that Europeans showed no interest in rubber until Condamine’s report was published.","fromPassage":"However, no real interest in rubber was shown by any European until Charles de la Condamine, a French mathematician, published an account of his journey to South America in 1735.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c01ee6eb-1477-4d88-9dd2-24c5036efc7b',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    5,
    'tfng',
    'The process of vulcanisation was discovered by accident.',
    NULL,
    'NOT GIVEN',
    'The passage states that Goodyear discovered vulcanisation, but does not say whether it was accidental or intentional.',
    1,
    '{"explanation":"The passage states that Goodyear discovered vulcanisation, but does not say whether it was accidental or intentional.","fromPassage":"Then in 1839 the American Charles Goodyear discovered that it was possible to stabilise rubber by mixing it with sulphur while exposing it to heat - a process he called vulcanisation - and the full versatility of this extraordinary substance became apparent.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '51b59242-1215-4e05-8b0f-39355dca1444',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    6,
    'tfng',
    'Imports of crude rubber into Britain fell during the nineteenth century.',
    NULL,
    'FALSE',
    'Imports increased massively, not decreased.',
    1,
    '{"explanation":"Imports increased massively, not decreased.","fromPassage":"In 1830 Britain had imported just 211 kg of crude rubber. This had risen to 10,000 kg in 1857, and by 1874 levels were just under six times as much again.","instruction":"<p>Choose&nbsp;<strong>TRUE</strong>&nbsp;if the statement agrees with the information given in the text, choose&nbsp;<strong>FALSE</strong>&nbsp;if the statement contradicts the information, or choose&nbsp;<strong>NOT GIVEN</strong>&nbsp;if there is no information on this.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dd18decc-738a-4fd5-9db5-27fc7af8b5db',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    7,
    'summary_completion',
    'Question 7',
    NULL,
    'waterproof cloth',
    'The passage states that the first major 1818 invention using rubber was waterproof cloth.',
    1,
    '{"explanation":"The passage states that the first major 1818 invention using rubber was waterproof cloth.","fromPassage":"In 1818 a British medical student named James Syme first used rubber to make waterproof cloth.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6bdbf787-12b7-4f83-900a-d4f1d61cc0a8',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    8,
    'summary_completion',
    'Question 8',
    NULL,
    'waste strips',
    'Hancock invented a machine to reuse waste strips of rubber.',
    1,
    '{"explanation":"Hancock invented a machine to reuse waste strips of rubber.","fromPassage":"he invented a machine he called the ‘piokle’, which chewed up waste strips for re-use.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cc00d24b-bf29-477e-94bb-ae2fde1cf400',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    9,
    'summary_completion',
    'Question 9',
    NULL,
    'rigid',
    'Before improvements, rubber became soft when hot and rigid when cold.',
    1,
    '{"explanation":"Before improvements, rubber became soft when hot and rigid when cold.","fromPassage":"They also became pliant when warm and rigid when cold.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '17ec0b66-810c-4d58-9791-3a0fa1800c2b',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    10,
    'summary_completion',
    'Question 10',
    NULL,
    'stabilise',
    'Goodyear discovered a process that stabilised rubber.',
    1,
    '{"explanation":"Goodyear discovered a process that stabilised rubber.","fromPassage":"it was possible to stabilise rubber by mixing it with sulphur while exposing it to heat - a process he called vulcanisation","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '145f5b0b-d85c-464c-a12a-85ef6a70af40',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    11,
    'summary_completion',
    'Question 11',
    NULL,
    'steam engines',
    'Improved rubber was used in steam engines during the Industrial Revolution.',
    1,
    '{"explanation":"Improved rubber was used in steam engines during the Industrial Revolution.","fromPassage":"It played an important role in the Industrial Revolution, being employed in the steam engines found in factories, mills, mines and railways.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9037e44c-c713-42aa-81d0-a4147bcc008f',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    12,
    'summary_completion',
    'Question 12',
    NULL,
    'first pneumatic tyre',
    'Dunlop invented the first pneumatic tyre in 1888.',
    1,
    '{"explanation":"Dunlop invented the first pneumatic tyre in 1888.","fromPassage":"One of the most important rubber inventions was made in 1888, when an Irishman called John Boyd Dunlop produced the first pneumatic tyre.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '90393437-9be7-46c0-bcc1-b06674ebc3cf',
    'reading',
    '2c26a515-e05b-45bb-8508-273386ce1ec6',
    13,
    'summary_completion',
    'Question 13',
    NULL,
    'mass production',
    'Dunlop’s tyres entered motor cars just before mass production of cars began.',
    1,
    '{"explanation":"Dunlop’s tyres entered motor cars just before mass production of cars began.","fromPassage":"In 1895 Dunlop''s tyres were first used in motor cars, and with the mass production of cars just over the horizon the rubber industry had never looked healthier.","instruction":"<p>Answer the questions. Write&nbsp;<strong>NO MORE THAN THREE WORDS </strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>The Commercial Development of Rubber</strong></h3><p>Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818,&nbsp; ______ &nbsp;was produced using rubber, and in 1820 a machine was invented for recycling&nbsp; ______ &nbsp;of rubber. </p><p><br></p><p>Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or&nbsp; ______ &nbsp;depending on the temperature.&nbsp;However, in 1839 a new process to&nbsp; ______ &nbsp;the substance greatly increased its potential. For example, rubber was used in the creation of the&nbsp; ______ &nbsp;industry during the Industrial Revolution.Then in 1888 the&nbsp; ______ &nbsp;was developed, and a few years later the&nbsp; ______ &nbsp;of the motor car began.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 15: Living Dunes
-- Source API ID: 1804
-- Generated: 2026-02-26T11:44:14.782Z
-- ============================================

-- ============================================
-- Day 15: Living Dunes - Part 3: Living Dunes
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '4106bc16-78e1-4f26-bc7a-d78933baa069',
    'Day 15: Living Dunes - Part 3: Living Dunes',
    'Cambridge IELTS - Living Dunes',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    '84284f92-962a-4bf5-bd38-545f311bc906',
    '4106bc16-78e1-4f26-bc7a-d78933baa069',
    1,
    'Living Dunes',
    '[HEADING: A]
Armies of giant sand dunes are advancing across the world''s deserts, engulfing anything that crosses their path. They are tens of metres tall and hundreds of metres long. Fortunately, they aren''t going very fast. Even the smallest, speediest dunes only travel about 100 metres over the course of a year, while the bigger ones, which weigh something in the order of 10,000 tonnes, barely move one metre in that time. However, their insidious creep can have serious consequences if there is an oil installation or a railway line in their path.
 
[HEADING: B]
About 47% of the world''s land mass, including Antarctica, most of Australia and large areas of Africa, is classified as arid or semi-arid desert. Only around 20% of that is sand-covered, however, and over half of that is classified as ''linear'' sand dunes. These form in a long curving wave, as a result of wind blowing strongly from several quarters, flipping them from side to side. Although linear dunes are static, sand blowing off them can cause problems for desert villages, burying crops and buildings.
 
[HEADING: C]
Moving dunes make up just a small percentage of the rest, but they are of the most interest to scientists. They are known as ''barchans'': heavy, crescent-shaped sand piles with a ridged crest and two elongated arms, one curving away to either side. ''Barchan dunes only tend to form where you have one-directional winds on the edge of sandy deserts near coastal areas,'' says Giles Wiggs, a geomorphologist at Oxford University, who has been studying the formation and movement of sand dunes for more than a decade.
 
[HEADING: D]
But even with strong winds, how can entire barchans move while retaining their form? That question was first answered in the mid-20th century by British explorer Ralph Alger Bagnold, and his answer hinges on the fact that dunes aren''t solid, but granular. Bagnold figured out how barchan dunes are able to move grain by grain. Imagine a single grain of sand being blown up the back of a dune by the wind and deposited on the top. More grains follow the same pattern, until the accumulated weight of piled-up sand finally pushes the top down the dune face. The grain tumbles, then stops on the face until subsequent mini-avalanches bury it. Eventually, it reappears at the back of the dune, ready to repeat the process. As this happens to every grain of sand in the dune, the whole thing creeps in the direction of the prevailing wind.
 
[HEADING: E]
The relationship between the wind and barchan dunes is complex. As a dune grows, it modifies the speed and course of the wind, which in turn alters how that dune and its neighbours evolve. ''Interestingly, the dune can regulate its own shape, and maintain it as it moves,'' says Dr Stéphane Douady, a physicist at Ecole Normale Supérieure (ENS) in France. ''Even when two dunes collide, they quickly take on their distinctive shapes again. It''s like a living organism.''
 
[HEADING: F]
Douady and his colleagues have also been studying an even odder phenomenon than moving dunes: some barchans actually sing. Local legends attributed the sounds to dangerous spirits which were trying to trap unwary travellers. Douady is more pragmatic. ''It''s a strong booming noise with a low frequency,'' he explains, making a noise like a foghorn to demonstrate. ''It can last for a long time - up to several minutes. It''s a very loud sound and you don''t understand where it''s coming from when you first hear it.'' There are about 50 dunes distributed across 35 deserts round the world that are known to sing. Douady says the sound is caused by the way sand avalanches down the faces of particular dunes. Rather than tumbling randomly, the sand grains flow in synchrony and set each other vibrating like the membrane on a gigantic loudspeaker. The synchronisation causes the air to move in and out between the grains, creating a powerful sound wave.
 
[HEADING: G]
What really surprised the scientists, however, was that they were able to take samples of the singing sand back to France and replicate the sound at ENS, proving that it''s the sand, not the dune shape, that causes the sound. Their studies show the grains are a uniform shape, well-rounded from years of striking each other, and that the variations in size affect the tone. Crucially, the grains are coated with a special veneer, which Douady calls ''desert glaze'', made from a precise combination of minerals from surrounding rocks including iron, aluminium, manganese, silicon and calcium. The team found that after a month or so, the veneer wore off and the grains lost their ''voice''. ''We managed to reproduce the desert glaze and then the grains started to sing again,'' says Douady. ''We tried putting the coating onto different grains, but they weren''t round enough and it didn''t work. But some American colleagues made some artificial grains and managed to make them sing, after covering them in desert glaze.'' Douady has now made recordings of dunesong from all over the world which are to be made into a CD.',
    853,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bb8b05d0-3d4e-446a-9402-5db0e76e6325',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    27,
    'matching_headings',
    'Question 27',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'D',
    'Paragraph A explains that moving dunes can slowly but seriously damage structures like oil installations and railways, which are forms of infrastructure and communication.',
    1,
    '{"explanation":"Paragraph A explains that moving dunes can slowly but seriously damage structures like oil installations and railways, which are forms of infrastructure and communication.","fromPassage":"However, their insidious creep can have serious consequences if there is an oil installation or a railway line in their path.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ca9bdddf-ed8c-4995-9b7b-89c7c3b00e61',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    28,
    'matching_headings',
    'Question 28',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'H',
    'This paragraph describes the types of dunes and states that more than half of sand-covered desert is made of linear dunes—the most common type.',
    1,
    '{"explanation":"This paragraph describes the types of dunes and states that more than half of sand-covered desert is made of linear dunes—the most common type.","fromPassage":"Only around 20% of that is sand-covered, however, and over half of that is classified as ‘linear’ sand dunes.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3fc7b1c9-2785-4c3b-9dae-f7fe0198ac88',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    29,
    'matching_headings',
    'Question 29',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'F',
    'Paragraph C explains that barchan dunes only form under very specific conditions—one-directional winds and coastal sandy deserts.',
    1,
    '{"explanation":"Paragraph C explains that barchan dunes only form under very specific conditions—one-directional winds and coastal sandy deserts.","fromPassage":"Barchan dunes only tend to form where you have one-directional winds on the edge of sandy deserts near coastal areas,’ says Giles Wiggs","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '846e989d-bebf-4317-9eae-1d5abd1077a0',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    30,
    'matching_headings',
    'Question 30',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'G',
    'This paragraph describes the repeated cycle of sand grains being blown up and sliding down again, causing the dune to move.',
    1,
    '{"explanation":"This paragraph describes the repeated cycle of sand grains being blown up and sliding down again, causing the dune to move.","fromPassage":"Imagine a single grain of sand being blown up the back of a dune by the wind and deposited on the top.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1ac962a9-41a8-4131-a0b3-fdb16ee204f6',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    31,
    'matching_headings',
    'Question 31',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'E',
    'This paragraph mentions how dunes collide and then quickly regain their shape.',
    1,
    '{"explanation":"This paragraph mentions how dunes collide and then quickly regain their shape.","fromPassage":"Even when two dunes collide, they quickly take on their distinctive shapes again.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2be8e3b4-08e6-40c2-a9c5-d20f7a9942a8',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    32,
    'matching_headings',
    'Question 32',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'I',
    'Paragraph F talks about ancient legends blaming spirits for the booming sound, and scientists explaining the real reason.',
    1,
    '{"explanation":"Paragraph F talks about ancient legends blaming spirits for the booming sound, and scientists explaining the real reason.","fromPassage":"Local legends attributed the sounds to dangerous spirits which were trying to trap unwary travellers. Douady is more pragmatic.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2778fdea-45d4-4102-b280-fc2acb74b177',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    33,
    'matching_headings',
    'Question 33',
    '["Moving rapidly across the desert","Recreating the process in a laboratory","Strange music created by human movement","A potential threat to industry and communications","Dunes coming together and re-forming","Needing a specific combination of conditions","A continuous cycle","The commonest type of dune","Old superstitions demystified"]'::jsonb,
    'B',
    'Scientists took sand samples back to France and reproduced the sound artificially.',
    1,
    '{"explanation":"Scientists took sand samples back to France and reproduced the sound artificially.","fromPassage":"they were able to take samples of the singing sand back to France and replicate the sound at ENS, proving that it’s the sand, not the dune shape, that causes the sound.","instruction":"<p>The text has&nbsp;seven&nbsp;sections. Choose the correct heading for each section and move it into the gap.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '65162f74-f8e6-42bb-9fc5-34852030dc8f',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    34,
    'mcq_single',
    'Question 34',
    '["They are formed by strong winds blowing from one direction.","They can move up to 100 metres in a twelve-month period.","They develop in a recognisable shape.","They make up about 20% of the world''s deserts."]'::jsonb,
    'C',
    'Paragraph B describes linear dunes as forming a “long curving wave”—a clear, recognisable shape.',
    1,
    '{"explanation":"Paragraph B describes linear dunes as forming a “long curving wave”—a clear, recognisable shape.","fromPassage":"These form in a long curving wave, as a result of wind blowing strongly from several quarters, flipping them from side to side.","instruction":"<p>Choose the correct answer. </p>","context":"<p>What are we told about linear dunes?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a3a474a0-6790-4702-ba89-7d61665db7b7',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    35,
    'mcq_single',
    'Question 35',
    '["the long straight shape of the dunes.","the particular composition of the dunes.","the exceptionally heavy nature of the sand grains.","the unusual strength of the wind in certain seasons."]'::jsonb,
    'B',
    'He discovered dunes are granular (not solid), and each grain moves in a specific way that shifts the dune.',
    1,
    '{"explanation":"He discovered dunes are granular (not solid), and each grain moves in a specific way that shifts the dune.","fromPassage":"That question was first answered in the mid-20th century by British explorer Ralph Alger Bagnold, and his answer hinges on the fact that dunes aren''t solid, but granular.","instruction":"<p>Choose the correct answer.</p>","context":"<p>Bagnold discovered that movement in barchans was caused by</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2609b028-bb91-4112-a570-4b10216ca0ec',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    36,
    'mcq_single',
    'Question 36',
    '["It starts small and then increases in size.","It has an effect on its immediate surroundings.","Its relations with desert organisms are quite developed.","Its outline stays the same even after a period of movement."]'::jsonb,
    'D',
    'He notes that dunes regulate and keep their shape, even after collision.',
    1,
    '{"explanation":"He notes that dunes regulate and keep their shape, even after collision.","fromPassage":"Interestingly, the dune can regulate its own shape, and maintain it as it moves.","instruction":"<p>Choose the correct answer.</p>","context":"<p>&nbsp;Why does Dr Douady compare a barchan dune to a living organism?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2b421864-3aea-459f-ac79-0a5fdfad71d0',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    37,
    'summary_completion',
    'Question 37',
    NULL,
    'barchans',
    'The text states that some barchans sing.',
    1,
    '{"explanation":"The text states that some barchans sing.","fromPassage":" some barchans actually sing.","instruction":"<p>Complete the summary. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<h3><strong>Singing Dunes</strong></h3><p>Singing dunes, which belong to the type of dunes known as ______ &nbsp;, produce a very loud sound which is transmitted at a low frequency. Researchers have worked out that sand grains fall down the dune and start vibrating against other grains, forming a sound wave. Research proves that the individual grains have a similar ______ . But the differences in dimensions alter the&nbsp; ______ &nbsp;of the ''song''. Each grain is covered with a mixture of different&nbsp; ______ &nbsp;and this is vital to the sound production.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '54b8c4de-0422-4f9c-94b4-ada7f4569086',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    38,
    'summary_completion',
    'Question 38',
    NULL,
    'shape',
    'Scientists found the grains were uniform and round.',
    1,
    '{"explanation":"Scientists found the grains were uniform and round.","fromPassage":"Their studies show the grains are a uniform shape, well-rounded from years of striking each other, and that the variations in size affect the tone.","instruction":"<p>Complete the summary. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<h3><strong>Singing Dunes</strong></h3><p>Singing dunes, which belong to the type of dunes known as ______ &nbsp;, produce a very loud sound which is transmitted at a low frequency. Researchers have worked out that sand grains fall down the dune and start vibrating against other grains, forming a sound wave. Research proves that the individual grains have a similar ______ . But the differences in dimensions alter the&nbsp; ______ &nbsp;of the ''song''. Each grain is covered with a mixture of different&nbsp; ______ &nbsp;and this is vital to the sound production.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd63a1611-5f25-4623-babf-9622bf437182',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    39,
    'summary_completion',
    'Question 39',
    NULL,
    'tone',
    'Variations in grain size change the sound.',
    1,
    '{"explanation":"Variations in grain size change the sound.","fromPassage":"Their studies show the grains are a uniform shape, well-rounded from years of striking each other, and that the variations in size affect the tone.","instruction":"<p>Complete the summary. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<h3><strong>Singing Dunes</strong></h3><p>Singing dunes, which belong to the type of dunes known as ______ &nbsp;, produce a very loud sound which is transmitted at a low frequency. Researchers have worked out that sand grains fall down the dune and start vibrating against other grains, forming a sound wave. Research proves that the individual grains have a similar ______ . But the differences in dimensions alter the&nbsp; ______ &nbsp;of the ''song''. Each grain is covered with a mixture of different&nbsp; ______ &nbsp;and this is vital to the sound production.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '499d6f15-7c89-43a9-ae33-cab430930ce1',
    'reading',
    '84284f92-962a-4bf5-bd38-545f311bc906',
    40,
    'summary_completion',
    'Question 40',
    NULL,
    'minerals',
    'The coating that creates sound includes various minerals.',
    1,
    '{"explanation":"The coating that creates sound includes various minerals.","fromPassage":" made from a precise combination of minerals from surrounding rocks including iron, aluminium, manganese, silicon and calcium.","instruction":"<p>Complete the summary. Write&nbsp;<strong>NO MORE THAN TWO WORDS</strong>&nbsp;from the text for each answer.</p>","context":"<h3><strong>Singing Dunes</strong></h3><p>Singing dunes, which belong to the type of dunes known as ______ &nbsp;, produce a very loud sound which is transmitted at a low frequency. Researchers have worked out that sand grains fall down the dune and start vibrating against other grains, forming a sound wave. Research proves that the individual grains have a similar ______ . But the differences in dimensions alter the&nbsp; ______ &nbsp;of the ''song''. Each grain is covered with a mixture of different&nbsp; ______ &nbsp;and this is vital to the sound production.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Day 11: Playing Soccer
-- Source API ID: 1862
-- Generated: 2026-02-26T11:44:17.965Z
-- ============================================

-- ============================================
-- Day 11: Playing Soccer - Part 2: Playing Soccer
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'a2d41016-e281-485f-9782-772742343b00',
    'Day 11: Playing Soccer - Part 2: Playing Soccer',
    'Cambridge IELTS - Playing Soccer',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)
VALUES (
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    'a2d41016-e281-485f-9782-772742343b00',
    1,
    'Playing Soccer',
    'A
Street soccer, as its name implies, is an informal variation of the sport, often played on the street, particularly in urban areas. There are many reasons for the widespread popularity of street soccer. Unlike youth soccer, its more formally organized counterpart, no large space is needed, and goal posts, corner markers, and marked lines, associated with the formal game, are typically absent, as are game officials or referees. Another attraction of street soccer is that it is played frequently and competitively, but does not necessarily require standard 11-a-side teams or fixed playing positions. Unlike in youth soccer, inexperienced street soccer players rarely learn from repetitive technical and tactical drills. Instead, they learn from their poor performance in competition, unconscious of the skills they are nonetheless developing, and without older adults or coaches present. Players learn without effort through playing the game, and soon attain an almost natural feeling for the sport.

B
However, there are lots of cities in the world today where conditions are such that street soccer is no longer possible. Congested traffic now dominates where games were once played. Parks and open fields are used as hangouts for older teenagers with other interests. Add to this the requirement in many localities for official permits to use public spaces and the managed schedules that many young people have today, and spontaneous play of any kind is hard to imagine.

C
In spite of all these obstacles, which are probably solvable in most instances, there is another sociological explanation of why in many places street soccer doesn''t enjoy the same popularity it once did. In his book How Soccer Explains the World, US writer Franklin Foer observes: But for all the talk of freedom, the 1960s parenting style had a far less relaxed side too. Like the 1960s consumer movement which brought seat belts and airbags to cars, the (youth) soccer movement felt like it could create a set of ... regulations that would protect both the child''s body and mind from damage. Soccer leagues like the one I played in as a child handed out ''participation'' prizes to every player, no matter how few games his (or her) team won.... Where most of the world accepts the practice of using your head to hit the ball as an essential element of the game, some (youth) soccer parents have worried over the potential for injury to the brain. An entire industry grew up to manufacture protective headgear.... Even though very little medical evidence supports this fear, some youth leagues prohibited heading the ball altogether.

D
A growing body of people don''t believe street soccer involves a legitimate educational method. They argue that children need to be taught by experts. Youth soccer instruction now begins with four-year-olds, so that they will have an advantage as six-year-olds. This need to get ahead brings with it a fear of falling behind that only expert instruction can prevent. This type of instruction leaves no room for the trial and error approach of street soccer.

E
One of the basic ideas of street soccer is that young players are assigned a particular role by a better player and are expected to play for the good of the team. Such an assignment runs counter to the idea of youth soccer that every child needs to learn every position and will benefit from doing so. In street soccer, you fill the role that you are best suited to at a particular time. While this role assignment can change from game to game, the purpose is always the same: to get the best out of each individual at any given moment.

F
In street soccer, children have to learn patience, to wait their turn, to realize that they are not entitled to make decisions, or even be listened to simply because they show up. Positions of responsibility are earned through competition within the team. Younger players in street soccer must wait to attain those positions. In youth soccer, however, with its overly democratic values, youngsters are guaranteed their time in the spotlight. Whether it''s their turn to be captain, to play a central position or to take a crucial shot, youth soccer players come to believe that hard work and patience aren''t really necessary.

G
Not only does every youth soccer player get a chance, it is assumed that each individual has played well. ''Everyone''s a winner; no one''s a loser'' is a guiding principle of youth soccer. This ensures each individual goes away positive about themselves. No one can leave a game or a practice feeling bad. But, if there really are no losers, then why try at all? Since giving less than your best receives the same reward as giving your best why go to any extra effort? In street soccer, every game results in a winner and a loser and everyone knows who is who. Losing a game is a common experience and players learn early on how to handle this. As a result, unlike most youth soccer players, they acquire resilience. A further difference between these two strands of soccer is that in street soccer a formal record is not kept. You can lose one day and win the next. The results are only temporary and are forgotten within minutes of the end of the match. But in organized youth soccer, the position each person plays and the results are formally noted and maintained throughout a season.',
    905,
    1200
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0665ac1b-d53a-4930-b7f3-9a8b0a2c1045',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    14,
    'matching_info',
    'A contrast between the ways young players gain experience of playing different positions',
    '["","","","","","",""]'::jsonb,
    'E',
    'Section E compares how street soccer assigns roles based on suitability, while youth soccer requires every child to learn every position. This is a direct contrast in how young players gain experience of different positions.',
    1,
    '{"explanation":"Section E compares how street soccer assigns roles based on suitability, while youth soccer requires every child to learn every position. This is a direct contrast in how young players gain experience of different positions.","fromPassage":"Such an assignment runs counter to the idea of youth soccer that every child needs to learn every position and will benefit from doing so.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '50c2060a-0215-4d80-9373-040f672a7a31',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    15,
    'matching_info',
    'Examples outside sport of greater emphasis on individual safety',
    '["","","","","","",""]'::jsonb,
    'C',
    'Section C gives examples outside sport (seat belts and airbags) to show a broader emphasis on child safety.',
    1,
    '{"explanation":"Section C gives examples outside sport (seat belts and airbags) to show a broader emphasis on child safety.","fromPassage":"Like the 1960s consumer movement which brought seat belts and airbags to cars, the (youth) soccer movement felt like it could create a set of ... regulations that would protect both the child''s body and mind from damage.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '08725ff6-960c-4980-942d-790a69fa0f44',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    16,
    'matching_info',
    'A description of methods of selection for leadership on soccer teams',
    '["","","","","","",""]'::jsonb,
    'F',
    'Section F explains that leadership or responsibility positions are earned through competition, not given automatically.',
    1,
    '{"explanation":"Section F explains that leadership or responsibility positions are earned through competition, not given automatically.","fromPassage":"Positions of responsibility are earned through competition within the team.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '45b07bf5-0a3c-49bb-bdd9-c5b4c9f63db6',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    17,
    'matching_info',
    'Details of urban changes that discourage street soccer',
    '["","","","","","",""]'::jsonb,
    'B',
    'Section B lists specific urban changes—traffic, new uses of parks, permit requirements—that make street soccer difficult today.',
    1,
    '{"explanation":"Section B lists specific urban changes—traffic, new uses of parks, permit requirements—that make street soccer difficult today.","fromPassage":"Parks and open fields are used as hangouts for older teenagers with other interests.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fa25f1b8-21c4-471c-873c-5e3ae3435e88',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    18,
    'matching_info',
    'A mention of the lesson that failure teaches street soccer players',
    '["","","","","","",""]'::jsonb,
    'G',
    'Section G explains that losing teaches resilience — this is the lesson failure provides in street soccer.',
    1,
    '{"explanation":"Section G explains that losing teaches resilience — this is the lesson failure provides in street soccer.","fromPassage":"Losing a game is a common experience and players learn early on how to handle this.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2134e5fd-0dcd-486b-996d-3a5bdce829ad',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    19,
    'matching_info',
    'An explanation of why youth soccer emphasises the need for coaches',
    '["","","","","","",""]'::jsonb,
    'D',
    'Section D explains that youth soccer emphasises the need for coaches because parents fear their children will fall behind without expert instruction.',
    1,
    '{"explanation":"Section D explains that youth soccer emphasises the need for coaches because parents fear their children will fall behind without expert instruction.","fromPassage":"This need to get ahead brings with it a fear of falling behind that only expert instruction can prevent.","instruction":"<p>Reading Passage 2 has seven sections,<strong> A-G.</strong> Which section contains the following information?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f9a19480-0ece-4c90-8637-d0179b05e2f5',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    20,
    'mcq_single',
    'Question 20',
    '["Many famous soccer players got their start in street soccer.","Young people can begin playing street soccer at a very early age.","You do not need elaborate facilities to play street soccer."," Inexperienced street soccer players are not criticised for mistakes.","Street soccer teams can have varying numbers of players."]'::jsonb,
    'C,E',
    'The writer notes that street soccer requires no formal field, no special equipment, and no official space — meaning elaborate facilities are unnecessary.',
    1,
    '{"explanation":"The writer notes that street soccer requires no formal field, no special equipment, and no official space — meaning elaborate facilities are unnecessary.","fromPassage":"No large space is needed, and goal posts, corner markers, and marked lines, associated with the formal game, are typically absent, as are game officials or referees.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers</p>","context":"<p>The list below gives some possible reasons for the popularity of street soccer. Which <strong>TWO</strong> of these reasons are mentioned by the writer of the text?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '97585395-6aee-4248-9509-f02d9c63c7bb',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    21,
    'mcq_single',
    'Question 21',
    '["Many famous soccer players got their start in street soccer.","Young people can begin playing street soccer at a very early age.","You do not need elaborate facilities to play street soccer."," Inexperienced street soccer players are not criticised for mistakes.","Street soccer teams can have varying numbers of players."]'::jsonb,
    'C,E',
    'Street soccer does not require fixed numbers of players — the team size can vary.',
    1,
    '{"explanation":"Street soccer does not require fixed numbers of players — the team size can vary.","fromPassage":"Another attraction of street soccer is that it is played frequently and competitively, but does not necessarily require standard 11-a-side teams or fixed playing positions.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers</p>","context":"<p>The list below gives some possible reasons for the popularity of street soccer. Which <strong>TWO</strong> of these reasons are mentioned by the writer of the text?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6e584a1c-e59a-4d40-93c2-aea26f730b32',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    22,
    'mcq_single',
    'Question 22',
    '["Participation in youth soccer became much more expensive.","Some youth soccer leagues adopted more restrictive rules of play.","Fewer young people joined youth soccer teams."," Youth soccer players were sometimes rewarded for simply playing in games.","Soccer equipment manufacturers directed advertising towards parents."]'::jsonb,
    'B,D',
    'Foer explains that some leagues prohibited heading the ball because parents worried about brain injury.',
    1,
    '{"explanation":"Foer explains that some leagues prohibited heading the ball because parents worried about brain injury.","fromPassage":"Even though very little medical evidence supports this fear, some youth leagues prohibited heading the ball altogether.","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers</p>","context":"<p>The list below gives some possible results of the 1960s parenting style. Which <strong>TWO</strong> of these results are mentioned by Franklin Foer in the excerpt from How Soccer Explains the World?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '889dd87b-08e1-4604-a2a4-f7551bacf74d',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    23,
    'mcq_single',
    'Question 23',
    '["Participation in youth soccer became much more expensive.","Some youth soccer leagues adopted more restrictive rules of play.","Fewer young people joined youth soccer teams."," Youth soccer players were sometimes rewarded for simply playing in games.","Soccer equipment manufacturers directed advertising towards parents."]'::jsonb,
    'B,D',
    'Foer says youth leagues gave participation prizes regardless of performance.',
    1,
    '{"explanation":"Foer says youth leagues gave participation prizes regardless of performance.","fromPassage":"Soccer leagues like the one I played in as a child handed out ‘participation’ prizes to every player, no matter how few games his (or her) team won ","instruction":"<p>Choose&nbsp;<strong>TWO</strong>&nbsp;correct answers</p>","context":"<p>The list below gives some possible results of the 1960s parenting style. Which <strong>TWO</strong> of these results are mentioned by Franklin Foer in the excerpt from How Soccer Explains the World?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f891c810-f133-4ae3-9d1e-de72f28f2a30',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    24,
    'summary_completion',
    'Question 24',
    NULL,
    'principle',
    'Youth soccer follows the principle that everyone should feel good regardless of performance.',
    1,
    '{"explanation":"Youth soccer follows the principle that everyone should feel good regardless of performance.","fromPassage":"Everyone’s a winner; no one’s a loser’ is a guiding principle of youth soccer.","instruction":"<p>Answer the questions. Write&nbsp;<strong>ONE WORD ONLY&nbsp;</strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>Winners and losers</strong></h3><p>For youth soccer players, a key&nbsp; ______ &nbsp;is that they should always come away from the game with a positive attitude.</p><p><br></p><p>In this respect, regardless of the effort the players make, they get some kind of&nbsp; ______ &nbsp;at the end of a game.</p><p><br></p><p>In street soccer, however, players gain resilience because they have to learn to cope with failure. But the outcome of a match isn''t remembered for long. In fact, no-one ever keeps a&nbsp; ______ &nbsp;of the results of games.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2f7d01c2-8d29-4c64-a477-87220bf8132b',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    25,
    'summary_completion',
    'Question 25',
    NULL,
    'reward',
    'Youth soccer players get a reward whether they try their best or not.',
    1,
    '{"explanation":"Youth soccer players get a reward whether they try their best or not.","fromPassage":"Since giving less than your best receives the same reward as giving your best why go to any extra effort?","instruction":"<p>Answer the questions. Write&nbsp;<strong>ONE WORD ONLY&nbsp;</strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>Winners and losers</strong></h3><p>For youth soccer players, a key&nbsp; ______ &nbsp;is that they should always come away from the game with a positive attitude.</p><p><br></p><p>In this respect, regardless of the effort the players make, they get some kind of&nbsp; ______ &nbsp;at the end of a game.</p><p><br></p><p>In street soccer, however, players gain resilience because they have to learn to cope with failure. But the outcome of a match isn''t remembered for long. In fact, no-one ever keeps a&nbsp; ______ &nbsp;of the results of games.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '73abe348-0f35-4fc5-92d2-c321de4661f7',
    'reading',
    'd23b4317-9c44-474c-86ef-b78178a7fac7',
    26,
    'summary_completion',
    'Question 26',
    NULL,
    'record',
    'Street soccer never keeps a formal record of the results.',
    1,
    '{"explanation":"Street soccer never keeps a formal record of the results.","fromPassage":"A further difference between these two strands of soccer is that in street soccer a formal record is not kept.","instruction":"<p>Answer the questions. Write&nbsp;<strong>ONE WORD ONLY&nbsp;</strong>from the text&nbsp;for&nbsp;each&nbsp;answer.</p>","context":"<h3><strong>Winners and losers</strong></h3><p>For youth soccer players, a key&nbsp; ______ &nbsp;is that they should always come away from the game with a positive attitude.</p><p><br></p><p>In this respect, regardless of the effort the players make, they get some kind of&nbsp; ______ &nbsp;at the end of a game.</p><p><br></p><p>In street soccer, however, players gain resilience because they have to learn to cope with failure. But the outcome of a match isn''t remembered for long. In fact, no-one ever keeps a&nbsp; ______ &nbsp;of the results of games.</p>"}'::jsonb
);


