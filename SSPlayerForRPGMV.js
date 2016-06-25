//=============================================================================
// SSPlayerForRPGMV.js
//=============================================================================

/*:
 * @plugindesc This plug-in can be able to play animations made by OPTPiX SpriteStudio.
 * @author Web Technology Corp. / Inaba Byakko
 * 
 * @param Animation File Path
 * @desc A folder path to place animation data (json/png). Default value is "img/animations/ssas".
 * @default img/animations/ssas
 *
 * @help
 * ** INFORMATION **
 * Some plug-ins are depends on this plug-in.
 * Those plug-ins must be installed under this
 * plug-in.
 * 
 * For more information, please look at README.md
 * in the Github repository.
 * https://github.com/InabaByakko/SSPlayerForRPGMV
 *
 * ** WARNING **
 * When you use 'delete unused files' options in deployment,
 * the folder which an animation is included in will be deleted.
 * You should copy that folder to the folder that you deployed.
 * 
 * Plug-in commands:
 *   # Play an animation data saved in file "animdata.json"
 *   # at position (300, 400), and put the label named
 *   # "label". It is repeated endlessly.
 *   # (An last number 0 can be omitted.)
 *   SsPlayer play label animdata.json 300 400 0
 *   
 *   # Play an animation data saved in file "animdata.json"
 *   # at position (300, 400), and put the label named
 *   # "label". It is repeated at 3 times.
 *   SsPlayer play label animdata.json 300 400 3
 *   
 *   # Stop an animation which a label called "label" was
 *   # attached to.
 *   SsPlayer stop label
 *   
 * ** Release Notes **
 * v0.1.9 - Improved consumption efficiency of the memory / SsSprite properties -  blendColor, colorTone, blendMode - , will be applied
 * v0.1.8 - Fixed issues - A problem to crash when the save data which were made when this plugin is not installed is loaded
 * v0.1.7 - Modified behavior when animation is stopped
 * v0.1.6 - Fixed issues - A problem that animation will be glitch when has vertically fliped parts
 * v0.1.5 - Fixed issues - A problem that parts' individual scale attributes aren't applied
 * v0.1.4 - Mpdified plugin command - It can appoint the number of times to repeat animation
 * v0.1.3 - Fixed issues - A problem when SsSprite had Scale property
 * v0.1.2 - Modified internal process of Plugin commands
 * v0.1.1 - Added Plugin commands
 * v0.1.0 - First release
 */

/*:ja
 * @plugindesc SpriteStudioで作成されたアニメーションを再生できるようにするプラグインです。
 * @author Web Technology Corp. / Inaba Byakko
 * 
 * @param Animation File Path
 * @desc アニメーションデータ (json/png) が設置されたフォルダのパスです。デフォルトは "img/animations/ssas" です。
 * @default img/animations/ssas
 *
 * @help
 * ※注意
 * 一部のプラグインはこのプラグインに依存しています。
 * 依存プラグインを使用する際は、このプラグインよりも下の位置に
 * インストールしてください。
 * 
 * 詳しい使い方は、GithubリポジトリのREADME.mdをお読み
 * ください。
 * https://github.com/InabaByakko/SSPlayerForRPGMV
 *
 * また、デプロイメント時に「未使用ファイルを削除」オプション
 * を使用した場合、アニメーションを含むフォルダは削除されて
 * しまいます。必ず、デプロイメント後にプラグインパラメータで
 * 指定したフォルダを、出力先の同じ位置にコピーしてください。
 * 
 * プラグインコマンド:
 *   # animdata.json に保存されたアニメーションデータを、
 *   # labelという名前でラベルを付け、(300, 400)の座標で
 *   # 停止するまで無限に再生します。
 *   # (最後の 0 は省略可能です。)
 *   SsPlayer play label animdata.json 300 400 0
 *   
 *   # animdata.json に保存されたアニメーションデータを、
 *   # labelという名前でラベルを付け、(300, 400)の座標で
 *   # 3回ループするまで再生します。
 *   SsPlayer play label animdata.json 300 400 3
 *   
 *   # ラベル名labelで再生したアニメーションを停止します。
 *   SsPlayer stop label
 * 
 * 更新履歴：
 * v0.1.9 - メモリの使用効率を向上、SsSpriteオブジェクトに設定した blendColor, colorTone, blendMode プロパティが適用されるようにした
 * v0.1.8 - プロジェクトに途中から組み込んだときにセーブデータを読み込むとクラッシュする不具合を修正
 * v0.1.7 - アニメーション停止時の挙動を変更
 * v0.1.6 - 左右反転したパーツを含むアニメーションの表示が崩れる不具合の修正
 * v0.1.5 - パーツごとのスケールアトリビュートが適用されていなかった不具合を修正
 * v0.1.4 - プラグインコマンドでループ回数を指定できるよう変更
 * v0.1.3 - SsSpriteにScaleを設定したときにうまく機能しなかった不具合を修正
 * v0.1.2 - プラグインコマンドの内部処理を変更
 * v0.1.1 - プラグインコマンドで使用できるようにした
 * v0.1.0 - 最初のリリース
 */

