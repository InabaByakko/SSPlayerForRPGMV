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

1. Using one of the following methods, to convert the animation created in SpriteStudio in JSON format.
  * To export JSON file directly from SpriteStudio editor:
    1. Open the "Project Settings" from the "File" menu of SpriteStudio, go to "Export" tab, change the value of "Animation data format" to "SSP for HTML5 (.json)", then click the OK button.  
    ![Export Setting(japanese)](http://www.webtech.co.jp/blog/wp-content/uploads/2013/10/ef2a98da7347f9f430162a6d50ef5299.png)
    1. Open the "Export" from the "Project" menu, select your animations to export, then click the OK button.  
    
  * To export SSAX file from SpriteStudio editor, and convert to JSON file using external converter:
    1. Open the "Project Settings" from the "File" menu of SpriteStudio, go to "Export" tab, change the value of "Animation data format" to "SSAX", then click the OK button.  
    1. Open the "Export" from the "Project" menu, select your animations to export, then click the OK button.
    1. Open the "Command prompt", and enter the following command line to convert SSAX files that you exported to JSON format.  
    ```
  path\to\SsPlayerForCCH\Converter\bin\win\SsToHtml5.exe -i (SSAX file path) --json -o (JSON file name) 
    ```   
1. Create folder "img/animations/ssas" to store the JSON file and PNG parts image file that you created in the previous step in it. (Folder path can be changed in the plug-in parameters.)
1. To play your animation, use Event command "Plug-in command", and input value the following:  

  ```JavaScript
SsPlayer play (label name) (json file name) (x position) (y position) (repeat count; 0 means infinity)
```

1. To stop and disappearing your animation, use Event command "Plug-in command", and input value the following:  

  ```JavaScript
SsPlayer stop (label name) 
```

### How to use your another plug-ins

If you want to show animations without using event command, you may use SsSprite javascript object. 

1. Load your JSON animation data with any methods.
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