
let	sharedObjectLoader = require("./lib/sharedObjectLoader.node"); 

/**
 * JSimport	Call converter from c++
 * @ame		file_path	The path of the file to be converted
 * @param	info	The convert look module in module/ directory by default
 * @return 	0 on success 1 on error
 */

function	JSimport(file_path) {
	return sharedObjectLoader.converter("module", file_path);
}


module.exports = {
	"JSimport" : JSimport
};