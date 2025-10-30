package common

const X = -1

// convertNumber converts a number into an appropriate type.
// An int or a float64 with fractional part is not converted.
// A float64 without fractional part is converted to an int.
func ConvertNumber(value interface{}) interface{} {
	switch v := value.(type) {
	case int:
		return v
	case float64:
		if i := int(v); float64(i) == v {
			return i
		}
		return v
	default:
		panic("Unknown value type")
	}
}
