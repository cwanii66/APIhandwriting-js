/**
 * @param {*} ctx context this
 * @param {*} args list
 * @returns result
 */

Function.prototype.myApply = function(ctx, args) {
    if (!ctx)
        ctx = typeof window !== 'undefined' ? window : global;
    
    ctx = Object(ctx);

    const fnName = Symbol('key');
    ctx[fnName] = this;

    let res;
    if (!Array.isArray(args)) {
        throw new Error('the second params shold be a array');
    } else {
        res = ctx[fnName](...args);
    }
    delete ctx[fnName];

    return res;
};
let fn = function (name, sex) {
    console.log(this, name, sex)
}
  
  
fn.myApply('', ['goodoose', 'boy'])
fn.myApply({ name: 'sandwich', sex: 'boy' }, ['burger', 'boy'])