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
 * Plug-in commands:
 *   # Play an animation data saved in file "animdata.json"
 *   # at position (300, 400), and put the label named
 *   # "label". It is repeated endlessly.
 *   SsPlayer play label animdata.json 300 400
 *   
 *   # Stop an animation which a label called "label" was
 *   # attached to.
 *   SsPlayer stop label
 *   
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
 * プラグインコマンド:
 *   # animdata.json に保存されたアニメーションデータを、
 *   # labelという名前でラベルを付け、(300, 400)の座標で
 *   # 停止するまで無限に再生します。
 *   SsPlayer play label animdata.json 300 400
 *   
 *   # ラベル名labelで再生したアニメーションを停止します。
 *   SsPlayer stop label
 */

(function() {
	
	var parameters = PluginManager.parameters('SSPlayerForRPGMV');
    var animationDir = String(parameters['Animation File Path'] || "img/animations/ssas") + "/";
	
    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SsPlayer" && args[0] === "play") {
    	$gameScreen.addToSsPlayList(args[1], new SsPlayer());
    	$gameScreen.getSsPlayerByLabel(args[1]).loadAnimation(args[2], args[3], args[4]);
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
	    var url = animationDir+filename;
	    xhr.open('GET', url);
	    xhr.overrideMimeType('application/json');
	    xhr.onload = function(x, y) {
	        if (xhr.status < 400) {
	            this.jsonData = JSON.parse(xhr.responseText)[0];
	            var imageList = new SsImageList(this.jsonData.images, animationDir, true);
	            var animation = new SsAnimation(this.jsonData.animation, imageList);
	            this.sprite = new SsSprite(animation);
	            this.sprite.x = x;
	            this.sprite.y = y;
	        }
	    }.bind(this, x, y);
//	    xhr.onerror = function() {
//	        DataManager._errorUrl = DataManager._errorUrl || url;
//	    };
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
	
	Game_Screen.prototype.addToSsPlayList = function(label, player) {
		if (label in this._ssPlayList.players) {
    		// TODO:消去処理をいれる
    	}
		this._ssPlayList.players[label] = player;
	};
	
	Game_Screen.prototype.removeSsPlayerByLabel = function(label) {
		this._ssPlayList.players[label].dispose();
		this._ssPlayList.players[label] = null;
	};
	
	Game_Screen.prototype.getSsPlayerByLabel = function(label) {
		return this._ssPlayList.players[label];
	};
	
	Game_Screen.prototype.getSsSprites = function() {
		var result = [];
		for (var key in this._ssPlayList.players) {
			if (this._ssPlayList.players[key] != null && this._ssPlayList.players[key].sprite != null) {
				result.push(this._ssPlayList.players[key].sprite);
			}
		}
		return result;
	};
	
	var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
	Spriteset_Base.prototype.createUpperLayer = function(){
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
		preparedSprites.forEach(function(sprite, index, array){
			if (this._ssContainer.children.indexOf(sprite) < 0){
				this._ssContainer.addChild(sprite)
			}
		}, this);
		
		this._ssContainer.children.forEach(function(sprite, index, array){
			if (preparedSprites.indexOf(sprite) < 0 ) {
				this._ssContainer.removeChild(sprite);
			}
		}, this);
	};
	
})();
////////////////////////////////////////////////////////////
// SsImageList
////////////////////////////////////////////////////////////

function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoad) {

	this.fileRoot = aFileRoot;
	this.imagePaths = new Array();
	this.images = new Array();

	// ロード完了時に呼ばれるコールバック
	// Callback that is called when the load is finished.
	this.onLoad = aOnLoad;

	// 全部読み込まれた場合のみユーザーが設定したコールバックを呼ぶ
	// Only when it is all loaded, is called a callback set by the user.
	this.onLoad_ = function () {
		for (var i in this.images)
			if (i != null && i.complete == false)
				return;
		if (this.onLoad != null)
			this.onLoad();
	}

	for (var i = 0; i < imageFiles.length; i++) {
		var path = this.fileRoot + imageFiles[i];
		this.imagePaths.push(path);
		var image = new Image();
		if (loadImmediately)
		{
			image.onload = this.onLoad_;
			image.src = path;
		}
		this.images.push(image);
	}
}

// 指定したインデックスのImageを返す
// Get image at specified index.
SsImageList.prototype.getImage = function (index) {
	if (index < 0 || index >= this.images.length) return null;
	return this.images[index];
}

// 指定したインデックスの画像をimagePathで差し替える。
// Replace image of specified index at imagePath.
SsImageList.prototype.setImage = function (index, imagePath) {
	if (index < 0 || index >= this.images.length) return null;
	this.imagePaths[index] = this.fileRoot + imagePath;
	this.images[index].onload = this.onLoad_;
	this.images[index].src = this.imagePaths[index];
}

