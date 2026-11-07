import {Router} from "express"
import  {z} from "zod"
import bcrypt from "bcrypt"
import {prisma} from "./db.js"

const router= Router()

const signupSchema= z.object({
     username: z.string().min(1).max(100),
     password: z.string().min(1).max(6)
})

router.post("/signup", async(req,res)=>
{
     const result= signupSchema.safeParse(req.body)
     if(!result.success){
        return res.status(400).json({
            message:"invalid input"
        })
     }

     const {username, password}= result.data
     const userExists= await prisma.user.findFirst({
        where:{
            username
        }
     })

     if(userExists)({
        return res.status(409).json({
            message: "user already exists"
        })
     })

     const hashpassword= await bcrypt.hash(password,10)

     await prisma.user.create({
        data:{
            username,password:hashpassword
        }
     })

     return res.status(201).json({
        message: "user created successfully"
     })
})