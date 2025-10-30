package attr

// Attribute
type Attribute interface {
	Attribute() // Tag
}

func ForEach(f func(Attribute)) {
	for _, v := range attributes {
		f(v)
	}
}

// Helper
type BaseDuration struct {
	BaseValue int
	Increment float64
}

/////////////
// Private //
/////////////

var attributes = [...]Attribute{
	Name,
	From,
	Arena,
	Rarity,
	Type,
	Desc,
	Elixir,
	HP,
	SHP,
	HP,
	SHP,
	DPS,
	DPSL,
	DPSH,
	CTDPS,
	Dam,
	DamL,
	DamH,
	ADam,
	CDam,
	DDam,
	CTDam,
	GobLV,
	SgoLV,
	SkeLV,
	BarLV,
	FspLV,
	GolLV,
	LavLV,
	SSpeed,
	PSpeed,
	HSpeed,
	Targets,
	Speed,
	Range,
	DTime,
	LTime,
	DurF,
	DurU,
	SDurF,
	Boost,
	Radius,
	Count,
	GobCount,
	MCLV,
	MRLV,
	MELV,
	MLLV,
	BaseHP,
	BaseSHP,
	BaseDam,
	BaseDamL,
	BaseDamH,
	BaseADam,
	BaseDDam,
	BaseGobLV,
	BaseSgoLV,
	BaseSkeLV,
	BaseBarLV,
	BaseFspLV,
	BaseGolLV,
	BaseLavLV,
	BaseDurU,
	BaseFDurU,
	BaseMCLV,
	BaseMRLV,
	BaseMELV,
}
