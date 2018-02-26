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
/******/ 	return __webpack_require__(__webpack_require__.s = 61);
/******/ })
/************************************************************************/
/******/ ({

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Viewer__ = __webpack_require__(62);\n\n\n\nvar viewer = new __WEBPACK_IMPORTED_MODULE_0__Viewer__[\"a\" /* default */]();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL21haW4uanM/NWYxYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQSIsImZpbGUiOiI2MS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3ZXIgZnJvbSAnLi9WaWV3ZXInO1xuXG5cbnZhciB2aWV3ZXIgPSBuZXcgVmlld2VyKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///61\n");

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/**\n * @description Initialization of the viewer\n * @param canvas\n * @constructor\n */\nvar Viewer = function (canvas) {\n    var canvas = document.getElementById('renderSurface');\n    var gl = canvas.getContext('experimental-webgl');\n\n\n    /* Step2: Define the geometry and store it in buffer objects */\n\n    var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];\n\n    // Create a new buffer object\n    var vertex_buffer = gl.createBuffer();\n\n    // Bind an empty array buffer to it\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\n\n    // Pass the vertices data to the buffer\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);\n\n    // Unbind the buffer\n    gl.bindBuffer(gl.ARRAY_BUFFER, null);\n\n\n    /* Step3: Create and compile Shader programs */\n\n    // Vertex shader source code\n    var vertCode =\n        'attribute vec2 coordinates;' +\n        'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';\n\n    //Create a vertex shader object\n    var vertShader = gl.createShader(gl.VERTEX_SHADER);\n\n    //Attach vertex shader source code\n    gl.shaderSource(vertShader, vertCode);\n\n    //Compile the vertex shader\n    gl.compileShader(vertShader);\n\n    //Fragment shader source code\n    var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';\n\n    // Create fragment shader object\n    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);\n\n    // Attach fragment shader source code\n    gl.shaderSource(fragShader, fragCode);\n\n    // Compile the fragment shader\n    gl.compileShader(fragShader);\n\n    // Create a shader program object to store combined shader program\n    var shaderProgram = gl.createProgram();\n\n    // Attach a vertex shader\n    gl.attachShader(shaderProgram, vertShader);\n\n    // Attach a fragment shader\n    gl.attachShader(shaderProgram, fragShader);\n\n    // Link both programs\n    gl.linkProgram(shaderProgram);\n\n    // Use the combined shader program object\n    gl.useProgram(shaderProgram);\n\n\n    /* Step 4: Associate the shader programs to buffer objects */\n\n    //Bind vertex buffer object\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\n\n    //Get the attribute location\n    var coord = gl.getAttribLocation(shaderProgram, \"coordinates\");\n\n    //point an attribute to the currently bound VBO\n    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);\n\n    //Enable the attribute\n    gl.enableVertexAttribArray(coord);\n\n\n    /* Step5: Drawing the required object (triangle) */\n\n    // Clear the canvas\n    gl.clearColor(0.5, 0.5, 0.5, 0.9);\n\n    // Enable the depth test\n    gl.enable(gl.DEPTH_TEST);\n\n    // Clear the color buffer bit\n    gl.clear(gl.COLOR_BUFFER_BIT);\n\n    // Set the view port\n    gl.viewport(0,0,canvas.width,canvas.height);\n\n    // Draw the triangle\n    gl.drawArrays(gl.TRIANGLES, 0, 3);\n};\n\nViewer.prototype.constructor = Viewer;\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Viewer);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL1ZpZXdlci5qcz8zMzZmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEMsMEJBQTBCLCtDQUErQyxNQUFNOztBQUUvRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyw2Q0FBNkMsTUFBTTs7QUFFeEY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSIsImZpbGUiOiI2Mi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGRlc2NyaXB0aW9uIEluaXRpYWxpemF0aW9uIG9mIHRoZSB2aWV3ZXJcbiAqIEBwYXJhbSBjYW52YXNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgVmlld2VyID0gZnVuY3Rpb24gKGNhbnZhcykge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyU3VyZmFjZScpO1xuICAgIHZhciBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuXG4gICAgLyogU3RlcDI6IERlZmluZSB0aGUgZ2VvbWV0cnkgYW5kIHN0b3JlIGl0IGluIGJ1ZmZlciBvYmplY3RzICovXG5cbiAgICB2YXIgdmVydGljZXMgPSBbLTAuNSwgMC41LCAtMC41LCAtMC41LCAwLjAsIC0wLjUsXTtcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBidWZmZXIgb2JqZWN0XG4gICAgdmFyIHZlcnRleF9idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblxuICAgIC8vIEJpbmQgYW4gZW1wdHkgYXJyYXkgYnVmZmVyIHRvIGl0XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xuXG4gICAgLy8gUGFzcyB0aGUgdmVydGljZXMgZGF0YSB0byB0aGUgYnVmZmVyXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBVbmJpbmQgdGhlIGJ1ZmZlclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuXG4gICAgLyogU3RlcDM6IENyZWF0ZSBhbmQgY29tcGlsZSBTaGFkZXIgcHJvZ3JhbXMgKi9cblxuICAgIC8vIFZlcnRleCBzaGFkZXIgc291cmNlIGNvZGVcbiAgICB2YXIgdmVydENvZGUgPVxuICAgICAgICAnYXR0cmlidXRlIHZlYzIgY29vcmRpbmF0ZXM7JyArXG4gICAgICAgICd2b2lkIG1haW4odm9pZCkgeycgKyAnIGdsX1Bvc2l0aW9uID0gdmVjNChjb29yZGluYXRlcywwLjAsIDEuMCk7JyArICd9JztcblxuICAgIC8vQ3JlYXRlIGEgdmVydGV4IHNoYWRlciBvYmplY3RcbiAgICB2YXIgdmVydFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcblxuICAgIC8vQXR0YWNoIHZlcnRleCBzaGFkZXIgc291cmNlIGNvZGVcbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydFNoYWRlciwgdmVydENvZGUpO1xuXG4gICAgLy9Db21waWxlIHRoZSB2ZXJ0ZXggc2hhZGVyXG4gICAgZ2wuY29tcGlsZVNoYWRlcih2ZXJ0U2hhZGVyKTtcblxuICAgIC8vRnJhZ21lbnQgc2hhZGVyIHNvdXJjZSBjb2RlXG4gICAgdmFyIGZyYWdDb2RlID0gJ3ZvaWQgbWFpbih2b2lkKSB7JyArICdnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDAuMSk7JyArICd9JztcblxuICAgIC8vIENyZWF0ZSBmcmFnbWVudCBzaGFkZXIgb2JqZWN0XG4gICAgdmFyIGZyYWdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIC8vIEF0dGFjaCBmcmFnbWVudCBzaGFkZXIgc291cmNlIGNvZGVcbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ1NoYWRlciwgZnJhZ0NvZGUpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgZnJhZ21lbnQgc2hhZGVyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnU2hhZGVyKTtcblxuICAgIC8vIENyZWF0ZSBhIHNoYWRlciBwcm9ncmFtIG9iamVjdCB0byBzdG9yZSBjb21iaW5lZCBzaGFkZXIgcHJvZ3JhbVxuICAgIHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXG4gICAgLy8gQXR0YWNoIGEgdmVydGV4IHNoYWRlclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2ZXJ0U2hhZGVyKTtcblxuICAgIC8vIEF0dGFjaCBhIGZyYWdtZW50IHNoYWRlclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCBmcmFnU2hhZGVyKTtcblxuICAgIC8vIExpbmsgYm90aCBwcm9ncmFtc1xuICAgIGdsLmxpbmtQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xuXG4gICAgLy8gVXNlIHRoZSBjb21iaW5lZCBzaGFkZXIgcHJvZ3JhbSBvYmplY3RcbiAgICBnbC51c2VQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xuXG5cbiAgICAvKiBTdGVwIDQ6IEFzc29jaWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1zIHRvIGJ1ZmZlciBvYmplY3RzICovXG5cbiAgICAvL0JpbmQgdmVydGV4IGJ1ZmZlciBvYmplY3RcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4X2J1ZmZlcik7XG5cbiAgICAvL0dldCB0aGUgYXR0cmlidXRlIGxvY2F0aW9uXG4gICAgdmFyIGNvb3JkID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJjb29yZGluYXRlc1wiKTtcblxuICAgIC8vcG9pbnQgYW4gYXR0cmlidXRlIHRvIHRoZSBjdXJyZW50bHkgYm91bmQgVkJPXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihjb29yZCwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vRW5hYmxlIHRoZSBhdHRyaWJ1dGVcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb29yZCk7XG5cblxuICAgIC8qIFN0ZXA1OiBEcmF3aW5nIHRoZSByZXF1aXJlZCBvYmplY3QgKHRyaWFuZ2xlKSAqL1xuXG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIGdsLmNsZWFyQ29sb3IoMC41LCAwLjUsIDAuNSwgMC45KTtcblxuICAgIC8vIEVuYWJsZSB0aGUgZGVwdGggdGVzdFxuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgIC8vIENsZWFyIHRoZSBjb2xvciBidWZmZXIgYml0XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyBTZXQgdGhlIHZpZXcgcG9ydFxuICAgIGdsLnZpZXdwb3J0KDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBEcmF3IHRoZSB0cmlhbmdsZVxuICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCAzKTtcbn07XG5cblZpZXdlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBWaWV3ZXI7XG5cbmV4cG9ydCBkZWZhdWx0IFZpZXdlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3ZpZXdlci9zcmMvd2ViZ2wgLSB2aWV3ZXIvVmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///62\n");

/***/ })

/******/ });