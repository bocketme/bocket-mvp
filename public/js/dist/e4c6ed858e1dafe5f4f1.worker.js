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

eval("self.addEventListener('message', OutlineGeometry);\n\nfunction OutlineGeometry (mesh, thresholdAngle) {\n\n    if (mesh instanceof THREE.Mesh){\n        self.postMessage({ err : new Error('The given mesh is not a ' + typeof(mesh))})\n    } else {\n        let geometry = mesh.geometry;\n        let outline = THREE.BufferGeometry();\n        self.postMessage({log: \"new Node send\"});\n        var thresholdDot = Math.cos( Math.PI / 180 * thresholdAngle );\n\n        var edge = [ 0, 0 ], hash = {}, i, j, l, face, key;\n\n        function sortFunction( a, b ) {\n\n            return a - b;\n\n        }\n\n        var keys = [ 'a', 'b', 'c' ];\n\n        var geometry2;\n\n        if ( geometry.isBufferGeometry ) {\n\n            geometry2 = new THREE.Geometry();\n            geometry2.fromBufferGeometry( geometry );\n\n        } else {\n\n            geometry2 = geometry.clone();\n\n        }\n\n        geometry2.mergeVertices();\n        geometry2.computeFaceNormals();\n\n        var vertices = geometry2.vertices;\n        var faces = geometry2.faces;\n\n        for ( i = 0; i < faces.length; i ++ ) {\n\n            face = faces[ i ];\n\n            for ( j = 0; j < 3; j ++ ) {\n\n                edge[ 0 ] = face[ keys[ j ] ];\n                edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];\n\n                var line = new THREE.Line3(vertices[edge[ 0 ]], vertices[edge[ 1 ]]);\n\n                // for each vertex checks if it lies in the edge\n                for ( var e = vertices.length - 1; e >= 0; e -- ) {\n                    if (e === edge[ 0 ] || e === edge[ 1 ]) continue;\n                    var v = vertices[e];\n                    var closestPoint = line.closestPointToPoint(v, true);\n                    if ((new THREE.Line3(closestPoint, v)).distance() < 1e-5) { //1e-5\n                        // mark the current face as splitted so that his cords won't be considered\n                        face.splitted = true;\n                        // Add two new faces, created splitting the face in two\n                        faces.push(new THREE.Face3(\n                            e, face[ keys[ ( j + 2 ) % 3 ] ], face[ keys[ ( j ) % 3 ] ],\n                            face.normal, face.color, face.materialIndex\n                        ));\n                        faces.push(new THREE.Face3(\n                            e, face[ keys[ ( j + 2 ) % 3 ] ], face[ keys[ ( j + 1 ) % 3 ] ],\n                            face.normal, face.color, face.materialIndex\n                        ));\n                        break;\n                    }\n                }\n                if (face.splitted) break;\n\n            }\n\n        }\n\n        for ( i = faces.length - 1;  i >= 0; i -- ) {\n\n            face = faces[ i ];\n\n            if (face.splitted) continue;\n\n            for ( j = 0; j < 3; j ++ ) {\n\n                edge[ 0 ] = face[ keys[ j ] ];\n                edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];\n                edge.sort( sortFunction );\n\n                key = edge.toString();\n\n                if ( hash[ key ] === undefined ) {\n\n                    hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };\n\n                } else {\n\n                    hash[ key ].face2 = i;\n\n                }\n\n            }\n\n        }\n\n        var coords = [];\n\n        for ( key in hash ) {\n\n            var h = hash[ key ];\n\n            // An edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.\n            if ( h.face2 !== undefined && faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {\n\n                var vertex = vertices[ h.vert1 ];\n                coords.push( vertex.x );\n                coords.push( vertex.y );\n                coords.push( vertex.z );\n\n                vertex = vertices[ h.vert2 ];\n                coords.push( vertex.x );\n                coords.push( vertex.y );\n                coords.push( vertex.z );\n\n            }\n\n        }\n\n        outline.addAttribute( 'position', new THREE.Float32BufferAttribute( coords, 3 ) );\n        self.postMessage({res: outline})\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3RocmVlLmpzIC0gdmlld2VyL3dvcmtlci9PdXRsaW5lR2VvbWV0cnkud29ya2VyLmpzP2QxMTEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7O0FBRUE7QUFDQSwwQkFBMEIsNERBQTREO0FBQ3RGLEtBQUs7QUFDTDtBQUNBO0FBQ0EsMEJBQTBCLHFCQUFxQjtBQUMvQzs7QUFFQSxzQ0FBc0M7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLGtCQUFrQjs7QUFFdEM7O0FBRUEsd0JBQXdCLE9BQU87O0FBRS9CO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQSwrRUFBK0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLG1DQUFtQyxTQUFTOztBQUU1Qzs7QUFFQTs7QUFFQSx3QkFBd0IsT0FBTzs7QUFFL0I7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLG1DQUFtQzs7QUFFbkMsaUJBQWlCOztBQUVqQjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsic2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgT3V0bGluZUdlb21ldHJ5KTtcblxuZnVuY3Rpb24gT3V0bGluZUdlb21ldHJ5IChtZXNoLCB0aHJlc2hvbGRBbmdsZSkge1xuXG4gICAgaWYgKG1lc2ggaW5zdGFuY2VvZiBUSFJFRS5NZXNoKXtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGVyciA6IG5ldyBFcnJvcignVGhlIGdpdmVuIG1lc2ggaXMgbm90IGEgJyArIHR5cGVvZihtZXNoKSl9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XG4gICAgICAgIGxldCBvdXRsaW5lID0gVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7bG9nOiBcIm5ldyBOb2RlIHNlbmRcIn0pO1xuICAgICAgICB2YXIgdGhyZXNob2xkRG90ID0gTWF0aC5jb3MoIE1hdGguUEkgLyAxODAgKiB0aHJlc2hvbGRBbmdsZSApO1xuXG4gICAgICAgIHZhciBlZGdlID0gWyAwLCAwIF0sIGhhc2ggPSB7fSwgaSwgaiwgbCwgZmFjZSwga2V5O1xuXG4gICAgICAgIGZ1bmN0aW9uIHNvcnRGdW5jdGlvbiggYSwgYiApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFsgJ2EnLCAnYicsICdjJyBdO1xuXG4gICAgICAgIHZhciBnZW9tZXRyeTI7XG5cbiAgICAgICAgaWYgKCBnZW9tZXRyeS5pc0J1ZmZlckdlb21ldHJ5ICkge1xuXG4gICAgICAgICAgICBnZW9tZXRyeTIgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgICAgICAgICAgIGdlb21ldHJ5Mi5mcm9tQnVmZmVyR2VvbWV0cnkoIGdlb21ldHJ5ICk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgZ2VvbWV0cnkyID0gZ2VvbWV0cnkuY2xvbmUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2VvbWV0cnkyLm1lcmdlVmVydGljZXMoKTtcbiAgICAgICAgZ2VvbWV0cnkyLmNvbXB1dGVGYWNlTm9ybWFscygpO1xuXG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IGdlb21ldHJ5Mi52ZXJ0aWNlcztcbiAgICAgICAgdmFyIGZhY2VzID0gZ2VvbWV0cnkyLmZhY2VzO1xuXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgZmFjZXMubGVuZ3RoOyBpICsrICkge1xuXG4gICAgICAgICAgICBmYWNlID0gZmFjZXNbIGkgXTtcblxuICAgICAgICAgICAgZm9yICggaiA9IDA7IGogPCAzOyBqICsrICkge1xuXG4gICAgICAgICAgICAgICAgZWRnZVsgMCBdID0gZmFjZVsga2V5c1sgaiBdIF07XG4gICAgICAgICAgICAgICAgZWRnZVsgMSBdID0gZmFjZVsga2V5c1sgKCBqICsgMSApICUgMyBdIF07XG5cbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lMyh2ZXJ0aWNlc1tlZGdlWyAwIF1dLCB2ZXJ0aWNlc1tlZGdlWyAxIF1dKTtcblxuICAgICAgICAgICAgICAgIC8vIGZvciBlYWNoIHZlcnRleCBjaGVja3MgaWYgaXQgbGllcyBpbiB0aGUgZWRnZVxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBlID0gdmVydGljZXMubGVuZ3RoIC0gMTsgZSA+PSAwOyBlIC0tICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZSA9PT0gZWRnZVsgMCBdIHx8IGUgPT09IGVkZ2VbIDEgXSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gdmVydGljZXNbZV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZXN0UG9pbnQgPSBsaW5lLmNsb3Nlc3RQb2ludFRvUG9pbnQodiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgobmV3IFRIUkVFLkxpbmUzKGNsb3Nlc3RQb2ludCwgdikpLmRpc3RhbmNlKCkgPCAxZS01KSB7IC8vMWUtNVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgY3VycmVudCBmYWNlIGFzIHNwbGl0dGVkIHNvIHRoYXQgaGlzIGNvcmRzIHdvbid0IGJlIGNvbnNpZGVyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Uuc3BsaXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHR3byBuZXcgZmFjZXMsIGNyZWF0ZWQgc3BsaXR0aW5nIHRoZSBmYWNlIGluIHR3b1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZSwgZmFjZVsga2V5c1sgKCBqICsgMiApICUgMyBdIF0sIGZhY2VbIGtleXNbICggaiApICUgMyBdIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5ub3JtYWwsIGZhY2UuY29sb3IsIGZhY2UubWF0ZXJpYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLCBmYWNlWyBrZXlzWyAoIGogKyAyICkgJSAzIF0gXSwgZmFjZVsga2V5c1sgKCBqICsgMSApICUgMyBdIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5ub3JtYWwsIGZhY2UuY29sb3IsIGZhY2UubWF0ZXJpYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmFjZS5zcGxpdHRlZCkgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggaSA9IGZhY2VzLmxlbmd0aCAtIDE7ICBpID49IDA7IGkgLS0gKSB7XG5cbiAgICAgICAgICAgIGZhY2UgPSBmYWNlc1sgaSBdO1xuXG4gICAgICAgICAgICBpZiAoZmFjZS5zcGxpdHRlZCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvciAoIGogPSAwOyBqIDwgMzsgaiArKyApIHtcblxuICAgICAgICAgICAgICAgIGVkZ2VbIDAgXSA9IGZhY2VbIGtleXNbIGogXSBdO1xuICAgICAgICAgICAgICAgIGVkZ2VbIDEgXSA9IGZhY2VbIGtleXNbICggaiArIDEgKSAlIDMgXSBdO1xuICAgICAgICAgICAgICAgIGVkZ2Uuc29ydCggc29ydEZ1bmN0aW9uICk7XG5cbiAgICAgICAgICAgICAgICBrZXkgPSBlZGdlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGhhc2hbIGtleSBdID09PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaGFzaFsga2V5IF0gPSB7IHZlcnQxOiBlZGdlWyAwIF0sIHZlcnQyOiBlZGdlWyAxIF0sIGZhY2UxOiBpLCBmYWNlMjogdW5kZWZpbmVkIH07XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGhhc2hbIGtleSBdLmZhY2UyID0gaTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29vcmRzID0gW107XG5cbiAgICAgICAgZm9yICgga2V5IGluIGhhc2ggKSB7XG5cbiAgICAgICAgICAgIHZhciBoID0gaGFzaFsga2V5IF07XG5cbiAgICAgICAgICAgIC8vIEFuIGVkZ2UgaXMgb25seSByZW5kZXJlZCBpZiB0aGUgYW5nbGUgKGluIGRlZ3JlZXMpIGJldHdlZW4gdGhlIGZhY2Ugbm9ybWFscyBvZiB0aGUgYWRqb2luaW5nIGZhY2VzIGV4Y2VlZHMgdGhpcyB2YWx1ZS4gZGVmYXVsdCA9IDEgZGVncmVlLlxuICAgICAgICAgICAgaWYgKCBoLmZhY2UyICE9PSB1bmRlZmluZWQgJiYgZmFjZXNbIGguZmFjZTEgXS5ub3JtYWwuZG90KCBmYWNlc1sgaC5mYWNlMiBdLm5vcm1hbCApIDw9IHRocmVzaG9sZERvdCApIHtcblxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXggPSB2ZXJ0aWNlc1sgaC52ZXJ0MSBdO1xuICAgICAgICAgICAgICAgIGNvb3Jkcy5wdXNoKCB2ZXJ0ZXgueCApO1xuICAgICAgICAgICAgICAgIGNvb3Jkcy5wdXNoKCB2ZXJ0ZXgueSApO1xuICAgICAgICAgICAgICAgIGNvb3Jkcy5wdXNoKCB2ZXJ0ZXgueiApO1xuXG4gICAgICAgICAgICAgICAgdmVydGV4ID0gdmVydGljZXNbIGgudmVydDIgXTtcbiAgICAgICAgICAgICAgICBjb29yZHMucHVzaCggdmVydGV4LnggKTtcbiAgICAgICAgICAgICAgICBjb29yZHMucHVzaCggdmVydGV4LnkgKTtcbiAgICAgICAgICAgICAgICBjb29yZHMucHVzaCggdmVydGV4LnogKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBvdXRsaW5lLmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIGNvb3JkcywgMyApICk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe3Jlczogb3V0bGluZX0pXG4gICAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92aWV3ZXIvc3JjL3RocmVlLmpzIC0gdmlld2VyL3dvcmtlci9PdXRsaW5lR2VvbWV0cnkud29ya2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n");

/***/ })
/******/ ]);