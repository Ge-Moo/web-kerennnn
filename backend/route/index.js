import user from '../model/userModel.js'
import express from 'express'
import {login,addUser,getUser,refreshAccesstoken,logOut} from '../controller/userHandle.js'
import {createTask,allTaskOfaUser,deleteTask} from '../controller/taskHandle.js'
import {verifyToken} from '../midlewere/verify.js'
const router = express.Router()

'USER'
router.get('/user',verifyToken,login)
router.post('/adduser',addUser)
router.post('/login',getUser)
router.get('/newtoken',refreshAccesstoken)
router.delete('/logout',logOut)
'TASK'
router.post('/addtask',createTask)
router.get('/getask/:username',allTaskOfaUser)
router.delete('/deletetask',deleteTask)

export default router
