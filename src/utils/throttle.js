//定时器 第一次不触发 最后一次触发
export function throttle(func, wait) {
  let context, args, timeout;
  return function() {
      context = this;
      args = arguments;
      if (!timeout) {
          timeout = setTimeout(() => {
              timeout = null;
              func.call(context, args);
          }, wait);
      }
  }
}