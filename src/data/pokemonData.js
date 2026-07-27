// Pokémon TCG Pocket Card Catalog, Meta Deck Blueprints & Substitution Mappings

export const ENERGY_TYPES = {
  ELECTRIC: { name: 'Electric', color: '#fadb14', bg: '#2a2400', border: '#e8b300' },
  FIRE: { name: 'Fire', color: '#ff4d4f', bg: '#2a090a', border: '#d32f2f' },
  WATER: { name: 'Water', color: '#1890ff', bg: '#061d33', border: '#0288d1' },
  GRASS: { name: 'Grass', color: '#52c41a', bg: '#0c2605', border: '#388e3c' },
  PSYCHIC: { name: 'Psychic', color: '#b37feb', bg: '#220738', border: '#7b1fa2' },
  FIGHTING: { name: 'Fighting', color: '#fa8c16', bg: '#2b1400', border: '#e65100' },
  DARKNESS: { name: 'Darkness', color: '#9254de', bg: '#1c0b2b', border: '#4a148c' },
  METAL: { name: 'Metal', color: '#8c8c8c', bg: '#181b1f', border: '#616161' },
  DRAGON: { name: 'Dragon', color: '#e6a23c', bg: '#2b2005', border: '#b8860b' },
  COLORLESS: { name: 'Colorless', color: '#d9d9d9', bg: '#1f1f1f', border: '#9e9e9e' },
  TRAINER: { name: 'Trainer', color: '#13c2c2', bg: '#042224', border: '#00838f' }
};

export const RARITIES = {
  DIAMOND_1: { label: '1-Diamond', cost: 35, icon: '◆' },
  DIAMOND_2: { label: '2-Diamond', cost: 70, icon: '◆◆' },
  DIAMOND_3: { label: '3-Diamond', cost: 150, icon: '◆◆◆' },
  DIAMOND_4_EX: { label: '4-Diamond ex', cost: 500, icon: '◆◆◆◆' },
  STAR_1: { label: '1-Star', cost: 400, icon: '★' },
  STAR_2: { label: '2-Star', cost: 1250, icon: '★★' },
  STAR_3: { label: '3-Star', cost: 1500, icon: '★★★' },
  CROWN: { label: 'Crown', cost: 2500, icon: '👑' }
};

