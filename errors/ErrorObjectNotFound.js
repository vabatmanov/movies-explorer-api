class ErrorObjectNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorObjectNotFound';
    this.statusCode = 404;
  }
}

module.exports = ErrorObjectNotFound;
