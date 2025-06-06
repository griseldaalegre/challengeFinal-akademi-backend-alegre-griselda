const HttpError = require("../utils/Http-Error");

const isCourseOfThisUser = (userAuth, ownerId, resourceName = "para utilizar este recurso") => {
  if (userAuth.role === "superadmin") return;

  const ownerString = typeof ownerId === "object" && ownerId.toString ? ownerId.toString() : ownerId;
  const userString = userAuth._id.toString();

  if (userString !== ownerString) {
    throw new HttpError(`No autorizado: ${resourceName}`, 403);
  }
};

module.exports = isCourseOfThisUser;
