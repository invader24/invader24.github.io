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

var cards20160503 = [...]card{
	// --- Common Troops ---
	card{
		attr.Name:     "Fire Spirits",
		attr.Arena:    arena.Arena5,
		attr.Rarity:   rarity.Common,
		attr.Type:     typ.Troop,
		attr.Desc:     `These three Fire Spirits are on a kamikaze mission to give you a warm hug. It'd be adorable if they weren't on fire.`,
		attr.Elixir:   2,
		attr.BaseHP:   43,
		attr.BaseADam: 80,
		attr.Targets:  targets.AirAndGround,
		attr.Speed:    speed.VeryFast,
		attr.Range:    2,
		attr.DTime:    1,
		attr.Count:    3,
	}.init(),

	// --- Epic Troops ---
	card{
		attr.Name:    "Guards",
		attr.Arena:   arena.Arena7,
		attr.Rarity:  rarity.Epic,
		attr.Type:    typ.Troop,
		attr.Desc:    `Three ruthless bone brothers with shields. Knock off their shields and all that's left are three ruthless bone brothers.`,
		attr.Elixir:  3,
		attr.BaseHP:  65,
		attr.BaseSHP: 150,
		attr.DPS:     []interface{}{54, 59, 65, 71, 78, 86, 95, 104},
		attr.BaseDam: 65,
		attr.HSpeed:  1.2,
		attr.Targets: targets.Ground,
		attr.Speed:   speed.Fast,
		attr.Range:   rng.Melee,
		attr.DTime:   1,
		attr.Count:   3,
	}.init(),

	// --- Legendary Troops ---
	card{
		attr.Name:      "Lava Hound",
		attr.Arena:     arena.Arena4,
		attr.Rarity:    rarity.Legendary,
		attr.Type:      typ.Troop,
		attr.Desc:      `The Lava Hound is a majestic flying beast that attacks buildings. The Lava Pups are less majestic angry babies that attack anything.`,
		attr.Elixir:    7,
		attr.BaseHP:    3000,
		attr.DPS:       []interface{}{34, 37, 41, 45, 50},
		attr.BaseADam:  45,
		attr.BaseLavLV: 1,
		attr.HSpeed:    1.3,
		attr.Targets:   targets.Buildings,
		attr.Speed:     speed.Slow,
		attr.Range:     2,
		attr.DTime:     1,
	}.init(),
	card{
		attr.Name:    "Lava Pups",
		attr.From:    LavaHound,
		attr.Arena:   arena.Arena4,
		attr.Rarity:  rarity.Legendary,
		attr.Type:    typ.Troop,
		attr.Desc:    ``,
		attr.Elixir:  0,
		attr.BaseHP:  179,
		attr.BaseDam: 45,
		attr.HSpeed:  1,
		attr.Targets: targets.AirAndGround,
		attr.Speed:   speed.Medium,
	}.init(),
	card{
		attr.Name:    "Miner",
		attr.Arena:   arena.Arena6,
		attr.Rarity:  rarity.Legendary,
		attr.Type:    typ.Troop,
		attr.Desc:    `The Miner can burrow his way underground and appear anywhere in the Arena. It's not magic, it's a shovel.`,
		attr.Elixir:  3,
		attr.BaseHP:  1000,
		attr.DPS:     []interface{}{133, 146, 160, 176, 194},
		attr.BaseDam: 160,
		attr.CTDam:   []interface{}{64, 71, 78, 85, 94},
		attr.HSpeed:  1.2,
		attr.Targets: targets.Ground,
		attr.Speed:   speed.Fast,
		attr.Range:   rng.Melee,
		attr.DTime:   1,
	}.init(),
	card{
		attr.Name:     "Sparky",
		attr.Arena:    arena.Arena6,
		attr.Rarity:   rarity.Legendary,
		attr.Type:     typ.Troop,
		attr.Desc:     `Sparky slowly charges up, then unloads MASSIVE area damage. Overkill isn't in her vocabulary.`,
		attr.Elixir:   6,
		attr.BaseHP:   1200,
		attr.DPS:      []interface{}{260, 286, 314, 345, 379},
		attr.BaseADam: 1300,
		attr.HSpeed:   5,
		attr.Targets:  targets.Ground,
		attr.Speed:    speed.Slow,
		attr.Range:    4.5,
		attr.DTime:    1,
	}.init(),

	// --- Rare Buildings ---
	card{
		attr.Name:      "Furnace",
		attr.Arena:     arena.Arena5,
		attr.Rarity:    rarity.Rare,
		attr.Type:      typ.Building,
		attr.Desc:      `The Furnace spawns two Fire Spirits at a time. It also makes great brick-oven pancakes.`,
		attr.Elixir:    4,
		attr.BaseHP:    570,
		attr.BaseFspLV: 3,
		attr.SSpeed:    10,
		attr.DTime:     1,
		attr.LTime:     50,
	}.init(),
}
