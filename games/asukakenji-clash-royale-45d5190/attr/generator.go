package attr

import (
	"github.com/asukakenji/clash-royale/common"
)

var refValues = []int{1000, 1100, 1210, 1330, 1460, 1600, 1760, 1930, 2120, 2330, 2560, 2810, 3090}

const maxLevel = 13

func generateHp(baseHp interface{}, max int) []interface{} {
	baseValue := baseHp.(int)
	values := make([]interface{}, maxLevel)
	for i := range values {
		values[i] = refValues[i] * baseValue / refValues[0]
	}
	return values[0:max:max]
}

func generateDam(baseDam interface{}, max int) []interface{} {
	return generateHp(baseDam, max)
}

func generateLv(baseLv interface{}, max int) []interface{} {
	baseValue := baseLv.(int)
	values := make([]interface{}, maxLevel)
	for i := range values {
		values[i] = baseValue + i
	}
	return values[0:max:max]
}

func generateDur(baseDur interface{}, max int) []interface{} {
	baseValue := baseDur.(BaseDuration)
	values := make([]interface{}, maxLevel)
	for i := range values {
		values[i] = common.ConvertNumber(float64(baseValue.BaseValue) + float64(i)*baseValue.Increment)
	}
	return values[0:max:max]
}

/*
func generateDps(baseDam interface{}, hitSpeed float64) []int {
	values := generateDam(baseDam)
	for i, v := range values {
		values[i] = int(float64(v)/hitSpeed + 0.5)
	}
	return values
}
*/
