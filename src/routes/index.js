const userRoute = require('./userRouter.js')

function route(app) {
    app.use('/user', userRoute)


}

module.exports = route;