/**
 * @constructor Range
 * Create a range. A range works similar to an Array, with functions like
 * forEach and map. However, a Range object is very cheap to create compared to
 * a large Array with indexes, as it stores only a start, step and end value of
 * the range.
 *
 * A range can be constructed as:
 *     var a = new Range(start, step, end);
 *
 * To get the result of the range:
 *     range.forEach(function (x) {
 *         console.log(x);
 *     });
 *     range.map(function (x) {
 *         return math.sin(x);
 *     });
 *     range.toArray();
 *
 * Example usage:
 *     var c = new Range(2, 1, 5);      // 2:1:5
 *     c.toArray();                     // [2, 3, 4, 5]
 *     var d = new Range(2, -1, -2);    // 2:-1:-2
 *     d.toArray();                     // [2, 1, 0, -1, -2]
 *
 * @param {Number} start
 * @param {Number} step
 * @param {Number} end
 */
function Range(start, step, end) {
    if (!(this instanceof Range)) {
        throw new SyntaxError(
            'Range constructor must be called with the new operator');
    }

    if (start != null && !isNumber(start)) {
        throw new TypeError('Parameter start must be a number');
    }
    if (end != null && !isNumber(end)) {
        throw new TypeError('Parameter end must be a number');
    }
    if (step != null && !isNumber(step)) {
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? start : 0;
    this.end   = (end != null) ? end : 0;
    this.step  = (step != null) ? step : 1;
}

math.type.Range = Range;

/**
 * Parse a string into a range,
 * The string contains the start, optional step, and end, separated by a colon.
 * If the string does not contain a valid range, null is returned.
 * For example str='0:2:10'.
 * @param {String} str
 * @return {Range | null} range
 */
Range.parse = function (str) {
    if (!isString(str)) {
        return null;
    }

    var args = str.split(':');
    var nums = args.map(function (arg) {
        return Number(arg);
    });

    var invalid = nums.some(function (num) {
        return isNaN(num);
    });
    if(invalid) {
        return null;
    }

    switch (nums.length) {
        case 2: return new Range(nums[0], 1, nums[1]);
        case 3: return new Range(nums[0], nums[1], nums[2]);
        default: return null;
    }
};

/**
 * Create a clone of the range
 * @return {Range} clone
 */
Range.prototype.clone = function () {
    return new Range(this.start, this.step, this.end);
};

/**
 * Retrieve the size of the range.
 * @returns {Number[]} size
 */
Range.prototype.size = function () {
    var len = 0,
        start = Number(this.start),
        step = Number(this.step),
        end = Number(this.end),
        diff = end - start;

    if (math.sign(step) == math.sign(diff)) {
        len = Math.floor((diff) / step) + 1;
    }
    else if (diff == 0) {
        len = 1;
    }

    if (isNaN(len)) {
        len = 0;
    }
    return [len];
};

/**
 * Execute a callback function for each value in the range.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Range.prototype.forEach = function (callback) {
    var x = Number(this.start);
    var step = Number(this.step);
    var end = Number(this.end);
    var i = 0;

    if (step > 0) {
        while (x <= end) {
            callback(x, i, this);
            x += step;
            i++;
        }
    }
    else if (step < 0) {
        while (x >= end) {
            callback(x, i, this);
            x += step;
            i++;
        }
    }
};

/**
 * Execute a callback function for each value in the Range, and return the
 * results as an array
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @returns {Array} array
 */
Range.prototype.map = function (callback) {
    var array = [];
    this.forEach(function (value, index, obj) {
        array[index] = callback(value, index, obj);
    });
    return array;
};

/**
 * Create a Matrix with a copy of the Ranges data
 * @return {Matrix} matrix
 */
Range.prototype.toMatrix = function () {
    return new Matrix(this.toArray());
};

/**
 * Create an Array with a copy of the Ranges data
 * @returns {Array} array
 */
Range.prototype.toArray = function () {
    var array = [];
    this.forEach(function (value, index) {
        array[index] = value;
    });
    return array;
};

/**
 * Create an array with a copy of the Ranges data.
 * This method is equal to Range.toArray, and is available for compatibility
 * with Matrix.
 * @return {Array} vector
 */
Range.prototype.toVector = Range.prototype.toArray;

/**
 * Test if the range contains a vector. For a range, this is always the case
 * return {boolean} isVector
 */
Range.prototype.isVector = function () {
    return true;
};

/**
 * Create a scalar with a copy of the data of the Range
 * Will return null if the range does not consist of a scalar value
 * @return {* | null} scalar
 */
Range.prototype.toScalar = function () {
    var array = this.toArray();
    if (array.length == 1) {
        return array[0];
    }
    else {
        return null;
    }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Range.prototype.isScalar = function () {
    return (this.size()[0] == 1);
};

/**
 * Get the primitive value of the Range, a one dimensional array
 * @returns {Array} array
 */
Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray();
};

/**
 * Get the string representation of the range, for example '2:5' or '0:0.2:10'
 * @returns {String} str
 */
Range.prototype.toString = function () {
    var str = math.format(Number(this.start));
    if (this.step != 1) {
        str += ':' + math.format(Number(this.step));
    }
    str += ':' + math.format(Number(this.end));
    return str;
};
