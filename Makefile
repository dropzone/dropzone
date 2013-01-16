build:
	coffee -co lib/ src/

watch:
	coffee -cwo lib/ src/

download:
	coffee make_download.coffee


.PHONY: build
