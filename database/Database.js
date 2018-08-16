const Table = require('./Table');

class Database {
  constructor() {
    this.tables = {};
  }

  all() {
    return this.tables;
  }

  exists(table) {
    return !!this.tables[table];
  }

  select(name) {
    return this.tables[name];
  }

  create(table) {
    if (this.exists(table)) {
      throw new Error(`Table "${table}" already exists.`)
    }
    this.tables[table] = new Table();
    return this.tables[table];
  }

  delete(table) {
    if (!this.exists(table)) {
      throw new Error(`Table "${table}" does not exist.`)
    }

    delete this.tables[table];
    return true;
  }
}

module.exports = Database;
