(function($){
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function within
 * @parent dom
 * Returns if the elements are within the position
 * @param {Object} x
 * @param {Object} y
 * @param {Object} cache
 */
$.fn.within= function(x, y, cache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return ret.push(this);

        var offset = cache ? jQuery.data(this,"offset", q.offset()) : q.offset();

        var res =  withinBox(x, y, 
                                      offset.left, offset.top,
                                      this.offsetWidth, this.offsetHeight );

        if(res) ret.push(this);
    });
    
    return this.pushStack( jQuery.unique( ret ), "within", x+","+y );
}


/**
 * @function withinBox
 * returns if elements are within the box
 * @param {Object} left
 * @param {Object} top
 * @param {Object} width
 * @param {Object} height
 * @param {Object} cache
 */
$.fn.withinBox = function(left, top, width, height, cache){
  	var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  this.ret.push(this);

        var offset = cache ? jQuery.data(this,"offset", q.offset()) : q.offset();

        var ew = q.width(), eh = q.height();

		res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( jQuery.unique( ret ), "withinBox", jQuery.makeArray(arguments).join(",") );
}
    
})(jQuery);
(function($){
/**
 * @function compare
 * @parent dom
 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/compare/compare.js 
 * Compares the position of two nodes and returns a bitmask detailing how they are positioned 
 * relative to each other.  You can expect it to return the same results as 
 * [http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
 * Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].
 * <h2>Demo</h2>
 * @demo jquery/dom/compare/compare.html
 * @test jquery/dom/compare/qunit.html
 * @plugin dom/compare
 * @param {HTMLElement} a the first node
 * @param {HTMLElement} b the second node
 * @return {Number} A bitmap with the following digit values:
 * <table class='options'>
 *     <tr><th>Bits</th><th>Number</th><th>Meaning</th></tr>
 *     <tr><td>000000</td><td>0</td><td>Elements are identical.</td></tr>
 *     <tr><td>000001</td><td>1</td><td>The nodes are in different documents (or one is outside of a document).</td></tr>
 *     <tr><td>000010</td><td>2</td><td>Node B precedes Node A.</td></tr>
 *     <tr><td>000100</td><td>4</td><td>Node A precedes Node B.</td></tr>
 *     <tr><td>001000</td><td>8</td><td>Node B contains Node A.</td></tr>
 *     <tr><td>010000</td><td>16</td><td>Node A contains Node B.</td></tr>
 * </table>
 */
jQuery.fn.compare = function(b){ //usually 
	//b is usually a relatedTarget, but b/c it is we have to avoid a few FF errors
	
	try{ //FF3 freaks out with XUL
		b = b.jquery ? b[0] : b;
	}catch(e){
		return null;
	}
	if (window.HTMLElement) { //make sure we aren't coming from XUL element
		var s = HTMLElement.prototype.toString.call(b)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]') return null;
	}
	if(this[0].compareDocumentPosition){
		return this[0].compareDocumentPosition(b);
	}
	if(this[0] == document && b != document) return 8;
	var number = (this[0] !== b && this[0].contains(b) && 16) + (this[0] != b && b.contains(this[0]) && 8),
		docEl = document.documentElement;
	if(this[0].sourceIndex){
		number += (this[0].sourceIndex < b.sourceIndex && 4)
		number += (this[0].sourceIndex > b.sourceIndex && 2)
		number += (this[0].ownerDocument !== b.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(b != docEl && b.sourceIndex <= 0 )) && 1
	}else{
		var range = document.createRange(), 
			sourceRange = document.createRange(),
			compare;
		range.selectNode(this[0]);
		sourceRange.selectNode(b);
		compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
		
	}

	return number;
}

})(jQuery);
(function($){
	var event = $.event, 
		callHanders = function(){
			
		};
	//somehow need to keep track of elements with selectors on them.  When element is removed, somehow we need to know that
	//
	/**
	 * @add jQuery.event.special
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * Called when a drag is first moved over this drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * Called when a drag is dropped on a drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * Called when a drag is moved out of this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 * Called when a drag motion starts and the drop elements are initialized.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * Called repeatedly when a drag is moved over a drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * Called when the drag is done for this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropend"];
	
	
	
	/**
	 * @class jQuery.Drop
	 * @parent specialevents
	 * @plugin jquery/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drop/drop.js
	 * @test jquery/event/drag/qunit.html
	 * 
	 * Provides drop events as a special event to jQuery.  
	 * By binding to a drop event, the your callback functions will be 
	 * called during the corresponding phase of drag.
	 * <h2>Drop Events</h2>
	 * All drop events are called with the native event, an instance of drop, and the drag.  Here are the available drop 
	 * events:
	 * <ul>
	 * 	<li><code>dropinit</code> - the drag motion is started, drop positions are calculated.</li>
	 *  <li><code>dropover</code> - a drag moves over a drop element, called once as the drop is dragged over the element.</li>
	 *  <li><code>dropout</code> - a drag moves out of the drop element.</li>
	 *  <li><code>dropmove</code> - a drag is moved over a drop element, called repeatedly as the element is moved.</li>
	 *  <li><code>dropon</code> - a drag is released over a drop element.</li>
	 *  <li><code>dropend</code> - the drag motion has completed.</li>
	 * </ul>
	 * <h2>Examples</h2>
	 * Here's how to listen for when a drag moves over a drop:
	 * @codestart
	 * $('.drop').live("dropover", function(ev, drop, drag){
	 *   $(this).addClass("drop-over")
	 * })
	 * @codeend
	 * A bit more complex example:
	 * @demo jquery/event/drop/drop.html 1000
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drop = function(callbacks, element){
		jQuery.extend(this,callbacks);
		this.element = element;
	}
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	})
	$.extend($.Drop,{
		lowerName: "drop",
		_elements: [], //elements that are listening for drops
		_responders: [], //potential drop points
		last_active: [],
		endName: "dropon",
		addElement: function( el ) {
			//check other elements
			for(var i =0; i < this._elements.length ; i++  ){
				if(el ==this._elements[i]) return;
			}
			this._elements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._elements.length ; i++  ){
				if(el == this._elements[i]){
					this._elements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			//this.last_active = responder;
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * Gets all elements that are droppable, adds them
		 */
		compile: function( event, drag ) {
			var el, drops, selector, sels;
			this.last_active = [];
			for(var i=0; i < this._elements.length; i++){ //for each element
				el = this._elements[i]
				var drops = $.event.findBySelector(el, eventNames)

				for(selector in drops){ //find the selectors
					sels = selector ? jQuery(selector, el) : [el];
					for(var e= 0; e < sels.length; e++){ //for each found element, create a drop point
						jQuery.removeData(sels[e],"offset");
						this.add(sels[e], new this(drops[selector]), event, drag);
					}
				}
			}
			
		},
		add: function( element, callbacks, event, drag ) {
			element = jQuery(element);
			var responder = new $.Drop(callbacks, element);
			responder.callHandlers(this.lowerName+'init', element[0], event, drag)
			if(!responder._canceled){
				this._responders.push(responder);
			}
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._responders.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i,j, la, toBeActivated, aff, 
				oldLastActive = this.last_active;
				
			for(var d =0 ; d < this._responders.length; d++ ){
				
				if(this.isAffected(point, moveable, this._responders[d])){
					affected.push(this._responders[d]);  
				}
					 
			}
			
			affected.sort(this.sortByDeepestChild); //we should only trigger on lowest children
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			//deactivate everything in last_active that isn't active
			toBeActivated = affected.slice();
			this.last_active = affected;
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j]
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}
			//activate everything in affected that isn't in last_active
			
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var responder, la;
			for(var r =0; r<this._responders.length; r++){
				this._responders[r].callHandlers(this.lowerName+'end', null, event, moveable);
			}
			//go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, event, moveable);
				}
			}
			
			
			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  
		  this._responders = [];
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * Caches positions of draggable elements.  This should be called in dropinit.  For example:
		 * @codestart
		 * dropinit: function( el, ev, drop ) { drop.cache_position() }
		 * @codeend
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * Prevents this drop from being dropped on.
		 */
		cancel: function() {
			this._canceled = true;
		}
	} )
})(jQuery)