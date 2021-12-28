/**
 * 适配器模式的作用是解决两个软件实体间 *接口不兼容的问题*
 * 别名 => wrapper(包装器)
 * 
 * 现实 ?
 * 1. 插头转换器
 * 2. 电源适配器
 * 3. USB转接口
 */

// 17.2 usage of adapter

// recap 1.3
const googleMap = {
    show() {
        console.log('开始渲染谷歌地图');
    }
};
const baiduMap = {
    show() {
        console.log('开始渲染百度地图');
    },
    display() {
        console.log('display interface')
    }
};
const renderMap = function(map) {
    if (map.show instanceof Function) {
        map.show();
    }
};
renderMap( googleMap ); // 输出：开始渲染谷歌地图
renderMap( baiduMap ); // 输出：开始渲染百度地图 
// 上面代码能正常运行的关键是googleMap & baiduMap提供了一致的show方法
// 但是通常情况下，第三方提供的接口方法并不在我们自己的控制范围之内
// 比如 baiduMap 提供的方法叫display 而不是 show

// add baiduMapAdapter to transform
const baiduMapAdapter = {
    show() {
        return baiduMap.display();
    }
};

// 案例：

// 我们从第三方资源里成功取到了广东省城市及对应的id
const getGuangdongCity = function() {
    const guangdongCity = [
        {
            name: 'shenzhen',
            id: 11
        },
        {
            name: 'guangzhou',
            id: 12
        }
    ];
    return guangdongCity;
};
const render = function(fn) {
    console.log('开始渲染广东地图');
    document.write( JSON.stringify( fn() ) );
};
render(getGuangdongCity);

/**
 * 利用这些数据，我们编写完成了整个页面，并且在线上稳定地运行了一段时间。
 * 但后来发现这些数据不太可靠，里面还缺少很多城市。
 * 于是我们又在网上找到了另外一些数据资源，
 * 这次的数据更加全面，但遗憾的是，数据结构和正运行在项目中的并不一致。
 * 新的数据结构如下：
 */
const newGuangDongCity = {
    shenzhen: 11,
    guangzhou: 12,
    zhuhai: 13
};
// 这时候我们就需要一个adapter去转换数据格式

const addressAdapter = function(oldAddressfn) {
    const address = {},
        oldAddress = oldAddressfn();
    for (let c of oldAddress) {
        address[c.name] = c.id;
    }
    return function() {
        return address;
    }
};
render(addressAdapter(getGuangdongCity));

// 接下来只需要把调用过getGuangdongCity的地方，用经过addressAdapter适配器转换之后的新函数来代替

// summary:
/**
 * 如装饰者模式、代理模式和外观模式。
 * 这几种模式都属于“包装模式”，
 * 都是由一个对象来包装另一个对象。
 * 区别它们的关键仍然是模式的意图。
 * 
 *  适配器模式主要用来解决两个已有接口之间不匹配的问题，
 * 它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。
 * 适配器模式不需要改变已有的接口，就能够使它们协同作用。
 * 
 *  装饰者模式和代理模式也不会改变原有对象的接口，
 * 但装饰者模式的作用是为了给对象增加功能。
 * 装饰者模式常常形成一条长的装饰链，
 * 而适配器模式通常只包装一次。
 * 代理模式是为了控制对对象的访问, 通常也只包装一次。
 * 
 *  外观模式的作用倒是和适配器比较相似，
 * 有人把外观模式看成一组对象的适配器，
 * 但外观模式最显著的特点是定义了一个新的接口。
 */
