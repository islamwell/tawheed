// Dedicated standalone module for Allah Intro and Updated Situational Themes

export const ALLAH_INTRO = {
  id: 0,
  arabic: "اللَّٰه",
  transliteration: "Allāh",
  meaning: "The proper name of the One true God—the only One worthy of worship.",
  root: "أ-ل-ه (Alif-Lam-Ha)",
  rootMeaning: "Scholars have discussed its precise linguistic origin. It gathers the meanings of worship, love, veneration, awe, and complete, humble devotion directed to Him alone.",
  category: "The Name Allah",
  evidenceStatus: "Explicit in the Qur'an",
  evidence: {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ",
    translation: "Allah—there is no god worthy of worship except Him. He has the Most Beautiful Names.",
    reference: "Surah Ta-Ha 20:8"
  },
  revelationMeaning: "‘Allah’ is the proper name of the Lord of all creation. It expresses Tawhid—that none in the heavens or the earth possesses any share in His divinity, sovereignty, or right to unconditional obedience and love. All other Beautiful Names describe the sublime attributes and actions of Allah. Calling upon Him by this Name brings together every feeling of reverence, hope, fear, and reliance.",
  quranicReflection: "In the Qur'an, the Name 'Allah' appears thousands of times as the ultimate foundation of faith. The root denotes the One who is worshipped with utmost love and reverence, towards whom hearts instinctively turn in times of desperate need and profound gratitude. True peace enters the soul when it submits to Him entirely.",
  response: "Devote your heart, intentions, and worship exclusively to Allah. Rid your heart of hidden reliance upon creation, and turn to Him in ease and hardship with total sincerity and humble prayer.",
  heroSummary: "The proper name of the Lord of all creation, gathering all attributes of majesty, mercy, and absolute divinity.",
  authenticDua: {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ لَا إِلَٰهَ إِلَّا أَنْتَ الْمَنَّانُ بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ يَا حَيُّ يَا قَيُّومُ",
    translation: "O Allah, I ask You by virtue of all praise belonging to You; there is no deity worthy of worship except You, the Bestower, Originator of the heavens and the earth, O Possessor of Majesty and Honor, O Ever-Living, O Self-Sustaining Upholder.",
    reference: "Sunan Abi Dawud 1495, Sahih"
  },
  suggestedDua: null,
  natureImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
  moodTags: ["peace", "purpose", "gratitude", "anxiety", "hope"]
};

export const UPDATED_SITUATIONAL_THEMES = [
  {
    id: "anxiety",
    title: "Anxiety, Stress & Restlessness",
    icon: "🕊️",
    description: "When the chest feels tight and the future feels uncertain",
    primaryNameIds: [0, 5, 6, 7, 52],
    recommendation: "Turn to Allah with hope and reliance. Remember that all safety and peace come from Him. Recite the established words of reliance ('Hasbunallahu wa Ni'mal Wakil') and ask Him to steady your heart."
  },
  {
    id: "grief",
    title: "Broken Heart, Grief & Sadness",
    icon: "💔",
    description: "When dealing with heartbreak, disappointment, or the ache of loss",
    primaryNameIds: [1, 2, 9, 47, 96],
    recommendation: "Allah understands the grief that others cannot see. Ask Him for mercy, restoration and a heart that remains connected to Him through loss."
  },
  {
    id: "forgiveness",
    title: "Guilt & Seeking Forgiveness",
    icon: "🌧️",
    description: "When carrying the heavy weight of regret and past mistakes",
    primaryNameIds: [14, 34, 80, 82, 32],
    recommendation: "Never despair of Allah's mercy. Call upon Al-Ghaffar who repeatedly forgives, Al-Ghafur whose forgiveness is vast, At-Tawwab who accepts repentance and enables your return, and Al-'Afuww who pardons and erases sins."
  },
  {
    id: "financial",
    title: "Financial Need, Career & Sustenance",
    icon: "🌱",
    description: "When bills mount, opportunities seem dry, or career feels stuck",
    primaryNameIds: [16, 17, 18, 88, 89],
    recommendation: "Employers, customers and opportunities are worldly means; Allah alone is the True Provider (Ar-Razzaq). Seek lawful provision with diligence, work responsibly, and ask Him to place barakah in what He provides."
  },
  {
    id: "decision",
    title: "Confusion, Indecision & Seeking Guidance",
    icon: "🧭",
    description: "When standing at a crossroads and unsure which path to choose",
    primaryNameIds: [18, 19, 46, 93, 94, 98],
    recommendation: "Perform Salat al-Istikharah and consult those with sound knowledge. Call upon Al-Hadi for spiritual direction and Al-Hakim for wisdom, asking Allah to grant you clarity and steadfastness in what pleases Him."
  },
  {
    id: "injustice",
    title: "Facing Injustice, Slander or Tyranny",
    icon: "⚖️",
    description: "When oppressed, falsely accused, or powerless before cruel forces",
    primaryNameIds: [3, 8, 15, 28, 29, 81],
    recommendation: "Allah is never unaware of wrongdoing. Place your grievance before Al-Hakam and Al-Adl. Ask Him for protection and justice, avoid becoming unjust yourself, and pursue lawful means of rectifying harm."
  },
  {
    id: "gratitude",
    title: "Gratitude, Joy & Wonder",
    icon: "✨",
    description: "When feeling overwhelmed by blessings and wanting to express deep praise",
    primaryNameIds: [0, 4, 35, 41, 56, 85],
    recommendation: "Praise Al-Hamid and express deep gratitude to Ash-Shakur. Allah states: 'If you are grateful, I will surely increase you [in favor]' (Ibrahim 14:7). Show your gratitude through obedience, humble prayer, and sharing your blessings with others."
  }
];
