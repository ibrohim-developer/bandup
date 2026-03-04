export const TEST_CONFIG = {
  listening: {
    totalTime: 30 * 60, // 30 minutes in seconds
    totalQuestions: 40,
    sectionsCount: 4,
    questionsPerSection: [10, 10, 10, 10],
    allowReplay: false,
  },
  reading: {
    totalTime: 60 * 60, // 60 minutes in seconds
    totalQuestions: 40,
    passagesCount: 3,
    questionsPerPassage: [13, 13, 14],
  },
  writing: {
    totalTime: 60 * 60, // 60 minutes in seconds
    task1: {
      minWords: 150,
      recommendedTime: 20 * 60,
    },
    task2: {
      minWords: 250,
      recommendedTime: 40 * 60,
    },
  },
} as const

export const BAND_SCORE_MAP: Record<number, number> = {
  40: 9.0, 39: 9.0,
  38: 8.5, 37: 8.5,
  36: 8.0, 35: 8.0,
  34: 7.5, 33: 7.5, 32: 7.5,
  31: 7.0, 30: 7.0,
  29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5,
  25: 6.0, 24: 6.0, 23: 6.0,
  22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
  17: 5.0, 16: 5.0,
  15: 4.5, 14: 4.5, 13: 4.5,
  12: 4.0, 11: 4.0, 10: 4.0,
}

export const BAND_DESCRIPTORS: Record<number, string> = {
  9: 'Expert user',
  8.5: 'Very good user',
  8: 'Very good user',
  7.5: 'Good user',
  7: 'Good user',
  6.5: 'Competent user',
  6: 'Competent user',
  5.5: 'Modest user',
  5: 'Modest user',
  4.5: 'Limited user',
  4: 'Limited user',
  3.5: 'Extremely limited user',
  3: 'Extremely limited user',
}

export function calculateBandScore(rawScore: number): number {
  return BAND_SCORE_MAP[rawScore] ?? (rawScore < 10 ? 3.5 : 3.0)
}
