// Plan, build, secrets and tips: the hand-written guide content.

export const TEREMITY = {
  level: 103, runes: 35211, nextLevelCost: 65681,
  stats: { Vigor: 35, Mind: 25, Endurance: 20, Strength: 30, Dexterity: 25, Intelligence: 25, Faith: 27, Arcane: 15 },
  hp: 1288, fp: 147, stamina: 113, equipLoad: '42.2 of 64.1 (medium)', flask: '8 charges (5 red, 3 blue), +4', seeds: 2,
  gear: [
    { n: "Godslayer's Greatsword +5", note: 'Main weapon. Physical plus fire damage, scaling mostly with Dexterity and Faith. Skill: The Queen\'s Black Flame.' },
    { n: 'Clawmark Seal +8', note: 'Casts incantations like Dragonfire. Scales with Strength and Faith, which suits Teremity.' },
    { n: "Demi-Human Queen's Staff +7", note: 'Casts sorceries with Intelligence.' },
    { n: "Rogier's Rapier +8", note: 'A fast thrusting sword with the Glintblade Phalanx skill.' },
    { n: 'Godskin Apostle set', note: 'Light armor that keeps rolling quick.' },
  ],
  owned: ['Grafted Blade Greatsword', 'Winged Scythe', 'Occult Hookclaws +1 (bleed)', 'Greatsword', 'Lordsworn\'s Greatsword', 'Rosus\' Axe',
    'Radagon\'s Soreseal', 'Crimson Amber Medallion', 'Blessed Dew Talisman', 'Radagon Icon', 'Graven-School Talisman', 'Spelldrake and Boltdrake Talismans',
    'Gold Scarab', "Godrick's Great Rune", 'Both Dectus Medallion halves', '12 Stonesword Keys', '1 Imbued Sword Key', 'Beast Eye', 'Dragon Heart'],
}

export const BUILD_ADVICE = [
  { h: 'Vigor first', p: 'Health is the best defense in the game. Each point of Vigor adds the most health up to 40, so take it from 35 to 40 with the next five levels. Past 40 each point adds less, but it is still worth it up to 60.' },
  { h: 'Then Faith', p: 'Faith powers both the Godslayer\'s fire and every incantation from the Clawmark Seal. Take it from 27 to 40.' },
  { h: 'Keep Dexterity', p: 'The Godslayer\'s Greatsword needs 22 Dexterity and gets most of its physical damage from it, so Dex 25 is doing real work.' },
  { h: 'Respec is optional', p: 'Intelligence 25 only matters if you two keep using the staff and sorceries. If you drop sorcery, one Larval Tear at Rennala moves those points into Vigor and Faith. If you still like casting, keep it. Keep at least 23 if you want to try the Moonveil katana from Gael Tunnel.' },
  { h: 'Upgrade the Godslayer', p: 'It is at +5. The next step needs a Somber Smithing Stone [6]. The closest one is in Caelid: the Fallingstar Beast boss in Sellia Crystal Tunnel drops one, plus a Somberstone Miner\'s Bell Bearing. More are up on the Altus Plateau and in Nokron.' },
  { h: 'Use the Great Rune', p: "Equip Godrick's Great Rune at a grace and pop a Rune Arc before a tough boss: +5 to every stat until you die." },
  { h: 'Leveling', p: 'Level 104 costs 65,681 runes, and you hold 35,211. Elder Dragon Greyoll in Dragonbarrow gives about 50,000, and her five young dragons add about 17,000 more when they die with her. That pays for level 104 with plenty left over.' },
  { h: 'Two buffs that stack', p: "Flame, Grant Me Strength (15 Faith) raises physical and fire attack, which are exactly the Godslayer's two kinds of damage. Golden Vow (25 Faith) raises attack and defense. Teremity has 27 Faith, so both work, and they stack because they are different kinds of buff. Cast both right before a boss, then drink the Physick." },
  { h: 'Watch the weight', p: 'Teremity carries 42.2 of 64.1, about 66 percent. At 70 percent the roll turns slow and heavy, so anything that adds more than about 2.5 weight, like a heavier chest piece or a second big weapon, needs a little Endurance first.' },
]

export const TALISMAN_SETS = [
  { h: 'Bossing', items: ["Radagon's Soreseal", 'Crimson Amber Medallion', 'Radagon Icon'], why: 'More stats and health, plus faster casting for Dragonfire.' },
  { h: 'Exploring', items: ['Gold Scarab', 'Crimson Amber Medallion', 'Blessed Dew Talisman'], why: 'More runes from every kill, and slow healing between fights.' },
]

