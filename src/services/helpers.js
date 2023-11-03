export function validateValueRequired(val, message = '') {
  if (val === void 0) {
    return Promise.reject({
      message,
    });
  }
  return Promise.resolve(true);
}