build:
	coffee -co lib/ src/

watch:
	coffee -cwo lib/ src/

download:
	coffee make_download.coffee


css:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -o downloads/css downloads/css/stylus/*.styl

watchcss:
	./node_modules/stylus/bin/stylus -I node_modules/nib/lib -w -o downloads/css downloads/css/stylus/*.styl



.PHONY: build css
