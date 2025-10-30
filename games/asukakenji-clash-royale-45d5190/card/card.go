package card

import (
	"github.com/asukakenji/clash-royale/arena"
	"github.com/asukakenji/clash-royale/attr"
	"github.com/asukakenji/clash-royale/rarity"
	"github.com/asukakenji/clash-royale/typ"
)

// Card
type Card int8

const (
	// --- 2016-01-04 ---
	Knight          Card = iota // 2016-01-04 (Common Troops)
	Archers                     // 2016-01-04
	Bomber                      // 2016-01-04
	Goblins                     // 2016-01-04
	SpearGoblins                // 2016-01-04
	Skeletons                   // 2016-01-04
	Minions                     // 2016-01-04
	Barbarians                  // 2016-01-04
	MinionHorde                 // 2016-01-04
	Giant                       // 2016-01-04 (Rare Troops)
	Musketeer                   // 2016-01-04
	MiniPekka                   // 2016-01-04
	Valkyrie                    // 2016-01-04
	HogRider                    // 2016-01-04
	Wizard                      // 2016-01-04
	Witch                       // 2016-01-04 (Epic Troops)
	SkeletonArmy                // 2016-01-04
	BabyDragon                  // 2016-01-04
	Prince                      // 2016-01-04
	GiantSkeleton               // 2016-01-04
	Balloon                     // 2016-01-04
	Pekka                       // 2016-01-04
	Golem                       // 2016-01-04
	Golemite                    // TODO: Remove this!
	Cannon                      // 2016-01-04 (Common Buildings)
	Tesla                       // 2016-01-04
	Mortar                      // 2016-01-04
	GobllinHut                  // 2016-01-04 (Rare Buildings)
	BombTower                   // 2016-01-04
	Tombstone                   // 2016-01-04
	BarbarianHut                // 2016-01-04
	InfernoTower                // 2016-01-04
	ElixirCollector             // 2016-01-04
	XBow                        // 2016-01-04 (Epic Buildings)
	Arrows                      // 2016-01-04 (Common Spells)
	Zap                         // 2016-01-04
	Fireball                    // 2016-01-04 (Rare Spells)
	Rocket                      // 2016-01-04
	Lightning                   // 2016-01-04 (Epic Spells)
	GoblinBarrel                // 2016-01-04
	Rage                        // 2016-01-04
	Freeze                      // 2016-01-04
	Mirror                      // 2016-01-04
	// --- 2016-02-29 ---
	RoyalGiant      // 2016-02-29 (Common Troops)
	ThreeMusketeers // 2016-02-29 (Rare Troops)
	DarkPrince      // 2016-02-29 (Epic Troops)
	IceWizard       // 2016-02-29 (Legendary Troops)
	Princess        // 2016-02-29 (Legendary Troops)
	Poison          // 2016-02-29 (Epic Spells)
	// --- 2016-05-03 ---
	FireSpirits // 2016-05-03 (Common Troops)
	Guards      // 2016-05-03 (Epic Troops)
	LavaHound   // 2016-05-03 (Legendary Troops)
	LavaPups    // TODO: Remove this!
	Miner       // 2016-05-03 (Legendary Troops)
	Sparky      // 2016-05-03 (Legendary Troops)
	Furnace     // 2016-05-03 (Rare Buildings)
	// --- 2016-07-04 ---
	IceSpirit  // 2016-07-04 (Common Troops)
	Bowler     // 2016-07-04 (Epic Troops)
	Lumberjack // 2016-07-04 (Legendary Troops)
	TheLog     // 2016-07-04 (Legendary Spells)
	// --- 2016-09-19 ---
	MegaMinion    // 2016-09-19 (Rare Troops)
	InfernoDragon // 2016-09-30 (Legendary Troops)
	IceGolem      // 2016-10-14 (Rare Troops)
	Graveyard     // 2016-10-28 (Legendary Spells)
	// --- 2016-11-01 ---
	Tornado         // 2016-11-11 (Epic Spells)
	EliteBarbarians // 2016-11-25 (Common Troops)
	Clone           // 2016-12-09 (Epic Spells)
	ElectroWizard   // 2016-12-30 (Legendary Troops)
	// --- 2016-12-15 ---
	DartGoblin  // 2017-01-13 (Rare Troops)
	Executioner // 2017-01-27 (Epic Troops)
	BattleRam   // 2017-02-10 (Rare Troops)
	GoblinGang  // 2017-02-24 (Common Troops)
	// --- 2017-03-13 ---
	Bandit     // 2017-03-24 (Legendary Troops)
	Heal       // 2017-05-01 (Rare Speels)
	NightWitch // 2017-05-31 (Legendary Troops)
	Bats       // 2017-??-?? (Common Troops)
	// --- 2017-06-12 ---
	SkeletonBarrel // 2017-??-?? (Common Troops)
	FlyingMachine  // 2017-??-?? (Rare Troops)
	CannonCart     // 2017-??-?? (Epic Troops)
	MegaKnight     // 2017-??-?? (Legendary Troops)
)

