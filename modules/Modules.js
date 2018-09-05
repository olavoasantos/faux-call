const base = require('./base.modules');

module.exports = () => {
  const list = {...base};

  const all = () => list;
  const get = (name) => list[name];
  const push = (name, value) => list[name].push(value);
  const assign = (name, key, value) => list[name][key] = value;
  const set = (name, value) => {
    list[name] = value;
    return list[name];
  };

  return { get, set, all, push, assign };
};
