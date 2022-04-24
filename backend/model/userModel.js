import mongoose from 'mongoose'
const {Schema,model} = mongoose
const userSchema = new Schema({
    user:String,
    password:String,
    refreshToken:String
})

const user = model('userManage',userSchema)

export default user
