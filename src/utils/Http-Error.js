// Esta clase representa un error HTTP personalizado
class HttpError extends Error {
  constructor(message, code = 500) {
    // Si el mensaje que se recibe es un Error (por ejemplo, un throw HttpError o un throw Error)
    // usamos su mensaje interno. Si no, usamos el texto directamente.
    super(message instanceof Error ? message.message : message);

    // Código de estado HTTP. Si no se pasa, por defecto es 500 (error interno del servidor)
    this.code = code;
  }
}
module.exports = HttpError;
