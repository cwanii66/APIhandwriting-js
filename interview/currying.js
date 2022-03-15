const currying = function(func) {
    const args = [];

    return function fn(..._args_) {
        if (_args_.length === 0) {
            return func.apply(this, args);
        } else {
            args.push(..._args_);
            return fn;
        }
    };
};