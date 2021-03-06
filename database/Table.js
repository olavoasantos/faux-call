class Table {
  constructor() {
    this.index = 0;
    this.data = {};
  }

  all() {
    return Object.keys(this.data).map(id => this.data[id]);
  }

  where(column, value) {
    const id = Object.keys(this.data).find(id => this.data[id][column] === value);
    return this.select(id);
  }

  whereAll(column, value) {
    return Object.keys(this.data).filter(id => this.data[id][column] === value).map(id => this.select(id));
  }

  select(id) {
    return this.data[parseInt(id)];
  }

  create(data) {
    const now = new Date().getTime();
    this.index++;
    const entry = {
      id: this.index,
      created_at: now,
      updated_at: now,
      ...data,
    };

    this.data[this.index] = entry;
    return entry;
  }

  update(id, data) {
    const oldData = this.select(id);
    if (!oldData) return undefined;

    const entry = {
      ...oldData,
      ...data,
      id: parseInt(id),
      updated_at: (new Date).getTime()
    };

    this.data[id] = entry;
    return entry;
  }

  delete(id) {
    const data = this.select(id);
    if (!data) return undefined;

    delete this.data[data.id];
    return true;
  }
}

module.exports = Table;
