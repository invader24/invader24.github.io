package attr

// Generated
type Generated int8

const (
	BaseHP Generated = iota
	BaseSHP
	BaseDam
	BaseDamL
	BaseDamH
	BaseADam
	BaseDDam
	BaseGobLV
	BaseSgoLV
	BaseSkeLV
	BaseBarLV
	BaseFspLV
	BaseGolLV
	BaseLavLV
	BaseDurU
	BaseFDurU
	BaseMCLV
	BaseMRLV
	BaseMELV
)

func ForEachGenerated(f func(Generated)) {
	for i := range generatedAttributes {
		f(Generated(i))
	}
}

func (a Generated) Attribute() {
}

func (a Generated) String() string {
	return a.TargetAttribute().String()
}

func (a Generated) TargetAttribute() Upgradable {
	return generatedAttributes[a].targetAttribute
}

func (a Generated) GenerateValues(baseValue interface{}, max int) interface{} {
	return generatedAttributes[a].generateFunc(baseValue, max)
}

/////////////
// Private //
/////////////

type generatedAttribute struct {
	targetAttribute Upgradable
	generateFunc    func(baseValue interface{}, max int) []interface{}
}

var generatedAttributes = [...]*generatedAttribute{
	&generatedAttribute{HP, generateHp},
	&generatedAttribute{SHP, generateHp},
	&generatedAttribute{Dam, generateDam},
	&generatedAttribute{DamL, generateDam},
	&generatedAttribute{DamH, generateDam},
	&generatedAttribute{ADam, generateDam},
	&generatedAttribute{DDam, generateDam},
	&generatedAttribute{GobLV, generateLv},
	&generatedAttribute{SgoLV, generateLv},
	&generatedAttribute{SkeLV, generateLv},
	&generatedAttribute{BarLV, generateLv},
	&generatedAttribute{FspLV, generateLv},
	&generatedAttribute{GolLV, generateLv},
	&generatedAttribute{LavLV, generateLv},
	&generatedAttribute{DurU, generateDur},
	&generatedAttribute{FDurU, generateDur},
	&generatedAttribute{MCLV, generateLv},
	&generatedAttribute{MRLV, generateLv},
	&generatedAttribute{MELV, generateLv},
}