// ロード完了時コールバックを設定する
// Set a callback when load is finished.
SsImageList.prototype.setOnLoad = function (cb) {
	this.onLoad = cb;
}


////////////////////////////////////////////////////////////
// SsPartState
////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////
// SsAnimation
////////////////////////////////////////////////////////////

function SsAnimation(ssaData, imageList) {

	this.ssaData = ssaData;
	this.imageList = imageList;

	this.partsMap = new Array();
	this.parts = ssaData.parts;
	for (var i = 0; i < this.parts.length; i++) {
		this.partsMap[this.parts[i]] = i;
	}
}

// このアニメーションのFPS
// This animation FPS.
SsAnimation.prototype.getFPS = function () {
	return this.ssaData.fps;
}

// トータルフレーム数を返す
// Get total frame count.
SsAnimation.prototype.getFrameCount = function () {
	return this.ssaData.ssa.length;
}

// パーツリストを返す
// Get parts list.
SsAnimation.prototype.getParts = function () {
	return this.ssaData.parts;
}

// パーツ名からNoを取得するマップを返す
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function () {
	return this.partsMap;
}

// 描画メソッド
// Draw method.
SsAnimation.prototype.getPartSprites = function (frameNo, flipH, flipV, partStates, scale) {
	var sprites = [];

	var iPartNo = 0;
	var iImageNo = 1;
	var iSouX = 2;
	var iSouY = 3;
	var iSouW = 4;
	var iSouH = 5;
	var iDstX = 6;
	var iDstY = 7;
	var iDstAngle = 8;
	var iDstScaleX = 9;
	var iDstScaleY = 10;
	var iOrgX = 11;
	var iOrgY = 12;
	var iFlipH = 13;
	var iFlipV = 14;
	var iAlpha = 15;
	var iBlend = 16;
	var iVertULX = 17;
	var iVertULY = 18;
	var iVertURX = 19;
	var iVertURY = 20;
	var iVertDLX = 21;
	var iVertDLY = 22;
	var iVertDRX = 23;
	var iVertDRY = 24;

	var blendOperations = new Array(
		"source-over",
		"source-over",
		"lighter",
		"source-over"
	);

	var frameData = this.ssaData.ssa[frameNo];
	for (var refNo = 0; refNo < frameData.length; refNo++) {

		var partData = frameData[refNo];
		var partDataLen = partData.length;

		var partNo = partData[iPartNo];
		var basetexture = PIXI.BaseTexture.fromImage(this.imageList.imagePaths[partData[iImageNo]]);
		var sx = partData[iSouX];
		var sy = partData[iSouY];
		var sw = partData[iSouW];
		var sh = partData[iSouH];
		var dx = partData[iDstX];
		var dy = partData[iDstY];

		var vdw = sw;
		var vdh = sh;

		//dx += x;
		//dy += y;

		if (sw > 0 && sh > 0) {

			var dang = partData[iDstAngle];
			var scaleX = partData[iDstScaleX];
			var scaleY = partData[iDstScaleY];

			var ox = (partDataLen > iOrgX) ? partData[iOrgX] : 0;
			var oy = (partDataLen > iOrgY) ? partData[iOrgY] : 0;
			var fh = (partDataLen > iFlipH) ? (partData[iFlipH] != 0 ? -1 : 1) : (1);
			var fv = (partDataLen > iFlipV) ? (partData[iFlipV] != 0 ? -1 : 1) : (1);
			var alpha = (partDataLen > iAlpha) ? partData[iAlpha] : 1.0;
			var blend = (partDataLen > iBlend) ? partData[iBlend] : 0;
			var translate = [
			            (partDataLen > iVertULX) ? partData[iVertULX] : 0,
						(partDataLen > iVertULY) ? partData[iVertULY] : 0,
						(partDataLen > iVertURX) ? partData[iVertURX] : 0,
						(partDataLen > iVertURY) ? partData[iVertURY] : 0,
						(partDataLen > iVertDLX) ? partData[iVertDLX] : 0,
						(partDataLen > iVertDLY) ? partData[iVertDLY] : 0,
						(partDataLen > iVertDRX) ? partData[iVertDRX] : 0,
						(partDataLen > iVertDRY) ? partData[iVertDRY] : 0
								];
			
			// 頂点変形データがあるかないかでSpriteとStripを分ける
			if (partDataLen > iVertDLX) {
				var texture = new PIXI.Texture(basetexture);
				var tex_w = texture.width;
				var tex_h = texture.height;
				var spr_part = new PIXI.Strip(texture);
				var verts = new Float32Array([
				                              (-ox + translate[0]), (-oy + translate[1]) ,
				                              (sw - ox + translate[2]), (-oy + translate[3]),
				                              (-ox + translate[4]), (sh - oy + translate[5]),
				                              (sw - ox + translate[6]), (sh - oy + translate[7])
				                              ]);
				var uvs = new Float32Array([
				                            sx / tex_w, sy / tex_h,
				                            (sx+sw) / tex_w, sy / tex_h,
				                            sx / tex_w, (sy+sh) / tex_h,
				                            (sx+sw) / tex_w, (sy+sh) / tex_h,
				                            ]);
				spr_part.vertices = verts;
				spr_part.uvs = uvs;
				spr_part.pivot = new PIXI.Point(ox*1.0 / sw, oy*1.0 / sh);
				spr_part.dirty = true;
			} else {
				var texture = new PIXI.Texture(basetexture, new PIXI.Rectangle(sx, sy, sw, sh));
				var spr_part = new PIXI.Sprite(texture);
				spr_part.anchor = new PIXI.Point(ox*1.0 / sw, oy*1.0 / sh);
			}
			spr_part.position = new PIXI.Point(dx, dy);
			spr_part.rotation = -dang; 
			spr_part.scale = new PIXI.Point(fh, fv);

			sprites.push(spr_part);
			
		}

		var state = partStates[partNo];
		state.x = dx;
		state.y = dy;
	}
	
	return sprites;
}


