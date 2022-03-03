const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0);

// TypedArray
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0] = 2;

x1[0] //2

const buffer1 = new ArrayBuffer(32);
buffer1.byteLength // 32

const buffer2 = new ArrayBuffer(8);
ArrayBuffer.isView(buffer2) // false
// 相当于判断参数，是否为TypedArray实例或DataView实例
const v = new Int32Array(buffer2);
ArrayBuffer.isView(v) // true

// 2.2 typedArray constructor

const typedArray = new Int8Array(new Uint8Array(4)); // tip: 对应底层内存不同
const x = new Int8Array([1, 1]);
const y = new Int8Array(x);

x[0] //1
y[0] // 1
x[0] = 2;
y[0] // 1

// 2.3 数组方法
// 普通数组的操作方法和属性对TypedArray数组完全使用

/**
 * TypedArray.prototype.copyWithin()
 * entries()
 * every()
 * fill()
 * filter()
 * find()
 * findIndex()
 * forEach()
 * indexOf()
 * join()
 * keys()
 * lastIndexOf()
 * map()
 * reduce()
 * reduceRight()
 * reverse()
 * slice()
 * some()
 * sort()
 * toLocaleString()
 * toString()
 * values()
 */

// tip: TypedArray数组没有concat方法
// 合并多个TypedArray数组方法
function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset); // offset 指偏移量
        offset += arr.length;
    }
    return result;
}

concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4));
// Uint8Array: [1, 2, 3, 4]

let ui8 = Uint8Array.of(0, 1, 2);
for (let byte of ui8) {
    console.log(byte);
}

// 2.4 字节序
// 数值在内存中的表示方式

const buffer__ = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);

for (let i = 0; i < int32View.length; i++) {
    int32View[i] = i * 2;
} // 0 2 4 6


/**
 * 如果一段数据是大端字节序，
 * TypedArray 数组将无法正确解析，
 * 因为它只能处理小端字节序！
 * 为了解决这个问题，JavaScript 引入DataView对象，可以设定字节序，
 */

// 假定某段buffer包含如下字节 [0x02, 0x01, 0x03, 0x07]
const buffer_ = new ArrayBuffer(4);
const v1 = new Uint8Array(buffer);
v1[0] = 2;
v1[1] = 1;
v1[2] = 3;
v1[3] = 7;

const uInt16View = new Uint16Array(buffer_);
// 计算机采用小端字节序
// 头两个字节等于258
if (uInt16View[0] === 258) {
    console.log('ok'); // "ok"
}

// 赋值运算
uInt16View[0] = 255;    // 字节变为[0xFF, 0x00, 0x03, 0x07]
uInt16View[0] = 0xff05; // 字节变为[0x05, 0xFF, 0x03, 0x07]
uInt16View[1] = 0x0210; // 字节变为[0x05, 0xFF, 0x10, 0x02]

// 判断是小端字节序还是大端字节序
const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');

const getPlatformEndianness = function () {
    let arr32 = Uint32Array.of(0x1234578);
    let arr8 = new Uint8Array(arr32.buffer);
    switch((arr8[0]*0x1000000) + (arr8[1]*0x10000) + (arr8[2]*0x100) + (arr8[3])) {
        case 0x12345678:
            return BIG_ENDIAN;
        case 0x78563412:
            return LITTLE_ENDIAN;
        default:
            throw new Error('Unknown edianness...');
    }
};

// BYTES_PER_ELEMENT   --> 该数据类型占据的字节数
Int8Array.BYTES_PER_ELEMENT // 1
Uint8Array.BYTES_PER_ELEMENT // 1
Uint8ClampedArray.BYTES_PER_ELEMENT // 1
Int16Array.BYTES_PER_ELEMENT // 2
Uint16Array.BYTES_PER_ELEMENT // 2
Int32Array.BYTES_PER_ELEMENT // 4
Uint32Array.BYTES_PER_ELEMENT // 4
Float32Array.BYTES_PER_ELEMENT // 4
Float64Array.BYTES_PER_ELEMENT // 8

// 3. 复合视图
const buffer3 = new ArrayBuffer(24);

const idView = new Uint32Array(buffer3, 0, 1);
const usernameView = new Uint8Array(buffer3, 4, 16);
const amountDueView = new Float32Array(buffer3, 20, 1);

// 4. DataView 视图
/**
 * 如果一段数据包括多种类型（比如服务器传来的 HTTP 数据），
 * 这时除了建立ArrayBuffer对象的复合视图以外，
 * 还可以通过DataView视图进行操作。
 */

const dv = new DataView(new ArrayBuffer(24));

// 小端字节序
const v1 = dv.getUint16(1, true);

// 大端字节序
const v2 = dv.getUint16(3, false);

// 大端字节序
const v3 = dv.getUint16(3);

// 如果不确定正在使用的计算机的字节序，可以采用下面的判断方式。
const littleEndian = (function() {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
})();


fetch(url)
    .then(function(res) {
        return res.arrayBuffer()
    })
    .then(function(arrayBuffer) {
        // ...
    });


/**
 * SharedArrayBuffer与ArrayBuffer一样，
 * 本身是无法读写的，必须在上面建立视图，然后通过视图读写。 
 * 
 * Web worker 引入了多线程：主线程用来与用户互动，
 * Worker 线程用来承担计算任务。每个线程的数据都是隔离的，
 * 通过postMessage()通信。
 */
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);

const ia = new Int32Array(sab); // ia.length == 100000

const primes = new PrimeGenerator(); // 质数生成器

for (let i = 0; i < ia.length; i++) {
    ia[i] = primes.next();
}
// 主线程
const w = new Worker('myworker.js');
// 向 Worker 线程发送这段共享内存
w.postMessage(ia);

// Worker 线程接收到数据后处理
(function() {
    let ia;
    onmessage = function(ev) {
        ia = ev.data;
        console.log(ia.length);
        console.log(ia[37]); // 163
    }
})();