// Before the session: things Chase can do alone without moving the story forward.
export const PREP = [
  { id: 'prep-flask', t: 'Set the flasks', d: 'At any grace, choose Flasks and split the 8 charges. 5 red and 3 blue works if you cast a lot; 6 and 2 if you mostly swing the Godslayer.' },
  { id: 'prep-rune', t: "Equip Godrick's Great Rune", d: 'At a grace, open Great Runes and equip it. It only switches on when you use a Rune Arc, so save those for bosses.' },
  { id: 'prep-tali', t: 'Pick a talisman set', d: 'See the two sets on the Teremity tab: one for bosses, one for exploring.' },
  { id: 'prep-spells', t: 'Check the spell slots', d: 'At a grace, choose Memorize Spell. Keep Dragonfire plus a heal and a buff if you have them.' },
  { id: 'prep-quick', t: 'Load the quick items', d: 'Put the flasks, Physick, Rune Arcs and Preserving Boluses (for Caelid rot) on the D-pad.' },
  { id: 'prep-bell', t: 'Upgrade spirit ashes', d: 'If Roderika is at the Roundtable and Hewg the smith has spoken with her, she upgrades spirits with Glovewort. If she is not there yet, skip this.' },
  { id: 'prep-sort', t: 'Sell what you will never use', d: 'Golden Runes in your pouch turn into runes when used. Use them now to get closer to level 104.' },
]

// Session routes. Each step links to a place on the map by grace or entity name.
export const ROUTES = [
  {
    id: 'caria', title: 'Treasure of Caria Manor', pick: true,
    why: 'Exploring and loot, just what Truc loves. Three new areas open, two Larval Tears are on the way, and the boss is fair at your level.',
    time: '2 to 3 hours',
    steps: [
      { id: 'r1', t: 'Ride to the Road to the Manor grace', where: 'Road to the Manor', d: 'North Liurnia, on the road up to the manor.' },
      { id: 'r2', t: 'Explore Caria Manor', where: 'Main Caria Manor Gate', d: 'Lots of loot in the gardens and halls. The big ghostly hands crawl fast; kill them from range.' },
      { boss: 'Royal Knight Loretta', id: 'r3', t: 'Beat Royal Knight Loretta', where: 'Manor Upper Level', d: 'Your skull marker, at the top of the manor. Boss card on the Bosses tab. She is weak to lightning and immune to bleed.' },
      { id: 'r4', t: 'Collect the Resurrection painting reward', where: 'Behind Caria Manor', d: 'You already have the painting. Head to the graveyard south-east of the Behind Caria Manor grace: a Larval Tear and a scholar outfit.' },
      { id: 'r5', t: "Visit the Three Sisters and Ranni's Rise", where: "Ranni's Rise", d: "The towers behind the manor. Pidia, a servant on the upper balcony of the manor's chapel, sells one Larval Tear for 3,000 runes. You reach him by dropping down the cliffs from the Three Sisters." },
      { boss: 'Omenkiller', id: 'r6', t: 'Optional: Village of the Albinaurics', where: 'Village of the Albinaurics', d: 'Omenkiller boss, a Larval Tear in the graveyard, and the hiding pot.' },
    ],
  },
  {
    id: 'altus', title: 'Up to the Altus Plateau',
    why: 'The main road onward: golden new scenery, Godfrey Icon nearby, and riding the lift is what starts the Radahn Festival.',
    time: '2 hours or more',
    steps: [
      { id: 'a1', t: 'Ride the Grand Lift of Dectus', where: 'Grand Lift of Dectus', d: 'Your house marker. Both medallion halves are in your key items, so the lift just works. This also starts the Radahn Festival back in Caelid.' },
      { id: 'a2', t: 'Touch the first Altus graces', where: 'Altus Plateau', d: 'The lift lands you near the Altus Plateau grace, and Erdtree-Gazing Hill is close. The Erdtree is huge from here.' },
      { boss: 'Godefroy the Grafted', id: 'a3', t: 'Golden Lineage Evergaol', where: 'Golden Lineage Evergaol', d: 'A stone circle near the lift. Godefroy the Grafted inside drops the Godfrey Icon talisman.' },
      { id: 'a4', t: 'Old Altus Tunnel for Somber stones', where: 'Old Altus Tunnel', d: "One or two Somber Smithing Stone [6] for the Godslayer's Greatsword, depending on the source." },
    ],
  },
  {
    id: 'radahn', title: 'The Radahn Festival',
    why: 'The biggest spectacle fight in the game, with lots of NPC helpers. It only starts after you ride the Grand Lift or touch an Altus grace, so do the Altus route first.',
    time: '1 to 2 hours',
    steps: [
      { boss: 'Magma Wyrm', id: 'd1', t: 'Optional warm-up: Gael Tunnel', where: 'Gael Tunnel', d: 'Your loot marker. The Moonveil katana and a Magma Wyrm.' },
      { id: 'd2', t: 'Optional: Sellia Crystal Tunnel', where: 'Sellia Crystal Tunnel', d: "Your loot marker. The Fallingstar Beast here drops a Somber Smithing Stone [6] for the Godslayer, plus a Somberstone Miner's Bell Bearing." },
      { id: 'd7', t: 'Optional: Flame, Grant Me Strength', where: 'Fort Gael North', d: "A buff incantation for the Clawmark Seal that boosts physical and fire damage, the Godslayer's two kinds of damage. It needs 15 Faith, and Teremity has 27. It lies on a body against a wall on the left side of Fort Gael, between two fire chariots. Fight the chariots on foot, one at a time, because their fire knocks you off Torrent. There is also a Rune Arc on a body near the gate." },
      { id: 'd3', t: 'Get into Redmane Castle', where: 'Impassable Greatbridge', d: 'Your house marker. The main gate stays shut during the festival. Use the waygate from the Impassable Greatbridge grace, or the one on the Fort Gael watchtower.' },
      { id: 'd4', t: 'Talk to Jerren in the plaza', where: 'Chamber Outside the Plaza', d: 'He starts the fight. Then go up the stairs opposite him, through the chapel and down the lift. The waygate is at the bottom, next to a Stake of Marika.' },
      { boss: 'Starscourge Radahn', id: 'd5', t: 'Fight Starscourge Radahn', where: 'Starscourge Radahn', d: 'Use every summon sign on the field. Boss card on the Bosses tab.' },
      { id: 'd6', t: 'Watch the star fall', where: 'Starscourge Radahn', d: 'After he falls, a star crashes into Limgrave and opens Nokron, Eternal City, a new area for next time.' },
    ],
  },
]

