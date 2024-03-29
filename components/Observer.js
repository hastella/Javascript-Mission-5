// 코드 재사용을 위하여 observe와 observable 함수로 만들어준다.
let currentObserver = null;

const observe = (fn) => {
  currentObserver = fn;
  fn();
  currentObserver = null;
};

const observable = (obj) => {
  const observerMap = new Set();

  return new Proxy(obj, {
    get(target, name) {
      observerMap[name] = observerMap[name] || new Set();
      if (currentObserver) observerMap[name].add(currentObserver);
      return target[name];
    },
    set(target, name, value) {
      if (target[name] === value) return true;
      if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      target[name] = value;
      observerMap[name].forEach((fn) => fn());
      return true;
    },
  });
};

export { observable, observe };
