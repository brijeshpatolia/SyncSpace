import { StatusCodes } from "http-status-codes";

class validationError extends Error {
  constructor(errorDetails, message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = StatusCodes.BAD_REQUEST;

    let explanation = [];
    
    // Ensure errorDetails.error is defined before using Object.keys()
    if (errorDetails?.error && typeof errorDetails.error === "object") {
      Object.keys(errorDetails.error).forEach((key) => {
        explanation.push(errorDetails.error[key]);
      });
    }

    this.explanation = explanation;
    this.message = message;
  }
}

export default validationError;
