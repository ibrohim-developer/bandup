-- ============================================
-- IELTS Platform - Seed Data
-- Run AFTER both migration files
-- ============================================

-- ============================================
-- TESTS (3 tests: easy, medium, hard)
-- ============================================
INSERT INTO public.tests (id, title, description, difficulty_level, is_published) VALUES
('11111111-1111-1111-1111-111111111111', 'IELTS Practice Test 1', 'General training test covering all modules with standard difficulty', 'easy', true),
('22222222-2222-2222-2222-222222222222', 'IELTS Practice Test 2', 'Academic test with moderate difficulty passages and tasks', 'medium', true),
('33333333-3333-3333-3333-333333333333', 'IELTS Practice Test 3', 'Advanced academic test with complex passages and challenging tasks', 'hard', true);

-- ============================================
-- LISTENING SECTIONS (4 sections per test)
-- ============================================

-- Test 1 (Easy) - Listening Sections
INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds, transcript) VALUES
('a1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 1, '/audio/test1/section1.mp3', 300, 'Section 1: A conversation between a student and a university accommodation officer about finding suitable housing near campus.'),
('a1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 2, '/audio/test1/section2.mp3', 360, 'Section 2: A guided tour of a local community center describing facilities and membership options.'),
('a1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 3, '/audio/test1/section3.mp3', 420, 'Section 3: A discussion between three students planning a group presentation on renewable energy sources.'),
('a1000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 4, '/audio/test1/section4.mp3', 450, 'Section 4: A university lecture on the history of public transportation systems in major cities.');

-- Test 2 (Medium) - Listening Sections
INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds, transcript) VALUES
('a2000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 1, '/audio/test2/section1.mp3', 310, 'Section 1: A phone call to a travel agency about booking a holiday package to Southeast Asia.'),
('a2000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 2, '/audio/test2/section2.mp3', 370, 'Section 2: A radio broadcast about changes to local recycling policies and waste management.'),
('a2000001-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 3, '/audio/test2/section3.mp3', 430, 'Section 3: A seminar discussion between a tutor and two students about research methodology.'),
('a2000001-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 4, '/audio/test2/section4.mp3', 460, 'Section 4: An academic lecture on the psychological effects of social media on adolescents.');

-- Test 3 (Hard) - Listening Sections
INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds, transcript) VALUES
('a3000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 1, '/audio/test3/section1.mp3', 320, 'Section 1: A conversation at a medical clinic about registering as a new patient and available services.'),
('a3000001-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 2, '/audio/test3/section2.mp3', 380, 'Section 2: A presentation about a new urban development project including residential and commercial zones.'),
('a3000001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 3, '/audio/test3/section3.mp3', 440, 'Section 3: A discussion between researchers about the findings of a climate change study in Arctic regions.'),
('a3000001-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 4, '/audio/test3/section4.mp3', 470, 'Section 4: A lecture on neurolinguistics and how the brain processes multiple languages simultaneously.');

-- ============================================
-- LISTENING QUESTIONS - Test 1 (40 questions)
-- ============================================

-- Test 1 - Section 1 (Questions 1-10)
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('b1010001-0000-0000-0000-000000000001', 'listening', 'a1000001-0000-0000-0000-000000000001', 1, 'mcq_single', 'What type of accommodation is the student looking for?', '["A. A shared apartment", "B. A single room in a hall of residence", "C. A homestay with a local family", "D. A studio apartment"]', 'B', 'The student mentions wanting to live in university halls for the first year.', 1),
('b1010001-0000-0000-0000-000000000002', 'listening', 'a1000001-0000-0000-0000-000000000001', 2, 'gap_fill', 'The monthly rent for the recommended option is £_____.', null, '485', 'The officer states the monthly cost is four hundred and eighty-five pounds.', 1),
('b1010001-0000-0000-0000-000000000003', 'listening', 'a1000001-0000-0000-0000-000000000001', 3, 'mcq_single', 'What is included in the rent?', '["A. All meals", "B. Electricity and water only", "C. All utilities and internet", "D. Nothing extra"]', 'C', 'The officer confirms that all utilities including internet are covered.', 1),
('b1010001-0000-0000-0000-000000000004', 'listening', 'a1000001-0000-0000-0000-000000000001', 4, 'gap_fill', 'The deposit required is equivalent to _____ months rent.', null, '2', 'A two-month deposit is required before moving in.', 1),
('b1010001-0000-0000-0000-000000000005', 'listening', 'a1000001-0000-0000-0000-000000000001', 5, 'mcq_single', 'When is the earliest move-in date?', '["A. 1st August", "B. 15th August", "C. 1st September", "D. 15th September"]', 'C', 'Move-in begins on the first of September for the new academic year.', 1),
('b1010001-0000-0000-0000-000000000006', 'listening', 'a1000001-0000-0000-0000-000000000001', 6, 'gap_fill', 'The hall of residence is located on _____ Road.', null, 'Greenfield', 'The accommodation is on Greenfield Road, a 10-minute walk from campus.', 1),
('b1010001-0000-0000-0000-000000000007', 'listening', 'a1000001-0000-0000-0000-000000000001', 7, 'mcq_single', 'What facility is NOT available in the hall?', '["A. Gym", "B. Laundry room", "C. Common kitchen", "D. Swimming pool"]', 'D', 'The officer lists gym, laundry, and kitchen but does not mention a pool.', 1),
('b1010001-0000-0000-0000-000000000008', 'listening', 'a1000001-0000-0000-0000-000000000001', 8, 'gap_fill', 'The application deadline is _____ June.', null, '30th', 'Applications must be submitted by the 30th of June.', 1),
('b1010001-0000-0000-0000-000000000009', 'listening', 'a1000001-0000-0000-0000-000000000001', 9, 'mcq_single', 'How should the student submit the application?', '["A. By email", "B. In person at the office", "C. Through the online portal", "D. By post"]', 'C', 'The officer directs the student to the online accommodation portal.', 1),
('b1010001-0000-0000-0000-000000000010', 'listening', 'a1000001-0000-0000-0000-000000000001', 10, 'gap_fill', 'The student''s reference number is _____.', null, 'STU7842', 'The officer provides reference number STU7842 for tracking.', 1);

-- Test 1 - Section 2 (Questions 11-20)
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('b1020001-0000-0000-0000-000000000001', 'listening', 'a1000001-0000-0000-0000-000000000002', 11, 'mcq_single', 'What day does the community center open?', '["A. Monday to Friday only", "B. Every day of the week", "C. Monday to Saturday", "D. Weekdays and Sunday"]', 'B', 'The guide mentions the center is open seven days a week.', 1),
('b1020001-0000-0000-0000-000000000002', 'listening', 'a1000001-0000-0000-0000-000000000002', 12, 'gap_fill', 'Annual membership costs £_____.', null, '120', 'The standard annual membership fee is one hundred and twenty pounds.', 1),
('b1020001-0000-0000-0000-000000000003', 'listening', 'a1000001-0000-0000-0000-000000000002', 13, 'matching_info', 'Match each facility with its location in the building.', '{"items": ["Swimming pool", "Dance studio", "Cafe"], "options": ["Ground floor", "First floor", "Basement"]}', 'Basement,First floor,Ground floor', 'Swimming pool is in the basement, dance studio on the first floor, cafe on the ground floor.', 1),
('b1020001-0000-0000-0000-000000000004', 'listening', 'a1000001-0000-0000-0000-000000000002', 14, 'mcq_single', 'What age group is the junior membership for?', '["A. Under 12", "B. Under 16", "C. Under 18", "D. Under 21"]', 'C', 'Junior membership is available for those under 18 years old.', 1),
('b1020001-0000-0000-0000-000000000005', 'listening', 'a1000001-0000-0000-0000-000000000002', 15, 'gap_fill', 'The center was originally built in _____.', null, '1985', 'The community center was originally constructed in 1985.', 1),
('b1020001-0000-0000-0000-000000000006', 'listening', 'a1000001-0000-0000-0000-000000000002', 16, 'mcq_single', 'What new class is being introduced next month?', '["A. Yoga", "B. Pilates", "C. Kickboxing", "D. Pottery"]', 'D', 'A new pottery class is starting next month in the arts wing.', 1),
('b1020001-0000-0000-0000-000000000007', 'listening', 'a1000001-0000-0000-0000-000000000002', 17, 'gap_fill', 'The parking area has space for _____ cars.', null, '45', 'The car park accommodates forty-five vehicles.', 1),
('b1020001-0000-0000-0000-000000000008', 'listening', 'a1000001-0000-0000-0000-000000000002', 18, 'mcq_single', 'What discount do members get at the cafe?', '["A. 5%", "B. 10%", "C. 15%", "D. 20%"]', 'B', 'Members receive a 10% discount on all cafe purchases.', 1),
('b1020001-0000-0000-0000-000000000009', 'listening', 'a1000001-0000-0000-0000-000000000002', 19, 'gap_fill', 'The center''s phone number is 0800 _____.', null, '555 3421', 'The contact number given is 0800 555 3421.', 1),
('b1020001-0000-0000-0000-000000000010', 'listening', 'a1000001-0000-0000-0000-000000000002', 20, 'mcq_single', 'What event is held every Saturday morning?', '["A. Farmers market", "B. Book club", "C. Children''s sports club", "D. Art exhibition"]', 'A', 'A farmers market takes place every Saturday morning in the main hall.', 1);

-- Test 1 - Section 3 (Questions 21-30)
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('b1030001-0000-0000-0000-000000000001', 'listening', 'a1000001-0000-0000-0000-000000000003', 21, 'mcq_single', 'What is the main topic of the group presentation?', '["A. Nuclear energy", "B. Renewable energy sources", "C. Fossil fuels", "D. Energy conservation"]', 'B', 'The students are planning a presentation on renewable energy sources.', 1),
('b1030001-0000-0000-0000-000000000002', 'listening', 'a1000001-0000-0000-0000-000000000003', 22, 'gap_fill', 'The presentation is due in _____ weeks.', null, '3', 'They mention the deadline is three weeks from now.', 1),
('b1030001-0000-0000-0000-000000000003', 'listening', 'a1000001-0000-0000-0000-000000000003', 23, 'mcq_single', 'Who will cover the section on solar energy?', '["A. Maria", "B. James", "C. Chen", "D. All three"]', 'A', 'Maria volunteers to research and present the solar energy section.', 1),
('b1030001-0000-0000-0000-000000000004', 'listening', 'a1000001-0000-0000-0000-000000000003', 24, 'mcq_single', 'What concern does James raise about the project?', '["A. The topic is too broad", "B. They need more team members", "C. The deadline is too soon", "D. They lack access to resources"]', 'A', 'James worries the topic is too broad and suggests narrowing focus.', 1),
('b1030001-0000-0000-0000-000000000005', 'listening', 'a1000001-0000-0000-0000-000000000003', 25, 'gap_fill', 'They agree the presentation should last _____ minutes.', null, '20', 'The group decides on a twenty-minute presentation.', 1),
('b1030001-0000-0000-0000-000000000006', 'listening', 'a1000001-0000-0000-0000-000000000003', 26, 'mcq_single', 'What visual aid will they primarily use?', '["A. Posters", "B. Handouts", "C. PowerPoint slides", "D. Video clips"]', 'C', 'They agree to use PowerPoint slides as the main visual aid.', 1),
('b1030001-0000-0000-0000-000000000007', 'listening', 'a1000001-0000-0000-0000-000000000003', 27, 'gap_fill', 'Chen will focus on _____ energy in his section.', null, 'wind', 'Chen takes responsibility for the wind energy section.', 1),
('b1030001-0000-0000-0000-000000000008', 'listening', 'a1000001-0000-0000-0000-000000000003', 28, 'mcq_single', 'Where will they meet to rehearse?', '["A. The library", "B. The student union", "C. Maria''s apartment", "D. The lecture hall"]', 'A', 'They plan to rehearse in the library study room.', 1),
('b1030001-0000-0000-0000-000000000009', 'listening', 'a1000001-0000-0000-0000-000000000003', 29, 'gap_fill', 'The presentation counts for _____% of their final grade.', null, '25', 'The presentation is worth twenty-five percent of the final grade.', 1),
('b1030001-0000-0000-0000-000000000010', 'listening', 'a1000001-0000-0000-0000-000000000003', 30, 'mcq_single', 'What does James suggest adding to make it more engaging?', '["A. A quiz for the audience", "B. A demonstration", "C. Case studies from different countries", "D. Guest speaker"]', 'C', 'James suggests including case studies from various countries.', 1);

-- Test 1 - Section 4 (Questions 31-40)
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('b1040001-0000-0000-0000-000000000001', 'listening', 'a1000001-0000-0000-0000-000000000004', 31, 'mcq_single', 'When was the first public bus service introduced?', '["A. 1820s", "B. 1830s", "C. 1850s", "D. 1880s"]', 'B', 'The lecturer states the first public bus route began in the 1830s in Paris.', 1),
('b1040001-0000-0000-0000-000000000002', 'listening', 'a1000001-0000-0000-0000-000000000004', 32, 'gap_fill', 'The London Underground opened in _____.', null, '1863', 'The Metropolitan Railway in London opened in 1863.', 1),
('b1040001-0000-0000-0000-000000000003', 'listening', 'a1000001-0000-0000-0000-000000000004', 33, 'summary_completion', 'According to the lecture, the main advantage of trams was their _____ compared to horse-drawn carriages.', null, 'speed and reliability', 'Trams offered greater speed and reliability over horse-drawn transport.', 1),
('b1040001-0000-0000-0000-000000000004', 'listening', 'a1000001-0000-0000-0000-000000000004', 34, 'mcq_single', 'What factor most influenced the decline of tram systems?', '["A. Cost of maintenance", "B. Rise of private car ownership", "C. Safety concerns", "D. Environmental regulations"]', 'B', 'The rise of private cars in the mid-20th century led to tram decline.', 1),
('b1040001-0000-0000-0000-000000000005', 'listening', 'a1000001-0000-0000-0000-000000000004', 35, 'gap_fill', 'The first electric subway system was built in _____.', null, 'Budapest', 'Budapest opened the first electric underground railway in 1896.', 1),
('b1040001-0000-0000-0000-000000000006', 'listening', 'a1000001-0000-0000-0000-000000000004', 36, 'mcq_single', 'What percentage of city commuters used public transport in the 1950s?', '["A. About 40%", "B. About 50%", "C. About 60%", "D. About 70%"]', 'D', 'Approximately 70% of urban commuters relied on public transport in the 1950s.', 1),
('b1040001-0000-0000-0000-000000000007', 'listening', 'a1000001-0000-0000-0000-000000000004', 37, 'summary_completion', 'Modern cities are now investing in _____ to reduce carbon emissions.', null, 'electric bus fleets', 'Cities are transitioning to electric bus fleets as part of green initiatives.', 1),
('b1040001-0000-0000-0000-000000000008', 'listening', 'a1000001-0000-0000-0000-000000000004', 38, 'mcq_single', 'Which city does the lecturer cite as a model for integrated transport?', '["A. Tokyo", "B. London", "C. Singapore", "D. New York"]', 'C', 'Singapore is highlighted as a model for seamless integrated transport.', 1),
('b1040001-0000-0000-0000-000000000009', 'listening', 'a1000001-0000-0000-0000-000000000004', 39, 'gap_fill', 'The concept of "mobility as a _____" is transforming urban planning.', null, 'service', 'Mobility as a Service (MaaS) is the emerging concept discussed.', 1),
('b1040001-0000-0000-0000-000000000010', 'listening', 'a1000001-0000-0000-0000-000000000004', 40, 'mcq_single', 'What is the lecturer''s prediction for public transport by 2050?', '["A. It will become fully automated", "B. It will be replaced by flying taxis", "C. It will become free in most cities", "D. It will double in capacity worldwide"]', 'A', 'The lecturer predicts fully automated public transport systems by 2050.', 1);

-- ============================================
-- READING PASSAGES (3 per test)
-- ============================================

-- Test 1 (Easy) - Reading Passages
INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count) VALUES
('c1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 1, 'Aphantasia: A life without mental images',
'"Close your eyes and imagine walking along a sandy beach and then gazing over the horizon as the Sun rises." Most people can readily conjure images inside their head - known as their mind''s eye. But this year scientists have described a condition, aphantasia, in which some people are unable to visualise mental images.

Niel Kenmuir, from Lancaster, has always had a blind mind''s eye. He knew he was different even in childhood. "My stepfather, when I couldn''t sleep, told me to count sheep, and he explained what he meant, I tried to do it and I couldn''t," he says. "I couldn''t see any sheep jumping over fences, there was nothing to count."

Our memories are often tied up in images, think back to a wedding or first day at school. As a result, Niel admits, some aspects of his memory are "terrible", but he is very good at remembering facts. And, like others with aphantasia, he struggles to recognise faces. Yet he does not see aphantasia as a disability, but simply a different way of experiencing life.

Ironically, Niel now works in a bookshop, although he largely sticks to the non-fiction aisles. His condition begs the question what is going on inside his picture-less mind. I asked him what happens when he tries to picture his fiancee. "This is the hardest thing to describe, what happens in my head when I think about things," he says. "When I think about my fiancee there is no image, but I am definitely thinking about her, I know today she has her hair up at the back, she''s brunette. But I''m not describing an image I am looking at, I''m remembering features about her, that''s the strangest thing and maybe that is a source of some regret."

The response from his mates is a very sympathetic: "You''re weird." But while Niel is very relaxed about his inability to picture things, it is often a cause of distress for others. One person who took part in a study into aphantasia said he had started to feel "isolated" and "alone" after discovering that other people could see images in their heads. Being unable to reminisce about his mother years after her death led to him being "extremely distraught".

At the other end of the spectrum is children''s book illustrator, Lauren Beard, whose work on the Fairytale Hairdresser series will be familiar to many six-year-olds. Her career relies on the vivid images that leap into her mind''s eye when she reads text from her author. When I met her in her box-room studio in Manchester, she was working on a dramatic scene in the next book.

"Straightaway I can visualise this grand glass chandelier in some sort of French kind of ballroom, and the little baby just swinging off it and really heavy thick curtains," she says. "I think I have a strong imagination, so I can create the world and then keep adding to it so it gets sort of bigger and bigger in my mind and the characters too they sort of evolve. I couldn''t really imagine what it''s like to not imagine, I think it must be a bit of a shame really."

Not many people have mental imagery as vibrant as Lauren or as blank as Niel. They are the two extremes of visualisation. Adam Zeman, a professor of cognitive and behavioural neurology, wants to compare the lives and experiences of people with aphantasia and its polar-opposite hyperphantasia. His team, based at the University of Exeter, coined the term aphantasia this year in a study in the journal Cortex.

Prof Zeman tells the BBC: "People who have contacted us say they are really delighted that this has been recognised and has been given a name, because they have been trying to explain to people for years that there is this oddity that they find hard to convey to others." How we imagine is clearly very subjective - one person''s vivid scene could be another''s grainy picture. But Prof Zeman is certain that aphantasia is real. People often report being able to dream in pictures, and there have been reported cases of people losing the ability to think in images after a brain injury.

He is adamant that aphantasia is "not a disorder" and says it may affect up to one in 50 people. But he adds: "I think it makes quite an important difference to their experience of life because many of us spend our lives with imagery hovering somewhere in the mind''s eye which we inspect from time to time, it''s a variability of human experience."', 680),

('c1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 2, 'Life lessons from villains, crooks and gangsters',
'A) A notorious Mexican drug baron''s audacious escape from prison in July doesn''t, at first, appear to have much to teach corporate boards. But some in the business world suggest otherwise. Beyond the morally reprehensible side of criminals'' work, some business gurus say organised crime syndicates, computer hackers, pirates and others operating outside the law could teach legitimate corporations a thing or two about how to hustle and respond to rapid change.

B) Far from encouraging illegality, these gurus argue that - in the same way big corporations sometimes emulate start-ups - business leaders could learn from the underworld about flexibility, innovation and the ability to pivot quickly. "There is a nimbleness to criminal organisations that legacy corporations don''t have," said Marc Goodman, head of the Future Crimes Institute and global cyber-crime advisor. While traditional businesses focus on rules they have to follow, criminals look to circumvent them. "For criminals, the sky is the limit and that creates the opportunity to think much, much bigger."

C) Joaquin Guzman, the head of the Mexican Sinaloa drug cartel, for instance, slipped out of his prison cell through a tiny hole in his shower that led to a mile-long tunnel fitted with lights and ventilation. Making a break for it required creative thinking, long-term planning and perseverance - essential skills similar to those needed to achieve success in big business.

D) While Devin Liddell, who heads brand strategy for Seattle-based design consultancy, Teague, condemns the violence and other illegal activities he became curious as to how criminal groups endure. Some cartels stay in business despite multiple efforts by law enforcement on both sides of the US border and millions of dollars from international agencies to shut them down. Liddell genuinely believes there''s a lesson in longevity here. One strategy he underlined was how the bad guys respond to change. In order to bypass the border between Mexico and the US, for example, the Sinaloa cartel went to great lengths. It built a vast underground tunnel, hired family members as border agents and even used a catapult to circumvent a high-tech fence.

E) By contrast, many legitimate businesses fail because they hesitate to adapt quickly to changing market winds. One high-profile example is movie and game rental company Blockbuster, which didn''t keep up with the market and lost business to mail order video rentals and streaming technologies. The brand has all but faded from view. Liddell argues the difference between the two groups is that criminal organisations often have improvisation encoded into their daily behaviour, while larger companies think of innovation as a set process. "This is a leadership challenge," said Liddell. "How well companies innovate and organise is a reflection of leadership."

F) Cash-strapped start-ups also use unorthodox strategies to problem solve and build their businesses up from scratch. This creativity and innovation is often borne out of necessity, such as tight budgets. Both criminals and start-up founders "question authority, act outside the system and see new and clever ways of doing things," said Goodman. "Either they become Elon Musk or El Chapo." And, some entrepreneurs aren''t even afraid to operate in legal grey areas in their effort to disrupt the marketplace. The co-founders of music streaming service Napster, for example, knowingly broke music copyright rules with their first online file sharing service, but their technology paved the way for legal innovation as regulators caught up.

G) Goodman and others believe thinking hard about problem solving before worrying about restrictions could prevent established companies falling victim to rivals less constrained by tradition. In their book The Misfit Economy, Alexa Clay and Kyra Maya Phillips examine how individuals can apply that mindset to become more innovative and entrepreneurial within corporate structures. They studied not just violent criminals like Somali pirates, but others who break the rules in order to find creative solutions to their business problems, such as people living in the slums of Mumbai or computer hackers. They picked out five common traits among this group: the ability to hustle, pivot, provoke, hack and copycat.

H) Clay gives a Saudi entrepreneur named Walid Abdul-Wahab as a prime example. Abdul-Wahab worked with Amish farmers to bring camel milk to American consumers even before US regulators approved it. Through perseverance, he eventually found a network of Amish camel milk farmers and started selling the product via social media. Now his company, Desert Farms, sells to giant mainstream retailers like Whole Foods Market. Those on the fringe don''t always have the option of traditional, corporate jobs and that forces them to think more creatively about how to make a living, Clay said. They must develop grit and resilience in order to last outside the cushy confines of cubicle life. "In many cases scarcity is the mother of invention," Clay said.', 750),

('c1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 3, 'Sea Monsters',
'Sea monsters are the stuff of legend - lurking not just in the depths of the oceans, but also the darker corners of our minds. What is it that draws us to these creatures?

"This inhuman place makes human monsters," wrote Stephen King in his novel The Shining. Many academics agree that monsters lurk in the deepest recesses, they prowl through our ancestral minds appearing in the half-light, under the bed - or at the bottom of the sea.

"They don''t really exist, but they play a huge role in our mindscapes, in our dreams, stories, nightmares, myths and so on," says Matthias Classen, assistant professor of literature and media at Aarhus University in Denmark, who studies monsters in literature. "Monsters say something about human psychology, not the world."

One Norse legend talks of the Kraken, a deep sea creature that was the curse of fishermen. If sailors found a place with many fish, most likely it was the monster that was driving them to the surface. If it saw the ship it would pluck the hapless sailors from the boat and drag them to a watery grave.

This terrifying legend occupied the mind and pen of the poet Alfred Lord Tennyson too. In his short 1830 poem The Kraken he wrote: "Below the thunders of the upper deep, / Far far beneath in the abysmal sea, / His ancient, dreamless, uninvaded sleep / The Kraken sleepeth."

The deeper we travel into the ocean, the deeper we delve into our own psyche. And when we can go no further - there lurks the Kraken.

Most likely the Kraken is based on a real creature - the giant squid. The huge mollusc takes pride of place as the personification of the terrors of the deep sea. Sailors would have encountered it at the surface, dying, and probably thrashing about. It would have made a weird sight, "about the most alien thing you can imagine," says Edith Widder, CEO at the Ocean Research and Conservation Association.

"It has eight lashing arms and two slashing tentacles growing straight out of its head and it''s got serrated suckers that can latch on to the slimiest of prey and it''s got a parrot beak that can rip flesh. It''s got an eye the size of your head, it''s got a jet propulsion system and three hearts that pump blue blood."

The giant squid continued to dominate stories of sea monsters with the famous 1870 novel, Twenty Thousand Leagues Under the Sea, by Jules Verne. Verne''s submarine fantasy is a classic story of puny man against a gigantic squid. The monster needed no embellishment - this creature was scary enough, and Verne incorporated as much fact as possible into the story. Both Twenty Thousand Leagues Under the Sea and Victor Hugo''s Toilers of the Sea tried to represent the giant squid as actual zoological animals, much more taking the squid as a biological creature than a mythical creature. It was a given that the squid was vicious and would readily attack humans given the chance.

That myth wasn''t busted until 2012, when Edith Widder and her colleagues were the first people to successfully film giant squid under water and see first-hand the true character of the monster of the deep. They realised previous attempts to film squid had failed because the bright lights and noisy thrusters on submersibles had frightened them away.

By quietening down the engines and using bioluminescence to attract it, they managed to see this most extraordinary animal in its natural habitat. It serenely glided into view, its body rippled with metallic colours of bronze and silver. Its huge, intelligent eye watched the submarine warily as it delicately picked at the bait with its beak. It was balletic and mesmeric. It could not have been further from the gnashing, human-destroying creature of myth and literature. In reality this is a gentle giant that is easily scared and pecks at its food.

Another giant squid lies peacefully in the Natural History Museum in London, in the Spirit Room, where it is preserved in a huge glass case. In 2004 it was caught in a fishing net off the Falkland Islands and died at the surface. The crew immediately froze its body and it was sent to be preserved in the museum by the Curator of Molluscs, Jon Ablett. It is called Archie, an affectionate short version of its Latin name Architeuthis dux. It is the longest preserved specimen of a giant squid in the world.

"It really has brought science to life for many people," says Ablett. "Sometimes I feel a bit overshadowed by Archie, most of my work is on slugs and snails but unfortunately most people don''t want to talk about that!"

And so today we can watch Archie''s graceful relative on film and stare Archie herself (she is a female) eye-to-eye in a museum. But have we finally slain the monster of the deep? Now we know there is nothing to be afraid of, can the Kraken finally be laid to rest? Probably not says Classen. "We humans are afraid of the strangest things. They don''t need to be realistic. There''s no indication that enlightenment and scientific progress has banished the monsters from the shadows of our imaginations. We will continue to be afraid of very strange things, including probably sea monsters."

Indeed we are. The Kraken made a fearsome appearance in the blockbuster series Pirates of the Caribbean. It forced Captain Jack Sparrow to face his demons in a terrifying face-to-face encounter. Pirates needed the monstrous Kraken, nothing else would do. Or, as the German film director Werner Herzog put it, "What would an ocean be without a monster lurking in the dark? It would be like sleep without dreams."', 850);

-- Test 2 (Medium) - Reading Passages
INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count) VALUES
('c2000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 1, 'The Economics of Space Tourism',
'Space tourism, once the exclusive domain of science fiction, is rapidly becoming a commercial reality. Companies such as SpaceX, Blue Origin, and Virgin Galactic have made significant strides in developing vehicles capable of carrying paying passengers beyond Earth''s atmosphere, ushering in a new era of commercial space travel.

The economics of space tourism are complex and evolving. Early flights have commanded prices in the hundreds of thousands to tens of millions of dollars per seat, placing them firmly in the realm of the ultra-wealthy. However, proponents argue that prices will decrease significantly as technology matures and competition increases, following a trajectory similar to that of commercial aviation in the early twentieth century.

The potential economic impact of a thriving space tourism industry extends far beyond ticket sales. Spaceport development creates construction and operational jobs in often economically disadvantaged regions. Supporting industries including specialized manufacturing, training facilities, and hospitality services all stand to benefit from increased space tourism activity.

Critics of space tourism raise valid concerns about its environmental impact. Rocket launches produce carbon dioxide and other pollutants, and the cumulative effect of frequent launches could contribute to atmospheric damage. The industry is aware of these concerns and is investing in the development of more sustainable propulsion systems, including those using liquid hydrogen and oxygen that produce only water as exhaust.

From a regulatory perspective, space tourism presents unique challenges. Questions of liability, insurance, and passenger safety in an environment where no comprehensive international framework exists are being addressed by organizations including the Federal Aviation Administration and the United Nations Office for Outer Space Affairs.

Despite the challenges, the trajectory of the space tourism industry appears firmly upward. Market analysts project the industry could be worth over 8 billion dollars by 2030, driven by technological advances, increasing competition, and growing public interest in space exploration.', 280),

('c2000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 2, 'The Science of Sleep',
'Sleep is one of the most fundamental biological processes, yet it remains one of the least understood aspects of human physiology. Despite spending roughly one-third of our lives asleep, scientists are only beginning to unravel the complex mechanisms that govern sleep and its critical role in maintaining physical and mental health.

The sleep cycle consists of several distinct stages, broadly categorized into non-rapid eye movement (NREM) sleep and rapid eye movement (REM) sleep. NREM sleep comprises three stages of progressively deeper sleep, during which the body repairs tissues, builds bone and muscle, and strengthens the immune system. REM sleep, characterized by rapid eye movements and vivid dreaming, is believed to play a crucial role in memory consolidation and emotional processing.

A typical night''s sleep involves four to six complete cycles, each lasting approximately 90 minutes. The composition of these cycles changes throughout the night, with deeper NREM sleep predominating in the early hours and REM sleep becoming more prominent towards morning. This architecture of sleep is influenced by two primary regulatory processes: the circadian rhythm, an internal biological clock synchronized to the 24-hour light-dark cycle, and sleep homeostasis, the increasing pressure to sleep that builds during waking hours.

The consequences of chronic sleep deprivation are far-reaching and well-documented. Insufficient sleep has been linked to an increased risk of cardiovascular disease, diabetes, obesity, and mental health disorders including depression and anxiety. Cognitive function deteriorates significantly with sleep loss, affecting attention, decision-making, and reaction time. Studies have shown that being awake for 24 hours produces cognitive impairment comparable to having a blood alcohol concentration of 0.1%, well above the legal driving limit in most countries.

Modern lifestyles pose significant challenges to healthy sleep patterns. The ubiquitous glow of electronic screens, irregular work schedules, and the cultural glorification of busyness all conspire to erode both the quantity and quality of sleep. The blue light emitted by smartphones and computers suppresses the production of melatonin, the hormone that signals the body to prepare for sleep, making it harder to fall asleep after evening screen use.

Sleep research has gained increasing attention and funding in recent years, reflecting growing recognition of sleep''s importance to public health. New technologies including wearable sleep trackers and smart mattresses are providing researchers and individuals with unprecedented data about sleep patterns, though experts caution that consumer devices may not always provide clinically accurate measurements.', 380),

('c2000001-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 3, 'Urbanization and Biodiversity',
'The rapid expansion of urban areas represents one of the most significant environmental challenges of our time. By 2050, an estimated 68% of the world''s population will live in cities, up from 55% today. This unprecedented wave of urbanization is having profound effects on biodiversity, both locally and globally, transforming landscapes and ecosystems in ways that are complex and often irreversible.

Urbanization affects biodiversity through several mechanisms. The most direct is habitat destruction: as cities expand, natural habitats are converted to built environments, displacing or eliminating the species that depend on them. Fragmentation of remaining natural areas creates isolated patches of habitat that may be too small to support viable populations of many species. The resulting ''island effect'' reduces genetic diversity and increases the vulnerability of populations to local extinction.

However, the relationship between urbanization and biodiversity is not simply one of destruction. Cities can and do support significant biodiversity, often in unexpected ways. Urban green spaces including parks, gardens, and green roofs provide habitat for a variety of plant and animal species. Some species have adapted remarkably well to urban environments, with urban populations of birds, foxes, and raccoons thriving alongside human residents.

The concept of ''biophilic design'' is gaining traction among urban planners and architects. This approach seeks to incorporate natural elements into the built environment, creating buildings and public spaces that support both human wellbeing and biodiversity. Green corridors connecting urban parks and natural areas allow wildlife to move through the city, maintaining genetic exchange between populations.

Research has shown that urban biodiversity provides important ecosystem services to city residents. Urban trees absorb air pollutants and reduce the urban heat island effect, while urban wetlands help manage stormwater and reduce flooding risk. Pollinators in urban gardens contribute to local food production, and exposure to urban nature has been linked to improved mental health outcomes.

The challenge for urban planners is to balance the demands of a growing population with the need to preserve and enhance urban biodiversity. Innovative approaches including vertical forests, rooftop meadows, and wildlife-friendly building designs offer promising solutions, but their widespread adoption requires changes in planning regulations, building codes, and public attitudes towards urban nature.', 350);

-- Test 3 (Hard) - Reading Passages
INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count) VALUES
('c3000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 1, 'Quantum Computing: Beyond Classical Limits',
'Quantum computing represents a fundamental departure from the classical computing paradigm that has dominated information technology for over half a century. While classical computers process information using bits that exist in one of two states - zero or one - quantum computers harness the principles of quantum mechanics to process information using quantum bits, or qubits, which can exist in multiple states simultaneously through a phenomenon known as superposition.

The theoretical foundations of quantum computing were laid in the early 1980s by physicist Richard Feynman, who recognized that quantum systems could not be efficiently simulated by classical computers and proposed a new type of computer that operated according to quantum mechanical principles. In 1994, mathematician Peter Shor developed an algorithm demonstrating that a quantum computer could factor large numbers exponentially faster than any known classical algorithm, with profound implications for cryptography and data security.

The power of quantum computing derives from two key quantum mechanical properties: superposition and entanglement. Superposition allows each qubit to represent both zero and one simultaneously, meaning that a system of n qubits can represent 2 to the power of n states at once. Entanglement creates correlations between qubits that have no classical equivalent, enabling quantum computers to process vast amounts of information in parallel.

Building practical quantum computers presents formidable engineering challenges. Qubits are extraordinarily sensitive to environmental disturbances, a problem known as decoherence, which causes quantum information to degrade rapidly. Current quantum computers must be cooled to temperatures near absolute zero and shielded from electromagnetic interference to maintain qubit coherence. Error correction in quantum systems is considerably more complex than in classical systems, requiring multiple physical qubits to create a single reliable logical qubit.

Despite these challenges, significant progress has been made. In 2019, Google claimed to have achieved ''quantum supremacy'' with its 53-qubit Sycamore processor, performing a calculation in 200 seconds that would have taken the world''s fastest supercomputer approximately 10,000 years. IBM, Microsoft, and numerous startups are pursuing different approaches to building quantum computers, including superconducting circuits, trapped ions, and topological qubits.

The potential applications of quantum computing span numerous fields. In pharmaceutical research, quantum computers could simulate molecular interactions with unprecedented accuracy, accelerating drug discovery. In materials science, they could model new materials with specific properties. Financial modeling, optimization problems in logistics, and advances in artificial intelligence are all areas where quantum computing is expected to make transformative contributions.

However, experts caution against overhyping quantum computing''s near-term potential. Current quantum computers are noisy and error-prone, and many of the most impactful applications will require machines with thousands or millions of stable qubits - far beyond current capabilities. The development of fault-tolerant quantum computers remains one of the grand challenges of twenty-first-century engineering.', 420),

('c3000001-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 2, 'The Anthropology of Food',
'Food is far more than mere sustenance. It is a lens through which we can examine virtually every aspect of human culture, society, and identity. The anthropological study of food reveals how what we eat, how we prepare it, and with whom we share it are deeply embedded in systems of meaning that reflect and reinforce social structures, power relations, and cultural values.

The concept of ''foodways'' encompasses the full spectrum of activities and beliefs surrounding food in a given culture. This includes not only the practical aspects of food production, preparation, and consumption, but also the symbolic meanings attached to particular foods, the social rituals that govern eating, and the economic systems that determine food access and distribution.

Claude Levi-Strauss, in his influential work on structuralism, proposed that cooking is a universal human activity that marks the transition from nature to culture. His ''culinary triangle'' model suggested that all cultures classify food along axes of raw versus cooked and fresh versus rotten, with these classifications reflecting deeper cognitive structures. While subsequent scholars have critiqued the rigidity of this model, it remains a foundational framework for understanding the cultural significance of food preparation.

The globalization of food systems has created new tensions between local food traditions and global culinary influences. On one hand, the worldwide availability of foods from diverse cultures has enriched diets and expanded culinary horizons. On the other hand, the homogenization of food production and distribution threatens traditional foodways and the biodiversity of local food systems. The concept of ''food sovereignty'' has emerged as a counterpoint to globalization, asserting the right of communities to define their own food systems based on local needs, cultures, and ecologies.

Food has also become a significant arena for the expression and negotiation of identity. Dietary choices increasingly serve as markers of social, ethical, and political identity. Veganism, organic consumption, and locavorism are not merely dietary preferences but statements about one''s relationship to the environment, animal welfare, and the global food system. Religious dietary laws, from kosher and halal to Hindu vegetarianism, continue to play a central role in defining community boundaries and expressing spiritual values.

The anthropology of food also intersects with issues of power and inequality. Access to nutritious food is unevenly distributed both within and between societies, and food insecurity remains a pressing global challenge. The concept of ''food deserts'' - urban areas lacking access to affordable, healthy food - highlights how socioeconomic factors shape dietary patterns and health outcomes. Meanwhile, the politics of food aid, agricultural subsidies, and trade agreements illustrate how food systems are embedded in broader structures of economic and political power.', 400),

('c3000001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 3, 'Epigenetics: Beyond the Genetic Code',
'For decades, the central dogma of molecular biology held that the flow of genetic information was essentially unidirectional: DNA is transcribed into RNA, which is then translated into proteins. Genes were considered the fundamental units of heredity, and an organism''s characteristics were believed to be largely determined by the specific sequences of nucleotides in its DNA. The emerging field of epigenetics has fundamentally challenged this view, revealing a layer of biological regulation that operates above the level of the genetic code itself.

Epigenetics refers to heritable changes in gene expression that occur without alterations to the underlying DNA sequence. These changes are mediated by several mechanisms, the most well-studied of which are DNA methylation and histone modification. In DNA methylation, methyl groups are added to cytosine bases in the DNA, typically suppressing gene expression in the affected region. Histone modification involves chemical changes to the proteins around which DNA is wound, affecting how tightly the DNA is packaged and therefore how accessible it is for transcription.

The implications of epigenetic regulation are profound. It explains how cells with identical DNA can differentiate into the vastly different cell types that make up a complex organism - a neuron, a liver cell, and a skin cell all contain the same genetic information, but epigenetic modifications determine which genes are active in each cell type. This process of cellular differentiation is essential for normal development and is guided by a complex interplay of epigenetic signals.

Perhaps the most provocative finding in epigenetics is the evidence that some epigenetic changes can be transmitted across generations. Studies in both animals and humans have suggested that environmental exposures - including diet, stress, and toxins - can produce epigenetic modifications that affect not only the exposed individual but also their offspring and even subsequent generations. The Dutch Hunger Winter study, which examined the descendants of women who experienced famine during World War II, found increased rates of obesity and cardiovascular disease in the children and grandchildren of those who were malnourished during pregnancy.

Epigenetics also has significant implications for medicine. Aberrant epigenetic modifications have been implicated in a wide range of diseases, including cancer, autoimmune disorders, and neurological conditions. Unlike genetic mutations, epigenetic changes are potentially reversible, opening up new therapeutic possibilities. Drugs that target epigenetic mechanisms, such as DNA methyltransferase inhibitors and histone deacetylase inhibitors, are already in clinical use for certain cancers and are being investigated for other conditions.

The field of epigenetics continues to evolve rapidly, with new discoveries regularly challenging established assumptions about heredity, development, and disease. As our understanding deepens, it is becoming clear that the relationship between genotype and phenotype is far more complex and dynamic than was previously appreciated, with epigenetic mechanisms playing a crucial mediating role.', 430);

-- ============================================
-- READING QUESTIONS - Test 1 (40 questions)
-- Covers all 7 question types: tfng, gap_fill, mcq_single, matching_info, summary_completion, matching_headings, short_answer
-- ============================================

-- Test 1 - Passage 1: Aphantasia (Questions 1-13) - tfng + gap_fill
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('d1010001-0000-0000-0000-000000000001', 'reading', 'c1000001-0000-0000-0000-000000000001', 1, 'tfng', 'Aphantasia is a condition where people find it difficult to visualise mental images.', null, 'FALSE', 'The passage says people are "unable" to visualise, not that they find it "difficult".', 1),
('d1010001-0000-0000-0000-000000000002', 'reading', 'c1000001-0000-0000-0000-000000000001', 2, 'tfng', 'Niel Kenmuir could not count sheep in his mind as a child.', null, 'TRUE', 'Niel says "I couldn''t see any sheep jumping over fences, there was nothing to count."', 1),
('d1010001-0000-0000-0000-000000000003', 'reading', 'c1000001-0000-0000-0000-000000000001', 3, 'tfng', 'Niel struggles to recognise faces.', null, 'TRUE', 'The passage states "like others with aphantasia, he struggles to recognise faces."', 1),
('d1010001-0000-0000-0000-000000000004', 'reading', 'c1000001-0000-0000-0000-000000000001', 4, 'tfng', 'Niel sees aphantasia as a disability.', null, 'FALSE', 'He "does not see aphantasia as a disability, but simply a different way of experiencing life."', 1),
('d1010001-0000-0000-0000-000000000005', 'reading', 'c1000001-0000-0000-0000-000000000001', 5, 'tfng', 'One study participant felt isolated after discovering others could visualise.', null, 'TRUE', 'A participant "started to feel isolated and alone after discovering that other people could see images."', 1),
('d1010001-0000-0000-0000-000000000006', 'reading', 'c1000001-0000-0000-0000-000000000001', 6, 'tfng', 'Lauren Beard works in a studio in London.', null, 'FALSE', 'She works "in her box-room studio in Manchester."', 1),
('d1010001-0000-0000-0000-000000000007', 'reading', 'c1000001-0000-0000-0000-000000000001', 7, 'tfng', 'All people with aphantasia feel distressed about their condition.', null, 'NOT GIVEN', 'Some feel distressed, but Niel is relaxed about it. The passage does not say all are distressed.', 1),
('d1010001-0000-0000-0000-000000000008', 'reading', 'c1000001-0000-0000-0000-000000000001', 8, 'gap_fill', 'Not many people have mental imagery as vibrant as Lauren or as _____ as Niel.', null, 'blank', 'The passage states "as vibrant as Lauren or as blank as Niel."', 1),
('d1010001-0000-0000-0000-000000000009', 'reading', 'c1000001-0000-0000-0000-000000000001', 9, 'gap_fill', 'Prof Zeman''s team coined the term aphantasia in the journal _____.', null, 'Cortex', 'Published "in a study in the journal Cortex."', 1),
('d1010001-0000-0000-0000-000000000010', 'reading', 'c1000001-0000-0000-0000-000000000001', 10, 'gap_fill', 'One person''s vivid scene could be another''s _____ picture.', null, 'grainy', 'The passage says "one person''s vivid scene could be another''s grainy picture."', 1),
('d1010001-0000-0000-0000-000000000011', 'reading', 'c1000001-0000-0000-0000-000000000001', 11, 'gap_fill', 'Prof Zeman is _____ that aphantasia is not a disorder.', null, 'adamant', 'He is "adamant that aphantasia is not a disorder."', 1),
('d1010001-0000-0000-0000-000000000012', 'reading', 'c1000001-0000-0000-0000-000000000001', 12, 'gap_fill', 'Many of us spend our lives with _____ hovering somewhere in the mind''s eye.', null, 'imagery', 'The passage says "with imagery hovering somewhere in the mind''s eye."', 1),
('d1010001-0000-0000-0000-000000000013', 'reading', 'c1000001-0000-0000-0000-000000000001', 13, 'gap_fill', 'Lauren Beard works on the _____ Hairdresser book series.', null, 'Fairytale', 'She works "on the Fairytale Hairdresser series."', 1);

-- Test 1 - Passage 2: Life Lessons (Questions 14-27) - matching_info + summary_completion + mcq_single
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('d1020001-0000-0000-0000-000000000001', 'reading', 'c1000001-0000-0000-0000-000000000002', 14, 'matching_info', 'A description of how a drug baron escaped from prison.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'C', 'Paragraph C describes Guzman slipping out through a tunnel.', 1),
('d1020001-0000-0000-0000-000000000002', 'reading', 'c1000001-0000-0000-0000-000000000002', 15, 'matching_info', 'Research examining five common traits of rule-breakers.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'G', 'Paragraph G discusses The Misfit Economy and the five traits.', 1),
('d1020001-0000-0000-0000-000000000003', 'reading', 'c1000001-0000-0000-0000-000000000002', 16, 'matching_info', 'A comparison between how criminals and traditional businesses think.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'B', 'Paragraph B contrasts criminals'' limitless thinking with traditional business rules.', 1),
('d1020001-0000-0000-0000-000000000004', 'reading', 'c1000001-0000-0000-0000-000000000002', 17, 'matching_info', 'The__(suggestion that criminals could teach corporations.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'A', 'Paragraph A introduces the idea of learning from criminals.', 1),
('d1020001-0000-0000-0000-000000000005', 'reading', 'c1000001-0000-0000-0000-000000000002', 18, 'matching_info', 'How criminal groups survive despite law enforcement efforts.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'D', 'Paragraph D describes cartels enduring despite enforcement.', 1),
('d1020001-0000-0000-0000-000000000006', 'reading', 'c1000001-0000-0000-0000-000000000002', 19, 'matching_info', 'An example of a legitimate business that failed to adapt.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'E', 'Paragraph E cites Blockbuster''s failure.', 1),
('d1020001-0000-0000-0000-000000000007', 'reading', 'c1000001-0000-0000-0000-000000000002', 20, 'matching_info', 'Similarities between start-up founders and criminals.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'F', 'Paragraph F compares start-ups and criminals as rule-breakers.', 1),
('d1020001-0000-0000-0000-000000000008', 'reading', 'c1000001-0000-0000-0000-000000000002', 21, 'matching_info', 'An entrepreneur who succeeded by working outside traditional structures.', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'H', 'Paragraph H describes Walid Abdul-Wahab''s camel milk venture.', 1),
('d1020001-0000-0000-0000-000000000009', 'reading', 'c1000001-0000-0000-0000-000000000002', 22, 'summary_completion', 'Guzman''s escape required creative thinking, long-term planning and _____.', null, 'perseverance', 'The passage states "creative thinking, long-term planning and perseverance."', 1),
('d1020001-0000-0000-0000-000000000010', 'reading', 'c1000001-0000-0000-0000-000000000002', 23, 'summary_completion', 'Criminal organisations often have _____ encoded into their daily behaviour.', null, 'improvisation', 'Liddell argues criminals have "improvisation encoded into their daily behaviour."', 1),
('d1020001-0000-0000-0000-000000000011', 'reading', 'c1000001-0000-0000-0000-000000000002', 24, 'summary_completion', 'Abdul-Wahab found a _____ of Amish camel milk farmers.', null, 'network', 'He "found a network of Amish camel milk farmers."', 1),
('d1020001-0000-0000-0000-000000000012', 'reading', 'c1000001-0000-0000-0000-000000000002', 25, 'summary_completion', 'The Sinaloa cartel even used a _____ to circumvent a high-tech fence.', null, 'catapult', 'They "even used a catapult to circumvent a high-tech fence."', 1),
('d1020001-0000-0000-0000-000000000013', 'reading', 'c1000001-0000-0000-0000-000000000002', 26, 'mcq_single', 'What is the main purpose of the article?', '["A. To show different methods of illegal activity", "B. To give an overview of criminals and gangs", "C. To draw comparisons between legal and illegal business with examples", "D. To justify criminal activities through creative thinking"]', 'C', 'The article draws comparisons between criminal and legitimate business practices.', 1),
('d1020001-0000-0000-0000-000000000014', 'reading', 'c1000001-0000-0000-0000-000000000002', 27, 'mcq_single', 'What happened to Blockbuster according to the passage?', '["A. It was bought by a criminal organisation", "B. It adapted and became a streaming service", "C. It failed because it did not keep up with market changes", "D. It was shut down by law enforcement"]', 'C', 'Blockbuster "didn''t keep up with the market and lost business."', 1);

-- Test 1 - Passage 3: Sea Monsters (Questions 28-40) - matching_headings + short_answer + mcq_single
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
('d1030001-0000-0000-0000-000000000001', 'reading', 'c1000001-0000-0000-0000-000000000003', 28, 'matching_headings', 'Paragraphs 1-3 (introduction, Stephen King quote, Classen quote).', '["i. The__(Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'iii', 'These paragraphs discuss how monsters exist in our psychology and mindscapes.', 1),
('d1030001-0000-0000-0000-000000000002', 'reading', 'c1000001-0000-0000-0000-000000000003', 29, 'matching_headings', 'Paragraphs 4-6 (Norse legend, Tennyson poem, psyche).', '["i. The Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'iv', 'These paragraphs describe the Norse Kraken legend and Tennyson''s poem.', 1),
('d1030001-0000-0000-0000-000000000003', 'reading', 'c1000001-0000-0000-0000-000000000003', 30, 'matching_headings', 'Paragraphs 7-8 (Widder description, physical features).', '["i. The Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'v', 'These paragraphs describe the real giant squid''s physical characteristics.', 1),
('d1030001-0000-0000-0000-000000000004', 'reading', 'c1000001-0000-0000-0000-000000000003', 31, 'matching_headings', 'Paragraph 9 (Jules Verne and Victor Hugo novels).', '["i. The Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'x', 'This paragraph discusses 19th-century fiction portraying the squid.', 1),
('d1030001-0000-0000-0000-000000000005', 'reading', 'c1000001-0000-0000-0000-000000000003', 32, 'matching_headings', 'Paragraphs 10-11 (2012 filming, true character revealed).', '["i. The Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'ii', 'These paragraphs describe the 2012 filming revealing the squid as gentle.', 1),
('d1030001-0000-0000-0000-000000000006', 'reading', 'c1000001-0000-0000-0000-000000000003', 33, 'matching_headings', 'Paragraph 12 (Archie at the Natural History Museum).', '["i. The Kraken in literature", "ii. A gentle creature revealed", "iii. Monsters in our minds", "iv. The legend of the Kraken", "v. The physical reality of the giant squid", "vi. Filming the giant squid for the first time", "vii. The preserved specimen in London", "viii. Why we still need sea monsters", "ix. From myth to scientific study", "x. The squid in Victorian fiction"]', 'vii', 'This paragraph describes Archie preserved in the Natural History Museum.', 1),
('d1030001-0000-0000-0000-000000000007', 'reading', 'c1000001-0000-0000-0000-000000000003', 34, 'short_answer', 'According to Victorian novels, what would the squid do to humans if given the chance?', null, 'readily attack', 'The passage says "it was a given that the squid was vicious and would readily attack humans."', 1),
('d1030001-0000-0000-0000-000000000008', 'reading', 'c1000001-0000-0000-0000-000000000003', 35, 'short_answer', 'How did the real squid appear when filmed in 2012?', null, 'balletic and mesmeric', 'The passage describes it as "balletic and mesmeric."', 1),
('d1030001-0000-0000-0000-000000000009', 'reading', 'c1000001-0000-0000-0000-000000000003', 36, 'short_answer', 'What is the preserved giant squid in London called?', null, 'Archie', 'The specimen "is called Archie, an affectionate short version of its Latin name."', 1),
('d1030001-0000-0000-0000-000000000010', 'reading', 'c1000001-0000-0000-0000-000000000003', 37, 'short_answer', 'Where was the specimen caught?', null, 'Falkland Islands', 'It was "caught in a fishing net off the Falkland Islands."', 1),
('d1030001-0000-0000-0000-000000000011', 'reading', 'c1000001-0000-0000-0000-000000000003', 38, 'mcq_single', 'Who wrote the novel Twenty Thousand Leagues Under the Sea?', '["A. Stephen King", "B. Victor Hugo", "C. Jules Verne", "D. Alfred Lord Tennyson"]', 'C', 'The passage attributes the novel to Jules Verne.', 1),
('d1030001-0000-0000-0000-000000000012', 'reading', 'c1000001-0000-0000-0000-000000000003', 39, 'mcq_single', 'Why had previous attempts to film the giant squid failed?', '["A. The squid was too deep", "B. The water was too dark", "C. Bright lights and noisy thrusters scared them away", "D. The squid was too fast"]', 'C', 'Previous attempts failed because "bright lights and noisy thrusters had frightened them away."', 1),
('d1030001-0000-0000-0000-000000000013', 'reading', 'c1000001-0000-0000-0000-000000000003', 40, 'mcq_single', 'According to Classen, will scientific progress eliminate our fear of sea monsters?', '["A. Yes, eventually", "B. Only for educated people", "C. Probably not", "D. It already has"]', 'C', 'Classen says "There''s no indication that enlightenment has banished the monsters."', 1);

-- ============================================
-- WRITING TASKS (2 per test)
-- ============================================

-- Test 1 (Easy)
INSERT INTO public.writing_tasks (id, test_id, task_number, task_type, prompt, image_url, min_words, sample_answer) VALUES
('e1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 1, 'report',
'The bar chart below shows the number of students enrolled in three different subjects at a university between 2018 and 2022.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Subject enrollment data:
- Computer Science: 2018 (450), 2019 (520), 2020 (610), 2021 (680), 2022 (750)
- Business Studies: 2018 (600), 2019 (580), 2020 (550), 2021 (530), 2022 (500)
- Engineering: 2018 (400), 2019 (420), 2020 (440), 2021 (460), 2022 (480)',
null, 150,
'The bar chart illustrates changes in student enrollment across three university subjects over a five-year period from 2018 to 2022.

Overall, Computer Science experienced the most significant growth, while Business Studies showed a steady decline. Engineering demonstrated modest but consistent increases throughout the period.

Computer Science enrollment rose steadily from 450 students in 2018 to 750 in 2022, representing an increase of approximately 67%. This made it the fastest-growing subject. In contrast, Business Studies, which had the highest initial enrollment of 600 students in 2018, declined consistently each year, falling to 500 by 2022.

Engineering showed gradual growth, rising from 400 to 480 students over the period. Notably, by 2022, Computer Science had overtaken Business Studies to become the most popular subject, while Engineering remained the least enrolled despite its upward trend.'),

('e1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 2, 'essay',
'Some people believe that universities should focus on providing academic skills, while others think they should prepare students for employment.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
null, 250,
'The debate over whether universities should prioritize academic knowledge or employability skills has intensified in recent years. Both perspectives have merit, and this essay will examine each before presenting my own view.

Those who advocate for a focus on academic skills argue that universities have traditionally been centers of knowledge and intellectual inquiry. They believe that deep understanding of a subject develops critical thinking, analytical abilities, and research skills that are transferable to any career. Furthermore, academic research drives innovation and advances human understanding in ways that purely vocational training cannot.

On the other hand, proponents of employment-focused education point to the rising cost of university degrees and argue that graduates deserve a clear return on their investment. They note that many employers complain about graduates lacking practical skills such as teamwork, communication, and problem-solving in real-world contexts. Work placements, internships, and industry partnerships can bridge this gap effectively.

In my opinion, the most effective approach combines both perspectives. Universities should maintain rigorous academic standards while integrating practical elements that prepare students for the workplace. Programs that include internships, project-based learning, and industry collaboration can develop both intellectual depth and professional competence. The best graduates are those who can think critically and apply their knowledge in practical situations.');

-- Test 2 (Medium)
INSERT INTO public.writing_tasks (id, test_id, task_number, task_type, prompt, image_url, min_words, sample_answer) VALUES
('e2000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 1, 'report',
'The pie charts below show the proportion of energy generated from different sources in Country X in 2000 and 2020.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Energy sources in 2000: Coal (40%), Natural Gas (25%), Oil (20%), Nuclear (10%), Renewables (5%)
Energy sources in 2020: Coal (20%), Natural Gas (30%), Oil (15%), Nuclear (12%), Renewables (23%)',
null, 150, null),

('e2000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 2, 'essay',
'In many countries, the proportion of older people is steadily increasing. Some think this is a positive development, while others consider it a problem for society.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
null, 250, null);

-- Test 3 (Hard)
INSERT INTO public.writing_tasks (id, test_id, task_number, task_type, prompt, image_url, min_words, sample_answer) VALUES
('e3000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 1, 'report',
'The table below shows the percentage of household income spent on different categories in five countries in 2022.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

| Category    | Japan | USA  | Brazil | Nigeria | Sweden |
|-------------|-------|------|--------|---------|--------|
| Housing     | 25%   | 33%  | 30%    | 22%     | 28%    |
| Food        | 14%   | 10%  | 25%    | 56%     | 12%    |
| Transport   | 12%   | 17%  | 15%    | 8%      | 10%    |
| Healthcare  | 8%    | 18%  | 10%    | 5%      | 3%     |
| Education   | 10%   | 7%   | 8%     | 4%      | 2%     |
| Other       | 31%   | 15%  | 12%    | 5%      | 45%    |',
null, 150, null),

('e3000001-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 2, 'essay',
'Some experts believe that the best way to improve road safety is to increase the minimum legal age for driving. Others believe there are more effective measures.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
null, 250, null);
