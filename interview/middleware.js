const http = require('http');
const slice = Array.prototype.slice;

class ExpressModel {
    constructor() {
        // middleware list
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path) {
        const info = {};
        if (typeof path === 'string') {
            info.path = path;
            info.stack = slice.call(arguments, 1);
        } else {
            info.path = '/';
            info.stack = slice.call(arguments, 0);
        }
        return info;
    }

    use() {
        const info = this.register.apply(this, arguments);
        this.routes.all.push(info);
    }

    get() {
        const info = this.register.apply(this, arguments);
        this.routes.get.push(info);
    }

    post() {
        const info = this.register.apply(this, arguments);
        this.routes.post.push(info);
    }

    match(method, url) {
        const stack = [];
        if (url === '/favicon.ico') {
            return stack;
        }
        // 获取routes
        const curRoutes = [];
        curRoutes = curRoutes.concat(this.routes.all);
        curRoutes = curRoutes.concat(this.routes[method]);

        curRoutes.forEach(routeInfo => {
            if (url.includes(routeInfo.path)) {
                stack = stack.concat(routeInfo.stack);
            }
        });

        return stack;
    }

    // 核心 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift();
            if (middleware) {
                middleware(req, res, next);
            }
        };
        next();
    }

    callback() {
        return (req, res) => {
            res.json = data => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                );
            };
            const url = req.url;
            const method = req.method.toLowerCase();

            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        };
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }
}

// ExpressModel obj factory
module.exports = () => {
    return new ExpressModel();
}


// 下面中间件行为类似于Java中过滤器的工作原理，在进入具体业务处理之前，先让过滤器处理
/**
 * @description compose middleware
 * @param {Array} middlewareList
 */
function compose(middlewareList) {
    /**
     * @description dispatch fn
     * @param ctx { req, res }
     */
    return function(ctx) {
        const dispatch = function(i) {
            const fn = middlewareList[i];
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
            } catch(err) {
                Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}

class App {
    constructor() {
        this.middlewares = [];
    }

    use(fn) {
        this.middlewares.push(fn);
        return this;
    }

    handleRequest(ctx, middleware) {
        return middleware(ctx); // execute middleware core
    }

    createContext(req, res) {
        const ctx = {
            req, 
            res
        };
        return ctx;
    }

    callback() {
        const fn = compose(this.middlewares);
        return (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }
}

// module.exports = App;