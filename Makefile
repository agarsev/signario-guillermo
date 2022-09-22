build: ENV=NODE_ENV=development

all:
	echo "build o frontend"

build: ENV=NODE_ENV=production
build: clean frontend
	electron-builder -l -w

frontend: dist/table/index.html dist/detail/index.html

clean:
	rm -rf dist

.PHONY: all build frontend clean

.SECONDEXPANSION:

dist/%/index.html: tailwind.config.js $(wildcard src/common/*) $$(wildcard src/$$*/*)
	echo $^
	@mkdir -p $(@D)
	$(ENV) parcel build \
		--no-autoinstall --no-content-hash --no-cache \
		--no-optimize --target $*

dist/detail/index.html: $(wildcard src/signotator/*)
