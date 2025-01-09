export const errorHandler = (statusCode, message) => {
  const error = new Error(message);  // Set message as error.message
  error.statusCode = statusCode;
  return error;
};