function SSP4MV() {}
SSP4MV.parameters = PluginManager.parameters('SSPlayerForRPGMV');
SSP4MV.animationDir = String(SSP4MV.parameters['Animation File Path']
            || "img/animations/ssas")
            + "/";

(function() {

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === "SsPlayer" && args[0] === "play") {
            $gameScreen.addToSsPlayList(args[1], new SsPlayer());
            var loop = Number(args[5] || 0);
            $gameScreen.getSsPlayerByLabel(args[1]).loadAnimation(args[2],
                    args[3], args[4], loop);
        }

        if (command === "SsPlayer" && args[0] === "stop") {
            $gameScreen.removeSsPlayerByLabel(args[1]);
        }
    };

    function SsPlayList() {
        this.players = {};
    }

    function SsPlayer() {
        this.jsonData = null;
        this.sprite = null;
    }

    SsPlayer.prototype.loadAnimation = function(filename, x, y, loop) {
        var xhr = new XMLHttpRequest();
        var url = SSP4MV.animationDir + filename;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function(x, y, loop) {
            if (xhr.status < 400) {
                this.jsonData = JSON.parse(xhr.responseText)[0];
                var imageList = new SsImageList(this.jsonData.images,
                        SSP4MV.animationDir, true);
                var animation = new SsAnimation(this.jsonData.animation,
                        imageList);
                this.sprite = new SsSprite(animation);
                this.sprite.x = x;
                this.sprite.y = y;
                this.sprite.setLoop(loop);
                this.sprite.setEndCallBack(function(){
                    this.sprite = null;
                }.bind(this));
            }
        }.bind(this, x, y, loop);
        xhr.send();
    };

    SsPlayer.prototype.dispose = function() {
        this.sprite = null;
    };

    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.clearSsPlayList();
    };

    Game_Screen.prototype.clearSsPlayList = function() {
        this._ssPlayList = null;
        this._ssPlayList = new SsPlayList();
    };

    Game_Screen.prototype.checkSsPlayListDefined = function(){
        if (this._ssPlayList === undefined)
            this.clearSsPlayList();
    };
    Game_Screen.prototype.addToSsPlayList = function (label, player) {
        this.checkSsPlayListDefined();
        if (label in this._ssPlayList.players) {
            // TODO:消去処理をいれる
        }
        this._ssPlayList.players[label] = player;
    };

    Game_Screen.prototype.removeSsPlayerByLabel = function (label) {
        this.checkSsPlayListDefined();
        this._ssPlayList.players[label].dispose();
        this._ssPlayList.players[label] = null;
    };

    Game_Screen.prototype.getSsPlayerByLabel = function (label) {
        this.checkSsPlayListDefined();
        return this._ssPlayList.players[label];
    };

    Game_Screen.prototype.getSsSprites = function () {
        this.checkSsPlayListDefined();
        var result = [];
        for ( var key in this._ssPlayList.players) {
            if (this._ssPlayList.players[key] != null
                    && this._ssPlayList.players[key].sprite != null) {
                result.push(this._ssPlayList.players[key].sprite);
            }
        }
        return result;
    };

    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.call(this);
        this.createSsSprites();
    };

    Spriteset_Base.prototype.createSsSprites = function() {
        this._ssContainer = new Sprite();
        this.addChild(this._ssContainer);
    };

    var _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.call(this);
        this.updateSsContainer();
    };

    Spriteset_Base.prototype.updateSsContainer = function() {
        var preparedSprites = $gameScreen.getSsSprites();
        preparedSprites.forEach(function(sprite, index, array) {
            if (this._ssContainer.children.indexOf(sprite) < 0) {
                this._ssContainer.addChild(sprite);
            }
        }, this);

        this._ssContainer.children.forEach(function(sprite, index, array) {
            if (preparedSprites.indexOf(sprite) < 0) {
                this._ssContainer.removeChild(sprite);
            }
        }, this);
    };

})();

