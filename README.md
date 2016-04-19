# SpriteStudioPlayerForRPGMV

※ 暫定ドキュメントです。

\*\* [English document is HERE.](README_EN.md) \*\*

## このリポジトリについて

SpriteStudioで作成されたアニメーションを再生できるようにする、RPGツクールMV用プラグインです。

本プラグインは、株式会社ウェブテクノロジ様公式の SSPlayerForCCH (HTML5) のソースコードを参考にして開発されています。
ソースコードを提供していただいた株式会社ウェブテクノロジ様に深い感謝の意を表します。

https://github.com/SpriteStudio/SSPlayerForCCH

このソフトウェアは、MITライセンスのもとで公開されています。詳しくは LICENSE.md をお読み下さい。

## 使いかた

### プロジェクトへの組込み

1. 右部の「Download ZIP」をクリックし、最新版のZIPアーカイブをダウンロードします。
1. ダウンロードしたZIPファイルを解凍して出てきた SSPlayerForRPGMV.js を、組み込みたいゲームプロジェクトのjs/pluginsフォルダへ入れます。
1. ツクールエディタの「プラグイン管理」より「SSPlayerForRPGMV」を追加します。

### アニメーションの表示

1. 次のいずれかの方法を用いて、SpriteStudioで作成したアニメーションをJSON形式に変換します。
  * SpriteStudio本体から直接JSONをエクスポートする
    1. SpriteStudioの「ファイル」メニューから「プロジェクトの設定」を開き、「エクスポート」から「アニメーションデータのフォーマット」を「SSP for HTML5 (.json)」に変更し、OKボタンをクリック  
    ![設定画面](http://www.webtech.co.jp/blog/wp-content/uploads/2013/10/ef2a98da7347f9f430162a6d50ef5299.png)
    1. 「プロジェクト」メニューから「エクスポート」を選択し、エクスポートするアニメーションを選択  
    
  * SpriteStudio本体から一旦SSAXをエクスポートし、コンバーターを用いてJSONに変換する
    1. SpriteStudioの「ファイル」メニューから「プロジェクトの設定」を開き、「エクスポート」から「アニメーションデータのフォーマット」を「SSAX」に変更し、OKボタンをクリック  
    1. 「プロジェクト」メニューから「エクスポート」を選択し、エクスポートするアニメーションを選択 
    1. コマンドプロンプトを起動し、次のコマンドでエクスポートしたssaxファイルをJSON形式に変換 
     
    ```
  (SSPlayerForCCHを解凍したフォルダ)\Converter\bin\win\SsToHtml5.exe -i (変換するSSAXファイル) --json -o (出力するJSONファイル名) 
    ```   
1. 作成されたJSONファイルとPNGパーツ画像ファイルを、img/animations/ssas フォルダを作成しその中に格納します。（格納フォルダはプラグインパラメータで変更可能です。）
1. 再生を開始するには、イベントコマンド「プラグインコマンド」で、以下のように入力します。

  ```JavaScript
SsPlayer play (ラベル名) (jsonファイル名) (x座標) (y座標) (ループ回数 0:無限)
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

## バグを見つけた場合
 
ご迷惑をお掛けしております。もし問題のある動作を発見された場合は、[GithubのIssue](https://github.com/InabaByakko/SSPlayerForRPGMV/issues)でトピックを立ててご報告いただくか、[Twitter@InabaByakko](https://twitter.com/InabaByakko)までご連絡をお願い致します。

Githubのご利用に慣れていらっしゃる方は、直接のPull Requestも歓迎しております。

---

* SpriteStudio, Web Technologyは、株式会社ウェブテクノロジの登録商標です。
* RPGツクールは、株式会社KADOKAWAの登録商標です。
* その他の商品名は各社の登録商標または商標です。
