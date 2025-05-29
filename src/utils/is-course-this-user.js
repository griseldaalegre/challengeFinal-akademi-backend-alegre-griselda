const HttpError = require("../utils/Http-Error");
const isCourseOfThisUser = (reqUserAuth, courseProfessorId) => {
  // Superadmin tiene acceso total
  if (reqUserAuth.role === "superadmin") return;

  // Solo el profesor que dicta puede acceder
  if (reqUserAuth._id.toString() !== courseProfessorId.toString()) {

    throw new HttpError("No autorizado: el curso no te pertenece", 403);
  }
};

module.exports = isCourseOfThisUser;
