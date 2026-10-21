// Boss cards: three tips Truc can read aloud mid-fight, what it's weak to, what to summon, what it drops.
// Keyed by the start of the boss name in the map data. Lore lines are hidden behind a spoiler tap.
// "level" is our honest read for Teremity at level 103: easy / fair / tough / very tough.
// Facts checked against the Fextralife wiki on Oct 21, 2026.
const NO_ASH = 'Spirit Ashes can\'t be summoned here.'
export const BOSS_TIPS = {
  'Starscourge Radahn': {
    level: 'tough', weak: 'Pierce damage and scarlet rot. He resists holy.', summon: 'Use the golden summon signs on the battlefield. They are free NPC helpers, and their signs come back after they fall.',
    tips: [
      'When he flies into the sky and a purple star appears, ride away sideways on Torrent until it lands.',
      'Fight him on Torrent. Ride in, hit, and ride out again; you can outrun most of his attacks.',
      'Summon every helper you can; each one takes his attention off you.',
    ],
    drops: "His Remembrance and Radahn's Great Rune. Defeating him also makes a star fall that opens Nokron, the city under the crater.",
    lore: "Radahn held back the stars with gravity magic. The festival exists because the warriors there want to give him a warrior's death.",
  },
  'Royal Knight Loretta': {
    level: 'fair', weak: 'Lightning. She is immune to bleed and other status effects, and resists magic and fire.', summon: 'Your best spirit ash.',
    tips: [
      'When she raises her bow, run sideways; the arrows fly in straight lines.',
      'Her big glowing spear sweeps come in pairs. Roll toward her, not away.',
      'She fights on horseback, so wait for a combo to end, then punish.',
    ],
    drops: "Loretta's Greatbow and the Loretta's Slash Ash of War. Unlocks Ranni's Rise, the Three Sisters and the graveyard with a Larval Tear.",
  },
  'Magma Wyrm Makar': {
    level: 'fair', weak: 'Strike and pierce damage, like a hammer, spear or rapier. Do not use fire; slashing is resisted too.', summon: 'Any sturdy spirit to hold its attention.',
    tips: [
      'Stay at its side, never in front of its mouth; the fire breath covers the whole front.',
      'When it rears up for the overhead slam, roll forward and through it.',
      'Charged heavy attacks after its big swings are safe.',
    ],
    drops: "Magma Wyrm's Scalesword and a Dragon Heart. Beating it opens the Ruin-Strewn Precipice path up toward Altus.",
  },
  'Magma Wyrm': {
    level: 'easy', weak: 'Physical damage. Do not use fire.', summon: 'Any.',
    tips: ['Stay by its back legs.', 'Back off when it rears up to spit lava.', 'It is slow, so charged heavy attacks are safe after each of its swings.'],
    drops: 'The Moonveil katana (in Gael Tunnel) and a Dragon Heart.',
  },
  'Glintstone Dragon Smarag': {
    level: 'fair', weak: 'Physical damage. It resists magic.', summon: 'Ranged ashes help keep it busy.',
    tips: ['Fight its head; the head takes the most damage.', 'When it takes off, run out from under it.', 'Its blue breath sweeps the ground; run to its side.'],
    drops: "A Dragon Heart and about 14,000 runes. Beating it lets you buy Smarag's Glintstone Breath at the Cathedral of Dragon Communion in Caelid.",
  },
  'Glintstone Dragon Adula': {
    level: 'tough', weak: 'Physical damage. It resists magic.', summon: 'Any.',
    tips: ['Watch for the glowing sword it summons: back off, then punish after.', 'Stay at the side of its head.', 'If it flies away mid-fight, that is normal; you finish it later.'],
    drops: "Adula's Moonblade and three Dragon Hearts.",
  },
  'Royal Revenant': {
    level: 'easy', weak: 'Healing spells. Casting Heal or a similar incantation next to it does huge damage. It resists holy damage, so skip holy attacks.', summon: 'Not needed.',
    tips: ['Cast a healing incantation right beside it; healing hurts it badly.', 'It teleports around; wait for it to land before attacking.', 'It waits in a sealed room under the Kingsrealm Ruins, reached through an illusory floor.'],
    drops: 'Opens the room with the Frozen Needle in the Kingsrealm Ruins.',
  },
  Omenkiller: {
    level: 'easy', weak: 'Physical damage and bleed. It resists fire.', summon: 'Not needed.',
    tips: ['His big leaping combo ends with a pause; hit him then.', 'Stay close; he is weak in melee range.', 'Afterward, hit the odd-looking pot in the village: an old man named Albus hides inside with half of a secret medallion.'],
    drops: 'The Crucible Knot Talisman.',
  },
  'Tibia Mariner': {
    level: 'easy', weak: 'Holy damage.', summon: 'Not needed.',
    tips: ['Kill the skeletons it summons with holy damage, or they get back up.', 'It teleports around the water; wait for it to reappear, then rush in.', 'It only takes a few big hits.'],
    drops: 'Deathroot, to trade to Gurranq.',
  },
  'Erdtree Avatar': {
    level: 'easy', weak: 'Fire and strike damage. It is immune to bleed and resists holy.', summon: 'Any.',
    tips: ['Its slams have a long wind-up; roll at the very last moment.', 'Get between its legs, where its swings miss.', 'When it glows gold it is about to heal or rain holy light; back away.'],
    drops: 'Crystal Tears for the Physick flask.',
  },
  'Bloodhound Knight Darriwil': {
    level: 'easy', weak: 'Nothing special.', summon: 'Blaidd the half-wolf can be summoned if you have met him.',
    tips: ['He is fast but fragile.', 'Wait out his double backstep, then hit.', 'Guard counters work well against his swings.'],
    drops: "Bloodhound's Fang, a bleed curved greatsword.",
  },
  'Miranda the Blighted Bloom': {
    level: 'easy', weak: 'Fire.', summon: 'Not needed.',
    tips: ['Kill the small flowers first; they poison you.', 'Stand right under it; its spray misses up close.', 'Fire spells or a fire weapon end it quickly.'],
    drops: 'The Viridian Amber Medallion. A cookbook is on a body elsewhere in the cave.',
  },
  "Night's Cavalry": {
    level: 'fair', weak: 'Knock him off his horse, then he is easy.', summon: 'Fight on Torrent.',
    tips: ['Hit the horse until it falls; the rider is stunned on the ground.', 'Fight him on Torrent: hit, ride away, come back.', 'He only appears at night. Pass Time at a grace to make it night.'],
    drops: 'Rare weapons and Ashes of War, different for each rider.',
  },
  'Bell Bearing Hunter': {
    level: 'fair', weak: 'Bleed, frostbite and pierce damage.', summon: 'Spirit Ashes usually can\'t be summoned at his shack.',
    tips: ['He only shows up at night, at a merchant\'s shack.', 'He hits hard but slowly; roll into his swings and punish after.', 'Keep pressure on him; he is slow to recover.'],
    drops: "A Bell Bearing that adds new items to the Twin Maiden Husks' shop.",
  },
  Deathbird: {
    level: 'easy', weak: 'Holy and strike damage.', summon: 'Not needed.',
    tips: ['Night only.', 'Its cane slam has a long wind-up: roll late.', 'Holy damage melts it.'],
    drops: 'Runes and a unique drop.',
  },
  'Death Rite Bird': {
    level: 'tough', weak: 'Holy damage, a lot of it.', summon: NO_ASH,
    tips: ['Stay out of its ghostly blue flames; they freeze you with Frostbite.', 'Holy incantations and the Sacred affinity hit it very hard.', 'Most of them only appear at night.'],
    drops: 'Runes and a unique drop.',
  },
  "Commander O'Neil": {
    level: 'fair', weak: 'Pierce damage. He is immune to scarlet rot and resists slashing.', summon: 'Any spirit, to split his attention.',
    tips: ['He raises a banner to call spirit soldiers; hit him hard while they come.', 'His attacks cause scarlet rot: watch your rot meter and keep Preserving Boluses ready.', 'Strike from behind after his spear thrusts.'],
    drops: "Commander's Standard and the Unalloyed Gold Needle.",
  },
  'Decaying Ekzykes': {
    level: 'fair', weak: 'Fire, very much so.', summon: 'Any.',
    tips: ['Its breath is scarlet rot; stay at its side.', 'Fight it on Torrent and hit its legs.', 'Fire weapons and fire spells hit it hard.'],
    drops: "A Dragon Heart and 38,000 runes. Beating it lets you buy Ekzykes's Decay at the Cathedral of Dragon Communion.",
  },
  'Elder Dragon Greyoll': {
    level: 'easy', weak: 'Pierce damage. She resists bleed and other status effects.', summon: 'Not needed.',
    tips: ['She barely fights back. Stand by her head and keep hitting.', 'Five small dragons lie in front of her; they do not fight back.', 'It takes a while. Put on the Gold Scarab first for extra runes.'],
    drops: 'About 50,000 runes and five Dragon Hearts. The best one-time rune haul around.',
  },
  'Godefroy the Grafted': {
    level: 'easy', weak: 'Nothing special.', summon: NO_ASH,
    tips: ['A smaller Godrick, with the same moves.', 'Stay behind his axe swings.', 'Found in the Golden Lineage Evergaol near the Grand Lift.'],
    drops: 'The Godfrey Icon talisman (stronger charged spells and skills).',
  },
  'Draconic Tree Sentinel': {
    level: 'tough', weak: 'Nothing special. Fight him on Torrent.', summon: 'A sturdy spirit.',
    tips: ['Stay mobile on Torrent and attack after his big swings.', 'Keep your distance when he winds up an elemental attack.', 'He guards the road to the capital; you can also ride past him.'],
    drops: 'Dragon Greatclaw, Dragonclaw Shield and about 50,000 runes.',
  },
  'Ancient Dragon Lansseax': {
    level: 'tough', weak: 'Nothing special.', summon: 'Any ranged help.',
    tips: ['When lightning starts dropping in a circle, keep moving.', 'Stay under her belly and hit her legs.', 'The first time, she flies off after losing about a fifth of her health; you finish her later.'],
    drops: "Lansseax's Glaive and 60,000 runes.",
  },
  'Crucible Knight': {
    level: 'tough', weak: 'Fire and lightning. He resists bleed and other status effects.', summon: 'A spirit to distract him.',
    tips: ['He blocks often; go for his back.', 'When he grows wings or a tail, back off until the move ends.', 'Do not trade hits; he wins trades.'],
    drops: 'Crucible gear or an incantation.',
  },
  'Black Blade Kindred': {
    level: 'tough', weak: 'Nothing special.', summon: 'Any.',
    tips: ['Stay close behind its wings.', 'It jumps high to slam: roll away from the landing spot.', 'Out in the open, Torrent keeps you mobile.'],
    drops: "Gargoyle's Blackblade and Gargoyle's Black Halberd (the one at the Bestial Sanctum).",
  },
  'Nox Swordstress': {
    level: 'fair', weak: 'Holy.', summon: 'A spirit helps a lot in a two-on-one.',
    tips: ['Kill one fast instead of splitting your damage.', 'The pair is much easier once one is down.', 'They are inside Sellia once the barrier is down.'],
    drops: 'The Nox Flowing Sword.',
  },
  'Putrid Avatar': {
    level: 'fair', weak: 'Fire.', summon: 'Any.',
    tips: ['Scarlet rot everywhere: carry Preserving Boluses.', 'Same pattern as the Erdtree Avatar.', 'Fight it on Torrent if you can.'],
    drops: 'Crystal Tears for the Physick flask.',
  },
  'Godskin Noble': {
    level: 'tough', weak: 'Slashing and bleed. Holy is resisted.', summon: 'A spirit to distract.',
    tips: ['When he curls up and rolls, run away sideways.', 'His long belly flop: back off.', 'Hit him after his slow staff swings.'],
    drops: 'Godskin weapons and incantations.',
  },
  'Alecto, Black Knife Ringleader': {
    level: 'tough', weak: 'Nothing special.', summon: NO_ASH,
    tips: ['She vanishes and reappears; wait for her blade glow.', 'She is fast and fragile: two or three good hits.', "Only reachable through Ranni's quest."],
    drops: 'Black Knife Tiche, one of the best Spirit Ashes in the game.',
  },
  'Adan, Thief of Fire': {
    level: 'easy', weak: 'Nothing special.', summon: NO_ASH,
    tips: ['He casts fire: roll toward him.', 'Pressure him and he cannot cast.', "Malefactor's Evergaol in south Liurnia."],
    drops: 'Flame of the Fell God, a big fire incantation.',
  },
  'Bols, Carian Knight': {
    level: 'easy', weak: 'Nothing special.', summon: NO_ASH,
    tips: ['His glintstone blade has a long reach: get close.', 'Punish after his combo.', "Cuckoo's Evergaol, in western Liurnia north of the south-west Minor Erdtree."],
    drops: 'Greatblade Phalanx (a sorcery).',
  },
  Mimic: {
    level: 'tough', weak: 'Whatever beats your own build.', summon: 'Spirit Ashes work here.',
    tips: ['It copies your gear and moves. Take off your best armor before the fog to make it weaker.', 'It heals with flasks like you do.', 'Be patient; it wastes its FP fast.'],
    drops: 'Two Larval Tears and the Silver Tear Mask. The Mimic Tear spirit ash itself is in a chest behind a Stonesword Key door in Night\'s Sacred Ground.',
  },
  'Regal Ancestor Spirit': {
    level: 'fair', weak: 'Holy.', summon: 'Any.',
    tips: ['Light the six altars by the stairs north-east of the Ancestral Woods grace in Nokron to call it.', 'It jumps a lot: wait for it to land.', 'Its glowing antlers mean a big magic blast: back off.'],
    drops: "Remembrance of the Regal Ancestor (Ancestral Spirit's Horn or Winged Greathorn).",
  },
  'Rykard, Lord of Blasphemy': {
    level: 'very tough', weak: 'Use the Serpent-Hunter spear you find before the fight.', summon: 'Not needed.',
    tips: ['Pick up the Serpent-Hunter spear in the first arena; it does huge damage to the serpent.', 'Hit the giant head with charged heavy attacks from the spear.', 'Stay out of the lava breath.'],
    drops: 'His Remembrance and Great Rune. Optional, but Volcano Manor is worth it.',
  },
  'Magma Wyrm (Mt Gelmir': { level: 'fair', weak: 'Physical damage. Do not use fire.', summon: 'Any.', tips: ['Stay at its side.', 'Charged heavies after its slams.', 'Watch the lava pool around it.'], drops: 'A Dragon Heart.' },
  'Margit, the Fell Omen': { level: 'done', weak: '', summon: '', tips: ['Already beaten.'], drops: '' },
  'Godrick the Grafted': { level: 'done', weak: '', summon: '', tips: ['Already beaten.'], drops: '' },
  'Rennala, Queen of the Full Moon': { level: 'done', weak: '', summon: '', tips: ['Already beaten. She now lets you respec with a Larval Tear.'], drops: '' },
}

export function tipsFor(name) {
  const keys = Object.keys(BOSS_TIPS).sort((a, b) => b.length - a.length)
  const k = keys.find(k => name.startsWith(k))
  return k ? BOSS_TIPS[k] : null
}
