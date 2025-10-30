package targets

// Targets
type Targets int8

const (
	Ground Targets = iota
	AirAndGround
	Buildings
)

func ForEach(f func(Targets)) {
	for i := range targetses {
		f(Targets(i))
	}
}

func (t Targets) Id() int {
	return int(t)
}

func (t Targets) String() string {
	return string(targetses[t])
}

func (t Targets) Name() string {
	return string(targetses[t])
}

/////////////
// Private //
/////////////

type targets string

var targetses = [...]targets{
	targets("Ground"),
	targets("Air & Ground"),
	targets("Buildings"),
}
