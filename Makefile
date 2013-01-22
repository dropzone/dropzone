css:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -o css css/_stylus/general.styl

watchcss:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -w -o css css/_stylus/general.styl


.PHONY: css
