

all:	converter
	npm i

converter:
	mkdir -p module
	make -C converter/bocket-plugin

.PHONY:	all converter
