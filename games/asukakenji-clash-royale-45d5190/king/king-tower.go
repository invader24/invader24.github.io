package king

// King Tower
type KingTower int8

func KingTowerAtLevel(level int) KingTower {
	return KingTower(int8(level))
}

func (t KingTower) Level() int {
	return int(int8(t))
}

func (_ KingTower) Range() float64 {
	return 7
}

func (_ KingTower) HitSpeed() float64 {
	return 1
}

func (t KingTower) Hitpoints() int {
	return ktHitpoints[int8(t)-1]
}

func (t KingTower) Damage() int {
	return ktDamages[int8(t)-1]
}

var ktHitpoints = []int{2400, 2568, 2736, 2904, 3096, 3312, 3528, 3768, 4008, 4392, 4824, 5304, 5832}
var ktDamages = []int{50, 53, 57, 60, 64, 69, 73, 78, 83, 91, 100, 110, 121}
