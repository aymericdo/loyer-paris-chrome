const SERVER = 'https://backend.aymericdo.ovh/encadrement-back';
// const SERVER = "http://localhost:3000";

const PLATFORM = "chrome";

const middlewareErrorCatcher = (response) => {
  if (
    (response &&
      Object.keys(response).length === 0 &&
      response.constructor === Object) ||
    response.error
  ) {
    throw response;
  } else {
    return response;
  }
};
