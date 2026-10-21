// Region text, written for Truc: what each place looks like, how it feels, and roughly what level it suits.
// "looks" powers the "pick what you see" orientation picker.
export const REGIONS = {
  limgrave: {
    name: 'Limgrave', tone: 'meadow', level: '1 to 40', status: 'explored',
    blurb: 'Where the journey started. Rolling green fields, golden trees and old ruins, with Stormveil Castle on the cliffs in the north-west.',
    looks: 'Green grass, golden leaves, blue sky, crumbling stone ruins',
    subs: { Stormhill: 'The windy ridge north of the start, on the road to Stormveil Castle.', 'Stormveil Castle': "Godrick's castle. Already cleared.", 'Stranded Graveyard': 'The underground tutorial area where the game began.' },
  },
  weeping: {
    name: 'Weeping Peninsula', tone: 'rain', level: '20 to 40', status: 'explored',
    blurb: 'The rainy peninsula south of Limgrave, across the Bridge of Sacrifice. Castle Morne guards its southern tip.',
    looks: 'Grey sky and drizzle, wet green grass, the sea on both sides',
  },
  liurnia: {
    name: 'Liurnia of the Lakes', tone: 'lake', level: '40 to 70', status: 'explored',
    blurb: 'A huge shallow lake wrapped in mist and ringed by cliffs. Raya Lucaria Academy rises from the water in the middle.',
    looks: 'Ankle-deep blue water, mist, blue crystals, a giant academy on an island',
    subs: {
      'Raya Lucaria Academy': 'The sorcery school where you beat Rennala.',
      'Bellum Highway': 'The cliff road up the east side, toward the Grand Lift of Dectus.',
      'Ruin-Strewn Precipice': 'A cliff-face dungeon in the north that climbs up toward Altus.',
      'Moonlight Altar': "A hidden plateau in the south-west, reached only through Ranni's quest.",
    },
  },
  caelid: {
    name: 'Caelid', tone: 'rot', level: '60 to 100', status: 'partly explored',
    blurb: 'A scarred red land of scarlet rot, giant dogs and crows. Dragonbarrow is its high, rocky north. Radahn waits in the far south-east.',
    looks: 'Red sky, rust-red ground, rot swamps, huge craters',
    subs: {
      Dragonbarrow: 'The high cliffs north of Caelid, full of dragons, with the Bestial Sanctum at the top.',
      'Swamp of Aeonia': 'The giant scarlet-rot swamp in the middle of Caelid.',
    },
  },
  altus: {
    name: 'Altus Plateau', tone: 'gold', level: '70 to 100', status: 'next',
    blurb: 'Golden autumn uplands above Liurnia, reached by the Grand Lift of Dectus. Windmills, open fields, and the Erdtree looming huge and close.',
    looks: 'Golden-yellow trees, windmills, the Erdtree towering nearby',
    subs: { 'Capital Outskirts': 'The battle-scarred land right outside the capital walls.' },
  },
  gelmir: {
    name: 'Mt. Gelmir', tone: 'ash', level: '80 to 110', status: 'later',
    blurb: 'A black volcano of ash and lava north-west of Altus. Volcano Manor is carved into its slopes.',
    looks: 'Black rock, lava, ash in the air, a red-orange glow',
    subs: { 'Volcano Manor': 'A manor of assassins inside the mountain.' },
  },
  leyndell: {
    name: 'Leyndell, Royal Capital', tone: 'gold', level: '90 to 120', status: 'later',
    blurb: 'The golden capital at the foot of the Erdtree. Grand walls, cathedrals and enormous statues.',
    looks: 'Golden stone city, giant walls, the Erdtree right overhead',
  },
  mountaintops: {
    name: 'Mountaintops of the Giants', tone: 'snow', level: '110 to 140', status: 'later',
    blurb: 'Snowy peaks past the capital, full of giant ruins. Late game.',
    looks: 'Snow, howling wind, frozen giant bones',
  },
  snowfield: {
    name: 'Consecrated Snowfield', tone: 'snow', level: '130 to 150', status: 'later',
    blurb: 'A hidden, blizzard-swept snowfield. Optional and very late.',
    looks: 'White-out blizzard, frozen ruins',
  },
  haligtree: {
    name: "Miquella's Haligtree", tone: 'snow', level: '140 to 160', status: 'later',
    blurb: 'A secret tree-city in the frozen far north. Optional and the hardest area in the base game.',
    looks: 'Giant pale tree branches, golden leaves on snow',
  },
  farum: {
    name: 'Crumbling Farum Azula', tone: 'storm', level: '140 to 160', status: 'later',
    blurb: 'Ruined dragon temples floating in a storm. Near the end of the story.',
    looks: 'Broken temples in the sky, lightning, dragons',
  },
  siofra: {
    name: 'Siofra River', tone: 'deep', level: '30 to 90', status: 'not yet', under: true,
    blurb: 'A whole world underground, under a fake starry sky: purple-blue ruins, waterfalls and giant stone ancestors. Nokron opens up after Radahn falls.',
    looks: 'Underground, a starry "sky" overhead, blue-purple light, ruins',
    subs: {
      'Nokron, Eternal City': 'An ancient city that only opens after Radahn is defeated.',
      'Mohgwyn Palace': 'A blood-red underground palace. Very late, and the best rune farm in the game.',
      'Deeproot Depths': 'The roots of the Erdtree, deep underground. Late game.',
    },
  },
  ainsel: {
    name: 'Ainsel River', tone: 'deep', level: '50 to 120', status: 'not yet', under: true,
    blurb: 'A dark underground river beneath Liurnia. Further down are Nokstella and the Lake of Rot.',
    looks: 'Underground, dark stone, a faint starry ceiling, ant-like enemies',
    subs: { 'Lake of Rot': 'A lake of scarlet rot far underground. Bring rot protection.' },
  },
  roundtable: {
    name: 'Roundtable Hold', tone: 'hall', level: 'Hub', status: 'hub',
    blurb: 'Your home base: the blacksmith, Enia, the Twin Maiden Husks and the spirit tuner. You only get here by fast travel.',
    looks: 'Candle-lit stone hall with a big round table',
  },
}

export const REGION_ORDER = ['limgrave', 'weeping', 'liurnia', 'caelid', 'altus', 'gelmir', 'leyndell', 'mountaintops', 'snowfield', 'haligtree', 'farum', 'siofra', 'ainsel']

// Big things you can see from far away, used to say which way they are from where you stand.
export const LANDMARKS = [
  { id: 'erdtree', n: 'the Erdtree', x: 118.5, y: 104, hint: 'the giant glowing golden tree on the horizon' },
  { id: 'stormveil', n: 'Stormveil Castle', x: 87.5, y: 178, hint: 'the castle on the cliffs' },
  { id: 'academy', n: 'Raya Lucaria Academy', x: 55.2, y: 136, hint: 'the academy towers on the lake' },
  { id: 'redmane', n: 'Redmane Castle', x: 158, y: 195, hint: "Radahn's castle in the south-east" },
  { id: 'morne', n: 'Castle Morne', x: 110.5, y: 225, hint: 'the castle at the southern tip' },
  { id: 'dectus', n: 'the Grand Lift of Dectus', x: 77, y: 107.7, hint: 'the giant lift up the cliffs' },
  { id: 'caria', n: 'Caria Manor', x: 58, y: 108.5, hint: 'the manor on the northern cliffs' },
]
