export interface Examiner {
  id: string;
  name: string;
  image: string;
  ieltsOverall: number;
  speakingScore: number;
  bio: string;
  experience: string;
  specialties: string[];
}

export const examiners: Examiner[] = [
  {
    id: "examiner-1",
    name: "Sarah Johnson",
    image: "/images/examiners/sarah.jpg",
    ieltsOverall: 9.0,
    speakingScore: 9.0,
    bio: "Former British Council examiner with 10+ years of experience in IELTS preparation.",
    experience: "10+ years",
    specialties: ["Academic IELTS", "Interview Preparation"],
  },
  {
    id: "examiner-2",
    name: "David Chen",
    image: "/images/examiners/david.jpg",
    ieltsOverall: 8.5,
    speakingScore: 9.0,
    bio: "Certified IELTS trainer specializing in speaking fluency and pronunciation.",
    experience: "8 years",
    specialties: ["Pronunciation", "Fluency Training"],
  },
  {
    id: "examiner-3",
    name: "Emma Williams",
    image: "/images/examiners/emma.jpg",
    ieltsOverall: 9.0,
    speakingScore: 8.5,
    bio: "English language specialist with extensive experience in exam coaching.",
    experience: "12 years",
    specialties: ["General Training", "Academic IELTS"],
  },
  {
    id: "examiner-4",
    name: "James Parker",
    image: "/images/examiners/james.jpg",
    ieltsOverall: 8.5,
    speakingScore: 8.5,
    bio: "Experienced IELTS coach focused on helping students achieve band 7+.",
    experience: "6 years",
    specialties: ["Band 7+ Strategy", "Speaking Part 2 & 3"],
  },
];
