package card

import (
	"github.com/asukakenji/clash-royale/arena"
	"github.com/asukakenji/clash-royale/attr"
	"github.com/asukakenji/clash-royale/rarity"
	"github.com/asukakenji/clash-royale/typ"
)

// Card with Level
type CardWithLevel struct {
	Card  Card
	Level int
}

func (c CardWithLevel) Name() string {
	return c.Card.Name()
}

func (c CardWithLevel) Arena() arena.Arena {
	return c.Card.Arena()
}

func (c CardWithLevel) Rarity() rarity.Rarity {
	return c.Card.Rarity()
}

func (c CardWithLevel) Type() typ.Type {
	return c.Card.Type()
}

func (c CardWithLevel) Description() string {
	return c.Card.Description()
}

func (c CardWithLevel) Elixir() int {
	return c.Card.Elixir()
}

func (c CardWithLevel) Value(a attr.Attribute) interface{} {
	return c.Card.ValueAtLevel(a, c.Level)
}

func (c CardWithLevel) FormattedValue(a attr.Attribute) string {
	return c.Card.FormattedValueAtLevel(a, c.Level)
}