////////////////////////////////////////////////////////////
// SsSprite
////////////////////////////////////////////////////////////

function SsSprite(animation) {
	PIXI.DisplayObjectContainer.call( this );

	// プライベート変数
	// Private variables.
	this.inner = {
		animation: animation,
		playingFrame: 0,
		prevDrawnTime: 0,
		step: 1,
		loop: 0,
		loopCount: 0,
		endCallBack: null,    // draw end callback

		partStates: null,
		initPartStates: function () {
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
	this.anchor = new PIXI.Point(0,0);
	this.inner.initPartStates();
	
}

SsSprite.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
SsSprite.prototype.constructor = SsSprite;

// ※未実装
// *Not implemented.
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// アニメーションの設定
// Set animation.
SsSprite.prototype.setAnimation = function (animation) {
	this.inner.animation = animation;
	this.inner.initPartStates();
	this.inner.playingFrame = 0;
	this.inner.prevDrawnTime = 0;
	this.clearLoopCount();
}

// 座標一括設定
// Set position.
SsSprite.prototype.move = function (x, y) {
	this.position.x = x;
	this.position.y = y;
}

// アニメーションの取得
// Get animation.
SsSprite.prototype.getAnimation = function () {
	return this.inner.animation;
}

// 再生フレームNoを設定
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function (frameNo) {
	this.inner.playingFrame = frameNo;
	this.inner.prevDrawnTime = 0;
}

// 再生フレームNoを取得
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function () {
	return this.inner.playingFrame >> 0;
}

// 再生スピードを設定 (1:標準)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function (step) {
	this.inner.step = step;
}

// 再生スピードを取得
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function () {
	return this.inner.step;
}

// ループ回数の設定 (0:無限)
// Set a playback loop count.  (0:infinite)
SsSprite.prototype.setLoop = function (loop) {
	if (loop < 0) return;
	this.inner.loop = loop;
}

// ループ回数の設定を取得
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function () {
	return this.inner.loop;
}

// 現在の再生回数を取得
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function () {
	return this.inner.loopCount;
}

// 現在の再生回数をクリア
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function () {
	this.inner.loopCount = 0;
}

// アニメーション終了時のコールバックを設定
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function (func) {
	this.inner.endCallBack = func;
}

// パーツの状態（現在のX,Y座標など）を取得
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function (name) {
	if (this.inner.partStates == null) return null;

	var partsMap = this.inner.animation.getPartsMap();
	var partNo = partsMap[name];
	if (partNo == null) return null;
	return this.inner.partStates[partNo];
}

// 描画実行
// Drawing method.
	SsSprite.prototype.update = function() {
		if (this.inner.animation == null)
			return;

		if (this.inner.loop == 0 || this.inner.loop > this.inner.loopCount) {
			// フレームを進める
			// To next frame.
			this.inner.playingFrame += (1.0 / (60 / this.inner.animation
					.getFPS()))
					* this.inner.step;

			var c = (this.inner.playingFrame / this.inner.animation
					.getFrameCount()) >> 0;

			if (this.inner.step >= 0) {
				if (this.inner.playingFrame >= this.inner.animation
						.getFrameCount()) {
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
						// 再生停止、先頭フレームへ
						// Stop animation, to first frame.
						this.inner.playingFrame = 0;
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
			this.inner.playingFrame = 0;
		}

		if (this.children.length > 0)
			this.removeChildren(0, this.children.length);

		this.inner.animation.getPartSprites(this.getFrameNo(),this.flipH, this.flipV, 
			                          this.inner.partStates, this.scale).forEach(function(val,index,ar){
			this.addChild(val);
		},this);
	}

