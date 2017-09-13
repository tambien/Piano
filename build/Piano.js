(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("tone"));
	else if(typeof define === 'function' && define.amd)
		define(["tone"], factory);
	else if(typeof exports === 'object')
		exports["Piano"] = factory(require("tone"));
	else
		root["Piano"] = factory(root["tone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Util = __webpack_require__(2);

exports.default = {
	getReleasesUrl: function getReleasesUrl(midi) {
		return 'rel' + (midi - 20) + '.[mp3|ogg]';
	},
	getHarmonicsUrl: function getHarmonicsUrl(midi) {
		return 'harmL' + (0, _Util.midiToNote)(midi).replace('#', 's') + '.[mp3|ogg]';
	},
	getNotesUrl: function getNotesUrl(midi, vel) {
		return (0, _Util.midiToNote)(midi).replace('#', 's') + 'v' + vel + '.[mp3|ogg]';
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.randomBetween = exports.midiToFrequencyRatio = exports.createSource = exports.noteToMidi = exports.midiToNote = undefined;

var _tone = __webpack_require__(0);

var _tone2 = _interopRequireDefault(_tone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noteToMidi(note) {
	return (0, _tone.Frequency)(note).toMidi();
}

function midiToNote(midi) {
	return (0, _tone.Frequency)(midi, 'midi').toNote();
}

function midiToFrequencyRatio(midi) {
	var mod = midi % 3;
	if (mod === 1) {
		return [midi - 1, _tone2.default.intervalToFrequencyRatio(1)];
	} else if (mod === 2) {
		return [midi + 1, _tone2.default.intervalToFrequencyRatio(-1)];
	} else {
		return [midi, 1];
	}
}

function createSource(buffer) {
	return new _tone.BufferSource(buffer);
}

function randomBetween(low, high) {
	return Math.random() * (high - low) + low;
}

exports.midiToNote = midiToNote;
exports.noteToMidi = noteToMidi;
exports.createSource = createSource;
exports.midiToFrequencyRatio = midiToFrequencyRatio;
exports.randomBetween = randomBetween;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tone = __webpack_require__(0);

var _tone2 = _interopRequireDefault(_tone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PianoBase = function (_AudioNode) {
	_inherits(PianoBase, _AudioNode);

	function PianoBase() {
		var vol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		_classCallCheck(this, PianoBase);

		var _this = _possibleConstructorReturn(this, (PianoBase.__proto__ || Object.getPrototypeOf(PianoBase)).call(this));

		_this.createInsOuts(0, 1);

		_this.volume = vol;
		return _this;
	}

	_createClass(PianoBase, [{
		key: 'volume',
		get: function get() {
			return _tone2.default.gainToDb(this.output.gain.value);
		},
		set: function set(vol) {
			this.output.gain.value = _tone2.default.dbToGain(vol);
		}
	}]);

	return PianoBase;
}(_tone.AudioNode);

exports.default = PianoBase;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Salamander = __webpack_require__(1);

var _Salamander2 = _interopRequireDefault(_Salamander);

var _PianoBase2 = __webpack_require__(3);

var _PianoBase3 = _interopRequireDefault(_PianoBase2);

var _Util = __webpack_require__(2);

var _tone = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// the harmonics notes that Salamander has
var harmonics = [21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87];

var Harmonics = function (_PianoBase) {
	_inherits(Harmonics, _PianoBase);

	function Harmonics() {
		var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [21, 108];

		_classCallCheck(this, Harmonics);

		var _this = _possibleConstructorReturn(this, (Harmonics.__proto__ || Object.getPrototypeOf(Harmonics)).call(this));

		var lowerIndex = harmonics.findIndex(function (note) {
			return note >= range[0];
		});
		var upperIndex = harmonics.findIndex(function (note) {
			return note >= range[1];
		});
		upperIndex = upperIndex === -1 ? upperIndex = harmonics.length : upperIndex;

		var notes = harmonics.slice(lowerIndex, upperIndex);

		_this._samples = {};

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = notes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var n = _step.value;

				_this._samples[n] = _Salamander2.default.getHarmonicsUrl(n);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return _this;
	}

	_createClass(Harmonics, [{
		key: 'start',
		value: function start(note, time, velocity) {
			this._sampler.triggerAttack((0, _Util.midiToNote)(note), time, velocity * (0, _Util.randomBetween)(0.5, 1));
		}
	}, {
		key: 'load',
		value: function load(baseUrl) {
			var _this2 = this;

			return new Promise(function (success, fail) {
				_this2._sampler = new _tone.Sampler(_this2._samples, success, baseUrl).connect(_this2.output);
				_this2._sampler.release = 1;
			});
		}
	}]);

	return Harmonics;
}(_PianoBase3.default);

exports.default = Harmonics;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Notes = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tone = __webpack_require__(0);

var _tone2 = _interopRequireDefault(_tone);

var _Salamander = __webpack_require__(1);

var _Salamander2 = _interopRequireDefault(_Salamander);

var _PianoBase2 = __webpack_require__(3);

var _PianoBase3 = _interopRequireDefault(_PianoBase2);

var _Util = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Maps velocity depths to Salamander velocities
 */
var velocitiesMap = {
	1: [8],
	2: [6, 12],
	3: [1, 8, 15],
	4: [1, 5, 10, 15],
	5: [1, 4, 8, 12, 16],
	6: [1, 3, 7, 10, 13, 16],
	7: [1, 3, 6, 9, 11, 13, 16],
	8: [1, 3, 5, 7, 9, 11, 13, 15],
	9: [1, 3, 5, 7, 9, 11, 13, 15, 16],
	10: [1, 2, 3, 5, 7, 9, 11, 13, 15, 16],
	11: [1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 16],
	12: [1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 15, 16],
	13: [1, 2, 3, 4, 5, 7, 9, 11, 12, 13, 14, 15, 16],
	14: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16],
	15: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
	16: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
};

var notes = [21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108];

/**
 *  Manages all of the hammered string sounds
 */

var Notes = exports.Notes = function (_PianoBase) {
	_inherits(Notes, _PianoBase);

	function Notes() {
		var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [21, 108];
		var velocities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

		_classCallCheck(this, Notes);

		var _this = _possibleConstructorReturn(this, (Notes.__proto__ || Object.getPrototypeOf(Notes)).call(this));

		var lowerIndex = notes.findIndex(function (note) {
			return note >= range[0];
		});
		var upperIndex = notes.findIndex(function (note) {
			return note >= range[1];
		});
		upperIndex = upperIndex === -1 ? upperIndex = notes.length : upperIndex + 1;

		var slicedNotes = notes.slice(lowerIndex, upperIndex);

		_this._samplers = velocitiesMap[velocities].slice();

		_this._activeNotes = new Map();

		_this._samplers.forEach(function (vel, i) {
			_this._samplers[i] = {};
			slicedNotes.forEach(function (note) {
				_this._samplers[i][note] = _Salamander2.default.getNotesUrl(note, vel);
			});
		});
		return _this;
	}

	_createClass(Notes, [{
		key: '_hasNote',
		value: function _hasNote(note, velocity) {
			return this._samplers.hasOwnProperty(velocity) && this._samplers[velocity].has(note);
		}
	}, {
		key: '_getNote',
		value: function _getNote(note, velocity) {
			return this._samplers[velocity].get(note);
		}
	}, {
		key: 'stop',
		value: function stop(note, time, velocity) {
			//stop all of the currently playing note
			if (this._activeNotes.has(note)) {
				this._activeNotes.get(note).forEach(function (source) {
					var release = 0.25;
					source.stop(time + release, release);
				});
				this._activeNotes.delete(note);
			}
		}
	}, {
		key: 'start',
		value: function start(note, time, velocity) {

			var velPos = velocity * (this._samplers.length - 1);
			var roundedVel = Math.round(velPos);
			var diff = roundedVel - velPos;
			var gain = 1 - diff * 0.5;

			var _midiToFrequencyRatio = (0, _Util.midiToFrequencyRatio)(note),
			    _midiToFrequencyRatio2 = _slicedToArray(_midiToFrequencyRatio, 2),
			    midi = _midiToFrequencyRatio2[0],
			    ratio = _midiToFrequencyRatio2[1];

			if (this._hasNote(midi, roundedVel)) {
				var source = (0, _Util.createSource)(this._getNote(midi, roundedVel));
				source.playbackRate.value = ratio;
				source.connect(this.output);
				source.start(time, 0, undefined, gain, 0);

				if (!this._activeNotes.has(note)) {
					this._activeNotes.set(note, []);
				}
				this._activeNotes.get(note).push(source);
			}
		}
	}, {
		key: 'load',
		value: function load(baseUrl) {
			var _this2 = this;

			var promises = [];
			this._samplers.forEach(function (obj, i) {
				var prom = new Promise(function (success) {
					_this2._samplers[i] = new _tone.Buffers(obj, success, baseUrl);
				});
				promises.push(prom);
			});
			return Promise.all(promises);
		}
	}]);

	return Notes;
}(_PianoBase3.default);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PianoBase2 = __webpack_require__(3);

var _PianoBase3 = _interopRequireDefault(_PianoBase2);

var _Salamander = __webpack_require__(1);

var _Salamander2 = _interopRequireDefault(_Salamander);

var _Util = __webpack_require__(2);

var _tone = __webpack_require__(0);

var _tone2 = _interopRequireDefault(_tone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pedal = function (_PianoBase) {
	_inherits(Pedal, _PianoBase);

	function Pedal() {
		_classCallCheck(this, Pedal);

		var _this = _possibleConstructorReturn(this, (Pedal.__proto__ || Object.getPrototypeOf(Pedal)).call(this));

		_this._downTime = Infinity;

		_this._currentSound = null;

		_this._buffers = null;
		return _this;
	}

	_createClass(Pedal, [{
		key: 'load',
		value: function load(baseUrl) {
			var _this2 = this;

			return new Promise(function (success) {
				_this2._buffers = new _tone.Buffers({
					up: 'pedalU1.mp3',
					down: 'pedalD1.mp3'
				}, success, baseUrl);
			});
		}

		/**
   *  Squash the current playing sound
   */

	}, {
		key: '_squash',
		value: function _squash(time) {
			if (this._currentSound) {
				this._currentSound.stop(time, 0.1);
			}
			this._currentSound = null;
		}
	}, {
		key: '_playSample',
		value: function _playSample(time, dir) {
			this._currentSound = (0, _Util.createSource)(this._buffers.get(dir));
			this._currentSound.connect(this.output).start(time, (0, _Util.randomBetween)(0, 0.01), undefined, 0.5 * (0, _Util.randomBetween)(0.5, 1), 0.05);
		}
	}, {
		key: 'down',
		value: function down(time) {
			this._squash(time);
			this._downTime = time;
			this._playSample(time, 'down');
		}
	}, {
		key: 'up',
		value: function up(time) {
			this._squash(time);
			this._downTime = Infinity;
			this._playSample(time, 'up');
		}
	}, {
		key: 'isDown',
		value: function isDown(time) {
			return time > this._downTime;
		}
	}]);

	return Pedal;
}(_PianoBase3.default);

exports.default = Pedal;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Salamander = __webpack_require__(1);

var _Salamander2 = _interopRequireDefault(_Salamander);

var _PianoBase2 = __webpack_require__(3);

var _PianoBase3 = _interopRequireDefault(_PianoBase2);

var _Util = __webpack_require__(2);

var _tone = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Release = function (_PianoBase) {
	_inherits(Release, _PianoBase);

	function Release(range) {
		_classCallCheck(this, Release);

		var _this = _possibleConstructorReturn(this, (Release.__proto__ || Object.getPrototypeOf(Release)).call(this));

		_this._buffers = {};
		for (var i = range[0]; i <= range[1]; i++) {
			_this._buffers[i] = _Salamander2.default.getReleasesUrl(i);
		}
		return _this;
	}

	_createClass(Release, [{
		key: 'load',
		value: function load(baseUrl) {
			var _this2 = this;

			return new Promise(function (success) {
				_this2._buffers = new _tone.Buffers(_this2._buffers, success, baseUrl);
			});
		}
	}, {
		key: 'start',
		value: function start(note, time, velocity) {
			if (this._buffers.has(note)) {
				var source = (0, _Util.createSource)(this._buffers.get(note)).connect(this.output);
				//randomize the velocity slightly
				velocity *= (0, _Util.randomBetween)(0.5, 1);
				source.start(time, 0, undefined, 0.02 * velocity, 0);
			}
		}
	}]);

	return Release;
}(_PianoBase3.default);

exports.default = Release;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Piano = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tone = __webpack_require__(0);

var _tone2 = _interopRequireDefault(_tone);

var _Pedal = __webpack_require__(6);

var _Pedal2 = _interopRequireDefault(_Pedal);

var _Notes = __webpack_require__(5);

var _Harmonics = __webpack_require__(4);

var _Harmonics2 = _interopRequireDefault(_Harmonics);

var _Release = __webpack_require__(7);

var _Release2 = _interopRequireDefault(_Release);

var _Salamander = __webpack_require__(1);

var _Salamander2 = _interopRequireDefault(_Salamander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *  @class Multisampled Grand Piano using [Salamander Piano Samples](https://archive.org/details/SalamanderGrandPianoV3)
 *  @extends {Tone}
 */
var Piano = exports.Piano = function (_AudioNode) {
	_inherits(Piano, _AudioNode);

	function Piano() {
		_classCallCheck(this, Piano);

		var options = _tone2.default.defaults(arguments, ["range", "velocities"], {
			velocities: 1,
			range: [21, 108],
			release: true
		});

		var _this = _possibleConstructorReturn(this, (Piano.__proto__ || Object.getPrototypeOf(Piano)).call(this));

		_this.createInsOuts(0, 1);

		_this._loaded = false;

		_this._heldNotes = new Map();

		_this._sustainedNotes = new Map();

		_this._notes = new _Notes.Notes(options.range, options.velocities).connect(_this.output);

		_this._pedal = new _Pedal2.default().connect(_this.output);

		if (options.release) {
			_this._harmonics = new _Harmonics2.default(options.range).connect(_this.output);

			_this._release = new _Release2.default(options.range).connect(_this.output);
		}
		return _this;
	}

	/**
  *  Load all the samples
  *  @param  {String}  baseUrl  The url for the Salamander base folder
  *  @return  {Promise}
  */


	_createClass(Piano, [{
		key: 'load',
		value: function load() {
			var _this2 = this;

			var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://tambien.github.io/Piano/Salamander/';

			var promises = [this._notes.load(url), this._pedal.load(url)];
			if (this._harmonics) {
				promises.push(this._harmonics.load(url));
			}
			if (this._release) {
				promises.push(this._release.load(url));
			}
			return Promise.all(promises).then(function () {
				_this2._loaded = true;
			});
		}

		/**
   * If all the samples are loaded or not
   * @readOnly
   * @type {Boolean}
   */

	}, {
		key: 'pedalDown',


		/**
   *  Put the pedal down at the given time. Causes subsequent
   *  notes and currently held notes to sustain.
   *  @param  {Time}  time  The time the pedal should go down
   *  @returns {Piano} this
   */
		value: function pedalDown(time) {
			if (this.loaded) {
				time = this.toSeconds(time);
				if (!this._pedal.isDown(time)) {
					this._pedal.down(time);
				}
			}
			return this;
		}

		/**
   *  Put the pedal up. Dampens sustained notes
   *  @param  {Time}  time  The time the pedal should go up
   *  @returns {Piano} this
   */

	}, {
		key: 'pedalUp',
		value: function pedalUp(time) {
			var _this3 = this;

			if (this.loaded) {
				time = this.toSeconds(time);
				if (this._pedal.isDown(time)) {
					this._pedal.up(time);
					// dampen each of the notes
					this._sustainedNotes.forEach(function (t, note) {
						if (!_this3._heldNotes.has(note)) {
							_this3._notes.stop(note, time);
						}
					});
					this._sustainedNotes.clear();
				}
			}
			return this;
		}

		/**
   *  Play a note.
   *  @param  {String|Number}  note      The note to play. If it is a number, it is assumed
   *                                     to be MIDI
   *  @param  {NormalRange}  velocity  The velocity to play the note
   *  @param  {Time}  time      The time of the event
   *  @return  {Piano}  this
   */

	}, {
		key: 'keyDown',
		value: function keyDown(note) {
			var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tone2.default.now();
			var velocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;

			if (this.loaded) {
				time = this.toSeconds(time);

				if (_tone2.default.isString(note)) {
					note = Math.round((0, _tone.Frequency)(note).toMidi());
				}

				if (!this._heldNotes.has(note)) {
					//record the start time and velocity
					this._heldNotes.set(note, { time: time, velocity: velocity });

					this._notes.start(note, time, velocity);
				}
			}
			return this;
		}

		/**
   *  Release a held note.
   *  @param  {String|Number}  note      The note to stop
   *  @param  {Time}  time      The time of the event
   *  @return  {Piano}  this
   */

	}, {
		key: 'keyUp',
		value: function keyUp(note) {
			var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tone2.default.now();
			var velocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;

			if (this.loaded) {
				time = this.toSeconds(time);

				if (_tone2.default.isString(note)) {
					note = Math.round((0, _tone.Frequency)(note).toMidi());
				}

				if (this._heldNotes.has(note)) {

					var prevNote = this._heldNotes.get(note);
					this._heldNotes.delete(note);

					if (this._release) {
						this._release.start(note, time, velocity);
					}

					//compute the release velocity
					var holdTime = time - prevNote.time;
					var prevVel = prevNote.velocity;
					var dampenGain = 0.5 / Math.max(holdTime, 0.1) + prevVel + velocity;
					dampenGain = Math.pow(Math.log(Math.max(dampenGain, 1)), 2) / 2;

					if (this._pedal.isDown(time)) {
						if (!this._sustainedNotes.has(note)) {
							this._sustainedNotes.set(note, time);
						}
					} else {
						this._notes.stop(note, time, velocity);

						if (this._harmonics) {
							this._harmonics.start(note, time, dampenGain);
						}
					}
				}
			}
			return this;
		}

		/**
   *  Set the volumes of each of the components
   *  @param {String} param
   *  @param {Decibels} vol
   *  @return {Piano} this
   *  @example
   * //either as an string
   * piano.setVolume('release', -10)
   */

	}, {
		key: 'setVolume',
		value: function setVolume(param, vol) {
			switch (param) {
				case 'note':
					this._notes.volume = vol;
					break;
				case 'pedal':
					this._pedal.volume = vol;
					break;
				case 'release':
					if (this._release) {
						this._release.volume = vol;
					}
					break;
				case 'harmonics':
					if (this._harmonics) {
						this._harmonics.volume = vol;
					}
					break;
			}
			return this;
		}
	}, {
		key: 'loaded',
		get: function get() {
			return this._loaded;
		}
	}]);

	return Piano;
}(_tone.AudioNode);

/***/ })
/******/ ]);
});
//# sourceMappingURL=Piano.js.map