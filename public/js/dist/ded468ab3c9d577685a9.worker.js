/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

eval("/**\n * Worker who add a Part\n * @param event\n */\nonAddPart = function (event) {\n    let json = event.data;\n    var meshes = parseList(json.meshes, parseMesh);\n    var materials = parseList(json.materials, parseMaterial);\n    postMessage(parseObject(json, json.rootnode, meshes, materials));\n};\n\nfunction parseList(json, handler) {\n    let meshes;\n\n    for(let i = 0; i < json.length; ++ i){\n        meshes.push(handler.call( this , json[ i ] ));\n    }\n    return meshes;\n}\n\nfunction parseMesh( json ){\n    var geometry = new THREE.BufferGeometry();\n\n    var i, l, face;\n\n    var indices = [];\n\n    var vertices = json.vertices || [];\n    var normals = json.normals || [];\n    var uvs = json.texturecoords || [];\n    var colors = json.colors || [];\n\n    uvs = uvs[ 0 ] || []; // only support for a single set of uvs\n\n    for ( i = 0, l = json.faces.length; i < l; i ++ ) {\n\n        face = json.faces[ i ];\n        indices.push( face[ 0 ], face[ 1 ], face[ 2 ] );\n\n    }\n\n    geometry.setIndex( indices );\n    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );\n\n    if ( normals.length > 0 )\n        geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );\n\n    if ( uvs.length > 0 )\n        geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );\n\n    if ( colors.length > 0 )\n        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );\n\n    geometry.computeBoundingSphere();\n\n    return geometry;\n}\n\n\nfunction parseMaterial( json ) {\n\n    var material = new THREE.MeshPhongMaterial();\n\n    for ( var i in json.properties ) {\n\n        var property = json.properties[ i ];\n        var key = property.key;\n        var value = property.value;\n\n        switch ( key ) {\n\n            case '$tex.file': {\n                var semantic = property.semantic;\n\n                // prop.semantic gives the type of the texture\n                // 1: diffuse\n                // 2: specular mao\n                // 5: height map (bumps)\n                // 6: normal map\n                // more values (i.e. emissive, environment) are known by assimp and may be relevant\n\n                if ( semantic === 1 || semantic === 2 || semantic === 5 || semantic === 6 ) {\n                    var keyname;\n                    switch ( semantic ) {\n                        case 1:\n                            keyname = 'map';\n                            break;\n                        case 2:\n                            keyname = 'specularMap';\n                            break;\n                        case 5:\n                            keyname = 'bumpMap';\n                            break;\n                        case 6:\n                            keyname = 'normalMap';\n                            break;\n                    }\n\n                    var texture = textureLoader.load( value );\n\n                    // TODO: read texture settings from assimp.\n                    // Wrapping is the default, though.\n                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;\n                    material[ keyname ] = texture;\n                }\n                break;\n            }\n\n            case '?mat.name':\n                material.name = value;\n                break;\n\n            case '$clr.diffuse':\n                material.color.fromArray( value );\n                break;\n\n            case '$clr.specular':\n                material.specular.fromArray( value );\n                break;\n\n            case '$clr.emissive':\n                material.emissive.fromArray( value );\n                break;\n\n            case '$mat.shininess':\n                material.shininess = value;\n                break;\n\n            case '$mat.shadingm':\n                // aiShadingMode_Flat\n                material.flatShading = ( value === 1 ) ? true : false;\n                break;\n\n            case '$mat.opacity':\n                if ( value < 1 ) {\n                    material.opacity = value;\n                    material.transparent = true;\n                }\n                break;\n        }\n    }\n    return material;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3RocmVlLmpzIC0gdmlld2VyL2xvYWRlci9hc3NpbXAyanNvbi53b3JrZXIuanM/NzZlZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUI7O0FBRXpCLHVDQUF1QyxPQUFPOztBQUU5QztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogV29ya2VyIHdobyBhZGQgYSBQYXJ0XG4gKiBAcGFyYW0gZXZlbnRcbiAqL1xub25BZGRQYXJ0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGpzb24gPSBldmVudC5kYXRhO1xuICAgIHZhciBtZXNoZXMgPSBwYXJzZUxpc3QoanNvbi5tZXNoZXMsIHBhcnNlTWVzaCk7XG4gICAgdmFyIG1hdGVyaWFscyA9IHBhcnNlTGlzdChqc29uLm1hdGVyaWFscywgcGFyc2VNYXRlcmlhbCk7XG4gICAgcG9zdE1lc3NhZ2UocGFyc2VPYmplY3QoanNvbiwganNvbi5yb290bm9kZSwgbWVzaGVzLCBtYXRlcmlhbHMpKTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlTGlzdChqc29uLCBoYW5kbGVyKSB7XG4gICAgbGV0IG1lc2hlcztcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgKysgaSl7XG4gICAgICAgIG1lc2hlcy5wdXNoKGhhbmRsZXIuY2FsbCggdGhpcyAsIGpzb25bIGkgXSApKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lc2hlcztcbn1cblxuZnVuY3Rpb24gcGFyc2VNZXNoKCBqc29uICl7XG4gICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG5cbiAgICB2YXIgaSwgbCwgZmFjZTtcblxuICAgIHZhciBpbmRpY2VzID0gW107XG5cbiAgICB2YXIgdmVydGljZXMgPSBqc29uLnZlcnRpY2VzIHx8IFtdO1xuICAgIHZhciBub3JtYWxzID0ganNvbi5ub3JtYWxzIHx8IFtdO1xuICAgIHZhciB1dnMgPSBqc29uLnRleHR1cmVjb29yZHMgfHwgW107XG4gICAgdmFyIGNvbG9ycyA9IGpzb24uY29sb3JzIHx8IFtdO1xuXG4gICAgdXZzID0gdXZzWyAwIF0gfHwgW107IC8vIG9ubHkgc3VwcG9ydCBmb3IgYSBzaW5nbGUgc2V0IG9mIHV2c1xuXG4gICAgZm9yICggaSA9IDAsIGwgPSBqc29uLmZhY2VzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cbiAgICAgICAgZmFjZSA9IGpzb24uZmFjZXNbIGkgXTtcbiAgICAgICAgaW5kaWNlcy5wdXNoKCBmYWNlWyAwIF0sIGZhY2VbIDEgXSwgZmFjZVsgMiBdICk7XG5cbiAgICB9XG5cbiAgICBnZW9tZXRyeS5zZXRJbmRleCggaW5kaWNlcyApO1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIHZlcnRpY2VzLCAzICkgKTtcblxuICAgIGlmICggbm9ybWFscy5sZW5ndGggPiAwIClcbiAgICAgICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIG5vcm1hbHMsIDMgKSApO1xuXG4gICAgaWYgKCB1dnMubGVuZ3RoID4gMCApXG4gICAgICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3V2JywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIHV2cywgMiApICk7XG5cbiAgICBpZiAoIGNvbG9ycy5sZW5ndGggPiAwIClcbiAgICAgICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnY29sb3InLCBuZXcgVEhSRUUuRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggY29sb3JzLCAzICkgKTtcblxuICAgIGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xuXG4gICAgcmV0dXJuIGdlb21ldHJ5O1xufVxuXG5cbmZ1bmN0aW9uIHBhcnNlTWF0ZXJpYWwoIGpzb24gKSB7XG5cbiAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoKTtcblxuICAgIGZvciAoIHZhciBpIGluIGpzb24ucHJvcGVydGllcyApIHtcblxuICAgICAgICB2YXIgcHJvcGVydHkgPSBqc29uLnByb3BlcnRpZXNbIGkgXTtcbiAgICAgICAgdmFyIGtleSA9IHByb3BlcnR5LmtleTtcbiAgICAgICAgdmFyIHZhbHVlID0gcHJvcGVydHkudmFsdWU7XG5cbiAgICAgICAgc3dpdGNoICgga2V5ICkge1xuXG4gICAgICAgICAgICBjYXNlICckdGV4LmZpbGUnOiB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbWFudGljID0gcHJvcGVydHkuc2VtYW50aWM7XG5cbiAgICAgICAgICAgICAgICAvLyBwcm9wLnNlbWFudGljIGdpdmVzIHRoZSB0eXBlIG9mIHRoZSB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgLy8gMTogZGlmZnVzZVxuICAgICAgICAgICAgICAgIC8vIDI6IHNwZWN1bGFyIG1hb1xuICAgICAgICAgICAgICAgIC8vIDU6IGhlaWdodCBtYXAgKGJ1bXBzKVxuICAgICAgICAgICAgICAgIC8vIDY6IG5vcm1hbCBtYXBcbiAgICAgICAgICAgICAgICAvLyBtb3JlIHZhbHVlcyAoaS5lLiBlbWlzc2l2ZSwgZW52aXJvbm1lbnQpIGFyZSBrbm93biBieSBhc3NpbXAgYW5kIG1heSBiZSByZWxldmFudFxuXG4gICAgICAgICAgICAgICAgaWYgKCBzZW1hbnRpYyA9PT0gMSB8fCBzZW1hbnRpYyA9PT0gMiB8fCBzZW1hbnRpYyA9PT0gNSB8fCBzZW1hbnRpYyA9PT0gNiApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleW5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoIHNlbWFudGljICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleW5hbWUgPSAnbWFwJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXluYW1lID0gJ3NwZWN1bGFyTWFwJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXluYW1lID0gJ2J1bXBNYXAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleW5hbWUgPSAnbm9ybWFsTWFwJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCB2YWx1ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHJlYWQgdGV4dHVyZSBzZXR0aW5ncyBmcm9tIGFzc2ltcC5cbiAgICAgICAgICAgICAgICAgICAgLy8gV3JhcHBpbmcgaXMgdGhlIGRlZmF1bHQsIHRob3VnaC5cbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZS53cmFwUyA9IHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxbIGtleW5hbWUgXSA9IHRleHR1cmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlICc/bWF0Lm5hbWUnOlxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnJGNsci5kaWZmdXNlJzpcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5jb2xvci5mcm9tQXJyYXkoIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyRjbHIuc3BlY3VsYXInOlxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyLmZyb21BcnJheSggdmFsdWUgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnJGNsci5lbWlzc2l2ZSc6XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuZnJvbUFycmF5KCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICckbWF0LnNoaW5pbmVzcyc6XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hpbmluZXNzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyRtYXQuc2hhZGluZ20nOlxuICAgICAgICAgICAgICAgIC8vIGFpU2hhZGluZ01vZGVfRmxhdFxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmZsYXRTaGFkaW5nID0gKCB2YWx1ZSA9PT0gMSApID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICckbWF0Lm9wYWNpdHknOlxuICAgICAgICAgICAgICAgIGlmICggdmFsdWUgPCAxICkge1xuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5vcGFjaXR5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hdGVyaWFsO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92aWV3ZXIvc3JjL3RocmVlLmpzIC0gdmlld2VyL2xvYWRlci9hc3NpbXAyanNvbi53b3JrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ })
/******/ ]);