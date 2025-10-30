package rarity

import (
	"github.com/asukakenji/clash-royale/common"
)

// Rarity
type Rarity int8

const (
	Common Rarity = iota
	Rare
	Epic
	Legendary
)

func ForEach(f func(Rarity)) {
	for i := range rarities {
		f(Rarity(i))
	}
}

func (r Rarity) ForEachLevel(f func(int)) {
	for lv, maxLv := 1, r.MaxLevel(); lv <= maxLv; lv++ {
		f(lv)
	}
}

func (r Rarity) Id() int {
	return int(r)
}

func (r Rarity) String() string {
	return rarities[r].name
}

func (r Rarity) Name() string {
	return rarities[r].name
}

func (r Rarity) MaxLevel() int {
	return len(rarities[r].cardsReq)
}

func (r Rarity) CardsReqAtLevel(level int) int {
	return rarities[r].cardsReq[level-1]
}

func (r Rarity) GoldReqAtLevel(level int) int {
	return rarities[r].goldReq[level-1]
}

func (r Rarity) ExpGainAtLevel(level int) int {
	return rarities[r].expGain[level-1]
}

/////////////
// Private //
/////////////

type rarity struct {
	name     string // The name of the rarity
	cardsReq []int  // The number of cards needed for upgrading card at level "i"
	goldReq  []int  // The amount of gold needed for upgrading card at level "i"
	expGain  []int  // The amount of experience gained when upgrading card at level "i"
	goldCost []int  // The amount of gold needed to buy the "i + 1"-th card from the shop
}

var rarities = []*rarity{
	&rarity{
		name:     "Common",
		cardsReq: []int{0, 2, 4, 10, 20, 50, 100, 200, 400, 1000, 2000, 4000, common.X},
		goldReq:  []int{0, 5, 20, 50, 150, 400, 1000, 2000, 4000, 8000, 20000, 50000, common.X},
		expGain:  []int{0, 4, 5, 6, 10, 25, 50, 100, 200, 400, 800, 1600, common.X},
		goldCost: []int{ // 100, 10100
			2, 4, 6, 8, 10, 12, 14, 16, 18, 20,
			22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
			42, 44, 46, 48, 50, 52, 54, 56, 58, 60,
			62, 64, 66, 68, 70, 72, 74, 76, 78, 80,
			82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
			102, 104, 106, 108, 110, 112, 114, 116, 118, 120,
			122, 124, 126, 128, 130, 132, 134, 136, 138, 140,
			142, 144, 146, 148, 150, 152, 154, 156, 158, 160,
			162, 164, 166, 168, 170, 172, 174, 176, 178, 180,
			182, 184, 186, 188, 190, 192, 194, 196, 198, 200,
		},
	},
	&rarity{
		name:     "Rare",
		cardsReq: []int{0, 2, 4, 10, 20, 50, 100, 200, 400, 1000, 2000},
		goldReq:  []int{0, 50, 150, 400, 1000, 2000, 4000, 8000, 20000, 50000, common.X},
		expGain:  []int{0, 6, 10, 25, 50, 100, 200, 400, 800, 1600, common.X},
		goldCost: []int{ // 50, 25500
			20, 40, 60, 80, 100, 120, 140, 160, 180, 200,
			220, 240, 260, 280, 300, 320, 340, 360, 380, 400,
			420, 440, 460, 480, 500, 520, 540, 560, 580, 600,
			620, 640, 660, 680, 700, 720, 740, 760, 780, 800,
			820, 840, 860, 880, 900, 920, 940, 960, 980, 1000,
		},
	},
	&rarity{
		name:     "Epic",
		cardsReq: []int{0, 2, 4, 10, 20, 50, 100, 200},
		goldReq:  []int{0, 400, 1000, 2000, 4000, 8000, 20000, 50000},
		expGain:  []int{0, 25, 50, 100, 200, 400, 800, 1600},
		goldCost: []int{ // 10, 110000
			2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000,
		},
	},
	&rarity{
		name:     "Legendary",
		cardsReq: []int{0, 2, 4, 10, 20},
		goldReq:  []int{0, 5000, 20000, 50000, 100000},
		expGain:  []int{0, 200, 400, 800, 1600},
		goldCost: []int{ // 3, 240000
			40000, 80000, 120000,
		},
	},
}
