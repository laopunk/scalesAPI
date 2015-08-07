SCALESAPI.JS
===
## Purpose
This library / module is your javascript swiss knife to easily work around musical scales even if you are not a musician.
Clearly, it will allow you to "sound good" and more importantly "sound in key" when you want to randomly play sounds.
- use cases
	- Find the scale you're in, from a set of chords or notes (Ideal for composers)
	- Find all existing chords and notes in a scale you're interested in working with
- related libraries
	- [notePlayer](https://github.com/laopunk/notePlayer)
	- [chordPlayer](https://github.com/laopunk/chordPlayer)

## Installation:
You may import the code into an existing node.js project or import it directly into your HTML code
- Node module import
```shell
# local install to your project
npm install --save-dev scalesapi
```
```javascript
// import module into your js code
var sc = require('scalesapi') 
```
- plain JS import
```html
<!-- minified version, not human friendly, 56kb-->
<script type="text/javascript" src="scalesAPI.min.js"></script>
<!-- uncompressed version, human friendly, 422kb -->
<script type="text/javascript" src="scalesAPI.js"></script>
```
The module is instanciated in the object sc, which you can use right away
```javascript
getScales("info")
```

## Constructors
No constructor, the library consists of methods only.
It consists of three main functions : 
- getScales: information about chords and notes existing in a scale
- getChords: information about chords existing in a scale
- getNotes:  information about notes existing in a scale


## Methods
##### `getScales(action, [value])`
- getScales("names")
 ```javascript
 getScales("names")        //returns a list like ["Major", "Natural Minor", ...]
 ```
 Get the list of names from all scales available in the config

- getScales("info", [scaleName])
 ```javascript
 getScales("info")         //returns data for all scales
 getScales("info","Major") //returns data for the Major scale only
 ```
 Get scales meta-data information (object) from the config: 
 	- chord sequence for 3 notes chords
 	- chord sequence for 4 notes chords
 	- interval sequence
 If <value> is not provided, return data for all scales

- getScales("object")
 ```javascript
 getScales("object")       //returns object
 ```
 Get scales content from the config, for all keys in all scales: 
  ```javascript
  scaleName
	\__ keyName
        \__ Chords3: [list of chords with 3 notes] 
        \__ Chords4: [list of chords with 4 notes] 
        \__ Notes:   [list of notes present in the scale]
 ```

- getScales("fromChords", chordsArray)
 ```javascript
 getScales("fromChords",[])                          //returns all keys in all scales
 getScales("fromChords",["Amin","Cmaj","Dmin"])      //returns keys in two scales
 ```
 The most popular method. It allows you to know which keys in various scales a set of chords belongs to.
 Returns an object containing this info:
 ```javascript
  scaleName
	\__ keyName
 ```

- getScales("fromNotes", notesArray)
 ```javascript
 getScales("fromNotes",[])                  //returns all keys in all scales
 getScales("fromNotes",["A","C","Db"])      //returns keys in two scales
 ```
 The most popular method. It allows you to know which keys in various scales a set of notes belongs to.
 Returns an object containing this info:
 ```javascript
  scaleName
    \__ keyName
 ```


##### `getChords(scaleName, [key], [nbNotes])`
- getChords("*")
 ```javascript
 getChords("*")        //returns a list of chords
 ```
 Get the full list of unique chords in all scales

- getChords("byRoot")
 ```javascript
 getChords("byRoot")   //returns a list of chords
 ```
 Get the full list of unique chords in all scales, grouped by key

- getChords(scaleName)
 ```javascript
 getChords("Major")   //returns a list of all chords present in the Major scale, all keys included
 ```
 Get the full list of unique chords in a specific scale . The list of available scales can be obtained from getScales("names")

- getChords(scaleName, keyName)
 ```javascript
 getChords("Major","E")   //returns a list of all chords present in the key of E in the Major scale
 ```
 Get the full list of unique chords in a specific scale for a specific key

- getChords(scaleName, keyName, nbNotes)
 ```javascript
 getChords("Major","E", 3)   //returns a list of all 3 notes chords present in the key of E in the Major scale
 getChords("Major","E", 4)   //returns a list of all 4 notes chords present in the key of E in the Major scale
 ```
 Get the full list of unique chords in a specific scale, for a specific key and a specific nb of notes in the chords


##### `getNotes(scaleName, [key])`
- getNotes("*")
 ```javascript
 getNotes("*")        //returns a list of notes
 ```
 Get the full list of unique notes in all scales and all keys. This is the equivalent of the chromatic scale.

- getNotes(scaleName)
 ```javascript
 getNotes("Harmonic Minor")        //returns a list of notes in the harmonic minor scale
 ```
 Get the full list of unique notes in a specicif scale for all keys

- getNotes(scaleName, keyName)
 ```javascript
 getNotes("Harmonic Minor","Eb")        //returns a list of notes in the harmonic minor scale, key of Eb
 ```
 Get the full list of unique notes in a specicif scale for a specific key

