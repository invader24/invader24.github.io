package king

// King
type King int8

func ForEachLevel(f func(King)) {
	for i := range experienceRequired {
		f(King(i + 1))
	}
}

func MaxLevel() int {
	return len(experienceRequired)
}

func (k King) Level() int {
	return int(int8(k))
}

func (k King) ExperienceRequired() int {
	return experienceRequired[int8(k)-1]
}

var experienceRequired = []int{0, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 30000, 80000, 100000}
