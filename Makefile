css:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -o css css/_stylus

watchcss:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -w -o css css/_stylus


.PHONY: css
