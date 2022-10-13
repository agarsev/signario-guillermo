ENV:=NODE_ENV=development

all:
	echo "package o frontend"

package: ENV=NODE_ENV=production
package: clean frontend
	electron-builder -l -w

frontend: dist/table/index.html dist/detail/index.html

clean:
	rm -rf dist

.PHONY: all package frontend clean

.SECONDEXPANSION:

dist/%/index.html: tailwind.config.js $(wildcard src/common/*) $$(wildcard src/$$*/*)
	@mkdir -p $(@D)
	$(ENV) parcel build \
		--no-autoinstall --no-content-hash --no-cache \
		--no-optimize --target $*

dist/detail/index.html: $(wildcard src/signotator/*)
