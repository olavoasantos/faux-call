const list = {
  'auth.namespace': '/',
  'token.header': 'Authorization',

  factories: [],
  secret: 'SUPER_SECRET_SECRET',
};

const Config = (() => {
  const all = () => list;
  const push = (name, value) => list[name].push(value);
  const get = (name) => list[name];
  const set = (name, value) => {
    list[name] = value;
    return list[name];
  }

  return { get, set, all, push };
})()

module.exports = Config;
