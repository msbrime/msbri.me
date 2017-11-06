(function (win) {

	"use strict";

    /**
     * The extend helper function
     *
     * Helper function to merge multiple
     * objects into a single object
     *
     * @return Object
     */
	function extend() {
		var base = Array.prototype.shift.call(arguments);

		for (var i = 0; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					base[key] = arguments[i][key];
				}
			}
		}
		return base;
	}


	var jsGauge = (function () {

		//default configuration options
		var defaultOptions = {
			pointCount: 50,
			stepSize: 10,
			startAngle: 200,
			arcDistance: 140,
			value: 50
		};

		function getCoords(element) {

			var documentPosition = document.body.getBoundingClientRect(),
				gaugeBoundary = element.getBoundingClientRect();

			return {
				left: gaugeBoundary.left - documentPosition.left,
				top: gaugeBoundary.top - documentPosition.top,
			};
		}

		function toRadians(degree) {
			return degree * Math.PI / 180;
		}

		function asPercentage(units) {
			return (units / 100);
		}

		/**
		 * The Gauge constructor
		 *
		 * @param {string} the selector of the element
		 * @param {object} the config options for the gauge
		 */
		function Gauge(selector, options) {

			this.element = document.querySelector(selector),
				this._init(options);

		}

	    /**
	     * [_init description]
	     * @param {object} options the config options
	     *    through to the constructor
	     */
		Gauge.prototype._init = function (options) {
			/** @type {number} [description] */
			this._radius = this._getRadius(),

				// the coordinates of the gauge within the document
				this.coords = getCoords(this.element),

				// the coordinates of the center of the gauge
				this.centerCoords = {
					x: this._radius + this.coords.left,
					y: this._radius + this.coords.top
				};

			// set up the config options
			this._config = (options) ?
				extend(defaultOptions, options) :
				defaultOptions;

			this.spacing = this._config.arcDistance / this._config.pointCount;

			this._insertPointer();

			this._addGaugeMarks();

			this.setValue(this._config.value);
		}

	    /**
	     * _getRadius function that returns the radius
	     *    of the gauge
	     * @return {number} the radius of the gauge
	     */
		Gauge.prototype._getRadius = function () {
			return this.element.clientWidth / 2;
		}

		/**
		 * [move description]
		 * @param  {[type]} units [description]
		 * @return {[type]}       [description]
		 */
		Gauge.prototype.setValue = function (units) {
			this.value = units;
			(this._oscillation) ? clearTimeout(this._oscillation) : false;
			this.pointer.move(units);
			this.oscillate();
			return this;
		}

		/**
		 * oscillate the pointer between the current value
		 * and an upper bound
		 */
		Gauge.prototype.oscillate = function (value) {
			var self = this;

			if (!value || (self.value - value > 5)) {
				value = self.value;
			}

			self.pointer.move(value);


			this._oscillation = setTimeout(
				function () {
					self.oscillate(value - 5);
				},
				100
			)

			return this;
		}


		/**
		 * _computeCoords Computes the exact poisition of a gauge mark
		 * @param  {[type]} angle [description]
		 * @return {[type]}       [description]
		 */
		Gauge.prototype._computeCoords = function (angle) {
			return {
				x:
				this.centerCoords.x
				+ ((this._radius - 22) * Math.cos(angle)),
				y:
				this.centerCoords.y
				+ ((this._radius - 22) * Math.sin(angle))
			}
		}

		/**
		 * _positionGaugeMark position a gauge mark correctly on a
		 *     point on the circumference of the circle
		 * @param  {DOMElement} mark     [description]
		 * @param  {object} position [description]
		 * @param  {number} angle    [description]
		 * @return {DOMElement} the updated DOMElement that was passed
		 *     in as mark
		 */
		Gauge.prototype._positionGaugeMark = function (mark, position, angle) {
			mark.style.left =
				Math.ceil((position.x - this.coords.left)) + "px";

			mark.style.top =
				Math.ceil((position.y - this.coords.top)) + "px";

			mark.style.transform = "rotate(" + (angle - 90) + "deg)";

			return mark;
		}

		/**
		 * _drawMarks draws the gauge marks around the circumference
		 *    of the gauge
		 * @return void
		 */
		Gauge.prototype._addGaugeMarks = function () {

			var theta = this._config.startAngle;

			for (var gaugeMarkId = 0;
				gaugeMarkId <= this._config.pointCount;
				theta += this.spacing, gaugeMarkId++) {
				this._addGaugeMark(gaugeMarkId, theta);
			}
		}

		Gauge.prototype._insertPointer = function () {
			this.pointer = new PointerAdapter(this, new Pointer(this._radius));
			this.element.appendChild(this.pointer.getPointerElement());
		}

		Gauge.prototype._createGaugeMark = function () {
			var gaugeMark = document.createElement('span');

			gaugeMark.classList.add('gauge__mark');

			return gaugeMark;
		}

		Gauge.prototype._addGaugeMark = function (gaugeMarkId, theta) {
			var
				mark = this._createGaugeMark(),
				markPosition = this._computeCoords(toRadians(theta));

			if ((gaugeMarkId % this._config.stepSize) === 0) {
				mark.style.height = "20px";
				mark.style.width = "2px";
			}

			this.element.appendChild(
				this._positionGaugeMark(mark, markPosition, theta)
			);

			/*
			mark.style.backgroundColor =
				(gaugeMarkId > this._config.pointCount * 0.5 ) ?
				((gaugeMarkId > this._config.pointCount * 0.8 ) ?
					"#f15e5e" : "yellow" ) :
				"#69c769";
			*/
		}

		/**
		 * [PointerAdapter description]
		 * @param {[type]} context [description]
		 * @param {[type]} pointer [description]
		 */
		function PointerAdapter(context, pointer) {
			this.context = context;
			this.pointer = pointer;
		}

		PointerAdapter.prototype.getPointerElement = function () {
			return this.pointer.elements.pointer;
		}

		PointerAdapter.prototype.move = function (units) {
			var angle =
				(asPercentage(units) * this.context._config.arcDistance)
				+ (this.context._config.startAngle + 90);

			this.pointer.move(angle);
		}

		function Pointer(height) {
			this.height = height;

			this.elements = {};

			this._init();
		}

		Pointer.prototype.move = function (units) {
			this.elements.tip.style.transform = "rotate(" + units + "deg)";
		}

		Pointer.prototype._init = function () {
			this._createPointerShell()
				._appendToShell(this._createPointerTip())
				._appendToShell(this._createPointerBase())
				._applyClassesToPointerElements();
		}

		Pointer.prototype._createPointerShell = function () {
			this.elements.pointer = document.createElement('div');

			this.elements.pointer.setAttribute("style",
				"height : " + this.height + "px;"
				+ "top : " + this.height * 0.2 + "px;"
				+ "left : " + this.height * 0.8 + "px;"
				+ "width : " + this.height * 0.4 + "px;"
			);

			return this;
		}

		Pointer.prototype._createPointerTip = function () {
			this.elements.tip = document.createElement('div');

			this.elements.tip.setAttribute("style",
				"border-bottom : " + this.height * 0.7 + "px solid yellow;"
				+ "border-left : " + this.height * 0.2 + "px solid transparent;"
				+ "border-right : " + this.height * 0.2 + "px solid transparent;"
				+ "bottom : " + this.height * 0.2 + "px;"
			);

			return this.elements.tip;
		}

		Pointer.prototype._appendToShell = function (element) {
			this.elements.pointer.appendChild(element);

			return this;
		}

		Pointer.prototype._applyClassesToPointerElements = function () {
			this.elements.pointer.classList.add("gauge__pointer");

			this.elements.tip.classList.add("gauge__pointer-top");

			this.elements.base.classList.add("gauge__pointer-base");
		}

		Pointer.prototype._createPointerBase = function (dimension) {
			this.elements.base = document.createElement('div');

			this.elements.base.setAttribute("style",
				"width : " + this.height * 0.4 + "px;"
				+ "height : " + this.height * 0.4 + "px;"
			);

			return this.elements.base;
		}

		/**
		 * init Initialization function for gauge
		 * @param  DOMNode selector the element
		 * @param  Object options  the config options for the gauge
		 */
		function init(selector, options) {
			return new Gauge(selector, options);
		}

		return {
			init: init
		};

	})();

	win.jsGauge = jsGauge;

})(window);