// Global TCGP Cards Dictionary with exact TCGdex Set & Local IDs
export const CARDS = [
  // Electric Types
  {
    id: 101,
    setId: 'A1',
    localId: '096',
    name: 'Pikachu ex',
    type: 'Electric',
    stage: 'Basic',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 120,
    attack: 'Circle Circuit (90+)',
    isCoreMetaPiece: true,
    description: 'Deals 30 damage for each Electric Pokémon on your Bench.',
    artBg: 'linear-gradient(135deg, #ffe58f 0%, #faad14 100%)',
    artEmoji: '⚡🐁'
  },
  {
    id: 102,
    setId: 'A1',
    localId: '104',
    name: 'Zapdos ex',
    type: 'Electric',
    stage: 'Basic',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 130,
    attack: 'Thundersnipe (50) / Hurricane (100)',
    isCoreMetaPiece: true,
    description: 'Target opponent Benched or Active Pokémon with high speed.',
    artBg: 'linear-gradient(135deg, #fff1b8 0%, #d48806 100%)',
    artEmoji: '⚡🦅'
  },
  {
    id: 103,
    setId: 'A1',
    localId: '105',
    name: 'Blitzle',
    type: 'Electric',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Rear Kick (20)',
    isCoreMetaPiece: false,
    description: 'Fast basic attacker for early energy setup.',
    artBg: 'linear-gradient(135deg, #fffbe6 0%, #fadb14 100%)',
    artEmoji: '⚡🦓'
  },
  {
    id: 104,
    setId: 'A1',
    localId: '106',
    name: 'Zebstrika',
    type: 'Electric',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Thunderbolt (80)',
    isCoreMetaPiece: false,
    description: 'Snipes bench targets for 30 damage, great budget attacker.',
    artBg: 'linear-gradient(135deg, #fffbe6 0%, #d4b106 100%)',
    artEmoji: '⚡🐎'
  },
  {
    id: 105,
    setId: 'A1',
    localId: '095',
    name: 'Raichu',
    type: 'Electric',
    stage: 'Stage 1',
    rarity: '3-Diamond',
    craftingCost: 150,
    hp: 100,
    attack: 'Thunder (140)',
    isCoreMetaPiece: false,
    description: 'High burst damage finisher.',
    artBg: 'linear-gradient(135deg, #ffe58f 0%, #fa8c16 100%)',
    artEmoji: '⚡⚡'
  },

  // Psychic Types
  {
    id: 201,
    setId: 'A1',
    localId: '129',
    name: 'Mewtwo ex',
    type: 'Psychic',
    stage: 'Basic',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 150,
    attack: 'Psystrike (150)',
    isCoreMetaPiece: true,
    description: 'Premier tier-1 psychic anchor. Discards 2 Energy to deal massive 150 damage.',
    artBg: 'linear-gradient(135deg, #efdbff 0%, #722ed1 100%)',
    artEmoji: '👁️🧠'
  },
  {
    id: 202,
    setId: 'A1',
    localId: '132',
    name: 'Gardevoir',
    type: 'Psychic',
    stage: 'Stage 2',
    rarity: '3-Diamond',
    craftingCost: 150,
    hp: 110,
    attack: 'Psy Shadow (Ability)',
    isCoreMetaPiece: true,
    description: 'Ability: Attach 1 Psychic Energy from energy zone to Active Psychic Pokémon each turn.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #9254de 100%)',
    artEmoji: '👁️💃'
  },
  {
    id: 203,
    setId: 'A1',
    localId: '130',
    name: 'Ralts',
    type: 'Psychic',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Teleportation (10)',
    isCoreMetaPiece: false,
    description: 'Evolves into Kirlia.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #b37feb 100%)',
    artEmoji: '👁️🌱'
  },
  {
    id: 204,
    setId: 'A1',
    localId: '131',
    name: 'Kirlia',
    type: 'Psychic',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 80,
    attack: 'Slap (30)',
    isCoreMetaPiece: false,
    description: 'Evolves into Gardevoir.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #9254de 100%)',
    artEmoji: '👁️🩰'
  },
  {
    id: 205,
    setId: 'A1',
    localId: '127',
    name: 'Jynx',
    type: 'Psychic',
    stage: 'Basic',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 80,
    attack: 'Psychic (60)',
    isCoreMetaPiece: false,
    description: 'Solid budget psychic attacker while powering up Mewtwo.',
    artBg: 'linear-gradient(135deg, #ffd6e7 0%, #c41d7f 100%)',
    artEmoji: '👁️💄'
  },

  // Fire Types
  {
    id: 301,
    setId: 'A1',
    localId: '036',
    name: 'Charizard ex',
    type: 'Fire',
    stage: 'Stage 2',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 180,
    attack: 'Crimson Storm (200)',
    isCoreMetaPiece: true,
    description: 'Highest single-hit damage in the game (200 HP knockout).',
    artBg: 'linear-gradient(135deg, #ffccc7 0%, #ff4d4f 100%)',
    artEmoji: '🔥🐉'
  },
  {
    id: 302,
    setId: 'A1',
    localId: '047',
    name: 'Moltres ex',
    type: 'Fire',
    stage: 'Basic',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 140,
    attack: 'Infernal Dance',
    isCoreMetaPiece: true,
    description: 'Flips 3 coins. For each heads, attach 1 Fire Energy to benched Fire Pokémon.',
    artBg: 'linear-gradient(135deg, #ffe7ba 0%, #fa541c 100%)',
    artEmoji: '🔥🦅'
  },
  {
    id: 303,
    setId: 'A1',
    localId: '033',
    name: 'Charmander',
    type: 'Fire',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Ember (30)',
    isCoreMetaPiece: false,
    description: 'Basic fire starter.',
    artBg: 'linear-gradient(135deg, #fff2e8 0%, #ff7a45 100%)',
    artEmoji: '🔥🦎'
  },
  {
    id: 304,
    setId: 'A1',
    localId: '034',
    name: 'Charmeleon',
    type: 'Fire',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Flamethrower (60)',
    isCoreMetaPiece: false,
    description: 'Mid evolution stage.',
    artBg: 'linear-gradient(135deg, #ffd8bf 0%, #f5222d 100%)',
    artEmoji: '🔥🦖'
  },
  {
    id: 305,
    setId: 'A1',
    localId: '043',
    name: 'Rapidash',
    type: 'Fire',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Fire Mane (40)',
    isCoreMetaPiece: false,
    description: 'Zero retreat cost swift fire pivot.',
    artBg: 'linear-gradient(135deg, #ffe7ba 0%, #fa8c16 100%)',
    artEmoji: '🔥🦄'
  },

  // Water Types
  {
    id: 401,
    setId: 'A1',
    localId: '076',
    name: 'Starmie ex',
    type: 'Water',
    stage: 'Stage 1',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 130,
    attack: 'Hydro Splash (90)',
    isCoreMetaPiece: true,
    description: 'Free retreat cost! High speed 2-energy 90 damage sweeper.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #1890ff 100%)',
    artEmoji: '💧⭐'
  },
  {
    id: 402,
    setId: 'A1',
    localId: '074',
    name: 'Staryu',
    type: 'Water',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 50,
    attack: 'Water Gun (20)',
    isCoreMetaPiece: false,
    description: 'Evolves into Starmie ex.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #69c0ff 100%)',
    artEmoji: '💧✨'
  },
  {
    id: 403,
    setId: 'A1',
    localId: '084',
    name: 'Articuno ex',
    type: 'Water',
    stage: 'Basic',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 140,
    attack: 'Blizzard (80)',
    isCoreMetaPiece: true,
    description: 'Spread 10 damage to all opponent benched Pokémon.',
    artBg: 'linear-gradient(135deg, #bae7ff 0%, #096dd9 100%)',
    artEmoji: '💧🧊'
  },
  {
    id: 404,
    setId: 'A1',
    localId: '056',
    name: 'Blastoise ex',
    type: 'Water',
    stage: 'Stage 2',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 180,
    attack: 'Hydro Bazooka (140)',
    isCoreMetaPiece: true,
    description: 'Heavy water tank with massive shell power.',
    artBg: 'linear-gradient(135deg, #91caff 0%, #003eb3 100%)',
    artEmoji: '💧🐢'
  },
  {
    id: 405,
    setId: 'A1',
    localId: '053',
    name: 'Squirtle',
    type: 'Water',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Bubble (20)',
    isCoreMetaPiece: false,
    description: 'Evolves into Wartortle.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #40a9ff 100%)',
    artEmoji: '💧🐢'
  },

  // Grass Types
  {
    id: 501,
    setId: 'A1',
    localId: '004',
    name: 'Venusaur ex',
    type: 'Grass',
    stage: 'Stage 2',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 190,
    attack: 'Giant Bloom (100)',
    isCoreMetaPiece: true,
    description: 'Heals 30 damage every attack. Highest HP tank in TCGP.',
    artBg: 'linear-gradient(135deg, #f6ffed 0%, #52c41a 100%)',
    artEmoji: '🌿🌺'
  },
  {
    id: 502,
    setId: 'A1',
    localId: '001',
    name: 'Bulbasaur',
    type: 'Grass',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 70,
    attack: 'Vine Whip (30)',
    isCoreMetaPiece: false,
    description: 'High HP basic grass starter.',
    artBg: 'linear-gradient(135deg, #f6ffed 0%, #73d13d 100%)',
    artEmoji: '🌿🌱'
  },
  {
    id: 503,
    setId: 'A1',
    localId: '002',
    name: 'Ivysaur',
    type: 'Grass',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Razor Leaf (60)',
    isCoreMetaPiece: false,
    description: 'Mid grass stage.',
    artBg: 'linear-gradient(135deg, #d9f7be 0%, #389e0d 100%)',
    artEmoji: '🌿🍃'
  },
  {
    id: 504,
    setId: 'A1',
    localId: '026',
    name: 'Pinsir',
    type: 'Grass',
    stage: 'Basic',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Vise Grip (50)',
    isCoreMetaPiece: false,
    description: 'Solid basic grass attacker requiring no evolution.',
    artBg: 'linear-gradient(135deg, #eaff8f 0%, #7cb305 100%)',
    artEmoji: '🌿🪲'
  },

  // Fighting & Darkness & Dragon
  {
    id: 601,
    setId: 'A1',
    localId: '153',
    name: 'Marowak ex',
    type: 'Fighting',
    stage: 'Stage 1',
    rarity: '4-Diamond ex',
    craftingCost: 500,
    hp: 140,
    attack: 'Bonemerang (160 max)',
    isCoreMetaPiece: true,
    description: 'Flips 2 coins. Deals 80 damage for each heads (potential 160 burst).',
    artBg: 'linear-gradient(135deg, #fff7e6 0%, #fa8c16 100%)',
    artEmoji: '👊🦴'
  },
  {
    id: 602,
    setId: 'A1',
    localId: '151',
    name: 'Cubone',
    type: 'Fighting',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Headbutt (20)',
    isCoreMetaPiece: false,
    description: 'Evolves into Marowak ex.',
    artBg: 'linear-gradient(135deg, #fff7e6 0%, #ffa940 100%)',
    artEmoji: '👊💀'
  },
  {
    id: 603,
    setId: 'A1',
    localId: '177',
    name: 'Weezing',
    type: 'Darkness',
    stage: 'Stage 1',
    rarity: '3-Diamond',
    craftingCost: 150,
    hp: 110,
    attack: 'Gas Leak (Ability)',
    isCoreMetaPiece: true,
    description: 'Ability: Poisons opponent Active Pokémon every turn when in Active spot.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #531dab 100%)',
    artEmoji: '🌙💨'
  },
  {
    id: 604,
    setId: 'A1',
    localId: '176',
    name: 'Koffing',
    type: 'Darkness',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Smog (20)',
    isCoreMetaPiece: false,
    description: 'Evolves into Weezing.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #9254de 100%)',
    artEmoji: '🌙💣'
  },
  {
    id: 701,
    setId: 'A1',
    localId: '185',
    name: 'Dragonite',
    type: 'Dragon',
    stage: 'Stage 2',
    rarity: '3-Diamond',
    craftingCost: 150,
    hp: 160,
    attack: 'Draco Meteor (200 distributed)',
    isCoreMetaPiece: true,
    description: 'Deals 50 damage 4 times randomly to opponent Pokémon.',
    artBg: 'linear-gradient(135deg, #fffbe6 0%, #d48806 100%)',
    artEmoji: '🐲💫'
  },
  {
    id: 702,
    setId: 'A1',
    localId: '183',
    name: 'Dratini',
    type: 'Dragon',
    stage: 'Basic',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 60,
    attack: 'Tail Whip (20)',
    isCoreMetaPiece: false,
    description: 'Evolves into Dragonair.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #1890ff 100%)',
    artEmoji: '🐲🐍'
  },
  {
    id: 703,
    setId: 'A1',
    localId: '184',
    name: 'Dragonair',
    type: 'Dragon',
    stage: 'Stage 1',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 90,
    attack: 'Slam (60)',
    isCoreMetaPiece: false,
    description: 'Evolves into Dragonite.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #096dd9 100%)',
    artEmoji: '🐲🌊'
  },

  // Core Trainer Utility Cards
  {
    id: 901,
    setId: 'A1',
    localId: '223',
    name: "Professor's Research",
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: 'Draw 2 cards',
    isCoreMetaPiece: true,
    description: 'Essential draw supporter present in 99% of meta decks.',
    artBg: 'linear-gradient(135deg, #e6fffb 0%, #13c2c2 100%)',
    artEmoji: '🎒📜'
  },
  {
    id: 902,
    setId: 'A1',
    localId: '216',
    name: 'Poké Ball',
    type: 'Trainer',
    stage: 'Item',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 0,
    attack: 'Search Basic Pokémon',
    isCoreMetaPiece: true,
    description: 'Put 1 random Basic Pokémon from your deck into your hand.',
    artBg: 'linear-gradient(135deg, #e6fffb 0%, #08979c 100%)',
    artEmoji: '🎒🔴'
  },
  {
    id: 903,
    setId: 'A1',
    localId: '225',
    name: 'Sabrina',
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: 'Force Switch',
    isCoreMetaPiece: true,
    description: 'Switch opponent active Pokémon with one of their benched Pokémon.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #722ed1 100%)',
    artEmoji: '🎒🔮'
  },
  {
    id: 904,
    setId: 'A1',
    localId: '220',
    name: 'Misty',
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: 'Water Energy Acceleration',
    isCoreMetaPiece: true,
    description: 'Flip coins until tails. Attach 1 Water Energy for each heads to a Water Pokémon.',
    artBg: 'linear-gradient(135deg, #e6f7ff 0%, #1890ff 100%)',
    artEmoji: '🎒💧'
  },
  {
    id: 905,
    setId: 'A1',
    localId: '219',
    name: 'Erika',
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: 'Heal 50 Grass HP',
    isCoreMetaPiece: true,
    description: 'Heal 50 damage from all your Grass Pokémon.',
    artBg: 'linear-gradient(135deg, #f6ffed 0%, #52c41a 100%)',
    artEmoji: '🎒🌿'
  },
  {
    id: 906,
    setId: 'A1',
    localId: '223',
    name: 'Giovanni',
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: '+10 Damage Boost',
    isCoreMetaPiece: false,
    description: 'Attacks deal +10 damage to active Pokémon this turn.',
    artBg: 'linear-gradient(135deg, #fff0f6 0%, #eb2f96 100%)',
    artEmoji: '🎒🕶️'
  },
  {
    id: 907,
    setId: 'A1',
    localId: '218',
    name: 'X Speed',
    type: 'Trainer',
    stage: 'Item',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 0,
    attack: '-1 Retreat Cost',
    isCoreMetaPiece: false,
    description: 'Active Pokémon retreat cost is 1 less during this turn.',
    artBg: 'linear-gradient(135deg, #e6fffb 0%, #36cfc9 100%)',
    artEmoji: '🎒⚡'
  },
  {
    id: 908,
    setId: 'A1',
    localId: '217',
    name: 'Red Card',
    type: 'Trainer',
    stage: 'Item',
    rarity: '1-Diamond',
    craftingCost: 35,
    hp: 0,
    attack: 'Hand Disruption',
    isCoreMetaPiece: false,
    description: 'Opponent shuffles their hand into deck and draws 3 cards.',
    artBg: 'linear-gradient(135deg, #fff1f0 0%, #f5222d 100%)',
    artEmoji: '🎒🟥'
  },
  {
    id: 909,
    setId: 'A1',
    localId: '222',
    name: 'Koga',
    type: 'Trainer',
    stage: 'Supporter',
    rarity: '2-Diamond',
    craftingCost: 70,
    hp: 0,
    attack: 'Return Weezing to Hand',
    isCoreMetaPiece: false,
    description: 'Return your Active Weezing or Muk and all cards attached to hand.',
    artBg: 'linear-gradient(135deg, #f9f0ff 0%, #391085 100%)',
    artEmoji: '🎒🥷'
  }
];

