// Boss cards: three tips Truc can read aloud mid-fight, what it's weak to, what to summon, what it drops.
// Keyed by the start of the boss name in the map data. Lore lines are hidden behind a spoiler tap.
// "level" is our honest read for Teremity at level 103: easy / fair / tough / very tough.
export const BOSS_TIPS = {
  'Starscourge Radahn': {
    level: 'tough', weak: 'Nothing special. Just keep hitting.', summon: 'Use the summon signs on the battlefield. They are free NPC helpers, and you can resummon them.',
    tips: [
      'When he flies into the sky and a purple star appears, ride away sideways on Torrent until it lands.',
      'Fight him on Torrent. Ride in, hit, and ride out again; you can outrun most of his attacks.',
      'Use the summon signs all over the field; every helper takes his attention off you.',
    ],
    drops: 'His Remembrance and the Radahn Great Rune. Defeating him also makes a star fall that opens Nokron, the city under the crater.',
    lore: "Radahn held back the stars by sheer gravity magic. His fight is staged as a festival because the warriors there want to give him a warrior's death.",
  },
  'Royal Knight Loretta': {
    level: 'fair', weak: 'Bleed and strike damage. She resists magic.', summon: 'Black Knife Tiche if you ever get her; otherwise your best ash.',
    tips: [
      'When she raises her bow, run sideways; the arrows track straight lines.',
      'Her big glowing spear sweeps come in twos. Roll toward her, not away.',
      'She is on a horse, so hit the horse\'s legs or wait for her to land a combo, then punish.',
    ],
    drops: "Loretta's Greatbow and the Loretta's Slash Ash of War. Unlocks Ranni's Rise, the Three Sisters and the graveyard with a Larval Tear.",
  },
  'Magma Wyrm Makar': {
    level: 'fair', weak: 'Do not use fire. Slashing and holy work well.', summon: 'Any tanky spirit to hold its attention.',
    tips: [
      'Stay at its side, never in front of its mouth; the fire breath covers the whole front.',
      'When it rears up for the overhead slam, roll forward and through it.',
      'It is lazy at the start of the fight. Run in and hit it with heavies while it wakes up.',
    ],
    drops: "Magma Wyrm's Scalesword and the way up the Ruin-Strewn Precipice toward Altus.",
  },
  'Magma Wyrm': {
    level: 'easy', weak: 'Do not use fire. Use a physical weapon.', summon: 'Any.',
    tips: ['Stay by its back legs.', 'Back off when it rears up to spit lava.', 'It is slow, so charged heavy attacks are safe after each of its swings.'],
    drops: 'The Moonveil katana and a Dragon Heart.',
  },
  'Glintstone Dragon Smarag': {
    level: 'fair', weak: 'Physical damage. It resists magic.', summon: 'Ranged ashes help keep it busy.',
    tips: ['Fight its head; the head takes the most damage.', 'When it takes off, run out from under it.', 'You can start it asleep: sneak up and hit the head first.'],
    drops: "Glintstone Dragon Smarag's Glintstone Breath and a Dragon Heart.",
  },
  'Glintstone Dragon Adula': {
    level: 'tough', weak: 'Physical damage. It resists magic.', summon: 'Any.',
    tips: ['Watch for the glowing sword it summons: back off, then punish after.', 'Stay at the side of its head.', 'If it flies away mid-fight, that is normal; you can come back later.'],
    drops: "Adula's Moonblade and a Dragon Heart.",
  },
  'Royal Revenant': {
    level: 'easy', weak: 'Holy damage hits it very hard.', summon: 'Not needed.',
    tips: ['It heals by grabbing you, so keep moving.', 'Holy damage, like the Sacred affinity or holy incantations, melts it.', 'Fight it in the open, not in the corners of the village.'],
    drops: 'Opens the way to the treasure in the Kingsrealm Ruins.',
  },
  Omenkiller: {
    level: 'easy', weak: 'Bleed and fire.', summon: 'Not needed.',
    tips: ['His big leaping combo ends with a pause; hit him then.', 'Stay close; he is weak in melee range.', 'Afterward, hit the odd-looking pot in the village: an old man named Albus hides inside with half of a secret medallion.'],
    drops: 'The Crucible Knot Talisman.',
  },
  'Tibia Mariner': {
    level: 'easy', weak: 'Holy damage.', summon: 'Not needed.',
    tips: ['Kill the skeletons it summons with holy damage, or they get back up.', 'It teleports around the water; wait for it to reappear, then rush in.', 'It only takes a few big hits.'],
    drops: 'Deathroot, to trade to Gurranq.',
  },
  'Erdtree Avatar': {
    level: 'easy', weak: 'Fire and bleed.', summon: 'Any.',
    tips: ['Its slams have a long wind-up; roll at the very last moment.', 'Get between its legs, where its swings miss.', 'When it starts glowing gold it is about to heal or rain holy light; back away.'],
    drops: 'Crimson or Cerulean Crystal Tears, and talismans at some trees.',
  },
  'Bloodhound Knight Darriwil': {
    level: 'easy', weak: 'Nothing special.', summon: 'Not needed at level 103.',
    tips: ['He is fast but fragile.', 'Wait out his double backstep, then hit.', 'Blaidd the half-wolf may help if you have met him.'],
    drops: "Bloodhound's Fang, a bleed curved greatsword.",
  },
  'Miranda the Blighted Bloom': {
    level: 'easy', weak: 'Fire.', summon: 'Not needed.',
    tips: ['Kill the small flowers first; they poison you.', 'Stand right under it; its spray misses up close.', 'Fire spells or a fire weapon end it quickly.'],
    drops: "Viridian Amber Medallion and a cookbook.",
  },
  "Night's Cavalry": {
    level: 'fair', weak: 'Knock him off his horse, then he is easy.', summon: 'Fight on Torrent.',
    tips: ['Hit the horse until it falls; the rider is stunned on the ground.', 'Fight him on Torrent: hit, ride away, come back.', 'He only appears at night. Pass Time at a grace to make it night.'],
    drops: 'Rare weapons and armor, different for each rider.',
  },
  'Bell Bearing Hunter': {
    level: 'fair', weak: 'Bleed and strike.', summon: 'A ranged ash.',
    tips: ['He only shows up at night. Touch the merchant shack after dark.', 'He summons floating swords; when they glow, roll toward him.', 'Keep pressure on him; he is slow to recover.'],
    drops: "A Bell Bearing that adds items to the Twin Maiden Husks' shop.",
  },
  Deathbird: {
    level: 'easy', weak: 'Holy and fire.', summon: 'Not needed.',
    tips: ['Night only.', 'Its cane slam has a long wind-up: roll late.', 'Holy damage melts it.'],
    drops: 'Runes and a unique drop.',
  },
  'Death Rite Bird': {
    level: 'tough', weak: 'Holy damage, a lot of it.', summon: 'A tanky spirit to absorb the death magic.',
    tips: ['Stay out of its ghostly blue flames; they freeze you with Frostbite.', 'Holy incantations and the Sacred affinity hit it very hard.', 'Night only.'],
    drops: 'Runes and a unique drop.',
  },
  "Commander O'Neil": {
    level: 'fair', weak: 'Fire.', summon: 'Any spirit, to split his attention.',
    tips: ['He can raise a banner to summon soldiers; kill them or hit him hard while they come.', 'His scarlet rot attacks: watch your rot meter and keep Preserving Boluses ready.', 'Strike from behind his spear thrusts.'],
    drops: "Commander's Standard and the Unalloyed Gold Needle (part of Millicent's quest).",
  },
  'Decaying Ekzykes': {
    level: 'fair', weak: 'Fire.', summon: 'Any.',
    tips: ['Its breath is scarlet rot; stay at its side.', 'Fight it on Torrent and hit its legs.', 'Fire weapons and fire spells hit it hard.'],
    drops: "Dragon Heart and Ekzykes's Decay.",
  },
  'Elder Dragon Greyoll': {
    level: 'easy', weak: 'Bleed.', summon: 'Not needed.',
    tips: ['She barely fights back. Stand by her head and hit.', 'Her children may fly in; ignore them or fight them first.', 'Bleed weapons kill her fast. The Occult Hookclaws bleed.'],
    drops: 'About 50,000 runes and a Dragon Heart. The best one-time rune haul around.',
  },
  'Godefroy the Grafted': {
    level: 'easy', weak: 'Nothing special.', summon: 'Any.',
    tips: ['A smaller Godrick. Same moves.', 'Stay behind his axe swings.', 'Found in the Golden Lineage Evergaol in Altus.'],
    drops: 'The Godfrey Icon talisman (stronger charged spells and skills).',
  },
  'Draconic Tree Sentinel': {
    level: 'tough', weak: 'Nothing special. His horse is the easy target.', summon: 'A tanky spirit.',
    tips: ['Fight on Torrent.', 'He breathes lightning and fire: ride out to the side.', 'He guards the road to the capital; you can ride past him, too.'],
    drops: 'Dragon Greatclaw and the Draconic Tree Sentinel set.',
  },
  'Ancient Dragon Lansseax': {
    level: 'tough', weak: 'Nothing special.', summon: 'Any ranged help.',
    tips: ['When lightning starts dropping in a circle, keep moving.', 'Hit her legs and back her off by staying under her belly.', 'She flies off at half health in the first meeting; you finish her later.'],
    drops: "Lansseax's Glaive and a Dragon Heart.",
  },
  'Crucible Knight': {
    level: 'tough', weak: 'Bleed.', summon: 'A spirit to distract him.',
    tips: ['He blocks often; go for his back.', 'When he grows wings or a tail, back off and wait for the move to finish.', 'Do not trade hits; he wins trades.'],
    drops: 'Crucible gear or an incantation.',
  },
  'Black Blade Kindred': {
    level: 'tough', weak: 'Nothing special.', summon: 'Any.',
    tips: ['Stay close behind its wings.', 'It jumps high to slam: roll away from the landing spot.', 'Out in the open, Torrent keeps you mobile.'],
    drops: "Gargoyle's Blackblade and Gargoyle's Black Halberd.",
  },
  'Nox Swordstress': {
    level: 'fair', weak: 'Holy.', summon: 'A spirit for two-on-one fairness.',
    tips: ['Kill one fast instead of splitting damage.', 'The priest sends gravity waves: dodge sideways.', 'They are inside Sellia once the barrier is down.'],
    drops: 'Nox weapons and armor.',
  },
  'Putrid Avatar': {
    level: 'fair', weak: 'Fire.', summon: 'Any.',
    tips: ['Scarlet rot everywhere: carry Preserving Boluses.', 'Same pattern as the Erdtree Avatar.', 'Fight it on Torrent if you can.'],
    drops: 'Opaline Bubbletear (Physick).',
  },
  'Godskin Noble': {
    level: 'tough', weak: 'Holy is resisted. Bleed and physical work.', summon: 'A spirit to distract.',
    tips: ['When he curls up and rolls, run away sideways.', 'His long belly flop: back off.', 'Hit him after his slow staff swings.'],
    drops: 'Godskin weapons and incantations.',
  },
  'Alecto, Black Knife Ringleader': {
    level: 'tough', weak: 'Nothing special.', summon: 'Not allowed in an evergaol.',
    tips: ['She vanishes and reappears; wait for her blade glow.', 'She is fast and fragile: two or three good hits.', 'Only reachable through Ranni\'s quest.'],
    drops: 'Black Knife Tiche, one of the best Spirit Ashes in the game.',
  },
  'Adan, Thief of Fire': {
    level: 'easy', weak: 'Nothing special.', summon: 'Not allowed in an evergaol.',
    tips: ['He casts fire: roll toward him.', 'Pressure him and he cannot cast.', 'Malefactor\'s Evergaol in south Liurnia.'],
    drops: 'Flame of the Fell God, a big fire incantation.',
  },
  'Bols, Carian Knight': {
    level: 'easy', weak: 'Nothing special.', summon: 'Not allowed in an evergaol.',
    tips: ['His glintstone blade has a long reach: get close.', 'Punish after his combo.', 'Cuckoo\'s Evergaol in central Liurnia.'],
    drops: 'Greatblade Phalanx (a sorcery).',
  },
  Mimic: {
    level: 'tough', weak: 'Whatever beats your own build.', summon: 'Not allowed.',
    tips: ['It copies your gear and moves. Take off your best armor before the fog to make it weaker.', 'It heals with flasks like you do.', 'Be patient; it wastes its FP fast.'],
    drops: 'The Mimic Tear Spirit Ash, often called the best summon in the game.',
  },
  'Regal Ancestor Spirit': {
    level: 'fair', weak: 'Holy.', summon: 'Any.',
    tips: ['Light the six ritual torches in Siofra first to open its arena.', 'It jumps a lot: wait for it to land.', 'Its glowing antlers mean a big magic blast: back off.'],
    drops: "Remembrance of the Regal Ancestor (Ancestral Spirit's Horn or Winged Greathorn).",
  },
  'Rykard, Lord of Blasphemy': {
    level: 'very tough', weak: 'Use the Serpent-Hunter spear you find before the fight.', summon: 'Not needed.',
    tips: ['Pick up the Serpent-Hunter spear in the first arena; it does huge damage to the serpent.', 'Hit the giant head with charged heavy attacks from the spear.', 'Stay out of the lava breath.'],
    drops: 'His Remembrance and Great Rune. Optional, but Volcano Manor is worth it.',
  },
  'Magma Wyrm (Mt Gelmir': { level: 'fair', weak: 'Do not use fire.', summon: 'Any.', tips: ['Stay at its side.', 'Charged heavies after its slams.', 'Watch the lava pool around it.'], drops: "Dragon Heart." },
  'Margit, the Fell Omen': { level: 'done', weak: '', summon: '', tips: ['Already beaten.'], drops: '' },
  'Godrick the Grafted': { level: 'done', weak: '', summon: '', tips: ['Already beaten.'], drops: '' },
  'Rennala, Queen of the Full Moon': { level: 'done', weak: '', summon: '', tips: ['Already beaten. She now lets you respec with a Larval Tear.'], drops: '' },
}

export function tipsFor(name) {
  const keys = Object.keys(BOSS_TIPS).sort((a, b) => b.length - a.length)
  const k = keys.find(k => name.startsWith(k))
  return k ? BOSS_TIPS[k] : null
}
