// add property
// bind this to first param
// execute
// delete new property

// Function.prototype.myFunctionCall = function(context, ...args) {
//     const context = context || window; // null
//     context.fn = this;
//     const result = context.fn(...args);
//     Reflect.deleteProperty(context, 'fn');
//     return result;
// };

// Function.prototype.myFunctionApply = function(ctx, args) {
//     const context = ctx || window;
//     context.fn = this;

//     let res;
//     if (!args) {
//         res = context.fn();
//     } else {
//         res = context.fn(...args);
//     }

//     Reflect.deleteProperty(context, 'fn');

//     return res;      
// };

/**
 * @param {*} ctx function this
 * @param {...any} args list
 * @returns execution result
 */
Function.prototype.myCall = function(ctx, ...args) {
    if (!ctx) 
        ctx = typeof window !== 'undefined' ? window : global;
    
    ctx = Object(ctx);

    const fnName = Symbol('key');
    ctx[fnName] = this;

    const result = ctx[fnName](...args);

    delete ctx[fnName];
    return result;
};

const fn = function(name, sex) {
    console.log(this, name, sex);
};

fn.myCall('', 'chriswong', 'man');
fn.myCall({name: 'cwluvani', sex: 'woman'}, 'cwluvani', 'woman');