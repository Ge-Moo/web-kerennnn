import UserInDb from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const unikToken = 'anjingadalahhewankakiw,cndvbjvfvbfvhfbvhfbvhbvckcjdcndjdncsc'
export const accessToken = 'cnsjnjnc'+unikToken
export const refreshToken = 'cndjcndjcndjc'+unikToken

export const login = async(req,res)=>{
    const User = req.userData
    res.send(User)
}

export const addUser = async(req,res) =>{
    const isUser = await UserInDb.findOne({user:req.body.user}).exec()
    if(isUser) return res.status(403).json({msg:"username has used"})
    if(req.body.password !== req.body.confirmPassword) return res.status(403).json({msg:"password not equals with confirm password"})
    const salt = await bcrypt.genSalt()
    const hassPassword = await bcrypt.hash(req.body.password,salt)
    try{
        const newUser = new UserInDb
        newUser.user = req.body.user
        newUser.password = hassPassword
        newUser.refreshToken = ''
        newUser.save()
    }catch(e){
        console.log(e.toString())
        res.status(500).json({msg:"register failed"})
    }
    res.status(200).json({msg:"register User Succesfully"})
}

export const getUser = async(req,res)=>{
    const name = req.body.user
    const password = req.body.password
    const user = await UserInDb.findOne({user:name}).exec()
    if(!user) return res.status(400).json({msg:'user not found'})
    const validatePassword = bcrypt.compare(password,user.password)
    if(!validatePassword) return res.status(403).json({msg:"password not valid"})
    const token = jwt.sign({name},accessToken,{expiresIn:'40s'})
    
    //adding refresh token to db 
    const rfshtoken = jwt.sign({name},refreshToken,{expiresIn:'48h'})
    const replacedb = {
        user:user.user,password:user.password,refreshToken:rfshtoken
    }
    //console.log(replacedb)
    const update = await UserInDb.findOneAndReplace({user:name},replacedb)
    //console.log(update)
    res.cookie('refreshToken',rfshtoken,{
        httpOnly:true,
        maxAge:48*60*60*1000
    })
    res.status(200).json({accessToken:token})

}
export const refreshAccesstoken = async(req,res)=>{
    //verifikasi refresh token cookie
    const refresh = req.cookies.refreshToken
    if(!refresh) return res.sendStatus(500)
    console.log(refresh)
    const user = await UserInDb.findOne({refreshToken:refresh}).exec()
    if(!user) return res.status(404).json({msg : 'you mustbe login first to get new access token'})
    jwt.verify(refresh,refreshToken,(err,decode)=>{
        if(err){
            console.log(err)
            return res.status(403).json({msg:"refresh token has expired"})
        }
        const newToken = jwt.sign({name:decode.name},accessToken,{expiresIn:'40s'})
        res.status(200).json({accessToken:newToken,msg:"new token has send to you"})
    })
}
export const logOut = async(req,res) =>{
    //res.json({res:req.cookies})
    const token = req.cookies.refreshToken
    const user = await UserInDb.findOne({refreshToken:token}).exec()
    //console.log(user)
    if(!user) return res.status(404).json({msg:"user has been logout"})
    const replacedb = {
        user:user.user,
        password:user.password,
        refreshToken:''
    }
    //console.log(replacedb)
    const userupdate = await UserInDb.findOneAndReplace({user:user.user},replacedb)
    res.clearCookie(refreshToken)
    res.status(200).json({msg:"loguot Succesfully"})
    //console.log(userupdate)
}
