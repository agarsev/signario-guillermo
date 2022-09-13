all:
	echo "build o frontend"

build:
	echo "?"
	#NODE_ENV=production parcel build --no-autoinstall 
	##electron-builder -l -w

frontend: dist/table/index.html dist/detail/index.html

clean:
	rm -rf dist

.PHONY: all build frontend clean

.SECONDEXPANSION:

dist/%/index.html: $$(wildcard src/$$*/*)
	echo $^
	@mkdir -p $(@D)
	NODE_ENV=development parcel build \
			 --no-autoinstall --no-content-hash --no-cache \
			 --no-optimize --target $*

dist/detail/index.html: src/signotator.js src/signotator.css
