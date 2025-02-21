const httpResponseOk = (data = null, message = null) => {
  let response = {
    status: 'success',
    data: data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

const httpResponseError = (message = null) => {
  let response = {
    status: 'error',
  };
  if (message) {
    response.message = message;
  }
  return response;
};

module.exports = { httpResponseOk, httpResponseError };
