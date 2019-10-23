const server = 'https://encadrement-loyers.herokuapp.com'

const middlewareJson = (response) => {
    return response.json()
}

const middlewareErrorCatcher = (response) => {
    if (response.status && response.status !== 200) {
        throw response
    } else {
        return response
    }
}
