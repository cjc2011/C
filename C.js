(function () {
  var root = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this || {}

  // 初始化 config
  var C = {
    config: {
      mode: null, // 模式，目前有 web 和 wxa 两种模式
      api_url: '', // 远程请求的 base url
      api_header: {}, // 远程请求头
      socket_url: '', // websocket 地址
      debug: false // 是否开启调试信息
    }
  }

  if (typeof XMLHttpRequest !== 'undefined') {
    C.config.mode = 'web'
  } else if (typeof wx !== 'undefined' && typeof wx['request'] !== 'undefined') {
    C.config.mode = 'wxa' // 微信小程序
  }

  /**
   * 是否为未定义
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isUndefined() // return true
   *
   * C.isUndefined({}) // return false
   */
  C.isUndefined = function (obj) {
    return typeof obj === 'undefined'
  }

  /**
   * 是否为 null
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isNull(null) // return true
   *
   * C.isNull() // return false
   */
  C.isNull = function (obj) {
    return obj === null
  }

  /**
   * 是否为字符串
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isString('') // return true
   *
   * C.isString({}) // return false
   */
  C.isString = function (obj) {
    return typeof obj !== 'undefined' && obj !== null && obj.constructor === String
  }

  /**
   * 是否为数字
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isNumber(1) // return true
   *
   * C.isNumber({}) // return false
   */
  C.isNumber = function (obj) {
    return typeof obj !== 'undefined' && obj !== null && obj.constructor === Number
  }

  /**
   * 是否为数组
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isArray([]) // return true
   *
   * C.isArray({}) // return false
   */
  C.isArray = function (obj) {
    return obj && obj.constructor === Array
  }

  /**
   * 是否为对象
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isObject([]) // return true
   *
   * C.isObject({}) // return false
   */
  C.isObject = function (obj) {
    return obj && obj.constructor === Object
  }

  /**
   * 是否为函数
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * C.isFunction(function(){}) // return true
   *
   * C.isFunction({}) // return false
   */
  C.isFunction = function (obj) {
    return typeof obj === 'function'
  }

  /**
   * 是否为空对象。空对象包括：undefined、null、[]、{}、''
   * @param  {any}  obj
   * @return {Boolean}
   */
  C.isBlank = function (obj) {
    if (typeof obj === 'undefined' || obj === null || (obj.constructor === Array && obj.length === 0) || (obj.constructor === Object && Object.keys(obj).length === 0) || (obj.constructor === String && obj === '')) {
      return true
    }

    return false
  }

  var idCounter = 0

  /**
   * 生成不重复的 ID。
   * @param {string} prefix
   * @return {string}
   * @example
   * C.id() // returns '1'
   *
   * C.id('name_') // returns 'name_2'
   */
  C.id = function (prefix) {
    idCounter++
    return typeof prefix === 'undefined' ? idCounter.toString() : prefix + idCounter
  }

  /**
   * 生成 UUID。
   * @return {string}
   * @example
   * C.uuid() // returns "314cf46a-ad7d-4ac2-9a02-55dc9300a2ae"
   */
  C.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }

  /**
   * 时间戳
   */
  C.timestamp = String(Date.now())

  /**
   * 循环数组或对象，执行函数。
   *
   * 可以通过返回 false 来终止循环。
   * @param  {array|object} collection
   * @param  {function} func
   * @return {array|object}
   * @example
   * C.each([1, 2], function(index, value){})
   *
   * C.each({a: 1}, function(key, value){})
   */
  C.each = function (collection, func) {
    if (C.isArray(collection)) {
      var index = -1
      var length = collection.length

      while (++index < length) {
        if (func(index, collection[index]) === false) {
          break
        }
      }
    } else if (C.isObject(collection)) {
      var index = -1
      var keys = Object.keys(collection)
      var length = keys.length

      while (++index < length) {
        if (func(keys[index], collection[keys[index]]) === false) {
          break
        }
      }
    } else {
      throw new TypeError('Expected array or object')
    }

    return collection
  }

  /**
   * 循环数组或对象，执行函数并将结果返回。
   * @param  {array|object} collection
   * @param  {function|string} func 回调函数，若为字符串，则取对象中 key 的值
   * @return {array|object}
   * @example
   * C.map([1, 2], function(index, value){ return value + 1 }) //=> [2, 3]
   * C.map({a: 1}, function(key, value){ return value + 1 }) //=> {a: 2}
   * C.map([{a: 1}], 'a') //=> [1]
   */
  C.map = function (collection, func) {
    if (C.isString(func)) {
      var key = func
      func = function (index, item) {
        return item[key]
      }
    }
    if (C.isArray(collection)) {
      var index = -1
      var length = collection.length
      var result = []

      while (++index < length) {
        result[index] = func(index, collection[index])
      }
    } else if (C.isObject(collection)) {
      var index = -1
      var keys = Object.keys(collection)
      var length = keys.length
      var result = {}

      while (++index < length) {
        result[keys[index]] = func(keys[index], collection[keys[index]])
      }
    } else {
      throw new TypeError('Expected array or object')
    }

    return result
  }

  /**
   * 按条件找出对象或数组中的索引值
   * @param  {array|object} collection 数组或对象
   * @param  {function|object} condition  查询条件
   * @return {number|string} 若没找到，就返回 -1
   * @example
   * var array = [{id: 1}, {id: 2}]
   * C.findIndex(array, {id: 2}) // => 1
   * C.findIndex(array, function(item) { return item.id === 2 }) // => 1
   *
   * var obj = {a: {id: 1}, b: {id: 2}}
   * C.findIndex(obj, {id: 2}) // => 'b'
   * C.findIndex(obj, function(item) { return item.id === 2 }) // => 'b'
   */
  C.findIndex = function (collection, condition) {
    if (!C.isFunction(condition)) {
      var condition_data = condition
      condition = function (item) {
        var result = false
        C.each(condition_data, function (key, value) {
          if (item[key] === value) {
            result = true
            return false
          }
        })
        return result
      }
    }

    var index = -1
    C.each(collection, function (i, item) {
      if (condition(item)) {
        index = i
        return false
      }
    })

    return index
  }

  /**
   * 按指定条件筛选数组元素
   * @param {array} collection
   * @param {function} condition
   */
  C.filter = function (collection, condition) {
    var result = []

    C.each(collection, function (index, item) {
      if (condition(index, item)) {
        result.push(item)
      }
    })

    return result
  }

  /**
   * 按指定条件找到数组中第一个符合要求的元素
   * @param {array} collection
   * @param {function} condition
   */
  C.first = function (collection, condition) {
    var result = null

    C.each(collection, function (index, item) {
      if (condition(index, item)) {
        result = item
        return false
      }
    })

    return result
  }

  /**
   * 清理数组或对象中的值为空的健
   * @param  {array|object} collection
   * @return {array|object}
   */
  C.compact = function (collection) {
    if (C.isArray(collection)) {
      var index = -1
      var length = collection.length

      while (++index < length) {
        if (C.isBlank(collection[index])) {
          collection.splice(index, 1)
          index -= 1
          length -= 1
        }
      }
    } else if (C.isObject(collection)) {
      var index = -1
      var keys = Object.keys(collection)
      var length = keys.length

      while (++index < length) {
        if (C.isBlank(collection[keys[index]])) {
          delete collection[keys[index]]
          keys.splice(index, 1)
          index -= 1
          length -= 1
        }
      }
    } else {
      throw new TypeError('Expected array or object')
    }

    return collection
  }

  /**
   * 复制对象，不可复制函数
   * @param {object} obj
   * @return {object}
   */
  C.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  var deep_merge = function (base, value) {
    C.each(value, function (k, v) {
      if (C.isObject(v)) {
        if (typeof base[k] === 'undefined') {
          base[k] = {}
        }
        deep_merge(base[k], v)
      } else {
        base[k] = v
      }
    })
  }

  /**
   * 合并对象或数组
   * @param {object|array} base
   * @param {object|array} extends
   * @return {object|array}
   */
  C.merge = function () {
    var args = Array.apply(null, arguments)
    var base = args.shift()

    if (C.isObject(base)) {
      C.each(args, function (i, obj) {
        C.each(obj, function (k, v) {
          if (C.isObject(v)) {
            deep_merge(base[k], v)
          } else {
            base[k] = v
          }
        })
      })
    } else if (C.isArray(base)) {
      C.each(args, function (i, arr) {
        base = base.concat(arr)
      })
    }

    return base
  }

  /**
   * 去重数组
   * @param {array} array
   * @param {string|function} key 当为字符串时，用于以 object 的某个 key 的值为去重依据；为函数时则根据回调结果去重
   * @return {array}
   * @example
   * C.uniq([1, 1, 2]) //=> [1, 2]
   * C.uniq([{ k: 1 }, { k: 1 }, { k: 2 }]) //=> [{ k: 1 }, { k: 2 }]
   * C.uniq([1, 2, 3], function(index, item) { return item > 1 }) //=> [2, 3]
   */
  C.uniq = function (array, key) {
    var result = []

    if (typeof key === 'undefined') {
      var func = function (index, item) {
        return result.indexOf(item) < 0
      }
    } else {
      if (C.isString(key)) {
        var func = function (index, item) {
          var filter = {}
          filter[key] = item[key]
          return C.findIndex(result, filter) < 0
        }
      } else {
        var func = key
      }
    }
    C.each(array, function (index, item) {
      if (func(index, item)) {
        result.push(item)
      }
    })

    return result
  }

  /**
   * 将字符串或对象编码成符合 URI 的格式
   * @param  {string|object} object
   * @param  {string} prefix 前缀，可选
   * @return {string}
   */
  C.encodeURIComponent = function (object, prefix) {
    if (C.isString(object)) {
      return encodeURIComponent(object)
    }

    return C.compact(Object.keys(object).map(function (key) {
      if (C.isBlank(object[key])) {
        return ''
      } else if (C.isObject(object[key])) {
        if (C.isBlank(prefix)) {
          return C.encodeURIComponent(object[key], key)
        } else {
          return C.encodeURIComponent(object[key], prefix + '%5B' + key + '%5D')
        }
      } else {
        if (C.isBlank(prefix)) {
          return key + '=' + encodeURIComponent(object[key])
        } else {
          return prefix + '%5B' + key + '%5D=' + encodeURIComponent(object[key])
        }
      }
    })).join('&')
  }

  C.promise = function (func) {
    var data = {
      status: 'pending',
      args: null,
      _fulfilled: [],
      _rejected: [],
      _all: []
    }

    data.then = function (fulfilled, rejected) {
      if (C.isFunction(fulfilled)) {
        data._fulfilled.push(fulfilled)
      }

      if (C.isFunction(rejected)) {
        data._rejected.push(rejected)
      }

      if (data.status === 'fulfilled') {
        data.resolve.apply(this, data.args)
      }

      return data
    }

    data.catch = function (rejected) {
      if (C.isFunction(rejected)) {
        data._rejected.push(rejected)
      }

      if (data.status === 'rejected') {
        data.reject.apply(this, data.args)
      }

      return data
    }

    data.all = function (all) {
      if (C.isFunction(all)) {
        data._all.push(all)
      }

      return data
    }

    data.resolve = function () {
      data.args = arguments

      if (data.status === 'pending') {
        data.status = 'fulfilled'
      }

      C.each(data._fulfilled, function (i, callback) {
        callback.apply(this, data.args)
      })
      data._fulfilled = []

      C.each(data._all, function (i, callback) {
        callback.apply(this, data.args)
        data._all.splice(i, 1)
      })
      data._all = []
    }

    data.reject = function () {
      data.args = arguments

      if (data.status === 'pending') {
        data.status = 'rejected'
      }

      C.each(data._rejected, function (i, callback) {
        callback.apply(this, data.args)
      })
      data._rejected = []

      C.each(data._all, function (i, callback) {
        callback.apply(this, data.args)
      })
      data._all = []
    }

    setTimeout(function () {
      func(data.resolve, data.reject)
    })

    return data
  }

  /**
   * 新建一个 deferred 对象
   * @return {deferred}
   */
  C.deferred = function () {
    var data = {}

    data.promise = C.promise(function (resolve, reject) {
      data.resolve = resolve
      data.reject = reject
    })

    return data
  }

  /**
   * 观察者模块
   */
  C.topics = {}

  /**
   * 订阅通知
   * @param  {string} topic 主题名
   * @param  {function} callback 触发函数
   * @param  {object} [options] 选项
   * @param  {boolean} options.once 是否只执行一次。默认为 false，每次触发都执行
   * @param  {boolean} options.sync 是否同步执行。默认为 false，异步执行
   * @return {string} 被保存的主题名
   */
  C.on = function (topic, callback, options) {
    if (typeof topic !== 'string') {
      throw new TypeError('topic expect a string')
    }

    var query = C.id('.' + topic + '.')
    options = C.merge({
      once: false,
      sync: false
    }, options || {})

    C.topics[query] = {
      options: options,
      callback: callback
    }

    return query
  }

  /**
   * 取消订阅
   * @param  {string} topic 主题名
   * @return {undefined}
   */
  C.off = function (topic) {
    var query = '.' + topic + '.'

    C.each(C.topics, function (key) {
      if (key.startsWith(query)) {
        delete (C.topics[key])
      }
    })
  }

  /**
   * 只订阅一次通知
   * @param  {string} topic 主题名
   * @param  {function} callback 触发函数
   * @param  {object} [options] 选项
   * @param  {boolean} options.sync 是否同步执行。默认为 false，异步执行
   * @return {string} 被保存的主题名
   */
  C.once = function (topic, callback, options) {
    C.on(topic, callback, C.merge(options, { once: true }))
  }

  C.sync = function (topic, callback, options) {
    C.on(topic, callback, C.merge(options, { sync: true }))
  }

  /**
   * 触发订阅事件
   * @param  {string} topic 主题名
   * @param  {object} data 数据
   * @return {promise}
   */
  C.trigger = function (topic, data) {
    var deferred = C.deferred()
    var query = '.' + topic + '.'
    var sync_callbacks = []
    var async_callbacks = []

    C.each(C.topics, function (key, value) {
      if (key.startsWith(query)) {
        if (value['options'] && value.options['sync']) {
          sync_callbacks.push(value.callback)
        } else {
          async_callbacks.push(value.callback)
        }
        if (value['options'] && value.options['once']) {
          delete (C.topics[key])
        }
      }
    })

    C.each(sync_callbacks, function (i, callback) {
      callback(topic, data)
    })

    setTimeout(function () {
      C.each(async_callbacks, function (i, callback) {
        callback(topic, data)
      })
      deferred.resolve()
    })

    return deferred.promise
  }

  /**
   * 动态载入 js 文件
   * @param {string} source 地址
   * @return {promise}
   */
  C.getScript = function (source) {
    var deferred = C.deferred()
    var script = document.createElement('script')
    var prior = document.getElementsByTagName('script')[0]
    script.async = 1

    script.onload = script.onreadystatechange = function (_, isAbort) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;

        if (!isAbort) {
          deferred.resolve && deferred.resolve()
        }
      }
    }

    script.src = source
    prior.parentNode.insertBefore(script, prior)

    return deferred.promise
  }

  /**
   * 已加载的模块记录
   * @type {Object}
   * @prop {string[]} plugin 插件
   * @prop {string[]} tag 组件
   */
  C.module_names = {
    plugin: [],
    tag: []
  }

  /**
   * 加载组件/模块，如果已被加载过，不会重复加载
   * @param  {string} type 类型，目前仅支持 plugin 和 tag
   * @param {string} folder 对应的文件夹
   * @param  {string} name 组件或模块的名字
   * @return {promise}
   */
  C.getModule = function (type, folder, name) {
    if (C.module_names[type].indexOf(name) >= 0) {
      var deferred = C.deferred()
      deferred.promise.resolve()
      return deferred.promise
    } else {
      return C.getScript(env.app.assets + folder + '/' + name + '.js?_=' + C.timestamp).then(function () {
        C.module_names[type].push(name)
      })
    }
  }

  /**
   * 加载插件，如果插件已经加载，则不会重复加载。
   * @param  {string} name 模块名字
   * @return {promise}
   */
  C.getPlugin = function (name) {
    return C.getModule('plugin', 'assets-plugins', name)
  }

  /**
   * 加载组件。如果组件已经加载，则不会重复加载。
   * @param {string} name 组件名字
   * @return {promise}
   */
  C.getTag = function (name) {
    return C.getModule('tag', 'assets-tags', name)
  }

  C.remote = {}

  /**
   * 网络请求
   * @param  {object} [options]
   * @param {string} options.method 请求方法，默认为 'GET'
   * @param {string} options.url 请求 URL，不能为空
   * @return {promise}
   */
  C.remote.request = function (options) {
    if (C.isString(options)) {
      options = {
        url: options
      }
    }
    options = C.merge({
      method: 'GET',
      dataType: 'json',
      header: C.config.api_header
    }, options || {})

    if (options.url.indexOf(location.host) >= 0) {
      options.url = options.url.replace(new RegExp('http(s)?:\/\/' + location.host), '')
    }

    if (C.isBlank(options['url'])) {
      throw new URIError('url 不能为空')
    }

    if (C.config.mode === null) {
      throw new TypeError('C.config.mode 初始化失败')
    }

    var deferred = C.deferred()

    switch (C.config.mode) {
      case 'wxa':
        options.success = function (res) {
          if (res.data.errors) {
            deferred.reject(res)
          } else {
            deferred.resolve(res.data)
          }
        }
        options.fail = function (res) {
          deferred.reject(res)
        }
        options.header['content-type'] = 'application/x-www-form-urlencoded'
        wx.request(options)
        break
      case 'web':
        var req = new XMLHttpRequest()

        req.addEventListener('load', function (res) {
          try {
            if (res.currentTarget.response.data['errors']) {
              deferred.reject(res)
            } else {
              deferred.resolve(res.currentTarget.response)
            }
          } catch (error) {
            deferred.reject(res)
          }
        })

        req.addEventListener('error', function (res) {
          deferred.reject(res)
        })

        req.open(options.method, options.url)
        req.responseType = options.dataType
        req.send()
        break
    }

    deferred.promise.then(function (res) {
      if (res.data) {
        C.trigger('remote.request.success', res)
      } else {
        C.trigger('remote.request.fail', res)
      }
    }, function (res) {
      C.trigger('remote.request.fail', res)
    })

    return deferred.promise
  }

  /**
   * 发起一个 get 请求，如果 query 不是以 http 开头，则会加上 C.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  C.remote.get = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = C.config.api_url + query
    }

    if (!C.isBlank(params)) {
      query = query + '?' + C.encodeURIComponent(params)
    }

    return C.remote.request({
      url: query
    })
  }

  /**
   * 发起一个 post 请求，如果 query 不是以 http 开头，则会加上 C.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  C.remote.post = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = C.config.api_url + query
    }

    if (!C.isBlank(params)) {
      query = query + '?' + C.encodeURIComponent(params)
    }

    return C.remote.request({
      url: query,
      method: 'POST'
    })
  }

  /**
   * 发起一个 delete 请求，如果 query 不是以 http 开头，则会加上 C.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  C.remote.delete = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = C.config.api_url + query
    }

    if (!C.isBlank(params)) {
      query = query + '?' + C.encodeURIComponent(params)
    }

    return C.remote.request({
      url: query,
      method: 'DELETE'
    })
  }

  /**
   * 发起一个 put 请求，如果 query 不是以 http 开头，则会加上 C.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  C.remote.put = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = C.config.api_url + query
    }

    if (!C.isBlank(params)) {
      query = query + '?' + C.encodeURIComponent(params)
    }

    return C.remote.request({
      url: query,
      method: 'PUT'
    })
  }

  // RequireJS
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return C
    })

    // CommonJS
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = C
  } else {
    root.C = C
  }
}.call(this))
