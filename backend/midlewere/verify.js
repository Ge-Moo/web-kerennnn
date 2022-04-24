import jwt from 'jsonwebtoken'
import userInDb from '../model/userModel.js'
import {accessToken} from '../controller/userHandle.js'
export const verifyToken = async(req,res,next)=>{
    const Token = req.headers.authorization
    const token = Token && Token.split(' ')[1]
    if(!token) return res.sendStatus(403)
    console.log(token)
    jwt.verify(token,accessToken,async(err,decode)=>{
        if(err){ 
            console.log(err)
            return res.sendStatus(404)
        }
        const validateUserName = await userInDb.findOne({user:decode.name})
        if(!validateUserName) return res.sendStatus(404)
        req.userData = validateUserName
        next()
    })
}
