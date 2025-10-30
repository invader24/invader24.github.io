package king

// Arena Tower
type ArenaTower int8

func ArenaTowerAtLevel(level int) ArenaTower {
	return ArenaTower(int8(level))
}

func (t ArenaTower) Level() int {
	return int(int8(t))
}

func (_ ArenaTower) Range() float64 {
	return 7.5
}

func (_ ArenaTower) HitSpeed() float64 {
	return 0.8
}

func (t ArenaTower) Hitpoints() int {
	return atHitpoints[int8(t)-1]
}

func (t ArenaTower) Damage() int {
	return atDamages[int8(t)-1]
}

var atHitpoints = []int{1400, 1512, 1624, 1750, 1890, 2030, 2184, 2352, 2534, 2786, 3052, 3346, 3668}
var atDamages = []int{50, 54, 58, 62, 67, 72, 78, 84, 90, 99, 109, 119, 131}
