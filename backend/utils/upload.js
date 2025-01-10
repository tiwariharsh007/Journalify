export const uploadImageMiddleware = (req, res, next) => {
  if (req.file) {
    req.imgUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  }
  next();
};
