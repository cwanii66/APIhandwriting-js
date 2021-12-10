// new create a total new Object
// new link to __proto__
// this -> new Object
// Object -> function prototype
//

function New(func) {
	let res = {};
	if (func.prototype !== null) {
		res.__proto__ = func.prototype;
	}

	let ret = func.apply(res, Array.prototype.slice.call(arguments, 1)); //Array.prototype.slice.call ===> Array.from(arguments)   then data handling
	if ((typeof ret === 'Object' || typeof ret === 'function') && ret != null) {
		return ret;
	}
	return res;
}

let obj = New(A, 1, 2);
//equals to 

let obj = new A(1, 2);

