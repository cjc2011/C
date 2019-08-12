const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise_(fn) {
  let that = this 
  that.status = PENDING                  //初始化状态
  that.value = undefined                 //.then接收的value值
  that.reason = undefined                //失败的原因值
  that.onFulfilledCallbacks = []         //存储resolve时的回调函数
  that.onRejectCallbacks = []            //存储reject时的回调函数

  function resolve(val) {
    if (val instanceof Promise_) {
      return val.then(resolve, reject)
    }

    setTimeout( () => {
      if (that.status === PENDING) {
        that.status = FULFILLED
        that.value = val 
        that.onFulfilledCallbacks.forEach( (cb) => {
          cb(that.value)
        })
      }
    });
  }

  function reject(reason) {
    setTimeout( () => {
      if (that.status === PENDING) {
        that.status = REJECTED
        that.reason = reason
        that.onRejectCallbacks.forEach( (cb) => {
          cb(that.reason)
        })
      }
    })
  }

  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

Promise_.prototype.then = function(onFulfilled, onRejected) {
  typeof onFulfilled === 'function' && this.onFulfilledCallbacks.push(onFulfilled)
  typeof onRejected === 'function' && this.onRejectCallbacks.push(onRejected)
  return this
}