// //////////////////////////////////////////////////////////
// SSP4MV.Mesh
// //////////////////////////////////////////////////////////
SSP4MV.Mesh = function() {
    this.initialize.apply(this, arguments);
};

SSP4MV.Mesh.prototype = Object.create(PIXI.Strip.prototype);
SSP4MV.Mesh.prototype.constructor = PIXI.Strip;

SSP4MV.Mesh.prototype.initialize = function(bitmap) {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());

    PIXI.Strip.call(this, texture);

    this._bitmap = null;
    this._offset = new Point();
    this._blendColor = [0, 0, 0, 0];
    this._colorTone = [0, 0, 0, 0];
    this._canvas = null;
    this._context = null;
    this._tintTexture = null;

    this.spriteId = Sprite._counter++;
    this.opaque = false;

    this.bitmap = bitmap;
};

/**
 * The image for the sprite.
 *
 * @property bitmap
 * @type Bitmap
 */
Object.defineProperty(SSP4MV.Mesh.prototype, 'bitmap', {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            }
        }
    },
    configurable: true
});

/**
 * Updates the sprite for each frame.
 *
 * @method update
 */
SSP4MV.Mesh.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * Sets the x and y at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the sprite
 * @param {Number} y The y coordinate of the sprite
 */
SSP4MV.Mesh.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Gets the blend color for the sprite.
 *
 * @method getBlendColor
 * @return {Array} The blend color [r, g, b, a]
 */
SSP4MV.Mesh.prototype.getBlendColor = function() {
    return this._blendColor.clone();
};

/**
 * Sets the blend color for the sprite.
 *
 * @method setBlendColor
 * @param {Array} color The blend color [r, g, b, a]
 */
SSP4MV.Mesh.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._refresh();
    }
};

/**
 * Gets the color tone for the sprite.
 *
 * @method getColorTone
 * @return {Array} The color tone [r, g, b, gray]
 */
SSP4MV.Mesh.prototype.getColorTone = function() {
    return this._colorTone.clone();
};

/**
 * Sets the color tone for the sprite.
 *
 * @method setColorTone
 * @param {Array} tone The color tone [r, g, b, gray]
 */
SSP4MV.Mesh.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._colorTone.equals(tone)) {
        this._colorTone = tone.clone();
        this._refresh();
    }
};

/**
 * @method _onBitmapLoad
 * @private
 */
SSP4MV.Mesh.prototype._onBitmapLoad = function() {
    this._refresh();
};

/**
 * @method _refresh
 * @private
 */
SSP4MV.Mesh.prototype._refresh = function() {
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    var realX = 0;
    var realY = 0;
    var realW = bitmapW;
    var realH = bitmapH;


    if (realW > 0 && realH > 0) {
        if (this._needsTint()) {
            this._createTinter(realW, realH);
            this._executeTint(realX, realY, realW, realH);
            this._tintTexture.dirty();
            this.texture.baseTexture = this._tintTexture;
            this.texture.setFrame(new Rectangle(0, 0, realW, realH));
        } else {
            if (this._bitmap) {
                this.texture.baseTexture = this._bitmap.baseTexture;
            }
            this.texture.setFrame(new Rectangle(0, 0, realW, realH));
        }
    }
};

/**
 * @method _needsTint
 * @return {Boolean}
 * @private
 */
