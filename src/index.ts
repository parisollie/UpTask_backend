import colors from 'colors'
import server from './server'

//Vid 440
const port = process.env.PORT || 4000
//Vid 440
server.listen(port, () => {
    //Vid 441
    console.log( colors.cyan.bold( `REST API funcionando en el puerto ${port}` ))
})