(function () {
  var root = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this || {}

  // 初始化 config
  var J = {
    config: {
      mode: null, // 模式，目前有 web 和 wxa 两种模式
      api_url: '', // 远程请求的 base url
      api_header: {}, // 远程请求头
      socket_url: '', // websocket 地址
      debug: false // 是否开启调试信息
    }
  }

  if (typeof XMLHttpRequest !== 'undefined') {
    J.config.mode = 'web'
  } else if (typeof wx !== 'undefined' && typeof wx['request'] !== 'undefined') {
    J.config.mode = 'wxa' // 微信小程序
  }

  /**
   * 是否为未定义
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isUndefined() // return true
   *
   * J.isUndefined({}) // return false
   */
  J.isUndefined = function (obj) {
    return typeof obj === 'undefined'
  }

  /**
   * 是否为 null
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isNull(null) // return true
   *
   * J.isNull() // return false
   */
  J.isNull = function (obj) {
    return obj === null
  }

  /**
   * 是否为字符串
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isString('') // return true
   *
   * J.isString({}) // return false
   */
  J.isString = function (obj) {
    return typeof obj !== 'undefined' && obj !== null && obj.constructor === String
  }

  /**
   * 是否为数字
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isNumber(1) // return true
   *
   * J.isNumber({}) // return false
   */
  J.isNumber = function (obj) {
    return typeof obj !== 'undefined' && obj !== null && obj.constructor === Number
  }

  /**
   * 是否为数组
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isArray([]) // return true
   *
   * J.isArray({}) // return false
   */
  J.isArray = function (obj) {
    return obj && obj.constructor === Array
  }

  /**
   * 是否为对象
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isObject([]) // return true
   *
   * J.isObject({}) // return false
   */
  J.isObject = function (obj) {
    return obj && obj.constructor === Object
  }

  /**
   * 是否为函数
   * @param  {any}  obj
   * @return {Boolean}
   * @example
   * J.isFunction(function(){}) // return true
   *
   * J.isFunction({}) // return false
   */
  J.isFunction = function (obj) {
    return typeof obj === 'function'
  }

  /**
   * 是否为空对象。空对象包括：undefined、null、[]、{}、''
   * @param  {any}  obj
   * @return {Boolean}
   */
  J.isBlank = function (obj) {
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
   * J.id() // returns '1'
   *
   * J.id('name_') // returns 'name_2'
   */
  J.id = function (prefix) {
    idCounter++
    return typeof prefix === 'undefined' ? idCounter.toString() : prefix + idCounter
  }

  /**
   * 生成 UUID。
   * @return {string}
   * @example
   * J.uuid() // returns "314cf46a-ad7d-4ac2-9a02-55dc9300a2ae"
   */
  J.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }

  /**
   * 时间戳
   */
  J.timestamp = String(Date.now())

  /**
   * 循环数组或对象，执行函数。
   *
   * 可以通过返回 false 来终止循环。
   * @param  {array|object} collection
   * @param  {function} func
   * @return {array|object}
   * @example
   * J.each([1, 2], function(index, value){})
   *
   * J.each({a: 1}, function(key, value){})
   */
  J.each = function (collection, func) {
    if (J.isArray(collection)) {
      var index = -1
      var length = collection.length

      while (++index < length) {
        if (func(index, collection[index]) === false) {
          break
        }
      }
    } else if (J.isObject(collection)) {
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
   * J.map([1, 2], function(index, value){ return value + 1 }) //=> [2, 3]
   * J.map({a: 1}, function(key, value){ return value + 1 }) //=> {a: 2}
   * J.map([{a: 1}], 'a') //=> [1]
   */
  J.map = function (collection, func) {
    if (J.isString(func)) {
      var key = func
      func = function (index, item) {
        return item[key]
      }
    }
    if (J.isArray(collection)) {
      var index = -1
      var length = collection.length
      var result = []

      while (++index < length) {
        result[index] = func(index, collection[index])
      }
    } else if (J.isObject(collection)) {
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
   * J.findIndex(array, {id: 2}) // => 1
   * J.findIndex(array, function(item) { return item.id === 2 }) // => 1
   *
   * var obj = {a: {id: 1}, b: {id: 2}}
   * J.findIndex(obj, {id: 2}) // => 'b'
   * J.findIndex(obj, function(item) { return item.id === 2 }) // => 'b'
   */
  J.findIndex = function (collection, condition) {
    if (!J.isFunction(condition)) {
      var condition_data = condition
      condition = function (item) {
        var result = false
        J.each(condition_data, function (key, value) {
          if (item[key] === value) {
            result = true
            return false
          }
        })
        return result
      }
    }

    var index = -1
    J.each(collection, function (i, item) {
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
  J.filter = function (collection, condition) {
    var result = []

    J.each(collection, function (index, item) {
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
  J.first = function (collection, condition) {
    var result = null

    J.each(collection, function (index, item) {
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
  J.compact = function (collection) {
    if (J.isArray(collection)) {
      var index = -1
      var length = collection.length

      while (++index < length) {
        if (J.isBlank(collection[index])) {
          collection.splice(index, 1)
          index -= 1
          length -= 1
        }
      }
    } else if (J.isObject(collection)) {
      var index = -1
      var keys = Object.keys(collection)
      var length = keys.length

      while (++index < length) {
        if (J.isBlank(collection[keys[index]])) {
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
  J.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  var deep_merge = function (base, value) {
    J.each(value, function (k, v) {
      if (J.isObject(v)) {
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
  J.merge = function () {
    var args = Array.apply(null, arguments)
    var base = args.shift()

    if (J.isObject(base)) {
      J.each(args, function (i, obj) {
        J.each(obj, function (k, v) {
          if (J.isObject(v)) {
            deep_merge(base[k], v)
          } else {
            base[k] = v
          }
        })
      })
    } else if (J.isArray(base)) {
      J.each(args, function (i, arr) {
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
   * J.uniq([1, 1, 2]) //=> [1, 2]
   * J.uniq([{ k: 1 }, { k: 1 }, { k: 2 }]) //=> [{ k: 1 }, { k: 2 }]
   * J.uniq([1, 2, 3], function(index, item) { return item > 1 }) //=> [2, 3]
   */
  J.uniq = function (array, key) {
    var result = []

    if (typeof key === 'undefined') {
      var func = function (index, item) {
        return result.indexOf(item) < 0
      }
    } else {
      if (J.isString(key)) {
        var func = function (index, item) {
          var filter = {}
          filter[key] = item[key]
          return J.findIndex(result, filter) < 0
        }
      } else {
        var func = key
      }
    }
    J.each(array, function (index, item) {
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
  J.encodeURIComponent = function (object, prefix) {
    if (J.isString(object)) {
      return encodeURIComponent(object)
    }

    return J.compact(Object.keys(object).map(function (key) {
      if (J.isBlank(object[key])) {
        return ''
      } else if (J.isObject(object[key])) {
        if (J.isBlank(prefix)) {
          return J.encodeURIComponent(object[key], key)
        } else {
          return J.encodeURIComponent(object[key], prefix + '%5B' + key + '%5D')
        }
      } else {
        if (J.isBlank(prefix)) {
          return key + '=' + encodeURIComponent(object[key])
        } else {
          return prefix + '%5B' + key + '%5D=' + encodeURIComponent(object[key])
        }
      }
    })).join('&')
  }

  J.promise = function (func) {
    var data = {
      status: 'pending',
      args: null,
      _fulfilled: [],
      _rejected: [],
      _all: []
    }

    data.then = function (fulfilled, rejected) {
      if (J.isFunction(fulfilled)) {
        data._fulfilled.push(fulfilled)
      }

      if (J.isFunction(rejected)) {
        data._rejected.push(rejected)
      }

      if (data.status === 'fulfilled') {
        data.resolve.apply(this, data.args)
      }

      return data
    }

    data.catch = function (rejected) {
      if (J.isFunction(rejected)) {
        data._rejected.push(rejected)
      }

      if (data.status === 'rejected') {
        data.reject.apply(this, data.args)
      }

      return data
    }

    data.all = function (all) {
      if (J.isFunction(all)) {
        data._all.push(all)
      }

      return data
    }

    data.resolve = function () {
      data.args = arguments

      if (data.status === 'pending') {
        data.status = 'fulfilled'
      }

      J.each(data._fulfilled, function (i, callback) {
        callback.apply(this, data.args)
      })
      data._fulfilled = []

      J.each(data._all, function (i, callback) {
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

      J.each(data._rejected, function (i, callback) {
        callback.apply(this, data.args)
      })
      data._rejected = []

      J.each(data._all, function (i, callback) {
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
  J.deferred = function () {
    var data = {}

    data.promise = J.promise(function (resolve, reject) {
      data.resolve = resolve
      data.reject = reject
    })

    return data
  }

  /**
   * 观察者模块
   */
  J.topics = {}

  /**
   * 订阅通知
   * @param  {string} topic 主题名
   * @param  {function} callback 触发函数
   * @param  {object} [options] 选项
   * @param  {boolean} options.once 是否只执行一次。默认为 false，每次触发都执行
   * @param  {boolean} options.sync 是否同步执行。默认为 false，异步执行
   * @return {string} 被保存的主题名
   */
  J.on = function (topic, callback, options) {
    if (typeof topic !== 'string') {
      throw new TypeError('topic expect a string')
    }

    var query = J.id('.' + topic + '.')
    options = J.merge({
      once: false,
      sync: false
    }, options || {})

    J.topics[query] = {
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
  J.off = function (topic) {
    var query = '.' + topic + '.'

    J.each(J.topics, function (key) {
      if (key.startsWith(query)) {
        delete (J.topics[key])
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
  J.once = function (topic, callback, options) {
    J.on(topic, callback, J.merge(options, { once: true }))
  }

  J.sync = function (topic, callback, options) {
    J.on(topic, callback, J.merge(options, { sync: true }))
  }

  /**
   * 触发订阅事件
   * @param  {string} topic 主题名
   * @param  {object} data 数据
   * @return {promise}
   */
  J.trigger = function (topic, data) {
    var deferred = J.deferred()
    var query = '.' + topic + '.'
    var sync_callbacks = []
    var async_callbacks = []

    J.each(J.topics, function (key, value) {
      if (key.startsWith(query)) {
        if (value['options'] && value.options['sync']) {
          sync_callbacks.push(value.callback)
        } else {
          async_callbacks.push(value.callback)
        }
        if (value['options'] && value.options['once']) {
          delete (J.topics[key])
        }
      }
    })

    J.each(sync_callbacks, function (i, callback) {
      callback(topic, data)
    })

    setTimeout(function () {
      J.each(async_callbacks, function (i, callback) {
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
  J.getScript = function (source) {
    var deferred = J.deferred()
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
  J.module_names = {
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
  J.getModule = function (type, folder, name) {
    if (J.module_names[type].indexOf(name) >= 0) {
      var deferred = J.deferred()
      deferred.promise.resolve()
      return deferred.promise
    } else {
      return J.getScript(env.app.assets + folder + '/' + name + '.js?_=' + J.timestamp).then(function () {
        J.module_names[type].push(name)
      })
    }
  }

  /**
   * 加载插件，如果插件已经加载，则不会重复加载。
   * @param  {string} name 模块名字
   * @return {promise}
   */
  J.getPlugin = function (name) {
    return J.getModule('plugin', 'assets-plugins', name)
  }

  /**
   * 加载组件。如果组件已经加载，则不会重复加载。
   * @param {string} name 组件名字
   * @return {promise}
   */
  J.getTag = function (name) {
    return J.getModule('tag', 'assets-tags', name)
  }

  J.remote = {}

  /**
   * 网络请求
   * @param  {object} [options]
   * @param {string} options.method 请求方法，默认为 'GET'
   * @param {string} options.url 请求 URL，不能为空
   * @return {promise}
   */
  J.remote.request = function (options) {
    if (J.isString(options)) {
      options = {
        url: options
      }
    }
    options = J.merge({
      method: 'GET',
      dataType: 'json',
      header: J.config.api_header
    }, options || {})

    if (options.url.indexOf(location.host) >= 0) {
      options.url = options.url.replace(new RegExp('http(s)?:\/\/' + location.host), '')
    }

    if (J.isBlank(options['url'])) {
      throw new URIError('url 不能为空')
    }
 
    if (J.config.mode === null) {
      throw new TypeError('J.config.mode 初始化失败')
    }

    var deferred = J.deferred()

    switch (J.config.mode) {
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
        J.trigger('remote.request.success', res)
      } else {
        J.trigger('remote.request.fail', res)
      }
    }, function (res) {
      J.trigger('remote.request.fail', res)
    })

    return deferred.promise
  }

  /**
   * 发起一个 get 请求，如果 query 不是以 http 开头，则会加上 J.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  J.remote.get = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = J.config.api_url + query
    }

    if (!J.isBlank(params)) {
      query = query + '?' + J.encodeURIComponent(params)
    }

    return J.remote.request({
      url: query
    })
  }

  /**
   * 发起一个 post 请求，如果 query 不是以 http 开头，则会加上 J.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  J.remote.post = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = J.config.api_url + query
    }

    if (!J.isBlank(params)) {
      query = query + '?' + J.encodeURIComponent(params)
    }

    return J.remote.request({
      url: query,
      method: 'POST'
    })
  }

  /**
   * 发起一个 delete 请求，如果 query 不是以 http 开头，则会加上 J.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  J.remote.delete = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = J.config.api_url + query
    }

    if (!J.isBlank(params)) {
      query = query + '?' + J.encodeURIComponent(params)
    }

    return J.remote.request({
      url: query,
      method: 'DELETE'
    })
  }

  /**
   * 发起一个 put 请求，如果 query 不是以 http 开头，则会加上 J.config.api_url 作为前缀。
   * @param  {string} query
   * @param  {string} params
   * @return {promise}
   */
  J.remote.put = function (query, params) {
    if (query.indexOf('http') !== 0 && query.indexOf('/') !== 0) {
      query = J.config.api_url + query
    }

    if (!J.isBlank(params)) {
      query = query + '?' + J.encodeURIComponent(params)
    }

    return J.remote.request({
      url: query,
      method: 'PUT'
    })
  }

  // Restful 模块
  J.restful = {}

  J.restful.setData = function (target, data) {
    switch (J.config.mode) {
      case 'wxa':
        target.setData(data)
        break
      case 'web':
        target.data = J.merge(target.data, data)
        target.update()
        break
    }

    return data
  }

  J.restful.index = function (target, name, opts) {
    var init_data = {}
    init_data[name] = []
    init_data[name + '_next_link'] = null
    init_data[name + '_loading'] = false
    J.restful.setData(target, init_data)

    target[name + '_loaded_done'] = function (res) {
      var data = {}
      data[name] = target.data[name].concat(res.data)
      data[name + '_loading'] = false
      if (res['links'] && res.links['next']) {
        data[name + '_next_link'] = res.links['next']
      } else {
        data[name + '_next_link'] = null
      }

      J.restful.setData(target, data)
    }

    target[name + '_loaded_fail'] = function (res) {
      var data = {}
      data[name + '_loading'] = false
      J.restful.setData(target, data)
    }

    target[name + '_load_next'] = function () {
      var data = {}
      data[name + '_loading'] = true
      J.restful.setData(target, data)
      J.remote.get(target.data[name + '_next_link']).then(target[name + '_loaded_done'], target[name + '_loaded_fail'])
    }
  }

  J.restful.show = function (target, name, opts) {
    var init_data = {}
    init_data[name] = {}
    init_data[name + '_loading'] = false
    J.restful.setData(target, init_data)

    target[name + '_loaded_done'] = function (res) {
      var data = {}
      data[name] = res.data
      data[name + '_loading'] = false
      J.restful.setData(target, data)
    }

    target[name + '_loaded_fail'] = function (res) {
      var data = {}
      data[name + '_loading'] = false
      J.restful.setData(target, data)
    }
  }

  // Websocket
  J.socket = {
    instance: null,
    subscribed: []
  }

  var socket_cached_sends = {
    subscribe: []
  }

  /**
   * 连接 Websocket。连接地址在 J.config.socket_url。若已连接，不会重复连接。
   * @return {J.socket}
   */
  J.socket.connect = function () {
    if (J.socket.instance != null) {
      return J.socket.instance
    }

    if (J.config.mode === 'wxa') {
      var socket = { readyState: 0 }

      wx.connectSocket({
        url: J.config.socket_url,
        header: {
          'content-type': 'application/json',
          Cookie: 'X-JDXL=' + J.config.api_header['X-JDXL']
        }
      })

      wx.onSocketOpen(function (e) {
        socket.readyState = 1
        J.each(socket_cached_sends.subscribe, function (i, json) {
          wx.sendSocketMessage({ data: json })
        })
        socket_cached_sends.subscribe = []
        J.trigger('socket.open', e)
      })

      wx.onSocketError(function (e) {
        console.log(e)
        J.trigger('socket.error', e)
      })

      wx.onSocketMessage(function (e) {
        if (J.config.debug) {
          console.log(e)
        }

        var data = JSON.parse(e.data)
        var key = 'socket.message'

        if (data['identifier']) {
          key += '.' + JSON.parse(data.identifier).channel
        }

        if (data['type']) {
          key += '.' + data.type
        }

        if (J.isObject(data['message']) && data.message.action) {
          key += '.' + data.message.action
          data = data.message.data
        }

        J.trigger(key, data)
      })

      wx.onSocketClose(function (e) {
        console.log(e)
        J.trigger('socket.close', e)
      })
    } else {
      var socket = new WebSocket(J.config.socket_url)

      socket.onopen = function (e) {
        J.each(socket_cached_sends.subscribe, function (i, json) {
          J.socket.instance.send(json)
        })
        socket_cached_sends.subscribe = []
        J.trigger('socket.open', e)
      }

      socket.onmessage = function (e) {
        // console.log(e)
        var data = JSON.parse(e.data)
        var key = 'socket.message'

        if (data['identifier']) {
          key += '.' + JSON.parse(data.identifier).channel
        }

        if (data['type']) {
          key += '.' + data.type
        }

        if (J.isObject(data['message']) && data.message.action) {
          key += '.' + data.message.action
          data = data.message.data
        }

        J.trigger(key, data)
      }

      socket.onclose = function (e) {
        console.log(e)
        J.socket.instance = null
        J.trigger('socket.close', e)
      }

      socket.onerror = function (e) {
        console.log(e)
        J.trigger('socket.error', e)
      }
    }

    J.socket.instance = socket

    return J.socket
  }

  J.socket.alert = function () {
    $('.conversation_user-alert').append('<div class="j-alert j-alert-warn j-alert-fixed j-alert-socket"><div class="j-alert-icon j-alert-icon-warn"></div><div class="j-alert-content">你的网络似乎不太好，点这里刷新</div></div>')
  }

  /**
   * 发送信息
   * @param  {string} command 命令
   * @param  {object} identifier 标识，默认为 J.socket.identifier
   * @param  {object} data 数据
   * @return {J.socket}
   */
  J.socket.send = function (command, identifier, data) {
    if (J.isBlank(command)) {
      command = 'message'
    }

    var json = JSON.stringify({ command: command, identifier: JSON.stringify(identifier), data: JSON.stringify(data) })

    if (J.socket.instance && J.socket.instance.readyState === 1) {
      if (command === 'subscribe' || command === 'unsubscribe' || J.socket.subscribed.indexOf(identifier.channel) >= 0) {
        if (J.config.mode === 'wxa') {
          wx.sendSocketMessage({ data: json })
        } else {
          J.socket.instance.send(json)
        }
      } else {
        if (typeof socket_cached_sends[identifier.channel] === 'undefined') {
          socket_cached_sends[identifier.channel] = []
        }
        socket_cached_sends[identifier.channel].push(json)
      }
    } else {
      if (command === 'subscribe' || command === 'unsubscribe') {
        socket_cached_sends.subscribe.push(json)
      } else {
        if (typeof socket_cached_sends[identifier.channel] === 'undefined') {
          socket_cached_sends[identifier.channel] = []
        }
        socket_cached_sends[identifier.channel].push(json)
      }
    }

    return J.socket
  }

  /**
   * 发送指令
   * @param  {string} channel 频道名称
   * @param  {string} action 指令名称
   * @param  {object} data 附带信息
   * @return {J.socket}
   */
  J.socket.action = function (channel, action, data) {
    return J.socket.send('message', { channel: channel }, J.merge(data || {}, { action: action }))
  }

  /**
   * 订阅频道
   * @param  {string} channel 频道名
   * @param  {object} data 附加信息
   * @return {J.socket}
   */
  J.socket.subscribe = function (channel, data) {
    J.socket.send('subscribe', J.merge({ channel: channel }, data || {}))

    J.once('socket.message.' + channel + '.confirm_subscription', function (t, e) {
      var identifier = JSON.parse(e.identifier)

      J.socket.subscribed.push(identifier.channel)

      if (socket_cached_sends[identifier.channel]) {
        J.each(socket_cached_sends[identifier.channel], function (i, json) {
          J.socket.instance.send(json)
        })
        socket_cached_sends[identifier.channel] = []
      }
    })

    return J.socket
  }

  /**
   * 退订频道
   * @param  {string} channel 频道名
   * @param  {object} data 频道参数
   * @return {J.socket}
   */
  J.socket.unsubscribe = function (channel, data) {
    J.socket.identifier = J.merge({ channel: channel }, data || {})
    return J.socket.send('unsubscribe', J.socket.identifier)
  }

  J.socket.close = function () {
    if (J.config.mode === 'wxa') {
      wx.closeSocket()
    }

    J.socket.instance = null
    J.socket.subscribed = []
    socket_cached_sends = {
      subscribe: []
    }
  }

  // RequireJS
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return J
    })

    // CommonJS
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = J
  } else {
    root.J = J
  }
}.call(this))
