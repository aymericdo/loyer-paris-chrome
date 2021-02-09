const server = 'https://encadrement-loyers.herokuapp.com'

const middlewareJson = (response) => {
    return response.json()
}

const middlewareErrorCatcher = (response) => {
    if (Object.keys(response).length === 0 || response.error) {
        throw response
    } else {
        return response
    }
}
