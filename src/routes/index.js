const userRoute = require('./userRouter.js')
const productRoute = require('./productRouter')
function route(app) {
    app.use('/user', userRoute)
    app.use('/product', productRoute)

}

module.exports = route;