package format

import (
	"github.com/asukakenji/clash-royale/common"
	"github.com/asukakenji/clash-royale/rng"

	"fmt"
)

func Dummy(_ interface{}) string {
	return ""
}

func String(value interface{}) string {
	return fmt.Sprintf("%s", value)
}

func Int(value interface{}) string {
	// Note: interface{} is comparable with const
	if common.X == value {
		return ""
	}
	return fmt.Sprintf("%d", value)
}

func Float(value interface{}) string {
	number := common.ConvertNumber(value)
	switch v := number.(type) {
	case int:
		return Int(v)
	case float64:
		return fmt.Sprintf("%.1f", v)
	default:
		panic("Unknown value type")
	}
}

func Percentage(value interface{}) string {
	return fmt.Sprintf("%+d%%", value)
}

func Elixir(value interface{}) string {
	if common.X == value {
		return "?"
	}
	return Int(value)
}

func Time(value interface{}) string {
	number := common.ConvertNumber(value)
	switch v := number.(type) {
	case int:
		if v < 60 {
			return fmt.Sprintf("%dsec", v)
		}
		return fmt.Sprintf("%dmin %dsec", v/60, v%60)
	case float64:
		return fmt.Sprintf("%.1fsec", v)
	default:
		panic("Unknown value type")
	}
}

func Range(value interface{}) string {
	if rng.Melee == value {
		return "Melee"
	}
	return Float(value)
}

func Count(value interface{}) string {
	return fmt.Sprintf("x %d", value)
}
