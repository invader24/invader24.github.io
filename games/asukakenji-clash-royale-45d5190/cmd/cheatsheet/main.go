package main

import (
	"github.com/asukakenji/clash-royale/attr"
	"github.com/asukakenji/clash-royale/card"
	"github.com/asukakenji/clash-royale/format"
	"github.com/asukakenji/clash-royale/king"
	"github.com/asukakenji/clash-royale/rarity"
	"github.com/asukakenji/clash-royale/typ"

	"bytes"
	"fmt"
)

const (
	fixedHeaderWidth        = 16
	upgradableHeaderWidth   = 24
	fixedContentsWidth      = 5
	upgradableContentsWidth = 7
)

const (
	h1 = "# %s\n"
	h2 = "## %s\n"
	h3 = "### %s\n"
)

const (
	kKingLevelPlayerLevel  = "King Level (Player Level)"
	kRarity                = "Rarity"
	kCardsByTypeAndRarity  = "Cards (by Type and Rarity)"
	kCardsByTypeAndArena   = "Cards (by Type and Arena)"
	kCardsByRarityAndArena = "Cards (by Rarity and Arena)"
)

var (
	fixedColHeaders      = []string{"Attribute", "Value"}
	upgradableColHeaders = []string{"Attribute", "LV1", "LV2", "LV3", "LV4", "LV5", "LV6", "LV7", "LV8", "LV9", "LV10", "LV11", "LV12", "LV13"}
)

func ilink(s string) string {
	var result bytes.Buffer

	result.WriteRune('[')
	result.WriteString(s)
	result.WriteRune(']')
	result.WriteRune('(')
	result.WriteRune('#')

	for _, runeValue := range s {
		switch {
		case 'A' <= runeValue && runeValue <= 'Z':
			// Turn uppercase letters into lowercase
			result.WriteRune(runeValue + 0x20)
		case 'a' <= runeValue && runeValue <= 'z':
			// Copy lowercase letters
			result.WriteRune(runeValue)
		default:
			switch runeValue {
			case ' ':
				// Turn spaces into dashes
				result.WriteRune('-')
			case '.', '(', ')':
				// Skip punctuations
			default:
				panic("Unknown character found: " + s)
			}
		}
	}

	result.WriteRune(')')
	return result.String()
}

func printIndex() {
	const ul = "- %s\n"
	fmt.Printf(h2, "Index")
	fmt.Printf(ul, ilink(kKingLevelPlayerLevel))
	fmt.Printf(ul, ilink(kRarity))
	fmt.Printf(ul, ilink(kCardsByTypeAndRarity))
	fmt.Printf(ul, ilink(kCardsByTypeAndArena))
	fmt.Printf(ul, ilink(kCardsByRarityAndArena))
}

func printKingLevelPlayerLevel() {
	var (
		towerFixedRowHeaders      = []string{"Range", "Hit Speed"}
		towerUpgradableRowHeaders = []string{"Hitpoints", "Damage"}
		fixedTableSettings        = map[string]interface{}{
			"headerWidth":   9,
			"contentsWidth": 6,
			"rowHeaders":    towerFixedRowHeaders,
			"colHeaders":    fixedColHeaders,
			"colCount":      1,
		}
		upgradableTableSettings = map[string]interface{}{
			"headerWidth":   9,
			"contentsWidth": 6,
			"rowHeaders":    towerUpgradableRowHeaders,
			"colHeaders":    upgradableColHeaders,
			"colCount":      king.MaxLevel(),
		}
	)

	{
		fmt.Printf(h2, kKingLevelPlayerLevel)
		fmt.Println()
		table := NewTable(map[string]interface{}{
			"headerWidth":   19,
			"contentsWidth": 6,
			"rowHeaders":    []string{"Experience Required"},
			"colHeaders":    upgradableColHeaders,
			"colCount":      king.MaxLevel(),
		})
		king.ForEachLevel(func(k king.King) {
			table.SetCell(0, k.Level()-1, format.Int(k.ExperienceRequired()))
		})
		table.Print()
	}

	fmt.Println()

	{
		fmt.Printf(h3, "King's Tower")
		fmt.Println()
		tableF := NewTable(fixedTableSettings)
		t := king.KingTowerAtLevel(0)
		tableF.SetCell(0, 0, format.Range(t.Range()))
		tableF.SetCell(1, 0, format.Time(t.HitSpeed()))
		tableF.Print()
		fmt.Println()
		tableU := NewTable(upgradableTableSettings)
		king.ForEachLevel(func(k king.King) {
			lv := k.Level()
			t := king.KingTowerAtLevel(lv)
			tableU.SetCell(0, lv-1, format.Int(t.Hitpoints()))
			tableU.SetCell(1, lv-1, format.Int(t.Damage()))
		})
		tableU.Print()
	}

	fmt.Println()

	{
		fmt.Printf(h3, "Arena Towers")
		fmt.Println()
		tableF := NewTable(fixedTableSettings)
		t := king.ArenaTowerAtLevel(0)
		tableF.SetCell(0, 0, format.Range(t.Range()))
		tableF.SetCell(1, 0, format.Time(t.HitSpeed()))
		tableF.Print()
		fmt.Println()
		tableU := NewTable(upgradableTableSettings)
		king.ForEachLevel(func(k king.King) {
			lv := k.Level()
			t := king.ArenaTowerAtLevel(lv)
			tableU.SetCell(0, lv-1, format.Int(t.Hitpoints()))
			tableU.SetCell(1, lv-1, format.Int(t.Damage()))
		})
		tableU.Print()
	}
}

