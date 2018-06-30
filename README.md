# SpriteStudioPlayerForRPGMV

\*\* [English document is HERE.](README_EN.md) \*\*

## このプラグインについて

SpriteStudioで作成されたアニメーションを再生できるようにする、RPGツクールMV用プラグインです。

本プラグインは、株式会社ウェブテクノロジ様公式の SSPlayerForCCH (HTML5) のソースコードを参考にして開発されています。
ソースコードを提供していただいた株式会社ウェブテクノロジ様に深い感謝の意を表します。

https://github.com/SpriteStudio/SSPlayerForCCH

このソフトウェアは、MITライセンスのもとで公開されています。詳しくは LICENSE.md をお読み下さい。

### 動作確認済み環境

- RPGツクールMV コアスクリプト バージョン 1.6.2
- RPGツクールMV アツマール版(コミュニティ版) コアスクリプト バージョン 1.1b
- Ss5ConverterToSSAJSON バージョン 1.0.4

## デモ

https://inababyakko.github.io/SSPlayerForRPGMV/SampleProject/index.html

SampleProject フォルダに上記デモのプロジェクトデータが格納されています。

## 使いかた

### プロジェクトへの組込み

1. 右上部の「Clone or download」→「Download ZIP」をクリックし、最新版のZIPアーカイブをダウンロードします。
1. ダウンロードしたZIPファイルを解凍して出てきた SSPlayerForRPGMV.js を、組み込みたいゲームプロジェクトのjs/pluginsフォルダへ入れます。
1. ツクールエディタの「プラグイン管理」より「SSPlayerForRPGMV」を追加します。

### アニメーションの表示

1. こちらのツールを用いて、SpriteStudioプロジェクトファイルをJSONファイル形式に変換します。  
  https://github.com/SpriteStudio/Ss5ConverterToSSAJSON/raw/master/Tools/Ss5ConverterToSSAJSON.zip  
  ツールの使用方法は、公式のドキュメントをご覧ください。  
  https://github.com/SpriteStudio/Ss5ConverterToSSAJSON/wiki
1. 作成されたJSONファイルとPNGパーツ画像ファイルを、img/animations/ssas フォルダを作成しその中に格納します。（格納フォルダはプラグインパラメータで変更可能です。）
1. プラグインコマンドを用いて、変換したアニメーションファイルを再生することが出来ます。詳しくはプラグインヘルプをご覧ください。  
  (\[ツール\]->\[プラグイン管理\]からSsPlayerForRPGMVを選択し\[ヘルプ\]、またはプラグインコマンド入力ダイアログで右クリック->\[プラグインヘルプ\]->SsPlayerForRPGMVを選択)

### 他プラグインで使用する場合の詳細

SsSprite オブジェクトを生成して、イベントコマンド以外の部分から使用する方法です。

1. 何らかの方法で、アニメーションJSONファイルを読み込む。  

  ```JavaScript
// JSON読み込みコード例
var xhr = new XMLHttpRequest();
var url = SSP4MV.animationDir+"EXAMPLE.json";
xhr.open('GET', url);
xhr.overrideMimeType('application/json');
xhr.onload = function (key) {
    if (xhr.status < 400) {
        // 上記コンバータを用いて変換したJSONファイルは複数のアニメーションデータがまとめられているため、再生したいアニメーション番号を指定
        // 通常、アニメーションエディタの最も上のアニメーションが0番で、そこから下に1,2,...と続きます
        this.jsonData = JSON.parse(xhr.responseText)[0];
    }
} .bind(this, key);
xhr.send();
```
1. jsonデータから、SsImageListとSsAnimationオブジェクトを生成する。
  
  ```JavaScript
var imageList = new SsImageList(jsonData.images, SSP4MV.animationDir, true);
var animation = new SsAnimation(jsonData.animation, imageList);
```
3. SsSpriteオブジェクトを生成する。

  ```JavaScript
var sprite = new SsSprite(animation);
```
4. Sceneクラス直下やSpriteSetなどにaddChildする。

updateメソッドは、addChildされると毎フレーム定期的に呼び出されます。

表示を消去したい場合は、addChildしたクラスで`removeChild`すればOKです。

## 応用プラグイン紹介

本プラグインを応用した、システム拡張やグラフィック強化などのプラグインを紹介します。

- ChangeActorBattleAnimationToSsPlayer
    - 戦闘中のアクターグラフィックを、SpriteStudioアニメーションに置き換えます
    - https://github.com/InabaByakko/ChangeActorBattleAnimationToSsPlayer
- ChangeCharacterToSS
    - マップ画面上のアクター及びイベントグラフィックを、SpriteStudioアニメーションに置き換えます
    - https://github.com/InabaByakko/ChangeCharacterToSS

## バグを見つけた場合
 
ご迷惑をお掛けしております。もし問題のある動作を発見された場合は、[GithubのIssue](https://github.com/InabaByakko/SSPlayerForRPGMV/issues)でトピックを立ててご報告いただくか、[Twitter@InabaByakko](https://twitter.com/InabaByakko)までご連絡をお願い致します。

Githubのご利用に慣れていらっしゃる方は、直接のPull Requestも歓迎しております。

---

* SpriteStudio, Web Technologyは、株式会社ウェブテクノロジの登録商標です。
* RPGツクールは、株式会社KADOKAWAの登録商標です。
* その他の商品名は各社の登録商標または商標です。
