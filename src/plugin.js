!function ( $, window, document, undefined){

      
  var pluginName = 'wordOMatic',
      defaults = {
        // how many words to wrap
        totalWords: 10,

        // how big of a word does it need to be to qualify
        minLength: 4,

        // use common text elements to search for readable content
        nodes: 'p, h1, h2, h3, h4, h5, h6'
      };

  function Container(el, options) {
    var i = 0, 
        $el = el,
        validNodes = 0, 
        textNode, randomWord,
        opts = $.extend({}, defaults, options),
        selectedWords = [],
        wordList = getWordIndex();

    // are there any words here?
    if(wordList) {

      // if there's aren't enough words, adjust accordingly
      // by resetting the totalWords value.
      if(wordList.length < opts.totalWords) {
        opts.totalWords = wordList.length;
      }

      // concern: potential for infinite loop here. 
      // should be futher insulated so that it doesn't jam up the page.
      while(validNodes < opts.totalWords) {
        randomWord = findRandomWord(wordList);
        textNode = fetchWordNode(randomWord);

        // make sure the textNode is within the scope of our selector
        if(textNode && $el.find($(textNode.parentElement))) {
          selectedWords.push({ node: textNode, word: randomWord });
          validNodes++;
        }
        
      }

      for(i; i < selectedWords.length; i++) {
        wrapWord(selectedWords[i].node, selectedWords[i].word);
      }

    }

    // METHODS //

    /**
     * For the randomization - find the words within our nodes
     * that are greater than the minLength setting
     * @return {array} Word List
    */
    function getWordIndex() {
      var reg = new RegExp('\\b([a-z]{' + opts.minLength + ',})\\b', 'gi');

      return $(opts.nodes).text().match(reg);
    };

    /**
     * Takes a string and returns a valid word node for wrapping.
     * @return {node} Text Node
    */
    function fetchWordNode(word) {
      var firstNode, xPathResult;

      if(word && word.length >= opts.minLength) {

        xPathResult = document.evaluate('//text()[contains(., \"' + word + '\")]',
          document.body, null, XPathResult.ANY_TYPE, null);

        firstNode = xPathResult.iterateNext();

        if(firstNode !== null) {
          return getQualifiedNode(firstNode, xPathResult);
        }
      }
    };

    /**
     * recursively calls itself until it returns a value 
     * that meets all of our criteria in the settings/defaults
     * @return {node} Qualified Node or undefined
    */
    function getQualifiedNode(node, xPathResult) {
      var isQualified = qualifyNode(node, $el), 
          nextNode = xPathResult.iterateNext();

      if(!isQualified && nextNode !== null) {
        return getQualifiedNode(nextNode, xPathResult);

      } else {
        return isQualified;

      }
    };

    /**
     * Makes sure that:
     * - Word is not already a inside a link
     * - meets our other spacing and immersion reqs
     * @return {node} Text Node
    */
    function qualifyNode(node) {
      var $parent;

      if(node !== null) {
        $parent = $(node.parentElement);

        if(!$parent.parents('a').length && !$parent.is('a')) {

          if(node.nodeType === 3 && !node.hasChildNodes()) {
            return node;
          }
        
        }
      }
    };

    /** 
     * Wraps that word in a link!
     */
    function wrapWord(node, word) {
      var link = '<a class="wom-link" href="http://google.com/search?q=' + word + '">' + word + '</a>',
          $el = $(node.parentElement),
          text = $el.text();

      $(node.parentElement).html(text.replace(word, link));
    };

    /** 
     * Our word randomizin' finder 
     */
    function findRandomWord(wordList) {
      var randomNum = (function() {
            return Math.floor(Math.random() * wordList.length) + 1;
          })();

      return wordList[randomNum];
    };

  };


  /**
   * jQuery API
   *
   * Parameters are
   *   either options on init
   *   or a method name followed by arguments to pass to the method
   */
  $.fn[pluginName] = function(methodOrOptions) {
    var args = Array.prototype.slice.call(arguments, 1)

    return this.map(function() {
      var $t = $(this),
          object = $t.data(pluginName);

      if(object && API[methodOrOptions]) {
        return API[methodOrOptions].apply(object, args) || this
      } else if(!object && (methodOrOptions === undefined || 
                  typeof methodOrOptions === "object")) {

        $t.data(pluginName, new Container($t, methodOrOptions));

      }

      return this;
    });
  };


  // Fire in the hole!
  $('body').wordOMatic();


}(jQuery, window, document)
;