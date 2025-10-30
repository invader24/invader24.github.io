package arena

import (
	"fmt"
)

// Arena
type Arena int8

const (
	Arena0 Arena = iota
	Arena1
	Arena2
	Arena3
	Arena4
	Arena5
	Arena6
	Arena7
	Arena8
)

func ForEach(f func(Arena)) {
	for i := range arenas {
		f(Arena(i))
	}
}

func (a Arena) Id() int {
	return arenas[a].id
}

func (a Arena) String() string {
	return fmt.Sprintf("Arena %d: %s", arenas[a].id, arenas[a].name)
}

func (a Arena) Name() string {
	return arenas[a].name
}

func (a Arena) Trophies() int {
	return arenas[a].trophies
}

/////////////
// Private //
/////////////

type arena struct {
	id       int
	name     string
	trophies int
}

// static
var arenas = [...]*arena{
	&arena{0, "Training Camp", -1},
	&arena{1, "Goblin Stadium", 0},
	&arena{2, "Bone Pit", 400},
	&arena{3, "Barbarian Bowl", 800},
	&arena{4, "P.E.K.K.A's Playhouse", 1100},
	&arena{5, "Spell Valley", 1400},
	&arena{6, "Builder's Workshop", 1700},
	&arena{7, "Royal Arena", 2000},
	&arena{8, "Legendary Arena", 3000},
}