func printRarity() {
	fmt.Printf(h2, "Rarity")
	fmt.Println()
	sep := ""
	rarity.ForEach(func(r rarity.Rarity) {
		fmt.Print(sep)
		fmt.Printf(h3, r)
		fmt.Println()
		max := r.MaxLevel()
		table := NewTable(map[string]interface{}{
			"headerWidth":   22,
			"contentsWidth": 7,
			"rowHeaders":    []string{"Cards <br> Required", "Gold <br> Required", "Experience <br> Gained"},
			"colHeaders":    upgradableColHeaders,
			"colCount":      max,
		})
		r.ForEachLevel(func (lv int) {
			table.SetCell(0, lv-1, format.Int(r.CardsReqAtLevel(lv)))
			table.SetCell(1, lv-1, format.Int(r.GoldReqAtLevel(lv)))
			table.SetCell(2, lv-1, format.Int(r.ExpGainAtLevel(lv)))
		})
		table.Print()
		sep = "\n"
	})
}

func main() {
	fmt.Printf(h1, "Clash Royale Cheatsheet")
	fmt.Println()

	printIndex()
	fmt.Print("\n\n\n")

	printKingLevelPlayerLevel()
	fmt.Print("\n\n\n")

	printRarity()
	fmt.Print("\n\n\n")

	sep := ""
	typ.ForEach(func(t typ.Type) {
		// Card Type (Troops, Buildings, Spells)
		fmt.Print(sep)
		fmt.Printf("## %s\n", t)
		fmt.Println()

		sep2 := ""
		card.ForEachOfType(t, func(c card.Card) {

			// Header (Card Name)
			fmt.Print(sep2)
			fmt.Printf("### %s\n", c.Name())
			fmt.Println()

			// Fixed Attribute Table
			{
				rowHeaders := []string{}
				contents := [][]string{}
				c.ForEachFixedAttribute(func(a attr.Fixed) {
					rowHeaders = append(rowHeaders, a.String())
					switch a {
					case attr.Rarity:
						contents = append(contents, []string{ilink(c.FormattedValue(a))})
					default:
						contents = append(contents, []string{c.FormattedValue(a)})
					}
				})
				table := NewTable(map[string]interface{}{
					"headerWidth":   fixedHeaderWidth,
					"contentsWidth": fixedContentsWidth,
					"rowHeaders":    rowHeaders,
					"colHeaders":    fixedColHeaders,
					"contents":      contents,
				})
				table.SetContentAlignment(LEFT)
				table.Print()
			}

			fmt.Println()

			// Upgradable Attribute Table
			{
				rowHeaders := []string{}
				contents := [][]string{}
				c.ForEachUpgradableAttribute(func(a attr.Upgradable) {
					rowHeaders = append(rowHeaders, a.String())
					contents = append(contents, c.FormattedValues(a))
				})
				maxLevel := c.MaxLevel()
				table := NewTable(map[string]interface{}{
					"headerWidth":   upgradableHeaderWidth,
					"contentsWidth": upgradableContentsWidth,
					"rowHeaders":    rowHeaders,
					"colHeaders":    upgradableColHeaders[0 : maxLevel+1 : maxLevel+1],
					"contents":      contents,
				})
				table.Print()
			}

			sep2 = "\n"
		})
		sep = "\n\n\n\n\n"
	})

	fmt.Println()
}