// One thing worth telling the other person, per region. Spoilers go in `spoiler`.
export const SECRETS = {
  limgrave: [
    'The chest in the cellar of the Dragon-Burnt Ruins is a trap: it teleports you to a crystal tunnel in Caelid.',
    'Sorceress Sellen is in the cellar of the Waypoint Ruins, behind a boss.',
    "Erdtree's Favor, a strong health and stamina talisman, waits at the end of Fringefolk Hero's Grave next to the starting area.",
    'A lift in the Mistwood goes down to the Siofra River, a whole underground world with a fake starry sky.',
    'Agheel Lake has a dragon. It looks scary, but at your level it is runes on legs.',
  ],
  weeping: [
    'Kill three little spirit turtles around Oridys\'s Rise to open the tower and get a Memory Stone.',
    'A Walking Mausoleum roams the west side. Hit the glowing growths on its legs to make it sit.',
    'Grave Glovewort for spirit upgrades grows in Tombsward Catacombs.',
    'The Claymore, a fan favorite, sits in a chest inside Castle Morne.',
  ],
  liurnia: [
    'Jarburg is a village of friendly living jars, including a little one named Jar-Bairn.',
    'The Four Belfries hold three portals. Each needs an Imbued Sword Key, and you have one.',
    'Liurnia has several Walking Mausoleums. One can copy a Remembrance, like Rennala\'s, so you get both of her rewards.',
    'Bellum Church, up the east cliffs, has a Sacred Tear.',
    'A strange pot in the Village of the Albinaurics is actually a person.',
  ],
  caelid: [
    'Elder Dragon Greyoll in Dragonbarrow barely fights back and is worth about 50,000 runes.',
    "Sellia's barrier opens when you light the three braziers around the town.",
    'The Church of the Plague, near Sellia, has a Sacred Tear.',
    'The Moonveil katana is in Gael Tunnel, in western Caelid.',
    'Preserving Boluses cure scarlet rot. They come from an Armorer\'s Cookbook, so check your crafting menu before the swamp.',
  ],
  altus: [
    'Godefroy the Grafted, in an evergaol, drops the Godfrey Icon: stronger charged spells and skills.',
    'Windmill Village looks peaceful. It is not.',
    'Old Altus Tunnel has one or two Somber Smithing Stone [6] for the Godslayer.',
    'Golden Vow, a strong buff incantation that needs 25 Faith (Teremity has 27), lies on a body in the Corpse-Stench Shack, a short ride north-west of the Bridge of Iniquity grace at the edge of Mt. Gelmir.',
  ],
  siofra: [
    'Nokron, Eternal City only opens after Radahn falls.',
    'The Mimic Tear spirit ash, the best summon in the game, is in Nokron.',
    'Six ritual torches in the Ancestral Woods summon a boss when they are all lit.',
  ],
}

