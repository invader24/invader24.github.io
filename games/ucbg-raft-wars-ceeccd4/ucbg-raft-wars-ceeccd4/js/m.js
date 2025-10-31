var game;
window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, 1);
        initGameStates()
    }, 100)
}
;
var MainGame = {
    Config: {
        GAME_WIDTH: 800,
        GAME_HEIGHT: 600
    },
    version: "v1.2.2",
    partGame: "rw1",
    isDebug: false,
    isAPI: true,
    title: "raftwars_v1_1",
    state: null,
    stateName: "",
    orientation: 1,
    orientated: false,
    languages: ["EN", "IT", "ES", "PT", "TR", "DE", "BR", "RU", "FR", "NL"],
    languagesN: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
    language: 0,
    GAME_TEXT: null,
    TEXT_FILE: null,
    onDesktop: false,
    fadeColor: 0,
    textFPS: null,
    showFPS: false,
    isPaused: false,
    isGoAway: false,
    isGameLoaded: false,
    isApiBreakTime: false,
    isMusicMuted: false,
    isSfxMuted: false,
    isMusicMutedByUser: false,
    isSfxMutedByUser: false,
    isMusicPlaying: -1,
    nextState: "",
    firstLoad: true,
    firstTime: true,
    firstGo: true,
    isMuteSound: false,
    isMuteMusic: false,
    deltaX: 0,
    accuracy: [15, 14, 13, 12, 11, 10, 11, 8, 7, 6, 5, 4, 3],
    arShots: [6, 6, 5, 7, 5, 5, 5, 5, 5, 7, 7, 7, 5],
    typeBoat: 1,
    levelMax: 0,
    LOW_COINS: 250,
    MAX_AMMO: 3,
    MAX_LEVELS: 12,
    countGranat: 0,
    countRocket: 0,
    countBalls3: 0,
    coins: 0,
    highScore: 0,
    isHardMode: false,
    levelHard: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    levelStars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    levelScore: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    levelTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    priceBoat: [1500, 2e3, 3e3],
    priceGranat: 250,
    priceRocket: 400,
    levelNum: 0,
    comicsNum: 0,
    allowReward: false,
    initSettings: function() {
        if (game.device.desktop) {
            game.stage.disableVisibilityChange = true
        } else {
            game.stage.disableVisibilityChange = false
        }
        game.add.plugin(PhaserSpine.SpinePlugin);
        game.input.maxPointers = 1;
        game.load.crossOrigin = "anonymous";
        game.camera.onFadeComplete.add(MainGame.changeState, this);
        MainGame.worldX = game.world.centerX;
        MainGame.worldY = game.world.centerY;
        MainGame.midX = Math.ceil(MainGame.Config.GAME_WIDTH / 2);
        var num = 0;
        var strLang = navigator.language;
        var languageSystem = strLang.substring(0, 2).toUpperCase();
        var indexLang = MainGame.languages.indexOf(languageSystem);
        if (indexLang >= 0)
            num = indexLang;
        MainGame.language = num;
        MainGame.loadSaves();
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
        window.scrollTo(0, 1);
        if (MainGame.isAPI) {
            MainGame.api_check();
            MainGame.API_POKI = game.plugins.add(new Phaser.Plugin.API_POKI(game));
            MainGame.API_POKI.initAPI(MainGame.api_GamePause, MainGame.api_GameContinue)
        }
    },
    api_google: function(vValue, vLevel) {
        if (vLevel) {
            console.log("api_google", vValue, vLevel)
        } else {
            console.log("api_google", vValue)
        }
        switch (vValue) {
        case "StartLevel":
            //ga("send", "event", "GameEvent", "StartLevel", vLevel);
            break;
        case "LevelWon":
            //ga("send", "event", "GameEvent", "LevelWon", vLevel);
            break;
        case "LevelLost":
            //ga("send", "event", "GameEvent", "LevelLost", vLevel);
            break;
        case "GameComplete":
            //ga("send", "event", "GameEvent", "GameComplete", vLevel);
            break;
        case "reward_click":
            //ga("send", "event", "GameEvent", "reward_click");
            break;
        case "reward_get":
           // ga("send", "event", "GameEvent", "reward_get");
            break
        }
    },
    api_check: function() {
        console.log("check")
    },
    api_GamePause: function() {
        console.log("Starting break");
        MainGame.isApiBreakTime = true;
        if (!MainGame.isMusicMutedByUser)
            MainGame.muteMusic(true);
        if (!MainGame.isSfxMutedByUser)
            MainGame.muteSfx(true);
        game.sound.mute = true
    },
    api_GameContinue: function() {
        console.log("Break completed");
        MainGame.isApiBreakTime = false;
        if (!MainGame.isMusicMutedByUser)
            MainGame.muteMusic(false);
        if (!MainGame.isSfxMutedByUser)
            MainGame.muteSfx(false);
        game.sound.mute = false
    },
    setReward: function(vLayer, vX, vY, forceCoins) {
        var iconVideo = vLayer.add(game.add.image(vX + 70, vY + 35, "ss_menu", "icon_buy_movie_0000"));
        iconVideo.anchor.setTo(.5);
        var whatCanReward = ["coins"];
        if (!forceCoins) {
            if (MainGame.countGranat < MainGame.MAX_AMMO)
                whatCanReward.push("grenade");
            if (MainGame.countRocket < MainGame.MAX_AMMO)
                whatCanReward.push("rocket");
            if (MainGame.partGame == "rw2") {
                if (MainGame.countBalls3 < MainGame.MAX_AMMO)
                    whatCanReward.push("balls3")
            }
            MyMath.shuffleArr(whatCanReward)
        }
        MainGame.selectedReward = whatCanReward[0];
        var iconReward = vLayer.add(game.add.image(vX + 20, vY - 30, "ss_menu", MainGame.selectedReward + "_n_0000"));
        iconReward.anchor.setTo(.5);
        var offsetX = 40;
        var offsetY = 32;
        MainGame.addText(145, offsetX + vX, offsetY + vY + 5, MainGame.GAME_TEXT.get_now.toUpperCase(), vLayer, 25, 10248197, 1, .5);
        MainGame.addText(145, offsetX + vX, offsetY + vY + 0, MainGame.GAME_TEXT.get_now.toUpperCase(), vLayer, 25, 16710912, 1, .5)
    },
    closePopup: function() {
        MainGame.linkPopup.y = -1e4
    },
    getReward: function(withReward) {
        if (MainGame.stateName == "ScreenGame" || MainGame.stateName == "ScreenShop") {
            if (MainGame.state.btnReward) {
                MainGame.state.btnReward.buttonC.alpha = .7
            }
        }
        if (withReward) {
            if (MainGame.stateName == "ScreenShop")
                MainGame.allowReward = false;
            MainGame.api_google("reward_get");
            if (MainGame.state.layerPopup) {
                var pos = {
                    x: game.width * .5,
                    y: 300
                };
                var layerMain = MainGame.state.layerPopup;
                var reward = MainGame.selectedReward;
                layer = layerMain.add(game.add.group());
                layer.x = pos.x;
                layer.y = pos.y;
                MainGame.linkPopup = layer;
                var window = layer.add(game.add.image(0, 0, "ss_menu", "pause_panel_0000"));
                window.anchor.setTo(.5);
                var offsetX = 90;
                var iconArrow = layer.add(game.add.image(0, 0 - 50, "ss_menu", "arrow_wind_0000"));
                iconArrow.anchor.setTo(.5);
                var iconBox = layer.add(game.add.image(0 - offsetX, 0 - 50, "ss_menu", "bonus_box_0000"));
                iconBox.anchor.setTo(.5);
                if (reward == "rocket" || reward == "grenade" || reward == "balls3") {
                    var white = layer.add(game.add.image(0 + offsetX, 0 - 50, "ss_menu", "btn_gun_0000"));
                    white.anchor.setTo(.5);
                    var weapon = layer.add(game.add.image(0 + offsetX, 0 - 50, "ss_menu", reward + "_n_0000"));
                    weapon.anchor.setTo(.5);
                    var textAmmo = 0;
                    var ammo_frame = "";
                    if (reward == "rocket") {
                        ammo_frame = "ammo_shop2";
                        textAmmo = MainGame.countRocket
                    } else if (reward == "grenade") {
                        ammo_frame = "ammo_shop1";
                        textAmmo = MainGame.countGranat
                    } else if (reward == "balls3") {
                        ammo_frame = "ammo_shop3";
                        textAmmo = MainGame.countBalls3
                    }
                    var ammo = layer.add(game.add.image(white.x + 30, white.y + 35, "ss_menu", ammo_frame + "_0000"));
                    ammo.anchor.setTo(.5);
                    var textFieldAmmo = MainGame.addText(800, white.x + 30, white.y + 34, String(textAmmo) + "/" + MainGame.MAX_AMMO, layer, 22, 16777215, .5, .5)
                } else if (reward == "coins") {
                    var coinsF = layer.add(game.add.image(55, 0 - 40, "ss_menu", "coins_0000"));
                    coinsF.anchor.setTo(.5);
                    var textCoins = MainGame.coins;
                    var coinText1 = MainGame.addText(800, coinsF.x + 40, -5 + coinsF.y + 5, String(textCoins), layer, 28, 10248197, 0, .5);
                    var coinText2 = MainGame.addText(800, coinsF.x + 40, -5 + coinsF.y, String(textCoins), layer, 28, 16710912, 0, .5)
                }
                var iconReward = layer.add(game.add.image(0 - offsetX, 0 - 70, "ss_menu", reward + "_n_0000"));
                iconReward.anchor.setTo(.5);
                var btnOk = new SimpleButton(game,this,layer,0,0 + 65,"ss_menu","btn_home3_0000",MainGame.closePopup);
                var text_update = 0;
                switch (reward) {
                case "coins":
                    MainGame.coins += 500;
                    text_update = MainGame.coins;
                    break;
                case "rocket":
                    MainGame.countRocket += 2;
                    if (MainGame.countRocket > MainGame.MAX_AMMO)
                        MainGame.countRocket = MainGame.MAX_AMMO;
                    text_update = MainGame.countRocket;
                    break;
                case "grenade":
                    MainGame.countGranat += 2;
                    if (MainGame.countGranat > MainGame.MAX_AMMO)
                        MainGame.countGranat = MainGame.MAX_AMMO;
                    text_update = MainGame.countGranat;
                    break;
                case "balls3":
                    MainGame.countBalls3 += 2;
                    if (MainGame.countBalls3 > MainGame.MAX_AMMO)
                        MainGame.countBalls3 = MainGame.MAX_AMMO;
                    text_update = MainGame.countBalls3;
                    break
                }
                MainGame.saveSaves();
                layer.scale.setTo(1);
                game.add.tween(layer.scale).to({
                    x: 1.04,
                    y: 1.04
                }, 120, "Back.easeOut", true, 0, 0, true);
                game.add.tween(iconReward.scale).to({
                    x: 1.55,
                    y: 1.55
                }, 250, "Linear", true, 400, 0, true).onComplete.add(function() {
                    game.add.tween(iconReward).to({
                        x: offsetX,
                        y: -50
                    }, 300, "Linear", true).onComplete.add(function() {
                        if (MainGame.linkPopup)
                            MainGame.addEffect(3, layer, offsetX, -50);
                        iconReward.destroy();
                        if (reward == "coins") {
                            coinText1.setText(String(text_update));
                            coinText2.setText(String(text_update));
                            if (MainGame.stateName == "ScreenShop") {
                                MainGame.state.coinText1.setText(MainGame.coins);
                                MainGame.state.coinText2.setText(MainGame.coins)
                            }
                        } else {
                            textFieldAmmo.setText(String(text_update) + "/" + MainGame.MAX_AMMO)
                        }
                    })
                })
            }
        }
    },
    clickReward: function() {
        MainGame.api_google("reward_click");
        if (MainGame.isAPI) {
            MainGame.API_POKI.rewardedBreak()
        } else {
            if (MainGame.isDebug)
                MainGame.getReward(true)
        }
    },
    continueGame: function() {
        MainGame.isGameLoaded = true;
        game.state.start("Menu")
    },
    addButton: function(link, vLayer, vX, vY, onClick, vText, vW, vH, vSize) {
        if (typeof vW === "undefined")
            vW = 200;
        if (typeof vH === "undefined")
            vH = 80;
        if (typeof vSize === "undefined")
            vSize = 36;
        var btn = MainGame.addFill(vLayer, 3355443, .5, vW, vH, vX - vW / 2, vY - vH / 2);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(onClick, link);
        if (vText != "")
            btn.text = MainGame.addText(400, vX, vY, vText, vLayer, vSize, "#FFFFFF", .5, .5);
        return btn
    },
    addText: function(vWidthMax, vX, vY, vText, vLayer, vSize, vColor, vAnchorX, vAnchorY) {
        if (typeof vWidthMax === "undefined")
            vWidthMax = 800;
        if (typeof vLayer === "undefined")
            vLayer = "";
        if (typeof vSize === "undefined")
            vSize = 40;
        if (typeof vColor === "undefined")
            vColor = 0;
        if (typeof vAnchorX === "undefined")
            vAnchorX = 0;
        if (typeof vAnchorY === "undefined")
            vAnchorY = 0;
        var text;
        if (vLayer != "") {
            text = vLayer.add(game.add.bitmapText(vX, vY, "bmf_riffic", vText, vSize))
        } else {
            text = game.add.bitmapText(vX, vY, "bmf_riffic", vText, vSize)
        }
        text.anchor.setTo(vAnchorX, vAnchorY);
        text.fontSize = vSize;
        text.tint = vColor;
        text.align = "center";
        MainGame.updateTextWidth(text, vWidthMax);
        return text
    },
    replaceText: function(vText, vValue) {
        return vText.replace("#", vValue.toString())
    },
    updateTextWidth: function(vText, vMaxWidth) {
        var _txtWidth = vText.width;
        var scale = 1;
        if (_txtWidth > vMaxWidth) {
            scale = vMaxWidth / _txtWidth;
            vText.scale.setTo(scale)
        }
        return scale
    },
    updateTextHeight: function(vText, vMaxHeigth) {
        var _txtHeight = vText.height;
        var scale = 1;
        if (_txtHeight > vMaxHeigth) {
            scale = vMaxHeigth / _txtHeight;
            vText.scale.setTo(scale)
        }
        return scale
    },
    updateTextsButton: function(vButton) {
        var _maxWidth = vButton.button.width * .85;
        var _txtWidth = vButton.text1.width;
        var scale = 1;
        if (_txtWidth > _maxWidth) {
            scale = _maxWidth / _txtWidth;
            vButton.text1.scale.setTo(scale);
            vButton.text2.scale.setTo(scale);
            vButton.text2.y *= scale
        }
    },
    addPanelka: function(vLayer, vX, vY, vW, vH, vColorF, vColorB, vLine) {
        if (typeof vColorF === "undefined")
            vColorF = 0;
        if (typeof vColorB === "undefined")
            vColorB = 16777215;
        if (typeof vLine === "undefined")
            vLine = 4;
        var graphics = vLayer.add(game.add.graphics(vX, vY));
        graphics.lineStyle(vLine, vColorB, .6);
        graphics.beginFill(vColorF, .7);
        graphics.drawRect(0, 0, vW, vH);
        graphics.endFill();
        return graphics
    },
    loadSaves: function() {
        var levelMax = localStorage[MainGame.title + "-lvl"];
        if (levelMax != undefined && levelMax != "null")
            MainGame.levelMax = Number(levelMax);
        var typeBoat = localStorage[MainGame.title + "-boat"];
        if (typeBoat != undefined && typeBoat != "null")
            MainGame.typeBoat = Number(typeBoat);
        var countGranat = localStorage[MainGame.title + "-granat"];
        if (countGranat != undefined && countGranat != "null")
            MainGame.countGranat = Number(countGranat);
        var countRocket = localStorage[MainGame.title + "-rocket"];
        if (countRocket != undefined && countRocket != "null")
            MainGame.countRocket = Number(countRocket);
        var coins = localStorage[MainGame.title + "-coins"];
        if (coins != undefined && coins != "null")
            MainGame.coins = Number(coins);
        var highScore = localStorage[MainGame.title + "-highscore"];
        if (highScore != undefined && highScore != "null")
            MainGame.highScore = Number(highScore);
        var sLang = localStorage[MainGame.title + "-lang"];
        if (sLang != undefined && sLang != "null")
            MainGame.language = Number(sLang);
        var skok;
        for (var j = 0; j <= MainGame.MAX_LEVELS; j++) {
            skok = localStorage[MainGame.title + "-stars" + j];
            if (skok != undefined && skok != "null")
                MainGame.levelStars[j] = Number(skok);
            skok = localStorage[MainGame.title + "-score" + j];
            if (skok != undefined && skok != "null")
                MainGame.levelScore[j] = Number(skok);
            skok = localStorage[MainGame.title + "-time" + j];
            if (skok != undefined && skok != "null")
                MainGame.levelTime[j] = Number(skok);
            skok = localStorage[MainGame.title + "-hard" + j];
            if (skok != undefined && skok != "null")
                MainGame.levelHard[j] = Number(skok)
        }
        if (MainGame.isDebug) {}
    },
    saveSaves: function(vNum) {
        localStorage[MainGame.title + "-boat"] = MainGame.typeBoat;
        localStorage[MainGame.title + "-granat"] = MainGame.countGranat;
        localStorage[MainGame.title + "-rocket"] = MainGame.countRocket;
        for (var j = 0; j <= MainGame.MAX_LEVELS; j++) {
            localStorage[MainGame.title + "-stars" + j] = MainGame.levelStars[j];
            localStorage[MainGame.title + "-score" + j] = MainGame.levelScore[j];
            localStorage[MainGame.title + "-time" + j] = MainGame.levelTime[j];
            localStorage[MainGame.title + "-hard" + j] = MainGame.levelHard[j]
        }
        localStorage[MainGame.title + "-lvl"] = MainGame.levelMax;
        localStorage[MainGame.title + "-highscore"] = MainGame.highScore;
        localStorage[MainGame.title + "-coins"] = MainGame.coins;
        localStorage[MainGame.title + "-lang"] = MainGame.language
    },
    clearSaves: function() {
        localStorage[MainGame.title + "-lang"] = null;
        localStorage[MainGame.title + "-boat"] = null;
        localStorage[MainGame.title + "-granat"] = null;
        localStorage[MainGame.title + "-rocket"] = null;
        localStorage[MainGame.title + "-coins"] = null;
        for (var j = 0; j <= MainGame.MAX_LEVELS; j++) {
            localStorage[MainGame.title + "-stars" + j] = null;
            localStorage[MainGame.title + "-score" + j] = null;
            localStorage[MainGame.title + "-time" + j] = null;
            localStorage[MainGame.title + "-hard" + j] = null
        }
        localStorage[MainGame.title + "-lvl"] = null;
        localStorage[MainGame.title + "-highscore"] = null;
        MainGame.levelMax = 0;
        MainGame.levelNum = 0;
        MainGame.typeBoat = 1;
        MainGame.countGranat = 0;
        MainGame.countRocket = 0;
        MainGame.coins = 0;
        MainGame.highScore = 0;
        var skok;
        for (var j = 0; j <= MainGame.MAX_LEVELS; j++) {
            MainGame.levelStars[j] = 0;
            MainGame.levelScore[j] = 0;
            MainGame.levelTime[j] = 0;
            MainGame.levelHard[j] = 0
        }
    },
    clearGame: function() {
        game.tweens.removeAll()
    },
    goToState: function(pNextState) {
        MainGame.isFadeGame = false;
        MainGame.clearGame();
        game.camera.fade(MainGame.fadeColor, 200);
        MainGame.nextState = pNextState
    },
    changeState: function() {
        if (!MainGame.isFadeGame)
            game.state.start(MainGame.nextState)
    },
    fadeOut: function() {
        game.camera.flash(MainGame.fadeColor, 200)
    },
    resizeGame: function() {
        var ratio = window.innerWidth / window.innerHeight;
        var standardWidth = MainGame.Config.GAME_WIDTH;
        var standardHeight = MainGame.Config.GAME_HEIGHT;
        var maxWidth = 1600;
        var standardRatio = standardWidth / standardHeight;
        if (ratio > standardRatio) {
            game.scale.setGameSize(Math.min(maxWidth, Math.ceil(standardHeight * ratio)), standardHeight);
            MainGame.deltaX = Math.abs(Math.ceil((game.width - 800) * -.5));
            if (MainGame.stateName != "ScreenGame") {
                game.world.setBounds(Math.ceil((game.width - standardWidth) * -.5), 0, game.width, game.height)
            } else {
                var dX = Math.ceil((game.width - 800) * -.5);
                game.world.setBounds(dX, 0, MainGame.state.level_width - dX * 2, 600);
                game.camera.bounds.width = MainGame.state.level_width + MainGame.deltaX
            }
        } else {
            game.scale.setGameSize(standardWidth, standardHeight);
            MainGame.deltaX = 0;
            if (MainGame.stateName != "ScreenGame") {
                game.world.setBounds(0, 0, Math.ceil((game.height - standardHeight) * -.5), game.height)
            } else {
                game.world.setBounds(0, 0, MainGame.state.level_width, 600);
                game.camera.bounds.width = MainGame.state.level_width + MainGame.deltaX
            }
        }
        if (MainGame.stateName == "Menu" || MainGame.stateName == "ScreenLevel" || MainGame.stateName == "ScreenShop" || MainGame.stateName == "ScreenFinal" || MainGame.stateName == "ScreenGame")
            MainGame.state.updateResize()
    },
    clickMuteMusic: function(btn) {
        game.add.tween(btn.scale).to({
            x: .9,
            y: .9
        }, 200, Phaser.Easing.Cubic.Out, true);
        game.add.tween(btn.scale).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Cubic.Out, true, 260);
        MainGame.isMusicMuted = !MainGame.isMusicMuted;
        MainGame.isMusicMutedByUser = MainGame.isMusicMuted;
        if (!MainGame.isMusicMuted) {
            btn.frameName = "btn_music_0000"
        } else {
            btn.frameName = "btn_music_0001"
        }
        MainGame.muteMusic(MainGame.isMusicMuted)
    },
    muteMusic: function(vBool) {
        if (!MainGame.isGameLoaded)
            return;
        if (vBool) {
            MainGame.s_musicM.volume = 0;
            MainGame.s_musicG1.volume = 0
        } else {
            MainGame.s_musicM.volume = MainGame.s_musicM.valueVolume;
            MainGame.s_musicG1.volume = MainGame.s_musicG1.valueVolume
        }
    },
    clickMuteSFX: function(btn) {
        game.add.tween(btn.scale).to({
            x: .9,
            y: .9
        }, 200, Phaser.Easing.Cubic.Out, true);
        game.add.tween(btn.scale).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Cubic.Out, true, 260);
        MainGame.isSfxMuted = !MainGame.isSfxMuted;
        MainGame.isSfxMutedByUser = !MainGame.isSfxMuted;
        if (!MainGame.isSfxMuted) {
            btn.frameName = "btn_sound_0000"
        } else {
            btn.frameName = "btn_sound_0001"
        }
        MainGame.muteSfx(MainGame.isSfxMuted)
    },
    muteSfx: function(vBool) {
        if (!MainGame.isGameLoaded)
            return;
        if (vBool) {
            for (var i = 1; i <= 28; i++) {
                MainGame["s_sounds" + i].volume = 0
            }
            for (var i = 0; i < MainGame.countVoices; i++) {
                MainGame["v_voice" + i].volume = 0
            }
        } else {
            for (var i = 1; i <= 28; i++) {
                MainGame["s_sounds" + i].volume = MainGame["s_sounds" + i].valueVolume
            }
            for (var i = 0; i < MainGame.countVoices; i++) {
                MainGame["v_voice" + i].volume = MainGame["v_voice" + i].valueVolume
            }
        }
    },
    playMusic: function(num) {
        if (MainGame.isMusicPlaying === num)
            return;
        if (game.device.webAudio) {
            MainGame.stopMusic();
            switch (num) {
            case 0:
                MainGame.s_musicM.play("", 0, .9, true);
                break;
            case 1:
                MainGame.s_musicG1.play("", 0, .9, true);
                break
            }
        } else {
            MainGame.s_musicM.play("", 0, .9, true)
        }
        if (!MainGame.isMusicMuted) {
            MainGame.s_musicM.volume = MainGame.s_musicM.valueVolume;
            MainGame.s_musicG1.volume = MainGame.s_musicG1.valueVolume
        } else {
            MainGame.s_musicM.volume = 0;
            MainGame.s_musicG1.volume = 0
        }
        MainGame.isMusicPlaying = num
    },
    stopMusic: function() {
        if (game.device.webAudio) {
            MainGame.isMusicPlaying = -1;
            if (MainGame.s_musicM != null)
                MainGame.s_musicM.stop();
            if (MainGame.s_musicG1 != null)
                MainGame.s_musicG1.stop()
        }
    },
    playSound: function(vNum) {
        if (game.device.webAudio) {
            MainGame["s_sounds" + vNum].play()
        }
    },
    playVoice: function(vNum) {
        if (game.device.webAudio) {
            MainGame["v_voice" + vNum].play()
        }
    },
    showFps: function(vX, vY) {
        if (typeof vX === "undefined")
            vX = 20;
        if (typeof vY === "undefined")
            vY = 20;
        game.time.advancedTiming = true;
        MainGame.textFPS = game.add.text(vX, vY, "FPS", {
            font: "20px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
        MainGame.textFPS.fixedToCamera = true
    },
    clickLogo: function(vMoreGames) {
        if (typeof vMoreGames === "undefined")
            vMoreGames = true;
        if (MainGame.clickOne)
            return;
        try {} catch (err) {
            console.log(err)
        }
        MainGame.clickOne = true;
        game.time.events.add(500, MainGame.clickOneBack, this)
    },
    clickOneBack: function() {
        MainGame.clickOne = false
    },
    addEffect: function(vNum, vLayer, vX, vY, vAnchorX, vAnchorY) {
        if (typeof vAnchorX === "undefined")
            vAnchorX = .5;
        if (typeof vAnchorY === "undefined")
            vAnchorY = .5;
        var cframes = [15, 16, 12, 14, 14];
        var obj;
        var nameEffect;
        switch (vNum) {
        case 1:
            nameEffect = "e1";
            break;
        case 2:
            nameEffect = "e2";
            break;
        case 3:
            nameEffect = "e3";
            break;
        case 4:
            nameEffect = "e4";
            break;
        case 5:
            nameEffect = "e5";
            break
        }
        obj = vLayer.add(game.add.sprite(vX, vY, "ss_main2"));
        obj.anchor.setTo(vAnchorX, vAnchorY);
        obj.animations.add(nameEffect, Phaser.Animation.generateFrameNames(nameEffect + "_", 0, cframes[vNum - 1], "", 4), 30);
        obj.animations.play(nameEffect, 30, false, true);
        return obj
    },
    addFill: function(vLayer, vColor, vAlpha, vW, vH, posX, posY) {
        if (typeof vAlpha === "undefined")
            vAlpha = 1;
        if (typeof posX === "undefined")
            posX = 0;
        if (typeof posY === "undefined")
            posY = 0;
        if (typeof vW === "undefined") {
            vW = game.width;
            posX = -vW / 2
        }
        if (typeof vH === "undefined") {
            vH = game.height
        }
        var bg = vLayer.add(game.add.graphics(posX, posY));
        bg.beginFill(vColor, vAlpha);
        bg.drawRect(0, 0, vW, vH);
        bg.endFill();
        return bg
    }
};
KeyButton = function(game, link, kuda, x, y, callback, spritesheet, frame1, frame2, vText, vStyle, vFrameName, vId) {
    if (typeof vText === "undefined")
        vText = "";
    if (typeof vFrameName === "undefined")
        vFrameName = "";
    if (typeof vId === "undefined")
        vId = "";
    _game = game;
    if (kuda == null) {
        this.buttonC = game.add.group()
    } else {
        this.buttonC = kuda.add(game.add.group())
    }
    this.buttonC.x = x;
    this.buttonC.y = y;
    this.button = this.buttonC.add(game.add.button(0, 0, spritesheet, callback, link, frame1, frame2, frame1, frame2));
    this.button.game = _game;
    this.button.anchor.setTo(.5, .5);
    this.button.inputEnabled = true;
    this.button.textKey = vText;
    if (_game.device.desktop)
        this.button.input.useHandCursor = true;
    if (vText != "") {
        var text = this.buttonC.add(game.add.text(0, 2, vText.toUpperCase()));
        text.anchor.set(.5);
        this.text = text
    } else {
        if (vFrameName != "") {
            var text = this.buttonC.add(_game.add.sprite(0, -2, spritesheet, vFrameName));
            text.anchor.set(.5)
        }
        this.button.textKey = vId
    }
    this.button.events.onInputDown.add(function() {
        _game.add.tween(this.buttonC.scale).to({
            x: .9,
            y: .9
        }, 200, Phaser.Easing.Cubic.Out, true);
        _game.add.tween(this.buttonC.scale).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Cubic.Out, true, 260)
    }, this)
}
;
SimpleButton = function(game, link, kuda, x, y, key, frame, callback, animationScale, vText, vDx, vDy, vIsUpperCase, vSize, vAncX, vAncY) {
    if (typeof vText === "undefined")
        vText = "";
    if (typeof vDx === "undefined")
        vDx = 0;
    if (typeof vDy === "undefined")
        vDy = 0;
    if (typeof animationScale === "undefined")
        animationScale = 0;
    if (typeof vIsUpperCase === "undefined")
        vIsUpperCase = true;
    if (typeof vSize === "undefined")
        vSize = 50;
    if (typeof vAncX === "undefined")
        vAncX = .5;
    if (typeof vAncY === "undefined")
        vAncY = .5;
    _game = game;
    if (kuda == null) {
        this.buttonC = game.add.group()
    } else {
        this.buttonC = kuda.add(game.add.group())
    }
    this.buttonC.x = x;
    this.buttonC.y = y;
    this.button = this.buttonC.add(_game.add.sprite(0, 0, key, frame));
    this.button.game = _game;
    this.button.anchor.setTo(.5, .5);
    this.button.inputEnabled = true;
    if (vText != "") {
        if (vIsUpperCase)
            vText = vText.toUpperCase();
        var text1 = this.buttonC.add(game.add.bitmapText(0 + vDx, 5 + vDy, "bmf_riffic", vText, vSize));
        text1.anchor.set(vAncX, vAncY);
        text1.tint = 10248197;
        var text2 = this.buttonC.add(game.add.bitmapText(0 + vDx, 0 + vDy, "bmf_riffic", vText, vSize));
        text2.anchor.set(vAncX, vAncY);
        text2.tint = 16710912;
        text1.align = "center";
        text2.align = "center";
        this.text1 = text1;
        this.text2 = text2;
        MainGame.updateTextWidth(text1, this.button.width * 2);
        MainGame.updateTextWidth(text2, this.button.width * 2)
    }
    this.button.events.onInputDown.add(function() {
        if (this.buttonC.alpha < 1)
            return;
        _game.add.tween(this.buttonC.scale).to({
            x: .9,
            y: .9
        }, 200, Phaser.Easing.Cubic.Out, true);
        _game.add.tween(this.buttonC.scale).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Cubic.Out, true, 260);
        _game.time.events.add(250, callback, link)
    }, this);
    if (animationScale > 1) {
        _game.add.tween(this.buttonC.scale).to({
            x: animationScale,
            y: animationScale
        }, 630, Phaser.Easing.Linear.None).to({
            x: 1,
            y: 1
        }, 630, Phaser.Easing.Linear.None).loop().start()
    }
}
;
var MyKeyboard = {
    initKeyboard: function(vX, vY, vLayer, vTextField) {
        this.arrKeys = [];
        var posY = 0;
        var posX = 0;
        var sdvigX = vX;
        var btn;
        for (var i = 0; i < 36; i++) {
            if (i == 10 || i == 20 || i == 29) {
                posY++;
                posX = 0;
                if (posY == 1)
                    sdvigX = vX + 22.5;
                if (posY == 2)
                    sdvigX = vX + 45;
                if (posY == 3)
                    sdvigX = vX + 45 + 45
            }
            btn = new KeyButton(game,this,vLayer,sdvigX + 45 * posX++,vY + 45 * posY,this.keyPressVirutal,"ss_main","btn_key_miniOver_0000","btn_key_miniUp_0000",MainGame.keyboardKeys[i],MainGame.styleTextKey);
            this.arrKeys.push(btn)
        }
        btn = new KeyButton(game,this,vLayer,vX + 45 * 10,vY,this.keyPressVirutal,"ss_main","btn_key_miniOver_0000","btn_key_miniUp_0000","",MainGame.styleTextKey,"symbol_arrow_0000","bspace");
        this.arrKeys.push(btn);
        MainGame.keyboardField = vTextField;
        MainGame.keyboardArrKeys = this.arrKeys;
        MainGame.keyboardActivated = true
    },
    keyPressVirutal: function(vKey) {
        var ch = vKey.textKey;
        if (ch == "bspace") {
            this.removeBukva()
        } else if (ch == "space") {
            this.addBukva(" ")
        } else {
            this.addBukva(ch.toUpperCase())
        }
    },
    addBukva: function(vChar) {
        str = MainGame.keyboardField.text;
        strl = str.length;
        if (strl >= MainGame.MAX_LENGTH)
            return;
        if (strl == 0 && vChar == " ")
            return;
        MainGame.keyboardField.setText(MainGame.keyboardField.text + vChar)
    },
    removeBukva: function() {
        str = MainGame.keyboardField.text;
        strl = str.length;
        if (strl < 1)
            return;
        newstr = MainGame.keyboardField.text.substring(0, strl - 1);
        MainGame.keyboardField.setText(newstr)
    },
    tweenBtn: function(vBtn) {
        game.add.tween(vBtn.scale).to({
            x: .9,
            y: .9
        }, 200, Phaser.Easing.Cubic.Out, true);
        game.add.tween(vBtn.scale).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Cubic.Out, true, 260)
    }
};
var MyMath = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getRandomBool: function() {
        return Math.random() < .5 ? true : false
    },
    shuffleArr: function(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
        x = o[--i],
        o[i] = o[j],
        o[j] = x)
            ;
        return o
    },
    distanceTwoPoints: function(x1, x2, y1, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return dx * dx + dy * dy
    },
    isPointInRectangle: function(vX, vY, ax, ay, bx, by) {
        return ax <= vX && vX <= bx && ay <= vY && vY <= by
    },
    parseQuery: function(qstr) {
        var query = {};
        var a = qstr.substr(1).split("&");
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split("=");
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "")
        }
        return query
    },
    lerp: function(in_Src, in_Dst, in_Ratio) {
        return in_Src * (1 - in_Ratio) + in_Dst * in_Ratio
    }
};
function initGameStates() {
    game = new Phaser.Game(MainGame.Config.GAME_WIDTH,MainGame.Config.GAME_HEIGHT,Phaser.AUTO,"game-container");
    game.state.add("Boot", MainGame.Boot, true);
    game.state.add("Preloader", MainGame.Preloader);
    game.state.add("Menu", MainGame.Menu);
    game.state.add("Game", MainGame.Game);
    game.state.add("ScreenLevel", MainGame.ScreenLevel);
    game.state.add("ScreenShop", MainGame.ScreenShop);
    game.state.add("Comics", MainGame.Comics);
    game.state.add("ScreenFinal", MainGame.ScreenFinal)
}
function updateAccuracy(levelNum, vValue) {
    if (levelNum < 0 || levelNum > 13) {
        console.log("error: levelNum can be from 1 to 13");
        return
    }
    MainGame.accuracy[levelNum - 1] = vValue;
    console.log("updated accuracy");
    console.log(MainGame.accuracy)
}
function trace(a) {
    console.log(a)
}
MainGame.Boot = function(game) {
    this.lastW = null;
    this.lastH = null
}
;
MainGame.Boot.prototype = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setResizeCallback(this.resizeGame);
        game.scale.pageAlignHorizontally = true;
        if (game.device.desktop) {
            MainGame.onDesktop = true
        } else {
            game.scale.pageAlignVertically = true;
            game.scale.forceLandscape = true;
            if (MainGame.orientation == 0) {
                game.scale.forceOrientation(false, true)
            } else {
                game.scale.forceOrientation(true, false)
            }
            game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            game.scale.onOrientationChange.add(this.changeOrientation, this)
        }
        if (game.device.desktop) {
            game.onBlur.add(this.onGamePause, this);
            game.onFocus.add(this.onGameResume, this)
        } else {
            game.onPause.add(this.onGamePause, this);
            game.onResume.add(this.onGameResume, this)
        }
        MainGame.initSettings()
    },
    preload: function() {
        this.load.image("preloader_bar", "assets/preloader_bar.png?r=1");
        this.load.image("preloader_back", "assets/preloader_back.png?r=1");
        this.load.image("bg_menu", "assets/background/bg_menu.png?r=2")
    },
    create: function() {
        MainGame.resizeGame();
        this.state.start("Preloader")
    },
    onGamePause: function() {
        if (!MainGame.isApiBreakTime) {
            if (!MainGame.isMusicMutedByUser)
                MainGame.muteMusic(true);
            if (!MainGame.isSfxMutedByUser)
                MainGame.muteSfx(true)
        }
        if (MainGame.stateName == "ScreenGame")
            MainGame.state.onPause()
    },
    onGameResume: function() {
        if (!MainGame.isApiBreakTime) {
            if (!MainGame.isMusicMutedByUser)
                MainGame.muteMusic(false);
            if (!MainGame.isSfxMutedByUser)
                MainGame.muteSfx(false)
        }
    },
    resizeGame: function() {
        if (window.innerWidth < window.innerHeight)
            return;
        if (this.lastW != window.innerWidth || this.lastH != window.innerHeight) {
            this.lastW = window.innerWidth;
            this.lastH = window.innerHeight;
            MainGame.resizeGame()
        }
    },
    enterIncorrectOrientation: function() {
        MainGame.orientated = false;
        document.getElementById("orientation").style.display = "block";
        if (!game.device.android) {
            document.getElementById("orientation").style.width = window.innerWidth + "px";
            document.getElementById("orientation").style.height = window.innerHeight + "px"
        }
        game.paused = true;
        if (MainGame.stateName == "ScreenGame")
            MainGame.state.onPause()
    },
    leaveIncorrectOrientation: function() {
        MainGame.orientated = true;
        if (MainGame.loadIncorrect)
            window.location.reload();
        document.getElementById("orientation").style.display = "none";
        if (MainGame.stateName == "ScreenGame") {
            MainGame.state.onPause()
        } else {
            game.paused = false
        }
    },
    changeOrientation: function() {}
};
MainGame.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;
    this.ready = false
}
;
MainGame.Preloader.prototype = {
    preload: function() {
        game.stage.backgroundColor = "#0054B7";
        var bg = game.add.image(400, 300, "bg_menu");
        bg.anchor.setTo(.5);
        if (game.width > 1300)
            bg.width = game.width;
        var width = Math.ceil(400 / 2);
        this.background = game.add.sprite(MainGame.worldX - width, MainGame.worldY + 100, "preloader_back");
        this.preloadBar = game.add.sprite(MainGame.worldX - width, MainGame.worldY + 100, "preloader_bar");
        game.load.setPreloadSprite(this.preloadBar);
        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onFileComplete.add(this.fileComplete, this);
        game.load.onLoadComplete.add(this.loadComplete, this);
        game.load.spine("pers", "assets/spine/skeleton.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.bitmapFont("bmf_riffic", "assets/fonts/riffic50all.png", "assets/fonts/riffic50all.fnt");
        game.load.atlasJSONHash("ss_menu", "assets/spritesheets/ss_menu.png?r=" + MyMath.getRandomInt(0, 99), "assets/spritesheets/ss_menu.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.atlasJSONHash("ss_main1", "assets/spritesheets/ss_main1.png?r=" + MyMath.getRandomInt(0, 99), "assets/spritesheets/ss_main1.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.atlasJSONHash("ss_main2", "assets/spritesheets/ss_main2.png?r=" + MyMath.getRandomInt(0, 99), "assets/spritesheets/ss_main2.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.atlasJSONHash("ss_back", "assets/spritesheets/ss_back.png?r=" + MyMath.getRandomInt(0, 99), "assets/spritesheets/ss_back.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.atlasJSONHash("ss_comics", "assets/spritesheets/ss_comics.png?r=" + MyMath.getRandomInt(0, 99), "assets/spritesheets/ss_comics.json?r=" + MyMath.getRandomInt(0, 99));
        game.load.image("transp", "assets/transp.png?r=1");
        this.load.image("bg_congrats", "assets/background/bg_congratulations.png?r=2");
        game.load.audio("s_musicM", ["assets/audio/ogg/m_menu.ogg?r=1", "assets/audio/mp3/m_menu.mp3?r=1"]);
        game.load.audio("s_musicG1", ["assets/audio/ogg/m_game1.ogg?r=1", "assets/audio/mp3/m_game1.mp3?r=1"]);
        if (game.device.webAudio) {
            game.load.audio("s_sound1", ["assets/audio/ogg/sfx/boing_hit_hippo_or_bird.ogg", "assets/audio/mp3/sfx/boing_hit_hippo_or_bird.mp3"]);
            game.load.audio("s_sound2", ["assets/audio/ogg/sfx/buy_item.ogg", "assets/audio/mp3/sfx/buy_item.mp3"]);
            game.load.audio("s_sound3", ["assets/audio/ogg/sfx/draw_large_weapon.ogg", "assets/audio/mp3/sfx/draw_large_weapon.mp3"]);
            game.load.audio("s_sound4", ["assets/audio/ogg/sfx/draw_weapon.ogg", "assets/audio/mp3/sfx/draw_weapon.mp3"]);
            game.load.audio("s_sound5", ["assets/audio/ogg/sfx/drumroll_new_shot.ogg", "assets/audio/mp3/sfx/drumroll_new_shot.mp3"]);
            game.load.audio("s_sound6", ["assets/audio/ogg/sfx/explosion_rocket_hit.ogg", "assets/audio/mp3/sfx/explosion_rocket_hit.mp3"]);
            game.load.audio("s_sound7", ["assets/audio/ogg/sfx/grenade_collision.ogg", "assets/audio/mp3/sfx/grenade_collision.mp3"]);
            game.load.audio("s_sound8", ["assets/audio/ogg/sfx/grenade_launch.ogg", "assets/audio/mp3/sfx/grenade_launch.mp3"]);
            game.load.audio("s_sound9", ["assets/audio/ogg/sfx/grenade_tick_before_explosion.ogg", "assets/audio/mp3/sfx/grenade_tick_before_explosion.mp3"]);
            game.load.audio("s_sound10", ["assets/audio/ogg/sfx/launch_multiball_rw2.ogg", "assets/audio/mp3/sfx/launch_multiball_rw2.mp3"]);
            game.load.audio("s_sound11", ["assets/audio/ogg/sfx/random_environment_1.ogg", "assets/audio/mp3/sfx/random_environment_1.mp3"]);
            game.load.audio("s_sound12", ["assets/audio/ogg/sfx/random_environment_2.ogg", "assets/audio/mp3/sfx/random_environment_2.mp3"]);
            game.load.audio("s_sound13", ["assets/audio/ogg/sfx/random_environment_3.ogg", "assets/audio/mp3/sfx/random_environment_3.mp3"]);
            game.load.audio("s_sound14", ["assets/audio/ogg/sfx/random_environment_4.ogg", "assets/audio/mp3/sfx/random_environment_4.mp3"]);
            game.load.audio("s_sound15", ["assets/audio/ogg/sfx/random_environment_5.ogg", "assets/audio/mp3/sfx/random_environment_5.mp3"]);
            game.load.audio("s_sound16", ["assets/audio/ogg/sfx/random_environment_6.ogg", "assets/audio/mp3/sfx/random_environment_6.mp3"]);
            game.load.audio("s_sound17", ["assets/audio/ogg/sfx/rocket_launch.ogg", "assets/audio/mp3/sfx/rocket_launch.mp3"]);
            game.load.audio("s_sound18", ["assets/audio/ogg/sfx/sealoop_water.ogg", "assets/audio/mp3/sfx/sealoop_water.mp3"]);
            game.load.audio("s_sound19", ["assets/audio/ogg/sfx/shoot_bow_launch_arrow.ogg", "assets/audio/mp3/sfx/shoot_bow_launch_arrow.mp3"]);
            game.load.audio("s_sound20", ["assets/audio/ogg/sfx/splash_ball_hits_water.ogg", "assets/audio/mp3/sfx/splash_ball_hits_water.mp3"]);
            game.load.audio("s_sound21", ["assets/audio/ogg/sfx/splash_large_man_hits_water_1.ogg", "assets/audio/mp3/sfx/splash_large_man_hits_water_1.mp3"]);
            game.load.audio("s_sound22", ["assets/audio/ogg/sfx/splash_large_man_hits_water_2.ogg", "assets/audio/mp3/sfx/splash_large_man_hits_water_2.mp3"]);
            game.load.audio("s_sound23", ["assets/audio/ogg/sfx/tennisball_hit_ground.ogg", "assets/audio/mp3/sfx/tennisball_hit_ground.mp3"]);
            game.load.audio("s_sound24", ["assets/audio/ogg/sfx/vhf_called_rw2_level1.ogg", "assets/audio/mp3/sfx/vhf_called_rw2_level1.mp3"]);
            game.load.audio("s_sound25", ["assets/audio/ogg/sfx/victory_celebration_rw1.ogg", "assets/audio/mp3/sfx/victory_celebration_rw1.mp3"]);
            game.load.audio("s_sound26", ["assets/audio/ogg/sfx/victory_celebration_rw2.ogg", "assets/audio/mp3/sfx/victory_celebration_rw2.mp3"]);
            game.load.audio("s_sound27", ["assets/audio/ogg/sfx/whoosh_level_start.ogg", "assets/audio/mp3/sfx/whoosh_level_start.mp3"]);
            game.load.audio("s_sound28", ["assets/audio/ogg/sfx/fire_weapon.ogg", "assets/audio/mp3/sfx/fire_weapon.mp3"]);
            var arVoices = ["f1_ambulance1", "f1_ambulance3", "f1_byebye2", "f1_byebye3", "f1_manoverboard5", "f1_manoverboard7", "f1_ohno3", "f1_ohno4", "f2_auw1", "f2_auw3", "f2_auw4", "f2_auw5", "f2_auw6", "f3_auwmyhead2", "f3_auwmyhead4", "f3_auwmyhead5", "f4_Illgetyou2", "f4_Illgetyou3", "f4_revenge3", "f4_revenge5", "f4_youllregretthat1", "f4_youllregretthat5", "f5_hereItcomes2", "f5_hereItcomes4", "f5_hopeyouenjoy1", "f5_hopeyouenjoy3", "f5_takethis1", "f5_watchoutforthis1", "f5_watchoutforthis5", "o1_headshot1", "o1_headshot2", "o2_seeyoulater1", "o2_seeyoulater2", "o2_sleepingwiththefishes1", "o2_sleepingwiththefishes2", "o2_timetomeetyourmaker5", "o2_timetomeetyourmaker6", "o3_bullseye1", "o3_bullseye2", "o3_goodshot2", "o3_goodshot3", "o3_niceshot1", "o3_niceshot3", "o3_theyneversawitcoming1", "o4_miss1", "o4_miss2", "o4_miss3"];
            MainGame.countVoices = arVoices.length;
            for (var i = 0; i < MainGame.countVoices; i++) {
                game.load.audio("v_voice" + i, ["assets/audio/ogg/voices/" + arVoices[i] + ".ogg", "assets/audio/mp3/voices/" + arVoices[i] + ".mp3"])
            }
        }
        game.load.json("alltext", "assets/text/text.json?r=" + MyMath.getRandomInt(0, 99));
        game.add.text(0, 0, "0123456789", MainGame.styleText).destroy()
    },
    create: function() {
        MainGame.TEXT_FILE = game.cache.getJSON("alltext");
        MainGame.s_musicM = game.add.audio("s_musicM", 1);
        MainGame.s_musicG1 = game.add.audio("s_musicG1", 1);
        MainGame.s_musicM.valueVolume = .9;
        MainGame.s_musicG1.valueVolume = .9;
        if (game.device.webAudio) {
            var volumeSfx = .8;
            for (var i = 1; i <= 28; i++) {
                MainGame["s_sounds" + i] = game.add.audio("s_sound" + i, volumeSfx);
                MainGame["s_sounds" + i].valueVolume = volumeSfx
            }
            for (var i = 0; i < MainGame.countVoices; i++) {
                MainGame["v_voice" + i] = game.add.audio("v_voice" + i, 1.05);
                MainGame["v_voice" + i].valueVolume = 1.05
            }
        }
    },
    loadStart: function() {
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingStart()
    },
    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
        var data = {};
        data.percentageDone = progress / 100;
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingProgress(data)
    },
    loadComplete: function() {
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingFinished()
    },
    update: function() {
        if (!this.ready) {
            this.ready = true;
            MainGame.continueGame()
        }
    }
};
Bot = function(game, vLayer, vTeam, vSkin, vX, vY, vIsWave) {
    this.game = game;
    this.typeObj = "dodik";
    this.team = vTeam;
    this.isLive = true;
    this.isKicked = false;
    this.status = 0;
    this.ballHitted = 0;
    this.isOnBaza = true;
    this.isGoToBaza = false;
    this.ourScaleX = 1;
    this.strikeAngleN = 0;
    this.strikeAngleC = 0;
    this.strikePower = 0;
    this.animLast = 3;
    this.hpMax = 100;
    if (vTeam == 2) {
        if (MainGame.isHardMode) {
            this.hpMax = 150
        } else {
            if (MainGame.levelNum <= 1)
                this.hpMax = 50
        }
    }
    this.hpNow = this.hpMax;
    this.wasDamage = 0;
    this.isTopor = false;
    this.isBow = false;
    this.isWave = vIsWave;
    this.readyToShoot = false;
    this.isUpStriker = false;
    this.isMan = true;
    this.skin = vSkin;
    if (vSkin == "dog")
        this.isMan = false;
    if (vSkin == "v1" || vSkin == "v2" || vSkin == "v3" || vSkin == "v4" || vSkin == "c1" || vSkin == "c2" || vSkin == "c3") {
        this.isTopor = true
    }
    if (vSkin == "w1" || vSkin == "w2" || vSkin == "w3") {
        this.isBow = true
    }
    var obj;
    if (this.isMan) {
        obj = vLayer.add(game.add.spine(vX, vY, "pers"));
        obj.setSkinByName(vSkin);
        obj.setAnimationByName(0, "idle", true);
        obj.setToSetupPose();
        obj.onComplete.add(this.onAnimationComplete, this);
        obj.state.tracks[0].time = MyMath.getRandomInt(1, 7)
    } else {
        obj = vLayer.add(game.add.sprite(vX, vY, "ss_main1"));
        obj.anchor.setTo(.5, .97);
        obj.animations.add("idle", Phaser.Animation.generateFrameNames("dog_idle_", 0, 9, "", 4), 30);
        obj.animations.add("walk", Phaser.Animation.generateFrameNames("dog_walk_", 0, 14, "", 4), 30);
        obj.animations.add("kick", Phaser.Animation.generateFrameNames("dog_kick_", 0, 14, "", 4), 30);
        obj.animations.play("idle", 30, true)
    }
    var body = new Phaser.Physics.Box2D.Body(game,null,vX,vY,2);
    if (this.isMan) {
        if (vSkin == "simon" || vSkin == "dkid" || vSkin == "r4" || vSkin == "r3") {
            body.addCircle(30, 0, -60);
            body.addCircle(25, 0, -25)
        } else {
            body.addCircle(30, 0, -80);
            body.addCircle(25, 0, -25)
        }
    } else {
        body.addCircle(30, 0, -30)
    }
    body.restitution = .25;
    body.fixedRotation = true;
    body.mass = 4;
    body.link = this;
    this.obj = obj;
    this.body = body;
    if (vTeam == 2)
        this.setScale(-1)
}
;
Bot.prototype.onAnimationComplete = function() {
    if (this.isLive) {
        var animName = this.obj.state.tracks[0].animation.name;
        if (animName == "gogun") {
            MainGame.state.isTimeAim = true
        } else if (animName == "shoot") {}
        if (animName == "gogun2") {
            MainGame.state.isTimeAim = true
        } else if (animName == "shoot") {}
    }
}
;
Bot.prototype.initStartPos = function() {
    this.startX = this.body.x;
    this.startY = this.body.y
}
;
Bot.prototype.setToStartPos = function() {
    if (!this.isLive)
        return;
    if (this.hpNow <= 0)
        return;
    this.body.x = this.startX;
    this.body.y = this.startY;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.obj.scale.x = this.ourScaleX;
    if (this.readyToShoot) {
        if (this.isGoToBaza)
            this.updateAnim(0)
    } else {
        this.updateAnim(3)
    }
    this.isGoToBaza = false;
    this.isOnBaza = true;
    this.ballHitted = 0;
    this.status = 0;
    this.timeAttack = 0;
    this.isKicked = false;
    this.isWasKicked = false;
    this.wasDamage = 0;
    this.animLast = -1
}
;
Bot.prototype.setScale = function(vValue) {
    this.ourScaleX = vValue;
    this.obj.scale.x = vValue
}
;
Bot.prototype.checkBaza = function(vTeam, vOrder) {
    if (this.team == vTeam)
        return;
    if (this.distanceBaza() > 7) {
        this.isOnBaza = false
    }
}
;
Bot.prototype.distanceBaza = function() {
    return Phaser.Math.distance(this.body.x, this.body.y, this.startX, this.startY)
}
;
Bot.prototype.moveToBaza = function() {
    if (this.isWasKicked)
        this.updateHpBar();
    if (this.hpNow > 0) {
        this.isGoToBaza = true;
        this.updateAnim(2)
    }
}
;
Bot.prototype.isEnemy = function() {
    return this.isLive && this.team == 2 && this.hpNow > 0
}
;
Bot.prototype.goAttack = function(vAngle, vPower) {
    this.timeAttack = 1;
    this.strikeAngleC = 0;
    this.strikeAngleN = vAngle;
    this.strikePower = vPower
}
;
Bot.prototype.getDamage = function(vValue) {
    if (this.ballHitted > 0)
        return;
    this.hpNow -= vValue;
    if (this.hpNow < 0) {
        this.hpNow = 0
    }
    this.isWasKicked = true;
    this.wasDamage += vValue;
    game.time.events.add(200, this.canDamageAgain, this).autoDestroy = true;
    this.ballHitted++;
    if (this.team == 1) {
        MainGame.state.opponentGetDmg()
    }
}
;
Bot.prototype.canDamageAgain = function() {
    this.ballHitted = 0
}
;
Bot.prototype.updateHpBar = function() {
    var newWidth = 53 * (this.hpNow / this.hpMax);
    game.tweens.removeFrom(this.hpBar.cropRect);
    var _this = this;
    game.add.tween(this.hpBar.cropRect).to({
        width: newWidth
    }, 500, "Linear", true, 150).onComplete.add(function() {
        if (_this.hpNow <= 0) {
            _this.body.sensor = true;
            if (_this.isMan) {
                _this.obj.setAnimationByName(0, "kick", false)
            } else {
                _this.obj.animations.play("kick", 30, true)
            }
            _this.hpBar.visible = false;
            MainGame.state.swapLayer(_this.obj)
        }
    });
    this.isCropingTime = true;
    this.newWidth = newWidth;
    MainGame.state.addDamageEffect(this.wasDamage, this.obj.x, this.obj.y - 150);
    this.mini.cropRect.width = 32 * (this.hpNow / this.hpMax);
    this.mini.bar2.updateCrop();
    if (this.hpNow <= 0) {
        this.updateMiniIcon()
    }
}
;
Bot.prototype.showDialog = function(vPar, vText) {
    if (this.dialog.visible)
        return;
    this.dialog.text.setText(vText);
    var dW = this.dialog.text.width + 25;
    if (dW < 190) {
        this.dialog.dialog2.frameName = "msg2_0000";
        this.dialog.dialog2.width = dW
    } else {
        this.dialog.dialog2.frameName = "msg1_0000";
        this.dialog.dialog2.width = dW
    }
    var _dialog = this.dialog;
    _dialog.alpha = 1;
    _dialog.visible = true;
    _dialog.scale.setTo(.25);
    var timeShow = 2500;
    if (vPar == 1)
        timeShow = 1200;
    game.add.tween(_dialog.scale).to({
        x: 1,
        y: 1
    }, 500, "Elastic.easeOut", true);
    game.add.tween(_dialog).to({
        alpha: 0
    }, 150, "Linear", true, timeShow).onComplete.add(function() {
        _dialog.visible = false
    })
}
;
Bot.prototype.updateAnim = function(vNum) {
    if (!this.isLive)
        return;
    if (this.animLast == vNum && vNum < 5)
        return;
    if (this.isMan) {
        switch (vNum) {
        case 0:
            if (this.isTopor) {
                this.obj.setAnimationByName(0, "gogun2", false);
                this.obj.addAnimationByName(0, "aim2", true)
            } else {
                this.obj.setAnimationByName(0, "gogun", false);
                this.obj.addAnimationByName(0, "aim", true)
            }
            MainGame.playSound(4);
            break;
        case 1:
            if (this.isTopor) {
                this.obj.setAnimationByName(0, "shoot2", false)
            } else {
                if (this.isBow) {
                    this.obj.setAnimationByName(0, "shoot3", false);
                    this.obj.addAnimationByName(0, "aim", true)
                } else {
                    this.obj.setAnimationByName(0, "shoot", false);
                    this.obj.addAnimationByName(0, "aim", true)
                }
            }
            break;
        case 2:
            this.obj.setAnimationByName(0, "walk", true);
            break;
        case 3:
            this.obj.setAnimationByName(0, "idle", true);
            this.obj.state.tracks[0].time = MyMath.getRandomInt(1, 7);
            break;
        case 4:
            this.obj.setAnimationByName(0, "kick", false);
            this.isKicked = true;
            break;
        case 5:
            this.obj.setAnimationByName(0, "see", false);
            this.obj.addAnimationByName(0, "idle", true);
            break;
        case 6:
            if (this.isTopor) {
                this.obj.setAnimationByName(0, "win2", true)
            } else {
                this.obj.setAnimationByName(0, "win", true)
            }
            this.obj.state.tracks[0].time = MyMath.getRandomInt(1, 7);
            break;
        case 105:
            this.obj.setAnimationByName(0, "sem5", false);
            this.obj.addAnimationByName(0, "sem5", false);
            this.obj.addAnimationByName(0, "sem5", false);
            this.obj.addAnimationByName(0, "sem5", false);
            this.obj.addAnimationByName(0, "idle", true);
            break;
        default:
            this.obj.setAnimationByName(0, "sem" + (vNum - 100), false);
            this.obj.addAnimationByName(0, "idle", true);
            break
        }
        this.obj.setToSetupPose()
    } else {
        switch (vNum) {
        case 2:
            this.obj.animations.play("walk", 30, true);
            break;
        case 3:
            this.obj.animations.play("idle", 30, true);
            break;
        case 4:
            this.obj.animations.play("kick", 30, true);
            this.isKicked = true;
            break
        }
    }
    this.animLast = vNum
}
;
Bot.prototype.update = function(vWave) {
    this.obj.x = this.body.x;
    if (this.isWave && this.isLive) {
        this.obj.y = this.body.y + Math.sin(vWave) * 2.6
    } else {
        this.obj.y = this.body.y
    }
    this.hpBar.x = this.obj.x;
    this.hpBar.y = this.obj.y + this.hpBar.offsetY;
    this.dialog.x = this.obj.x;
    this.dialog.y = this.body.y + this.dialog.offsetY - 130;
    if (this.isCropingTime) {
        this.hpBar.bar2.updateCrop();
        if (this.hpBar.cropRect.width == this.newWidth) {
            this.isCropingTime = false
        }
    }
    if (!this.isLive)
        return;
    if (this.timeAttack > 0) {
        this.timeAttack++;
        if (this.timeAttack > 90 && this.timeAttack < 200) {
            if (this.strikeAngleN != this.strikeAngleC) {
                if (this.strikeAngleN - this.strikeAngleC < 0) {
                    this.strikeAngleC -= 1
                } else {
                    this.strikeAngleC += 1
                }
                MainGame.state.aimEnemy(this.isTopor, this.strikeAngleC)
            } else {
                if (this.isTopor) {
                    this.updateAnim(1);
                    MainGame.state.aimEnemy(this.isTopor, this.strikeAngleC);
                    this.timeAttack = 210
                } else {
                    this.timeAttack = 200
                }
            }
        } else if (this.timeAttack > 230) {
            if (!this.isTopor)
                this.updateAnim(1);
            MainGame.state.aimEnemy(this.isTopor, this.strikeAngleC);
            MainGame.state.strikeEnemy(this.isTopor, this.body.x, this.body.y, this.strikeAngleC, this.strikePower);
            this.timeAttack = -1
        } else if (this.timeAttack == 50) {
            this.updateAnim(0)
        }
    }
    if (this.isGoToBaza) {
        var dist = this.distanceBaza();
        if (dist > 6) {
            if (this.body.x - this.startX > 0) {
                this.body.velocity.x = -82;
                this.obj.scale.x = -1
            } else {
                this.body.velocity.x = 82;
                this.obj.scale.x = 1
            }
        } else {
            this.setToStartPos();
            this.isGoToBaza = false
        }
    } else {
        if (this.isKicked) {
            if (Math.abs(this.body.velocity.x) < 2 && Math.abs(this.body.velocity.y) < 2) {
                this.updateAnim(3);
                this.isKicked = false
            }
        }
    }
    if (this.body.y > 500) {
        MainGame.state.dodikUtonul(this.team, this.body.x, 480);
        this.hpNow = -100;
        this.updateMiniIcon();
        this.isLive = false;
        game.time.events.add(600, this.goZeroVelocity, this).autoDestroy = true
    }
}
;
Bot.prototype.updateMiniIcon = function() {
    this.mini.bar1.visible = false;
    this.mini.bar2.visible = false;
    this.mini.obj.frameName = "map_dead_0000";
    if (this.team == 2) {
        this.mini.obj.scale.x = -1
    }
}
;
Bot.prototype.goZeroVelocity = function() {
    this.body.velocity.x = 0
}
;
Bot.prototype.remove = function() {}
;
MainGame.Game = function(game) {}
;
MainGame.Game.prototype = {
    create: function() {
        MainGame.loadSaves();
        game.stage.backgroundColor = "#0054B7";
        MainGame.state = this;
        MainGame.stateName = "ScreenGame";
        this.isFirstStike = true;
        var tileSky = game.add.image(-10, 300, "ss_back", "sky2_0000");
        tileSky.anchor.setTo(0, .5);
        tileSky.fixedToCamera = true;
        tileSky.width = game.width * 1.1;
        tileSky.height = game.height * 1.1;
        this.tileSky = tileSky;
        this.layerBack = game.add.group();
        this.layerBack3 = this.layerBack.add(game.add.group());
        this.layerBack2 = this.layerBack.add(game.add.group());
        this.layerBack1 = this.layerBack.add(game.add.group());
        this.layerMain = game.add.group();
        this.layerEffect = game.add.group();
        this.layerHpBars = game.add.group();
        this.layerWater = game.add.group();
        if (MainGame.isDebug)
            this.layerTest = game.add.group();
        this.layerDialog = game.add.group();
        this.layerTextM = game.add.group();
        this.layerTextM.fixedToCamera = true;
        this.layerText = this.layerTextM.add(game.add.group());
        this.layerTop = game.add.group();
        this.layerTop.fixedToCamera = true;
        this.sdvigMap1 = 0;
        this.sdvigMap2 = 0;
        this.countTeam1 = 0;
        this.countTeam2 = 0;
        this.layerMap1 = this.layerTop.add(game.add.group());
        this.layerMap2 = this.layerTop.add(game.add.group());
        this.layerWeapon = this.layerTop.add(game.add.group());
        this.layerFinish = game.add.group();
        this.layerFinish.fixedToCamera = true;
        this.layerTopPause = game.add.group();
        this.layerTopPause.fixedToCamera = true;
        this.layerPopup = game.add.group();
        this.layerPopup.fixedToCamera = true;
        if (MainGame.levelNum == 12) {
            MainGame.save_typeBoat = MainGame.typeBoat;
            MainGame.save_countGranat = MainGame.countGranat;
            MainGame.save_countRocket = MainGame.countRocket;
            MainGame.typeBoat = 0;
            MainGame.countGranat = 0;
            MainGame.countRocket = 0
        }
        if (MainGame.showFPS)
            MainGame.showFps(20, 10);
        this.initBackground();
        var btnTap = this.layerTop.add(game.add.image(740, 60, "ss_main2", "btn_pause_0000"));
        btnTap.anchor.setTo(.5);
        btnTap.inputEnabled = true;
        btnTap.events.onInputUp.add(this.clickPause, this);
        this.btnTap = btnTap;
        if (MainGame.isDebug) {
            MainGame.addButton(this, this.layerTop, 400, 35, this.clickTestWin, "win", 80, 40, 24);
            MainGame.addButton(this, this.layerTop, 500, 35, this.clickTestLose, "lose", 80, 40, 24)
        }
        this.layerPanelTurn = this.layerTop.add(game.add.group());
        this.layerPanelTurn.x = -110;
        var plahaTurn = this.layerPanelTurn.add(game.add.image(0, 140, "ss_main2", "panel_turn_0000"));
        this.textOnScreen = MainGame.addText(120, 180, 140 + 36, MainGame.GAME_TEXT.your_turn, this.layerPanelTurn, 22, 16777215, .5, .5);
        var plahaBtn = this.layerWeapon.add(game.add.image(155, 60, "ss_main2", "weapon_panel_0000"));
        plahaBtn.anchor.setTo(.5);
        var wBtn1 = this.layerWeapon.add(game.add.image(155 - 90, 60, "ss_main2", "btn_gun_0000"));
        wBtn1.anchor.setTo(.5);
        wBtn1.inputEnabled = true;
        wBtn1.events.onInputDown.add(this.selectBall1, this);
        this.btnBall1 = wBtn1;
        var icon1t = this.layerWeapon.add(game.add.image(wBtn1.x - 3, wBtn1.y + 4, "ss_main2", "ball_t_0000"));
        icon1t.anchor.setTo(.5);
        var icon1n = this.layerWeapon.add(game.add.image(wBtn1.x, wBtn1.y, "ss_main2", "ball_n_0000"));
        icon1n.anchor.setTo(.5);
        var wBtn2 = this.layerWeapon.add(game.add.image(155, 60, "ss_main2", "btn_gun_0000"));
        wBtn2.anchor.setTo(.5);
        wBtn2.inputEnabled = true;
        wBtn2.events.onInputDown.add(this.selectBall2, this);
        this.btnBall2 = wBtn2;
        var icon2t = this.layerWeapon.add(game.add.image(wBtn2.x - 3, wBtn2.y + 4, "ss_main2", "grenade_t_0000"));
        icon2t.anchor.setTo(.5);
        var icon2n = this.layerWeapon.add(game.add.image(wBtn2.x, wBtn2.y, "ss_main2", "grenade_n_0000"));
        icon2n.anchor.setTo(.5);
        var wBtn3 = this.layerWeapon.add(game.add.image(155 + 90, 60, "ss_main2", "btn_gun_0000"));
        wBtn3.anchor.setTo(.5);
        wBtn3.inputEnabled = true;
        wBtn3.events.onInputDown.add(this.selectBall3, this);
        this.btnBall3 = wBtn3;
        var icon3t = this.layerWeapon.add(game.add.image(wBtn3.x - 3, wBtn3.y + 4, "ss_main2", "rocket_t_0000"));
        icon3t.anchor.setTo(.5);
        var icon3n = this.layerWeapon.add(game.add.image(wBtn3.x, wBtn3.y, "ss_main2", "rocket_n_0000"));
        icon3n.anchor.setTo(.5);
        this.krutilka = this.layerWeapon.add(game.add.image(wBtn1.x, wBtn1.y, "ss_main2", "krutilka_0000"));
        this.krutilka.anchor.setTo(.5);
        game.add.tween(this.krutilka).to({
            angle: 180
        }, 700, "Linear", true, 0, -1, false);
        var im1 = this.layerWeapon.add(game.add.image(wBtn2.x + 30, wBtn2.y + 35, "ss_main2", "ammo1_0000"));
        im1.anchor.setTo(.5);
        var im2 = this.layerWeapon.add(game.add.image(wBtn3.x + 30, wBtn3.y + 35, "ss_main2", "ammo2_0000"));
        im2.anchor.setTo(.5);
        var textLvl = MainGame.replaceText(MainGame.GAME_TEXT.level_N, MainGame.levelNum + 1).toUpperCase();
        var levelNameT1 = MainGame.addText(220, 0, 75 + 5, textLvl, this.layerText, 38, 9330034, 0, .5);
        var levelNameT2 = MainGame.addText(220, 0, 75, textLvl, this.layerText, 38, 16711170, 0, .5);
        var titleLevel = MainGame.GAME_TEXT["level_nameRW1_" + Number(MainGame.levelNum + 1)];
        var textLvl = titleLevel.toUpperCase();
        var levelNameT3 = MainGame.addText(400, 15 + levelNameT1.width, 75 + 5, textLvl, this.layerText, 38, 9330034, 0, .5);
        var levelNameT4 = MainGame.addText(400, 15 + levelNameT1.width, 75, textLvl, this.layerText, 38, 16777215, 0, .5);
        var lengthTitle = levelNameT1.width + 15 + levelNameT3.width;
        var otstup = Math.floor(-lengthTitle) * .5;
        levelNameT1.x = levelNameT2.x = otstup;
        levelNameT3.x = levelNameT4.x = otstup + levelNameT1.width + 15;
        var textShots = MainGame.replaceText(MainGame.GAME_TEXT.complete_N_shots, MainGame.arShots[MainGame.levelNum]);
        var text = MainGame.addText(600, 0, 130, textShots, this.layerText, 28, 16777215, .5, .5);
        MainGame.addText(400, 0, 190, MainGame.GAME_TEXT.tap_to_begin, this.layerText, 32, 16777215, .5, .5);
        if (MainGame.isDebug) {}
        this.timerSfxHitBall = 0;
        this.DISTANCE_FOR_AIM = 40;
        this.isShooted = false;
        this.isLevelCompleted = false;
        this.isFinishShown = false;
        this.isLevelWin = false;
        this.stepAttack = 0;
        this.countMissed = 0;
        this.turnNum = 1;
        this.gameStatus = 0;
        this.arDodiki = [];
        this.typeGun = 0;
        this.lastTypeGun = 0;
        this.isTimeAim = false;
        this.isInputPress = false;
        this.isHitWater = false;
        this.worldManifold = new box2d.b2WorldManifold;
        this.launchVelocity = new Phaser.Point(0,0);
        this.inputPointDown = new Phaser.Point(0,0);
        this.dotPoint1 = new Phaser.Point(0,0);
        this.dotPoint10 = new Phaser.Point(0,0);
        this.cameraPoint = this.layerEffect.add(game.add.image(0, 0, "ss_main2", "ballG_0000"));
        this.cameraPoint.alpha = 0;
        this.waveCount = 0;
        this.isCanStartCheck = false;
        this.isOpponentMiss = true;
        this.isSimonTalked = false;
        this.timeToStart = 0;
        this.stat_shots = 0;
        this.stat_enemy = 0;
        this.stat_time = 0;
        this.lastTargetPosP1 = 0;
        this.lastTargetPosP2 = 0;
        this.lastTargetPosC1 = 0;
        this.lastTargetPosC2 = 0;
        game.input.onDown.add(this.inputStageDown, this);
        game.input.onUp.add(this.inputStageUp, this);
        this.CATEGORY_BALL = 1;
        this.CATEGORY_DODIK = 2;
        this.CATEGORY_GROUND1 = 4;
        this.CATEGORY_GROUND2 = 8;
        this.CATEGORY_GROUND3 = 16;
        this.MASK_BALL = this.CATEGORY_DODIK | this.CATEGORY_GROUND1 | this.CATEGORY_GROUND2 | this.CATEGORY_GROUND3;
        this.MASK_DODIK1 = this.CATEGORY_BALL | this.CATEGORY_GROUND1 | this.CATEGORY_DODIK;
        this.MASK_DODIK2 = this.CATEGORY_BALL | this.CATEGORY_GROUND2 | this.CATEGORY_DODIK;
        this.MASK_DODIK3 = this.CATEGORY_BALL | this.CATEGORY_GROUND3 | this.CATEGORY_DODIK;
        this.MASK_GROUND = this.CATEGORY_GROUND1 & this.CATEGORY_GROUND2 & this.CATEGORY_GROUND3;
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.gravity.y = 550;
        this.ball = this.layerMain.add(game.add.sprite(0, -100, "ss_main1", "ball1_0000"));
        this.layerAiming = this.layerWater.add(game.add.group());
        this.aimCircle = this.layerAiming.add(game.add.sprite(0, -100, "ss_main2", "aimCircle_0000"));
        this.aimCircle.anchor.setTo(.5);
        this.aimCircle.visible = false;
        game.add.tween(this.aimCircle).to({
            angle: -180
        }, 1e3, "Linear", true, 0, -1, false);
        this.level_width = 2800;
        this.waveAr = [];
        var bodyBox;
        var boatPosX = 170;
        var boatPosY = 465;
        var hero1PosX = 240;
        var hero1PosY = 462;
        var hero2PosX = 100;
        var hero2PosY = 462;
        var hero3PosX = 0;
        var hero3PosY = 0;
        switch (MainGame.typeBoat) {
        case 0:
            boatPosX = 170;
            boatPosY = 465;
            hero2PosX = 155;
            hero2PosY = 462;
            var offsetX = 62;
            var offsetY = 48;
            this.addBodyShape(1, [111, 75, 104, 45, 120, 29], boatPosX - offsetX, boatPosY - offsetY);
            this.addBodyShape(1, [16, 45, 6, 75, 2, 27], boatPosX - offsetX, boatPosY - offsetY);
            this.addBodyShape(1, [111, 75, 6, 75, 16, 45, 104, 45], boatPosX - offsetX, boatPosY - offsetY);
            break;
        case 1:
            bodyBox = this.addPolygon([47, 443, 53, 486, 282, 489, 295, 443, 274, 463, 64, 463]);
            break;
        case 2:
            boatPosX = 215;
            boatPosY = 475;
            hero1PosX = 320;
            hero1PosY = 462;
            hero2PosX = 195;
            hero2PosY = 462;
            hero3PosX = 100;
            hero3PosY = 462;
            bodyBox = this.addPolygon([53, 450, 53, 486, 282 + 82, 489, 295 + 82, 440, 274 + 82, 463, 80, 463]);
            break;
        case 3:
            boatPosX = 270;
            boatPosY = 440;
            hero1PosX = 390;
            hero1PosY = 425;
            hero2PosX = 265;
            hero2PosY = 431;
            hero3PosX = 140;
            hero3PosY = 432;
            bodyBox = this.addPolygon([45, 375, 60, 485, 450, 482, 458, 439, 478, 433, 475, 390, 412, 425, 200, 435, 93, 431, 83, 370]);
            break;
        case 4:
            var dfY = 20;
            boatPosX = 300 - dfY;
            boatPosY = 370;
            hero1PosX = 460 - dfY;
            hero1PosY = 429;
            hero2PosX = 180 - dfY;
            hero2PosY = 372;
            hero3PosX = 360 - dfY;
            hero3PosY = 435;
            bodyBox = this.addPolygon([35 - dfY, 315, 74 - dfY, 470, 532 - dfY, 470, 559 - dfY, 397, 544 - dfY, 375, 515 - dfY, 427, 312 - dfY, 439, 222 - dfY, 372, 135 - dfY, 374, 110 - dfY, 300]);
            break
        }
        if (bodyBox)
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
        var barrel = this.layerEffect.add(game.add.image(boatPosX, boatPosY, "ss_main1", "boat" + MainGame.typeBoat + "_0000"));
        barrel.anchor.setTo(.5);
        barrel.startY = barrel.y;
        this.waveAr.push(barrel);
        if (MainGame.typeBoat == 4) {
            var flag = this.layerEffect.add(game.add.sprite(19, 225, "ss_main1"));
            flag.animations.add("flag", Phaser.Animation.generateFrameNames("flag_", 0, 20, "", 4), 30);
            flag.animations.play("flag", 30, true);
            flag.startY = 225;
            this.waveAr.push(flag)
        }
        var sdvigE = 0;
        switch (MainGame.levelNum) {
        case 0:
            this.posCameraEnemy = 1800;
            this.miniSdvigX = 60;
            sdvigE = 1450;
            var barrel = this.layerEffect.add(game.add.image(220 + sdvigE, 465, "ss_main1", "barrel1_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addRectangle(220 + sdvigE, 473, 170, 110);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var shipUp = 0;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 700, 290, "ss_main1", "pship_0000"));
            ship.anchor.setTo(.5);
            ship.angle = 12;
            var stone = this.layerEffect.add(game.add.image(sdvigE + 472, 487, "ss_main1", "pshipstone_0000"));
            stone.anchor.setTo(.5);
            var bodyBox = this.addPolygon([sdvigE + 427, shipUp + 327, sdvigE + 448, shipUp + 350, sdvigE + 520, shipUp + 350, sdvigE + 585, shipUp + 420, sdvigE + 630, shipUp + 420, sdvigE + 667, shipUp + 402, sdvigE + 718, shipUp + 202, sdvigE + 698, shipUp + 194, sdvigE + 690, shipUp + 123, sdvigE + 735, shipUp + 131, sdvigE + 765, shipUp + 14, sdvigE + 794, shipUp + 20, sdvigE + 785, shipUp + 480, sdvigE + 440, shipUp + 484, sdvigE + 451, shipUp + 458, sdvigE + 479, shipUp + 437, sdvigE + 414, shipUp + 350]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            this.viking1 = this.addDodik(2, "p2", sdvigE + 220, 417, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking2 = this.addDodik(2, "p1", sdvigE + 480, 350, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            break;
        case 1:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 0;
            sdvigE = 1450;
            var barrel = this.layerEffect.add(game.add.image(220 + sdvigE, 465, "ss_main1", "boat5_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([sdvigE + 116, 434, sdvigE + 135, 480, sdvigE + 311, 480, sdvigE + 323, 441, sdvigE + 290, 464, sdvigE + 152, 463]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var shipUp = 0;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 900, 425, "ss_main1", "stoneland_1_0000"));
            ship.anchor.setTo(.5);
            var bodyBox = this.addPolygon([450 + sdvigE + 26, 425, 450 + sdvigE + 36, 455, 450 + sdvigE + 201, 458, 450 + sdvigE + 270, 517, 450 + sdvigE + 875, 527, 450 + sdvigE + 785, 439, 450 + sdvigE + 628, 334, 450 + sdvigE + 557, 325, 450 + sdvigE + 441, 325, 450 + sdvigE + 412, 375, 450 + sdvigE + 368, 403, 450 + sdvigE + 325, 425]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            this.viking1 = this.addDodik(2, "v3", sdvigE + 220, 462, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 0);
            this.viking2 = this.addDodik(2, "v1", sdvigE + 620, 424, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            this.viking3 = this.addDodik(2, "v2", sdvigE + 960, 324, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            break;
        case 2:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 15;
            sdvigE = 1450;
            var barrel = this.layerEffect.add(game.add.image(900 + sdvigE, 440, "ss_main1", "boat6_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2333, 383, 2233, 443, 2274, 483, 2420, 493, 2472, 454, 2455, 435, 2440, 435, 2413, 449, 2358, 451, 2325, 416, 2354, 399]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var barrel = this.layerEffect.add(game.add.image(70 + 220 + sdvigE, 450 + 20, "ss_main1", "boat9_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([70 + 1492, 441 + 20, 70 + 1524, 483 + 20, 70 + 1785, 487 + 20, 70 + 1810, 448 + 20, 70 + 1784, 430 + 20, 70 + 1754, 448 + 20, 70 + 1553, 448 + 20, 70 + 1519, 422 + 20]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "b4", 70 + 1590, 467, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking2 = this.addDodik(2, "b3", 70 + 1710, 467, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking3 = this.addDodik(2, "b2", 2390, 449, this.CATEGORY_DODIK, this.MASK_DODIK3, true, 10);
            this.viking3.isUpStriker = true;
            break;
        case 3:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 15;
            sdvigE = 1450;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 995, 262, "ss_main1", "treeland_1_0000"));
            ship.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2085, 413, 2098, 445, 2650, 445, 2620, 32, 2489, 31, 2471, 94, 2436, 115, 2436, 144, 2527, 164, 2549, 229, 2539, 277, 2558, 375, 2483, 413]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            var barrel = this.layerEffect.add(game.add.image(1940, 477, "ss_main1", "boat8_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addRectangle(1940, 492, 100, 25);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var lkX = -690;
            var barrel = this.layerEffect.add(game.add.image(lkX + 2350, 440, "ss_main1", "boat7_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([lkX + 2333, 383, lkX + 2233, 443, lkX + 2274, 483, lkX + 2420, 493, lkX + 2472, 454, lkX + 2455, 435, lkX + 2440, 435, lkX + 2413, 449, lkX + 2358, 451, lkX + 2325, 416, lkX + 2354, 399]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "r4", 1705, 449, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 20);
            this.viking2 = this.addDodik(2, "r3", 1940, 479, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 20);
            this.viking3 = this.addDodik(2, "r1", 2340, 411, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 10);
            this.viking1.isUpStriker = true;
            this.viking2.isUpStriker = true;
            break;
        case 4:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 0;
            sdvigE = 1450;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 800, 445, "ss_main1", "chinesboat_0000"));
            ship.anchor.setTo(.5);
            ship.startY = ship.y;
            this.waveAr.push(ship);
            var bodyBox = this.addPolygon([1950, 454, 2146, 454, 2254, 355, 2535, 354, 2533, 385, 2289, 484, 1950, 483]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            this.viking1 = this.addDodik(2, "c2", 2057, 453, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking2 = this.addDodik(2, "c1", 2275, 354, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking3 = this.addDodik(2, "c3", 2455, 354, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.viking3.isUpStriker = true;
            break;
        case 5:
            this.posCameraEnemy = 2350;
            this.miniSdvigX = 0;
            var lkX = 250;
            var barrel = this.layerEffect.add(game.add.image(1650 + lkX, 465, "ss_main1", "barrel1_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addRectangle(1650 + lkX, 473, 170, 110);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var stone = this.layerEffect.add(game.add.image(1922 + lkX + 20, 487, "ss_main1", "pshipstone_0000"));
            stone.anchor.setTo(.5);
            stone.width = 160;
            var bodyBox = this.addRectangle(1915 + lkX + 40, 480, 120, 90);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            var shipUp = 0;
            var ship = this.layerEffect.add(game.add.image(2280 + lkX, 410, "ss_main1", "pship_0000"));
            ship.anchor.setTo(.5);
            ship.angle = 35;
            var bodyBox = this.addPolygon([lkX - 150 + 2145 - 5, 335 - 10, lkX - 150 + 2268, 423, lkX - 150 + 2271, 501, lkX - 150 + 2180, 496]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            var bodyBox = this.addPolygon([lkX - 150 + 2374, 475, lkX - 150 + 2481, 337, lkX - 150 + 2470, 320, lkX - 150 + 2485, 263, lkX - 150 + 2489, 290, lkX - 150 + 2534, 290, lkX - 150 + 2556 + 65, 310 - 140, lkX - 150 + 2515, 349, lkX - 150 + 2498, 343, lkX - 150 + 2391, 485]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            this.viking1 = this.addDodik(2, "p3", 1650 + lkX, 417, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 10);
            this.viking2 = this.addDodik(2, "p2", 1922 + lkX + 20, 434, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 10);
            this.viking3 = this.addDodik(2, "p1", 2511 + lkX - 150, 289, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            break;
        case 6:
            var deltaMainX = 250;
            this.level_width = 2800 + deltaMainX;
            this.posCameraEnemy = 2300 + deltaMainX;
            this.miniSdvigX = 0;
            var barrel = this.layerEffect.add(game.add.image(2e3 + deltaMainX, 463, "ss_main1", "boat10_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([1907 + deltaMainX, 437, 1894 + deltaMainX, 466, 1920 + deltaMainX, 493, 2078 + deltaMainX, 494, 2105 + deltaMainX, 466, 2092 + deltaMainX, 437, 2070 + deltaMainX, 470, 1920 + deltaMainX, 470]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            var barrel = this.layerEffect.add(game.add.image(2500 + deltaMainX, 463, "ss_main1", "boat11_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([460 + 1907 + deltaMainX, 437, 460 + 1894 + deltaMainX, 466, 460 + 1920 + deltaMainX, 493, 460 + 2078 + 82 + deltaMainX, 494, 460 + 2105 + 82 + deltaMainX, 466, 460 + 2092 + 82 + deltaMainX, 437, 460 + 2070 + 82 + deltaMainX, 470, 460 + 1920 + deltaMainX, 470]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "w1", 2e3 + deltaMainX, 469, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 0);
            this.viking2 = this.addDodik(2, "w3", 2500 - 50 + deltaMainX, 469, this.CATEGORY_DODIK, this.MASK_DODIK3, true, 0);
            this.viking3 = this.addDodik(2, "w2", 2500 + 65 + deltaMainX, 469, this.CATEGORY_DODIK, this.MASK_DODIK3, true, 0);
            this.viking1.isUpStriker = true;
            this.viking2.isUpStriker = true;
            this.viking3.isUpStriker = true;
            break;
        case 7:
            this.posCameraEnemy = 2300;
            this.miniSdvigX = 0;
            sdvigE = 1450;
            var ship = this.layerEffect.add(game.add.image(2300, 440, "ss_main1", "stoneland_2_0000"));
            ship.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2018, 485, 2065, 455, 2079, 435, 2092, 423, 2097, 403, 2124, 392, 2136, 374, 2161, 361, 2172, 359, 2176, 343, 2190, 350, 2295, 350, 2335, 380, 2375, 380, 2425, 422, 2633, 422, 2633, 485]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            var barrel = this.layerEffect.add(game.add.image(220 + sdvigE, 465, "ss_main1", "boat5_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([sdvigE + 116, 434, sdvigE + 135, 480, sdvigE + 311, 480, sdvigE + 323, 441, sdvigE + 290, 464, sdvigE + 152, 463]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "v4", 1670, 462, this.CATEGORY_DODIK, this.MASK_DODIK3, true, 0);
            this.viking2 = this.addDodik(2, "v2", 2220, 352, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 0);
            this.viking3 = this.addDodik(2, "v3", 2355, 379, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 0);
            this.viking4 = this.addDodik(2, "v1", 2580, 421, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 0);
            this.viking1.isUpStriker = true;
            break;
        case 8:
            this.level_width = 2800 + 200;
            this.posCameraEnemy = 2300 + 50;
            this.miniSdvigX = 20;
            var posMainX = 2050;
            var base = this.layerEffect.add(game.add.image(posMainX, 12, "ss_main1", "island1_0000"));
            this.addBodyShape(2, [740, 515, 290, 418, 402, 375, 605, 396, 688, 440], base.x, base.y - 5);
            this.addBodyShape(2, [162, 418, 290, 418, 740, 515, 19, 513, 89, 441], base.x, base.y - 5);
            this.addBodyShape(2, [600, 117, 628, 244, 598, 241, 576, 122], base.x, base.y - 5);
            this.addBodyShape(2, [628, 244, 605, 396, 567, 375, 598, 241], base.x, base.y - 5);
            this.addBodyShape(2, [605, 396, 402, 375, 567, 375], base.x, base.y - 5);
            var deltaX = -200;
            var barrel = this.layerEffect.add(game.add.image(2e3 + deltaX, 463, "ss_main1", "boat10_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([1907 + deltaX, 437, 1894 + deltaX, 466, 1920 + deltaX, 493, 2078 + deltaX, 494, 2105 + deltaX, 466, 2092 + deltaX, 437, 2070 + deltaX, 470, 1920 + deltaX, 470]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "w2", barrel.x, 469, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 0);
            this.viking2 = this.addDodik(2, "w3", 2255, 424, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 0);
            this.viking3 = this.addDodik(2, "w1", 2490, 381, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 0);
            this.viking1.isUpStriker = true;
            this.viking2.isUpStriker = true;
            this.viking3.isUpStriker = true;
            break;
        case 9:
            this.level_width = 2800;
            this.posCameraEnemy = 2300 - 100;
            this.miniSdvigX = 0;
            var posMainX = 1800;
            var base = this.layerEffect.add(game.add.image(posMainX, 110, "ss_main1", "chinesboat2_0000"));
            base.startY = base.y;
            this.waveAr.push(base);
            this.addBodyShape(1, [750, 239, 750, 387, 685, 347, 685, 239], base.x, base.y);
            this.addBodyShape(1, [515, 260, 624, 347, 205, 347, 298, 260], base.x, base.y);
            this.addBodyShape(1, [750, 387, 16, 387, 16, 347, 685, 347], base.x, base.y);
            this.addBodyShape(2, [252, 64, 223, 98, 188, 33], base.x, base.y);
            this.addBodyShape(2, [599, 98, 566, 71, 630, 36], base.x, base.y);
            this.addBodyShape(2, [566, 71, 223, 98, 252, 64, 302, 13, 506, 13], base.x, base.y);
            this.addBodyShape(2, [223, 98, 566, 71, 599, 98], base.x, base.y);
            this.viking1 = this.addDodik(2, "c1", posMainX + 120, 456, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 10);
            this.viking2 = this.addDodik(2, "c3", posMainX + 400, 369, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 10);
            this.viking3 = this.addDodik(2, "c2", posMainX + 410, 122, this.CATEGORY_DODIK, this.MASK_DODIK2, true, 10);
            this.test = base;
            break;
        case 10:
            this.level_width = 2800 + 300;
            this.posCameraEnemy = 2300 - 90;
            this.miniSdvigX = 35;
            var posMainX = 1800;
            var danger = this.layerEffect.add(game.add.image(posMainX - 180, 340, "ss_main1", "oil_danger_0000"));
            this.addBodyShape(3, [17, 60, 46, 8, 76, 60], danger.x, danger.y);
            this.addBodyShape(3, [85, 78, 85, 112, 7, 112, 7, 78], danger.x, danger.y);
            var base = this.layerEffect.add(game.add.image(posMainX, 225, "ss_main1", "oil_station_0000"));
            this.addBodyShape(1, [135, 201, 362, 241, 8, 241, 8, 201], base.x, base.y);
            this.addBodyShape(1, [310, 150, 362, 241, 135, 201, 141, 151], base.x, base.y);
            this.addBodyShape(1, [364, 79, 362, 241, 310, 150, 344, 79], base.x, base.y);
            this.addBodyShape(2, [378, 200, 376, 62, 396, 32, 449, 32, 470, 62, 470, 200], base.x, base.y);
            this.addBodyShape(3, [740, 68, 742, 146, 567, 146, 569, 68], base.x, base.y);
            this.addBodyShape(1, [817, 7, 817, 184, 787, 150, 787, 7], base.x, base.y);
            this.addBodyShape(1, [787, 150, 817, 184, 474, 184, 474, 150], base.x, base.y);
            var barrel = this.layerEffect.add(game.add.image(posMainX + 1050 - 182, 470 - 80, "ss_main1", "boat9_0000"));
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.addBodyShape(1, [302, 108, 270, 74, 297, 58, 320, 76], barrel.x, barrel.y);
            this.addBodyShape(1, [56, 74, 30, 108, 7, 65, 29, 47], barrel.x, barrel.y);
            this.addBodyShape(1, [30, 108, 56, 74, 270, 74, 302, 108], barrel.x, barrel.y);
            this.viking1 = this.addDodik(2, "b4", posMainX + 70, 425, this.CATEGORY_DODIK, this.MASK_DODIK1, false, 10);
            this.viking2 = this.addDodik(2, "b3", posMainX + 215, 374, this.CATEGORY_DODIK, this.MASK_DODIK1, false, 10);
            this.viking3 = this.addDodik(2, "b1", posMainX + 425, 256, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 10);
            this.viking4 = this.addDodik(2, "b2", posMainX + 650, 292, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 10);
            this.viking1.isUpStriker = true;
            this.test = danger;
            break;
        case 11:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 0;
            sdvigE = 1450;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 995, 262, "ss_main1", "treeland_1_0000"));
            ship.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2085, 413, 2098, 445, 2650, 445, 2620, 30, 2489, 30, 2471, 94, 2436, 115, 2436, 144, 2527, 164, 2549, 229, 2539, 277, 2558, 375, 2483, 413]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            var barrel = this.layerEffect.add(game.add.image(2460, 249, "ss_main1", "treeland_bridge_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2340, 203, 2537, 203, 2550, 30, 2590, 30, 2590, 232, 2339, 232]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            this.most = barrel;
            var lkX = -490;
            var barrel = this.layerEffect.add(game.add.image(lkX + 2350, 440, "ss_main1", "boat7_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([lkX + 2333, 383, lkX + 2233, 443, lkX + 2274, 483, lkX + 2420, 493, lkX + 2472, 454, lkX + 2455, 435, lkX + 2440, 435, lkX + 2413, 449, lkX + 2358, 451, lkX + 2325, 416, lkX + 2354, 399]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
            barrel.startY = barrel.y;
            this.waveAr.push(barrel);
            this.viking1 = this.addDodik(2, "r1", lkX + 2395, 449, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 10);
            this.viking2 = this.addDodik(2, "r4", 2160, 412, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 20);
            this.viking3 = this.addDodik(2, "r2", 2340, 412, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 10);
            this.viking4 = this.addDodik(2, "r3", 2375, 202, this.CATEGORY_DODIK, this.MASK_DODIK2, false, 20);
            this.viking1.isUpStriker = true;
            break;
        case 12:
            this.posCameraEnemy = 2200;
            this.miniSdvigX = 30;
            sdvigE = 1450;
            var ship = this.layerEffect.add(game.add.image(sdvigE + 995, 262, "ss_main1", "treeland_1_0000"));
            ship.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2085, 413, 2098, 445, 2650, 445, 2620, 30, 2489, 30, 2471, 94, 2436, 115, 2436, 144, 2527, 164, 2549, 229, 2539, 277, 2558, 375, 2483, 413]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
            var barrel = this.layerEffect.add(game.add.image(2460, 249, "ss_main1", "treeland_bridge_0000"));
            barrel.anchor.setTo(.5);
            var bodyBox = this.addPolygon([2340, 203, 2537, 203, 2550, 30, 2590, 30, 2590, 232, 2339, 232]);
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
            this.most = barrel;
            this.viking1 = this.addDodik(2, "o1", 2160, 412, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            this.viking2 = this.addDodik(2, "o2", 2340, 412, this.CATEGORY_DODIK, this.MASK_DODIK3, false, 0);
            break
        }
        if (MainGame.isWater) {
            var countWaving = 15;
            var countWater = 6;
            var wave;
            for (var i = 0; i < countWaving; i++) {
                wave = this.layerEffect.add(game.add.sprite(-400 + 300 * i, 455, "ss_main2"));
                wave.animations.add("waving", Phaser.Animation.generateFrameNames("wave2_", 0, 69, "", 4), 30);
                wave.animations.play("waving", 30, true);
                wave.scale.setTo(1.001, 1)
            }
            var w;
            for (var i = 0; i < countWater; i++) {
                w = this.layerWater.add(game.add.image(-400 + 800 * i, 600 + 1, "ss_main2", "water1_0000"));
                w.anchor.setTo(0, 1);
                w.scale.setTo(1.01, 1)
            }
        }
        this.layerArrowOld = {};
        this.layerArrow = {};
        this.layerAimPointsNew = this.layerWater.add(game.add.group());
        this.layerAimPointsOld = this.layerWater.add(game.add.group());
        this.layerInfoPower = this.layerAimPointsNew.add(game.add.group());
        this.powerIcon = this.layerInfoPower.add(game.add.sprite(32, -5 - 30, "ss_main2", "icon_power_0000"));
        this.powerIcon.anchor.setTo(.5);
        this.textPowerAiming1 = MainGame.addText(800, -10, 0 - 30, "100%", this.layerInfoPower, 29, 9395827, 1, .5);
        this.textPowerAiming2 = MainGame.addText(800, -10, -4 - 30, "100%", this.layerInfoPower, 29, 16776958, 1, .5);
        this.layerInfoPower.y = -1e3;
        MainGame.showPath = true;
        if (MainGame.showPath) {
            this.arBallPath = [];
            this.arBallPathLast = [];
            var tBall;
            for (var i = 0; i < 10; i++) {
                tBall = this.layerAimPointsNew.add(game.add.image(-100, -100, "ss_main2", "ballG_0000"));
                tBall.anchor.setTo(.5);
                tBall.alpha = 1;
                tBall.num = i * 1.4;
                this.arBallPath.push(tBall)
            }
            for (var i = 0; i < 10; i++) {
                tBall = this.layerAimPointsOld.add(game.add.image(-100, -100, "ss_main2", "ballG_0000"));
                tBall.anchor.setTo(.5);
                tBall.alpha = .5;
                tBall.num = i * 1.4;
                this.arBallPathLast.push(tBall)
            }
        }
        this.addBall();
        this.numStriker = 0;
        this.hero1 = this.addDodik(1, "sman", hero1PosX, hero1PosY, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 0);
        this.hero2 = this.addDodik(1, "simon", hero2PosX, hero2PosY, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 20);
        this.hero1.id = 1;
        this.hero2.id = 2;
        if (MainGame.typeBoat == 2) {
            this.dog = this.addDodik(1, "dog", hero3PosX, hero3PosY, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 35)
        } else if (MainGame.typeBoat == 3 || MainGame.typeBoat == 4) {
            this.hero3 = this.addDodik(1, "dkid", hero3PosX, hero3PosY, this.CATEGORY_DODIK, this.MASK_DODIK1, true, 20);
            this.hero3.id = 3
        }
        game.camera.bounds.width = this.level_width + MainGame.deltaX;
        this.layerHpBars.visible = false;
        this.layerPanelTurn.visible = false;
        this.layerWeapon.visible = false;
        if (MainGame.levelNum == 2 || MainGame.levelNum >= 4)
            this.addHippo();
        if (MainGame.levelNum == 11) {
            this.decor1 = this.addDecor("o2", 2525, 410);
            this.decor1.scale.x = -1;
            this.decor2 = this.addDecor("o1", 2615, 400 - 5);
            this.chain1 = this.layerEffect.add(game.add.image(2495, 350, "ss_main2", "chains1_0000"))
        }
        if (MainGame.levelNum == 12) {
            this.decor3 = this.addDecor("dkid", 2534 + 55, 397);
            this.decor4 = this.addDecor("sman", 2534, 397 + 5);
            this.decor4.scale.x = -1;
            this.chain2 = this.layerEffect.add(game.add.image(2510, 336, "ss_main2", "chains2_0000"));
            this.chain2.angle = 14;
            this.hero1.mini.visible = false;
            this.hero1.hpNow = 0;
            this.hero1.isLive = false;
            this.hero1.body.y = 1e3
        }
        this.addShark();
        this.waveArCount = this.waveAr.length;
        game.time.events.add(100, this.hideElemetns, this, true).autoDestroy = true;
        game.time.events.add(1e3, this.levelEvent, this, true).autoDestroy = true;
        this.updateCamera(0, this.posCameraEnemy);
        game.time.events.loop(8e3, this.updateSimon, this);
        game.time.events.loop(1e3, this.soundEnvironment, this);
        if (MainGame.levelNum == 12) {
            this.setStriker(this.hero2)
        } else {
            this.setStriker(this.hero1)
        }
        this.timerLevel = game.time.events.loop(1e3, this.updateTimer, this);
        this.textGranat = MainGame.addText(800, wBtn2.x + 30, wBtn2.y + 34, String(MainGame.countGranat), this.layerWeapon, 23, 16777215, .5, .5);
        this.textRocket = MainGame.addText(800, wBtn3.x + 30, wBtn3.y + 34, String(MainGame.countRocket), this.layerWeapon, 23, 16777215, .5, .5);
        MainGame.fadeOut();
        this.isPaused = false;
        this.layerPause = this.layerTopPause.add(game.add.group());
        this.layerPause.visible = this.isPaused;
        var spr_bg = this.layerPause.add(this.game.add.graphics(0, 0));
        spr_bg.beginFill(1656488, .45);
        spr_bg.drawRect(-this.game.width * .5, 0, this.game.width, this.game.height);
        spr_bg.endFill();
        this.spr_bg = spr_bg;
        var posXbb = this.game.width * .5;
        var musicButton = this.layerPause.add(game.add.image(0, 60, "ss_menu", "btn_music_0000"));
        musicButton.anchor.setTo(.5, .5);
        if (MainGame.isMusicMuted)
            musicButton.frameName = "btn_music_0001";
        this.pauseBtnMusic = musicButton;
        var sfxButton = this.layerPause.add(game.add.image(0, 60, "ss_menu", "btn_sound_0000"));
        sfxButton.anchor.setTo(.5, .5);
        if (MainGame.isSfxMuted)
            sfxButton.frameName = "btn_sound_0001";
        this.pauseBtnSfx = sfxButton;
        var pButton = this.layerPause.add(game.add.image(0, 60, "ss_main2", "btn_pause_0000"));
        pButton.anchor.setTo(.5, .5);
        this.pauseBtnPause = pButton;
        var hButton = this.layerPause.add(game.add.image(0, 60, "ss_menu", "btn_home_0000"));
        hButton.anchor.setTo(.5, .5);
        this.pauseBtnHome = hButton;
        var midX = Math.floor(game.width * .5);
        var rButton = this.layerPause.add(game.add.image(0, 400, "ss_menu", "btn_replay_0000"));
        rButton.anchor.setTo(.5, .5);
        this.pauseBtnReplay = rButton;
        this.btnResume = new SimpleButton(game,this,this.layerPause,0,250,"ss_menu","btn_play_0000",this.clickForResumePause);
        game.input.onUp.add(this.clickForResumePause, this);
        this.updateResize();
        PhaserSpine.Spine.globalAutoUpdate = true;
        game.physics.box2d.paused = false;
        MainGame.playMusic(1);
        MainGame.playSound(27);
        this.initKeyboardEvents();
        if (MainGame.isAPI)
            MainGame.API_POKI.gameplayStart();
        MainGame.api_google("StartLevel", MainGame.levelNum + 1);
        if (MainGame.isAPI)
            MainGame.API_POKI.displayAd()
    },
    initKeyboardEvents: function() {
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keySpace.onDown.add(this.pressSpacebar, this)
    },
    pressSpacebar: function() {
        if (this.isLevelCompleted && this.isFinishShown) {
            if (this.isLevelWin) {
                this.clickLevelMenu()
            } else {
                this.clickShop()
            }
        }
    },
    clickForResumePause: function() {
        if (!this.isPaused)
            return;
        var clickPosX = game.input.x - game.width * .5;
        var clickPosY = game.input.y;
        var _isPause = clickPosX > this.btnResume.buttonC.x - 150 && clickPosX < this.btnResume.buttonC.x + 150 && clickPosY > this.btnResume.buttonC.y - 50 && clickPosY < this.btnResume.buttonC.y + 50;
        if (_isPause) {
            this.pauseGame();
            return
        }
        _isPause = clickPosX > this.pauseBtnPause.x - 40 && clickPosX < this.pauseBtnPause.x + 40 && clickPosY > this.pauseBtnPause.y - 40 && clickPosY < this.pauseBtnPause.y + 40;
        if (_isPause) {
            this.pauseGame();
            return
        }
        if (clickPosX > this.pauseBtnMusic.x - 40 && clickPosX < this.pauseBtnMusic.x + 40 && clickPosY > this.pauseBtnMusic.y - 40 && clickPosY < this.pauseBtnMusic.y + 40) {
            if (!MainGame.isMusicMuted) {
                MainGame.clickMuteMusic(this.pauseBtnMusic);
                if (!MainGame.isMusicMuted)
                    MainGame.clickMuteMusic(this.pauseBtnMusic)
            } else {
                MainGame.clickMuteMusic(this.pauseBtnMusic)
            }
        } else if (clickPosX > this.pauseBtnSfx.x - 40 && clickPosX < this.pauseBtnSfx.x + 40 && clickPosY > this.pauseBtnSfx.y - 40 && clickPosY < this.pauseBtnSfx.y + 40) {
            if (!MainGame.isSfxMuted) {
                MainGame.clickMuteSFX(this.pauseBtnSfx);
                if (!MainGame.isSfxMuted)
                    MainGame.clickMuteSFX(this.pauseBtnSfx)
            } else {
                MainGame.clickMuteSFX(this.pauseBtnSfx)
            }
        } else if (clickPosX > this.pauseBtnHome.x - 40 && clickPosX < this.pauseBtnHome.x + 40 && clickPosY > this.pauseBtnHome.y - 40 && clickPosY < this.pauseBtnHome.y + 40) {
            this.pauseGame(false);
            MainGame.goToState("Menu")
        } else if (clickPosX > this.pauseBtnReplay.x - 140 && clickPosX < this.pauseBtnReplay.x + 140 && clickPosY > this.pauseBtnReplay.y - 50 && clickPosY < this.pauseBtnReplay.y + 50) {
            this.pauseGame(false);
            MainGame.goToState("Game")
        }
    },
    pauseGame: function(vBool) {
        if (typeof vBool === "undefined")
            vBool = true;
        this.isPaused = !this.isPaused;
        game.paused = this.isPaused;
        PhaserSpine.Spine.globalAutoUpdate = !this.isPaused;
        if (vBool) {
            game.physics.box2d.paused = this.isPaused;
            this.layerPause.visible = this.isPaused
        }
    },
    updateTimer: function() {
        this.stat_time++
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.btnTap.x = game.width - 60;
        this.pauseBtnPause.x = game.width * .5 - 60;
        this.pauseBtnMusic.x = game.width * .5 - 150;
        this.pauseBtnSfx.x = game.width * .5 - 240;
        this.pauseBtnHome.x = game.width * .5 - 330;
        this.tileSky.width = game.width * 1.1;
        this.layerMap1.x = 0 + this.sdvigMap1;
        this.layerMap2.x = game.width - this.sdvigMap2;
        this.layerPause.x = game.width * .5;
        this.spr_bg.width = game.width;
        this.layerText.x = game.width * .5
    },
    playVoiceGroup: function(vNum) {
        var arVoiceGroups = [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12], [13, 14, 15], [16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30], [31, 32, 33, 34, 35, 36], [37, 38, 39, 40, 41, 42, 43], [44, 45, 46]];
        var countR = arVoiceGroups[vNum].length - 1;
        var r = MyMath.getRandomInt(0, countR);
        MainGame.playVoice(arVoiceGroups[vNum][r])
    },
    addBall: function() {
        this.ball.typeObj = "ball";
        this.ball.anchor.setTo(.5);
        game.physics.box2d.enable(this.ball);
        this.ball.body.sensor = true;
        this.ball.body.gravityScale = 0;
        this.ball.body.setCircle(15);
        this.ball.body.angularDamping = .55;
        this.ball.body.mass = .3;
        this.ball.body.setCollisionCategory(this.CATEGORY_BALL);
        this.ball.body.setCollisionMask(this.MASK_BALL);
        this.ball.body.link = this.ball
    },
    addDecor: function(vSkin, vX, vY) {
        var obj = this.layerEffect.add(game.add.spine(vX, vY, "pers"));
        obj.setSkinByName(vSkin);
        obj.setAnimationByName(0, "idle", true);
        obj.setToSetupPose();
        var body = new Phaser.Physics.Box2D.Body(game,null,vX,vY,2);
        if (vSkin == "dkid") {
            body.addCircle(30, 0, -60);
            body.addCircle(25, 0, -25)
        } else {
            body.addCircle(30, 0, -80);
            body.addCircle(25, 0, -25)
        }
        body.gravityScale = 0;
        body.kinematic = true;
        body.setCollisionCategory(this.CATEGORY_DODIK);
        body.setCollisionMask(this.CATEGORY_BALL);
        body.setCategoryContactCallback(this.CATEGORY_BALL, this.hitBallGround, this);
        body.link = obj;
        obj.body = body;
        obj.typeObj = "decor";
        return obj
    },
    addShark: function() {
        this.flagShark = true;
        var sdvigSx = 100;
        var shark = this.layerEffect.add(game.add.image(sdvigSx + 400, 515 - 3, "ss_main2"));
        shark.animations.add("swim", Phaser.Animation.generateFrameNames("shark_swim_", 0, 0, "", 4), 30);
        shark.animations.add("attack", Phaser.Animation.generateFrameNames("shark_up_", 0, 18, "", 4), 30);
        shark.animations.play("swim", 30, true);
        shark.anchor.setTo(.5);
        shark.startY = shark.y;
        shark.typeObj = "shark";
        shark.events.onAnimationComplete.add(this.onAnimCompleteAnimal, this);
        this.waveAr.push(shark);
        var bodyBox = this.addPolygon([sdvigSx + 262, 515 - 3, sdvigSx + 362, 489 - 3, sdvigSx + 528, 513 - 3, sdvigSx + 529, 534 - 3, sdvigSx + 267, 530 - 3]);
        bodyBox.setCollisionCategory(this.CATEGORY_DODIK);
        bodyBox.setCollisionMask(this.CATEGORY_BALL);
        bodyBox.link = shark;
        bodyBox.gravityScale = 0;
        bodyBox.kinematic = true;
        shark.body = bodyBox;
        this.shark = shark
    },
    addHippo: function() {
        var sdvigHx = 0;
        var sdvigHy = -55;
        var hippo = this.layerEffect.add(game.add.image(sdvigHx + 1150, sdvigHy + 515, "ss_main2"));
        hippo.animations.add("swim", Phaser.Animation.generateFrameNames("hippo_idle_", 0, 0, "", 4), 30);
        hippo.animations.add("attack", Phaser.Animation.generateFrameNames("hippo_up_", 0, 18, "", 4), 30);
        hippo.animations.play("swim", 30, true);
        hippo.anchor.setTo(.5);
        hippo.startY = hippo.y;
        hippo.typeObj = "hippo";
        hippo.events.onAnimationComplete.add(this.onAnimCompleteAnimal, this);
        this.waveAr.push(hippo);
        var bodyBox = this.addPolygon([sdvigHx + 1020, sdvigHy + 482, sdvigHx + 1069, sdvigHy + 470, sdvigHx + 1099, sdvigHy + 440, sdvigHx + 1147, sdvigHy + 468, sdvigHx + 1210, sdvigHy + 469, sdvigHx + 1265, sdvigHy + 504, sdvigHx + 1270, sdvigHy + 550, sdvigHx + 1020, sdvigHy + 520]);
        bodyBox.setCollisionCategory(this.CATEGORY_DODIK);
        bodyBox.setCollisionMask(this.CATEGORY_BALL);
        bodyBox.link = hippo;
        bodyBox.gravityScale = 0;
        bodyBox.kinematic = true;
        hippo.body = bodyBox;
        this.hippo = hippo
    },
    finishGame: function(vIsWin) {
        this.isLevelCompleted = true;
        game.time.events.remove(this.timerLevel);
        this.layerTop.visible = false;
        this.layerText.visible = false;
        this.isFinishShown = true;
        var plashka = this.layerFinish.add(game.add.group());
        var textTitle;
        var midX = game.width * .5;
        var back;
        var s_earned;
        this.isLevelWin = vIsWin;
        if (vIsWin) {
            if (MainGame.levelNum == 12) {
                MainGame.typeBoat = MainGame.save_typeBoat;
                MainGame.countGranat = MainGame.save_countGranat;
                MainGame.countRocket = MainGame.save_countRocket
            }
            back = plashka.add(game.add.image(midX, 290, "ss_menu", "win_panel_0000"));
            back.anchor.setTo(.5);
            textTitle = MainGame.GAME_TEXT.battle_won.toUpperCase();
            if (MainGame.isHardMode) {
                MainGame.levelHard[MainGame.levelNum] = 1;
                var heroReward = plashka.add(game.add.image(midX, 180, "ss_menu", "heroic_coin_0000"));
                heroReward.anchor.setTo(.5);
                heroReward.scale.setTo(1);
                heroReward.alpha = 0;
                game.add.tween(heroReward).to({
                    alpha: 1
                }, 300, "Linear", true, 1400);
                game.add.tween(heroReward.scale).to({
                    x: 1.6,
                    y: 1.6
                }, 250, "Linear", false, 1300).to({
                    x: 1.2,
                    y: 1.2
                }, 250, "Linear").start()
            } else {
                var star1t = plashka.add(game.add.image(midX - 90, 190, "ss_menu", "empty_star_0000"));
                star1t.anchor.setTo(.5);
                star1t.angle = -15;
                var star2t = plashka.add(game.add.image(midX, 180, "ss_menu", "empty_star_0000"));
                star2t.anchor.setTo(.5);
                var star3t = plashka.add(game.add.image(midX + 90, 190, "ss_menu", "empty_star_0000"));
                star3t.anchor.setTo(.5);
                star3t.angle = 15;
                var star1s = plashka.add(game.add.image(midX - 92, 190 - 9, "ss_menu", "star_0000"));
                star1s.anchor.setTo(.5);
                star1s.angle = -15;
                var star2s = plashka.add(game.add.image(midX, 180 - 9, "ss_menu", "star_0000"));
                star2s.anchor.setTo(.5);
                var star3s = plashka.add(game.add.image(midX + 92, 190 - 9, "ss_menu", "star_0000"));
                star3s.anchor.setTo(.5);
                star3s.angle = 15
            }
            plashka.add(game.add.image(midX + 40, 265, "ss_menu", "coins_0000"));
            var icon1 = plashka.add(game.add.image(midX - 220, 300 + 45, "ss_menu", "ball_small_0000"));
            icon1.anchor.setTo(.5);
            var icon2 = plashka.add(game.add.image(midX - 220, 342 + 45, "ss_menu", "clocks_0000"));
            icon2.anchor.setTo(.5);
            var icon3 = plashka.add(game.add.image(midX - 220, 384 + 45, "ss_menu", "baddies_0000"));
            icon3.anchor.setTo(.5);
            var coin1 = plashka.add(game.add.image(midX + 130, 300 + 45, "ss_menu", "coin1_0000"));
            coin1.anchor.setTo(.5);
            var coin2 = plashka.add(game.add.image(midX + 130, 342 + 45, "ss_menu", "coin1_0000"));
            coin2.anchor.setTo(.5);
            var coin3 = plashka.add(game.add.image(midX + 130, 384 + 45, "ss_menu", "coin1_0000"));
            coin3.anchor.setTo(.5);
            var result = this.calculateScore();
            var countStars = result[0];
            var s_shots = result[1];
            var s_time = result[2];
            var s_killed = result[3];
            s_earned = result[4];
            if (!MainGame.isHardMode) {
                star1s.scale.setTo(.5);
                star1s.alpha = 0;
                star2s.scale.setTo(.5);
                star2s.alpha = 0;
                star3s.scale.setTo(.5);
                star3s.alpha = 0;
                if (countStars >= 1) {
                    game.add.tween(star1s).to({
                        alpha: 1
                    }, 300, "Linear", true, 1100);
                    game.add.tween(star1s.scale).to({
                        x: 1.6,
                        y: 1.6
                    }, 250, "Linear", false, 1e3).to({
                        x: 1,
                        y: 1
                    }, 250, "Linear").start()
                }
                if (countStars >= 2) {
                    game.add.tween(star2s).to({
                        alpha: 1
                    }, 300, "Linear", true, 1400);
                    game.add.tween(star2s.scale).to({
                        x: 1.6,
                        y: 1.6
                    }, 250, "Linear", false, 1300).to({
                        x: 1,
                        y: 1
                    }, 250, "Linear").start()
                }
                if (countStars == 3) {
                    game.add.tween(star3s).to({
                        alpha: 1
                    }, 300, "Linear", true, 1700);
                    game.add.tween(star3s.scale).to({
                        x: 1.6,
                        y: 1.6
                    }, 250, "Linear", false, 1600).to({
                        x: 1,
                        y: 1
                    }, 250, "Linear").start()
                }
            }
            this.btnNext = new SimpleButton(game,this,plashka,midX + 125,520,"ss_menu","btn_continue_0000",this.clickLevelMenu,1);
            MainGame.addText(800, coin1.x + 22, coin1.y + 5 - 2, String(s_shots), plashka, 26, 10248197, 0, .5);
            MainGame.addText(800, coin1.x + 22, coin1.y + 0 - 2, String(s_shots), plashka, 26, 16710912, 0, .5);
            MainGame.addText(800, coin2.x + 22, coin2.y + 5 - 2, String(s_time), plashka, 26, 10248197, 0, .5);
            MainGame.addText(800, coin2.x + 22, coin2.y + 0 - 2, String(s_time), plashka, 26, 16710912, 0, .5);
            MainGame.addText(800, coin3.x + 22, coin3.y + 5 - 2, String(s_killed), plashka, 26, 10248197, 0, .5);
            MainGame.addText(800, coin3.x + 22, coin3.y + 0 - 2, String(s_killed), plashka, 26, 16710912, 0, .5);
            MainGame.addText(800, midX + 115, 288 + 5 - 2, String(s_earned), plashka, 38, 10248197, 0, .5);
            MainGame.addText(800, midX + 115, 288 + 0 - 2, String(s_earned), plashka, 38, 16710912, 0, .5);
            MainGame.addText(240, midX - 130, 250, MainGame.GAME_TEXT.total_score.toUpperCase(), plashka, 24, 16777215, .5, .5);
            MainGame.addText(240, midX + 130, 250, MainGame.GAME_TEXT.credits_earned.toUpperCase(), plashka, 24, 16777215, .5, .5);
            MainGame.addText(800, midX - 130, 250 + 38, String(MainGame.highScore), plashka, 26, 16777215, .5, .5);
            var shotsFired = MainGame.replaceText(MainGame.GAME_TEXT.shots_fired.toUpperCase(), String(this.stat_shots));
            var timeUsed = MainGame.replaceText(MainGame.GAME_TEXT.time_used_N.toUpperCase(), String(this.stat_time));
            var badiesSoaked = MainGame.replaceText(MainGame.GAME_TEXT.baddies_soaked.toUpperCase(), String(this.stat_enemy));
            MainGame.addText(280, midX - 195, coin1.y - 2, shotsFired, plashka, 26, 16777215, 0, .5);
            MainGame.addText(280, midX - 195, coin2.y - 2, timeUsed, plashka, 26, 16777215, 0, .5);
            MainGame.addText(280, midX - 195, coin3.y - 2, badiesSoaked, plashka, 26, 16777215, 0, .5);
            if (MainGame.isAPI)
                MainGame.API_POKI.happyTime(.5)
        } else {
            if (MainGame.levelNum == 12) {
                MainGame.typeBoat = MainGame.save_typeBoat;
                MainGame.countGranat = MainGame.save_countGranat;
                MainGame.countRocket = MainGame.save_countRocket
            }
            back = plashka.add(game.add.image(midX, 290, "ss_menu", "lost_panel_0000"));
            back.anchor.setTo(.5);
            textTitle = MainGame.GAME_TEXT.battle_lost.toUpperCase();
            var s_killed = this.stat_enemy * 150;
            if (MainGame.levelNum < MainGame.levelMax) {
                s_killed = Math.floor(s_killed * .5)
            }
            s_earned = s_killed;
            var icon3 = plashka.add(game.add.image(midX - 220, 384 + 45 - 65, "ss_menu", "baddies_0000"));
            icon3.anchor.setTo(.5);
            var coin3 = plashka.add(game.add.image(midX + 130, 384 + 45 - 65, "ss_menu", "coin1_0000"));
            coin3.anchor.setTo(.5);
            plashka.add(game.add.image(midX - 90, 265 - 25, "ss_menu", "coins_0000"));
            this.btnNext = new SimpleButton(game,this,plashka,midX + 125,520,"ss_menu","btn_continue_0000",this.clickShop);
            MainGame.addText(240, midX, 250 - 25 - 7, MainGame.GAME_TEXT.credits_earned.toUpperCase(), plashka, 26, 16777215, .5, .5);
            MainGame.addText(800, midX + 115 - 130, 288 + 5 - 25 - 2, String(s_earned), plashka, 38, 10248197, 0, .5);
            MainGame.addText(800, midX + 115 - 130, 288 + 0 - 25 - 2, String(s_earned), plashka, 38, 16710912, 0, .5);
            MainGame.addText(800, coin3.x + 22, coin3.y + 5 - 2, String(s_killed), plashka, 26, 10248197, 0, .5);
            MainGame.addText(800, coin3.x + 22, coin3.y + 0 - 2, String(s_killed), plashka, 26, 16710912, 0, .5);
            var badiesSoaked = MainGame.replaceText(MainGame.GAME_TEXT.baddies_soaked.toUpperCase(), String(this.stat_enemy));
            MainGame.addText(280, midX - 195, coin3.y - 2, badiesSoaked, plashka, 26, 16777215, 0, .5)
        }
        this.btnReward = new SimpleButton(game,this,plashka,midX - 125,520 - 7,"ss_menu","btn_bonus_0000",MainGame.clickReward,1);
        MainGame.setReward(this.btnReward.buttonC, 0, 0, false);
        if (MainGame.isAPI) {
            if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock) {
                this.btnReward.buttonC.alpha = .7
            }
        } else {
            if (!MainGame.isDebug)
                this.btnReward.buttonC.alpha = .7
        }
        MainGame.allowReward = true;
        this.finishLevelResult(vIsWin, s_earned);
        MainGame.addText(420, midX, 90 + 5, textTitle, plashka, 42, 9330034, .5, .5);
        MainGame.addText(420, midX, 90, textTitle, plashka, 42, 16777215, .5, .5);
        plashka.y = -600;
        game.add.tween(plashka).to({
            y: 0
        }, 1e3, Phaser.Easing.Elastic.Out).start();
        if (MainGame.isAPI)
            MainGame.API_POKI.destroyAd()
    },
    calculateScore: function() {
        var countStars = 1;
        var s_shots = MainGame.arShots[MainGame.levelNum] - this.stat_shots;
        if (s_shots >= 0)
            countStars++;
        if (s_shots < 0)
            s_shots = 0;
        var howTime = MainGame.arShots[MainGame.levelNum] * 20 - this.stat_time;
        if (howTime >= 0)
            countStars++;
        if (howTime < 0)
            howTime = 0;
        s_shots *= 300;
        var s_time = howTime * 2;
        var s_killed = this.stat_enemy * 150;
        if (MainGame.levelNum < MainGame.levelMax) {
            s_shots = Math.floor(s_shots * .5);
            s_time = Math.floor(s_time * .5);
            s_killed = Math.floor(s_killed * .5);
            console.log("half of earn!")
        }
        s_earned = s_shots + s_time + s_killed;
        if (MainGame.isHardMode)
            s_earned += 1e3;
        if (MainGame.levelScore[MainGame.levelNum] < s_earned) {
            MainGame.levelScore[MainGame.levelNum] = s_earned
        }
        if (MainGame.levelTime[MainGame.levelNum] > 0 && MainGame.levelTime[MainGame.levelNum] > this.stat_time) {
            MainGame.levelTime[MainGame.levelNum] = this.stat_time
        }
        if (MainGame.levelStars[MainGame.levelNum] < countStars) {
            MainGame.levelStars[MainGame.levelNum] = countStars
        }
        MainGame.highScore = 0;
        for (var i = 0; i < MainGame.MAX_LEVELS; i++) {
            MainGame.highScore += MainGame.levelScore[i]
        }
        return [countStars, s_shots, s_time, s_killed, s_earned]
    },
    finishLevelResult: function(vBool, vEarned) {
        if (vBool) {
            MainGame.api_google("LevelWon", MainGame.levelNum + 1);
            MainGame.levelNum++;
            if (MainGame.levelNum < 13) {
                if (MainGame.levelMax < MainGame.levelNum) {
                    MainGame.levelMax = MainGame.levelNum
                }
            }
        } else {
            MainGame.api_google("LevelLost", MainGame.levelNum + 1)
        }
        MainGame.coins += vEarned;
        MainGame.saveSaves(1)
    },
    addDamageEffect: function(vDmg, vX, vY) {
        var obj = this.addNumbers("-" + vDmg, this.layerEffect, vX, vY, 2);
        game.add.tween(obj).to({
            y: vY - 40
        }, 1e3, "Linear", true).onComplete.add(function() {
            obj.destroy()
        })
    },
    addNumbers: function(vValue, vLayer, vX, vY, vSpace, vScale, vIsCenter, vIsShadow) {
        if (typeof vScale === "undefined")
            vScale = 1;
        if (typeof vIsCenter === "undefined")
            vIsCenter = false;
        if (typeof vIsShadow === "undefined")
            vIsShadow = true;
        if (typeof vSpace === "undefined")
            vSpace = 0;
        vValue += "";
        var arrayOfNum = vValue.split("");
        var num1;
        var num2;
        var chr;
        var objLayer = vLayer.add(game.add.group());
        objLayer.x = vX;
        objLayer.y = vY;
        var wObjs = 0;
        for (var i = 0; i < arrayOfNum.length; i++) {
            chr = arrayOfNum[i];
            switch (chr) {
            case "+":
                num1 = objLayer.add(game.add.image(wObjs, 4, "ss_main2", "num_43_0000"));
                num2 = objLayer.add(game.add.image(wObjs, 0, "ss_main2", "num_43_0000"));
                break;
            case "-":
                num1 = objLayer.add(game.add.image(wObjs, 4, "ss_main2", "num_45_0000"));
                num2 = objLayer.add(game.add.image(wObjs, 0, "ss_main2", "num_45_0000"));
                break;
            case ":":
                num1 = objLayer.add(game.add.image(wObjs, 4, "ss_main2", "num_58_0000"));
                num2 = objLayer.add(game.add.image(wObjs, 0, "ss_main2", "num_58_0000"));
                break;
            default:
                num1 = objLayer.add(game.add.image(wObjs, 4, "ss_main2", "num_" + Number(arrayOfNum[i]) + "_0000"));
                num2 = objLayer.add(game.add.image(wObjs, 0, "ss_main2", "num_" + Number(arrayOfNum[i]) + "_0000"));
                break
            }
            num1.anchor.setTo(1, 0);
            num1.scale.setTo(vScale);
            num2.anchor.setTo(1, 0);
            num2.scale.setTo(vScale);
            num1.tint = 9395827;
            num2.tint = 16776958;
            if (!vIsShadow)
                num1.visible = false;
            num1.x += num1.width;
            num2.x += num1.width;
            wObjs += num1.width - vSpace
        }
        if (vIsCenter)
            objLayer.x -= wObjs * .5;
        return objLayer
    },
    setStriker: function(vHero) {
        this.striker = vHero;
        this.setIK(this.striker);
        var inpX1 = this.game.input.worldX;
        var inpY1 = this.game.input.worldY;
        this.aimX = this.striker.obj.x - 15;
        this.aimY = this.striker.obj.y - 48;
        this.layerArrow.x = this.aimX;
        this.layerArrow.y = this.aimY;
        this.layerArrowOld.x = this.aimX;
        this.layerArrowOld.y = this.aimY;
        this.numStriker = vHero.id
    },
    setIK: function(vHero) {
        this.targetIK1 = vHero.obj.skeleton.ikConstraints[0];
        this.targetIK2 = vHero.obj.skeleton.ikConstraints[4];
        if (this.targetIK1.data.name != "aim")
            console.log("[WARNING] Can't find IK: aim!");
        if (this.targetIK2.data.name != "target")
            console.log("[WARNING] Can't find IK: tatget!");
        this.targetIK1.target.y = 30;
        this.targetIK2.target.y = 55;
        this.lastTargetPosP1 = this.targetIK1.target.y;
        this.lastTargetPosP2 = this.targetIK2.target.y
    },
    initBackground: function() {
        this.addObject(275, 82, this.layerBack3, "cloud0", 2);
        this.addObject(1045, 80, this.layerBack3, "cloud0", 2);
        this.addObject(160, 95, this.layerBack3, "cloud0", 1);
        this.addObject(557, 45, this.layerBack3, "cloud0", 3);
        this.addObject(316, 376, this.layerBack3, "ground3_", 1);
        this.addObject(570, 316, this.layerBack3, "ground3_", 1);
        this.addObject(932, 342, this.layerBack2, "ground2_", 3);
        this.addObject(716, 300, this.layerBack2, "ground2_", 1);
        this.addObject(1220, 320, this.layerBack2, "ground2_", 1);
        this.addObject(456, 332, this.layerBack2, "ground2_", 2);
        var palm1 = this.addObject(600, 180, this.layerBack1, "palm", 1);
        palm1.scale.x = -1;
        palm1.angle = -13;
        this.addObject(1364, 200, this.layerBack1, "palm", 1);
        this.addObject(840, 396, this.layerBack1, "ground1_", 2);
        this.addObject(1710, 380, this.layerBack1, "ground1_", 2);
        this.addObject(1480, 357, this.layerBack1, "ground1_", 1);
        this.addObject(1130, 417, this.layerBack1, "ground1_", 2);
        this.addObject(224, 406, this.layerBack1, "ground1_", 1);
        this.addObject(412, 380, this.layerBack1, "ground1_", 2);
        this.addObject(50, 440, this.layerBack1, "ground1_", 3)
    },
    addObject: function(vX, vY, vLayer, vName, vType) {
        return vLayer.add(game.add.image(vX, vY, "ss_back", vName + vType + "_0000"))
    },
    playAnim: function(e) {
        this.hero2.updateAnim(100 + e.id)
    },
    levelEvent: function() {
        switch (MainGame.levelNum) {
        case 0:
            this.viking2.updateAnim(5);
            break
        }
    },
    updateSimon: function(vNum) {
        if (!this.isSimonTalked)
            return;
        if (typeof vNum == undefined)
            vNum = 0;
        if (this.turnNum == 2)
            return;
        if (this.hero2.hpNow <= 0)
            return;
        var nameAnim = this.hero2.obj.state.tracks[0].animation.name;
        if (nameAnim == "idle") {
            var r = MyMath.getRandomInt(1, 7);
            if (vNum > 0)
                r = vNum;
            this.hero2.updateAnim(100 + r);
            if (r == 6) {
                this.hero2.showDialog(0, MainGame.GAME_TEXT.simon_talk4)
            }
        }
    },
    hideElemetns: function() {
        this.hero1.obj.skeleton.findSlot("hat").currentSprite.visible = false;
        this.hero2.obj.skeleton.findSlot("hat").currentSprite.visible = false;
        this.hero1.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        this.hero2.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (MainGame.typeBoat >= 3) {
            this.hero3.obj.skeleton.findSlot("hat").currentSprite.visible = false;
            this.hero3.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false
        }
        if (this.viking1)
            this.viking1.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.viking2)
            this.viking2.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.viking3)
            this.viking3.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.viking4)
            this.viking4.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.viking5)
            this.viking5.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.viking6)
            this.viking6.obj.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.decor1)
            this.decor1.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.decor2)
            this.decor2.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.decor3)
            this.decor3.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.decor4)
            this.decor4.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        if (this.decor4)
            this.decor4.skeleton.findSlot("hat").currentSprite.visible = false;
        if (this.decor3)
            this.decor3.skeleton.findSlot("hat").currentSprite.visible = false
    },
    selectBall1: function() {
        this.typeGun = 0;
        this.krutilka.x = this.btnBall1.x;
        this.krutilka.y = this.btnBall1.y
    },
    selectBall2: function() {
        if (MainGame.countGranat <= 0)
            return;
        this.typeGun = 1;
        this.krutilka.x = this.btnBall2.x;
        this.krutilka.y = this.btnBall2.y
    },
    selectBall3: function() {
        if (MainGame.countRocket <= 0)
            return;
        this.typeGun = 2;
        this.krutilka.x = this.btnBall3.x;
        this.krutilka.y = this.btnBall3.y
    },
    updateCamera: function(vNum, vX, vWhoFollow, vLerp) {
        if (MainGame.isDebug) {
            if (vNum > 0)
                return
        }
        if (typeof vX == undefined)
            vX = 0;
        if (typeof vWhoFollow == undefined)
            vWhoFollow = null;
        if (typeof vLerp == undefined)
            vLerp = .1;
        switch (vNum) {
        case 100:
            this.cameraPoint.x = game.camera.x + 400;
            var time = Math.floor(this.level_width * .7);
            this.timeToStart = time;
            game.add.tween(this.cameraPoint).to({
                x: vX
            }, this.timeToStart, "Sine.easeIn", true);
            game.camera.follow(this.cameraPoint, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT, .1, .1);
            break;
        case 0:
            game.camera.focusOnXY(vX, 0);
            this.cameraPoint.x = game.camera.x;
            break;
        case 1:
            game.camera.follow(vWhoFollow, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT, vLerp, vLerp);
            game.camera.deadzone.width = 100;
            break;
        case 2:
            this.cameraPoint.x = game.camera.x + 400;
            game.add.tween(this.cameraPoint).to({
                x: vX
            }, 1e3, "Quad.easeOut", true);
            game.camera.follow(this.cameraPoint, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT, vLerp, vLerp);
            break
        }
    },
    addDodik: function(vTeam, vSkin, vX, vY, vCategory, vMask, vIsWave, vHpBarY) {
        var dodik = new Bot(game,this.layerMain,vTeam,vSkin,vX,vY,vIsWave);
        dodik.body.setCollisionCategory(vCategory);
        dodik.body.setCollisionMask(vMask);
        dodik.body.setCategoryContactCallback(this.CATEGORY_BALL, this.hitBall, this);
        dodik.body.setCategoryContactCallback(this.CATEGORY_DODIK, this.hitDodik, this);
        this.arDodiki.push(dodik);
        this.countDodik = this.arDodiki.length;
        dodik.hpBar = this.addHpBar(vX, vY, vHpBarY);
        dodik.dialog = this.addDialog(vX, vY, vHpBarY);
        dodik.dialog.visible = false;
        dodik.mini = this.addMiniIcon(vX, vTeam);
        return dodik
    },
    addHpBar: function(vX, vY, vSdvig) {
        var hpBar = this.layerHpBars.add(game.add.group());
        hpBar.x = vX;
        hpBar.y = vY;
        var obj1 = hpBar.add(game.add.image(-25, -130, "ss_main2", "hp_bar2_0000"));
        var obj2 = hpBar.add(game.add.image(-25, -130, "ss_main2", "hp_bar1_0000"));
        hpBar.bar1 = obj1;
        hpBar.bar2 = obj2;
        hpBar.offsetY = vSdvig;
        hpBar.cropRect = new Phaser.Rectangle(0,0,52,15);
        hpBar.bar2.crop(hpBar.cropRect);
        return hpBar
    },
    addDialog: function(vX, vY, vSdvig) {
        var dialog = this.layerDialog.add(game.add.group());
        dialog.x = vX;
        dialog.y = vY;
        var obj2 = dialog.add(game.add.image(-22, 0, "ss_main2", "msg2_0000"));
        obj2.anchor.setTo(0, 1);
        var obj1 = dialog.add(game.add.image(5, 0, "ss_main2", "msg_tail_0000"));
        obj1.anchor.setTo(.5, .25);
        dialog.dialog1 = obj1;
        dialog.dialog2 = obj2;
        dialog.offsetY = vSdvig;
        dialog.text = MainGame.addText(800, -10, -35, "", dialog, 22, 9330034);
        return dialog
    },
    addMiniIcon: function(vX, vTeam) {
        var offsetX = 45;
        if (vTeam == 1) {
            iconGroup = this.layerMap1.add(game.add.group());
            iconGroup.x = -offsetX * this.countTeam1;
            this.countTeam1++;
            this.sdvigMap1 += offsetX
        } else {
            iconGroup = this.layerMap2.add(game.add.group());
            iconGroup.x = offsetX * this.countTeam2;
            this.countTeam2++;
            this.sdvigMap2 += offsetX
        }
        iconGroup.y = 566;
        var obj = iconGroup.add(game.add.image(0, 0, "ss_main2", "map_h" + vTeam + "_0000"));
        obj.anchor.setTo(.5);
        var obj1 = iconGroup.add(game.add.image(-16, -27, "ss_main2", "hp_bar2mini_0000"));
        var obj2 = iconGroup.add(game.add.image(-16, -27, "ss_main2", "hp_bar1mini_0000"));
        iconGroup.bar1 = obj1;
        iconGroup.bar2 = obj2;
        iconGroup.obj = obj;
        iconGroup.cropRect = new Phaser.Rectangle(0,0,30,10);
        iconGroup.bar2.crop(iconGroup.cropRect);
        return iconGroup
    },
    addBodyShape: function(vCategory, vVertices, offsetX, offsetY) {
        var bodyBox = this.addPolygon(vVertices, offsetX, offsetY);
        if (vCategory == 1)
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND1);
        if (vCategory == 2)
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND2);
        if (vCategory == 3)
            bodyBox.setCollisionCategory(this.CATEGORY_GROUND3);
        if (vCategory == 4)
            bodyBox.setCollisionCategory(this.CATEGORY_HELICOPTER);
        return bodyBox
    },
    addPolygon: function(vVertices, offsetX, offsetY) {
        if (vVertices.length >= 6) {
            var body = new Phaser.Physics.Box2D.Body(this.game,null,offsetX,offsetY,0);
            body.static = true;
            body.setPolygon(vVertices);
            body.setCategoryContactCallback(this.CATEGORY_BALL, this.hitBallGround, this);
            return body
        }
    },
    addRectangle: function(vX, vY, vW, vH) {
        var body = new Phaser.Physics.Box2D.Body(game,null,vX,vY,0);
        body.setRectangle(vW, vH, 0, 0);
        body.setCategoryContactCallback(this.CATEGORY_BALL, this.hitBallGround, this);
        return body
    },
    checkDodiki: function() {
        var dodik;
        var countNeedWait = 0;
        var timeWait = 500;
        for (var i = 0; i < this.countDodik; i++) {
            dodik = this.arDodiki[i];
            if (dodik.isLive) {
                dodik.checkBaza(this.turnNum, countNeedWait);
                if (!dodik.isOnBaza || dodik.isWasKicked) {
                    countNeedWait++;
                    if (this.turnNum == 2) {
                        dodik.moveToBaza()
                    } else {
                        game.time.events.add(timeWait, this.gogoDodik, this, dodik).autoDestroy = true;
                        if (dodik.isWasKicked) {
                            timeWait += 900
                        }
                    }
                    if (!dodik.isOnBaza) {
                        timeWait += 8 * Math.floor(dodik.distanceBaza())
                    }
                }
            }
        }
        if (this.turnNum == 2 && !this.isOpponentMiss)
            this.playVoiceGroup(3);
        game.time.events.add(200 + timeWait, this.nextTurn, this).autoDestroy = true
    },
    swapLayer: function(vHero, vNum) {
        this.layerMain.remove(vHero);
        this.layerEffect.add(vHero)
    },
    gogoDodik: function(vHero) {
        vHero.moveToBaza();
        this.updateCamera(2, vHero.obj.x);
        if (vHero.isEnemy() && vHero.isGoToBaza && vHero.isWasKicked) {
            this.heroDialog(vHero)
        }
    },
    nextTurn: function() {
        this.isOpponentMiss = true;
        for (var i = 0; i < this.countDodik; i++)
            this.arDodiki[i].setToStartPos();
        this.targetIK1.target.y = 30;
        this.targetIK2.target.y = 55;
        var isLiveHeroes = false;
        if (this.hero1.hpNow > 0 || this.hero2.hpNow > 0)
            isLiveHeroes = true;
        if (MainGame.typeBoat >= 3 && (isLiveHeroes || this.hero3.hpNow > 0))
            isLiveHeroes = true;
        if (isLiveHeroes) {
            if (this.turnNum == 1) {
                var isLiveEnemy = false;
                var dodik;
                for (var i = 0; i < this.countDodik; i++) {
                    dodik = this.arDodiki[i];
                    if (dodik.isEnemy())
                        isLiveEnemy = true
                }
                if (isLiveEnemy) {
                    this.attackEnemy();
                    if (MainGame.isAPI)
                        MainGame.API_POKI.gameplayStart()
                } else {
                    this.levelWin()
                }
            } else {
                if (MainGame.isAPI)
                    MainGame.API_POKI.gameplayStart();
                if (this.striker.hpNow <= 0) {
                    var arHeroes = [];
                    if (this.hero1.hpNow > 0)
                        arHeroes.push(this.hero1);
                    if (this.hero2.hpNow > 0)
                        arHeroes.push(this.hero2);
                    if (MainGame.typeBoat >= 3 && this.hero3.hpNow > 0)
                        arHeroes.push(this.hero3);
                    this.striker = arHeroes[0];
                    this.striker.updateAnim(0);
                    this.striker.readyToShoot = true;
                    this.layerAimPointsOld.visible = false
                } else {
                    this.layerAimPointsOld.visible = true
                }
                this.gameStatus = 4;
                this.typeGun = this.lastTypeGun;
                this.turnNum = 1;
                this.updateCamera(2, 300);
                this.showPanel();
                this.setStriker(this.striker);
                this.isShooted = false
            }
        } else {
            this.gameStatus = -1;
            this.layerTop.visible = false;
            this.levelLose()
        }
        this.layerHpBars.visible = false
    },
    levelWin: function() {
        this.isLevelCompleted = true;
        this.updateCamera(2, 300);
        var dodik;
        for (var i = 0; i < this.countDodik; i++) {
            dodik = this.arDodiki[i];
            if (dodik.team == 1)
                dodik.updateAnim(6)
        }
        MainGame.stopMusic();
        MainGame.playSound(25);
        game.time.events.add(2e3, this.finishGame, this, true).autoDestroy = true
    },
    levelLose: function() {
        this.isLevelCompleted = true;
        this.updateCamera(2, this.posCameraEnemy);
        var dodik;
        for (var i = 0; i < this.countDodik; i++) {
            dodik = this.arDodiki[i];
            if (dodik.team == 2)
                dodik.updateAnim(6)
        }
        MainGame.stopMusic();
        MainGame.playSound(26);
        game.time.events.add(2e3, this.finishGame, this, false).autoDestroy = true
    },
    attackEnemy: function(vNumStiker) {
        if (typeof vNumStiker === "undefined")
            vNumStiker = 0;
        this.turnNum = 2;
        var dodik;
        var whatDodik = vNumStiker;
        if (MainGame.isDebug) {
            for (var i = 0; i < this.countDodik; i++) {
                dodik = this.arDodiki[i];
                if (dodik.isEnemy()) {
                    if (whatDodik == 1) {
                        break
                    } else {
                        whatDodik--
                    }
                }
            }
        } else {
            for (var i = 0; i < this.countDodik; i++) {
                dodik = this.arDodiki[i];
                if (dodik.isEnemy())
                    break
            }
        }
        var goalX;
        var goalY;
        var angleAim = 0;
        var powerAim = 0;
        var aimX = dodik.obj.x;
        var aimY = dodik.obj.y - 48;
        var isMinWay = true;
        var delta = 80;
        var arHeroes = [];
        if (this.hero1.isLive)
            arHeroes.push(this.hero1);
        if (this.hero2.isLive)
            arHeroes.push(this.hero2);
        if (MainGame.typeBoat == 2 && this.dog.isLive)
            arHeroes.push(this.dog);
        if (MainGame.typeBoat >= 3 && this.hero3.isLive)
            arHeroes.push(this.hero3);
        var r = Math.floor(Math.random() * arHeroes.length);
        if (r > 0)
            isMinWay = false;
        if (dodik.isUpStriker)
            isMinWay = false;
        goalX = arHeroes[r].obj.x;
        goalY = arHeroes[r].obj.y - 75;
        if (MainGame.typeBoat == 2 && r == 2)
            goalY += 17;
        this.stepAttack++;
        var awp = MainGame.accuracy[MainGame.levelNum] - MainGame.levelNum - this.stepAttack;
        if (MainGame.levelNum == 12) {
            isMinWay = true;
            if (this.stepAttack < 5) {
                awp = MyMath.getRandomInt(3, 6);
                goalX += 7 * MyMath.getRandomInt(3, 8);
                goalY += 20;
                if (dodik.skin == "o2") {
                    goalX += 50;
                    goalY += 120
                }
            } else {
                awp = MyMath.getRandomInt(0, 3)
            }
        } else {
            if (MainGame.isHardMode) {
                awp = 2 - this.stepAttack
            }
            var chanceValue = 10 + this.countMissed * 10 + 2 * (12 - MainGame.levelNum);
            if (Phaser.Utils.chanceRoll(chanceValue)) {
                awp = MyMath.getRandomInt(1, 3);
                goalX += 5 * MyMath.getRandomInt(-3, 3);
                goalY += 5 * MyMath.getRandomInt(-3, 3)
            }
        }
        console.log("isHardMode", MainGame.isHardMode);
        if (awp < 0)
            awp = 0;
        if (MainGame.isDebug)
            awp = 0;
        if (isMinWay) {
            goalX += awp * 50;
            goalY += awp * 10
        } else {
            goalX -= awp * 5;
            goalY -= awp * 20
        }
        console.log("go attack", vNumStiker, "stepAttack", this.stepAttack, "awp", awp);
        if (MainGame.levelNum < 12) {
            if (Phaser.Utils.chanceRoll(6)) {
                goalX += 5 * MyMath.getRandomInt(-5, 5);
                goalY += 5 * MyMath.getRandomInt(-5, 5)
            }
        }
        var isReadyStrike = false;
        if (isMinWay) {
            for (var k = 0; k < 20; k += 2) {
                angleAim = -k;
                for (var j = 0; j < 120; j += 10) {
                    powerAim = 200 + j;
                    isReadyStrike = this.checkScope(aimX, aimY, goalX, goalY, angleAim, powerAim, delta);
                    if (isReadyStrike)
                        break
                }
                if (isReadyStrike)
                    break
            }
        } else {
            for (var k = 33; k > 5; k -= 1) {
                angleAim = -k;
                for (var j = -60; j < 100; j += 10) {
                    powerAim = 240 - j;
                    isReadyStrike = this.checkScope(aimX, aimY, goalX, goalY, angleAim, powerAim, delta);
                    if (isReadyStrike)
                        break
                }
                if (isReadyStrike)
                    break
            }
        }
        dodik.goAttack(angleAim, powerAim);
        this.updateCamera(2, dodik.obj.x + 10);
        this.setIK(dodik);
        this.enemyDialog(dodik);
        MainGame.playSound(5)
    },
    checkScope: function(vAimX, vAimY, vGoalX, vGoalY, vAngle, vPower) {
        var angleDeg = Phaser.Math.degToRad(vAngle);
        var ballX = vAimX - Math.cos(angleDeg) * 80;
        var ballY = vAimY + Math.sin(angleDeg) * 80;
        var finalAimX = vAimX - Math.cos(angleDeg) * (80 + vPower);
        var finalAimY = vAimY + Math.sin(angleDeg) * (80 + vPower);
        var launchVelocity = new Phaser.Point(0,0);
        launchVelocity.x = finalAimX - vAimX;
        launchVelocity.y = finalAimY - vAimY;
        launchVelocity.multiply(4, 4);
        var trajectoryPoint;
        var dist;
        if (MainGame.isDebug)
            this.layerTest.removeAll();
        var minScopeCount = 40;
        var maxScopeCount = 130;
        for (var i = minScopeCount; i < maxScopeCount; i++) {
            trajectoryPoint = this.getTrajectoryPoint(60, ballX, ballY, launchVelocity.x, launchVelocity.y, 0 + i);
            if (MainGame.isDebug)
                this.addRedPoint(trajectoryPoint.x, trajectoryPoint.y);
            if (trajectoryPoint.y > 650 || trajectoryPoint.x < 10) {
                break
            } else {
                dist = Math.floor(Phaser.Math.distance(vGoalX, vGoalY, trajectoryPoint.x, trajectoryPoint.y));
                if (dist < 17) {
                    isReadyStrike = true;
                    if (MainGame.isDebug) {}
                    return true
                }
            }
        }
        return false
    },
    addRedPoint: function(vX, vY) {
        var obj = this.layerTest.add(game.add.image(vX, vY, "ss_main2", "aimball_0000"));
        obj.scale.setTo(.5);
        obj.anchor.setTo(.5)
    },
    aimEnemy: function(vIsTopor, vAngle) {
        this.targetIK1.target.y = 30 - vAngle * .544;
        this.lastTargetPosC1 = this.targetIK1.target.y;
        this.targetIK2.target.y = 55 - vAngle * .9;
        this.lastTargetPosC2 = this.targetIK2.target.y
    },
    strikeEnemy: function(vIsTopor, vX, vY, vAngle, vPower) {
        this.targetIK1.target.y = this.lastTargetPosC1;
        this.targetIK2.target.y = this.lastTargetPosC2;
        switch (MainGame.levelNum) {
        case 0:
        case 2:
        case 5:
            this.typeGun = 3;
            MainGame.playSound(28);
            break;
        case 1:
        case 7:
            this.typeGun = 4;
            MainGame.playSound(19);
            break;
        case 3:
        case 12:
            this.typeGun = 5;
            MainGame.playSound(28);
            break;
        case 4:
        case 9:
            this.typeGun = 6;
            MainGame.playSound(19);
            break;
        case 6:
        case 8:
            MainGame.playSound(19);
            this.typeGun = 7;
            break;
        case 10:
        case 11:
            this.typeGun = 8;
            MainGame.playSound(28);
            break
        }
        var aimX = vX - 10;
        var aimY = vY - 55;
        var angleDeg = Phaser.Math.degToRad(vAngle);
        var ballX = aimX - Math.cos(angleDeg) * 80;
        var ballY = aimY + Math.sin(angleDeg) * 80;
        var finalAimX = aimX - Math.cos(angleDeg) * (80 + vPower);
        var finalAimY = aimY + Math.sin(angleDeg) * (80 + vPower);
        var launchVelocity = new Phaser.Point(0,0);
        launchVelocity.x = finalAimX - aimX;
        launchVelocity.y = finalAimY - aimY;
        launchVelocity.multiply(4, 4);
        if (MainGame.levelNum != 1 && MainGame.levelNum != 4 && MainGame.levelNum != 6 && MainGame.levelNum != 7) {
            var effectPukX = aimX - Math.cos(angleDeg) * 100;
            var effectPukY = aimY + Math.sin(angleDeg) * 100;
            var strikeEffect = this.addEffect(4, this.layerEffect, effectPukX, effectPukY, .6);
            strikeEffect.angle = -vAngle;
            strikeEffect.scale.x = -1
        }
        this.prepareShoot(ballX, ballY, launchVelocity)
    },
    hitBallGround: function(body1, body2, fixture1, fixture2, begin, contact) {
        if (!begin)
            return;
        contact.GetWorldManifold(this.worldManifold);
        if (this.worldManifold.points.length == 0)
            return;
        var point = this.worldManifold.points[0];
        var pX = -point.x * game.physics.box2d.ptmRatio;
        var pY = -point.y * game.physics.box2d.ptmRatio;
        var ballVlc = Math.abs(this.ball.body.velocity.x) + Math.abs(this.ball.body.velocity.y);
        if (this.typeGun == 1) {
            if (ballVlc > 270)
                MainGame.playSound(7)
        }
        if (this.typeGun == 2 || this.typeGun == 7 || this.typeGun == 8) {
            this.boomBomb(body2.x, body2.y, this.typeGun)
        } else {
            if (ballVlc > 320 && this.timerSfxHitBall <= 0) {
                MainGame.playSound(23);
                this.timerSfxHitBall = 100
            }
            if (body1.link && body1.link.typeObj) {
                if (body1.link.typeObj == "shark") {
                    this.shark.animations.play("attack", 30, false);
                    MainGame.playSound(1);
                    body2.velocity.y = -350;
                    if (Math.abs(this.ball.body.velocity.x) < 30) {
                        if (this.ball.body.velocity.x > 0) {
                            body2.velocity.x = MyMath.getRandomInt(30, 60)
                        } else {
                            body2.velocity.x = MyMath.getRandomInt(30, 60) * -1
                        }
                    }
                } else if (body1.link.typeObj == "hippo") {
                    this.hippo.animations.play("attack", 30, false);
                    MainGame.playSound(1);
                    body2.velocity.y = -350;
                    if (Math.abs(this.ball.body.velocity.x) < 30) {
                        if (this.ball.body.velocity.x > 0) {
                            body2.velocity.x = MyMath.getRandomInt(30, 60)
                        } else {
                            body2.velocity.x = MyMath.getRandomInt(30, 60) * -1
                        }
                    }
                } else if (body1.link.typeObj == "decor") {
                    body1.link.setAnimationByName(0, "kick", false);
                    body1.link.addAnimationByName(0, "idle", true);
                    this.addEffect(3, this.layerEffect, pX, pY)
                }
            }
        }
    },
    hitBall: function(body1, body2, fixture1, fixture2, begin, contact) {
        if (!begin)
            return;
        if (body1.link && body2.link) {
            if (body1.link.typeObj == "dodik") {
                if (body2.link.typeObj == "ball") {
                    var ballVlc = Math.abs(this.ball.body.velocity.x) + Math.abs(this.ball.body.velocity.y);
                    var telo = body1.link;
                    if (telo.ballHitted > 0 || ballVlc < 100)
                        return;
                    contact.GetWorldManifold(this.worldManifold);
                    if (this.worldManifold.points.length == 0)
                        return;
                    if (ballVlc > 250) {
                        if (this.typeGun == 1) {
                            MainGame.playSound(7);
                            body2.velocity.x *= .6;
                            body2.velocity.y *= .6
                        } else {
                            if (this.typeGun == 1 || this.typeGun == 2 || this.typeGun == 7 || this.typeGun == 8) {} else {
                                MainGame.playSound(23)
                            }
                        }
                    }
                    var point = this.worldManifold.points[0];
                    var pX = -point.x * game.physics.box2d.ptmRatio;
                    var pY = -point.y * game.physics.box2d.ptmRatio;
                    var isHead = false;
                    if (body1.y - pY > 70) {
                        isHead = true
                    }
                    if (this.typeGun == 2 || this.typeGun == 7 || this.typeGun == 8) {
                        this.boomBomb(body2.x, body2.y, this.typeGun);
                        return
                    }
                    if (ballVlc > 50)
                        body1.velocity.y = -210;
                    if (telo.skin == "dog") {
                        body1.velocity.y -= 100;
                        body1.velocity.x -= 80;
                        body1.sensor = true
                    } else if (telo.skin == "o1" || telo.skin == "o2") {
                        body1.velocity.x = 0;
                        body1.velocity.y = 0
                    }
                    telo.updateAnim(4);
                    this.addEffect(3, this.layerEffect, pX, pY);
                    var dmg = Math.floor(ballVlc / 50) + 5;
                    if (isHead)
                        dmg *= 1.3;
                    if (this.typeGun == 4)
                        dmg *= 1.2;
                    if (this.typeGun == 6)
                        dmg *= 1.1;
                    telo.getDamage(Math.floor(dmg));
                    if (telo.team == 1) {
                        if (isHead) {
                            this.playVoiceGroup(2)
                        } else {
                            this.playVoiceGroup(1)
                        }
                    } else {
                        if (isHead) {
                            this.playVoiceGroup(5)
                        } else {
                            this.playVoiceGroup(7)
                        }
                    }
                    this.updateCamera(1, 0, telo.obj)
                }
            }
        }
    },
    hitDodik: function(body1, body2, fixture1, fixture2, begin, contact) {
        if (!begin)
            return;
        if (this.isTimeAim)
            return;
        if (body1.link && body2.link) {
            if (body2.link.typeObj == "dodik") {
                if (body1.link.typeObj == "dodik") {
                    var telo = body2.link;
                    if (telo.status == 0) {
                        telo.status = 1;
                        telo.getDamage(15);
                        telo.updateAnim(4)
                    }
                }
            }
        }
    },
    setBallSensor: function() {
        if (this.ball.visible)
            this.ball.body.sensor = false
    },
    prepareShoot: function(vX, vY, vLaunchVelocity) {
        if (this.isFirstStike) {
            for (var i = 0; i < this.countDodik; i++)
                this.arDodiki[i].initStartPos();
            this.isFirstStike = false
        }
        this.isHitWater = false;
        this.ball.visible = true;
        if (this.turnNum == 1) {
            this.ball.body.sensor = false
        } else {
            this.ball.body.sensor = true;
            game.time.events.add(250, this.setBallSensor, this, true)
        }
        this.ball.body.angle = 0;
        this.ball.body.x = vX;
        this.ball.body.y = vY;
        this.ball.body.velocity.x = vLaunchVelocity.x;
        this.ball.body.velocity.y = vLaunchVelocity.y;
        this.ball.body.gravityScale = 1;
        this.ball.status = 1;
        this.ball.body.mass = .35;
        switch (this.typeGun) {
        case 0:
            this.ball.frameName = "ball1_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = 10;
            this.ball.body.restitution = .4;
            if (this.turnNum != 1)
                this.ball.body.angularVelocity *= -1;
            break;
        case 1:
            this.ball.frameName = "grenade_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = 10;
            this.ball.body.restitution = .22;
            this.ball.body.mass = .52;
            game.time.events.add(3e3, this.timeGranata, this, true).autoDestroy = true;
            game.time.events.add(1e3, this.tickGrenade, this, true).autoDestroy = true;
            game.time.events.add(1500, this.tickGrenade, this, true).autoDestroy = true;
            game.time.events.add(2e3, this.tickGrenade, this, true).autoDestroy = true;
            game.time.events.add(2500, this.tickGrenade, this, true).autoDestroy = true;
            MainGame.countGranat--;
            this.textGranat.setText(MainGame.countGranat);
            break;
        case 2:
            this.ball.frameName = "rocket_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = 10;
            this.ball.body.restitution = .18;
            this.ball.body.mass = .65;
            game.time.events.repeat(100, 20, this.createTrail, this);
            MainGame.countRocket--;
            this.textRocket.setText(MainGame.countRocket);
            break;
        case 3:
            this.ball.frameName = "ball2_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = 10;
            if (this.turnNum != 1)
                this.ball.body.angularVelocity *= -1;
            break;
        case 4:
            this.ball.frameName = "axe1_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = -10;
            break;
        case 5:
            this.ball.frameName = "ball4_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = 10;
            if (this.turnNum != 1)
                this.ball.body.angularVelocity *= -1;
            break;
        case 6:
            this.ball.frameName = "shuriken1_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = -15;
            break;
        case 7:
            this.ball.frameName = "arrow1_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = -15;
            game.time.events.repeat(200, 10, this.createTrail, this);
            break;
        case 8:
            this.ball.frameName = "ball3_0000";
            this.ball.body.fixedRotation = false;
            this.ball.body.angularVelocity = -15;
            break
        }
        this.updateCamera(1, 0, this.ball)
    },
    createTrail: function() {
        if (this.ball.visible)
            this.addEffect(5, this.layerEffect, this.ball.x - 15, this.ball.y)
    },
    onAnimCompleteAnimal: function(sprite, animation) {
        if (animation.name === "attack") {
            sprite.animations.play("swim", 30, true)
        }
    },
    boomBomb: function(vX, vY, vType) {
        if (!this.ball.visible)
            return;
        var maxDistance = 250;
        var dist;
        var dodik;
        var pW = {
            x: vX,
            y: vY
        };
        var force = 0;
        for (var i = 0; i < this.countDodik; i++) {
            dodik = this.arDodiki[i];
            dist = Math.floor(Phaser.Math.distance(vX, vY, dodik.obj.x, dodik.obj.y - 50));
            if (dist < maxDistance) {
                force = (350 - dist) * 4;
                if (vType == 7 || vType == 8)
                    force *= .52;
                if (vX - dodik.obj.x > 0)
                    force *= -1;
                dodik.body.applyForce(force, pW);
                dodik.body.velocity.y = -(300 - dist);
                dodik.updateAnim(4);
                var damageCount = Math.floor(Math.abs(force) * .09);
                if (vType == 1) {
                    damageCount = Math.floor(damageCount * .85)
                } else if (vType == 2) {
                    damageCount = Math.floor(damageCount * .75)
                } else if (vType == 8) {
                    damageCount = Math.floor(damageCount * .85)
                }
                dodik.getDamage(damageCount)
            }
        }
        this.addEffect(1, this.layerEffect, vX, vY);
        MainGame.playSound(6);
        game.camera.flash(16777215, 300);
        this.goShake();
        this.stopBall()
    },
    goShake: function() {
        var properties = {
            x: MyMath.getRandomInt(-5, 5),
            y: -MyMath.getRandomInt(-5, 5)
        };
        var duration = 50;
        var repeat = 1;
        var ease = Phaser.Easing.Bounce.InOut;
        var autoStart = true;
        var delay = 0;
        var yoyo = true;
        game.add.tween(this.layerEffect).to(properties, duration, ease, autoStart, delay, repeat, yoyo)
    },
    showPanel: function() {
        this.layerPanelTurn.visible = true;
        this.layerPanelTurn.x = -250;
        game.add.tween(this.layerPanelTurn).to({
            x: -110
        }, 500, "Back.easeOut", true, 100);
        this.layerWeapon.visible = true;
        if (this.lastTypeGun == 1 && MainGame.countGranat == 0) {
            this.krutilka.x = this.btnBall1.x;
            this.krutilka.y = this.btnBall1.y;
            this.typeGun = 0
        }
        if (this.lastTypeGun == 2 && MainGame.countRocket == 0) {
            this.krutilka.x = this.btnBall1.x;
            this.krutilka.y = this.btnBall1.y;
            this.typeGun = 0
        }
    },
    heroDialog: function(vHero) {
        var r = Math.floor(Math.random() * 10);
        vHero.showDialog(1, MainGame.GAME_TEXT["pain_talk" + r])
    },
    enemyDialog: function(vHero) {
        var r = Math.floor(Math.random() * 9);
        vHero.showDialog(0, MainGame.GAME_TEXT["enemy_talk" + r])
    },
    sayDialog1: function() {
        this.hero1.showDialog(0, MainGame.GAME_TEXT["start_brother_talkRW1_" + MainGame.levelNum])
    },
    sayDialog2: function() {
        this.hero2.showDialog(0, MainGame.GAME_TEXT["start_simon_talkRW1_" + MainGame.levelNum]);
        this.isSimonTalked = true
    },
    soundEnvironment: function() {
        if (Phaser.Utils.chanceRoll(7)) {
            var r = 11 + MyMath.getRandomInt(0, 5);
            MainGame.playSound(r)
        }
    },
    tickGrenade: function() {
        if (this.ball.visible)
            MainGame.playSound(9)
    },
    timeGranata: function() {
        this.boomBomb(this.ball.x, this.ball.y, this.typeGun)
    },
    inputStageDown: function(pointer) {
        if (this.isLevelCompleted || this.isPaused)
            return;
        if (MainGame.isDebug && this.gameStatus == 1) {}
        if (this.game.input.worldY < 110)
            return;
        if (this.turnNum != 1)
            return;
        if (this.isShooted)
            return;
        this.isInputPress = true;
        if (this.gameStatus == 0) {
            this.updateCamera(100, 300);
            this.gameStatus = 1;
            this.layerText.removeAll();
            var time = this.timeToStart;
            game.time.events.add(time, this.showPanel, this, true);
            game.time.events.add(time + 300, this.sayDialog1, this, true);
            game.time.events.add(time + 2900, this.sayDialog2, this, true)
        } else if (this.gameStatus == 1) {
            this.striker.updateAnim(0);
            this.striker.readyToShoot = true;
            this.gameStatus = 2;
            for (var i = 0; i < this.countDodik; i++)
                this.arDodiki[i].initStartPos();
            this.updateSimon();
            this.showAimCircle()
        } else if (this.gameStatus == 3) {
            this.updateCamera(2, 300);
            this.gameStatus = 4
        } else if (this.gameStatus == 4) {
            this.gameStatus = 2;
            this.isTimeAim = true
        }
        if (this.isTimeAim) {
            this.showAimCircle()
        } else {
            this.aimCircle.visible = false
        }
    },
    showAimCircle: function() {
        this.inputPointDown.x = this.game.input.worldX;
        this.inputPointDown.y = this.game.input.worldY;
        this.aimCircle.visible = true;
        this.aimCircle.x = this.inputPointDown.x;
        this.aimCircle.y = this.inputPointDown.y
    },
    inputStageUp: function() {
        if (this.game.input.x < 10 || this.game.input.y < 10 || this.game.input.y > game.height - 10) {
            this.aimCircle.visible = false;
            this.layerAimPointsNew.visible = false;
            this.isInputPress = false;
            return
        }
        if (this.isLevelCompleted || this.isPaused)
            return;
        if (this.game.input.worldY < 150)
            return;
        if (!this.isInputPress || !this.isTimeAim)
            return;
        if (this.turnNum != 1)
            return;
        if (this.isShooted)
            return;
        if (this.turnNum == 1 && this.isTimeAim) {
            this.aimCircle.visible = false
        }
        if (this.distanceAim > this.DISTANCE_FOR_AIM) {
            this.isShooted = true;
            this.layerAimPointsNew.visible = false;
            this.layerAimPointsOld.visible = false;
            this.layerArrowOld.angle = this.layerArrow.angle;
            for (var i = 0; i < 10; i++) {
                this.arBallPathLast[i].x = this.arBallPath[i].x;
                this.arBallPathLast[i].y = this.arBallPath[i].y
            }
            this.striker.updateAnim(1);
            this.targetIK1.target.y = this.lastTargetPosP1;
            this.targetIK2.target.y = this.lastTargetPosP2;
            var angleDeg = Phaser.Math.degToRad(this.angleDeg);
            var ballX = this.aimX + Math.cos(angleDeg) * 120;
            var ballY = this.aimY + Math.sin(angleDeg) * 120;
            var strikeEffect = this.addEffect(4, this.layerEffect, ballX, ballY, .6);
            strikeEffect.angle = this.layerArrow.angle;
            this.isTimeAim = false;
            this.isInputPress = false;
            this.lastTypeGun = this.typeGun;
            if (this.typeGun == 0)
                MainGame.playSound(28);
            if (this.typeGun == 1)
                MainGame.playSound(8);
            if (this.typeGun == 2)
                MainGame.playSound(17);
            this.playVoiceGroup(4);
            this.prepareShoot(ballX, ballY, this.launchVelocity);
            this.layerPanelTurn.visible = false;
            this.layerWeapon.visible = false;
            this.stat_shots++
        }
    },
    updateAiminInfo: function(vX, vY, vAngle, vDistance) {
        var power = Math.floor(vDistance / 3.75);
        this.textPowerAiming1.setText(power + "%");
        this.textPowerAiming2.setText(power + "%");
        var midXdot = (this.dotPoint10.x - this.dotPoint1.x) * .5;
        var midYdot = (this.dotPoint10.y - this.dotPoint1.y) * .5;
        this.layerInfoPower.x = this.dotPoint1.x + midXdot;
        this.layerInfoPower.y = this.dotPoint1.y + midYdot;
        this.layerInfoPower.angle = vAngle
    },
    updateArrow: function() {
        if (this.layerArrow.angle == undefined)
            this.layerArrow.angle = 0;
        if (this.game.input.worldY < 110)
            return;
        var inpX1 = this.inputPointDown.x;
        var inpY1 = this.inputPointDown.y;
        var inpX2 = this.game.input.worldX;
        var inpY2 = this.game.input.worldY;
        if (inpX1 < inpX2)
            return;
        this.aimCircle.visible = true;
        var distance = Phaser.Math.distance(inpX1, inpY1, inpX2, inpY2);
        if (distance > 375)
            distance = 375;
        var d = 25;
        var count = Math.ceil(distance / d);
        var angleRad = Math.atan2(inpY1 - inpY2, inpX1 - inpX2);
        var angleDeg = angleRad * 57.295;
        if (angleDeg > 28) {
            angleDeg = 28
        } else if (angleDeg < -40) {
            angleDeg = -40
        }
        this.layerArrow.angle = angleDeg;
        this.angleDeg = angleDeg;
        this.distanceAim = distance;
        var fAngleRad = Phaser.Math.degToRad(this.angleDeg);
        var ballX = this.aimX + Math.cos(fAngleRad) * 120;
        var ballY = this.aimY + Math.sin(fAngleRad) * 120;
        var finalAimX = this.aimX + Math.cos(fAngleRad) * this.distanceAim;
        var finalAimY = this.aimY + Math.sin(fAngleRad) * this.distanceAim;
        var pM = 5;
        this.launchVelocity.x = finalAimX - this.aimX;
        this.launchVelocity.y = finalAimY - this.aimY;
        this.launchVelocity.multiply(pM, pM);
        if (MainGame.showPath) {
            var p;
            for (var i = 0; i < 10; i++) {
                p = this.arBallPath[i];
                var trajectoryPoint = this.getTrajectoryPoint(100, ballX, ballY, this.launchVelocity.x, this.launchVelocity.y, p.num);
                p.x = trajectoryPoint.x;
                p.y = trajectoryPoint.y;
                if (i == 0) {
                    this.dotPoint1.x = p.x;
                    this.dotPoint1.y = p.y
                } else if (i == 9) {
                    this.dotPoint10.x = p.x;
                    this.dotPoint10.y = p.y
                }
            }
        }
        this.updateAiminInfo(this.aimX, this.aimY, angleDeg, distance);
        if (this.distanceAim < this.DISTANCE_FOR_AIM) {
            this.layerAimPointsNew.visible = false
        } else {
            this.layerAimPointsNew.visible = true
        }
    },
    dodikUtonul: function(vTema, vX, vY) {
        if (vTema == 2) {
            this.playVoiceGroup(6);
            this.stat_enemy++
        } else {
            this.playVoiceGroup(0)
        }
        var r = 21 + MyMath.getRandomInt(0, 1);
        MainGame.playSound(r);
        this.addEffect(2, this.layerEffect, vX, vY)
    },
    stopBall: function(vIsWater) {
        if (typeof vIsWater === "undefined")
            vIsWater = false;
        if (this.isHitWater)
            return;
        this.isHitWater = true;
        if (this.ball.visible && vIsWater && !this.ball.body.sensor) {
            this.addEffect(2, this.layerEffect, this.ball.body.x, this.ball.body.y);
            MainGame.playSound(20)
        }
        this.ball.visible = false;
        this.ball.status = 0;
        this.ball.body.gravityScale = 0;
        this.ball.body.velocity.x = 0;
        this.ball.body.velocity.y = 0;
        this.ball.body.angularVelocity = 0;
        this.ball.body.angularDamping = 0;
        this.ball.body.sensor = true;
        this.ball.body.y = -100;
        this.ball.body.x = -100;
        if (!MainGame.isDebug) {
            game.time.events.add(700, this.goStartCheckDodiki, this, true).autoDestroy = true
        }
        this.layerHpBars.visible = true;
        if (this.turnNum == 2 && this.isOpponentMiss) {
            if (this.isOpponentMiss) {
                this.playVoiceGroup(8);
                this.countMissed++
            } else {
                this.countMissed = 0
            }
        }
    },
    opponentGetDmg: function() {
        this.isOpponentMiss = false
    },
    goStartCheckDodiki: function() {
        this.isCanStartCheck = true;
        if (MainGame.isAPI) {
            MainGame.API_POKI.gameplayStop();
            MainGame.API_POKI.destroyAd();
            MainGame.API_POKI.displayAd()
        }
    },
    getTrajectoryPoint: function(vTime, startX, startY, velocityX, velocityY, n) {
        var t = 1 / vTime;
        var stepVelocityX = t * game.physics.box2d.pxm(-velocityX);
        var stepVelocityY = t * game.physics.box2d.pxm(-velocityY);
        var stepGravityX = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.x);
        var stepGravityY = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.y);
        startX = game.physics.box2d.pxm(-startX);
        startY = game.physics.box2d.pxm(-startY);
        var tpx = startX + n * stepVelocityX + .5 * (n * n + n) * stepGravityX;
        var tpy = startY + n * stepVelocityY + .5 * (n * n + n) * stepGravityY;
        tpx = game.physics.box2d.mpx(-tpx);
        tpy = game.physics.box2d.mpx(-tpy);
        return {
            x: tpx,
            y: tpy
        }
    },
    checkSleep: function() {
        var cD = this.countDodik;
        for (var i = 0; i < this.countDodik; i++) {
            dodik = this.arDodiki[i];
            if (dodik.isLive) {
                if (Math.abs(dodik.body.velocity.x) < 3 && Math.abs(dodik.body.velocity.y) < 3) {
                    cD--
                }
            } else {
                cD--
            }
        }
        if (cD == 0) {
            this.isCanStartCheck = false;
            this.checkDodiki()
        }
    },
    render: function() {},
    update: function() {
        this.layerBack2.x = game.camera.x * .2;
        this.layerBack3.x = game.camera.x * .6;
        this.waveCount += .06;
        if (this.timerSfxHitBall > 0)
            this.timerSfxHitBall--;
        for (var i = 0; i < this.waveArCount; i++) {
            this.waveAr[i].y = this.waveAr[i].startY + Math.sin(this.waveCount) * 2.6
        }
        if (this.isCanStartCheck)
            this.checkSleep();
        for (var i = 0; i < this.countDodik; i++) {
            this.arDodiki[i].update(this.waveCount)
        }
        if (this.flagShark) {
            this.shark.body.velocity.x = -90;
            if (this.shark.body.x < -800) {
                this.flagShark = false;
                this.shark.scale.x = -1
            }
        } else {
            this.shark.body.velocity.x = 90;
            if (this.shark.body.x > 2700) {
                this.flagShark = true;
                this.shark.scale.x = 1
            }
        }
        this.shark.x = this.shark.body.x + 500;
        if (!this.isLevelCompleted) {
            if (this.ball.status > 0 && this.typeGun != 1) {
                if (Math.abs(this.ball.body.velocity.x) < 35 && Math.abs(this.ball.body.velocity.y) < 20) {
                    this.ball.body.sensor = true
                }
            }
            if (!this.isHitWater) {
                if (this.typeGun == 2 || this.typeGun == 7 || this.typeGun == 8) {
                    var flyingAngle = Math.atan2(this.ball.body.velocity.y, this.ball.body.velocity.x);
                    this.ball.body.angle = Phaser.Math.radToDeg(flyingAngle)
                }
                if (this.ball.body.y > 494) {
                    this.stopBall(true)
                } else if (this.ball.body.x > this.level_width) {
                    this.stopBall()
                }
            }
            if (this.turnNum == 1 && this.isTimeAim) {
                if (game.input.activePointer.isDown) {
                    this.updateArrow();
                    this.targetIK1.target.y = 30 - this.layerArrow.angle * .544;
                    this.targetIK2.target.y = 55 - this.layerArrow.angle * .9;
                    this.lastTargetPosP1 = this.targetIK1.target.y;
                    this.lastTargetPosP2 = this.targetIK2.target.y
                }
            }
        }
    },
    testStrike: function(vBtn) {
        this.attackEnemy(vBtn.id)
    },
    clickMoveMap1: function() {
        game.camera.x -= 150
    },
    clickMoveMap2: function() {
        game.camera.x += 150
    },
    clickLevelMenu: function() {
        if (MainGame.levelNum == 13) {
            MainGame.goToState("ScreenFinal")
        } else {
            MainGame.goToState("ScreenLevel")
        }
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak()
    },
    clickShop: function() {
        if (MainGame.levelNum == 12) {
            MainGame.goToState("ScreenLevel")
        } else {
            MainGame.goToState("ScreenShop")
        }
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak()
    },
    clickReplay: function() {
        MainGame.goToState("Game")
    },
    clickMenu: function() {
        MainGame.goToState("Menu")
    },
    clickTestWin: function() {
        MainGame.state.finishGame(true)
    },
    clickTestLose: function() {
        MainGame.state.finishGame(false)
    },
    clickPause: function() {
        this.pauseGame()
    },
    onPause: function() {
        if (!MainGame.state.isPaused) {
            MainGame.state.pauseGame()
        }
    },
    addEffect: function(vNum, vLayer, vX, vY, vAnchorX, vAnchorY) {
        if (typeof vAnchorX === "undefined")
            vAnchorX = .5;
        if (typeof vAnchorY === "undefined")
            vAnchorY = .5;
        var cframes = [15, 16, 12, 14, 14];
        var obj;
        var nameEffect;
        switch (vNum) {
        case 1:
            nameEffect = "e1";
            break;
        case 2:
            nameEffect = "e2";
            break;
        case 3:
            nameEffect = "e3";
            break;
        case 4:
            nameEffect = "e4";
            break;
        case 5:
            nameEffect = "e5";
            break
        }
        obj = vLayer.add(game.add.sprite(vX, vY, "ss_main2"));
        obj.anchor.setTo(vAnchorX, vAnchorY);
        obj.animations.add(nameEffect, Phaser.Animation.generateFrameNames(nameEffect + "_", 0, cframes[vNum - 1], "", 4), 30);
        obj.animations.play(nameEffect, 30, false, true);
        return obj
    },
    onEffectAnimationComplete: function(sprite, animation) {}
};
MainGame.Menu = function(game) {}
;
MainGame.Menu.prototype = {
    create: function() {
        game.stage.backgroundColor = "#0054B7";
        MainGame.state = this;
        MainGame.stateName = "Menu";
        MainGame.GAME_TEXT = MainGame.TEXT_FILE[MainGame.languages[MainGame.language]];
        var bg = game.add.image(400, 300, "bg_menu");
        bg.anchor.setTo(.5);
        this.layerMain = game.add.group();
        var offsetY = 15;
        var krug = this.layerMain.add(game.add.image(401, 258 - offsetY, "ss_menu", "Lifebuoy_0000"));
        krug.anchor.setTo(.5);
        var logoS = this.layerMain.add(game.add.image(391, 210 + 94 - offsetY, "ss_menu", "logosimon_0000"));
        logoS.anchor.setTo(.5, .85);
        game.add.tween(logoS).to({
            angle: 5
        }, 1500, "Linear", true, 0, -1, true);
        game.add.tween(logoS).to({
            y: "+6"
        }, 2e3, "Linear", true, 0, -1, true);
        var logoT = this.layerMain.add(game.add.image(400, 325 - offsetY, "ss_menu", "logo_0000"));
        logoT.anchor.setTo(.5);
        this.backLang = this.layerMain.add(game.add.image(58, 56, "ss_menu", "window_language_small_0000"));
        this.backLang.anchor.setTo(.5);
        this.btnLanguage = new SimpleButton(game,this,this.layerMain,58,58,"ss_menu","flag_language_00" + MainGame.languagesN[MainGame.language],this.openLanguage);
        this.panelLanguage = this.layerMain.add(game.add.group());
        var panelLB = this.panelLanguage.add(game.add.image(100, 20, "ss_menu", "window_language_big_0000"));
        this.btnCloseLanguage = new SimpleButton(game,this,this.panelLanguage,58,58,"ss_menu","btn_close_0000",this.closeLanguage);
        var arrL = ["EN", "IT", "ES", "PT", "TR", "DE", "BR", "RU", "FR", "NL"];
        var arrC = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
        arrL.splice(MainGame.language, 1);
        arrC.splice(MainGame.language, 1);
        var sizeFlag = 68;
        var offsetFlagX = 147;
        var offsetFlagY = 66;
        this.btnLang_1 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 0,offsetFlagY + sizeFlag * 0,"ss_menu","flag_language_00" + arrC[0],this["changeLang" + arrL[0]]);
        this.btnLang_2 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 1,offsetFlagY + sizeFlag * 0,"ss_menu","flag_language_00" + arrC[1],this["changeLang" + arrL[1]]);
        this.btnLang_3 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 2,offsetFlagY + sizeFlag * 0,"ss_menu","flag_language_00" + arrC[2],this["changeLang" + arrL[2]]);
        this.btnLang_4 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 0,offsetFlagY + sizeFlag * 1,"ss_menu","flag_language_00" + arrC[3],this["changeLang" + arrL[3]]);
        this.btnLang_5 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 1,offsetFlagY + sizeFlag * 1,"ss_menu","flag_language_00" + arrC[4],this["changeLang" + arrL[4]]);
        this.btnLang_6 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 2,offsetFlagY + sizeFlag * 1,"ss_menu","flag_language_00" + arrC[5],this["changeLang" + arrL[5]]);
        this.btnLang_7 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 0,offsetFlagY + sizeFlag * 2,"ss_menu","flag_language_00" + arrC[6],this["changeLang" + arrL[6]]);
        this.btnLang_8 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 1,offsetFlagY + sizeFlag * 2,"ss_menu","flag_language_00" + arrC[7],this["changeLang" + arrL[7]]);
        this.btnLang_9 = new SimpleButton(game,this,this.panelLanguage,offsetFlagX + sizeFlag * 2,offsetFlagY + sizeFlag * 2,"ss_menu","flag_language_00" + arrC[8],this["changeLang" + arrL[8]]);
        this.panelLanguage.visible = false;
        this.btnStart = new SimpleButton(game,this,this.layerMain,400,520 - 80,"ss_menu","btn_play2_0000",this.clickStart);
        this.btnCredits = new SimpleButton(game,this,this.layerMain,400 + 345,58,"ss_menu","btn_credits_0000",this.clickCredits);
        MainGame.isWater = true;
        this.musicButton = this.layerMain.add(game.add.image(400 + 345, 58, "ss_menu", "btn_music_0000"));
        this.musicButton.anchor.setTo(.5, .5);
        this.musicButton.inputEnabled = true;
        this.musicButton.events.onInputDown.add(MainGame.clickMuteMusic, this);
        if (MainGame.isMusicMuted)
            this.musicButton.frameName = "btn_music_0001";
        this.sfxButton = this.layerMain.add(game.add.image(400 + 345, 58, "ss_menu", "btn_sound_0000"));
        this.sfxButton.anchor.setTo(.5, .5);
        this.sfxButton.inputEnabled = true;
        this.sfxButton.events.onInputDown.add(MainGame.clickMuteSFX, this);
        if (MainGame.isSfxMuted)
            this.sfxButton.frameName = "btn_sound_0001";
        if (MainGame.firstGo) {
            this.musicButton.frameName = "btn_music_0001";
            this.sfxButton.frameName = "btn_sound_0001"
        } else {
            MainGame.playMusic(0)
        }
        game.input.onDown.addOnce(this.playOnce, this);
        MainGame.resizeGame();
        MainGame.fadeOut();
        this.layerCredits = this.layerMain.add(game.add.group());
        var plaha = this.layerCredits.add(game.add.image(400, 305, "ss_menu", "credits_panel_0000"));
        plaha.anchor.setTo(.5);
        var logo_tbs = this.layerCredits.add(game.add.image(400, 300, "ss_menu", "logo_tbs_0000"));
        logo_tbs.anchor.setTo(.5);
        var logo_phaser = this.layerCredits.add(game.add.image(400, 530, "ss_menu", "logo_phazer_0000"));
        logo_phaser.anchor.setTo(.5);
        var closeCredits = new SimpleButton(game,this,this.layerCredits,215,50,"ss_menu","btn_close_0000",this.clickCredits);
        this.btnClearProgress = new SimpleButton(game,this,this.layerMain,400,540,"ss_menu","btn_progress_0000",this.clearSaves,1,MainGame.GAME_TEXT.clear_progress);
        this.btnClearProgress.text1.fontSize = 22;
        this.btnClearProgress.text1.y = 3;
        this.btnClearProgress.text2.fontSize = 22;
        MainGame.addText(270, 400, 75 + 5, MainGame.GAME_TEXT.credits.toUpperCase(), this.layerCredits, 40, 10248197, .5, .5);
        MainGame.addText(270, 400, 75, MainGame.GAME_TEXT.credits.toUpperCase(), this.layerCredits, 40, 16710912, .5, .5);
        var sizeWhiteFont = 28;
        MainGame.addText(270, 400, 130, MainGame.GAME_TEXT.producer, this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        MainGame.addText(270, 400, 130 + 30, "Martijn Kunst", this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        MainGame.addText(270, 400, 220, MainGame.GAME_TEXT.developed_by, this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        MainGame.addText(270, 400, 400, MainGame.GAME_TEXT.music_by, this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        MainGame.addText(270, 400, 400 + 30, "Eric Matyas", this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        MainGame.addText(270, 400, 487, MainGame.GAME_TEXT.made_with, this.layerCredits, sizeWhiteFont, 16777215, .5, .5);
        this.layerCredits.visible = false;
        this.btnClearProgress.buttonC.visible = false;
        MainGame.addText(320, 560, 563, MainGame.version, this.layerCredits, 16, 16777215, 1, .5);
        this.layerConfirm = this.layerMain.add(game.add.group());
        var spr_bg = this.layerConfirm.add(this.game.add.graphics(400, 300));
        spr_bg.beginFill(1656488, .7);
        spr_bg.drawRect(-this.game.width * .5, -this.game.height * .5, this.game.width, this.game.height);
        spr_bg.endFill();
        this.spr_bg = spr_bg;
        var plaha = this.layerConfirm.add(game.add.image(400, 300, "ss_menu", "pause_panel_0000"));
        plaha.anchor.setTo(.5);
        var btnYes = new SimpleButton(game,this,this.layerConfirm,400 - 80,350,"ss_menu","btn_home3_0000",this.clickClearYes);
        var btnNo = new SimpleButton(game,this,this.layerConfirm,400 + 80,350,"ss_menu","btn_home4_0000",this.clickClearNo);
        MainGame.addText(320, 400, 250, MainGame.GAME_TEXT.clear_confirm, this.layerConfirm, 30, 16777215, .5, .5);
        this.layerConfirm.visible = false;
        this.updateResize();
        MainGame.loadSaves();
        this.initKeyboardEvents();
        if (MainGame.isAPI)
            MainGame.API_POKI.displayAd()
    },
    initKeyboardEvents: function() {
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keySpace.onDown.add(this.clickStart, this)
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.musicButton.x = posP_R - 60 - 90;
        this.sfxButton.x = posP_R - 60 - 90 - 90;
        this.btnCredits.buttonC.x = posP_R - 60;
        if (this.btnClearProgress)
            this.btnClearProgress.buttonC.x = posP_L + 100;
        if (this.spr_bg)
            this.spr_bg.width = game.width;
        this.btnLanguage.buttonC.x = posP_L + 60;
        this.backLang.x = posP_L + 60
    },
    openLanguage: function() {
        var posP_L = -((game.width - 800) * .5);
        this.btnLanguage.buttonC.visible = false;
        this.backLang.visible = false;
        this.panelLanguage.visible = true;
        this.panelLanguage.x = posP_L - 400;
        game.add.tween(this.panelLanguage).to({
            x: posP_L
        }, 400, "Back.easeOut").start()
    },
    closeLanguage: function() {
        game.add.tween(this.panelLanguage).to({
            x: -400
        }, 400, "Back.easeIn", true).onComplete.add(function() {
            MainGame.state.panelLanguage.visible = false
        });
        this.btnLanguage.buttonC.visible = true;
        this.backLang.visible = true
    },
    changeLangEN: function() {
        this.updateLanguage(0)
    },
    changeLangIT: function() {
        this.updateLanguage(1)
    },
    changeLangES: function() {
        this.updateLanguage(2)
    },
    changeLangPT: function() {
        this.updateLanguage(3)
    },
    changeLangTR: function() {
        this.updateLanguage(4)
    },
    changeLangDE: function() {
        this.updateLanguage(5)
    },
    changeLangBR: function() {
        this.updateLanguage(6)
    },
    changeLangRU: function() {
        this.updateLanguage(7)
    },
    changeLangFR: function() {
        this.updateLanguage(8)
    },
    changeLangNL: function() {
        this.updateLanguage(9)
    },
    updateLanguage: function(vPar) {
        MainGame.language = vPar;
        MainGame.saveSaves();
        MainGame.goToState("Menu")
    },
    playOnce: function() {
        if (!MainGame.firstGo)
            return;
        MainGame.firstGo = false;
        this.musicButton.frameName = "btn_music_0000";
        this.sfxButton.frameName = "btn_sound_0000";
        MainGame.playMusic(0)
    },
    clickL1: function() {
        MainGame.levelNum = 0;
        MainGame.goToState("Game")
    },
    clickL2: function() {
        MainGame.levelNum = 1;
        MainGame.goToState("Game")
    },
    clickL3: function() {
        MainGame.levelNum = 2;
        MainGame.goToState("Game")
    },
    clickL4: function() {
        MainGame.levelNum = 3;
        MainGame.goToState("Game")
    },
    clickL5: function() {
        MainGame.levelNum = 4;
        MainGame.goToState("Game")
    },
    clickL6: function() {
        MainGame.levelNum = 5;
        MainGame.goToState("Game")
    },
    clickL7: function() {
        MainGame.levelNum = 6;
        MainGame.goToState("Game")
    },
    clickL8: function() {
        MainGame.levelNum = 7;
        MainGame.goToState("Game")
    },
    clickL9: function() {
        MainGame.levelNum = 8;
        MainGame.goToState("Game")
    },
    clickL10: function() {
        MainGame.levelNum = 9;
        MainGame.goToState("Game")
    },
    clickL11: function() {
        MainGame.levelNum = 10;
        MainGame.goToState("Game")
    },
    clickL12: function() {
        MainGame.levelNum = 11;
        MainGame.goToState("Game")
    },
    clickL13: function() {
        MainGame.levelNum = 12;
        MainGame.goToState("Game")
    },
    clickBoat1: function() {
        MainGame.comicsNum = 0;
        MainGame.goToState("Comics")
    },
    clickBoat2: function() {
        MainGame.comicsNum = 1;
        MainGame.goToState("Comics")
    },
    clickBoat3: function() {
        MainGame.comicsNum = 2;
        MainGame.goToState("Comics")
    },
    clickBoat4: function() {
        MainGame.comicsNum = 3;
        MainGame.goToState("Comics")
    },
    clickFinal: function() {
        MainGame.goToState("ScreenFinal")
    },
    clickWater: function() {
        MainGame.isWater = !MainGame.isWater;
        MainGame.state.btnWater.text.setText("water: " + MainGame.isWater)
    },
    clickCredits: function() {
        if (this.layerCredits.visible) {
            game.add.tween(this.layerCredits).to({
                y: -550
            }, 400, "Back.easeIn", true).onComplete.add(function() {
                MainGame.state.layerCredits.visible = false
            });
            game.add.tween(this.btnClearProgress.buttonC).to({
                y: 650
            }, 400, "Back.easeIn", true).onComplete.add(function() {
                MainGame.state.btnClearProgress.buttonC.visible = false
            })
        } else {
            this.layerCredits.y = -550;
            this.layerCredits.visible = true;
            game.add.tween(this.layerCredits).to({
                y: 0
            }, 400, "Back.easeOut", true);
            this.btnClearProgress.buttonC.y = 650;
            this.btnClearProgress.buttonC.visible = true;
            game.add.tween(this.btnClearProgress.buttonC).to({
                y: 540
            }, 400, "Back.easeOut", true)
        }
    },
    clearSaves: function() {
        this.layerConfirm.visible = true
    },
    clickClearYes: function() {
        MainGame.clearSaves();
        this.layerConfirm.visible = false;
        this.clickCredits()
    },
    clickClearNo: function() {
        this.layerConfirm.visible = false
    },
    clickStart: function() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        if (MainGame.levelMax == 0) {
            MainGame.comicsNum = 0;
            MainGame.goToState("Comics")
        } else {
            MainGame.goToState("ScreenLevel")
        }
    }
};
MainGame.ScreenLevel = function(game) {}
;
MainGame.ScreenLevel.prototype = {
    create: function() {
        MainGame.state = this;
        MainGame.stateName = "ScreenLevel";
        var bg = game.add.image(400, 300, "bg_menu");
        bg.anchor.setTo(.5);
        this.layerMain = game.add.group();
        this.btnHome = new SimpleButton(game,this,this.layerMain,400 - 345,58,"ss_menu","btn_home_0000",this.clickHome);
        var coins = this.layerMain.add(game.add.image(400 - 75, 45, "ss_menu", "coins_0000"));
        coins.anchor.setTo(.5);
        var LEVELS_MAX = 13;
        this.scrollingMap = this.layerMain.add(game.add.tileSprite(0, 150, 800 / 2 + LEVELS_MAX * 340 + 120, 280, "transp"));
        this.scrollingMap.inputEnabled = true;
        this.scrollingMap.input.enableDrag(false);
        this.scrollingMap.input.allowVerticalDrag = false;
        this.scrollingMap.input.boundsRect = new Phaser.Rectangle(800 - this.scrollingMap.width,150,this.scrollingMap.width * 2 - 800,300);
        this.currentPage = 0;
        this.clickX = 0;
        this.currentPage = MainGame.levelNum = MainGame.levelMax;
        this.scrollingMap.x = this.currentPage * -340;
        for (var i = 0; i < 13; i++) {
            var iconMap = game.add.image(800 / 2 + i * 340, 140, "ss_menu", "l" + (i + 1) + "_0000");
            iconMap.anchor.set(.5);
            this.scrollingMap.addChild(iconMap);
            var iconHero = game.add.image(800 / 2 + i * 340, 55, "ss_menu", "heroic_empty_0000");
            iconHero.anchor.set(.5);
            this.scrollingMap.addChild(iconHero);
            if (MainGame.levelHard[i] == 1) {
                iconHero.frameName = "heroic_coin_0000"
            }
            if (i <= MainGame.levelMax) {
                var starts = MainGame.levelStars[i];
                if (starts == 1) {
                    var star1 = game.add.image(800 / 2 + i * 340 + 62, 220, "ss_menu", "empty_star_0000");
                    star1.anchor.set(.5);
                    star1.scale.set(.7);
                    this.scrollingMap.addChild(star1);
                    var star2 = game.add.image(800 / 2 + i * 340, 220, "ss_menu", "empty_star_0000");
                    star2.anchor.set(.5);
                    star2.scale.set(.7);
                    this.scrollingMap.addChild(star2);
                    var star3 = game.add.image(800 / 2 + i * 340 - 62, 220, "ss_menu", "star_0000");
                    star3.anchor.set(.5);
                    star3.scale.set(.7);
                    this.scrollingMap.addChild(star3)
                } else if (starts == 2) {
                    var star1 = game.add.image(800 / 2 + i * 340 + 62, 220, "ss_menu", "empty_star_0000");
                    star1.anchor.set(.5);
                    star1.scale.set(.7);
                    this.scrollingMap.addChild(star1);
                    var star2 = game.add.image(800 / 2 + i * 340, 220, "ss_menu", "star_0000");
                    star2.anchor.set(.5);
                    star2.scale.set(.7);
                    this.scrollingMap.addChild(star2);
                    var star3 = game.add.image(800 / 2 + i * 340 - 62, 220, "ss_menu", "star_0000");
                    star3.anchor.set(.5);
                    star3.scale.set(.7);
                    this.scrollingMap.addChild(star3)
                } else if (starts == 3) {
                    var star1 = game.add.image(800 / 2 + i * 340 + 62, 220, "ss_menu", "star_0000");
                    star1.anchor.set(.5);
                    star1.scale.set(.7);
                    this.scrollingMap.addChild(star1);
                    var star2 = game.add.image(800 / 2 + i * 340, 220, "ss_menu", "star_0000");
                    star2.anchor.set(.5);
                    star2.scale.set(.7);
                    this.scrollingMap.addChild(star2);
                    var star3 = game.add.image(800 / 2 + i * 340 - 62, 220, "ss_menu", "star_0000");
                    star3.anchor.set(.5);
                    star3.scale.set(.7);
                    this.scrollingMap.addChild(star3)
                }
            } else {
                var zamok = game.add.image(800 / 2 + i * 340, 220, "ss_menu", "close_0000");
                zamok.anchor.set(.5);
                this.scrollingMap.addChild(zamok)
            }
        }
        MainGame.addText(800, 375, 40 + 5, String(MainGame.coins), this.layerMain, 40, 10248197, 0, .5);
        MainGame.addText(800, 375, 40, String(MainGame.coins), this.layerMain, 40, 16710912, 0, .5);
        var titleLevel = MainGame.GAME_TEXT["level_nameRW1_" + Number(MainGame.levelNum + 1)];
        this.textLevel = MainGame.addText(320, 400, 439, titleLevel, this.layerMain, 26, 16777215, .5, .5);
        for (var i = 0; i < 13; i++) {
            var fish = MainGame.addText(800, 800 / 2 + i * 340, -18, i + 1, this.layerMain, 38, 16777215, .5, .5);
            this.scrollingMap.addChild(fish)
        }
        this.scrollingMap.events.onDragStart.add(function() {
            this.scrollingMap.startPosition = this.scrollingMap.x
        }, this);
        this.scrollingMap.events.onDragStop.add(function() {
            if (Math.abs(this.clickX - game.input.worldX) < 10)
                return;
            var page = Math.round(-this.scrollingMap.x / 340);
            if (page <= 0)
                page = 0;
            this.changePage(page)
        }, this);
        this.scrollingMap.events.onInputDown.add(this.onDownScrollMap, this);
        this.scrollingMap.events.onInputUp.add(this.onUpScrollMap, this);
        this.btnSelect = new SimpleButton(game,this,this.layerMain,400,525,"ss_menu","btn_play2_0000",this.clickStart);
        this.btnHard = new SimpleButton(game,this,this.layerMain,400 + 180,525,"ss_menu","btn_heroic_0000",this.clickStartHard);
        this.changePage(this.currentPage);
        MainGame.resizeGame();
        MainGame.fadeOut();
        this.updateResize();
        MainGame.playMusic(0);
        this.initKeyboardEvents();
        MainGame.isHardMode = false;
        if (MainGame.isAPI)
            MainGame.API_POKI.destroyAd()
    },
    initKeyboardEvents: function() {
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keySpace.onDown.add(this.clickStart, this);
        this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyRight.onDown.add(this.scrollMapRight, this);
        this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyLeft.onDown.add(this.scrollMapLeft, this)
    },
    scrollMapRight: function() {
        if (this.currentPage < MainGame.MAX_LEVELS)
            this.changePage(this.currentPage + 1)
    },
    scrollMapLeft: function() {
        if (this.currentPage > 0)
            this.changePage(this.currentPage - 1)
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.btnHome.buttonC.x = posP_L + 60
    },
    onDownScrollMap: function() {
        this.clickX = game.input.worldX
    },
    onUpScrollMap: function() {
        if (Math.abs(this.clickX - game.input.worldX) > 10)
            return;
        if (game.input.worldX > 400 + 180) {
            if (this.currentPage < MainGame.MAX_LEVELS)
                this.changePage(this.currentPage + 1);
            this.isClicked = true
        } else if (game.input.worldX < 400 - 180) {
            if (this.currentPage > 0)
                this.changePage(this.currentPage - 1);
            this.isClicked = true
        }
    },
    addLevel: function() {
        var coins = this.layerMain.add(game.add.image(400 - 75, 45, "ss_menu", "coins_0000"));
        coins.anchor.setTo(.5)
    },
    changePage: function(page) {
        this.currentPage = page;
        var titleLevel = MainGame.GAME_TEXT["level_nameRW1_" + Number(this.currentPage + 1)];
        this.textLevel.setText(titleLevel);
        var tween = game.add.tween(this.scrollingMap).to({
            x: this.currentPage * -340
        }, 250, Phaser.Easing.Cubic.Out, true);
        if (this.currentPage > MainGame.levelMax) {
            this.btnSelect.buttonC.alpha = .55
        } else {
            this.btnSelect.buttonC.alpha = 1
        }
        if (MainGame.levelStars[this.currentPage] > 0) {
            this.btnHard.buttonC.visible = true
        } else {
            this.btnHard.buttonC.visible = false
        }
    },
    clickStart: function() {
        MainGame.isHardMode = false;
        if (this.currentPage > MainGame.levelMax)
            return;
        MainGame.levelNum = this.currentPage;
        if (MainGame.levelNum == 0) {
            MainGame.comicsNum = 0;
            MainGame.goToState("Comics")
        } else if (MainGame.levelNum == 12) {
            MainGame.comicsNum = 2;
            MainGame.goToState("Comics")
        } else {
            MainGame.goToState("ScreenShop")
        }
    },
    clickStartHard: function() {
        this.clickStart();
        MainGame.isHardMode = true
    },
    clickHome: function() {
        MainGame.goToState("Menu")
    }
};
MainGame.ScreenShop = function(game) {}
;
MainGame.ScreenShop.prototype = {
    create: function() {
        MainGame.state = this;
        MainGame.stateName = "ScreenShop";
        var tileSky = game.add.image(-10, 300, "ss_back", "sky2_0000");
        tileSky.anchor.setTo(0, .5);
        tileSky.fixedToCamera = true;
        tileSky.width = game.width * 1.1;
        tileSky.height = game.height * 1.1;
        this.tileSky = tileSky;
        this.layerBack = game.add.group();
        this.layerBack3 = this.layerBack.add(game.add.group());
        this.layerBack2 = this.layerBack.add(game.add.group());
        this.layerBack1 = this.layerBack.add(game.add.group());
        this.layerBoat = game.add.group();
        this.layerEffect = game.add.group();
        this.layerWater = game.add.group();
        this.layerMain = game.add.group();
        this.layerTop = game.add.group();
        this.layerPopup = game.add.group();
        this.layerPopup.fixedToCamera = true;
        MainGame.loadSaves();
        this.btnHome = new SimpleButton(game,this,this.layerMain,400 - 345,58,"ss_menu","btn_home_0000",this.clickHome);
        var coins = this.layerMain.add(game.add.image(400 - 75, 45, "ss_menu", "coins_0000"));
        coins.anchor.setTo(.5);
        var plaha = this.layerTop.add(game.add.image(400 + 240, 265, "ss_menu", "upgrade_panel_0000"));
        plaha.anchor.setTo(.5);
        var wBtn2 = this.layerTop.add(game.add.image(640 - 65, 140, "ss_menu", "btn_gun_0000"));
        wBtn2.anchor.setTo(.5);
        var icon2t = this.layerTop.add(game.add.image(wBtn2.x - 3, wBtn2.y + 4, "ss_menu", "grenade_t_0000"));
        icon2t.anchor.setTo(.5);
        var icon2n = this.layerTop.add(game.add.image(wBtn2.x, wBtn2.y, "ss_menu", "grenade_n_0000"));
        icon2n.anchor.setTo(.5);
        var wBtn3 = this.layerTop.add(game.add.image(640 + 65, 140, "ss_menu", "btn_gun_0000"));
        wBtn3.anchor.setTo(.5);
        var icon3t = this.layerTop.add(game.add.image(wBtn3.x - 3, wBtn3.y + 4, "ss_menu", "rocket_t_0000"));
        icon3t.anchor.setTo(.5);
        var icon3n = this.layerTop.add(game.add.image(wBtn3.x, wBtn3.y, "ss_menu", "rocket_n_0000"));
        icon3n.anchor.setTo(.5);
        var im1 = this.layerTop.add(game.add.image(wBtn2.x + 30, wBtn2.y + 35, "ss_menu", "ammo_shop1_0000"));
        im1.anchor.setTo(.5);
        var im2 = this.layerTop.add(game.add.image(wBtn3.x + 30, wBtn3.y + 35, "ss_menu", "ammo_shop2_0000"));
        im2.anchor.setTo(.5);
        var wBtnBoat = this.layerTop.add(game.add.image(640, 320, "ss_menu", "btn_shop2_0000"));
        wBtnBoat.anchor.setTo(.5);
        var icon3t = this.layerTop.add(game.add.image(wBtnBoat.x - 3 + 3, wBtnBoat.y + 4 - 2, "ss_menu", "boatshop1_0000"));
        icon3t.anchor.setTo(.5);
        this.boatIcon = icon3t;
        this.btnUpgrade = new SimpleButton(game,this,this.layerTop,wBtnBoat.x,wBtnBoat.y + 92,"ss_menu","coin_panel2_0000",this.upgradeBoat,1,MainGame.priceBoat[0],-12,-5,false,28,0,.5);
        this.coinBtnUpgrade = this.btnUpgrade.buttonC.add(game.add.image(-50, -17, "ss_menu", "coin1_0000"));
        this.btnBuyGranat = new SimpleButton(game,this,this.layerTop,wBtn2.x,wBtn2.y + 82,"ss_menu","coin_panel_0000",this.buyGranat,1,MainGame.priceGranat,-12,-5,false,28,0,.5);
        this.coinBtnBuyGranat = this.btnBuyGranat.buttonC.add(game.add.image(-50, -17, "ss_menu", "coin1_0000"));
        this.btnBuyRocket = new SimpleButton(game,this,this.layerTop,wBtn3.x,wBtn3.y + 82,"ss_menu","coin_panel_0000",this.buyRocket,1,MainGame.priceRocket,-12,-5,false,28,0,.5);
        this.coinBtnBuyRocket = this.btnBuyRocket.buttonC.add(game.add.image(-50, -17, "ss_menu", "coin1_0000"));
        this.btnReward = new SimpleButton(game,this,this.layerTop,400,520 - 7,"ss_menu","btn_bonus_0000",MainGame.clickReward,1);
        MainGame.setReward(this.btnReward.buttonC, 0, 0, true);
        this.btnReward.buttonC.visible = false;
        if (MainGame.isAPI) {
            if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock) {
                this.btnReward.buttonC.alpha = .7
            }
        } else {
            if (!MainGame.isDebug)
                this.btnReward.buttonC.alpha = .7
        }
        this.initBackground();
        var wave;
        for (var i = 0; i < 12; i++) {
            wave = this.layerEffect.add(game.add.sprite(-400 + 300 * i, 455, "ss_main2"));
            wave.animations.add("waving", Phaser.Animation.generateFrameNames("wave2_", 0, 69, "", 4), 30);
            wave.animations.play("waving", 30, true);
            wave.scale.setTo(1.001, 1)
        }
        var w;
        for (var i = 0; i < 5; i++) {
            w = this.layerWater.add(game.add.image(-400 + 800 * i, 600 + 1, "ss_main2", "water1_0000"));
            w.anchor.setTo(0, 1);
            w.scale.setTo(1.01, 1)
        }
        this.btnGo = new SimpleButton(game,this,this.layerTop,400 + 240,520,"ss_menu","btn_play_0000",this.clickGo);
        this.initBoat();
        this.textGranat = MainGame.addText(800, wBtn2.x + 30, wBtn2.y + 34, String(MainGame.countGranat) + "/3", this.layerTop, 22, 16777215, .5, .5);
        this.textRocket = MainGame.addText(800, wBtn3.x + 30, wBtn3.y + 34, String(MainGame.countRocket) + "/3", this.layerTop, 22, 16777215, .5, .5);
        this.coinText1 = MainGame.addText(800, 375, 40 + 5, String(MainGame.coins), this.layerMain, 40, 10248197, 0, .5);
        this.coinText2 = MainGame.addText(800, 375, 40, String(MainGame.coins), this.layerMain, 40, 16710912, 0, .5);
        MainGame.addText(200, 400 + 240, 38 + 5, MainGame.GAME_TEXT.upgrades.toUpperCase(), this.layerTop, 44, 9330034, .5, .5);
        MainGame.addText(200, 400 + 240, 38, MainGame.GAME_TEXT.upgrades.toUpperCase(), this.layerTop, 44, 16777215, .5, .5);
        MainGame.resizeGame();
        MainGame.fadeOut();
        this.updateResize();
        this.checkBtns();
        this.initKeyboardEvents();
        if (MainGame.isAPI)
            MainGame.API_POKI.destroyAd()
    },
    initKeyboardEvents: function() {
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keySpace.onDown.add(this.clickGo, this)
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.btnHome.buttonC.x = posP_L + 60;
        this.layerTop.x = posP_R - 800;
        this.tileSky.width = game.width * 1.1
    },
    upgradeBoat: function() {
        if (MainGame.typeBoat < 4 && MainGame.coins >= MainGame.priceBoat[MainGame.typeBoat - 1]) {
            MainGame.coins -= MainGame.priceBoat[MainGame.typeBoat - 1];
            this.coinText1.setText(String(MainGame.coins));
            this.coinText2.setText(String(MainGame.coins));
            MainGame.typeBoat++;
            this.updateBoat();
            this.checkBtns();
            MainGame.playSound(2);
            var happyValue = MainGame.typeBoat / 10;
            if (MainGame.isAPI)
                MainGame.API_POKI.happyTime(happyValue)
        }
    },
    buyGranat: function() {
        if (MainGame.countGranat < 3 && MainGame.coins >= MainGame.priceGranat) {
            MainGame.coins -= MainGame.priceGranat;
            this.coinText1.setText(String(MainGame.coins));
            this.coinText2.setText(String(MainGame.coins));
            MainGame.countGranat++;
            this.textGranat.setText(String(MainGame.countGranat) + "/3");
            this.checkBtns();
            MainGame.playSound(2)
        }
    },
    buyRocket: function() {
        if (MainGame.countRocket < 3 && MainGame.coins >= MainGame.priceRocket) {
            MainGame.coins -= MainGame.priceRocket;
            this.coinText1.setText(String(MainGame.coins));
            this.coinText2.setText(String(MainGame.coins));
            MainGame.countRocket++;
            this.textRocket.setText(String(MainGame.countRocket) + "/3");
            this.checkBtns();
            MainGame.playSound(2)
        }
    },
    checkBtns: function() {
        var textMax = MainGame.GAME_TEXT.max.toUpperCase();
        if (MainGame.typeBoat == 4) {
            this.coinBtnUpgrade.visible = false;
            this.btnUpgrade.text1.setText(textMax);
            this.btnUpgrade.text1.anchor.x = .5;
            this.btnUpgrade.text1.x = 0;
            this.btnUpgrade.text2.setText(textMax);
            this.btnUpgrade.text2.anchor.x = .5;
            this.btnUpgrade.text2.x = 0
        } else {
            this.btnUpgrade.text1.setText(MainGame.priceBoat[MainGame.typeBoat - 1]);
            this.btnUpgrade.text2.setText(MainGame.priceBoat[MainGame.typeBoat - 1])
        }
        if (MainGame.countGranat == 3) {
            this.coinBtnBuyGranat.visible = false;
            this.btnBuyGranat.text1.setText(textMax);
            this.btnBuyGranat.text1.anchor.x = .5;
            this.btnBuyGranat.text1.x = 0;
            this.btnBuyGranat.text2.setText(textMax);
            this.btnBuyGranat.text2.anchor.x = .5;
            this.btnBuyGranat.text2.x = 0
        }
        if (MainGame.countRocket == 3) {
            this.coinBtnBuyRocket.visible = false;
            this.btnBuyRocket.text1.setText(textMax);
            this.btnBuyRocket.text1.anchor.x = .5;
            this.btnBuyRocket.text1.x = 0;
            this.btnBuyRocket.text2.setText(textMax);
            this.btnBuyRocket.text2.anchor.x = .5;
            this.btnBuyRocket.text2.x = 0
        }
        MainGame.updateTextsButton(this.btnUpgrade);
        MainGame.updateTextsButton(this.btnBuyGranat);
        MainGame.updateTextsButton(this.btnBuyRocket);
        MainGame.saveSaves(0);
        if (MainGame.coins < MainGame.LOW_COINS && MainGame.allowReward) {
            this.btnReward.buttonC.visible = true
        }
    },
    initBoat: function() {
        this.waveAr = [];
        this.hero1 = this.addHero(this.layerBoat, "sman", 0, 0);
        this.hero2 = this.addHero(this.layerBoat, "simon", 0, 0);
        this.hero3 = this.addHero(this.layerBoat, "dkid", 0, 0);
        this.dog = this.addHero(this.layerBoat, "dog", 0, 0);
        game.time.events.add(50, this.hideElemetns, this, true).autoDestroy = true;
        var barrel = this.layerBoat.add(game.add.image(0, 0, "ss_main1", "boat1_0000"));
        barrel.anchor.setTo(.5);
        barrel.startY = barrel.y;
        this.waveAr.push(barrel);
        this.barrel = barrel;
        var flag = this.layerBoat.add(game.add.sprite(19, 225, "ss_main1"));
        flag.animations.add("flag", Phaser.Animation.generateFrameNames("flag_", 0, 20, "", 4), 30);
        flag.animations.play("flag", 30, true);
        flag.startY = 225;
        this.waveAr.push(flag);
        this.flag = flag;
        this.waveCount = 0;
        this.waveArCount = this.waveAr.length;
        this.hero1.visible = false;
        this.hero2.visible = false;
        this.hero3.visible = false;
        this.dog.visible = false;
        this.flag.visible = false;
        this.updateBoat()
    },
    updateBoat: function() {
        var boatPosX = 170;
        var boatPosY = 465;
        var hero1PosX = 240;
        var hero1PosY = 464;
        var hero2PosX = 100;
        var hero2PosY = 464;
        var hero3PosX = 0;
        var hero3PosY = 0;
        this.hero1.visible = false;
        this.hero2.visible = false;
        this.hero3.visible = false;
        this.dog.visible = false;
        this.flag.visible = false;
        switch (MainGame.typeBoat) {
        case 1:
            this.hero1.visible = true;
            this.hero2.visible = true;
            this.hero3.visible = false;
            this.dog.visible = false;
            this.flag.visible = false;
            break;
        case 2:
            boatPosX = 215;
            boatPosY = 475;
            hero1PosX = 320;
            hero1PosY = 461;
            hero2PosX = 195;
            hero2PosY = 461;
            hero3PosX = 100;
            hero3PosY = 461;
            this.hero1.visible = true;
            this.hero2.visible = true;
            this.hero3.visible = false;
            this.dog.visible = true;
            this.flag.visible = false;
            break;
        case 3:
            boatPosX = 270;
            boatPosY = 440;
            hero1PosX = 390;
            hero1PosY = 434 - 8;
            hero2PosX = 265;
            hero2PosY = 434;
            hero3PosX = 140;
            hero3PosY = 434 - 3;
            this.hero1.visible = true;
            this.hero2.visible = true;
            this.hero3.visible = true;
            this.dog.visible = false;
            this.flag.visible = false;
            break;
        case 4:
            var dfY = 20;
            boatPosX = 300 - dfY;
            boatPosY = 370;
            hero1PosX = 460 - dfY;
            hero1PosY = 420 + 9;
            hero2PosX = 180 - dfY;
            hero2PosY = 365 + 6;
            hero3PosX = 360 - dfY;
            hero3PosY = 425 + 9;
            this.hero1.visible = true;
            this.hero2.visible = true;
            this.hero3.visible = true;
            this.dog.visible = false;
            this.flag.visible = true;
            break
        }
        this.hero1.x = hero1PosX;
        this.hero1.y = hero1PosY;
        this.hero1.startY = hero1PosY;
        this.hero2.x = hero2PosX;
        this.hero2.y = hero2PosY;
        this.hero2.startY = hero2PosY;
        this.hero3.x = hero3PosX;
        this.hero3.y = hero3PosY;
        this.hero3.startY = hero3PosY;
        this.dog.x = hero3PosX;
        this.dog.y = hero3PosY;
        this.dog.startY = hero3PosY;
        this.barrel.frameName = "boat" + MainGame.typeBoat + "_0000";
        this.barrel.x = boatPosX;
        this.barrel.y = boatPosY;
        this.barrel.startY = boatPosY;
        this.boatIcon.frameName = "boatshop" + MainGame.typeBoat + "_0000"
    },
    addHero: function(vLayer, vSkin, vX, vY) {
        var obj;
        if (vSkin != "dog") {
            obj = vLayer.add(game.add.spine(vX, vY, "pers"));
            obj.setSkinByName(vSkin);
            obj.setAnimationByName(0, "idle", true);
            obj.setToSetupPose();
            obj.state.tracks[0].time = MyMath.getRandomInt(1, 7)
        } else {
            obj = vLayer.add(game.add.sprite(vX, vY, "ss_main1"));
            obj.anchor.setTo(.5, .97);
            obj.animations.add("idle", Phaser.Animation.generateFrameNames("dog_idle_", 0, 9, "", 4), 30);
            obj.animations.add("walk", Phaser.Animation.generateFrameNames("dog_walk_", 0, 14, "", 4), 30);
            obj.animations.add("kick", Phaser.Animation.generateFrameNames("dog_kick_", 0, 14, "", 4), 30);
            obj.animations.play("idle", 30, true)
        }
        obj.startY = vY;
        this.waveAr.push(obj);
        return obj
    },
    hideElemetns: function() {
        this.hero1.skeleton.findSlot("hat").currentSprite.visible = false;
        this.hero1.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        this.hero2.skeleton.findSlot("hat").currentSprite.visible = false;
        this.hero2.skeleton.findSlot("sheildbig").currentSprite.visible = false;
        this.hero3.skeleton.findSlot("hat").currentSprite.visible = false;
        this.hero3.skeleton.findSlot("sheildbig").currentSprite.visible = false
    },
    initBackground: function() {
        this.addObject(275, 82, this.layerBack3, "cloud0", 2);
        this.addObject(1045, 80, this.layerBack3, "cloud0", 2);
        this.addObject(160, 95, this.layerBack3, "cloud0", 1);
        this.addObject(557, 45, this.layerBack3, "cloud0", 3);
        this.addObject(316, 376, this.layerBack3, "ground3_", 1);
        this.addObject(570, 316, this.layerBack3, "ground3_", 1);
        this.addObject(932, 342, this.layerBack2, "ground2_", 3);
        this.addObject(716, 300, this.layerBack2, "ground2_", 1);
        this.addObject(1220, 320, this.layerBack2, "ground2_", 1);
        this.addObject(456, 332, this.layerBack2, "ground2_", 2);
        var palm1 = this.addObject(600, 180, this.layerBack1, "palm", 1);
        palm1.scale.x = -1;
        palm1.angle = -13;
        this.addObject(1364, 200, this.layerBack1, "palm", 1);
        this.addObject(840, 396, this.layerBack1, "ground1_", 2);
        this.addObject(1710, 380, this.layerBack1, "ground1_", 2);
        this.addObject(1480, 357, this.layerBack1, "ground1_", 1);
        this.addObject(1130, 417, this.layerBack1, "ground1_", 2);
        this.addObject(224, 406, this.layerBack1, "ground1_", 1);
        this.addObject(412, 380, this.layerBack1, "ground1_", 2);
        this.addObject(50, 440, this.layerBack1, "ground1_", 3)
    },
    addObject: function(vX, vY, vLayer, vName, vType) {
        return vLayer.add(game.add.image(vX, vY, "ss_back", vName + vType + "_0000"))
    },
    update: function() {
        this.waveCount += .06;
        for (var i = 0; i < this.waveArCount; i++) {
            this.waveAr[i].y = this.waveAr[i].startY + Math.sin(this.waveCount) * 2.6
        }
    },
    clickHome: function() {
        MainGame.goToState("Menu")
    },
    clickGo: function() {
        MainGame.goToState("Game")
    }
};
MainGame.Comics = function(game) {}
;
MainGame.Comics.prototype = {
    create: function() {
        MainGame.state = this;
        MainGame.stateName = "Comics";
        game.stage.backgroundColor = "#000000";
        this.layerComics = game.add.group();
        this.layerBlack = game.add.group();
        this.layerBtns = game.add.group();
        this.layerComics.x = MainGame.midX;
        this.initComics();
        MainGame.addFill(this.layerBlack, 0, 1, 300, 600, -550, 0);
        MainGame.addFill(this.layerBlack, 0, 1, 300, 600, 1050, 0);
        game.input.onDown.add(this.updateComics, this);
        MainGame.resizeGame();
        if (MainGame.isAPI)
            MainGame.API_POKI.destroyAd()
    },
    initComics: function() {
        this.layerBtns.removeAll();
        MainGame.fadeOut();
        this.stepAction = 0;
        if (game.width > 1300) {
            this.halfWG = Math.floor(1300 * .5)
        } else {
            this.halfWG = Math.floor(game.width * .5)
        }
        var dxBoat = Math.floor(this.halfWG * .5);
        this.dxBoat = dxBoat;
        var sdvigX = 325 - this.halfWG;
        switch (MainGame.comicsNum) {
        case 0:
            this.back1 = this.addGraphic("cbox1", sdvigX + 50, 0);
            MainGame.addFill(this.layerComics, 0, 1, 400, 300, 100, 0);
            this.back2 = this.addGraphic("cbox2", 275 + 100, 0);
            this.back3 = this.addGraphic("cbox2", sdvigX - 50, 300);
            MainGame.addFill(this.layerComics, 0, 1, 400, 300, -100, 300);
            this.back4 = this.addGraphic("cbox1", 275, 300);
            this.anim1_1 = this.addAnim("csdig", 22, -dxBoat, 94);
            this.grap2_1 = this.addGraphic("lopatka2", dxBoat + 50, 74);
            this.anim2_1 = this.addAnim("cflash", 19, dxBoat + 50, 130);
            this.grap3_1 = this.addGraphic("lopatka3", -dxBoat - 50, 300 + 74);
            this.anim3_1 = this.addAnim("cflash", 19, -dxBoat - 50, 300 + 130);
            this.grap3_2 = this.addGraphic("cgold2", -dxBoat - 120, 506);
            this.grap3_3 = this.addGraphic("cgold1", -dxBoat + 55, 518);
            this.grap4_1 = this.addGraphic("csrich", dxBoat - 10, 394);
            this.grap4_2 = this.addGraphic("cseyes", dxBoat - 14 - 10, 434);
            this.anim4_1 = this.addAnim("cflash", 19, dxBoat - 10 + 2, 490 - 48);
            this.anim4_1.scale.setTo(.75);
            game.add.tween(this.grap4_2).to({
                x: "-13"
            }, 700, "Quart.easeInOut", true, 0, -1, true);
            this.dialog1_1 = this.addGraphic("cmsg6", -dxBoat + 50, 0);
            this.dialog1_2 = this.addGraphic("cmsg7", -dxBoat + 50, 230, true);
            this.dialog2_1 = this.addGraphic("cmsg4", dxBoat + 50, 255, true);
            this.dialog3_1 = this.addGraphic("cmsg8", -dxBoat - 50, 556, true);
            this.dialog4_1 = this.addGraphic("cmsg5", dxBoat + 10, 344);
            this.addDialog(this.dialog1_1, MainGame.GAME_TEXT.comicsRW1_0_text1);
            this.addDialog(this.dialog1_2, MainGame.GAME_TEXT.comicsRW1_0_text2);
            this.addDialog(this.dialog2_1, MainGame.GAME_TEXT.comicsRW1_0_text3);
            this.addDialog(this.dialog3_1, MainGame.GAME_TEXT.comicsRW1_0_text4);
            this.addDialog(this.dialog4_1, MainGame.GAME_TEXT.comicsRW1_0_text5, 6);
            this.back1.alpha = 1;
            this.anim1_1.alpha = 1;
            this.checkStep = this.checkStep1;
            break;
        case 1:
            this.back3_1 = this.addGraphic("cbox12_1", 0, 365);
            this.back1 = this.addGraphic("cbox5", -325, 0);
            this.back2_1 = this.addGraphic("cbox6_1", 325, 0);
            this.grap1_1 = this.addGraphic("cnews", -dxBoat, 51);
            this.anim1_1 = this.addAnim("cflash", 19, -dxBoat + 60, 255 - 50);
            this.anim1_1.scale.setTo(.75);
            this.grap2_1 = this.addGraphic("cpirate", this.halfWG - 140, 0);
            this.grap3_1 = this.addGraphic("cssonboat", -150, 418);
            this.water1 = this.addGraphic("cbox12_2", 0, 600);
            this.water1.anchor.setTo(.5, 1);
            this.water2 = this.addGraphic("cbox6_2", 325, 400);
            this.water2.anchor.setTo(.5, 1);
            game.add.tween(this.grap2_1).to({
                y: "+4"
            }, 1400, "Sine.easeInOut", true, 0, -1, true);
            game.add.tween(this.grap3_1).to({
                y: "+5"
            }, 800, "Sine.easeInOut", true, 0, -1, true);
            this.dialog1_1 = this.addGraphic("cmsg1", -dxBoat, 0);
            this.dialog2_1 = this.addGraphic("cmsg2", this.halfWG - 240, 100);
            this.dialog3_1 = this.addGraphic("cmsg1", dxBoat - 2, 400);
            this.addDialog(this.dialog1_1, MainGame.GAME_TEXT.comicsRW1_1_text1);
            this.addDialog(this.dialog2_1, MainGame.GAME_TEXT.comicsRW1_1_text2, 7);
            this.addDialog(this.dialog3_1, MainGame.GAME_TEXT.comicsRW1_1_text3);
            this.back1.alpha = 1;
            this.showDialog(this.dialog1_1);
            this.checkStep = this.checkStep2;
            break;
        case 2:
            this.back1 = this.addGraphic("cbox8", 0, 0);
            this.back2 = this.addGraphic("cbox10", sdvigX, 300);
            MainGame.addFill(this.layerComics, 0, 1, 400, 300, 0, 300);
            this.back3 = this.addGraphic("cbox10", 325, 300);
            this.grap1_1 = this.addGraphic("cwoman1", -50, 112);
            this.grap1_2 = this.addGraphic("cman1", -50 + 110, 100);
            this.anim1_1 = this.addAnim("csrun", 27, 160, 136);
            this.anim2_1 = this.addAnim("cwoman2", 29, sdvigX + 10 - 200, 454);
            this.anim2_2 = this.addAnim("cman2", 29, sdvigX + 120 - 200, 454);
            this.anim2_3 = this.addAnim("cshappy", 17, sdvigX + 68 - 200, 470);
            this.anim3_1 = this.addAnim("cwoman2", 29, 10 + 130, 454);
            this.anim3_2 = this.addAnim("cman2", 29, 120 + 130, 454);
            game.time.events.loop(1e3, this.sinhronAnim, this);
            this.anim3_4 = this.addGraphic("cwoman3", 10 + 130 + 50, 454);
            this.anim3_5 = this.addGraphic("cman3", 120 + 130 + 50, 454);
            this.anim3_3 = this.addAnim("csfly", 19, 68 + 130, 440);
            this.sinhronAnim();
            this.anim3_1.animations.currentAnim.stop();
            this.anim3_1.animations.currentAnim.frame = 0;
            this.anim3_2.animations.currentAnim.stop();
            this.anim3_2.animations.currentAnim.frame = 0;
            this.dialog1_1 = this.addGraphic("cmsg5", 560 - 330, 78);
            this.dialog1_2 = this.addGraphic("cmsg5", 350 - 330, 58);
            this.dialog2_1 = this.addGraphic("cmsg1", -dxBoat, 300);
            this.dialog2_2 = this.addGraphic("cmsg4", -dxBoat, 556, true);
            this.dialog3_1 = this.addGraphic("cmsg2", 460 - 240, 394);
            this.addDialog(this.dialog1_1, MainGame.GAME_TEXT.comicsRW1_2_text1, 7);
            this.addDialog(this.dialog1_2, MainGame.GAME_TEXT.comicsRW1_2_text2, 7);
            this.addDialog(this.dialog2_1, MainGame.GAME_TEXT.comicsRW1_2_text3);
            this.addDialog(this.dialog2_2, MainGame.GAME_TEXT.comicsRW1_2_text4);
            this.addDialog(this.dialog3_1, MainGame.GAME_TEXT.comicsRW1_2_text5, 7);
            this.back1.alpha = 1;
            this.grap1_1.alpha = 1;
            this.grap1_2.alpha = 1;
            this.anim1_1.alpha = 1;
            this.anim1_1.x = 800;
            this.anim1_1.y = 180;
            game.add.tween(this.anim1_1).to({
                x: 160,
                y: 136
            }, 2e3, "Linear", true);
            game.time.events.add(2e3, this.checkTimer, this, true, 0).autoDestroy = true;
            this.checkStep = this.checkStep3;
            break;
        case 3:
            this.back1_1 = this.addGraphic("cbox11_1", 0, 0);
            this.back2_1 = this.addGraphic("cbox12_1", 0, 360);
            this.anim1_1 = this.addAnim("csfly", 19, 850, 50);
            this.anim1_2 = this.addAnim("csswim", 22, 220, 206);
            this.grap2_1 = this.addGraphic("c_boat0", -190, 418 + 13);
            game.add.tween(this.grap2_1).to({
                y: "+5"
            }, 800, "Sine.easeInOut", true, 0, -1, true);
            this.dialog2_1 = this.addGraphic("cmsg3", 150, 362);
            this.addDialog(this.dialog2_1, MainGame.GAME_TEXT.comicsRW1_4_text1);
            game.add.tween(this.anim1_1).to({
                x: -200
            }, 2400, "Sine.easeOut", true);
            var tweenA = game.add.tween(this.anim1_1).to({
                y: 50
            }, 450, "Quad.easeOut");
            var tweenB = game.add.tween(this.anim1_1).to({
                y: 100
            }, 450, "Quad.easeIn");
            var tweenC = game.add.tween(this.anim1_1).to({
                y: 40
            }, 450, "Quad.easeOut");
            var tweenD = game.add.tween(this.anim1_1).to({
                y: 140
            }, 450, "Quad.easeIn");
            var tweenE = game.add.tween(this.anim1_1).to({
                y: 200
            }, 300, "Back.easeOut");
            var tweenF = game.add.tween(this.anim1_1).to({
                x: -800
            }, 3e3, "Linear");
            tweenA.chain(tweenB);
            tweenB.chain(tweenC);
            tweenC.chain(tweenD);
            tweenD.chain(tweenE);
            tweenE.chain(tweenF);
            tweenA.start();
            game.time.events.add(1800, this.checkTimer, this, true, 3).autoDestroy = true;
            game.time.events.add(2400, this.checkTimer, this, true, 4).autoDestroy = true;
            this.back1_2 = this.addGraphic("cbox11_2", 0, 360);
            this.back1_2.anchor.setTo(.5, 1);
            this.back2_2 = this.addGraphic("cbox12_2", 0, 600);
            this.back2_2.anchor.setTo(.5, 1);
            this.anim1_3 = this.addAnim("e2", 16, -200, 200);
            this.anim1_3.animations.currentAnim.stop();
            this.anim1_3.animations.currentAnim.frame = 0;
            this.back1_1.alpha = 1;
            this.back1_2.alpha = 1;
            this.anim1_1.alpha = 1;
            this.checkStep = this.checkStep4;
            break
        }
        var btn_skip1 = this.layerBtns.add(game.add.image(772, 30, "ss_menu", "btn_skip1_0000"));
        btn_skip1.anchor.setTo(.5);
        var txtTap1 = MainGame.addText(260, 785, 570 + 3, MainGame.GAME_TEXT.tap_to_continue.toUpperCase(), this.layerBtns, 24, 9330034, 1, .5);
        var txtTap2 = MainGame.addText(260, 785, 570, MainGame.GAME_TEXT.tap_to_continue.toUpperCase(), this.layerBtns, 24, 16777215, 1, .5);
        this.updateResize()
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.layerBtns.x = posP_R - 800
    },
    checkStep1: function() {
        switch (this.stepAction) {
        case 1:
            this.showDialog(this.dialog1_1);
            break;
        case 2:
            this.showDialog(this.dialog1_2);
            break;
        case 3:
            this.showObject(this.back2);
            this.showObject(this.grap2_1);
            this.grap2_1.y += 80;
            game.add.tween(this.grap2_1).to({
                y: "-80"
            }, 400, "Linear", true);
            break;
        case 4:
            this.showObject(this.anim2_1);
            this.showDialog(this.dialog2_1);
            break;
        case 5:
            this.showObject(this.back3);
            this.showObject(this.grap3_2);
            this.showObject(this.grap3_3);
            break;
        case 6:
            this.showObject(this.grap3_1);
            this.grap3_1.y += 80;
            game.add.tween(this.grap3_1).to({
                y: "-80"
            }, 400, "Linear", true);
            this.showObject(this.anim3_1);
            this.showDialog(this.dialog3_1);
            break;
        case 7:
            this.showObject(this.back4);
            this.showObject(this.grap4_1);
            this.showObject(this.grap4_2);
            this.showObject(this.anim4_1);
            break;
        case 8:
            this.showDialog(this.dialog4_1);
            break;
        case 9:
            this.layerComics.removeAll();
            MainGame.comicsNum = 1;
            this.initComics();
            break
        }
    },
    checkStep2: function() {
        switch (this.stepAction) {
        case 1:
            this.showObject(this.grap1_1);
            var posNewpaperX = this.grap1_1.x;
            this.grap1_1.x = -400;
            this.grap1_1.y = -50;
            game.add.tween(this.grap1_1).to({
                x: posNewpaperX,
                y: 51
            }, 700, "Quint", true);
            break;
        case 2:
            this.showObject(this.anim1_1);
            this.showObject(this.back2_1);
            this.showObject(this.water2);
            break;
        case 3:
            this.showObject(this.grap2_1);
            var posPrirateX = this.grap2_1.x;
            this.grap2_1.x = 850;
            game.add.tween(this.grap2_1).to({
                x: posPrirateX
            }, 1100, "Quart.easeOut", true);
            break;
        case 4:
            this.showDialog(this.dialog2_1);
            break;
        case 5:
            this.showObject(this.back3_1);
            this.showObject(this.water1);
            break;
        case 6:
            this.showDialog(this.dialog3_1);
            this.showObject(this.grap3_1);
            var posBoatX = this.grap3_1.x;
            this.grap3_1.x = -800;
            game.add.tween(this.grap3_1).to({
                x: posBoatX
            }, 2500, "Quart.easeOut", true);
            break;
        case 7:
            MainGame.goToState("Game");
            break
        }
    },
    sinhronAnim: function() {
        game.add.tween(this.anim2_3).to({
            y: "-70"
        }, 500, "Quart.easeInOut", true, 0, 0, true);
        this.anim2_1.animations.currentAnim.stop();
        this.anim2_1.animations.currentAnim.frame = 0;
        this.anim2_1.animations.currentAnim.play();
        this.anim2_2.animations.currentAnim.stop();
        this.anim2_2.animations.currentAnim.frame = 0;
        this.anim2_2.animations.currentAnim.play()
    },
    checkTimer: function(vP, vNum) {
        if (vNum == 0) {
            if (this.stepAction == 0) {
                this.stepAction++;
                this.checkStep()
            }
        }
        if (vNum == 1) {
            this.anim3_1.animations.play("anim", 30, false);
            this.anim3_2.animations.play("anim", 30, false);
            game.add.tween(this.anim3_3).to({
                x: 870
            }, 1400, "Linear", true);
            var tweenA = game.add.tween(this.anim3_3).to({
                y: "-80"
            }, 600, "Quad.easeOut");
            var tweenB = game.add.tween(this.anim3_3).to({
                y: "+80"
            }, 600, "Quad.easeIn");
            tweenA.chain(tweenB);
            tweenA.start()
        }
        if (vNum == 2) {
            if (this.stepAction == 6) {
                this.stepAction++;
                this.checkStep()
            }
        }
        if (vNum == 3) {
            if (this.stepAction == 0) {
                this.showObject(this.anim1_3);
                this.anim1_3.animations.play("anim", 30, false)
            }
        }
        if (vNum == 4) {
            if (this.stepAction == 0) {
                this.anim1_3.alpha = 0
            }
        }
    },
    checkStep3: function() {
        switch (this.stepAction) {
        case 1:
            this.anim1_1.x = 160;
            this.anim1_1.y = 136;
            game.tweens.removeFrom(this.anim1_1);
            this.anim1_1.animations.currentAnim.stop();
            this.anim1_1.animations.currentAnim.frame = 10;
            this.showDialog(this.dialog1_1);
            break;
        case 2:
            this.showDialog(this.dialog1_2);
            break;
        case 3:
            this.showObject(this.back2);
            this.showObject(this.anim2_1);
            this.showObject(this.anim2_2);
            this.showObject(this.anim2_3);
            break;
        case 4:
            this.showDialog(this.dialog2_1);
            break;
        case 5:
            this.showDialog(this.dialog2_2);
            break;
        case 6:
            this.back3.alpha = 1;
            this.anim3_1.alpha = 1;
            this.anim3_2.alpha = 1;
            this.anim3_3.alpha = 1;
            game.time.events.add(400 + 500, this.checkTimer, this, true, 1).autoDestroy = true;
            game.time.events.add(1e3 + 500, this.checkTimer, this, true, 2).autoDestroy = true;
            break;
        case 7:
            this.showDialog(this.dialog3_1);
            this.anim3_1.alpha = 0;
            this.anim3_2.alpha = 0;
            this.anim3_4.alpha = 1;
            this.anim3_5.alpha = 1;
            break;
        case 8:
            this.layerComics.removeAll();
            MainGame.comicsNum = 3;
            this.initComics();
            break
        }
    },
    checkStep4: function() {
        switch (this.stepAction) {
        case 1:
            game.tweens.removeFrom(this.anim1_1);
            game.tweens.removeFrom(this.anim1_2);
            this.anim1_1.alpha = 0;
            this.anim1_2.alpha = 0;
            this.showObject(this.back2_1);
            this.showObject(this.back2_2);
            this.showObject(this.grap2_1);
            this.grap2_1.x = -450;
            game.add.tween(this.grap2_1).to({
                x: -190
            }, 1500, "Quart.easeOut", true);
            this.showDialog(this.dialog2_1);
            break;
        case 2:
            MainGame.goToState("Game");
            break
        }
    },
    showObject: function(vObj) {
        game.add.tween(vObj).to({
            alpha: 1
        }, 300, "Linear", true)
    },
    showDialog: function(vDialog) {
        game.add.tween(vDialog).to({
            alpha: 1
        }, 300, "Linear", true);
        game.add.tween(vDialog.txt).to({
            alpha: 1
        }, 300, "Linear", true)
    },
    addDialog: function(vOblako, vText, vDx, vWidth, isAlignBottom) {
        if (!vOblako)
            return;
        if (typeof vDx === "undefined")
            vDx = 0;
        if (typeof vWidth === "undefined")
            vWidth = 15;
        var wOblako = vOblako.width;
        var hOblako = vOblako.height - 10 - vDx;
        var pX = vOblako.x;
        var pY = vOblako.y + Math.round(vOblako.height * .5) - vDx;
        var vSize = 22;
        var vColor = 9330034;
        var vAnchorX = .5;
        var vAnchorY = .55;
        var text = this.layerComics.add(game.add.bitmapText(pX, pY, "bmf_riffic", vText, vSize));
        text.anchor.setTo(vAnchorX, vAnchorY);
        text.fontSize = vSize;
        text.tint = vColor;
        text.align = "center";
        if (vDx > 0) {
            if (Math.abs(text.width - vOblako.width) < 15) {
                vOblako.width = Math.floor(vOblako.width * 1.2);
                wOblako = vOblako.width
            }
        }
        text.maxWidth = wOblako;
        if (vOblako.height < text.height + vDx + 10) {
            var oldH = vOblako.height;
            vOblako.height = vDx + 10 + Math.floor(text.height * 1.22);
            if (vOblako.needUpdate) {
                vOblako.y -= vOblako.height - oldH
            }
            text.y = vOblako.y + Math.round(vOblako.height * .5) - vDx;
            if (vOblako.needUpdate) {
                vOblako.anchor.y = 1;
                vOblako.y += vOblako.height
            }
        }
        vOblako.txt = text;
        if (!this.isDebug)
            vOblako.txt.alpha = 0;
        return text
    },
    addGraphic: function(vName, vX, vY, isAlignBottom) {
        var obj = this.layerComics.add(game.add.image(vX, vY, "ss_comics", vName + "_0000"));
        obj.anchor.setTo(.5, 0);
        obj.needUpdate = isAlignBottom;
        if (!this.isDebug)
            obj.alpha = 0;
        return obj
    },
    addAnim: function(vName, vFrames, vX, vY) {
        var obj = this.layerComics.add(game.add.sprite(vX, vY, "ss_comics"));
        obj.animations.add("anim", Phaser.Animation.generateFrameNames(vName + "_", 0, vFrames, "", 4), 30);
        obj.animations.play("anim", 30, true);
        if (!this.isDebug)
            obj.alpha = 0;
        return obj
    },
    updateComics: function(vPointer) {
        if (vPointer) {
            if (vPointer.x > game.width - 50 && vPointer.y < 50) {
                MainGame.goToState("Game");
                return
            }
        }
        this.stepAction++;
        this.checkStep()
    },
    clickStart: function() {
        MainGame.goToState("Game")
    }
};
MainGame.ScreenFinal = function(game) {}
;
MainGame.ScreenFinal.prototype = {
    create: function() {
        game.stage.backgroundColor = "#000000";
        MainGame.state = this;
        MainGame.stateName = "ScreenFinal";
        var bg = game.add.image(400, 300, "bg_congrats");
        bg.anchor.setTo(.5);
        this.layerMain = game.add.group();
        this.addAnim("cflash", 19, 400 + 100, 340);
        this.addAnim("cflash", 19, 400 - 160, 330);
        this.addAnim("cflash", 19, 420, 280);
        this.btnHome = new SimpleButton(game,this,this.layerMain,400 - 345,58,"ss_menu","btn_home_0000",this.clickHome);
        var panel = this.layerMain.add(game.add.image(400, 495, "ss_menu", "congratulations_panel_0000"));
        panel.anchor.setTo(.5, .5);
        var text_conrats = MainGame.GAME_TEXT.text_finalRW1;
        this.dialog1_1 = this.addGraphic("cmsg9", 400, 0);
        this.dialog1_1.anchor.setTo(.5, 0);
        this.dialog1_1.height = 115;
        this.dialog1_1.width = 460;
        this.addDialog(this.dialog1_1, text_conrats);
        var textTitle = MainGame.GAME_TEXT.congratulations.toUpperCase();
        MainGame.addText(400, 410, 163 + 5, textTitle, this.layerMain, 42, 9330034, .5, .5);
        MainGame.addText(400, 410, 163, textTitle, this.layerMain, 42, 16777215, .5, .5);
        MainGame.addText(225, 410, 460, MainGame.GAME_TEXT.total_score.toUpperCase(), this.layerMain, 26, 16777215, 1, .5);
        MainGame.addText(225, 410, 520, MainGame.GAME_TEXT.time_used.toUpperCase(), this.layerMain, 26, 16777215, 1, .5);
        MainGame.addText(800, 430, 455 + 5, String(MainGame.highScore), this.layerMain, 38, 10248197, 0, .5);
        MainGame.addText(800, 430, 457 + 0, String(MainGame.highScore), this.layerMain, 38, 16710912, 0, .5);
        var timeTotal = 0;
        for (var i = 0; i < 11; i++) {
            timeTotal += MainGame.levelTime[i]
        }
        var s_time = this.secToHHMMSS(timeTotal);
        MainGame.addText(800, 430, 520, s_time, this.layerMain, 26, 16777215, 0, .5);
        MainGame.resizeGame();
        MainGame.fadeOut();
        this.updateResize();
        this.initKeyboardEvents();
        if (MainGame.isAPI)
            MainGame.API_POKI.happyTime(1);
        if (MainGame.isAPI)
            MainGame.API_POKI.destroyAd();
        MainGame.api_google("GameComplete", MainGame.highScore)
    },
    initKeyboardEvents: function() {
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keySpace.onDown.add(this.clickHome, this)
    },
    updateResize: function() {
        var posP_R = 800 + (game.width - 800) * .5;
        var posP_L = -((game.width - 800) * .5);
        this.btnHome.buttonC.x = posP_L + 60
    },
    secToHHMMSS: function(vSec) {
        var seconds = parseInt(vSec, 10);
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - hours * 3600) / 60);
        var seconds = seconds - hours * 3600 - minutes * 60;
        if (hours < 10) {
            hours = "0" + hours
        }
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        var time = hours + ":" + minutes + ":" + seconds;
        return time
    },
    addGraphic: function(vName, vX, vY) {
        var obj = this.layerMain.add(game.add.image(vX, vY, "ss_menu", vName + "_0000"));
        return obj
    },
    addDialog: function(vOblako, vText, vDx, vWidth) {
        if (!vOblako)
            return;
        if (typeof vDx === "undefined")
            vDx = 0;
        if (typeof vWidth === "undefined")
            vWidth = 15;
        var wOblako = vOblako.width - 5;
        var pX = vOblako.x;
        var pY = vOblako.y + Math.round(vOblako.height * .5) + 2;
        var vSize = 22;
        var vColor = 9330034;
        var vAnchorX = .5;
        var vAnchorY = .55;
        var text = this.layerMain.add(game.add.bitmapText(pX, pY, "bmf_riffic", vText, vSize));
        text.anchor.setTo(vAnchorX, vAnchorY);
        text.fontSize = vSize;
        text.tint = vColor;
        text.align = "center";
        text.maxWidth = wOblako;
        MainGame.updateTextWidth(text, wOblako);
        vOblako.txt = text;
        return text
    },
    addAnim: function(vName, vFrames, vX, vY) {
        var obj = this.layerMain.add(game.add.sprite(vX, vY, "ss_comics"));
        obj.animations.add("anim", Phaser.Animation.generateFrameNames(vName + "_", 0, vFrames, "", 4), 30);
        obj.animations.play("anim", 30, true);
        return obj
    },
    clickHome: function() {
        MainGame.goToState("Menu")
    }
};