SSP4MV.Mesh.prototype._needsTint = function() {
    var tone = this._colorTone;
    return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
};

/**
 * @method _createTinter
 * @param {Number} w
 * @param {Number} h
 * @private
 */
SSP4MV.Mesh.prototype._createTinter = function(w, h) {
    if (!this._canvas) {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
    }

    this._canvas.width = w;
    this._canvas.height = h;

    if (!this._tintTexture) {
        this._tintTexture = new PIXI.BaseTexture(this._canvas);
    }

    this._tintTexture.width = w;
    this._tintTexture.height = h;
    this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
};

/**
 * @method _executeTint
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @private
 */
SSP4MV.Mesh.prototype._executeTint = function(x, y, w, h) {
    var context = this._context;
    var tone = this._colorTone;
    var color = this._blendColor;

    context.globalCompositeOperation = 'copy';
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

    if (Graphics.canUseSaturationBlend()) {
        var gray = Math.max(0, tone[3]);
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
        context.fillRect(0, 0, w, h);
    }

    var r1 = Math.max(0, tone[0]);
    var g1 = Math.max(0, tone[1]);
    var b1 = Math.max(0, tone[2]);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
    context.fillRect(0, 0, w, h);

    if (Graphics.canUseDifferenceBlend()) {
        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);

        var r2 = Math.max(0, -tone[0]);
        var g2 = Math.max(0, -tone[1]);
        var b2 = Math.max(0, -tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);
    }

    var r3 = Math.max(0, color[0]);
    var g3 = Math.max(0, color[1]);
    var b3 = Math.max(0, color[2]);
    var a3 = Math.max(0, color[3]);
    context.globalCompositeOperation = 'source-atop';
    context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
    context.globalAlpha = a3 / 255;
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = 'destination-in';
    context.globalAlpha = 1;
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
};

// //////////////////////////////////////////////////////////
// SsImageList
// //////////////////////////////////////////////////////////

function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoad) {

    this.fileRoot = aFileRoot;
    this.imagePaths = new Array();
    this.images = new Array();

    // ロード完了時に呼ばれるコールバック
    // Callback that is called when the load is finished.
    this.onLoad = aOnLoad;

    // 全部読み込まれた場合のみユーザーが設定したコールバックを呼ぶ
    // Only when it is all loaded, is called a callback set by the user.
    this.onLoad_ = function() {
        for ( var i in this.images)
            if (i != null && i.complete == false)
                return;
        if (this.onLoad != null)
            this.onLoad();
    };
    
    for (var i = 0; i < imageFiles.length; i++) {
        var path = this.fileRoot + imageFiles[i];
        this.imagePaths.push(path);
        var image = new Image();
        if (loadImmediately) {
            image.onload = this.onLoad_;
            image.src = path;
        }
        this.images.push(image);
    }
}

// 指定したインデックスのImageを返す
// Get image at specified index.
SsImageList.prototype.getImage = function(index) {
    if (index < 0 || index >= this.images.length)
        return null;
    return this.images[index];
};

// 指定したインデックスの画像をimagePathで差し替える。
// Replace image of specified index at imagePath.
SsImageList.prototype.setImage = function(index, imagePath) {
    if (index < 0 || index >= this.images.length)
        return null;
    this.imagePaths[index] = this.fileRoot + imagePath;
    this.images[index].onload = this.onLoad_;
    this.images[index].src = this.imagePaths[index];
};

// ロード完了時コールバックを設定する
// Set a callback when load is finished.
SsImageList.prototype.setOnLoad = function(cb) {
    this.onLoad = cb;
};

// //////////////////////////////////////////////////////////
// SsPartState
// //////////////////////////////////////////////////////////

function SsPartState(name) {

    // パーツ名
    // Parts name.
    this.name = name;
    // 現在の描画Xポジション
    // Current x position at drawing.
    this.x = 0;
    // 現在の描画Yポジション
    // Current x position at drawing.
    this.y = 0;
}

// //////////////////////////////////////////////////////////
// SsPartData
// //////////////////////////////////////////////////////////
function SsPartData(dataArray) {
    this._data = dataArray;
    this._length = dataArray.length;
}

