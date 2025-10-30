package attr

import (
	"github.com/asukakenji/clash-royale/format"
)

// Fixed
type Fixed int8

const (
	Name Fixed = iota
	From
	Arena
	Rarity
	Type
	Desc
	Elixir
	SSpeed
	PSpeed
	HSpeed
	Targets
	Speed
	Range
	DTime
	LTime
	DurF
	SDurF
	Boost
	Radius
	Count
	GobCount
)

func ForEachFixed(f func(Fixed)) {
	for i := range fixedAttributes {
		f(Fixed(i))
	}
}

func (a Fixed) Attribute() {
}

func (a Fixed) String() string {
	return fixedAttributes[a].name
}

func (a Fixed) Name() string {
	return fixedAttributes[a].name
}

func (a Fixed) FormatValue(value interface{}) string {
	return fixedAttributes[a].formatFunc(value)
}

/////////////
// Private //
/////////////

type fixedAttribute struct {
	name       string
	formatFunc func(value interface{}) string
}

var fixedAttributes = [...]*fixedAttribute{
	&fixedAttribute{"Name", format.String},
	&fixedAttribute{"From", format.Dummy},
	&fixedAttribute{"Arena", format.String},
	&fixedAttribute{"Rarity", format.String},
	&fixedAttribute{"Type", format.String},
	&fixedAttribute{"Description", format.String},
	&fixedAttribute{"Elixir Cost", format.Elixir},
	&fixedAttribute{"Spawn Speed", format.Time},
	&fixedAttribute{"Production Speed", format.Time},
	&fixedAttribute{"Hit Speed", format.Time},
	&fixedAttribute{"Targets", format.String},
	&fixedAttribute{"Speed", format.String},
	&fixedAttribute{"Range", format.Range},
	&fixedAttribute{"Deploy Time", format.Time},
	&fixedAttribute{"Lifetime", format.Time},
	&fixedAttribute{"Duration", format.Time},
	&fixedAttribute{"Stun Duration", format.Time},
	&fixedAttribute{"Boost", format.Percentage},
	&fixedAttribute{"Radius", format.Float},
	&fixedAttribute{"Count", format.Count},
	&fixedAttribute{"Goblin Count", format.Count},
}
