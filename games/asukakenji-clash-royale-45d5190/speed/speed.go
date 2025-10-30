package speed

// Speed
type Speed int8

const (
	Slow Speed = iota
	Medium
	Fast
	VeryFast
)

func ForEach(f func(Speed)) {
	for i := range speeds {
		f(Speed(i))
	}
}

func (s Speed) Id() int {
	return int(s)
}

func (s Speed) String() string {
	return string(speeds[s])
}

func (s Speed) Name() string {
	return string(speeds[s])
}

/////////////
// Private //
/////////////

type speed string

var speeds = [...]speed{
	speed("Slow"),
	speed("Medium"),
	speed("Fast"),
	speed("Very Fast"),
}