SsPartData.prototype.getPartNo = function() {
    return this._data[0];
};

SsPartData.prototype.getImageNo = function () {
    return this._data[1];
};

SsPartData.prototype.getSourceX = function () {
    return this._data[2];
};

SsPartData.prototype.getSourceY = function () {
    return this._data[3];
};

SsPartData.prototype.getSourceWidth = function () {
    return this._data[4];
};

SsPartData.prototype.getSourceHeight = function () {
    return this._data[5];
};

SsPartData.prototype.getSourcePosition = function () {
    return new Point(this.getSourceX(), this.getSourceY());
};

SsPartData.prototype.getSourceRect = function () {
    return new Rectangle(this.getSourceX(), this.getSourceY(), this.getSourceWidth(), this.getSourceHeight());
};

SsPartData.prototype.getDestX = function () {
    return this._data[6];
};

SsPartData.prototype.getDestY = function () {
    return this._data[7];
};

SsPartData.prototype.getDestPosition = function () {
    return new Point(this.getDestX(), this.getDestY());
};

SsPartData.prototype.getDestAngle = function () {
    return this._data[8];
};

SsPartData.prototype.getDestScaleX = function () {
    return this._data[9];
};

SsPartData.prototype.getDestScaleY = function () {
    return this._data[10];
};

SsPartData.prototype.getOriginX = function () {
    return ((this._length > 11) ? this._data[11] : 0);
};

SsPartData.prototype.getOriginY = function () {
    return ((this._length > 12) ? this._data[12] : 0);
};

SsPartData.prototype.getOrigin = function () {
    return new Point(this.getOriginX(), this.getOriginY());
};

SsPartData.prototype.getFlipHorizontal = function () {
    return ((this._length > 13) ? (this._data[13] != 0 ? -1 : 1) : 1);
};

SsPartData.prototype.getFlipVertical = function () {
    return ((this._length > 14) ? (this._data[14] != 0 ? -1 : 1) : 1);
};

SsPartData.prototype.getAlpha = function () {
    return ((this._length > 15) ? this._data[15] : 1.0);
};

SsPartData.prototype.getBlend = function () {
    return ((this._length > 16) ? this._data[16] : 0);
};

SsPartData.prototype.getTranslates = function () {
    return [
        (this._length > 17) ? this._data[17] : 0,
        (this._length > 18) ? this._data[18] : 0,
        (this._length > 19) ? this._data[19] : 0,
        (this._length > 20) ? this._data[20] : 0,
        (this._length > 21) ? this._data[21] : 0,
        (this._length > 22) ? this._data[22] : 0,
        (this._length > 23) ? this._data[23] : 0,
        (this._length > 24) ? this._data[24] : 0
    ];
};

SsPartData.prototype.hasTranslates = function () {
    if (this._length > 24)
        return true;
    return false;
};

// //////////////////////////////////////////////////////////
// SsAnimation
// //////////////////////////////////////////////////////////

function SsAnimation(ssaData, imageList) {

    this.ssaData = ssaData;
    this.imageList = imageList;

    this.partsMap = new Array();
    this.parts = ssaData.parts;
    for (var i = 0; i < this.parts.length; i++) {
        this.partsMap[this.parts[i]] = i;
    }
    this._bitmaps = {};
    this._textures = {};
    this._partSprites = new Array();
    this._partMeshs = new Array();
}

// このアニメーションのFPS
// This animation FPS.
SsAnimation.prototype.getFPS = function() {
    return this.ssaData.fps;
};

// トータルフレーム数を返す
// Get total frame count.
SsAnimation.prototype.getFrameCount = function() {
    return this.ssaData.ssa.length;
};

// パーツリストを返す
// Get parts list.
SsAnimation.prototype.getParts = function() {
    return this.ssaData.parts;
};

// パーツ名からNoを取得するマップを返す
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function() {
    return this.partsMap;
};

