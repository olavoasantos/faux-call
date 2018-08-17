class Config {
  constructor() {
    this.secret = 'SUPER_SECRET_SECRET';
    this.authNamespace = '/auth';
    this.tokenHeader = 'Authorization';
  }
}

module.exports = Config;
