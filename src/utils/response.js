exports.success = (res, data = null, message = "OK") => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, status = 500, message = "Internal Server Error") => {
  res.status(status).json({
    success: false,
    error: message,
  });
};
