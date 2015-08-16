var _ = require('lodash');

/**
 * @module scalesAPI
 **/
var scalesAPI = (function() {

    /** module:scalesAPI~DICT_SCALES */
    DICT_SCALES = 
            [
                {
                    "name": "Major",
                    "interval_sequence": ["W","W","H","W","W","W","H"],
                    "chord_sequence_3": ["maj","min","min","maj","maj","min","min7b5"],
                    "chord_sequence_4": ["maj7","min7","min7","maj7","7","min7","min7b5"]
                },
                {
                    "name": "Natural Minor",
                    "interval_sequence": ["W","H","W","W","H","W","W"],
                    "chord_sequence_3": ["min","dim","maj","min","min","maj","maj"],
                    "chord_sequence_4": ["min7","min7b5","maj7","min7","min7","maj7","7"]
                },
                {
                    "name": "Melodic Minor",
                    "interval_sequence": ["W","H","W","W","W","W","H"],
                    "chord_sequence_3": ["min","min","aug","maj","maj","dim","dim"],
                    "chord_sequence_4": ["minmaj7","min7","maj7#5","7","7","min7b5","min7b5"]
                },
                {
                    "name": "Harmonic Minor",
                    "interval_sequence": ["W","H","W","W","H","WH","H"],
                    "chord_sequence_3": ["min","min7b5","aug","min","maj","maj","dim"],
                    "chord_sequence_4": ["minmaj7","min7b5","maj7#5","min7","7","maj7","dim7"]
                }

            ];

    /** module:scalesAPI~DICT_KEYS */
    DICT_KEYS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

    /** module:scalesAPI~DICT_TRANSLATIONS */
    var DICT_TRANSLATIONS = {
            "Cb": "B",
            "Db": "C#",
            "Eb": "D#",
            "Fb": "E",
            "Gb": "F#",
            "Ab": "G#",
            "Bb": "A#"
        }

    /**
    * @function getNotes
    * @public
    * @description getNotes(scaleName, [key]) - computes list of notes present in a given scale for a given key
    * @param {string} scaleName - name of the scale you need the notes from or "*" if you want notes from all scales
    * @param {string} key - (optional) key of the scale (the starting point)
    * @returns {Array} Array of Strings (notes in the scale) or empty if not exists
    */
    /** module:scalesAPI~getNotes */
    function getNotes(scaleName,key){
        //check params
        try{
            if( scaleName === void 0 || scaleName === '' ){
                throw "getNotes: 'scaleName' must be set, use '*' if you want all scales"
            }
            if( typeof(scaleName) !== 'string' ){
                throw "getNotes: 'scaleName' must be a string"
            }
            if( key && key === '' ){
                throw "getNotes: 'key', when used, must be set"
            }
            if( key && typeof(key) !== 'string'){
                throw "getNotes: 'key' must be a string"
            }
        }
        catch(err){
            console.error(err+"\n\t USAGE:  getNotes( scaleName, [key] )");
            return []
        }

        try{
            /*
            * Get the list of all all notes from all scales
            */
            if( scaleName === "*" ){
                return DICT_KEYS;
            }

            /*
            * Get the list of all all notes for a specific scale
            * validate scaleName
            */
            if( !isValid('scale',scaleName) ){
                throw "getNotes: scale '"+scaleName+"' is not valid"
            }

            /*
            * Get the list of all all notes for all keys in this scale
            */
            if( !key ){
                return _(DICT_KEYS).map(function(e2){ //parsing all keys
                    return getNotes(scaleName,e2)
                })
                .flattenDeep()
                .uniq()
                .value()
                .sort()
            }

            /*
            * Get the list of all all notes for a specific key in this scale
            */
            //get info from scale
            scale= getScales("info",scaleName)
            //get chromatic list starting from key
            list = getChromaticNotesStartingWith(key)
            //parse list jumping from one note to another based on scale intervals
            notes = []
            for(i=j=0; i<scale.interval_sequence.length; i++){
                notes.push(list[j]);
                switch(scale.interval_sequence[i]){
                    case 'W':
                        j += 2
                        break;
                    case 'H':
                        j += 1
                        break;
                    case 'WH':
                        j += 3
                        break;
                }
            }
            return notes;

        }catch(err){
            console.error(err);
            return null
        }

    }

    /**
    * @function getChords
    * @public
    * @description getChords( scaleName, [key,nbNotes] ) - compiles list of chords present in a given scale for a given key
    * @param {string} scaleName - name of the scale you need the chords from
    * @param {string} key - key of the scale (the starting point)
    * @param {number} nbNotes - precising how many notes in the chords (3 or 4)
    * @returns {Array} Array of Strings (chords in the scale) or empty if not exists
    */
    function getChords(scaleName,key,nbNotes){
        //check params
        try{
            if(scaleName === void 0 || scaleName === ''){
                throw "scaleName must be set, use '*' if you want all scales"
            }
            if( typeof(scaleName) !== 'string'){
                throw "scaleName must be a string"
            }
        }
        catch(err){
            console.error(err+"\n\t USAGE:  getChords( scaleName, [key,nbNotes] )");
            return []
        }


        try{
            /*
            * Get the list of all chords for all scales and keys
            */
            if( scaleName === "*" ){
                return _(getScales("names")).map(function(e){
                    return getChords(e)
                })
                .flattenDeep()
                .uniq()
                .sort()
                .value()
            }

            /*
            * Get the list of all chords by root
            */
            if( scaleName === "byRoot" ){
                return _(getChords("*")).map(function(e){
                    root = ( e.substr(1,1) == "#" ) ? e.substr(0,2) : e.substr(0,1)
                    return [root,e]
                })
                .groupBy(function(e){
                    return e[0]
                })
                .map(function(e,k){
                    return [k,_(e).flattenDeep().uniq().without(k).value()]
                })
                .object()
                .value()
            }

            /*
            * Get the list of all chords for a specific scale
            * verify validity
            */
            if( !isValid('scale',scaleName) ){
                throw "getChords: scale '"+scaleName+"' is not valid"
            }

            /*
            * No key provided, get the list of all chords for all keys in this scale
            */
            if (!key){
                return _(DICT_KEYS).map(function(e){
                    return [getChords(scaleName,e,3),getChords(scaleName,e,4)]
                })
                .flattenDeep()
                .uniq()
                .sort()
                .value()
            }

            /*
            * scaleName is not "*" and is valid and key is provided
            * Get the list of all chords for a specific scale and specific key
            */
            //verify validity
            if( !isValid('key',key)  ){
                throw "getChords: key '"+key+"' is not valid"
            }

            /*
            * Get the list of all chords for a specific scale and specific key and any nb of notes in chords
            */
            if( !nbNotes ){
                return _( 
                    _.zipWith(getNotes(scaleName,key),getScales("info",scaleName)['chord_sequence_'+3],function(e,e2){
                        return e+e2
                    }).concat(
                        _.zipWith(getNotes(scaleName,key),getScales("info",scaleName)['chord_sequence_'+4],function(e,e2){
                            return e+e2
                        })
                    )
                )
                .uniq()
                .sort()
                .value()
            }

            /*
            * verify validity of nb of notes provided
            */
            if( !isValid('nb',nbNotes) ){
                throw "getChords: number of notes '"+nbNotes+"' is not valid, values of 3 and 4 only are allowed"
            }
                
            /*
            * Get the list of all chords for a specific scale and specific key and specific nb of notes in chords
            */
            return _.zipWith(getNotes(scaleName,key),getScales("info",scaleName)['chord_sequence_'+nbNotes],function(e,e2){
                return e+e2
            })

        }catch(err){
            console.error(err+"\n\t USAGE:  getChords( scaleName, [key,nbNotes] )");
            return null
        }
    }


    /**
    * @function getScales
    * @public
    * @description picks scale information or calculates possible scales for a set of notes or chords
    * @param {String} action - determines what is needed from the function : names, info, object, fromChords, fromNotes
    * @param {Array} value - list of notes/chords we want to get the associated scale(s) from
    * @returns {Array|Object} 
    */
    function getScales(action,value){
        //check params
        try{
            if(action === void 0 || action === ''){
                throw "action must be set"
            }
            if( typeof(action) !== 'string'){
                throw "action must be a string"
            }
            if( action !== "names" && action !== "info" && action !== "object" && action !== "fromChords" && action !== "fromNotes"){
                throw "invalid value for action parameter"
            }
        }
        catch(err){
            console.error(err+"\n\t USAGE:  getScales(action,[value])");
            return null
        }

        try{
            switch(action){

                /*
                * Get the list of names from all scales available in the config
                */
                case "names":
                    return _(DICT_SCALES).map(function(e){
                        return e.name
                    })
                    .value()
                    break;


                /*
                * Get the information from the scales available in the config
                * if <value> is not provided, return data for all scales
                */
                case "info":
                    if ( value ){ //return data for a specific scale
                        if( isValid("scale",value) ){ //valid scale name
                            /*pos = _.findIndex(DICT_SCALES, function(obj) {
                                        return obj.name == value;
                                  });
                            return DICT_SCALES[pos]
                            */
                            //compiled query
                            return DICT_SCALES[_.findIndex(DICT_SCALES, function(obj) {return obj.name == value;})]
                        }else{//invalid scale name
                            throw "getScales: scale '"+value+"' is not valid"
                        }
                    }else{ //return meta info for all scales
                            return _(DICT_SCALES).map(function(v,k){
                                return [_.camelCase(v.name),v]
                            })
                            .object()
                            .value()
                    }
                    break;


                /*
                * Get scale computed data as an object (all scales)
                * Object :
                *    scaleName
                *        \__ keyName
                *                \__ Chords3: [list of chords with 3 notes] 
                *                \__ Chords4: [list of chords with 4 notes] 
                *                \__ Notes:   [list of notes present in the scale]
                */
                case "object":
                    return _(getScales("names")).map(function(e){ //parsing each scale
                        scaleName = _.camelCase(e)
                        obj = _(DICT_KEYS).map(function(e2){ //parsing each key
                            chords3 = getChords(e,e2,3);
                            chords4 = getChords(e,e2,4);
                            notes = getNotes(e,e2);
                            return [e2,{"chords3": chords3, "chords4": chords4, "notes": notes}]
                        })
                        .object()
                        .value();
                        return [scaleName,obj];
                    })
                    .object()
                    .value()
                    break;

                
                /*
                * Get the associated scales from a list of given chords or notes
                * Object:
                *     scaleName
                *        \__ [list of keys]
                */
                case "fromChords": 
                    //fall-through to from Notes for code optimisation

                case "fromNotes":
                    kwd = (action == "fromNotes") ? "note" : "chord";

                    //No list provided
                    if ( !value ){ 
                        throw "getScales: your need to provide a list of "+kwd+"s"
                    }

                    //replace possible flats by sharps
                    sharpedList = (action === 'fromNotes') ? replaceFlatsInNotes(value) : replaceFlatsInChords(value)
                    t = _.findIndex(sharpedList,function(e){return !isValid(kwd,e)})

                    //validate notes/chords provided
                    if ( t > -1 ){
                        throw "getScales: "+kwd+" "+value[t]+" is invalid"
                    }

                    //parse each scale and each key in scale
                    return _(getScales("names")).map(function(e){
                        key = _(DICT_KEYS).map(function(e2){
                            if( action === 'fromNotes'){
                                //get notes belonging to this scale
                                    //n = getNotes(e,e2);
                                //compare notes with notes from param (intersection)
                                    //inter = _.intersection(n,sharpedList).sort()
                                //return key name if match
                                    //return (_.isEqual(inter,sharpedList.sort())) ? e2 : null;
                                //compiled query :
                                return (_.isEqual(_.intersection(getNotes(e,e2),sharpedList).sort(),sharpedList.sort())) ? e2 : null;
                            }else{
                                //get chords belonging to this scale
                                    //c = _.uniq(getChords(e,e2,3).concat(getChords(e,e2,4)));
                                //compare notes with notes from param (intersection)
                                    //inter = _.intersection(c,sharpedList).sort()
                                //return key name if match
                                    //return (_.isEqual(inter,sharpedList.sort())) ? e2 : null;
                                //compiled query :
                                return (_.isEqual(_.intersection(_.uniq(getChords(e,e2,3).concat(getChords(e,e2,4))),sharpedList).sort(),sharpedList.sort())) ? e2 : null;
                            }
                        })
                        .compact()
                        .value()
                        return[e,key]
                    })
                    .object()
                    .value()

                        
                    
                    break;

            } //end switch

        }catch(err){
            console.error(err+"\n\t USAGE:  getScales(action,[value])");
            return null
        }
    }

    /**
    * @function
    * @private
    * @description replaces flat (b) by its sharp equivalent (#) 
    * @param {Array} notes - the notes to decode
    * @returns {Array} - decoded notes
    */
    function replaceFlatsInNotes(notes){
        return _(notes).map(function(e){
            return ( e.slice(-1) === "b") ? DICT_TRANSLATIONS[e] : e
        })
        .value()
    }

    /**
    * @function
    * @private
    * @description replaces flat (b) by its sharp equivalent (#) 
    * @param {Array} chords - the chords to decode
    * @returns {Array} - decoded chords
    */
    function replaceFlatsInChords(chords){
        return _(chords).map(function(e){
            //get the note from the chord and replace flat if exists
            return ( e.substr(1,1) === "b") ? DICT_TRANSLATIONS[e.substr(0,2)]+e.substr(2,e.length) : e
        })
        .value()
    }

    /**
    * @function
    * @private
    * @description checks if scalename or note provided as input exists
    * @param {string} what - the area we need to compare the input into (scale,note)
    * @param {string} v - value of the input to check
    * @returns {Bool} true if the input exists
    */
    function isValid(what,v){
        switch (what){
            case "scale":
                return _.findIndex(getScales("names"),function(e){return e == v}) > -1
                break
            case "note": //fall-through to key
            case "key":
                return _.findIndex(DICT_KEYS,function(e){return e == replaceFlatsInNotes([v]).toString()}) > -1
                break
            case "chord":
                return _.findIndex(getChords("*"),function(e){return e == replaceFlatsInChords([v]).toString()}) > -1
                break
            case "nb":
                return ( v == 3 || v == 4)
                break
            default:
                console.error("unrecognized case: "+what)
                return false
        }
    }

    /**
    * @function
    * @private
    * @description returns a chromatic list of ordered notes starting from a given note
    * @param {string} note - the note to start with
    * @returns {Array} Array of Strings (notes) or empty if key does not exist
    */
    function getChromaticNotesStartingWith(key){
        pos = DICT_KEYS.indexOf(replaceFlatsInNotes([key]).toString())
        if ( pos >= 0){ //
            //chunking the array in two and pushing the first chunk at the end
            return DICT_KEYS.slice(pos,DICT_KEYS.length).concat(DICT_KEYS.slice(0,pos))
        }else{
            console.error(key+" is not a recognized note")
            return []
        }
    }



    //Object returned for the module, only public functions are disclosed
    return {
          getScales: getScales
        , getChords: getChords
        , getNotes: getNotes
        //, replaceFlatsInNotes: replaceFlatsInNotes
        //, replaceFlatsInChords: replaceFlatsInChords
        //, isValid: isValid
    };

})();


module.exports = scalesAPI