func ForEach(f func(Card)) {
	for i := range cards {
		f(Card(i))
	}
}

func ForEachOfArena(a arena.Arena, f func(Card)) {
	ForEach(func(c Card) {
		if c.Arena() == a {
			f(c)
		}
	})
}

func ForEachOfRarity(r rarity.Rarity, f func(Card)) {
	ForEach(func(c Card) {
		if c.Rarity() == r {
			f(c)
		}
	})
}

func ForEachOfType(t typ.Type, f func(Card)) {
	ForEach(func(c Card) {
		if c.Type() == t {
			f(c)
		}
	})
}

func (c Card) Name() string {
	return cards[c][attr.Name].(string)
}

func (c Card) From() Card {
	return cards[c][attr.From].(Card)
}

func (c Card) Arena() arena.Arena {
	return cards[c][attr.Arena].(arena.Arena)
}

func (c Card) Rarity() rarity.Rarity {
	return cards[c][attr.Rarity].(rarity.Rarity)
}

func (c Card) Type() typ.Type {
	return cards[c][attr.Type].(typ.Type)
}

func (c Card) Description() string {
	return cards[c][attr.Desc].(string)
}

func (c Card) Elixir() int {
	return cards[c][attr.Elixir].(int)
}

func (c Card) MaxLevel() int {
	return c.Rarity().MaxLevel()
}

func (c Card) HasAttribute(a attr.Attribute) bool {
	_, ok := cards[c][a]
	return ok
}

func (c Card) Value(a attr.Attribute) interface{} {
	if value, ok := cards[c][a]; ok {
		return value
	}
	return nil
}

func (c Card) Values(a attr.Upgradable) []interface{} {
	return c.Value(a).([]interface{})
}

func (c Card) ValueAtLevel(a attr.Attribute, level int) interface{} {
	switch a := a.(type) {
	case attr.Fixed:
		return c.Value(a)
	case attr.Upgradable:
		return c.Value(a).([]interface{})[level-1]
	case attr.Generated:
		return c.ValueAtLevel(a.TargetAttribute(), level)
	default:
		panic("Unknown attribute type")
	}
}

func (c Card) FormattedValue(a attr.Fixed) string {
	if value := c.Value(a); value != nil {
		return a.FormatValue(value)
	}
	return ""
}

func (c Card) FormattedValues(a attr.Upgradable) []string {
	if values := c.Values(a); values != nil {
		return a.FormatValues(values)
	}
	return nil
}

func (c Card) FormattedValueAtLevel(a attr.Attribute, level int) string {
	switch a := a.(type) {
	case attr.Fixed:
		return c.FormattedValue(a)
	case attr.Upgradable:
		return c.FormattedValues(a)[level-1]
	case attr.Generated:
		return c.FormattedValueAtLevel(a.TargetAttribute(), level)
	default:
		panic("Unknown attribute type")
	}
}

func (c Card) ForEachFixedAttribute(f func(attr.Fixed)) {
	// Note:
	// It is necessary to iterate ATTRIBUTES instead of fieldMap,
	// since the order of the keys in fieldMap is random.
	attr.ForEachFixed(func(a attr.Fixed) {
		if c.HasAttribute(a) {
			f(a)
		}
	})
}

func (c Card) ForEachUpgradableAttribute(f func(attr.Upgradable)) {
	// Note:
	// It is necessary to iterate ATTRIBUTES instead of fieldMap,
	// since the order of the keys in fieldMap is random.
	attr.ForEachUpgradable(func(a attr.Upgradable) {
		if c.HasAttribute(a) {
			f(a)
		}
	})
}

/////////////
// Private //
/////////////

type card map[attr.Attribute]interface{}

var cards = append(cards20160104[:], append(cards20160229[:], cards20160503[:]...)...)

// constructor
func (c card) init() card {
	max := c[attr.Rarity].(rarity.Rarity).MaxLevel()

	// "Compile" the "Generated"s to "Upgradable"s
	for k, v := range c {
		if attr, ok := k.(attr.Generated); ok {
			c[attr.TargetAttribute()] = attr.GenerateValues(v, max)
		}
	}

	return c
}
