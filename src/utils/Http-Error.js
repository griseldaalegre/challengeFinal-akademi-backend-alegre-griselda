class HttpError extends Error {
  constructor(message, code = 500) {

    super(message instanceof Error ? message.message : message);

    this.code = code;
  }
}
module.exports = HttpError;
