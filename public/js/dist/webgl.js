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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Viewer__ = __webpack_require__(11);\n\r\n\r\n\r\nvar viewer = new __WEBPACK_IMPORTED_MODULE_0__Viewer__[\"a\" /* default */]();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL21haW4uanM/NWYxYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQSIsImZpbGUiOiIxMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3ZXIgZnJvbSAnLi9WaWV3ZXInO1xyXG5cclxuXHJcbnZhciB2aWV3ZXIgPSBuZXcgVmlld2VyKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///10\n");

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/**\r\n * @description Initialization of the viewer\r\n * @param canvas\r\n * @constructor\r\n */\r\nvar Viewer = function (canvas) {\r\n    var canvas = document.getElementById('renderSurface');\r\n    var gl = canvas.getContext('experimental-webgl');\r\n\r\n\r\n    /* Step2: Define the geometry and store it in buffer objects */\r\n\r\n    var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];\r\n\r\n    // Create a new buffer object\r\n    var vertex_buffer = gl.createBuffer();\r\n\r\n    // Bind an empty array buffer to it\r\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\r\n\r\n    // Pass the vertices data to the buffer\r\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);\r\n\r\n    // Unbind the buffer\r\n    gl.bindBuffer(gl.ARRAY_BUFFER, null);\r\n\r\n\r\n    /* Step3: Create and compile Shader programs */\r\n\r\n    // Vertex shader source code\r\n    var vertCode =\r\n        'attribute vec2 coordinates;' +\r\n        'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';\r\n\r\n    //Create a vertex shader object\r\n    var vertShader = gl.createShader(gl.VERTEX_SHADER);\r\n\r\n    //Attach vertex shader source code\r\n    gl.shaderSource(vertShader, vertCode);\r\n\r\n    //Compile the vertex shader\r\n    gl.compileShader(vertShader);\r\n\r\n    //Fragment shader source code\r\n    var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';\r\n\r\n    // Create fragment shader object\r\n    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);\r\n\r\n    // Attach fragment shader source code\r\n    gl.shaderSource(fragShader, fragCode);\r\n\r\n    // Compile the fragment shader\r\n    gl.compileShader(fragShader);\r\n\r\n    // Create a shader program object to store combined shader program\r\n    var shaderProgram = gl.createProgram();\r\n\r\n    // Attach a vertex shader\r\n    gl.attachShader(shaderProgram, vertShader);\r\n\r\n    // Attach a fragment shader\r\n    gl.attachShader(shaderProgram, fragShader);\r\n\r\n    // Link both programs\r\n    gl.linkProgram(shaderProgram);\r\n\r\n    // Use the combined shader program object\r\n    gl.useProgram(shaderProgram);\r\n\r\n\r\n    /* Step 4: Associate the shader programs to buffer objects */\r\n\r\n    //Bind vertex buffer object\r\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\r\n\r\n    //Get the attribute location\r\n    var coord = gl.getAttribLocation(shaderProgram, \"coordinates\");\r\n\r\n    //point an attribute to the currently bound VBO\r\n    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);\r\n\r\n    //Enable the attribute\r\n    gl.enableVertexAttribArray(coord);\r\n\r\n\r\n    /* Step5: Drawing the required object (triangle) */\r\n\r\n    // Clear the canvas\r\n    gl.clearColor(0.5, 0.5, 0.5, 0.9);\r\n\r\n    // Enable the depth test\r\n    gl.enable(gl.DEPTH_TEST);\r\n\r\n    // Clear the color buffer bit\r\n    gl.clear(gl.COLOR_BUFFER_BIT);\r\n\r\n    // Set the view port\r\n    gl.viewport(0,0,canvas.width,canvas.height);\r\n\r\n    // Draw the triangle\r\n    gl.drawArrays(gl.TRIANGLES, 0, 3);\r\n};\r\n\r\nViewer.prototype.constructor = Viewer;\r\n\r\n/* harmony default export */ __webpack_exports__[\"a\"] = (Viewer);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92aWV3ZXIvc3JjL3dlYmdsIC0gdmlld2VyL1ZpZXdlci5qcz8zMzZmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEMsMEJBQTBCLCtDQUErQyxNQUFNOztBQUUvRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyw2Q0FBNkMsTUFBTTs7QUFFeEY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSIsImZpbGUiOiIxMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gSW5pdGlhbGl6YXRpb24gb2YgdGhlIHZpZXdlclxyXG4gKiBAcGFyYW0gY2FudmFzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFZpZXdlciA9IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyU3VyZmFjZScpO1xyXG4gICAgdmFyIGdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xyXG5cclxuXHJcbiAgICAvKiBTdGVwMjogRGVmaW5lIHRoZSBnZW9tZXRyeSBhbmQgc3RvcmUgaXQgaW4gYnVmZmVyIG9iamVjdHMgKi9cclxuXHJcbiAgICB2YXIgdmVydGljZXMgPSBbLTAuNSwgMC41LCAtMC41LCAtMC41LCAwLjAsIC0wLjUsXTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBuZXcgYnVmZmVyIG9iamVjdFxyXG4gICAgdmFyIHZlcnRleF9idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHJcbiAgICAvLyBCaW5kIGFuIGVtcHR5IGFycmF5IGJ1ZmZlciB0byBpdFxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xyXG5cclxuICAgIC8vIFBhc3MgdGhlIHZlcnRpY2VzIGRhdGEgdG8gdGhlIGJ1ZmZlclxyXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XHJcblxyXG4gICAgLy8gVW5iaW5kIHRoZSBidWZmZXJcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuXHJcblxyXG4gICAgLyogU3RlcDM6IENyZWF0ZSBhbmQgY29tcGlsZSBTaGFkZXIgcHJvZ3JhbXMgKi9cclxuXHJcbiAgICAvLyBWZXJ0ZXggc2hhZGVyIHNvdXJjZSBjb2RlXHJcbiAgICB2YXIgdmVydENvZGUgPVxyXG4gICAgICAgICdhdHRyaWJ1dGUgdmVjMiBjb29yZGluYXRlczsnICtcclxuICAgICAgICAndm9pZCBtYWluKHZvaWQpIHsnICsgJyBnbF9Qb3NpdGlvbiA9IHZlYzQoY29vcmRpbmF0ZXMsMC4wLCAxLjApOycgKyAnfSc7XHJcblxyXG4gICAgLy9DcmVhdGUgYSB2ZXJ0ZXggc2hhZGVyIG9iamVjdFxyXG4gICAgdmFyIHZlcnRTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XHJcblxyXG4gICAgLy9BdHRhY2ggdmVydGV4IHNoYWRlciBzb3VyY2UgY29kZVxyXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRTaGFkZXIsIHZlcnRDb2RlKTtcclxuXHJcbiAgICAvL0NvbXBpbGUgdGhlIHZlcnRleCBzaGFkZXJcclxuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydFNoYWRlcik7XHJcblxyXG4gICAgLy9GcmFnbWVudCBzaGFkZXIgc291cmNlIGNvZGVcclxuICAgIHZhciBmcmFnQ29kZSA9ICd2b2lkIG1haW4odm9pZCkgeycgKyAnZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAwLjEpOycgKyAnfSc7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGZyYWdtZW50IHNoYWRlciBvYmplY3RcclxuICAgIHZhciBmcmFnU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblxyXG4gICAgLy8gQXR0YWNoIGZyYWdtZW50IHNoYWRlciBzb3VyY2UgY29kZVxyXG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdTaGFkZXIsIGZyYWdDb2RlKTtcclxuXHJcbiAgICAvLyBDb21waWxlIHRoZSBmcmFnbWVudCBzaGFkZXJcclxuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ1NoYWRlcik7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgc2hhZGVyIHByb2dyYW0gb2JqZWN0IHRvIHN0b3JlIGNvbWJpbmVkIHNoYWRlciBwcm9ncmFtXHJcbiAgICB2YXIgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuXHJcbiAgICAvLyBBdHRhY2ggYSB2ZXJ0ZXggc2hhZGVyXHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdmVydFNoYWRlcik7XHJcblxyXG4gICAgLy8gQXR0YWNoIGEgZnJhZ21lbnQgc2hhZGVyXHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ1NoYWRlcik7XHJcblxyXG4gICAgLy8gTGluayBib3RoIHByb2dyYW1zXHJcbiAgICBnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHJcbiAgICAvLyBVc2UgdGhlIGNvbWJpbmVkIHNoYWRlciBwcm9ncmFtIG9iamVjdFxyXG4gICAgZ2wudXNlUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHJcblxyXG4gICAgLyogU3RlcCA0OiBBc3NvY2lhdGUgdGhlIHNoYWRlciBwcm9ncmFtcyB0byBidWZmZXIgb2JqZWN0cyAqL1xyXG5cclxuICAgIC8vQmluZCB2ZXJ0ZXggYnVmZmVyIG9iamVjdFxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xyXG5cclxuICAgIC8vR2V0IHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cclxuICAgIHZhciBjb29yZCA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiY29vcmRpbmF0ZXNcIik7XHJcblxyXG4gICAgLy9wb2ludCBhbiBhdHRyaWJ1dGUgdG8gdGhlIGN1cnJlbnRseSBib3VuZCBWQk9cclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoY29vcmQsIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy9FbmFibGUgdGhlIGF0dHJpYnV0ZVxyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29vcmQpO1xyXG5cclxuXHJcbiAgICAvKiBTdGVwNTogRHJhd2luZyB0aGUgcmVxdWlyZWQgb2JqZWN0ICh0cmlhbmdsZSkgKi9cclxuXHJcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzXHJcbiAgICBnbC5jbGVhckNvbG9yKDAuNSwgMC41LCAwLjUsIDAuOSk7XHJcblxyXG4gICAgLy8gRW5hYmxlIHRoZSBkZXB0aCB0ZXN0XHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblxyXG4gICAgLy8gQ2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciBiaXRcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG5cclxuICAgIC8vIFNldCB0aGUgdmlldyBwb3J0XHJcbiAgICBnbC52aWV3cG9ydCgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIERyYXcgdGhlIHRyaWFuZ2xlXHJcbiAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XHJcbn07XHJcblxyXG5WaWV3ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlld2VyO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVmlld2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmlld2VyL3NyYy93ZWJnbCAtIHZpZXdlci9WaWV3ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///11\n");

/***/ })

/******/ });