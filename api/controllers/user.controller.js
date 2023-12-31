import User from "../models/user.mode.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req,res)=>{
    res.json({
        message:"api is working",
    })
}

export const updateUser = async(req,res,next) =>{
    if(req.body.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"))

    try{
        if(req.body.password){
            req.body.password = await bcryptjs.hashSync(req.body.password , 10)
        }

        const updateduser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username : req.body.username,
                email : req.body.email,
                password: req.body.password,
                avatar : req.body.avatar
            }
        }, {new:true})

        const {password , ...rest} = updateUser._doc
        res.status(200).json(rest)

    }catch(err){
        next(errorHandler())
    }
}


export const deleteUser = async(req,res,next) =>{
    if((req.body.id) !== req.params.id) return next(errorHandler(401,'You can only delete your own account!'))
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).clearCookie('access_token').json('User has been deleted!')
    }catch(error){
        next(error)
    }
}