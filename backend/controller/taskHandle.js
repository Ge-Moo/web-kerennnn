import taskModel from '../model/userTaskModel.js'
import userInDb from '../model/userModel.js'
export const createTask = async(req,res)=>{
    try{
        const {user,taskName,begin,end} = req.body
        if(begin.toString().length !== 13 && end.toString().length !== 13) return res.status(403).json({msg:"date is not valid"})
        const data = new taskModel
        data.user = user
        data.taskName = taskName
        data.Begin = begin
        data.end = end
        data.Status = ''
        data.save()
        res.status(200).json({msg:"task created."})
        console.log(data)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }

}
export const deleteTask = async(req,res)=>{
    try{
        const {id} = req.body
        const deleteTASK = await taskModel.findByIdAndDelete(id)
        if(!deleteTASK) return res.status(203).json({msg:"no task to delete"})
        res.json({msg:'delete succesfully'})
    }catch(e){
        console.log(e)
        res.status(500).json({msg:"cannot delete"})
    }
}
export const allTaskOfaUser = async(req,res)=>{
    try {
        const user = req.params.username
        const userTask = await userInDb.findOne({user:user}).exec()
        const TASK = await taskModel.find({user:user})
        //console.log(userTask)
        if(!userTask) return res.status(404).json({msg:'user not found'})
        //if(TASK.length == 0) return res.status(200).json({msg:'no task'})
        //if(!TASK) return res.status(204).json({msg:'user not found'})
        res.json(TASK)
    } catch (err){
        console.log(err) 
        res.sendStatus(500)
    }
}
export const updateStatus = async(data) =>{
    const {id,Status} = data.body
    const Task = await taskModel.findOne({_id:id}).exec()
    const replacedb = {
        status
    }
    await taskModel.findOneAndReplace({_id:id},replacedb)
    const allTataOfaUserNew = await taskModel.find({user:Task.user})
    return(allTaskOfaUserNew)
}
