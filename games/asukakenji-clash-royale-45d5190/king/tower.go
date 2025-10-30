package king

type Tower interface {
	Level() int
	Range() float64
	HitSpeed() float64
	Hitpoints() int
	Damage() int
}