// Tips we took from the YouTube guides Chase picked.
export const VIDEO_TIPS = [
  { from: 'Hawk Live Gaming: 15 tips', tip: 'Golden Seeds grow from small glowing golden saplings that are not on the map, so keep your eyes on the ground.' },
  { from: 'Hawk Live Gaming: 15 tips', tip: 'Sacred Tears are almost always in churches. Churches look like small rectangles on the map.' },
  { from: 'Hawk Live Gaming: 15 tips', tip: 'A well-upgraded ordinary weapon beats an un-upgraded legendary one.' },
  { from: 'Hawk Live Gaming: 15 tips', tip: 'Use your weapon skills all the time. FP is there to be spent.' },
  { from: 'Hawk Live Gaming: 15 tips', tip: 'Hit suspicious walls. Some are illusions hiding treasure.' },
  { from: 'Hawk Live Gaming: 15 tips', tip: "Spirit Ashes are not cheating. Summon them for every boss." },
  { from: 'Hawk Live Gaming: 15 tips', tip: 'Choose carefully which Remembrance to copy at a Walking Mausoleum; there are only a few of them.' },
  { from: "Rusty: A Beginner's Guide (Patch 1.17)", tip: 'The Determination Ash of War, which Teremity owns, makes your next hit about 60 percent stronger for around 10 seconds. It pairs well with a charged heavy attack on a greatsword.' },
  { from: "Rusty: A Beginner's Guide (Patch 1.17)", tip: "Night's Cavalry riders only patrol at night. Break their horse's legs with charged two-handed heavy attacks." },
  { from: "Rusty: A Beginner's Guide (Patch 1.17)", tip: 'Blocking light attacks with a shield and answering with a guard counter can hit as hard as a charged heavy attack.' },
  { from: "Rusty: A Beginner's Guide (Patch 1.17)", tip: 'Lhutel the Headless, a spirit ash from Tombsward Catacombs, is one of the few summons tough enough to last a whole boss fight.' },
  { from: "Rusty: A Beginner's Guide (Patch 1.17)", tip: "Radagon's Soreseal adds Strength, which helps you meet a heavy weapon's requirement. Two-handing counts your Strength as 1.5 times higher too." },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'Buffs come in different kinds, and one of each kind stacks. Flame, Grant Me Strength and Golden Vow are different kinds, so cast both before a boss.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'When you die, your runes stay where you fell, and you get one chance to pick them up. Spend a big pile before a risky fight.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'Roll toward or past an attack, not straight back from it. A backward roll often ends just as the swing arrives.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'After a boss finishes a combo, hit once or twice, then back off. Greed is what gets you hit.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'Always keep enough stamina for one roll.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'Every boss repeats its attacks. Each try teaches you a few, so a loss is never wasted.' },
  { from: 'Hawk Live Gaming: Get OP Fast', tip: 'Ten tries with no progress? Leave, get a few levels or an upgrade, and come back.' },
  { from: 'RageGamingVideos: 2026 Starter Guide', tip: 'Vigor adds the most health per point up to 40, then less up to 60. Teremity is at 35, so the next five points are the best value.' },
  { from: 'RageGamingVideos: 2026 Starter Guide', tip: 'Keep your gear under 70 percent of your weight limit so you roll normally. Teremity is at about 66 percent.' },
  { from: 'RageGamingVideos: 2026 Starter Guide', tip: 'Flame, Grant Me Strength lies at Fort Gael in Caelid. It is on the Radahn route on the Plan tab.' },
  { from: 'Youwy: Top 25 Weapons', tip: 'The Moonveil katana from Gael Tunnel needs 12 Strength, 18 Dexterity and 23 Intelligence, which Teremity already has. It builds bleed, its skill fires a slash of light, and it upgrades with Somber stones, the same stones the Godslayer needs.' },
]

export const GRIND = [
  { id: 'g1', n: 'Elder Dragon Greyoll', where: 'Fort Faroth', runes: 'About 67,000 in all, once', how: 'She lies just west of Fort Faroth in Dragonbarrow; ride east from Dragonbarrow West. Go around to her tail and keep hitting it, because she cannot fight back. Stay away from her head: her roar wakes her five young dragons. Bleed works well on her, so the Occult Hookclaws are a good pick. Wear the Gold Scarab.' },
  { id: 'g2', n: 'Night bosses', where: 'Any grace', runes: 'Several thousand each, once', how: 'Pass Time to night at a grace, then hunt the Night\'s Cavalry riders and Bell Bearing Hunters you have not beaten.' },
  { id: 'g3', n: 'Gold Scarab on', where: 'Anywhere', runes: '+20% from every kill', how: 'Wear the Gold Scarab talisman while exploring, and swap it out before bosses.' },
  { id: 'g4', n: 'Golden Runes in the pouch', where: 'Your inventory', runes: 'Whatever you are holding', how: 'Golden Runes are consumables that turn into runes. Use them before leveling.' },
]
