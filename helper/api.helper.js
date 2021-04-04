const SERVER = "https://encadrement-loyers.herokuapp.com";
// const SERVER = "http://localhost:3000";

const PLATFORM = "chrome";

const middlewareJson = (response) => {
  return response.json();
};

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
