class ApiErrors extends Error {
  constructor(status, message = "Something went wrong", errors = [], stack = "") {
    super();
    this.status = status;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    }else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiErrors;

  
//   static BadRequest(message) {
//     return new ApiErrors(400, message);
//   }

//   static UnauthorizedError() {
//     return new ApiErrors(401, "User is not authorized");
//   }

//   static Forbidden(message) {
//     return new ApiErrors(403, message);
//   }

//   static NotFound(message) {
//     return new ApiErrors(404, message);
//   }

//   static Conflict(message) {
//     return new ApiErrors(409, message);
//   }

//   static Internal(message) {
//     return new ApiErrors(500, message);
//   }