// 画像ファイル名からBitmapオブジェクトをロード
// Return a Bitmap object from file path.
SsAnimation.prototype.getBitmap = function(filepath) {
    if (!this._bitmaps[filepath]) {
        var filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1).replace(new RegExp('.png$', 'g'), "");
        var dirname = filepath.replace(/\\/g, '/').replace(/\/[^\/]*$/, '')+'/';
        this._bitmaps[filepath] = ImageManager.loadBitmap(dirname, filename, 0, true);
    }
    return this._bitmaps[filepath];
};

// 画像ファイル名からPIXI.Textureオブジェクトをロード
// Return a PIXI.Texture object from file path.
SsAnimation.prototype.getTexture = function(filepath) {
    if (!this._textures[filepath]) {
        this._textures[filepath] = new PIXI.Texture(this.getBitmap(filepath).baseTexture);
    }
    return this._textures[filepath];
};

// パーツNoから生成済のSpriteオブジェクトを呼び出すか、ない場合は新規作成して返す
// Return a Sprite object of the generated from partNo. If there is no return to create a new one.
SsAnimation.prototype.getPartSprite = function (partNo, bitmap) {
    if (!this._partSprites[partNo]) {
        this._partSprites[partNo] = new Sprite(bitmap);
    }
    return this._partSprites[partNo];
};

// パーツNoから生成済のStripオブジェクトを呼び出すか、ない場合は新規作成して返す
// Return a Strip object of the generated from partNo. If there is no return to create a new one.
SsAnimation.prototype.getPartMesh = function (partNo, bitmap) {
    if (!this._partMeshs[partNo]) {
        this._partMeshs[partNo] = new SSP4MV.Mesh(bitmap);
    }
    return this._partMeshs[partNo];
};

// 描画メソッド
// Draw method.
SsAnimation.prototype.getPartSprites = function (frameNo, flipH, flipV,
        partStates, scale) {
    var sprites = [];

    var blendOperations = new Array("source-over", "source-over", "lighter",
            "source-over");

    var frameData = this.ssaData.ssa[frameNo];
    var frameLength = frameData.length;
    for (var refNo = 0; refNo < frameLength; refNo++) {

        var partData = new SsPartData(frameData[refNo]);

        var partNo = partData.getPartNo();
        var bitmap = this.getBitmap(this.imageList.imagePaths[partData.getImageNo()]);
        var sx = partData.getSourceX();
        var sy = partData.getSourceY();
        var sw = partData.getSourceWidth();
        var sh = partData.getSourceHeight();
        var dx = partData.getDestX();
        var dy = partData.getDestY();

        var vdw = sw;
        var vdh = sh;

        if (sw > 0 && sh > 0) {

            var dang = partData.getDestAngle();
            var scaleX = partData.getDestScaleX();
            var scaleY = partData.getDestScaleY();

            var ox = partData.getOriginX();
            var oy = partData.getOriginY();
            var fh = partData.getFlipHorizontal();
            var fv = partData.getFlipVertical();
            var alpha = partData.getAlpha();
            var blend = partData.getBlend();
            var translate = partData.getTranslates();

            // 頂点変形データがあるかないかでSpriteとStripを分ける
            if (partData.hasTranslates()) {
                var spr_part = this.getPartMesh(partNo, bitmap);
                var texW = bitmap.width;
                var texH = bitmap.height;
                var verts = new Float32Array([ (-ox + translate[0]),
                (-oy + translate[1]), (sw - ox + translate[2]),
                (-oy + translate[3]), (-ox + translate[4]),
                (sh - oy + translate[5]), (sw - ox + translate[6]),
                (sh - oy + translate[7]) ]);
                var uvs = new Float32Array([
                (sx + (fh == -1 ? sw : 0)) / texW, (sy + (fv == -1 ? sh : 0)) / texH,
                (sx + (fh == -1 ? 0 : sw)) / texW, (sy + (fv == -1 ? sh : 0)) / texH, 
                (sx + (fh == -1 ? sw : 0)) / texW, (sy + (fv == -1 ? 0 : sh)) / texH, 
                (sx + (fh == -1 ? 0 : sw)) / texW, (sy + (fv == -1 ? 0 : sh)) / texH
                ]);
                
                spr_part.vertices = verts;
                spr_part.uvs = uvs;
                spr_part.dirty = true;
                spr_part.scale = new PIXI.Point(scaleX, scaleY);
                spr_part.alpha = alpha;
            } else {
                var spr_part = this.getPartSprite(partNo, bitmap);
                spr_part.setFrame(sx, sy, sw, sh);
                spr_part.anchor = new PIXI.Point(ox * 1.0 / sw, oy * 1.0 / sh);
                if (fh == -1)
                    spr_part.anchor.x = 1 - spr_part.anchor.x;
                if (fv == -1)
                    spr_part.anchor.y = 1 - spr_part.anchor.y;
                spr_part.scale = new PIXI.Point(scaleX * fh, scaleY * fv);
                spr_part.opacity = Math.round(255 * alpha);
                spr_part.setBlendColor([0, 0, 0, 0]);
                spr_part.setColorTone([0, 0, 0, 0]);
            }
            switch (blend) {
            case 1:     // 乗算
                spr_part.blendMode = PIXI.blendModes.MULTIPLY;
                break;
            case 2:     // 加算
                spr_part.blendMode = PIXI.blendModes.ADD;
                break;
            case 3:     // 減算
                spr_part.blendMode = PIXI.blendModes.DIFFERENCE;
                break;
            default:    // ミックス・その他
                spr_part.blendMode = PIXI.blendModes.NORMAL;
                break;
            }
            spr_part.position = partData.getDestPosition();
            spr_part.rotation = -dang;

            sprites.push(spr_part);

        }

        var state = partStates[partNo];
        state.x = dx;
        state.y = dy;
    }

    return sprites;
};

