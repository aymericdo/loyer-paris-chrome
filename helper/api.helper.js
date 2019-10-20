const server = 'https://encadrement-loyers.herokuapp.com'
// const server = 'http://localhost:3000'

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
