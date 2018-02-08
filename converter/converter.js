
//let converterBridge = require('./lib/plugin.node');

let JSexport = function (filePath) {
	//not implemented yet
	return 21;
};

/**
 * This abastract execution of the c++ converter class in javascript
 * consider 'converterInstance' as a representation of a c++ class in JS
 * This meaning taht it should be explicitly new and delete. converterBridge
 * is a factory. A new on it provoc a creation of a new converter instance.
 *
 * @name	JSimport
 * @param	filePath path of the file to be converted
 */

let JSimport = function (filePath) {
	let error = {
		'root' : {},
		'error' : {
			'code' : 1,
			'desc' : ""
		}
	};
	return error;
/*	let geometry = error;
	geometry.error.code = 0;
	try {
		//let converterInstance = converterBridge(filePath);
		if (converterInstance.ready == 1) {
			delete converterInstance;
			error.error.desc = "No converter found for this file format.";
			return error;
		}
		geometry.root = converterInstance.run();
		converterInstance.release();
	} catch (e) {
		error.error.desc = e;
		return error
	}
	console.log(error.error.desc);
	return geometry;*/
};

let converter = {
	"JSimport" : JSimport,
	"JSexport" : JSexport
};

module.exports = converter;
