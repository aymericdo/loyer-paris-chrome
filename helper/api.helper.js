const server = 'https://encadrement-loyers.herokuapp.com'
// const server = 'http://localhost:3000'

const middleware = (response) => {
    if (response.status === 200) {
        return response.json()
    } else {
        throw Error(response.statusText)
    }
}
