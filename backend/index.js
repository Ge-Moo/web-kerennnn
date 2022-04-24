import mongoose from 'mongoose'
import router from './route/index.js'
import cookie from 'cookie-parser'
import morgan from 'morgan'
import { server,app,express } from './config/server.js'

const uri = 'mongodb://127.0.0.1:27017' 
const port = '9901' || process.env.PORT

//connect to mongodb
try {
    await mongoose.connect(uri)
    console.log('database connected')
} catch (err) {
    console.log(err.toString())
}

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookie())
app.use(router)

server.listen(port,()=>{
    console.log('your api running on port',port)
})
