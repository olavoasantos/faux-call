
const Routes = () => {
  const routes = [];
  const groups = {}

  const createGroup = (name, route) => {
    if (groups[name]) throw new Error(`Route ${name} already exists`);

    groups[name] = { base: route };
    return groups[name];
  };

  const register = (type, route) => {
    routes.push(`${type}:${route}`);
  };

  const get = (name) => {
    if (!groups[name]) throw new Error(`Route ${name} does not exists`);
    return groups[name];
  }

  const all = () => groups;
  const list = () => routes;

  return { register, createGroup, all, get, list };
}

module.exports = Routes();
