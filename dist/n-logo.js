(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["N"] = factory();
	else
		root["N"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logo = exports.Logo = function () {
    // var w, h, lw, iw, ih, params1, params2, resizing;
    function Logo(canvas_id) {
        _classCallCheck(this, Logo);

        var logoSize = window.innerWidth;
        if (logoSize > window.innerHeight) logoSize = window.innerHeight;
        canvas.width = logoSize * 0.8;
        canvas.height = canvas.width;
        InitParams(canvas.width);
        context.lineWidth = lw;
        context.lineJoin = "miter";
        context.strokeStyle = "#000";
        context.globalAlpha = 0;
        canvas.style.margin = ((window.innerHeight - canvas.height) / 2 - 10).toString() + "px auto 0";
        animateLogo();
    }

    _createClass(Logo, [{
        key: "_drawLogo",
        value: function _drawLogo() {
            context.beginPath();
            context.moveTo(three4ths(w), h - three4ths(h / 2));
            context.lineTo(w - seven8ths(w / 2), three4ths(h / 2));
            context.lineTo(w - seven8ths(w / 2), lw / 2);
            context.lineTo(w - lw / 2, lw / 2);
            context.lineTo(w - lw / 2, h - lw / 2);
            context.lineTo(seven8ths(w / 2) + lw / 2, h - lw / 2);
            context.stroke();

            context.beginPath();
            context.moveTo(w - three4ths(w), three4ths(h / 2));
            context.lineTo(seven8ths(w / 2), h - three4ths(h / 2));
            context.lineTo(seven8ths(w / 2), h - lw / 2);
            context.lineTo(lw / 2, h - lw / 2);
            context.lineTo(lw / 2, lw / 2);
            context.lineTo(w - seven8ths(w / 2) - lw / 2, lw / 2);
            context.stroke();

            hideInnerLineEdges();
        }

        /*- Clears canvas
            *- Updates global alpha for the fade effect
            *- Draw the logo
            *- Draw updated lines 
            *- Recursively call until both lines are removed  */

    }, {
        key: "_animateLogo",
        value: function _animateLogo() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (context.globalAlpha < 1) context.globalAlpha += 0.01;
            updateAndDrawLine(params1);
            updateAndDrawLine(params2);
            if (!(params1.removed || params2.removed)) getAnimationFramePF(animateLogo);
        }
    }, {
        key: "_updateAndDrawLine",
        value: function _updateAndDrawLine(p) {
            var l = p.line,
                s = p.segmentIndex,
                f = p.f,
                x1 = l.vectorArray[s].x,
                y1 = l.vectorArray[s].y,
                x2 = l.vectorArray[s + 1].x,
                y2 = l.vectorArray[s + 1].y;

            // Interpolation Formula
            p.line.currX = Math.round(x1 + (x2 - x1) * f);
            p.line.currY = Math.round(y1 + (y2 - y1) * f);

            drawLine(p.line, p.segmentIndex);
            hideInnerLineEdges();

            if (f < 1) p.f += 0.05;else {
                p.f = 0;
                if (s + 2 <= p.line.segmentCount) p.segmentIndex++;else p.removed = true; // base case
            }

            if (!p.removed) {
                context.save();
                context.globalAlpha = 1;
                context.beginPath();
                context.arc(p.line.currX, p.line.currY, lw / 2, 0, 2 * Math.PI, false);
                context.fill();
                context.restore();
            }
        }

        /*- Draw Line segments until the segmentIndex  */

    }, {
        key: "_drawLine",
        value: function _drawLine(line, segmentIndex) {
            context.beginPath();
            context.moveTo(line.vectorArray[0].x, line.vectorArray[0].y);
            for (var i = 1; i < segmentIndex + 1; i++) {
                context.lineTo(line.vectorArray[i].x, line.vectorArray[i].y);
            }
            context.lineTo(line.currX, line.currY);
            context.stroke();
        }
    }, {
        key: "_hideInnerLineEdges",
        value: function _hideInnerLineEdges() {
            context.save();
            context.globalAlpha = 1;
            context.fillStyle = "#FFF";
            context.fillRect(w - lw - iw, h - lw - ih, iw, ih);
            context.fillRect(lw, lw, iw, ih);
            context.restore();
        }

        /*- Initializes global parameters */

    }, {
        key: "_InitParams",
        value: function _InitParams(width) {
            w = width, h = w, lw = Math.round(w * 0.08), //-> Line Width
            iw = Math.round((w - lw * 2) / 2), //-> Inner Rect Width
            ih = Math.round(three4ths(iw) + three4ths(iw) * 0.045); //-> Inner Rect Height

            var line1 = new Line([new Vector(three4ths(w), h - three4ths(h / 2)), new Vector(w - seven8ths(w / 2), three4ths(h / 2)), new Vector(w - seven8ths(w / 2), lw / 2), new Vector(w - lw / 2, lw / 2), new Vector(w - lw / 2, h - lw / 2), new Vector(seven8ths(w / 2) + lw / 2, h - lw / 2)]);

            var line2 = new Line([new Vector(w - three4ths(w), three4ths(h / 2)), new Vector(seven8ths(w / 2), h - three4ths(h / 2)), new Vector(seven8ths(w / 2), h - lw / 2), new Vector(lw / 2, h - lw / 2), new Vector(lw / 2, lw / 2), new Vector(w - seven8ths(w / 2) - lw / 2, lw / 2)]);

            params1 = new ParamArray(line1, 0, 0, false);
            params2 = new ParamArray(line2, 0, 0, false);
        }
    }], [{
        key: "seven8ths",
        value: function seven8ths(x) {
            return Math.round(x * 0.875);
        }
    }, {
        key: "three4ths",
        value: function three4ths(x) {
            return Math.round(x * 0.75);
        }
    }]);

    return Logo;
}();

var Line = exports.Line = function Line(vectors) {
    _classCallCheck(this, Line);

    this.vectorArray = vectors;
    this.segmentCount = vectors.length - 1;
    this.currX = vectors[0].x;
    this.currY = vectors[0].y;
};

var Vector = exports.Vector = function Vector(x, y) {
    _classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
};

var Params = exports.Params = function Params(l, s, f, r) {
    _classCallCheck(this, Params);

    this.line = l; //- int         -> the Line to be animated
    this.segmentIndex = s; //- int         -> used to iterate through the segments (Vector pairs) in a Line
    this.f = f; //- float       -> factor f for the interpolation formula used to animate the Line
    this.removed = r; //- boolean     -> used to determine if the animation is complete
};

/***/ })
/******/ ]);
});