// //////////////////////////////////////////////////////////
// SsSprite
// //////////////////////////////////////////////////////////

function SsSprite(animation) {
    Sprite.call(this);

    // プライベート変数
    // Private variables.
    this.inner = {
        animation : animation,
        playingFrame : 0,
        prevDrawnTime : 0,
        step : 1,
        loop : 0,
        loopCount : 0,
        endCallBack : null, // draw end callback
        // isPlaying: false,

        partStates : null,
        initPartStates : function() {
            this.partStates = null;
            if (this.animation != null) {
                var parts = this.animation.getParts();
                var states = new Array();
                for (var i = 0; i < parts.length; i++) {
                    states.push(new SsPartState(parts[i]));
                }
                this.partStates = states;
            }
        }
    };

    this.x = 0;
    this.y = 0;
    this.anchor = new PIXI.Point(0, 0);
    this.inner.initPartStates();

}

SsSprite.prototype = Object.create(Sprite.prototype);
SsSprite.prototype.constructor = SsSprite;

// ※未実装
// *Not implemented.
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// アニメーションの設定
// Set animation.
SsSprite.prototype.setAnimation = function(animation) {
    this.inner.animation = animation;
    this.inner.initPartStates();
    this.inner.playingFrame = 0;
    this.inner.prevDrawnTime = 0;
    this.clearLoopCount();
};

// アニメーションの取得
// Get animation.
SsSprite.prototype.getAnimation = function() {
    return this.inner.animation;
};

// 再生フレームNoを設定
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function(frameNo) {
    this.inner.playingFrame = frameNo;
    this.inner.prevDrawnTime = 0;
};

// 再生フレームNoを取得
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function() {
    return this.inner.playingFrame >> 0;
};

// 再生スピードを設定 (1:標準)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function(step) {
    this.inner.step = step;
};

// 再生スピードを取得
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function() {
    return this.inner.step;
};

// ループ回数の設定 (0:無限)
// Set a playback loop count. (0:infinite)
SsSprite.prototype.setLoop = function(loop) {
    if (loop < 0)
        return;
    this.inner.loop = loop;
};

// ループ回数の設定を取得
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function() {
    return this.inner.loop;
};

// 現在の再生回数を取得
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function() {
    return this.inner.loopCount;
};

// 現在の再生回数をクリア
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function() {
    this.inner.loopCount = 0;
};

// アニメーション終了時のコールバックを設定
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function(func) {
    this.inner.endCallBack = func;
};

// パーツの状態（現在のX,Y座標など）を取得
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function(name) {
    if (this.inner.partStates == null)
        return null;

    var partsMap = this.inner.animation.getPartsMap();
    var partNo = partsMap[name];
    if (partNo == null)
        return null;
    return this.inner.partStates[partNo];
};

