Function.prototype.bind = function(context) {
    const self = this; // reserve primitive function
    return function(...args) { // return a new function receive a list of args
        return self.apply(context, args); // when executing, context is this of new function
    };
};

Function.prototype.binding = function(ctx, ...bindingArgs) {
    const self = this;

    return function(...args) {
        return self.apply(ctx, args.concat(bindingArgs)); // compose params of inner and outer
    };
};