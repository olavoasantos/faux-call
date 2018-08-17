const list = {
  'auth.namespace': '/',
  'token.header': 'Authorization',

  secret: 'SUPER_SECRET_SECRET',
};

const Config = (() => {
  const all = () => list;
  const get = (name) => list[name];
  const set = (name, value) => {
    list[name] = value;
    return list[name];
  }

  return { get, set, all };
})()

module.exports = Config;