// 幅、高さを取得（現フレームのおおよその値）
// Get width and height (inaccuracy value) of this frame.
SsSprite.prototype.frameWidth = function () {
    var min = 0, max = 0;
    if (!Array.isArray(this.inner.partStates)) return 0;
    for (var i = 0; i < this.inner.partStates.length; i++ ) {
        if (min < this.inner.partStates[i].x) min = this.inner.partStates[i].x;
        if (max > this.inner.partStates[i].x) max = this.inner.partStates[i].x;
    }
    return Math.abs(max - min);
};
SsSprite.prototype.frameHeight = function () {
    var min = 0, max = 0;
    if (!Array.isArray(this.inner.partStates)) return 0;
    for (var i = 0; i < this.inner.partStates.length; i++) {
        if (min < this.inner.partStates[i].y) min = this.inner.partStates[i].y;
        if (max > this.inner.partStates[i].y) max = this.inner.partStates[i].y;
    }
    return Math.abs(max - min);
};

// 現在再生中か
SsSprite.prototype.isPlaying = function() {
    if (this.inner.loop == 0) {
        return true;
    } else if (this.inner.loop > this.inner.loopCount) {
        return true;
    }
    return false;
};

// 描画実行
// Drawing method.
SsSprite.prototype.update = function() {
    if (this.children.length > 0) {
        this.removeChildren(0, this.children.length);
    }
    
    if (this.inner.animation == null)
        return;

    if (this.isPlaying()) {
        // フレームを進める
        // To next frame.
        this.inner.playingFrame += (1.0 / (60 / this.inner.animation.getFPS()))
                * this.inner.step;

        var c = (this.inner.playingFrame / this.inner.animation.getFrameCount()) >> 0;

        if (this.inner.step >= 0) {
            if (this.inner.playingFrame >= this.inner.animation.getFrameCount()) {
                // ループ回数更新
                // Update repeat count.
                this.inner.loopCount += c;
                if (this.inner.loop == 0
                        || this.inner.loopCount < this.inner.loop) {
                    // フレーム番号更新、再生を続ける
                    // Update frame no, and playing.
                    this.inner.playingFrame %= this.inner.animation
                            .getFrameCount();
                } else {
                    // 再生停止、最終フレームへ
                    // Stop animation, to last frame.
                    this.inner.playingFrame = this.inner.animation
                            .getFrameCount() - 1;
                    // 停止時コールバック呼び出し
                    // Call finished callback.
                    if (this.inner.endCallBack != null) {
                        this.inner.endCallBack();
                    }
                }
            }
        } else {
            if (this.inner.playingFrame < 0) {
                // ループ回数更新
                // Update repeat count.
                this.inner.loopCount += 1 + -c;
                if (this.inner.loop == 0
                        || this.inner.loopCount < this.inner.loop) {
                    // フレーム番号更新、再生を続ける
                    // Update frame no, and playing.
                    this.inner.playingFrame %= this.inner.animation
                            .getFrameCount();
                    if (this.inner.playingFrame < 0)
                        this.inner.playingFrame += this.inner.animation
                                .getFrameCount();
                } else {
                    // 再生停止、最終フレームへ
                    // Stop animation, to last frame.
                    this.inner.playingFrame = this.inner.animation
                            .getFrameCount() - 1;
                    // 停止時コールバック呼び出し
                    // Call finished callback.
                    if (this.inner.endCallBack != null) {
                        this.inner.endCallBack();
                    }
                }
            }
        }
    } else {
        // // 再生停止
        // // Stop animation.
        //this.inner.playingFrame = 0;
    }
    this.inner.animation.getPartSprites(this.getFrameNo(), this.flipH,
            this.flipV, this.inner.partStates, this.scale).forEach(
            function (val, index, ar) {
                val.setBlendColor(this.getBlendColor());
                val.setColorTone(this.getColorTone());
                if (this.blendMode != 0)
                    val.blendMode = this.blendMode;
                this.addChild(val);
            }, this);
};
