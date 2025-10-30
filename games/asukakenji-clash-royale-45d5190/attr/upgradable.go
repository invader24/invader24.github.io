package attr

import (
	"github.com/asukakenji/clash-royale/format"
)

// Upgradable
type Upgradable int8

const (
	HP Upgradable = iota
	SHP
	DPS
	DPSL
	DPSH
	CTDPS
	Dam
	DamL
	DamH
	ADam
	CDam
	DDam
	CTDam
	GobLV
	SgoLV
	SkeLV
	BarLV
	FspLV
	GolLV
	LavLV
	DurU
	FDurU
	MCLV
	MRLV
	MELV
	MLLV
)

func ForEachUpgradable(f func(Upgradable)) {
	for i := range upgradableAttributes {
		f(Upgradable(i))
	}
}

func (a Upgradable) Attribute() {
}

func (a Upgradable) String() string {
	return upgradableAttributes[a].name
}

func (a Upgradable) Name() string {
	return upgradableAttributes[a].name
}

func (a Upgradable) FormatValues(values []interface{}) []string {
	strings := make([]string, len(values))
	for i, v := range values {
		strings[i] = upgradableAttributes[a].formatFunc(v)
	}
	return strings
}

/////////////
// Private //
/////////////

type upgradableAttribute struct {
	name       string
	formatFunc func(value interface{}) string
}

var upgradableAttributes = [...]*upgradableAttribute{
	&upgradableAttribute{"Hitpoints", format.Int},
	&upgradableAttribute{"Shield Hitpoints", format.Int},
	&upgradableAttribute{"Damage per Second", format.Int},
	&upgradableAttribute{"Damage per Second (L)", format.Int},
	&upgradableAttribute{"Damage per Second (H)", format.Int},
	&upgradableAttribute{"Crown Tower Damage/sec", format.Int},
	&upgradableAttribute{"Damage", format.Int},
	&upgradableAttribute{"Damage (L)", format.Int},
	&upgradableAttribute{"Damage (H)", format.Int},
	&upgradableAttribute{"Area Damage", format.Int},
	&upgradableAttribute{"Charge Damage", format.Int},
	&upgradableAttribute{"Death Damage", format.Int},
	&upgradableAttribute{"Crown Tower Damage", format.Int},
	&upgradableAttribute{"Goblin Level", format.Int},
	&upgradableAttribute{"Spear Goblin Level", format.Int},
	&upgradableAttribute{"Skeleton Level", format.Int},
	&upgradableAttribute{"Barbarian Level", format.Int},
	&upgradableAttribute{"Fire Spirits Level", format.Int},
	&upgradableAttribute{"Golemite Level", format.Int},
	&upgradableAttribute{"Lava Pups Level", format.Int},
	&upgradableAttribute{"Duration", format.Time},
	&upgradableAttribute{"Freeze Duration", format.Time},
	&upgradableAttribute{"Mirrored Common Level", format.Int},
	&upgradableAttribute{"Mirrored Rare Level", format.Int},
	&upgradableAttribute{"Mirrored Epic Level", format.Int},
	&upgradableAttribute{"Mirrored Legendary Level", format.Int},
	//&upgradableAttribute{"Cards Required", format.Int},
	//&upgradableAttribute{"Gold Required", format.Int},
	//&upgradableAttribute{"Experience Gained", format.Int},
}
