# SSPlayerForRPGMV

※ 暫定ドキュメントです。

※ I need transrators for this document.

## Description - このリポジトリについて

SpriteStudioで作成されたアニメーションを再生できるようにする、RPGツクールMV用プラグインです。

本プラグインは、株式会社ウェブテクノロジ様公式の SSPlayerForCCH (HTML5) のソースコードを参考にして開発されています。
ソースコードを提供していただいた株式会社ウェブテクノロジ様に深い感謝の意を表します。

https://github.com/SpriteStudio/SSPlayerForCCH

## Usage - 使いかた

### プロジェクトへの組込み

1. 右部の「Download ZIP」をクリックし、最新版のZIPアーカイブをダウンロードします。
1. ダウンロードしたZIPファイルを解凍して出てきた SSPlayerForRPGMV.js を、組み込みたいゲームプロジェクトのjs/pluginsフォルダへ入れます。
1. ツクールエディタの「プラグイン管理」より「SSPlayerForRPGMV」を追加します。

### アニメーションの表示

※ とりあえず表示する方法です。いろいろ融通がききません。不具合もりもりですので随時修正します。

1. SpriteStudioで作成した.ssaファイルを、[こちらの方法](https://github.com/SpriteStudio/SSPlayerForCCH/wiki/%E3%82%B3%E3%83%B3%E3%83%90%E3%83%BC%E3%82%BF%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)でJSON形式に変換します。   
(頂点変形を含むデータの出力は、[developブランチ](https://github.com/SpriteStudio/SSPlayerForCCH/tree/develop)に含まれるコンバータを使用する必要があります。)
1. 作成されたJSONファイルとPNGパーツ画像ファイルを、img/animations/ssas フォルダを作成しその中に格納します。（格納フォルダはプラグインパラメータで変更可能です。）
1. 再生を開始するには、イベントコマンド「プラグインコマンド」で、以下のように入力します。
```JavaScript
SsPlayer play (ラベル名) (jsonファイル名) (x座標) (y座標)
```
1. 再生を停止するには、イベントコマンド「プラグインコマンド」で、以下のように入力します。
```JavaScript
SsPlayer stop (ラベル名) 
```

### 他プラグインで使用する場合の詳細

SsSprite オブジェクトを生成して、イベントコマンド以外の部分から使用する方法です。

1. 何らかの方法で、アニメーションJSONファイルを読み込む。
1. jsonデータから、SsImageListとSsAnimationオブジェクトを生成する。  
```JavaScript
var imageList = new SsImageList(jsonData.images, PluginManager.parameters('SSPlayerForRPGMV')['Animation File Path'], true);
var animation = new SsAnimation(jsonData.animation, imageList);
```
3. SsSpriteオブジェクトを生成する。
```JavaScript
var sprite = new SsSprite(animation);
```
4. Sceneクラス直下やSpriteSetなどにaddChildする。

updateメソッドは、addChildされると毎フレーム定期的に呼び出されます。

表示を消去したい場合は、addChildしたクラスで`removeChild`すればOKです。

---

* SpriteStudio, Web Technologyは、株式会社ウェブテクノロジの登録商標です。
* RPGツクールは、株式会社KADOKAWAの登録商標です。
* その他の商品名は各社の登録商標または商標です。