// Map lookup helper for quick O(1) card access
export const CARDS_BY_ID = CARDS.reduce((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {});

// Active Meta Decks Blueprints (20-Card TCGP Format)
export const META_DECKS = [
  {
    id: 1,
    deck_name: 'Pikachu ex Aggro',
    tier: 'Tier 1',
    energyType: 'Electric',
    description: 'Fastest turn-2 burst deck in TCGP. Utilizes Pikachu ex Circle Circuit with full Electric bench.',
    deck_list: [
      { card_id: 101, qty: 2 }, // Pikachu ex
      { card_id: 102, qty: 2 }, // Zapdos ex
      { card_id: 103, qty: 2 }, // Blitzle
      { card_id: 104, qty: 2 }, // Zebstrika
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 906, qty: 2 }, // Giovanni
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 2,
    deck_name: 'Mewtwo ex / Gardevoir',
    tier: 'Tier 1',
    energyType: 'Psychic',
    description: 'Dominant control deck. Gardevoir Psy Shadow ability fuels 150 HP Psystrikes every single turn.',
    deck_list: [
      { card_id: 201, qty: 2 }, // Mewtwo ex
      { card_id: 203, qty: 2 }, // Ralts
      { card_id: 204, qty: 2 }, // Kirlia
      { card_id: 202, qty: 2 }, // Gardevoir
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 906, qty: 2 }, // Giovanni
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 3,
    deck_name: 'Starmie ex / Articuno ex',
    tier: 'Tier 1',
    energyType: 'Water',
    description: 'Explosive water tempo deck. Misty energy coin flips can enable turn-1 Blizzard or Hydro Splash.',
    deck_list: [
      { card_id: 401, qty: 2 }, // Starmie ex
      { card_id: 402, qty: 2 }, // Staryu
      { card_id: 403, qty: 2 }, // Articuno ex
      { card_id: 904, qty: 2 }, // Misty
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 906, qty: 2 }, // Giovanni
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 4,
    deck_name: 'Charizard ex / Moltres ex',
    tier: 'Tier 1',
    energyType: 'Fire',
    description: 'High-ceiling nuke deck. Moltres ex powers up Charizard ex on bench to deliver 200 damage finish.',
    deck_list: [
      { card_id: 301, qty: 2 }, // Charizard ex
      { card_id: 303, qty: 2 }, // Charmander
      { card_id: 304, qty: 2 }, // Charmeleon
      { card_id: 302, qty: 2 }, // Moltres ex
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 906, qty: 2 }, // Giovanni
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 5,
    deck_name: 'Venusaur ex Tank',
    tier: 'Tier 2',
    energyType: 'Grass',
    description: 'Unkillable tank deck. 190 HP combined with Giant Bloom heal & Erika supporter recovery.',
    deck_list: [
      { card_id: 501, qty: 2 }, // Venusaur ex
      { card_id: 502, qty: 2 }, // Bulbasaur
      { card_id: 503, qty: 2 }, // Ivysaur
      { card_id: 504, qty: 2 }, // Pinsir
      { card_id: 905, qty: 2 }, // Erika
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 6,
    deck_name: 'Marowak ex / Weezing Toxic',
    tier: 'Tier 2',
    energyType: 'Fighting',
    description: 'Disruptive poison pressure. Weezing inflicts poison every turn while Marowak ex threatens 160 burst.',
    deck_list: [
      { card_id: 601, qty: 2 }, // Marowak ex
      { card_id: 602, qty: 2 }, // Cubone
      { card_id: 603, qty: 2 }, // Weezing
      { card_id: 604, qty: 2 }, // Koffing
      { card_id: 909, qty: 2 }, // Koga
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  },
  {
    id: 7,
    deck_name: 'Dragonite Tempo Rain',
    tier: 'Rogue',
    energyType: 'Dragon',
    description: 'High-variance late-game rainmaker. Draco Meteor deals 200 random damage across opponent bench.',
    deck_list: [
      { card_id: 701, qty: 2 }, // Dragonite
      { card_id: 702, qty: 2 }, // Dratini
      { card_id: 703, qty: 2 }, // Dragonair
      { card_id: 403, qty: 2 }, // Articuno ex
      { card_id: 904, qty: 2 }, // Misty
      { card_id: 901, qty: 2 }, // Prof Research
      { card_id: 902, qty: 2 }, // Poké Ball
      { card_id: 903, qty: 2 }, // Sabrina
      { card_id: 907, qty: 2 }, // X Speed
      { card_id: 908, qty: 2 }  // Red Card
    ]
  }
];

// Card Substitutions Table (Lookup for missing core cards)
export const CARD_SUBSTITUTIONS = [
  {
    missing_card_id: 102, // Zapdos ex
    replacement_card_id: 104, // Zebstrika
    priority: 1,
    reason: 'Budget Electric sniper with 80 burst damage to pressure early game.'
  },
  {
    missing_card_id: 101, // Pikachu ex
    replacement_card_id: 105, // Raichu
    priority: 2,
    reason: 'High damage 140 thunder finisher while grinding for Pikachu ex.'
  },
  {
    missing_card_id: 201, // Mewtwo ex
    replacement_card_id: 205, // Jynx
    priority: 1,
    reason: 'Non-ex Psychic attacker that hits for 60 damage without risking 2 points.'
  },
  {
    missing_card_id: 302, // Moltres ex
    replacement_card_id: 305, // Rapidash
    priority: 1,
    reason: 'Free retreat fire pivot to cycle active spot while manual energy attaching.'
  },
  {
    missing_card_id: 401, // Starmie ex
    replacement_card_id: 404, // Blastoise ex
    priority: 2,
    reason: 'Heavy late-game water anchor with 140 Hydro Bazooka.'
  },
  {
    missing_card_id: 903, // Sabrina
    replacement_card_id: 908, // Red Card
    priority: 1,
    reason: 'Hand disruption alternative to force opponent out of key combos.'
  },
  {
    missing_card_id: 904, // Misty
    replacement_card_id: 907, // X Speed
    priority: 1,
    reason: 'Mobility item to preserve water energy on retreat.'
  }
];
