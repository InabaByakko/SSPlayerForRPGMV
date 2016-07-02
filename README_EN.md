# SpriteStudioPlayerForRPGMV

\* This is a preliminary document.

\* I'm sorry in poor English. 
I need transrators for this document.

## Description

It is a plug-in for RPG Maker MV allowing an animation made in SpriteStudio to play.

The plug-in has been developed with the source code of SSPlayerForCCH (HTML5) made by Web Technologies Corp. as a reference.  
I'm deeply grateful that Web Technologies Corp. has provided me with the source code.

https://github.com/SpriteStudio/SSPlayerForCCH

This software is released under the MIT License, see LICENSE.md.

## Usage

### Incorporating in your project

1. Press "Download ZIP" button at right of this page to download latest archive. 
1. Extract the ZIP file, the SSPlayerForRPGMV.js in it, you put to your game project of "js/plugins" folder.
1. Install "SSPlayerForRPGMV" from "plug-in management" dialog of the editor.

### Playing an animation

1. Using following coverter program, to convert the animation created in SpriteStudio in JSON format.  
  https://github.com/SpriteStudio/Ss5ConverterToSSAJSON/raw/master/Tools/Ss5ConverterToSSAJSON.zip  
  Please check out this tool's official documents.
  https://github.com/SpriteStudio/Ss5ConverterToSSAJSON/wiki
1. Create folder "img/animations/ssas" to store the JSON file and PNG parts image file that you created in the previous step in it. (Folder path can be changed in the plug-in parameters.)
1. To play your animation, use Event command "Plugin command". For details, look at the plugin help.

### How to use your another plug-ins

If you want to show animations without using event command, you may use SsSprite javascript object. 

1. Load your JSON animation data with any methods.  

  ```JavaScript
// Example of loading JSON data
var xhr = new XMLHttpRequest();
var url = SSP4MV.animationDir+"EXAMPLE.json";
xhr.open('GET', url);
xhr.overrideMimeType('application/json');
xhr.onload = function (key) {
    if (xhr.status < 400) {
        // JThe converted JSON file in the above tools, a number of animation data exists.
        // Please specify the number of the animation you want to play.
        this.jsonData = JSON.parse(xhr.responseText)[0];
    }
} .bind(this, key);
xhr.send();
```
1. Create "SsImageList" object and "SsAnimation" object from JSON data that you were load.  
 For example:
 
  ```JavaScript
var imageList = new SsImageList(jsonData.images, PluginManager.parameters('SSPlayerForRPGMV')['Animation File Path'], true);
var animation = new SsAnimation(jsonData.animation, imageList);
```

3. Create "SsSprite" object from these objects.  
For example:
  
  ```JavaScript
var sprite = new SsSprite(animation);
  ```
  
4. Call `addChild` method of Scene class object or any Sprite objects.

After adding child, "update" method of "SsSprite" object will be called at every frames.

If you want to disappear this animation, call `removeChild` of object that you were added animation object. 

## When you found BUGs

I'm sorry for causing you trouble. If you found some probrem, please report to make a topic at [Issue of Github](https://github.com/InabaByakko/SSPlayerForRPGMV/issues), or mention to [Twitter@InabaByakko](https://twitter.com/InabaByakko).

If you're an expert of Github, I'm glad to be sent pull requests to fix issue.

Thank you for your cooperation.

---

* SpriteStudio, Web Technology is a Registered trademark of WebTechnology Corp.
* RPG Maker is a Registered trademark of KADOKAWA Corp.
* Other product names are trademarks of these companies.