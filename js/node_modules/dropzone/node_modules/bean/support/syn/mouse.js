//handles mosue events
(function(){

var h = Syn.helpers,
	getWin = h.getWindow;

Syn.mouse = {};
h.extend(Syn.defaults,{
	mousedown: function( options ) {
		Syn.trigger("focus", {}, this)
	},
	click: function() {
		// prevents the access denied issue in IE if the click causes the element to be destroyed
		var element = this;
		try {
			element.nodeType;
		} catch(e){
			return;
		}
		//get old values
		var href,
			radioChanged = Syn.data(element,"radioChanged"),
			scope = getWin(element),
			nodeName = element.nodeName.toLowerCase();
		
		if( (href = Syn.data(element,"href") ) ){
			element.setAttribute('href',href)
		}

		
		
		//run href javascript
		if(!Syn.support.linkHrefJS 
			&& /^\s*javascript:/.test(element.href)){
			//eval js
			var code = element.href.replace(/^\s*javascript:/,"")
				
			//try{
			if (code != "//" && code.indexOf("void(0)") == -1) {
				if(window.selenium){
					eval("with(selenium.browserbot.getCurrentWindow()){"+code+"}")
				}else{
					eval("with(scope){"+code+"}")
				}
			}
		}
		
		//submit a form
		if(!(Syn.support.clickSubmits) &&
			(nodeName == "input" 
			&& element.type == "submit"  ) ||
			nodeName  == 'button' ){
				
			var form =  Syn.closest(element, "form");
			if(form){
				Syn.trigger("submit",{},form)
			}
			
		}
		//follow a link, probably needs to check if in an a.
		if(nodeName == "a" 
			&& element.href 
			&& !/^\s*javascript:/.test(element.href)){
				
			scope.location.href = element.href;
			
		}
		
		//change a checkbox
		if(nodeName == "input" 
			&& element.type == "checkbox"){
			
			//if(!Syn.support.clickChecks && !Syn.support.changeChecks){
			//	element.checked = !element.checked;
			//}
			if(!Syn.support.clickChanges){
				Syn.trigger("change",{},  element );
			}
		}
		
		//change a radio button
		if(nodeName == "input" && element.type == "radio"){  // need to uncheck others if not checked
			
			/*if(!Syn.support.clickChecks && !Syn.support.changeChecks){
				//do the checks manually 
				if(!element.checked){ //do nothing, no change
					element.checked = true;
				}
			}*/
			if(radioChanged && !Syn.support.radioClickChanges){
				Syn.trigger("change",{},  element );
			}
		}
		// change options
		if(nodeName == "option" && Syn.data(element,"createChange")){
			Syn.trigger("change",{}, element.parentNode);//does not bubble
			Syn.data(element,"createChange",false)
		}
	}
})
	

//add create and setup behavior for mosue events
h.extend(Syn.create,{
	mouse : {
		options: function( type, options, element ) {
			var doc = document.documentElement, body = document.body,
				center = [options.pageX || 0, options.pageY || 0],
				//browser might not be loaded yet (doing support code)
				left = Syn.mouse.browser && Syn.mouse.browser.left[type],
				right = Syn.mouse.browser && Syn.mouse.browser.right[type];
			return h.extend({
				bubbles : true,cancelable : true,
				view : window,
				detail : 1,
				screenX : 1, screenY : 1,
				clientX : options.clientX || center[0] -(doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), 
				clientY : options.clientY || center[1] -(doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0),
				ctrlKey : !!Syn.key.ctrlKey, 
				altKey : !!Syn.key.altKey, 
				shiftKey : !!Syn.key.shiftKey, 
				metaKey : !!Syn.key.metaKey,
				button : left && left.button != null ? 
					left.button : 
					right && right.button || (type == 'contextmenu' ? 2 : 0), 
				relatedTarget : document.documentElement
			}, options);
		},
		event : function(type, defaults, element){  //Everyone Else
			var doc = getWin(element).document
			if(doc.createEvent){
				var event;
			
				try {
					event = element.ownerDocument.createEvent('MouseEvents');
					event.initMouseEvent(type, 
						defaults.bubbles, defaults.cancelable, 
						defaults.view, 
						defaults.detail, 
						defaults.screenX, defaults.screenY,defaults.clientX,defaults.clientY,
						defaults.ctrlKey,defaults.altKey,defaults.shiftKey,defaults.metaKey,
						defaults.button,defaults.relatedTarget);
				} catch(e) {
					event = h.createBasicStandardEvent(type,defaults, doc)
				}
				event.synthetic = true;
				return event;
			}else{
				return h.createEventObject(type, defaults, element)
			}
			
		}
	},
	click : {
		setup: function( type, options, element ) {
			var nodeName = element.nodeName.toLowerCase(),
				type; 
				
			//we need to manually 'check' in browser that can't check
			//so checked has the right value
			if(!Syn.support.clickChecks && !Syn.support.changeChecks && nodeName === "input"){
				type = element.type.toLowerCase();//pretty sure lowercase isn't needed
				if(type === 'checkbox'){
					element.checked = !element.checked;
				}
				if(type === "radio"){
					//do the checks manually 
					
					if(!element.checked){ //do nothing, no change
						try{
							Syn.data(element,"radioChanged", true);
						}catch(e){}
						element.checked = true;
					}
				}
			}

			if( 
				nodeName == "a" 
				&& element.href  
				&& !/^\s*javascript:/.test(element.href)){
				
				//save href
				Syn.data(element,"href", element.href)
				
				//remove b/c safari/opera will open a new tab instead of changing the page
				element.setAttribute('href','javascript://')
				//however this breaks scripts using the href
				//we need to listen to this and prevent the default behavior
				//and run the default behavior ourselves. Boo!
			}
			//if select or option, save old value and mark to change
			if(/option/i.test(element.nodeName)){
				var child = element.parentNode.firstChild,
				i = -1;
				while(child){
					if(child.nodeType ==1){
						i++;
						if(child == element) break;
					}
					child = child.nextSibling;
				}
				if(i !== element.parentNode.selectedIndex){
					//shouldn't this wait on triggering
					//change?
					element.parentNode.selectedIndex = i;
					Syn.data(element,"createChange",true)
				}
			}
			
		}
	},
	mousedown : {
		setup: function( type,options, element ) {
			var nn = element.nodeName.toLowerCase();
			//we have to auto prevent default to prevent freezing error in safari
			if(Syn.browser.safari && (nn == "select" || nn == "option" )){
				options._autoPrevent = true;
			}
		}
	}
});
//do support code
(function(){
	if(!document.body){
		setTimeout(arguments.callee,1)
		return;
	}
	var oldSynth = window.__synthTest;
	window.__synthTest = function(){
		Syn.support.linkHrefJS = true;
	}
	var div = document.createElement("div"), 
		checkbox, 
		submit, 
		form, 
		input, 
		select;
		
	div.innerHTML = "<form id='outer'>"+
		"<input name='checkbox' type='checkbox'/>"+
		"<input name='radio' type='radio' />"+
		"<input type='submit' name='submitter'/>"+
		"<input type='input' name='inputter'/>"+
		"<input name='one'>"+
		"<input name='two'/>"+
		"<a href='javascript:__synthTest()' id='synlink'></a>"+
		"<select><option></option></select>"+
		"</form>";
	document.documentElement.appendChild(div);
	form = div.firstChild
	checkbox = form.childNodes[0];
	submit = form.childNodes[2];
	select = form.getElementsByTagName('select')[0]
	
	checkbox.checked = false;
	checkbox.onchange = function(){
		Syn.support.clickChanges = true;
	}

	Syn.trigger("click", {}, checkbox)
	Syn.support.clickChecks = checkbox.checked;

	checkbox.checked = false;
	
	Syn.trigger("change", {}, checkbox);
	
	Syn.support.changeChecks = checkbox.checked;
	
	form.onsubmit = function(ev){
		if (ev.preventDefault) 
			ev.preventDefault();
		Syn.support.clickSubmits = true;
		return false;
	}
	Syn.trigger("click", {}, submit)

		
	
	form.childNodes[1].onchange = function(){
		Syn.support.radioClickChanges = true;
	}
	Syn.trigger("click", {}, form.childNodes[1])
	
	
	Syn.bind(div, 'click', function(){
		Syn.support.optionClickBubbles = true;
		Syn.unbind(div,'click', arguments.callee)
	})
	Syn.trigger("click",{},select.firstChild)
	
	
	Syn.support.changeBubbles = Syn.eventSupported('change');
	
	//test if mousedown followed by mouseup causes click (opera), make sure there are no clicks after this
	var clicksCount = 0
	div.onclick = function(){
		Syn.support.mouseDownUpClicks = true;
		//we should use this to check for opera potentially, but would
		//be difficult to remove element correctly
		//Syn.support.mouseDownUpRepeatClicks = (2 == (++clicksCount))
	}
	Syn.trigger("mousedown",{},div)
	Syn.trigger("mouseup",{},div)
	
	//setTimeout(function(){
	//	Syn.trigger("mousedown",{},div)
	//	Syn.trigger("mouseup",{},div)
	//},1)
	
	
	document.documentElement.removeChild(div);
	
	//check stuff
	window.__synthTest = oldSynth;
	Syn.support.ready++;
})();


})()
