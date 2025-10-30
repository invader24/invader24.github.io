package card

import (
	"github.com/asukakenji/clash-royale/arena"
	"github.com/asukakenji/clash-royale/attr"
	"github.com/asukakenji/clash-royale/rarity"
	"github.com/asukakenji/clash-royale/rng"
	"github.com/asukakenji/clash-royale/speed"
	"github.com/asukakenji/clash-royale/targets"
	"github.com/asukakenji/clash-royale/typ"
)

var cards20160229 = [...]card{
	// --- Common Troops ---
	card{
		attr.Name:    "Royal Giant",
		attr.Arena:   arena.Arena7,
		attr.Rarity:  rarity.Common,
		attr.Type:    typ.Troop,
		attr.Desc:    `Destroying enemy buildings with his massive cannon is his job; making a raggedy blond beard look good is his passion.`,
		attr.Elixir:  6,
		attr.BaseHP:  1200,
		attr.DPS:     []interface{}{44, 50, 55, 60, 64, 70, 77, 84, 93, 102, 112, 123, 135},
		attr.BaseDam: 75,
		attr.HSpeed:  1.7,
		attr.Targets: targets.Buildings,
		attr.Speed:   speed.Slow,
		attr.Range:   6.5,
		attr.DTime:   2,
	}.init(),

	// --- Rare Troops ---
	card{
		attr.Name:    "Three Musketeers",
		attr.Arena:   arena.Arena7,
		attr.Rarity:  rarity.Rare,
		attr.Type:    typ.Troop,
		attr.Desc:    `Trio of powerful, independent markswomen, fighting for justice and honor. Disrespecting them would not be just a mistake, it would be a cardinal sin!`,
		attr.Elixir:  9,
		attr.BaseHP:  340,
		attr.DPS:     []interface{}{90, 100, 110, 120, 132, 145, 160, 175, 192, 211, 232},
		attr.BaseDam: 100,
		attr.HSpeed:  1.1,
		attr.Targets: targets.AirAndGround,
		attr.Speed:   speed.Medium,
		attr.Range:   6,
		attr.DTime:   1,
		attr.Count:   3,
	}.init(),

	// --- Epic Troops ---
	card{
		attr.Name:     "Dark Prince",
		attr.Arena:    arena.Arena7,
		attr.Rarity:   rarity.Epic,
		attr.Type:     typ.Troop,
		attr.Desc:     `The Dark Prince deals area damage and lets his spiked club do the talking for him - because when he does talk, it sounds like he has a bucket on his head.`,
		attr.Elixir:   4,
		attr.BaseHP:   735,
		attr.BaseSHP:  200,
		attr.DPS:      []interface{}{96, 106, 116, 128, 140, 154, 170, 186},
		attr.BaseADam: 145,
		attr.CDam:     []interface{}{290, 319, 350, 385, 423, 464, 510, 559},
		attr.HSpeed:   1.5,
		attr.Targets:  targets.Ground,
		attr.Speed:    speed.Medium,
		attr.Range:    rng.Melee,
		attr.DTime:    1,
	}.init(),

	// --- Legendary Troops ---
	card{
		attr.Name:     "Ice Wizard",
		attr.Arena:    arena.Arena5,
		attr.Rarity:   rarity.Legendary,
		attr.Type:     typ.Troop,
		attr.Desc:     `This chill caster throws ice shards that slow down enemies' movement and attack speed. Despite being freezing cold, he has a handlebar mustache that's too hot for TV.`,
		attr.Elixir:   3,
		attr.BaseHP:   665,
		attr.DPS:      []interface{}{42, 46, 50, 55, 60},
		attr.BaseADam: 63,
		attr.HSpeed:   1.5,
		attr.Targets:  targets.AirAndGround,
		attr.Speed:    speed.Medium,
		attr.Range:    5.5,
		attr.DTime:    1,
	}.init(),
	card{
		attr.Name:     "Princess",
		attr.Arena:    arena.Arena7,
		attr.Rarity:   rarity.Legendary,
		attr.Type:     typ.Troop,
		attr.Desc:     `This stunning Princess shoots flaming arrows from long range. If you're feeling warm feelings towards her, it's probably because you're on fire.`,
		attr.Elixir:   3,
		attr.BaseHP:   216,
		attr.DPS:      []interface{}{46, 51, 56, 62, 68},
		attr.BaseADam: 140,
		attr.HSpeed:   3,
		attr.Targets:  targets.AirAndGround,
		attr.Speed:    speed.Medium,
		attr.Range:    9,
		attr.DTime:    1,
	}.init(),

	// --- Epic Spells ---
	card{
		attr.Name:   "Poison",
		attr.Arena:  arena.Arena5,
		attr.Rarity: rarity.Epic,
		attr.Type:   typ.Spell,
		attr.Desc:   `Covers the area in a deadly toxin, damaging enemy troops and buildings over time. Yet somehow leaves the grass green and healthy. Go figure!`,
		attr.Elixir: 4,
		attr.DPS:    []interface{}{57, 62, 68, 75, 83, 91, 100, 110},
		attr.CTDPS:  []interface{}{23, 25, 28, 30, 34, 37, 40, 44},
		attr.DurF:   8,
		attr.Radius: 3.5,
	}.init(),
}
