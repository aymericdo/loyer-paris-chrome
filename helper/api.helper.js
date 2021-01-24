const server = 'https://encadrement-loyers.herokuapp.com'

const middlewareJson = (response) => {
    return response.json()
}

const middlewareErrorCatcher = (response) => {
    if (response.error) {
        throw response
    } else {
        return response
    }
}
