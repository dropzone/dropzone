module("funcunit/synthetic/mouse",{
	setup: function() {
		st.g("qunit-test-area").innerHTML = "<form id='outer'><div id='inner'>"+
			"<input type='checkbox' id='checkbox'/>"+
			"<input type='radio' name='radio' value='radio1' id='radio1'/>"+
			"<input type='radio' name='radio' value='radio2' id='radio2'/>"+
			"<a href='javascript:doSomething()' id='jsHref'>click me</a>"+
			"<input type='submit' id='submit'/></div></form>"
			
	}
})

test("Syn basics", function(){

        ok(Syn,"Syn exists")
		
		st.g("qunit-test-area").innerHTML = "<div id='outer'><div id='inner'></div></div>"
		var mouseover = 0, mouseoverf = function(){
			mouseover++;
		};
		st.bind(st.g("outer"),"mouseover",mouseoverf );
		Syn("mouseover",st.g("inner"))
		
		st.unbinder("outer","mouseover",mouseoverf );
		equals(mouseover, 1, "Mouseover");
		Syn("mouseover",{},'inner')

		equals(mouseover, 1, "Mouseover on no event handlers");
		st.g("qunit-test-area").innerHTML = "";
		
})

test("Click Forms", function(){
	var submit = 0, submitf = function(ev){
		submit++;
		if ( ev.preventDefault ) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	};
	st.bind(st.g("outer"),"submit",submitf );
	Syn.trigger("click",{},st.g("submit"));
	Syn("submit",{},"outer")
	
	
	equals(submit, 2, "Click on submit");
	
	//make sure clicking the div does not submit the form
	var click =0, clickf = function(ev){
		click++;
		if ( ev.preventDefault ) {
			ev.preventDefault();
		}
		return false;	
	}
	st.binder("inner","click",clickf );
	
	Syn.trigger("click",{},st.g("submit"));
	
	equals(submit, 2, "Submit prevented");
	equals(click, 1, "Clicked");
	
	st.unbinder("outer","submit",submitf );
	st.unbinder("inner","click",clickf );
})
test("Click Checkboxes", function(){
	var checkbox =0;
	
	st.binder("checkbox","change",function(ev){
		checkbox++;	
	});

	st.g("checkbox").checked = false;
	
	Syn.trigger("click",{},st.g("checkbox"));
	
	ok(st.g("checkbox").checked, "click checks on");
	
	Syn.trigger("click",{},st.g("checkbox"));
	
	ok(!st.g("checkbox").checked, "click checks off");
})

test("Checkbox is checked on click", function(){
	var checkbox =0;

	st.g("checkbox").checked = false;
	
	st.binder("checkbox","click",function(ev){
		ok(st.g("checkbox").checked, "check is on during click");
	})
	
	Syn.trigger("click",{},st.g("checkbox"));
})

test("Click Radio Buttons", function(){

	var radio1=0,
		radio2=0;
		
	st.g("radio1").checked = false;
	//make sure changes are called
	st.bind(st.g("radio1"),"change",function(ev){
		radio1++;
	} );
	st.bind(st.g("radio2"),"change",function(ev){
		radio2++;
	} );
	
	Syn.trigger("click",{},st.g("radio1") );
	
	equals(radio1, 1, "radio event");
	ok( st.g("radio1").checked, "radio checked" );
	
	Syn.trigger("click",{},st.g("radio2") );
	
	equals(radio2, 1, "radio event");
	ok( st.g("radio2").checked, "radio checked" );
	
	
	ok( !st.g("radio1").checked, "radio unchecked" );
	
});

test("Click! Event Order", 4, function(){
	var order = 0;
	st.g("qunit-test-area").innerHTML = "<input id='focusme'/>";
	
	
	st.binder("focusme","mousedown",function(){
		equals(++order,1,"mousedown")
	});
	
	st.binder("focusme","focus",function(){
		equals(++order, 2,"focus")
	});
	
	st.binder("focusme","mouseup",function(){
		equals(++order,3,"mouseup")
	});
	st.binder("focusme","click",function(ev){
		equals(++order,4,"click")
		if(ev.preventDefault)
			ev.preventDefault();
		ev.returnValue = false;
	});
	
	stop();
	Syn.click({},"focusme", function(){
		start();
	})
	
})

