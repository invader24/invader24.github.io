package typ

// Type
type Type int8

const (
	Troop Type = iota
	Building
	Spell
)

func ForEach(f func(Type)) {
	for i := range types {
		f(Type(i))
	}
}

func (t Type) Id() int {
	return int(t)
}

func (t Type) String() string {
	return string(types[t])
}

func (t Type) Name() string {
	return string(types[t])
}

/////////////
// Private //
/////////////

type _type string

var types = [...]_type{
	_type("Troop"),
	_type("Building"),
	_type("Spell"),
}
