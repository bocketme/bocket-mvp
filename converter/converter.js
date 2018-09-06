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
  console.log(result);
  // let filePathNoExt = file_path.indexOf(".", file_path.length - 10);
  // let convertedPath = file_path.substring(0, filePathNoExt) + ".obj";
  return sharedObjectLoader.converter("module", file_path);  

}

exports.JSimport = JSimport;