test("Click Anchor Runs HREF JavaScript", function(){
	var didSomething = false,
		doSomething = window.doSomething;
	window.doSomething = function(){
		didSomething = true;
	}

	
	Syn.trigger("click",{},st.g("jsHref"))
	
	ok( didSomething, "link href JS run" );
	
	window.doSomething = doSomething;
})
test("Click! Anchor Focuses", 2, function(){
	st.g("qunit-test-area").innerHTML = "<a href='#abc' id='focusme'>I am visible</a>";
	
	st.binder("focusme","focus",function(ev){
		ok(true,"focused");
	});
	
	st.binder("focusme","click",function(ev){
		ok(true,"clicked");
		st.g("qunit-test-area").innerHTML ="";
		if(ev.preventDefault)
			ev.preventDefault();
		ev.returnValue = false;
		return false;
	});
	stop();
	//need to give browsers a second to show element
	
	Syn.click({},"focusme", function(){
		start();
	})
	
	

})
test("Click away causes Blur Change", function(){
	st.g("qunit-test-area").innerHTML = "<input id='one'/><input id='two'/>";
	
	var change = 0, blur = 0;
	
	st.binder("one","blur",function(){
		blur++;
	} );
	st.binder("one","change",function(){
		change++;
	} );
	
	stop();
	Syn.click({},"one")
		.key("a")
		.click({},"two", function(){
			start()
			equals(change, 1 , "Change called once");
			equals(blur, 1 , "Blur called once");
		})
	
});

test("Click HTML causes blur  change", function(){
	st.g("qunit-test-area").innerHTML = "<input id='one'/><input id='two'/>";
	
	var change = 0;
	st.binder("one","change",function(){
		change++;
	} );
	
	stop();
	Syn.click({},"one")
		.key("a")
		.click({},document.documentElement, function(){
			start()
			equals(change, 1 , "Change called once");
		})
})
test("Right Click", function(){
	st.g("qunit-test-area").innerHTML = "<div id='one'>right click me</div>";
	stop()
	var context = 0;
	st.binder("one","contextmenu",function(){
		context++;
	});
	
	Syn.rightClick({},"one", function(){
		if(Syn.mouse.browser.contextmenu){
			equals(1, context, "context was called")
		}else{
			ok(true,"context shouldn't be called in this browser")
		}
		start();
	})
})

test("Double Click", function(){
	st.g("qunit-test-area").innerHTML = "<div id='dblclickme'>double click me</div>";
	stop()
	var eventSequence = [];
	st.binder("dblclickme","dblclick",function(){
		eventSequence.push('dblclick');
	});
	st.binder("dblclickme","click",function(){
		eventSequence.push('click');
	});

	Syn.dblclick({},"dblclickme", function(){
		equals(eventSequence.join(', '), 'click, click, dblclick', 'expected event sequence for doubleclick');
		start();
	})
});

// tests against IE9's weirdness where popup windows don't have dispatchEvent
test("h3 click in popup", 1,function(){
	st.g("qunit-test-area").innerHTML = "";

	
	stop();
	/*var page1 = st.rootJoin("funcunit/syn/test/qunit/h3.html"),
		iframe = document.createElement('iframe'),
		calls = 0;
	
	st.bind(iframe,"load",function(){
		var el = iframe.contentWindow.document.getElementById('strange')
		st.bind(el,"click",function(){
			ok(true, "h3 was clicked");
			
		});
		Syn.click( el ,{}, function(){
			start();
		})

			
			
	});
	iframe.src = page1
	st.g("qunit-test-area").appendChild(iframe);*/
	
	
	var popup = window.open( st.rootJoin("funcunit/syn/test/qunit/h3.html"), "synthing")
	
	setTimeout(function(){
		var el = popup.document.getElementById('strange')
		st.bind(el,"click",function(){
			ok(true, "h3 was clicked");
			
		});
		Syn.click( el ,{}, function(){
			start();
			popup.close()
		})

			
			
	},500);
});
