-- ============================================
-- Combined Listening single-section seed
-- Tests: 877, 876, 874, 873, 872, 871, 870, 869, 868, 867, 993, 994, 357, 995, 358, 385, 225, 289
-- Generated: 2026-02-27T10:14:19.043Z
-- ============================================

-- ============================================
-- Auto-generated seed for: Places to visit with children
-- Source API ID: 877
-- Generated: 2026-02-27T10:14:02.051Z
-- ============================================

-- ============================================
-- Places to visit with children (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'faeb69a4-3b71-4a3b-9497-d239c89ffc2d',
    'Places to visit with children',
    'IELTS Listening - Places to visit with children',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    'faeb69a4-3b71-4a3b-9497-d239c89ffc2d',
    1,
    '',
    279
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '10e09856-9362-4124-9fae-fb420d6b5055',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    1,
    'gap_fill',
    '----',
    NULL,
    '65',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '70130f71-03bd-4deb-b7af-778afe841546',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    2,
    'gap_fill',
    '----',
    NULL,
    '40',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8ae749a8-54c5-4086-a249-d67cfe4d2682',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    3,
    'gap_fill',
    '----',
    NULL,
    'photo',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd68f2f53-a93a-4244-948e-4c42f34bc97d',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    4,
    'gap_fill',
    '----',
    NULL,
    'Rosie',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c93c85f7-4480-4a2d-8cbd-49da86425e15',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    5,
    'gap_fill',
    '----',
    NULL,
    'Saturday',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '92e97c61-1088-49ee-90ce-f046ac3ea07f',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    6,
    'gap_fill',
    '----',
    NULL,
    'discount',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2b24bcc7-6e93-4df3-8170-7e126da08a6a',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    7,
    'gap_fill',
    '----',
    NULL,
    'museum',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6f88546b-5fe2-412e-b7d2-a9b4230316c7',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    8,
    'gap_fill',
    '----',
    NULL,
    'box',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a2810b01-e5ff-48dc-bba7-573f0709df20',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    9,
    'gap_fill',
    '----',
    NULL,
    'ocean',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a57dad78-1401-4691-81da-e79eeb053ef5',
    'listening',
    'e25c571b-4199-4641-a9c5-ab6be9568bcf',
    10,
    'gap_fill',
    '----',
    NULL,
    'camp',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write<strong> ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Places to visit with children</h3><p><strong>Alma Park</strong></p><p>• Go to the zoo.</p><p>• A family ticket is $ ______ .</p><p>• The fastest bus takes about ______ minutes.</p><p>• You can hold some animals and have a ______ for a small fee.</p><p><strong>The Entertainment Room</strong></p><p>• John ______ is performing.</p><p>• Performance run from Tuesday to ______ .</p><p>• There is a ______ on tickets for Monday night’s preview.</p><p><strong>The City</strong></p><p>• Go to the city center ______ to see a special exhibition.</p><p>– Do origami – we’ll need to take a small ______ .</p><p><strong>Bunyabbie Island</strong></p><p>• Explore with a four-wheel drive.</p><p>• Go snorkelling at Salty Lake – it’s on the ______ side of the Island.</p><p>• You’re not allowed to ______ on the island.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Job at Bellfield Garden Centre
-- Source API ID: 876
-- Generated: 2026-02-27T10:14:03.065Z
-- ============================================

-- ============================================
-- Job at Bellfield Garden Centre (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '05206948-dc71-455d-82d9-33fe51a68824',
    'Job at Bellfield Garden Centre',
    'IELTS Listening - Job at Bellfield Garden Centre',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    '05206948-dc71-455d-82d9-33fe51a68824',
    1,
    '',
    443
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '537512e5-e528-4dca-807e-00023d4bd0bf',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    1,
    'gap_fill',
    '----',
    NULL,
    'month',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2d68bf2c-a2d9-44b0-893f-5e0218f68b7c',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    2,
    'gap_fill',
    '----',
    NULL,
    'selling',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d926456-00e9-4713-a2d2-3f3a1b7acb53',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    3,
    'gap_fill',
    '----',
    NULL,
    'Sundays',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4ff2cad1-dd81-4a39-bebb-c63a8dddbf72',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    4,
    'gap_fill',
    '----',
    NULL,
    '35',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cb120338-db26-4112-97bd-968b961296c3',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    5,
    'gap_fill',
    '----',
    NULL,
    'training',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2336deaa-668a-4028-8a37-3a2653a30f8e',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    6,
    'gap_fill',
    '----',
    NULL,
    'uniform',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8cb7bc06-3f69-42ef-ad39-8993d217295f',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    7,
    'gap_fill',
    '----',
    NULL,
    'activities',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c14c86a3-ebcd-4ac8-9494-9220dbf4ec98',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    8,
    'gap_fill',
    '----',
    NULL,
    'childcare',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '21931232-4b0b-4384-8712-ff40ccd4b73c',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    9,
    'gap_fill',
    '----',
    NULL,
    '8.70',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0034a344-7d2e-4d83-adb1-1cee61afa452',
    'listening',
    '0d25ce01-739a-457b-a681-1a42e5db3d4f',
    10,
    'gap_fill',
    '----',
    NULL,
    'Ballera',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Job at Bellfield Garden Centre</h3><p><strong>Job:</strong></p><p><strong>Example</strong></p><p>Job title: garden centre assistant</p><p>working mainly as a cashier</p><p>will also</p><p>• help with plants, and in the shop</p><p>• help customers, starting after a  ______ </p><p><strong>Requirements:</strong></p><p>• an interest in ______ </p><p>• preferably knowing something about plants</p><p><strong>Hours:</strong></p><p>• working hours are flexible</p><p>• 5 days a week, usually including ______  </p><p>•  ______ hours a week</p><p><strong>What''s provided:</strong></p><p>• ______  (about everything they sell, and customer service)</p><p>• ______  (but not laundry)</p><p>• staff discount</p><p>• team ______ </p><p>• financial help including vouchers for ______ </p><p><strong>Starting pay:</strong>£<strong> </strong>  ______ per hour</p><p><strong>Contact</strong>: Janice ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: International Student Travel Agency - Enquiry Form
-- Source API ID: 874
-- Generated: 2026-02-27T10:14:04.095Z
-- ============================================

-- ============================================
-- International Student Travel Agency - Enquiry Form (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'f06efcc1-ac97-4957-a27c-fe35e938dcb0',
    'International Student Travel Agency - Enquiry Form',
    'IELTS Listening - International Student Travel Agency - Enquiry Form',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    'f06efcc1-ac97-4957-a27c-fe35e938dcb0',
    1,
    '',
    372
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0ec962c4-62e3-4a86-9cd2-2cf987ed5f98',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    1,
    'gap_fill',
    '----',
    NULL,
    '30th March',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2adab682-a57e-4601-9f7e-fa2409f536b8',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    2,
    'gap_fill',
    '----',
    NULL,
    '0903775115',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a78ff254-a0a8-4457-8e68-09dafa6b89b9',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    3,
    'gap_fill',
    '----',
    NULL,
    'Northern',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f7dcbccf-a329-4c27-a0be-ba428797efa9',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    4,
    'gap_fill',
    '----',
    NULL,
    'train',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cbb3a227-814d-4fed-b6a3-a408bc10294a',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    5,
    'gap_fill',
    '----',
    NULL,
    'hotel',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '71759cfd-cf1f-48fa-b225-c664461916df',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    6,
    'gap_fill',
    '----',
    NULL,
    'farm',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3119bdb2-c3b8-4fe5-a280-f9f28116a8c3',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    7,
    'gap_fill',
    '----',
    NULL,
    'pass',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ae953256-fb15-4838-a644-6be2621692bb',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    8,
    'gap_fill',
    '----',
    NULL,
    'booklet',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ae465045-fa81-490d-8871-abc9fb5336bf',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    9,
    'gap_fill',
    '----',
    NULL,
    'insurance',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '46147638-d1e0-4594-89ee-3c50d73382df',
    'listening',
    '33ab719b-d650-4acb-811c-b40f2cea9773',
    10,
    'gap_fill',
    '----',
    NULL,
    'internet cafe',
    NULL,
    1,
    '{"instruction":"<p>Complete the form. Write <strong>NO MORE THAN TWO WORDS AND/OR NUMBERS</strong> for each question.</p>","context":"<h3>International Student Travel Agency - Enquiry Form</h3><p>Name: Sarah Brown</p><p>Date of birth: ______ </p><p>Address: 21 Waverley Road, Radstone, RD4 6WV</p><p>Contact tel. no: ______ </p><p><br></p><p><strong>Notes:</strong></p><p>- wants to travel in ______  Europe</p><p>- hopes to travel by ______ </p><p>- interested in working in a ______ </p><p>- recommended to consider an alternative e.g. ______  work</p><p>- advised to buy a European ______  for travelling</p><p>- given a ______  with accommodation details</p><p>- agreed to take out ______  from the Agency</p><p>- told to use an ______  for contacting people</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Rooms to hire for parties
-- Source API ID: 873
-- Generated: 2026-02-27T10:14:05.090Z
-- ============================================

-- ============================================
-- Rooms to hire for parties (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '6947822c-62fa-42f6-b569-3e5232a044b8',
    'Rooms to hire for parties',
    'IELTS Listening - Rooms to hire for parties',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    '6947822c-62fa-42f6-b569-3e5232a044b8',
    1,
    '',
    405
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2a49877d-22a0-4e1f-a1f7-b92d696fc493',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    1,
    'gap_fill',
    '----',
    NULL,
    '5th',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4a16185e-098f-4745-afa8-ddedded45981',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    2,
    'gap_fill',
    '----',
    NULL,
    'view',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b8eee201-4540-41c9-bbf6-5d7607fae182',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    3,
    'gap_fill',
    '----',
    NULL,
    '35',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ef7813be-6c9d-420b-aad9-0aacedaf0777',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    4,
    'gap_fill',
    '----',
    NULL,
    'Saturday',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'feda8303-5e74-4a8d-9f70-6318fad9f940',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    5,
    'gap_fill',
    '----',
    NULL,
    'Limerick',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0345079c-3042-4b63-a271-aca5f059b3e6',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    6,
    'gap_fill',
    '----',
    NULL,
    'business',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '89ad53aa-6bca-4037-a35e-0c920544fe28',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    7,
    'gap_fill',
    '----',
    NULL,
    'garden',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6628fff1-3978-49b1-bd50-12c4953cdac4',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    8,
    'gap_fill',
    '----',
    NULL,
    'week',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2631d2ca-ed33-4dcb-b641-86c3e529a4b9',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    9,
    'gap_fill',
    '----',
    NULL,
    '65',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'aed75a8f-d622-49c8-a986-429e64685375',
    'listening',
    '2879d13a-d16a-40f5-9937-d6bbfbb15503',
    10,
    'gap_fill',
    '----',
    NULL,
    '044298611',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<h3>Rooms to hire for parties</h3><p><strong>The Exchange Hotel</strong></p><p>• number of seated guests possible: 45</p><p>• room on the ______  floor</p><p>• large, bright room with a good ______ </p><p>• cost: £32 with buffet per person (minimum number of people: ______ )</p><p>• available any ______  in April</p><p><br></p><p><strong>The ______ &nbsp;Hotel</strong></p><p>• large room (seats 75)</p><p>• in the ______  area of the city</p><p>• room on ground floor with a small ______  for guests to use</p><p>• cost: £36 with buffet per person</p><p>• available: 13th and 20th April</p><p><br></p><p><strong>Booking information</strong></p><p>• Bookings held for a ______ </p><p>• Final payment of ______  % required 10 days before the party</p><p>• Need to confirm guests and menu 5 days in advance</p><p>• To book, phone ______  on Monday</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Moving Company Service Report
-- Source API ID: 872
-- Generated: 2026-02-27T10:14:06.054Z
-- ============================================

-- ============================================
-- Moving Company Service Report (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'ad74e506-dfad-4c83-8f1a-b51ba82ba9e9',
    'Moving Company Service Report',
    'IELTS Listening - Moving Company Service Report',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'aaac85ba-959d-416d-9271-b845735d6d14',
    'ad74e506-dfad-4c83-8f1a-b51ba82ba9e9',
    1,
    '',
    405
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fc57d6d6-9c4b-4138-94e8-6eb0c0fa0c3f',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    1,
    'gap_fill',
    '-----',
    NULL,
    '94635550',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c7f0b54b-774e-4de6-94dc-89da84af5f0c',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    2,
    'gap_fill',
    '-----',
    NULL,
    'Clark House',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9c68d7e7-6e6c-4ef2-9b85-e269ed61eb5b',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    3,
    'gap_fill',
    '-----',
    NULL,
    'University Drive',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cc9912fc-3489-42d9-b45d-62c245f239d7',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    4,
    'gap_fill',
    '-----',
    NULL,
    'Monday',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4fd623ee-0fc5-44bc-b628-1bf55f9667a4',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    5,
    'gap_fill',
    '-----',
    NULL,
    'Thursday',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cb75a486-0894-476b-bc81-c042d315b5d7',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    6,
    'gap_fill',
    '-----',
    NULL,
    'a month',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write<strong> NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f434ef8e-57b8-457c-b235-b6baf519e825',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    7,
    'gap_fill',
    '----',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Write the correct letter.</p>","context":"<p>Where does the speaker decide to put items?</p><p><br></p><h4>Options:</h4><p><strong>A</strong>. in emergency pack</p><p><strong>B</strong>. in personal package</p><p><strong>C</strong>. in storage with the furniture</p><p><br></p><p>• cutlery and dishes:   ______ </p><p>• kettle:   ______ </p><p>• alarm clock:   ______ </p><p>• CD player:   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e4723ff5-cc36-4c30-a445-a28301eb7118',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    8,
    'gap_fill',
    '----',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Write the correct letter.</p>","context":"<p>Where does the speaker decide to put items?</p><p><br></p><h4>Options:</h4><p><strong>A</strong>. in emergency pack</p><p><strong>B</strong>. in personal package</p><p><strong>C</strong>. in storage with the furniture</p><p><br></p><p>• cutlery and dishes:   ______ </p><p>• kettle:   ______ </p><p>• alarm clock:   ______ </p><p>• CD player:   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'db421de4-5f8b-41e8-a1fc-8a71922fd4e9',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    9,
    'gap_fill',
    '----',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Write the correct letter.</p>","context":"<p>Where does the speaker decide to put items?</p><p><br></p><h4>Options:</h4><p><strong>A</strong>. in emergency pack</p><p><strong>B</strong>. in personal package</p><p><strong>C</strong>. in storage with the furniture</p><p><br></p><p>• cutlery and dishes:   ______ </p><p>• kettle:   ______ </p><p>• alarm clock:   ______ </p><p>• CD player:   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f6b43cab-dc7a-4852-94c0-92341680ffc1',
    'listening',
    'aaac85ba-959d-416d-9271-b845735d6d14',
    10,
    'gap_fill',
    '----',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Write the correct letter.</p>","context":"<p>Where does the speaker decide to put items?</p><p><br></p><h4>Options:</h4><p><strong>A</strong>. in emergency pack</p><p><strong>B</strong>. in personal package</p><p><strong>C</strong>. in storage with the furniture</p><p><br></p><p>• cutlery and dishes:   ______ </p><p>• kettle:   ______ </p><p>• alarm clock:   ______ </p><p>• CD player:   ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Consultation
-- Source API ID: 871
-- Generated: 2026-02-27T10:14:06.940Z
-- ============================================

-- ============================================
-- Consultation (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '29125b3c-d627-4001-9b68-e4bfcf1a70b0',
    'Consultation',
    'IELTS Listening - Consultation',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    '29125b3c-d627-4001-9b68-e4bfcf1a70b0',
    1,
    '',
    300
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '78ca9ffb-d644-4f70-82ca-3a8b53241241',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    1,
    'gap_fill',
    '----',
    NULL,
    'Atkinson',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cdf1610a-0e85-44bd-a194-acce8aa14922',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    2,
    'gap_fill',
    '----',
    NULL,
    'EL14 2BF',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '98f51922-8b56-4f60-b31e-8ea55c583822',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    3,
    'gap_fill',
    '----',
    NULL,
    'Queens',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ced98cf8-2f23-4c6c-a503-392dbc5ac11b',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    4,
    'gap_fill',
    '----',
    NULL,
    '1986',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6775d441-137d-45cc-8241-812b6de2d701',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    5,
    'gap_fill',
    '----',
    NULL,
    '5 days',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8216a64f-9d51-457b-b66c-68680d46345c',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    6,
    'gap_fill',
    '----',
    NULL,
    'flashing',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e4f8fcb8-c7ac-4c3b-a232-be56fcc9dbd5',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    7,
    'gap_fill',
    '----',
    NULL,
    'bright',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '04162d8e-5fc2-4b57-a684-6101dfa6b58a',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    8,
    'gap_fill',
    '----',
    NULL,
    'Central',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '04399da6-8e9d-4a75-acee-09cc18ca5f3a',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    9,
    'gap_fill',
    '----',
    NULL,
    'screen',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8a22f40e-bf36-40d1-8e83-cc21436ee16a',
    'listening',
    'c2ee5536-66b7-4362-ba25-cc5db0b17347',
    10,
    'gap_fill',
    '----',
    NULL,
    'strain',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Consultation</h3><h4>Patient Information</h4><p>Name: Anu  ______ </p><p>Post code:  ______ </p><p>Current address:  ______  Avenue</p><p>Birthday: October 1st  ______ </p><p>Phone number: 875934</p><p><br></p><h4>Health Condition</h4><p>Background: Illness has lasted for ______ </p><p>Symptom: see ______  lights</p><p>Possible cause: the room was too ______.</p><p>Previous hospital:  ______  Hospital</p><p><br></p><h4>Suggestions</h4><p>Have a good rest after staring at a ______  for a long time</p><p>Use some medicine to ease eye ______ .</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: International Club
-- Source API ID: 870
-- Generated: 2026-02-27T10:14:07.934Z
-- ============================================

-- ============================================
-- International Club (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'fdbda096-3735-49b1-9497-7fa6380dfbea',
    'International Club',
    'IELTS Listening - International Club',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    'fdbda096-3735-49b1-9497-7fa6380dfbea',
    1,
    '',
    366
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7c490fb5-dbc5-4f4b-acad-a730651e1ee5',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    1,
    'gap_fill',
    '-----',
    NULL,
    '15',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ffd3e9b0-6e39-427b-bab5-bc17d93f62bd',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    2,
    'gap_fill',
    '-----',
    NULL,
    'ice skating',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6bde80fd-cbdc-4a5c-a817-93939fc63fbf',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    3,
    'gap_fill',
    '-----',
    NULL,
    'Sundays',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c7d75b40-6454-4bca-a398-a5a3fa111af6',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    4,
    'gap_fill',
    '-----',
    NULL,
    '16th October',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '08f60128-2d18-472c-a8b3-7374605442e2',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    5,
    'gap_fill',
    '-----',
    NULL,
    '3',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '137da841-3c49-4cc5-9c1c-ae365aa8c61a',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    6,
    'gap_fill',
    '-----',
    NULL,
    'free drinks',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd062317a-b9aa-4d8c-8fd3-410f94272b72',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    7,
    'gap_fill',
    '-----',
    NULL,
    'local museum',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '017d59e8-e847-4a84-84cc-04240ed59a13',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    8,
    'mcq_multiple',
    '----',
    '["Lecture","Film","Saturday excursion","Excursion","Culture evening","Night tour","Yoga classes"]'::jsonb,
    'A,C,E',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>THREE</strong> correct answers.</p>","context":"<p>Which <strong>THREE</strong> events are held every month by the club?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b38a26b4-34c4-4e85-90e2-25dd8b0b750d',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    9,
    'mcq_multiple',
    '----',
    '["Lecture","Film","Saturday excursion","Excursion","Culture evening","Night tour","Yoga classes"]'::jsonb,
    'A,C,E',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>THREE</strong> correct answers.</p>","context":"<p>Which <strong>THREE</strong> events are held every month by the club?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd1b3bac7-4df0-4ec3-bdb1-5cc060c7c005',
    'listening',
    'b313c6c5-b950-41e2-b706-47f5f7f2e2e4',
    10,
    'mcq_multiple',
    '----',
    '["Lecture","Film","Saturday excursion","Excursion","Culture evening","Night tour","Yoga classes"]'::jsonb,
    'A,C,E',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>THREE</strong> correct answers.</p>","context":"<p>Which <strong>THREE</strong> events are held every month by the club?</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Booking a residential workshop
-- Source API ID: 869
-- Generated: 2026-02-27T10:14:08.951Z
-- ============================================

-- ============================================
-- Booking a residential workshop (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'af938ca7-00d7-492e-9582-af7dfcefa57b',
    'Booking a residential workshop',
    'IELTS Listening - Booking a residential workshop',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    'af938ca7-00d7-492e-9582-af7dfcefa57b',
    1,
    '',
    367
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd9ff0699-050c-4e5a-80e2-c93d25da5709',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    1,
    'gap_fill',
    '-----',
    NULL,
    'Creswick',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c8d896ea-6aa2-4b83-bf7b-f0fb7b607516',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    2,
    'gap_fill',
    '-----',
    NULL,
    'theatre',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b77acf0f-c407-42f4-bc89-087928b423b4',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    3,
    'gap_fill',
    '-----',
    NULL,
    'Place',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7ff6beb6-4bf7-4b7d-8681-e04d8db4afe6',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    4,
    'gap_fill',
    '-----',
    NULL,
    'waitress',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '695c9507-eadb-4ff0-af70-293051cbb9d0',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    5,
    'gap_fill',
    '-----',
    NULL,
    'June 13th',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2769b575-ae98-4a54-b273-49d7df28c0c3',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    6,
    'gap_fill',
    '-----',
    NULL,
    '5:30',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fba9f284-b5fd-472f-a1f2-7855ce82c9ae',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    7,
    'gap_fill',
    '-----',
    NULL,
    'milk',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8d7152c1-fb36-47ce-a775-1e1efa5523e3',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    8,
    'gap_fill',
    '-----',
    NULL,
    'comic',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'f11f31ac-8f07-4e70-9319-b51effeddda3',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    9,
    'gap_fill',
    '-----',
    NULL,
    'internet',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '260686ab-f065-4999-bfb8-3b6708f5912f',
    'listening',
    '64c20d4c-caee-49b2-a6bd-63a55c4f43cb',
    10,
    'gap_fill',
    '-----',
    NULL,
    'leaflet',
    NULL,
    1,
    '{"instruction":"<p>Complete the form below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p><br></p><h3>                                              Booking a residential workshop</h3>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Farm Stay Information
-- Source API ID: 868
-- Generated: 2026-02-27T10:14:10.011Z
-- ============================================

-- ============================================
-- Farm Stay Information (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'a30ef17e-e730-47c9-9389-13d86f3d22d0',
    'Farm Stay Information',
    'IELTS Listening - Farm Stay Information',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    'a30ef17e-e730-47c9-9389-13d86f3d22d0',
    1,
    '',
    531
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'acd17b9c-d70b-4a3c-8ed2-237f16f3b63f',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    1,
    'mcq_single',
    'The centre has enough accommodation for',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a4fef59f-5f0b-46b5-809a-ee497e2a70d1',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    2,
    'mcq_single',
    'The meeting room is currently',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8d231624-4836-4e00-b686-d7b6e33a6e7c',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    3,
    'mcq_single',
    'Visitors must tell the centre in advance if they want to',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '5057ec65-0410-4bc0-848a-335d55ab5f07',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    4,
    'mcq_single',
    'All visitors on the farm can',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dc5affe1-2028-4b7a-bbb1-c70e48d119a0',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    5,
    'mcq_single',
    'On the survival course people have to',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0c89e2d6-d657-4ee5-82fc-d3a2a318e1e8',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    6,
    'mcq_single',
    'From the centre it is easy to walk to',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bcf6ece3-dbdc-4f60-bb18-d5435252721b',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    7,
    'mcq_single',
    'If the weather is bad visitors can go to a',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8ebdf582-74d6-4b40-8a9e-c5b5e02b4493',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    8,
    'mcq_single',
    'Groups who wish to stay at the centre must pay',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c93070ba-5f72-41f3-80ce-05ea874d8fda',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    9,
    'gap_fill',
    '----',
    NULL,
    'Cotehele',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<p>• Address: Winsham Farm, ______ Rd''</p><p><br></p><p>• Postcode: ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fb2af9a5-8a13-41e7-be04-31652b405156',
    'listening',
    'f9298354-ab28-46e7-947c-3cfcf8338667',
    10,
    'gap_fill',
    '----',
    NULL,
    'SH121LQ',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER </strong>for each answer.</p>","context":"<p>• Address: Winsham Farm, ______ Rd''</p><p><br></p><p>• Postcode: ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Wedding arrangements - Clarence House Hotel
-- Source API ID: 867
-- Generated: 2026-02-27T10:14:11.021Z
-- ============================================

-- ============================================
-- Wedding arrangements - Clarence House Hotel (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '4cb08f94-576f-4231-ae5f-4cad308ff83a',
    'Wedding arrangements - Clarence House Hotel',
    'IELTS Listening - Wedding arrangements - Clarence House Hotel',
    'easy',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    '4cb08f94-576f-4231-ae5f-4cad308ff83a',
    1,
    '',
    407
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '38a58c27-2102-4fbf-b71a-298f4315dbff',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    1,
    'gap_fill',
    '----',
    NULL,
    'city',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '6ef7c643-5f93-422c-a7b2-54aa9a45dd4e',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    2,
    'gap_fill',
    '----',
    NULL,
    'photos',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'b8a3b95f-f654-4bbe-827c-97e0a6961c45',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    3,
    'gap_fill',
    '----',
    NULL,
    'round',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0f196ab2-d2a0-47fd-9655-167cccf0589f',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    4,
    'gap_fill',
    '----',
    NULL,
    'decorations',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '77c2eb5a-2054-44d7-b388-95722c22fa0d',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    5,
    'gap_fill',
    '----',
    NULL,
    'menu',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9d0a0eaf-d7c2-435a-900e-8cac9566ceae',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    6,
    'gap_fill',
    '----',
    NULL,
    'sandwiches',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2ef9af37-fb71-4353-b702-bca60b0e62f6',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    7,
    'gap_fill',
    '----',
    NULL,
    '5,995',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a211c85c-a158-4ec6-a991-1251d8b468de',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    8,
    'gap_fill',
    '----',
    NULL,
    'cake',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d4de8a1-11c4-454b-9854-6a2eee9ab756',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    9,
    'gap_fill',
    '----',
    NULL,
    'Izard',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e805e499-c8f3-4be5-81a8-6c6075bce8d8',
    'listening',
    '3aeb38e7-e44e-418f-a870-21c30ccbcd5e',
    10,
    'gap_fill',
    '----',
    NULL,
    '15th October',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3>Wedding arrangements - Clarence House Hotel</h3><p>Available date: 1st June</p><p><strong>The Oxford Suite has:</strong></p><p>• a dining room with a good view of the ______ </p><p>• a private garden for ______  and for the wedding ceremony</p><p>• an area suitable for dancing</p><p><strong>The wedding package includes:</strong></p><p>• use of the Oxford Suite</p><p>• a three-course meal</p><p>• room arranged with ______ tables</p><p>• table ______ included</p><p>• white tablecloths and chairs</p><p>• personalised printed ______ </p><p>• a late-evening buffet with a choice of ______  and hot drinks</p><p><strong>Music: hotel will organise a band (not included in price)</strong></p><p>• Total cost of package: £ ______ </p><p>• Can also recommend a ______  supplier (new company)</p><p>• Wedding coordinator Sarah ______ </p><p>• Date arranged for visit: ______  at 11.30 a.m</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Campsites
-- Source API ID: 993
-- Generated: 2026-02-27T10:14:12.157Z
-- ============================================

-- ============================================
-- Campsites (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '50034e42-5035-4108-9d34-eef1bd1f7332',
    'Campsites',
    'IELTS Listening - Campsites',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    '50034e42-5035-4108-9d34-eef1bd1f7332',
    1,
    '',
    388
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7552cfe6-2bac-41d7-9b08-ebe5d918bd2c',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    1,
    'gap_fill',
    '----',
    NULL,
    'sea',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '34dc76ab-be56-4143-92b8-2290914c47d9',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    2,
    'gap_fill',
    '----',
    NULL,
    'animals',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'aec140b7-8dda-4342-ac19-759675cfc2e3',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    3,
    'gap_fill',
    '----',
    NULL,
    'eggs',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '8ad2ea51-2173-46f2-961d-110c20e1dab3',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    4,
    'gap_fill',
    '----',
    NULL,
    'fire',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1a73bb62-2cd6-4de1-a12c-7ace71b84451',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    5,
    'gap_fill',
    '----',
    NULL,
    '15.75',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a8afa54c-2c3a-466b-8a4c-1d361526ceb3',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    6,
    'gap_fill',
    '----',
    NULL,
    'fishing',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '03b152ba-bfa6-41b2-b994-9a7418169424',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    7,
    'gap_fill',
    '----',
    NULL,
    'bike',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd5d15ad1-74f4-4759-b4f3-b99cf200ef9e',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    8,
    'gap_fill',
    '----',
    NULL,
    'football',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2bd45eb8-fdb4-45e7-9297-05250e3f01f4',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    9,
    'gap_fill',
    '----',
    NULL,
    'July',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '393d5b60-d85e-4ad8-a96d-5c9212fb0f1b',
    'listening',
    'ae2c3058-cff1-456f-b57a-10fa8c492ba4',
    10,
    'gap_fill',
    '----',
    NULL,
    'pool',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Campsites</strong></h3><p><strong>Westerly Campsite</strong></p><p>Campsite for families with children under 12</p><p>Location: near the __________</p><p>Special attraction for children: the  __________</p><p>A local farmer sells __________</p><p>Campers are allowed to have a  __________</p><p>Cost per night:£ __________ for a family</p><p><br></p><p><strong>Snetton Forest Campsite</strong></p><p>Cost per night: £5 per adult (children free)</p><p>Recommended for people who like __________</p><p>Campers can hire a __________</p><p>Activity organised for children: __________</p><p><br></p><p><strong>Trent Valley Campsite</strong></p><p>Better month for families to go:  __________</p><p>Has an outdoor __________</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Making mistakes
-- Source API ID: 994
-- Generated: 2026-02-27T10:14:13.163Z
-- ============================================

-- ============================================
-- Making mistakes (Section 2)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '052707a4-46db-4b74-9dc2-459e8f4e408e',
    'Making mistakes',
    'IELTS Listening - Making mistakes',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    '052707a4-46db-4b74-9dc2-459e8f4e408e',
    2,
    '',
    362
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1da08aad-1184-44f4-977f-557acebbd262',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    11,
    'mcq_single',
    'What is the most important attitude towards making mistakes according to Arthur?',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '7012dd7b-de26-4818-9055-4425536e2593',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    12,
    'mcq_single',
    'What’s true about self-confidence according to Arthur?',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd769a586-05cf-49af-ba2a-00932aa7ed02',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    13,
    'mcq_single',
    'What advice does Arthur give to new business leaders?',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '337e0df5-e250-48b1-be5e-1b16f13b8a25',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    14,
    'mcq_single',
    'How does Arthur deal with difficult problems?',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '55bbc909-3df9-478c-a00b-4ff206243c39',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    15,
    'mcq_single',
    'What’s the common quality of leaders?',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fc26f201-060a-4595-80e9-56ab669041dc',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    16,
    'mcq_single',
    'How should companies take risks?',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ebb3ebed-6cf2-4a86-a8d4-2fd27215c99f',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    17,
    'mcq_multiple',
    '----',
    '["Fix realistic prices","Create products better than the competitors’","Be committed","Pay attention to detail","Apply complete strategy"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> factors are important when starting a business?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e3e1a25a-7bfe-4793-9dfd-b1d445f5b2ce',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    18,
    'mcq_multiple',
    '----',
    '["Fix realistic prices","Create products better than the competitors’","Be committed","Pay attention to detail","Apply complete strategy"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> factors are important when starting a business?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fd4b06e4-ac57-4894-851d-731aafff7aad',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    19,
    'mcq_multiple',
    '----',
    '["Family support","Good business advice with new ideas","Support of the bank loan","Friends’ support","Governmental funding"]'::jsonb,
    'A,C',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> kinds of support are important for Arthur?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0d9b732d-d898-4d21-8944-49016d290ed4',
    'listening',
    'f4766a67-aac8-4fcf-b533-50a74cbc64e0',
    20,
    'mcq_multiple',
    '----',
    '["Family support","Good business advice with new ideas","Support of the bank loan","Friends’ support","Governmental funding"]'::jsonb,
    'A,C',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> kinds of support are important for Arthur?</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Volunteering 
-- Source API ID: 357
-- Generated: 2026-02-27T10:14:14.152Z
-- ============================================

-- ============================================
-- Volunteering  (Section 2)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'd45088b7-4df3-4631-a60f-8a95a5304956',
    'Volunteering ',
    'IELTS Listening - Volunteering ',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    'd45088b7-4df3-4631-a60f-8a95a5304956',
    2,
    '',
    60
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'acaee144-5e6e-4551-927e-78f53ad45d0f',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    11,
    'mcq_multiple',
    '----',
    '["feeding them","noting their food preferences","making space to put their meal","encouraging them to eat","putting food on plates"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>In which <strong>TWO</strong> ways are ward volunteers expected to help patients at lunchtimes?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9bc9e797-8b03-463e-8571-575f0d3d9baa',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    12,
    'mcq_multiple',
    '----',
    '["feeding them","noting their food preferences","making space to put their meal","encouraging them to eat","putting food on plates"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>In which <strong>TWO</strong> ways are ward volunteers expected to help patients at lunchtimes?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd3ed74f6-f6e0-4505-82f5-435a2f242607',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    13,
    'mcq_multiple',
    '----',
    '["ability to cope with upsetting situations","understanding of the effects of different illnesses","ability to show initiative","willingness to follow rules","ability to make patients feel cheerful"]'::jsonb,
    'A,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers. </p>","context":"<p>Which <strong>TWO</strong> qualities are required in ward volunteers?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '70ddd162-ff5b-4971-8a12-e5116ae5a88e',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    14,
    'mcq_multiple',
    '----',
    '["ability to cope with upsetting situations","understanding of the effects of different illnesses","ability to show initiative","willingness to follow rules","ability to make patients feel cheerful"]'::jsonb,
    'A,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers. </p>","context":"<p>Which <strong>TWO</strong> qualities are required in ward volunteers?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '291e3426-dd1a-4624-b0ca-37646ac4ae6f',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    15,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '770ffc2f-0e2d-4cf0-af3d-3466f4c7c961',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    16,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'F',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dd186251-eca9-4925-9659-fa203027b75c',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    17,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e53569f4-828c-4cad-b9b2-97e7ebc02381',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    18,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'H',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '642b90ac-19d9-4c25-97e3-e652467005df',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    19,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0fe672fe-e32f-4893-8b8c-9c4b88c4b3e8',
    'listening',
    '827538ba-6481-4aa1-bb14-dae78b6170c7',
    20,
    'matching_info',
    '----',
    '["being welcomed by patients","feeling part of a team","gaining self-confidence","having a regular routine","having expert support","hearing about patients'' lives","seeing patients get better","understanding patients'' needs"]'::jsonb,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer from the box for each question.</p>","context":"<p><strong>Which aspect of volunteering does each of the following volunteers comment on?</strong></p><ul><li>Chris   ______ </li><li>Shaheen   ______ </li><li>Loc    ______ </li><li>Stephen  ______ </li><li>Magda   ______ </li><li>Richard   ______ </li></ul>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Dolphin presentation
-- Source API ID: 995
-- Generated: 2026-02-27T10:14:15.030Z
-- ============================================

-- ============================================
-- Dolphin presentation (Section 3)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '80e3028c-c888-4d45-a8f9-34d16aca3379',
    'Dolphin presentation',
    'IELTS Listening - Dolphin presentation',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    '80e3028c-c888-4d45-a8f9-34d16aca3379',
    3,
    '',
    375
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9b151c8c-20a3-47af-8650-f685373dfc31',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    21,
    'mcq_single',
    'What is the students’ purpose in mentioning the way dolphins make sounds?',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '408d921a-0a3a-440a-8616-f75c6eef5303',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    22,
    'mcq_single',
    'According to Fran, Hector’s dolphins are unaffected by',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd3a3bbc3-42f8-4ba0-b22e-1f53e08226c1',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    23,
    'mcq_single',
    'The New Zealand Government set up a marine sanctuary',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '2de29c43-e49f-4a67-abcd-6b1f37a9d5d7',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    24,
    'mcq_single',
    'Where is the largest population of Hector’s dolphins in New Zealand?',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '596b3e6f-8663-4189-aa57-f802f018e534',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    25,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cbb744be-99f8-4e4c-9faa-0fa77ab233ea',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    26,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '4eb04d38-b7cf-499b-bab7-6d87a84abe63',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    27,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '914e55cc-9f14-472e-ab37-f2eb0b7ebcd6',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    28,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'F',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1bccbd53-5f57-46aa-ab72-7d0fb72fe267',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    29,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'H',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '125a1ba2-22d8-4920-9e72-c23855621a0c',
    'listening',
    '1acc1948-22d3-4630-b4d0-a70dc199fc63',
    30,
    'matching_info',
    '----',
    '["swim along behind boats","swim in unusually large groups","live along New Zealand’s entire coastline","swim beneath slow-moving boats","tend to be solitary","live only off New Zealand’s northwest coast","are the second largest dolphin species in New Zealand","are seen mostly in Kaikoura"]'::jsonb,
    'G',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer and move it into the gap.</p>","context":"<p>Which special characteristic does each of the following types of dolphin have?</p><p><br></p><h3><strong>Types of dolphin</strong></h3><p>• Common dolphins   ______ </p><p>• Dusky dolphins   ______ </p><p>• Hector’s dolphins   ______ </p><p>• Maui’s dolphins   ______ </p><p>• Orcas   ______ </p><p>• Bottle-nose dolphins   ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Cricket
-- Source API ID: 358
-- Generated: 2026-02-27T10:14:15.983Z
-- ============================================

-- ============================================
-- Cricket (Section 3)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '96a8d3b5-031e-41b0-a142-ae869a02909a',
    'Cricket',
    'IELTS Listening - Cricket',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    '96a8d3b5-031e-41b0-a142-ae869a02909a',
    3,
    '',
    377
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'df7ccf25-5e5e-450e-a201-a88836686a75',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    21,
    'mcq_multiple',
    '----',
    '["Women''s cricket is growing in popularity","The regulations have been changed","The number of cricket injuries has been increasing","The equipment has improved recently","The quality of the equipment varies a lot"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>For which <strong>TWO</strong> reasons did Alice and David decide to focus on cricket equipment?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'bfc2fce5-32bc-49f8-bb58-97bbbb5837f7',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    22,
    'mcq_multiple',
    '----',
    '["Women''s cricket is growing in popularity","The regulations have been changed","The number of cricket injuries has been increasing","The equipment has improved recently","The quality of the equipment varies a lot"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>For which <strong>TWO</strong> reasons did Alice and David decide to focus on cricket equipment?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'a3717c34-7f2e-4244-91e5-5bf583fe4391',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    23,
    'mcq_multiple',
    '----',
    '["They are so expensive to make","They differ depending on what they are used for","They are made in so many different locations","They have to be made of natural materials","They require such a high standard of care"]'::jsonb,
    'A,B',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answer.</p>","context":"<p>For which <strong>TWO</strong> things surprised Alice and David about professional cricket bats?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '418d001a-f8f7-4ee0-b715-1c92438529d9',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    24,
    'mcq_multiple',
    '----',
    '["They are so expensive to make","They differ depending on what they are used for","They are made in so many different locations","They have to be made of natural materials","They require such a high standard of care"]'::jsonb,
    'A,B',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answer.</p>","context":"<p>For which <strong>TWO</strong> things surprised Alice and David about professional cricket bats?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '504feb6a-7fda-4771-92ec-92f5a600501a',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    25,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'D',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ff7a1094-726f-4a4d-be50-60e252cea012',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    26,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '3d63516e-9e9b-4110-86ee-65650d6ad100',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    27,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'G',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '02008029-f351-426b-a88c-034dba16e7a6',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    28,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '82e3288d-d08a-42ea-bbf2-867fe09342b2',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    29,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'H',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0324e8ad-8798-4b3f-8f5a-535cd6635023',
    'listening',
    '90d12789-5246-43fb-bcf8-496d646a4e03',
    30,
    'matching_info',
    '----',
    '["Get the audience to try out the equipment","Focus on the materials used","Include some photographs","Make the section shorter","Ask the audience for their opinion","Change the order of the information","Show how the equipment is used","Leave the section unchanged"]'::jsonb,
    'E',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct letter for each question.</p>","context":"<p>What decision do the students take for each of the following sections of their presentation?</p><p><br></p><p>Historical background   ______ </p><p>Bat design    ______ </p><p>Ball design    ______ </p><p>Helmet design    ______ </p><p>Protective gear    ______ </p><p>Advertising      ______ </p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Human babies and numerical ability
-- Source API ID: 385
-- Generated: 2026-02-27T10:14:16.908Z
-- ============================================

-- ============================================
-- Human babies and numerical ability (Section 4)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '080bbb74-dd5a-4991-ac8c-a891d6343c9d',
    'Human babies and numerical ability',
    'IELTS Listening - Human babies and numerical ability',
    'hard',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    '080bbb74-dd5a-4991-ac8c-a891d6343c9d',
    4,
    '',
    494
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '1eb19904-0fdb-4996-a3be-6f98ae6da39d',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    31,
    'gap_fill',
    '----',
    NULL,
    'confusion',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e85da98f-df93-46aa-aec1-86e207e585a9',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    32,
    'gap_fill',
    '----',
    NULL,
    'eyes',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '838d6a6e-bdbe-4622-a854-5e01dda32379',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    33,
    'gap_fill',
    '----',
    NULL,
    'dots',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd1844aec-6b66-4f38-9023-a3e58f1bf020',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    34,
    'gap_fill',
    '----',
    NULL,
    'arrangement',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '982ba27d-ee19-4328-b899-32ea185f0180',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    35,
    'gap_fill',
    '----',
    NULL,
    'pictures',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '397944aa-a037-4dd5-814c-ba84a8d9bb6e',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    36,
    'gap_fill',
    '----',
    NULL,
    'matching',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'dac696ae-f7f3-4827-9824-4bfc54b04337',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    37,
    'gap_fill',
    '----',
    NULL,
    'fight',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '10a323da-a2e3-4ce1-bfb3-836b26480c79',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    38,
    'gap_fill',
    '----',
    NULL,
    'language',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '346e0abe-ef8b-4fab-87e6-9f2d29c6d101',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    39,
    'gap_fill',
    '----',
    NULL,
    'farming',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '668dd93b-afce-40df-aa55-043ec5cdbbd4',
    'listening',
    '05708f83-5994-46b0-b33c-d26ac8fc2c77',
    40,
    'gap_fill',
    '----',
    NULL,
    'toes',
    NULL,
    1,
    '{"instruction":"<p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>","context":"<h3>Human babies and numerical ability</h3><h4>Interpreting a baby''s thoughts</h4><p>- In the 19th century, William James said new-born babies were in a state of ______ </p><p>- Modern researchers can tell what babies are interested in by studying movements of their ______ </p><p><strong>Experiments with babies and numbers</strong></p><p>- One-day-old babies were shown several cards with ______  on</p><p>- They were interested when the number changed</p><p>- They were not interested when the ______  changed</p><p>- Older babies were shown cards with ______  of different things</p><p>- They were most interested when the number changed</p><p>- These experiments suggest babies have a sense of number</p><p><strong>Animals and numbers</strong></p><p>- Some birds can find food in a box by ______  numbers, which involves counting</p><p>- Wild lions can estimate the number of lions in another group from the sound they make.</p><p>- They can then decide whether or not to ______  the other group</p><p><strong>Humans and counting</strong></p><p>- Research with aboriginal children concludes that ______  is not essential for understanding numbers.</p><p>- Researchers think that counting developed at the same time as people started ______ </p><p>- Europeans may once have used fingers and ______  for counting.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Eco-farm Tour
-- Source API ID: 225
-- Generated: 2026-02-27T10:14:17.883Z
-- ============================================

-- ============================================
-- Eco-farm Tour (Section 1)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '72949f11-01db-4c7c-8bf5-7c75bc5f8bff',
    'Eco-farm Tour',
    'IELTS Listening - Eco-farm Tour',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    '72949f11-01db-4c7c-8bf5-7c75bc5f8bff',
    1,
    '',
    390
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ccff4562-f216-4af3-a291-4276e1ffe685',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    1,
    'gap_fill',
    '----',
    NULL,
    'Pennington',
    NULL,
    1,
    '{"instruction":"<p>Complete the note below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Eco-farm Tour</strong></h3><p><br></p><p><strong>Dates offered:</strong> 6–20 June</p><p><strong>Name:</strong> Helen ______ </p><p><strong>Email address:</strong> helen123@ ______ .com</p><p><strong>Home address:</strong>  ______ Road, Sheffield</p><p><strong>Source of information: ______ </strong></p><p><strong>Membership number:</strong>  ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '9f969bcc-d54e-480f-b319-00c07d9d3cc9',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    2,
    'gap_fill',
    '----',
    NULL,
    'greenfield',
    NULL,
    1,
    '{"instruction":"<p>Complete the note below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Eco-farm Tour</strong></h3><p><br></p><p><strong>Dates offered:</strong> 6–20 June</p><p><strong>Name:</strong> Helen ______ </p><p><strong>Email address:</strong> helen123@ ______ .com</p><p><strong>Home address:</strong>  ______ Road, Sheffield</p><p><strong>Source of information: ______ </strong></p><p><strong>Membership number:</strong>  ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '42c92dff-8584-4c7a-a233-adaf56203db9',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    3,
    'gap_fill',
    '----',
    NULL,
    '66 Lake',
    NULL,
    1,
    '{"instruction":"<p>Complete the note below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Eco-farm Tour</strong></h3><p><br></p><p><strong>Dates offered:</strong> 6–20 June</p><p><strong>Name:</strong> Helen ______ </p><p><strong>Email address:</strong> helen123@ ______ .com</p><p><strong>Home address:</strong>  ______ Road, Sheffield</p><p><strong>Source of information: ______ </strong></p><p><strong>Membership number:</strong>  ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '44cc5921-94c6-4216-9d72-f3184c84544e',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    4,
    'gap_fill',
    '----',
    NULL,
    'radio',
    NULL,
    1,
    '{"instruction":"<p>Complete the note below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Eco-farm Tour</strong></h3><p><br></p><p><strong>Dates offered:</strong> 6–20 June</p><p><strong>Name:</strong> Helen ______ </p><p><strong>Email address:</strong> helen123@ ______ .com</p><p><strong>Home address:</strong>  ______ Road, Sheffield</p><p><strong>Source of information: ______ </strong></p><p><strong>Membership number:</strong>  ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '0859edf9-ada0-44b0-8d21-31b25a2af8c1',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    5,
    'gap_fill',
    '----',
    NULL,
    'UK765024EG',
    NULL,
    1,
    '{"instruction":"<p>Complete the note below. Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.</p>","context":"<h3><strong>Eco-farm Tour</strong></h3><p><br></p><p><strong>Dates offered:</strong> 6–20 June</p><p><strong>Name:</strong> Helen ______ </p><p><strong>Email address:</strong> helen123@ ______ .com</p><p><strong>Home address:</strong>  ______ Road, Sheffield</p><p><strong>Source of information: ______ </strong></p><p><strong>Membership number:</strong>  ______ </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ab0039da-bc3e-470d-8b87-37b38c670d36',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    6,
    'gap_fill',
    '-----',
    NULL,
    'flat',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write<strong> ONE WORD ONLY </strong>for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '498f9483-320d-43f4-bd96-5a16699b5b57',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    7,
    'gap_fill',
    '-----',
    NULL,
    'forest',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write<strong> ONE WORD ONLY </strong>for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'e613ba6a-929c-469e-a7b7-dc3816958cb4',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    8,
    'gap_fill',
    '-----',
    NULL,
    'organic',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write<strong> ONE WORD ONLY </strong>for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c78d9ec8-d13c-461c-8f3c-1e6a2cd2a378',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    9,
    'gap_fill',
    '-----',
    NULL,
    'bike',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write<strong> ONE WORD ONLY </strong>for each answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '876be9e2-25e7-4489-bd5b-68442cf49a90',
    'listening',
    'f8744611-38d0-4d5d-bf57-a7722e7e8ed4',
    10,
    'gap_fill',
    '-----',
    NULL,
    'dance',
    NULL,
    1,
    '{"instruction":"<p>Complete the table below. Write<strong> ONE WORD ONLY </strong>for each answer.</p>"}'::jsonb
);


-- ============================================
-- Auto-generated seed for: Moving Office
-- Source API ID: 289
-- Generated: 2026-02-27T10:14:18.535Z
-- ============================================

-- ============================================
-- Moving Office (Section 2)
-- ============================================

INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    '33b4341e-af93-4a70-bf5f-f9c44108e2bf',
    'Moving Office',
    'IELTS Listening - Moving Office',
    'medium',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)
VALUES (
    '1af29749-3b1c-477b-a8d5-77732b234190',
    '33b4341e-af93-4a70-bf5f-f9c44108e2bf',
    2,
    '',
    400
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'cccd79fd-c185-4188-bdf5-5a93876fb1ef',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    11,
    'mcq_single',
    'what reason does the manager give for moving to a new office building?',
    NULL,
    'C',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer. </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '94a87d67-6cd2-4379-bcf7-db0f345643c9',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    12,
    'mcq_single',
    'What is best about the new office building?',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer. </p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'c4fcd061-d21e-49d5-b397-cfea4a9023de',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    13,
    'mcq_single',
    'When will the office move take place?',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fb953cd4-af2c-4abe-9574-b813e0000f51',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    14,
    'mcq_single',
    'What information about the new location is already on the company website?',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '414805c7-1e96-413d-82dc-b0a284266482',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    15,
    'mcq_single',
    'What practical thing must staff do now?',
    NULL,
    'A',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ba285dfc-033c-4b26-ace2-f4c878069098',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    16,
    'mcq_single',
    'Staff will need to put folders containing confidential details',
    NULL,
    'B',
    NULL,
    1,
    '{"instruction":"<p>Choose the correct answer.</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    '34ef893b-66ff-436c-b75b-e5c257f84a71',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    17,
    'mcq_multiple',
    '----',
    '["keep your head up","do not bend your back","do not lean to one side","use handles","stand with feet apart"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> things do people often forget when lifting heavy things?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'fd2188fc-aafd-42dd-8939-556e285df339',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    18,
    'mcq_multiple',
    '----',
    '["keep your head up","do not bend your back","do not lean to one side","use handles","stand with feet apart"]'::jsonb,
    'C,D',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> things do people often forget when lifting heavy things?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'd0fd3d93-ae8f-455c-9e35-8e54a1f7b793',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    19,
    'mcq_multiple',
    '----',
    '["wears face mask","open windows","wear gloves","take frequent breaks","drink plenty of water"]'::jsonb,
    'C,E',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> things should staff do when moving papers?</p>"}'::jsonb
);

INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)
VALUES (
    'ca7aaa39-e4fb-407c-b36c-55c0a6936f99',
    'listening',
    '1af29749-3b1c-477b-a8d5-77732b234190',
    20,
    'mcq_multiple',
    '----',
    '["wears face mask","open windows","wear gloves","take frequent breaks","drink plenty of water"]'::jsonb,
    'C,E',
    NULL,
    1,
    '{"instruction":"<p>Choose <strong>TWO</strong> correct answers.</p>","context":"<p>Which <strong>TWO</strong> things should staff do when moving papers?</p>"}'::jsonb
);


