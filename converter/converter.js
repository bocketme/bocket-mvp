let cadConverter = require('./cadConverter');
let	sharedObjectLoader = require("./SharedObjectLoader/build/Release/sharedObjectLoader.node"); 

/**
 * JSimport	Call converter from c++
 * @ame		file_path	The path of the file to be converted
 * @param	info	The convert look module in module/ directory by default
 * @return 	0 on success 1 on error
 */ 

async function JSimport(file_path) {
  // var secondResult = await cadConverter.exportLibrary();
  var result = await cadConverter.convertFiles(file_path);
  return sharedObjectLoader.converter("module", file_path);  

}

exports.JSimport = JSimport;
