var rulesets = new Object({
	'input[type="text"]': {
		focus:
			// clear default message text
			function (e) {
				if(this.value.indexOf('Type')==0){ this.value=''; }
			},
		blur:
			// validate input value
			function (e) {
				// wrong or missing value
				if(this.value==''){ this.style.border='2px solid #f00'; }
				// correct or existing value
				else{ this.style.cssText=''; }
			},
		mouseout:
			// unset highlight
			function () { this.style.backgroundColor=''; },
		mouseover:
			// unset highlight
			function (){ this.style.backgroundColor='#ecf'; }
	},
	'ul li:nth-of-type(even), table td:nth-of-type(even)': {
		mouseout:
			// unset highlight
			function () { this.style.backgroundColor=''; },
		mouseover:
			// set highlight
			function () { this.style.backgroundColor='#fc6'; }
	},
	'ul li:nth-of-type(odd), table td:nth-of-type(odd)': {
		mouseout:
			// unset highlight
			function () { this.style.backgroundColor=''; },
		mouseover:
			// set highlight
			function () { this.style.backgroundColor='#396'; }
	}
});

var i,j;
for (i in rulesets) {
	if (typeof i == 'string') {
		for (j in rulesets[i]) {
			NW.Event.appendDelegate(i,j,rulesets[i][j]);
		}
	}
}
