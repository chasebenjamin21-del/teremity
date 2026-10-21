"""Chase's own map markers (from his Switch 2 map video), decoded to likely targets."""
import json, numpy as np
D = "../data/"
xf = json.load(open(D + "_xf.json"))["px2data"]; cx, cy = xf
E = json.load(open(D + "_entities.json"))
G = json.load(open(D + "_graces.json"))
def to_data(px, py): return ((px - cx[1]) / cx[0], (py - cy[1]) / cy[0])
# (b_010 pixel x, y, symbol, our best identification, why)
M = [
 (878, 787, "flag", "Mistwood Ruins", "Ruins in the Mistwood. A Runebear guards a cellar, and Blaidd's howl starts his quest here."),
 (699, 823, "house", "Coastal Cave", "Two Demi-Human Chiefs at the end. If you met Boc, the talking bush, he waits here for his stolen belongings."),
 (770, 840, "diamond", "Incantation Scarab", "The reward for the Homing Instinct painting: a head piece that boosts incantations. Stand where the painting shows, north-west of Seaside Ruins, and a ghost appears with it."),
 (1165, 836, "house", "Redmane Castle", "Radahn's castle. During the Radahn Festival this is where the big fight starts."),
 (845, 873, "skull", "Runebear disguised as a Wandering Noble", "Kill the lone sword-holding noble east of Agheel Lake South. It turns into a Runebear and drops a Larval Tear."),
 (836, 889, "skull", "Bloodhound Knight Darriwil", "Boss of the Forlorn Hound Evergaol. Drops the Bloodhound's Fang curved greatsword."),
 (506, 98, "diamond", "Ruin-Strewn Precipice", "A Golden Seed, Somber Smithing Stones and the Magma Wyrm Makar boss along the cliffs."),
 (543, 117, "house", "Grand Lift of Dectus", "The big lift up to the Altus Plateau. Both Dectus Medallion halves make it work."),
 (1117, 698, "house", "Sellia, Town of Sorcery", "Light the three braziers to open the barrier and reach its loot, including Night Comet."),
 (368, 142, "house", "Caria Manor", "Ranni's family manor. Royal Knight Loretta waits at the top, and three areas full of loot open behind it."),
 (575, 424, "skull", "Tibia Mariner", "A ghostly boatman boss on the east Liurnia shore near the Carian Study Hall."),
 (441, 256, "turtle", "Walking Mausoleum (central Liurnia)", "A giant stone tomb on legs. Hit its feet, climb up, and use a Remembrance to duplicate a boss item."),
 (956, 662, "diamond", "Gael Tunnel", "The Moonveil katana is inside, guarded by a Magma Wyrm."),
 (1093, 649, "diamond", "Sellia Crystal Tunnel", "The Fallingstar Beast boss here drops a Somber Smithing Stone [6] for the Godslayer and a Somberstone Miner's Bell Bearing. The Faithful's Canvas Talisman is here too."),
 (833, 727, "diamond", "Homing Instinct Painting", "The painting in Limgrave's Artist's Shack. It points to the Incantation Scarab near the Dragon-Burnt Ruins."),
 (816, 984, "flag", "Callu Baptismal Church", "A Sacred Tear in the church, next to the Ailing Village."),
 (375, 85, "skull", "Royal Knight Loretta", "Caria Manor's final boss. Drops Loretta's Greatbow and unlocks Ranni's Rise and the Three Sisters."),
 (287, 460, "skull", "Erdtree Avatar (Liurnia southwest)", "A giant root guardian under the Minor Erdtree, plus a Cerulean Crystal Tear."),
 (340, 542, "skull", "Omenkiller", "Boss of the Village of the Albinaurics. There's a Larval Tear in the village graveyard too."),
 (280, 603, "house", "Chelona's Rise", "A tower near the Moonlight Altar, in Ranni's quest territory."),
 (729, 989, "skull", "Miranda the Blighted Bloom", "A giant flower boss in Tombsward Cave. Drops the Viridian Amber Medallion; a cookbook is elsewhere in the cave."),
 (1029, 586, "flag", "Bell Bearing Hunter (Dragonbarrow)", "At night this shack is guarded by a Bell Bearing Hunter who drops a merchant's bell bearing."),
 (403, 462, "skull", "Grafted Scion disguised as a Giant Crayfish", "The patrolling crayfish south of Fallen Ruins of the Lake. It drops a Larval Tear."),
 (770, 987, "turtle", "Walking Mausoleum (Weeping Peninsula)", "This one walks around the western Weeping Peninsula."),
]
out = []
for i, (px, py, sym, ident, why) in enumerate(M):
    x, y = to_data(px, py)
    out.append(dict(id=f"m{i+1}", x=round(x, 2), y=round(y, 2), symbol=sym, title=ident, note=why))
json.dump(out, open(D + "markers.json", "w"), indent=1)
print(len(out))
