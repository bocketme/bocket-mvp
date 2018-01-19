
DEST	=	"./lib"

PLUG	=	"./sources/beta-bocket-plugin.tar.gz"

all:
	mkdir $(DEST)
	tar -xvf $(PLUG) -C $(DEST)
	git submodule update
	mkdir build
	cd build
	cmake ../assimp2json --target Bocketassimp2json 

clean:
	rm -rf build
	rm -rf $(DEST)
