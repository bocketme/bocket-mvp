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
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Viewer__ = __webpack_require__(62);\n\n\n\nvar viewer = new __WEBPACK_IMPORTED_MODULE_0__Viewer__[\"a\" /* default */]();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvd2ViZ2wgLSB2aWV3ZXIvbWFpbi5qcz8xMTU3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7OztBQUdBIiwiZmlsZSI6IjYxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXdlciBmcm9tICcuL1ZpZXdlcic7XG5cblxudmFyIHZpZXdlciA9IG5ldyBWaWV3ZXIoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy93ZWJnbCAtIHZpZXdlci9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///61\n");

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/**\n * @description Initialization of the viewer\n * @param canvas\n * @constructor\n */\nvar Viewer = function (canvas) {\n    var canvas = document.getElementById('renderSurface');\n    var gl = canvas.getContext('experimental-webgl');\n\n\n    /* Step2: Define the geometry and store it in buffer objects */\n\n    var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];\n\n    // Create a new buffer object\n    var vertex_buffer = gl.createBuffer();\n\n    // Bind an empty array buffer to it\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\n\n    // Pass the vertices data to the buffer\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);\n\n    // Unbind the buffer\n    gl.bindBuffer(gl.ARRAY_BUFFER, null);\n\n\n    /* Step3: Create and compile Shader programs */\n\n    // Vertex shader source code\n    var vertCode =\n        'attribute vec2 coordinates;' +\n        'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';\n\n    //Create a vertex shader object\n    var vertShader = gl.createShader(gl.VERTEX_SHADER);\n\n    //Attach vertex shader source code\n    gl.shaderSource(vertShader, vertCode);\n\n    //Compile the vertex shader\n    gl.compileShader(vertShader);\n\n    //Fragment shader source code\n    var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';\n\n    // Create fragment shader object\n    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);\n\n    // Attach fragment shader source code\n    gl.shaderSource(fragShader, fragCode);\n\n    // Compile the fragment shader\n    gl.compileShader(fragShader);\n\n    // Create a shader program object to store combined shader program\n    var shaderProgram = gl.createProgram();\n\n    // Attach a vertex shader\n    gl.attachShader(shaderProgram, vertShader);\n\n    // Attach a fragment shader\n    gl.attachShader(shaderProgram, fragShader);\n\n    // Link both programs\n    gl.linkProgram(shaderProgram);\n\n    // Use the combined shader program object\n    gl.useProgram(shaderProgram);\n\n\n    /* Step 4: Associate the shader programs to buffer objects */\n\n    //Bind vertex buffer object\n    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);\n\n    //Get the attribute location\n    var coord = gl.getAttribLocation(shaderProgram, \"coordinates\");\n\n    //point an attribute to the currently bound VBO\n    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);\n\n    //Enable the attribute\n    gl.enableVertexAttribArray(coord);\n\n\n    /* Step5: Drawing the required object (triangle) */\n\n    // Clear the canvas\n    gl.clearColor(0.5, 0.5, 0.5, 0.9);\n\n    // Enable the depth test\n    gl.enable(gl.DEPTH_TEST);\n\n    // Clear the color buffer bit\n    gl.clear(gl.COLOR_BUFFER_BIT);\n\n    // Set the view port\n    gl.viewport(0,0,canvas.width,canvas.height);\n\n    // Draw the triangle\n    gl.drawArrays(gl.TRIANGLES, 0, 3);\n};\n\nViewer.prototype.constructor = Viewer;\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Viewer);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvd2ViZ2wgLSB2aWV3ZXIvVmlld2VyLmpzPzAyYTkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQztBQUNwQywwQkFBMEIsK0NBQStDLE1BQU07O0FBRS9FO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLDZDQUE2QyxNQUFNOztBQUV4RjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBIiwiZmlsZSI6IjYyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZGVzY3JpcHRpb24gSW5pdGlhbGl6YXRpb24gb2YgdGhlIHZpZXdlclxuICogQHBhcmFtIGNhbnZhc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBWaWV3ZXIgPSBmdW5jdGlvbiAoY2FudmFzKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXJTdXJmYWNlJyk7XG4gICAgdmFyIGdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG5cbiAgICAvKiBTdGVwMjogRGVmaW5lIHRoZSBnZW9tZXRyeSBhbmQgc3RvcmUgaXQgaW4gYnVmZmVyIG9iamVjdHMgKi9cblxuICAgIHZhciB2ZXJ0aWNlcyA9IFstMC41LCAwLjUsIC0wLjUsIC0wLjUsIDAuMCwgLTAuNSxdO1xuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGJ1ZmZlciBvYmplY3RcbiAgICB2YXIgdmVydGV4X2J1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXG4gICAgLy8gQmluZCBhbiBlbXB0eSBhcnJheSBidWZmZXIgdG8gaXRcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4X2J1ZmZlcik7XG5cbiAgICAvLyBQYXNzIHRoZSB2ZXJ0aWNlcyBkYXRhIHRvIHRoZSBidWZmZXJcbiAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIFVuYmluZCB0aGUgYnVmZmVyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xuXG5cbiAgICAvKiBTdGVwMzogQ3JlYXRlIGFuZCBjb21waWxlIFNoYWRlciBwcm9ncmFtcyAqL1xuXG4gICAgLy8gVmVydGV4IHNoYWRlciBzb3VyY2UgY29kZVxuICAgIHZhciB2ZXJ0Q29kZSA9XG4gICAgICAgICdhdHRyaWJ1dGUgdmVjMiBjb29yZGluYXRlczsnICtcbiAgICAgICAgJ3ZvaWQgbWFpbih2b2lkKSB7JyArICcgZ2xfUG9zaXRpb24gPSB2ZWM0KGNvb3JkaW5hdGVzLDAuMCwgMS4wKTsnICsgJ30nO1xuXG4gICAgLy9DcmVhdGUgYSB2ZXJ0ZXggc2hhZGVyIG9iamVjdFxuICAgIHZhciB2ZXJ0U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuXG4gICAgLy9BdHRhY2ggdmVydGV4IHNoYWRlciBzb3VyY2UgY29kZVxuICAgIGdsLnNoYWRlclNvdXJjZSh2ZXJ0U2hhZGVyLCB2ZXJ0Q29kZSk7XG5cbiAgICAvL0NvbXBpbGUgdGhlIHZlcnRleCBzaGFkZXJcbiAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRTaGFkZXIpO1xuXG4gICAgLy9GcmFnbWVudCBzaGFkZXIgc291cmNlIGNvZGVcbiAgICB2YXIgZnJhZ0NvZGUgPSAndm9pZCBtYWluKHZvaWQpIHsnICsgJ2dsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMC4xKTsnICsgJ30nO1xuXG4gICAgLy8gQ3JlYXRlIGZyYWdtZW50IHNoYWRlciBvYmplY3RcbiAgICB2YXIgZnJhZ1NoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgLy8gQXR0YWNoIGZyYWdtZW50IHNoYWRlciBzb3VyY2UgY29kZVxuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnU2hhZGVyLCBmcmFnQ29kZSk7XG5cbiAgICAvLyBDb21waWxlIHRoZSBmcmFnbWVudCBzaGFkZXJcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdTaGFkZXIpO1xuXG4gICAgLy8gQ3JlYXRlIGEgc2hhZGVyIHByb2dyYW0gb2JqZWN0IHRvIHN0b3JlIGNvbWJpbmVkIHNoYWRlciBwcm9ncmFtXG4gICAgdmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICAvLyBBdHRhY2ggYSB2ZXJ0ZXggc2hhZGVyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZlcnRTaGFkZXIpO1xuXG4gICAgLy8gQXR0YWNoIGEgZnJhZ21lbnQgc2hhZGVyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZyYWdTaGFkZXIpO1xuXG4gICAgLy8gTGluayBib3RoIHByb2dyYW1zXG4gICAgZ2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XG5cbiAgICAvLyBVc2UgdGhlIGNvbWJpbmVkIHNoYWRlciBwcm9ncmFtIG9iamVjdFxuICAgIGdsLnVzZVByb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XG5cblxuICAgIC8qIFN0ZXAgNDogQXNzb2NpYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbXMgdG8gYnVmZmVyIG9iamVjdHMgKi9cblxuICAgIC8vQmluZCB2ZXJ0ZXggYnVmZmVyIG9iamVjdFxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhfYnVmZmVyKTtcblxuICAgIC8vR2V0IHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cbiAgICB2YXIgY29vcmQgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNvb3JkaW5hdGVzXCIpO1xuXG4gICAgLy9wb2ludCBhbiBhdHRyaWJ1dGUgdG8gdGhlIGN1cnJlbnRseSBib3VuZCBWQk9cbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvb3JkLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy9FbmFibGUgdGhlIGF0dHJpYnV0ZVxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGNvb3JkKTtcblxuXG4gICAgLyogU3RlcDU6IERyYXdpbmcgdGhlIHJlcXVpcmVkIG9iamVjdCAodHJpYW5nbGUpICovXG5cbiAgICAvLyBDbGVhciB0aGUgY2FudmFzXG4gICAgZ2wuY2xlYXJDb2xvcigwLjUsIDAuNSwgMC41LCAwLjkpO1xuXG4gICAgLy8gRW5hYmxlIHRoZSBkZXB0aCB0ZXN0XG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuXG4gICAgLy8gQ2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciBiaXRcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIFNldCB0aGUgdmlldyBwb3J0XG4gICAgZ2wudmlld3BvcnQoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcblxuICAgIC8vIERyYXcgdGhlIHRyaWFuZ2xlXG4gICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIDMpO1xufTtcblxuVmlld2VyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFZpZXdlcjtcblxuZXhwb3J0IGRlZmF1bHQgVmlld2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3dlYmdsIC0gdmlld2VyL1ZpZXdlci5qc1xuLy8gbW9kdWxlIGlkID0gNjJcbi8vIG1vZHVsZSBjaHVua3MgPSAyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///62\n");

/***/ })

/******/ });