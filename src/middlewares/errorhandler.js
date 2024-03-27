export const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "INTERNAL SERVER ERROR";
  res.status(statusCode).json({ error: errorMessage });
};
