import mongoose from 'mongoose'

const {Schema,model} = mongoose

const taskSchema = new Schema({
    user:String,
    taskName:String,
    Begin:Number,
    end:Number,
    Status:String
})

const task = model('task',taskSchema)

export default task
