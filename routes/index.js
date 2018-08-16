
const Routes = () => {
  const list = {};

  const createGroup = (name, route) => {
    if (list[name]) throw new Error(`Route ${name} already exists`);

    list[name] = {
      base: route,
      list: [],
    };

    return list[name];
  };

  const register = (name, type, route) => {
    if (!list[name]) throw new Error(`Route ${name} does not exists`);
    list[name].list.push({ type, route });
    return list[name];
  };

  const get = (name) => {
    if (!list[name]) throw new Error(`Route ${name} does not exists`);
    return list[name];
  }

  const all = () => list;

  return { register, createGroup, all, get };
}

module.exports = Routes();
