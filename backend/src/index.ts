import type { Core } from '@strapi/strapi';
import { startTelegramBot } from './telegram-bot';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
      strapi.server.app.proxy = true;
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure permissions on first run
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!publicRole || !authenticatedRole) return;

    // Define permissions
    const publicPermissions: Record<string, string[]> = {
      'api::test': ['find', 'findOne'],
      'api::reading-passage': ['find', 'findOne'],
      'api::listening-section': ['find', 'findOne'],
      'api::writing-task': ['find', 'findOne'],
      'api::speaking-topic': ['find', 'findOne'],
      'api::question': ['find', 'findOne'],
      'api::business-inquiry': ['create'],
    };

    const authenticatedPermissions: Record<string, string[]> = {
      // Content (read-only)
      'api::test': ['find', 'findOne'],
      'api::reading-passage': ['find', 'findOne'],
      'api::listening-section': ['find', 'findOne'],
      'api::writing-task': ['find', 'findOne'],
      'api::speaking-topic': ['find', 'findOne'],
      'api::question': ['find', 'findOne'],
      'api::business-inquiry': ['create'],
      // User data (CRUD own)
      'api::test-attempt': ['find', 'findOne', 'create', 'update'],
      'api::user-answer': ['find', 'findOne', 'create'],
      'api::writing-submission': ['find', 'findOne', 'create', 'update'],
      'api::speaking-submission': ['find', 'findOne', 'create', 'update'],
      'api::test-progress': ['find', 'findOne', 'create', 'update'],
      'api::full-mock-test-attempt': ['find', 'findOne', 'create', 'update'],
      'api::feature-notification': ['find', 'create'],
      'api::telegram-auth-code': ['find', 'create', 'update'],
    };

    // Apply permissions
    const setPermissions = async (
      roleId: number,
      permissions: Record<string, string[]>
    ) => {
      for (const [uid, actions] of Object.entries(permissions)) {
        for (const action of actions) {
          const existingPermission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                role: roleId,
                action: `${uid}.${action}`,
              },
            });

          if (!existingPermission) {
            await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action: `${uid}.${action}`,
                  role: roleId,
                },
              });
          }
        }
      }
    };

    await setPermissions(publicRole.id, publicPermissions);
    await setPermissions(authenticatedRole.id, authenticatedPermissions);

    console.log('✅ Permissions configured');

    // Start Telegram bot (long-polling)
    startTelegramBot(strapi);

    // Seed reading test data (only if no tests exist)
    const existingTests = await strapi.query('api::test.test').count();
    if (existingTests === 0) {
      console.log('🌱 Seeding reading test data...');

      // 1. Create the test
      const test = await strapi.query('api::test.test').create({
        data: {
          title: 'IELTS Academic Reading Practice Test 1',
          description:
            'A complete IELTS Academic reading practice test with one passage and 13 questions covering multiple question types.',
          difficulty_level: 'medium',
          is_published: true,
        },
      });

      // 2. Create a reading passage
      const passage = await strapi
        .query('api::reading-passage.reading-passage')
        .create({
          data: {
            test: test.id,
            passage_number: 1,
            title: 'The Rise of Vertical Farming',
            content: `Vertical farming, the practice of growing crops in vertically stacked layers within controlled indoor environments, has emerged as one of the most promising innovations in modern agriculture. As the global population continues to surge toward an estimated 9.7 billion by 2050, traditional farming methods face mounting pressure to meet the escalating demand for food. Vertical farming offers a compelling alternative that addresses many of the limitations inherent in conventional agriculture.

The concept of vertical farming is not entirely new. In 1999, Professor Dickson Despommier of Columbia University popularised the idea with his students, envisioning skyscraper-sized farms that could feed entire urban populations. However, it was not until advances in LED lighting technology and hydroponic systems in the 2010s that vertical farming became commercially viable. Today, companies such as AeroFarms, Plenty, and Infarm operate large-scale vertical farms in cities around the world.

One of the primary advantages of vertical farming is its remarkable efficiency in water usage. Traditional agriculture accounts for approximately 70% of global freshwater consumption, whereas vertical farms use up to 95% less water by recirculating nutrient-rich solutions through closed-loop hydroponic or aeroponic systems. This efficiency is particularly significant in arid regions where water scarcity poses a serious threat to food security.

Furthermore, vertical farms eliminate the need for pesticides and herbicides, as the controlled indoor environment prevents pest infestations and weed growth. This results in produce that is not only free from chemical residues but also more consistent in quality and appearance. The absence of seasonal constraints means that crops can be harvested year-round, ensuring a reliable supply regardless of weather conditions or climate disruptions.

Critics of vertical farming, however, point to several significant challenges. The most pressing concern is the substantial energy consumption required to power artificial lighting and climate control systems. A study published in Nature Food in 2020 estimated that producing wheat in a vertical farm would require approximately 1,000 times more energy than growing it in a conventional field. While renewable energy sources can mitigate this issue, the current cost of energy remains a major barrier to profitability.

The range of crops that can be economically grown in vertical farms is also limited. Leafy greens, herbs, and strawberries are well-suited to these environments, but staple crops such as wheat, rice, and maize require far more space and light than vertical farms can efficiently provide. This limitation means that vertical farming is unlikely to replace traditional agriculture entirely but may serve as a valuable complement to it.

Despite these challenges, investment in vertical farming has grown exponentially. In 2021 alone, the industry attracted over $1.8 billion in venture capital funding. Proponents argue that as technology improves and energy costs decrease, vertical farming will become increasingly competitive. Some researchers predict that by 2030, the global vertical farming market could be worth over $20 billion, driven by urbanisation, climate change, and growing consumer demand for locally sourced, sustainable produce.`,
            word_count: 420,
            time_limit: 1200, // 20 minutes in seconds
          },
        });

      // 3. Create questions for the passage
      const questions = [
        // Questions 1-5: True/False/Not Given
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 1,
          question_type: 'tfng' as const,
          question_text:
            'Professor Despommier was the first person to propose the idea of vertical farming.',
          options: ['True', 'False', 'Not Given'],
          correct_answer: 'Not Given',
          explanation:
            'The passage says Despommier "popularised" the idea, not that he was the first to propose it.',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 2,
          question_type: 'tfng' as const,
          question_text:
            'Vertical farming uses significantly less water than traditional agriculture.',
          options: ['True', 'False', 'Not Given'],
          correct_answer: 'True',
          explanation:
            'The passage states vertical farms use "up to 95% less water" than traditional farming.',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 3,
          question_type: 'tfng' as const,
          question_text:
            'Vertical farms require the use of pesticides to maintain crop health.',
          options: ['True', 'False', 'Not Given'],
          correct_answer: 'False',
          explanation:
            'The passage states vertical farms "eliminate the need for pesticides and herbicides".',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 4,
          question_type: 'tfng' as const,
          question_text:
            'The Nature Food study focused specifically on rice production in vertical farms.',
          options: ['True', 'False', 'Not Given'],
          correct_answer: 'False',
          explanation:
            'The study was about wheat, not rice.',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 5,
          question_type: 'tfng' as const,
          question_text:
            'AeroFarms is the largest vertical farming company in the world.',
          options: ['True', 'False', 'Not Given'],
          correct_answer: 'Not Given',
          explanation:
            'The passage mentions AeroFarms as one of several companies but does not say it is the largest.',
          points: 1,
        },
        // Questions 6-9: MCQ Single
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 6,
          question_type: 'mcq_single' as const,
          question_text:
            'What made vertical farming commercially viable?',
          options: [
            'A. Government subsidies for urban agriculture',
            'B. Advances in LED lighting and hydroponic systems',
            'C. The publication of Professor Despommier\'s research',
            'D. Decreasing costs of building materials',
          ],
          correct_answer: 'B',
          explanation:
            'The passage states "advances in LED lighting technology and hydroponic systems in the 2010s" made it commercially viable.',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 7,
          question_type: 'mcq_single' as const,
          question_text:
            'According to the passage, what percentage of global freshwater is used by traditional agriculture?',
          options: ['A. 50%', 'B. 60%', 'C. 70%', 'D. 95%'],
          correct_answer: 'C',
          explanation:
            'The passage states "Traditional agriculture accounts for approximately 70% of global freshwater consumption".',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 8,
          question_type: 'mcq_single' as const,
          question_text:
            'What is described as the most pressing challenge for vertical farming?',
          options: [
            'A. Limited crop variety',
            'B. High energy consumption',
            'C. Lack of investor interest',
            'D. Consumer resistance',
          ],
          correct_answer: 'B',
          explanation:
            'The passage identifies "substantial energy consumption" as "the most pressing concern".',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 9,
          question_type: 'mcq_single' as const,
          question_text:
            'How much venture capital did the vertical farming industry attract in 2021?',
          options: [
            'A. Over $1 billion',
            'B. Over $1.8 billion',
            'C. Over $10 billion',
            'D. Over $20 billion',
          ],
          correct_answer: 'B',
          explanation:
            'The passage states "In 2021 alone, the industry attracted over $1.8 billion in venture capital funding".',
          points: 1,
        },
        // Questions 10-13: Gap Fill / Summary Completion
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 10,
          question_type: 'summary_completion' as const,
          question_text:
            'Vertical farms recirculate nutrient-rich solutions through closed-loop _______ or aeroponic systems.',
          correct_answer: 'hydroponic',
          explanation:
            'The passage mentions "closed-loop hydroponic or aeroponic systems".',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 11,
          question_type: 'summary_completion' as const,
          question_text:
            'Crops such as leafy greens, herbs, and _______ are well-suited to vertical farming environments.',
          correct_answer: 'strawberries',
          explanation:
            'The passage lists "leafy greens, herbs, and strawberries" as suitable crops.',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 12,
          question_type: 'summary_completion' as const,
          question_text:
            'The global population is expected to reach _______ billion by 2050.',
          correct_answer: '9.7',
          explanation:
            'The passage states "an estimated 9.7 billion by 2050".',
          points: 1,
        },
        {
          module_type: 'reading' as const,
          reading_passage: passage.id,
          question_number: 13,
          question_type: 'summary_completion' as const,
          question_text:
            'By 2030, the vertical farming market could be worth over $_______ billion.',
          correct_answer: '20',
          explanation:
            'The passage states "the global vertical farming market could be worth over $20 billion".',
          points: 1,
        },
      ];

      for (const q of questions) {
        await strapi.query('api::question.question').create({ data: q });
      }

      console.log(
        '✅ Seed data created: 1 test, 1 reading passage, 13 questions'
      );
    }
  },
};
