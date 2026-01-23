// Curated fun facts about Ngee Ann Polytechnic's history
export const NP_FUN_FACTS = [
  {
    fact: "NP was founded in 1963 as Ngee Ann College, originally offering courses in commerce and Chinese language!",
    year: "1963",
    category: "history",
  },
  {
    fact: "The campus moved to its current location in Clementi in 1998, spanning over 35 hectares of land!",
    year: "1998",
    category: "campus",
  },
  {
    fact: "NP's mascot 'Nelli' the elephant symbolizes wisdom, strength, and good fortune in Chinese culture.",
    year: "tradition",
    category: "culture",
  },
  {
    fact: "The Lien Ying Chow Library at NP was named after the founder of Overseas Union Bank and a key benefactor.",
    year: "heritage",
    category: "campus",
  },
  {
    fact: "NP was the first polytechnic in Singapore to offer a Diploma in Film, Sound & Video!",
    year: "innovation",
    category: "academics",
  },
  {
    fact: "The Block 53 building houses NP's Convention Centre, which can hold over 1,000 people!",
    year: "campus",
    category: "campus",
  },
  {
    fact: "NP started with just 116 students in 1963. Today, it has over 15,000 students!",
    year: "growth",
    category: "history",
  },
  {
    fact: "The School of Engineering at NP was the first in Singapore to offer a 3D printing lab for students.",
    year: "innovation",
    category: "academics",
  },
  {
    fact: "NP's graduates include MediaCorp celebrities, entrepreneurs, and even Olympic athletes!",
    year: "alumni",
    category: "culture",
  },
  {
    fact: "The rooftop garden at NP's eco-building generates its own electricity through solar panels!",
    year: "sustainability",
    category: "campus",
  },
  {
    fact: "NP's name 'Ngee Ann' comes from the Teochew clan association that founded it.",
    year: "1963",
    category: "history",
  },
  {
    fact: "The campus has 23 food stalls in the food courts, offering everything from local to international cuisine!",
    year: "campus",
    category: "culture",
  },
  {
    fact: "NP was the first polytechnic to establish an overseas campus in Suzhou, China in 1998!",
    year: "1998",
    category: "innovation",
  },
  {
    fact: "The annual NP Open House attracts over 30,000 visitors each year!",
    year: "tradition",
    category: "culture",
  },
  {
    fact: "NP's School of InfoComm Technology was one of the first to offer cybersecurity courses in Southeast Asia.",
    year: "innovation",
    category: "academics",
  },
  {
    fact: "The NP swimming pool is Olympic-sized and has hosted national swimming competitions!",
    year: "sports",
    category: "campus",
  },
  {
    fact: "NP's original motto was 'Advancing with Courage' before being updated to 'Passion • Purpose • Possibilities'.",
    year: "heritage",
    category: "culture",
  },
  {
    fact: "The NP Convention Centre has hosted major events including graduation ceremonies for over 50 years!",
    year: "tradition",
    category: "campus",
  },
];

export const getRandomFunFact = (excludeIndices: number[] = []): { fact: typeof NP_FUN_FACTS[0]; index: number } => {
  const availableIndices = NP_FUN_FACTS.map((_, i) => i).filter(i => !excludeIndices.includes(i));
  
  if (availableIndices.length === 0) {
    // Reset if all facts have been shown
    const randomIndex = Math.floor(Math.random() * NP_FUN_FACTS.length);
    return { fact: NP_FUN_FACTS[randomIndex], index: randomIndex };
  }
  
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return { fact: NP_FUN_FACTS[randomIndex], index: randomIndex };
};
