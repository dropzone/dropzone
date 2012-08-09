module("funcunit/synthetic/key",{
	setup: function() {
		st.g("qunit-test-area").innerHTML = "<form id='outer'>"+
			"<div id='inner'>"+
				"<input type='input' id='key' value=''/>"+
				"<a href='#abc' id='focusLink'>click me</a>"+
				"<textarea id='synTextArea'></textarea>"+
				"</div></form>";
	}
})
test("Key Characters", function(){
	st.g("key").value = "";
	Syn.key("a","key");
	equals(st.g("key").value, "a", "a written");
	
	st.g("key").value = "";
	Syn.key("A","key");
	equals(st.g("key").value, "A", "A written");
	
	st.g("key").value = "";
	Syn.key("1","key");
	equals(st.g("key").value, "1", "1 written");
})

test("Key Event Order", 1, function(){
	var order = [],
		recorder = function(ev){
			order.push(ev.type)
		};
	
	st.binder("key","keydown", recorder );
	st.binder("key","keypress", recorder );
	st.binder("key","keyup", recorder );
	stop();
	Syn.key("B","key", function(){
		same(order,["keydown","keypress","keyup"],"Key order is correct")
		start();
	});
	
})

test("Key \\r Submits Forms", 1, function(){
	var submit = 0;
	st.binder("outer","submit",function(ev){
		submit++;
		if ( ev.preventDefault ) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	stop()
	Syn.key("\r","key", function(){
		equals(submit, 1, "submit on keypress");
		start();
	})
})

test("Key \\r Clicks Links", 1, function(){
	var clicked = 0;
	st.binder("focusLink","click",function(ev){
		clicked++;
		if ( ev.preventDefault ) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	stop()
	Syn.key("\r","focusLink", function(){
		equals(clicked, 1, "clicked");
		start();
	})
});

test("Key \\r Adds Newline in Textarea", function(){
	st.g('synTextArea').value = "";
	stop()
	Syn.type("ab\rcd","synTextArea", function(){
		equals(  st.g('synTextArea').value.replace("\r","")  , "ab\ncd" ,"typed new line correctly")
		start();
	})
});

test("Key \\b", function(){
	st.g("key").value = "";
	stop();
	Syn.type("abc","key", function(){
		equals(st.g("key").value, "abc", "abc written");
		Syn.key("\b","key");
		equals(st.g("key").value, "ab", "ab written (key deleted)");
		start();
	});
})


//tests when the key is inserted
test("Key Character Order", function(){
	
	var upVal,
		pressVal,
		downVal
	st.binder("key","keyup",function(){
		upVal = st.g("key").value
	} );
	st.binder("key","keypress",function(){
		pressVal = st.g("key").value
		
	} );
	st.binder("key","keydown",function(){
		downVal = st.g("key").value
	} );
	stop();
	Syn.key("J","key", function(){
		equals(upVal, "J" , "Up Typing works")
		equals(pressVal, "" , "Press Typing works")
		equals(downVal, "" , "Down Typing works");
		start();
	})

})

asyncTest("page down, page up, home, end", function(){
	st.g("qunit-test-area").innerHTML = 
		"<div id='scrolldiv' style='width:100px;height:200px;overflow-y:scroll;' tabindex='0'>"+
		"<div id='innerdiv' style='height:1000px;'><a href='javascript://'>Scroll on me</a></div></div>";
	
	//reset the scroll top	
	st.g("scrolldiv").scrollTop =0;
	
	//list of keys to press and what to test after the scroll event
	var keyTest = {
		"page-down": function() {
			ok( st.g("scrolldiv").scrollTop > 10 , "Moved down")
		},
		"page-up": function() {
			ok( st.g("scrolldiv").scrollTop == 0 , "Moved back up (page-up)")
		},
		"end" : function() {
			var sd = st.g("scrolldiv")
			ok( sd.scrollTop == sd.scrollHeight - sd.clientHeight , "Moved to the end")
		},
		"home" : function() {
			ok( st.g("scrolldiv").scrollTop == 0 , "Moved back up (home)")
		}
	},
	order = [],
	i = 0,
	runNext = function(){
		var name = order[i];
		if(!name){
			start();
			return;
		}
		Syn.key( name, "scrolldiv")
	};
	for(var name in keyTest){
		order.push(name)
	}
			
	st.bind(st.g("scrolldiv"),"scroll",function(ev){
		keyTest[order[i]]()
		i++;
		setTimeout(runNext,1)

	} );
	stop(1000);

	st.g("scrolldiv").focus();
	runNext();

})
test("range tests", function(){
	var selectText = function(el, start, end){
		if(el.setSelectionRange){
			if(!end){
                el.focus();
                el.setSelectionRange(start, start);
			} else {
				el.selectionStart = start;
				el.selectionEnd = end;
			}
		}else if (el.createTextRange) {
			//el.focus();
			var r = el.createTextRange();
			r.moveStart('character', start);
			end = end || start;
			r.moveEnd('character', end - el.value.length);
			
			r.select();
		} 
	}
	st.g("qunit-test-area").innerHTML = "<form id='outer'><div id='inner'><input type='input' id='key' value=''/></div></form>"+
		"<textarea id='mytextarea' />";
	
	var keyEl = st.g("key")
	var textAreaEl = st.g("mytextarea")
	
	// test delete range
	keyEl.value = "012345";
	selectText(keyEl, 1, 3);
	
	Syn.key("delete","key")
	
	equals(keyEl.value, "0345", "delete range works");
	
	// test delete key
	keyEl.value = "012345";
	selectText(keyEl, 2);

	Syn.key("delete","key");
	equals(keyEl.value, "01345", "delete works");


	// test character range
	keyEl.value = "123456";
	selectText(keyEl, 1, 3);

	
	Syn.key("a","key");
	equals(keyEl.value, "1a456", "character range works");

	// test character key
	keyEl.value = "123456";
	selectText(keyEl, 2);
	
	Syn.key("a","key");
	equals(keyEl.value, "12a3456", "character insertion works");

	// test backspace range
	keyEl.value = "123456";
	selectText(keyEl, 1, 3);
	Syn.key("\b","key");
	equals(keyEl.value, "1456", "backspace range works");
	
	// test backspace key
	keyEl.value = "123456";
	selectText(keyEl, 2);
	Syn.key("\b","key");
	equals(keyEl.value, "13456", "backspace works");
	
	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	
	Syn.key("delete",textAreaEl);
	equals(textAreaEl.value, "1456", "delete range works in a textarea");

	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	Syn.key("a",textAreaEl);
	equals(textAreaEl.value, "1a456", "character range works in a textarea");
	
	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	Syn.key("\b",textAreaEl);
	equals(textAreaEl.value, "1456", "backspace range works in a textarea");
	
	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	Syn.key("\r",textAreaEl);
	
	equals(textAreaEl.value.replace("\r",""), "1\n456", "return range works in a textarea");
	
    //st.g("qunit-test-area").innerHTML = "";
	
})

test("Type with tabs", function(){
	st.g("qunit-test-area").innerHTML 
		= 	"<input id='third'/>" +
			"<a tabindex='1' id='first' href='javascript://'>First</a>"+
			"<input tabindex='2' id='second'/>"+
			"<input id='fourth'/>"
	st.g('first').focus();
	
	var clicked = 0;
	st.binder('first', 'click', function(){
		clicked++;
	})
	stop();
	//give ie a second to focus
	setTimeout(function(){
		Syn.type('\r\tSecond\tThird\tFourth', 'first', function(){
			equals(clicked,1,"clickd first");
			equals(st.g('second').value,"Second","moved to second");
			equals(st.g('third').value,"Third","moved to Third");
			equals(st.g('fourth').value,"Fourth","moved to Fourth");
			start();
		})
	},1)
});

test("Type with shift tabs", function(){
	st.g("qunit-test-area").innerHTML 
		= 	"<input id='third'/>" +
			"<a tabindex='1' id='first' href='javascript://'>First</a>"+
			"<input tabindex='2' id='second'/>"+
			"<input id='fourth'/>"
	st.g('first').focus();
	
	var clicked = 0;
	st.binder('first', 'click', function(){
		clicked++;
	})
	stop();
	//give ie a second to focus
	setTimeout(function(){
		Syn.type('[shift]4\t3\t2\t\r[shift-up]', 'fourth', function(){
			equals(clicked,1,"clickd first");
			equals(st.g('second').value,"2","moved to second");
			equals(st.g('third').value,"3","moved to Third");
			equals(st.g('fourth').value,"4","moved to Fourth");
			start();
		})
	},1)
});


test("Type left and right", function(){
	stop()
	Syn.type("012345678[left][left][left]\b",'key', function(){
		equals( st.g('key').value, "01234678", "left works" );
		
		
			Syn.type("[right][right]a",'key', function(){
				equals( st.g('key').value, "0123467a8", "right works" );
				start();
			})

	})

	
});
test("Type left and delete", function(){
	stop()
	Syn.type("123[left][delete]",'key', function(){
		equals( st.g('key').value, "12", "left delete works" );
		start();
	})
	
});
test("Typing Shift", function(){
	stop()

	
	var shift = false;
	st.binder('key','keypress', function(ev){
		shift = ev.shiftKey
	})
	Syn.type("[shift]A[shift-up]",'key',function(){
		ok(shift,"Shift key on")
		start();
	})
})
test("Typing Shift then clicking", function(){
	stop()

	var shift = false;
	st.binder('inner','click', function(ev){
		shift = ev.shiftKey
	})
	Syn.type("[shift]A",'key')
		.click({},'inner')
		.type("[shift-up]",'key', function(){
			ok(shift,"Shift key on click")
			start();
		})
})


test("Typing Shift Left and Right", function(){
	stop()

	Syn.type("012345678[shift][left][left][left][shift-up]\b[left]\b",'key', function(){
		equals( st.g('key').value, "01235", "shift left works" );

		
		

		Syn.type("[left][left][shift][right][right]\b[shift-up]",'key', function(){
			
			equals( st.g('key').value, "015", "shift right works" );
			start();
		})

	})
})
