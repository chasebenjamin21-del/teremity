// Every game word gets one plain sentence. `also` lists other spellings that should link to the same entry.
// `more` is an optional second sentence shown when the card is opened.
export const GLOSSARY = [
  // The basics
  { t: 'Runes', g: 'basics', d: 'The game\'s money and experience in one. You spend them to level up and to buy things.', more: 'When you die you drop them all where you fell. Touch your bloodstain to get them back, but die again first and they are gone.' },
  { t: 'Site of Grace', also: ['Grace', 'graces', 'Sites of Grace'], g: 'basics', d: 'The golden checkpoints. Resting at one refills your flasks, lets you level up, and lets you fast travel to any other grace you have touched.', more: 'Resting also brings most enemies back to life.' },
  { t: 'Guidance of Grace', also: ['golden line'], g: 'basics', d: 'The faint golden beams that point toward the main path from a Site of Grace.' },
  { t: 'Torrent', g: 'basics', d: 'The spectral horse. He can double-jump, and he can launch high into the air from a spiritspring.' },
  { t: 'Spiritspring', also: ['spiritsprings'], g: 'basics', d: 'A swirling column of wind. Ride Torrent into it to launch high into the air, often to reach a cliff top.' },
  { t: 'Map Fragment', also: ['map fragments'], g: 'basics', d: 'Found on stone pillars marked with an obelisk icon. Picking one up fills in that part of the map.' },
  { t: 'Stakes of Marika', g: 'basics', d: 'Little glowing stakes near boss rooms. If you die nearby, you can respawn at the stake instead of the last grace.' },
  { t: 'Roundtable Hold', g: 'basics', d: 'The hub you fast travel to: the blacksmith, Enia, the Twin Maiden Husks and the spirit tuner are all there.' },
  { t: 'Bloodstain', g: 'basics', d: 'Where you died. Touch it to pick your lost runes back up.' },
  { t: 'Tarnished', g: 'basics', d: "What the game calls you: an exile called back to the Lands Between to become its ruler." },

  // Healing and flasks
  { t: 'Flask of Crimson Tears', also: ['red flask', 'Crimson flask', 'Crimson Tears'], g: 'flasks', d: 'Your healing potion. It refills every time you rest at a grace.' },
  { t: 'Flask of Cerulean Tears', also: ['blue flask', 'Cerulean flask', 'Cerulean Tears'], g: 'flasks', d: 'Refills FP, the blue bar used for spells and weapon skills.', more: 'At a grace you choose how many charges go to red and how many to blue.' },
  { t: 'Golden Seed', also: ['Golden Seeds'], g: 'flasks', d: 'Adds one more charge to your flasks. Look for small glowing golden saplings.', more: 'Each upgrade costs more seeds than the last: 1, 1, 2, 2, 3, 3, 4, 4, 5, 5. Teremity has 8 charges, so the next one costs 3 seeds.' },
  { t: 'Sacred Tear', also: ['Sacred Tears'], g: 'flasks', d: 'Makes every flask charge heal more. Usually found in small churches.', more: 'There are 12 in the base game. Teremity is at +4, so 4 have been used.' },
  { t: 'Flask of Wondrous Physick', also: ['Physick', 'Wondrous Physick'], g: 'flasks', d: 'A third flask you fill with two Crystal Tears to get a custom buff for a fight.' },
  { t: 'Crystal Tear', also: ['Crystal Tears', 'Cracked Tear'], g: 'flasks', d: 'An ingredient for the Physick flask. Each one gives a different temporary effect, like more attack or a burst of healing.' },

  // Stats
  { t: 'Vigor', g: 'stats', d: 'Your health. The single most important stat for not dying.', more: 'Most players aim for 40 by mid-game and 50 to 60 by the end. Teremity has 35.' },
  { t: 'Mind', g: 'stats', d: 'Your FP, the blue bar used for spells and weapon skills.' },
  { t: 'Endurance', g: 'stats', d: 'Your stamina (the green bar) and how much gear weight you can carry before rolling gets slow.' },
  { t: 'Strength', g: 'stats', d: 'Damage with heavy weapons like greatswords and axes. Two-handing a weapon counts your Strength as 1.5 times higher.' },
  { t: 'Dexterity', also: ['Dex'], g: 'stats', d: 'Damage with fast weapons like katanas and daggers. The Godslayer\'s Greatsword needs 22.' },
  { t: 'Intelligence', also: ['Int'], g: 'stats', d: 'Powers sorceries cast from a staff.' },
  { t: 'Faith', g: 'stats', d: 'Powers incantations cast from a seal, plus fire and holy weapons.' },
  { t: 'Arcane', g: 'stats', d: 'Boosts bleed and other status effects, and item discovery (the chance of better drops).' },
  { t: 'FP', g: 'stats', d: 'The blue bar. Spells and weapon skills spend it.' },
  { t: 'Stamina', g: 'stats', d: 'The green bar. Attacking, rolling, blocking and sprinting all use it.' },
  { t: 'Equip Load', also: ['equip load', 'fat roll', 'fat rolling'], g: 'stats', d: 'How heavy your gear is. Stay under 70 percent for a normal roll; over that, rolling gets slow and clumsy.', more: 'Teremity is at 42.2 of 64.1, which is a medium load.' },
  { t: 'Scaling', also: ['scaling letters', 'attribute scaling'], g: 'stats', d: 'The letters next to a weapon\'s stats (S, A, B, C, D, E). They show how much extra damage that stat adds. S is best.' },
  { t: 'Soft cap', g: 'stats', d: 'The point where adding more points to a stat gives much smaller gains.' },

  // Combat
  { t: 'Poise', g: 'combat', d: 'How hard it is to knock you out of an attack. Heavy armor gives more.' },
  { t: 'Stance break', also: ['break their stance', 'stance', 'posture'], g: 'combat', d: 'Hit an enemy with enough heavy or charged attacks and it staggers, opening it up for a huge critical hit.' },
  { t: 'Critical hit', also: ['critical', 'riposte', 'crit'], g: 'combat', d: 'A big finishing stab you can do after a stance break, a parry or a backstab. Press attack when the enemy is staggered in front of you.' },
  { t: 'Guard counter', also: ['guard counters'], g: 'combat', d: 'Block an attack with a shield, then press heavy attack right after for a strong counter.' },
  { t: 'Parry', g: 'combat', d: 'A timed shield bash that deflects an attack and opens the enemy to a critical hit. Not every enemy can be parried.' },
  { t: 'Jump attack', also: ['jumping attack'], g: 'combat', d: 'Jump, then attack while in the air. Heavy jump attacks, especially two-handed, are great for breaking stance.' },
  { t: 'Charged attack', also: ['charged heavy'], g: 'combat', d: 'Hold the heavy attack button to wind up a stronger hit.' },
  { t: 'Two-handing', also: ['two-hand', 'two-handed', 'two hand'], g: 'combat', d: 'Holding one weapon with both hands. More damage, and your Strength counts as 1.5 times higher for requirements.' },
  { t: 'Weapon skill', also: ['Ash of War skill', 'weapon skills'], g: 'combat', d: 'The special move on a weapon, used with the skill button. It costs FP.' },
  { t: 'Spirit Ashes', also: ['spirit ash', 'Spirit Ash', 'summon', 'summons'], g: 'combat', d: 'Spirit allies you summon with the Spirit Calling Bell near a stake-marked area, usually in boss fights.', more: 'Upgrade them with Roderika at the Roundtable using Glovewort.' },
  { t: 'Spirit Calling Bell', g: 'combat', d: 'The bell that summons Spirit Ashes. It only works where the summon icon appears on screen.' },
  { t: 'Summon sign', also: ['summon signs', 'Furlcalling Finger Remedy'], g: 'combat', d: 'Golden signs on the ground that call another player or an NPC helper into your game.' },
  { t: 'Field boss', g: 'combat', d: 'A boss out in the open world, often guarding loot or appearing only at night.' },
  { t: 'Fog wall', also: ['fog gate'], g: 'combat', d: 'The misty doorway in front of a boss room. Walking through starts the fight.' },
  { t: 'Weak point', also: ['weakness', 'weak to'], g: 'combat', d: 'A damage type an enemy takes extra damage from, like fire or holy.' },

  // Status effects
  { t: 'Bleed', also: ['Hemorrhage', 'blood loss'], g: 'status', d: 'Builds up a hidden meter. When it fills, the target loses a big chunk of health at once.' },
  { t: 'Frostbite', g: 'status', d: 'When it fills, deals a burst of damage and makes the target take more damage for a while.' },
  { t: 'Scarlet Rot', also: ['rot'], g: 'status', d: 'A nasty poison that keeps eating health until it wears off or you cure it. Caelid is full of it.', more: 'Preserving Boluses cure it.' },
  { t: 'Poison', g: 'status', d: 'Drains health over time. Neutralizing Boluses cure it.' },
  { t: 'Madness', g: 'status', d: 'Drains FP and deals damage when it fills. Mostly from the Frenzied Flame.' },
  { t: 'Death Blight', also: ['Deathblight', 'instant death'], g: 'status', d: 'Kills you instantly when it fills. Rare, and caused by a few death-themed enemies and spells.' },
  { t: 'Sleep', g: 'status', d: 'Knocks the target out for a moment.' },

  // Magic
  { t: 'Incantation', also: ['incantations'], g: 'magic', d: 'A Faith spell, cast from a sacred seal.' },
  { t: 'Sorcery', also: ['sorceries'], g: 'magic', d: 'An Intelligence spell, cast from a staff.' },
  { t: 'Sacred seal', also: ['seal', 'Clawmark Seal'], g: 'magic', d: 'The catalyst for incantations. Teremity uses the Clawmark Seal +8, which also gets stronger with Strength.' },
  { t: 'Glintstone staff', also: ['staff'], g: 'magic', d: 'The catalyst for sorceries. Teremity carries the Demi-Human Queen\'s Staff +7.' },
  { t: 'Memory Slot', also: ['memory slots', 'Memory Stone', 'Memory Stones'], g: 'magic', d: 'How many spells you can equip at once. Memory Stones add one slot each.' },

  // Gear and upgrades
  { t: 'Smithing Stone', also: ['Smithing Stones'], g: 'gear', d: 'Upgrades normal weapons at the blacksmith or an anvil.' },
  { t: 'Somber Smithing Stone', also: ['Somber Smithing Stones', 'Somber Stone'], g: 'gear', d: 'Upgrades special one-of-a-kind weapons, one stone per level. The Godslayer\'s Greatsword uses these.', more: 'It is at +5, so the next upgrade needs a Somber Smithing Stone [6].' },
  { t: 'Bell Bearing', also: ['Bell Bearings', 'Miner\'s Bell Bearing'], g: 'gear', d: 'Give one to the Twin Maiden Husks at the Roundtable and they start selling that item forever.', more: 'The Miner\'s Bell Bearings let you buy smithing stones instead of hunting for them.' },
  { t: 'Ash of War', also: ['Ashes of War'], g: 'gear', d: 'Changes a weapon\'s special skill and how its damage scales. Applied at a grace.' },
  { t: 'Affinity', also: ['affinities'], g: 'gear', d: 'The flavor you give a weapon with an Ash of War. Heavy follows Strength, Keen follows Dexterity, Quality follows both, Sacred and Flame Art follow Faith.' },
  { t: 'Whetblade', also: ['Whetblades', 'Whetstone Knife'], g: 'gear', d: 'Key items that unlock more affinities. Teremity has the Iron and Glintstone ones.' },
  { t: 'Talisman', also: ['Talismans'], g: 'gear', d: 'Accessories that give passive bonuses, like more health or stronger charged attacks.' },
  { t: 'Talisman Pouch', also: ['Talisman Pouches'], g: 'gear', d: 'Adds one more talisman slot.' },
  { t: 'Great Rune', also: ['Great Runes', "Godrick's Great Rune"], g: 'gear', d: 'A demigod\'s rune that gives a big passive bonus once equipped at a grace and activated with a Rune Arc.', more: "Godrick's adds 5 to every stat. It switches off when you die, so save Rune Arcs for hard bosses." },
  { t: 'Rune Arc', also: ['Rune Arcs'], g: 'gear', d: 'A consumable that switches on your equipped Great Rune until you die.' },
  { t: 'Remembrance', also: ['Remembrances'], g: 'gear', d: 'A special item dropped by a major boss. Trade it to Enia at the Roundtable for a unique weapon or spell, or sell it for runes.' },
  { t: 'Walking Mausoleum', also: ['Walking Mausoleums', 'mausoleum', 'mausoleums'], g: 'gear', d: 'A giant tomb on legs. Knock out the glowing growths on its legs so it sits down, then climb in to duplicate a Remembrance.' },
  { t: 'Glovewort', also: ['Grave Glovewort', 'Ghost Glovewort'], g: 'gear', d: 'Little flowers found in catacombs. Roderika uses them to upgrade Spirit Ashes.' },

  // Places and things
  { t: 'Evergaol', also: ['Evergaols'], g: 'places', d: 'A stone circle that teleports you into a sealed arena with a boss inside.' },
  { t: 'Catacombs', also: ['catacomb'], g: 'places', d: 'Small underground dungeons with a boss at the end. Often full of traps.' },
  { t: 'Hero\'s Grave', also: ["Hero's Graves"], g: 'places', d: 'A tougher catacomb with rolling chariot traps.' },
  { t: 'Legacy dungeon', also: ['legacy dungeons'], g: 'places', d: 'The big hand-built castles and cities, like Stormveil and Raya Lucaria.' },
  { t: 'Divine Tower', also: ['Divine Towers'], g: 'places', d: 'Tall towers where you restore Great Runes so they can be used.' },
  { t: 'Minor Erdtree', also: ['Minor Erdtrees'], g: 'places', d: 'Smaller golden trees around the map. Many have an Erdtree Avatar boss and loot underneath.' },
  { t: 'Waygate', also: ['Waygates'], g: 'places', d: 'A magic portal that sends you somewhere else.' },
  { t: 'Teleport trap', also: ['trap chest'], g: 'places', d: 'A chest that teleports you far away when opened, sometimes to a much harder area.' },
  { t: 'Imp statue', also: ['imp seal', 'Stonesword Key', 'Stonesword Keys'], g: 'places', d: 'Fog walls guarded by little imp statues. Each one takes a Stonesword Key, usually opening a loot room. Teremity has 12 keys.' },
  { t: 'Imbued Sword Key', g: 'places', d: 'Opens one of the portals at the Four Belfries in north-west Liurnia.' },
  { t: 'Illusory wall', also: ['illusory walls', 'fake wall'], g: 'places', d: 'A wall that vanishes when you hit it, hiding a secret room.' },
  { t: 'Scarab', also: ['scarabs', 'rolling beetle'], g: 'places', d: 'A shiny beetle that runs away. Kill it for a guaranteed item, often an Ash of War.' },
  { t: 'Deathroot', g: 'places', d: 'A strange root found where death-rite enemies are. Give it to Gurranq in the Bestial Sanctum for rewards.', more: 'The Beast Eye in your key items trembles when one is nearby.' },
  { t: 'Night boss', also: ["Night's Cavalry", 'Bell Bearing Hunter'], g: 'places', d: 'Some bosses only appear at night. Rest at a grace and choose Pass Time to make it night.' },
  { t: 'Rebirth', also: ['respec', 'Larval Tear', 'Larval Tears'], g: 'places', d: 'Rennala lets you reassign all your stat points, once per Larval Tear.' },
  { t: 'Grand Lift of Dectus', also: ['Dectus Medallion'], g: 'places', d: 'The giant elevator from Liurnia up to the Altus Plateau. It needs both halves of the Dectus Medallion, which Teremity has.' },
  { t: 'Radahn Festival', also: ['festival'], g: 'places', d: "A special event at Redmane Castle where lots of NPC allies help you fight Starscourge Radahn." },
]

export const GLOSSARY_GROUPS = [
  ['basics', 'The basics'], ['flasks', 'Healing and flasks'], ['stats', 'Stats'], ['combat', 'Fighting'],
  ['status', 'Status effects'], ['magic', 'Magic'], ['gear', 'Gear and upgrades'], ['places', 'Places and things'],
]
