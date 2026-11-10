import {Router} from "express"
import  {z} from "zod"
import bcrypt from "bcrypt"
import {prisma} from "../db.js"
import jwt from "jsonwebtoken"

const router= Router()

const signupSchema= z.object({
     username: z.string().min(1).max(100),
     password: z.string().min(1).max(6)
})

const signinSchema= z.object({
   username: z.string().min(1,"Username is required").max(100),
   password: z.string().min(1, "password is required").max(100)
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
     try{
     const userExists= await prisma.user.findFirst({
        where:{
            username
        }
     })

     if(userExists){
        return res.status(409).json({
            message: "user already exists"
        })
     }

     const hashpassword= await bcrypt.hash(password,10)

     await prisma.user.create({
        data:{
            username,password:hashpassword,
            role:"USER"
        }
     })

     return res.status(201).json({
        message: "user created successfully"
     })
} 

catch(error){

   console.error("Signup failed:", error);
     return res.status(500).json({
      message:"unable to create user"
     })
}
})
router.post("/signin", async(req, res)=>
{
     const result= signinSchema.safeParse(req.body)
     if(!result.success){
      return res.status(400).json({
         message:"invalid input"
      })
     }
     if(!process.env.JWT_SECRET){
      return res.status(500).json({
         message:"jwt secret is not configured"

      })
     }
     const {username, password}= result.data
     const user= await prisma.user.findFirst({
      where:{ username} 
     })

     if(!user){
      return res.status(401).json({
         message:"user does not exist"
      })
     }

     const token= jwt.sign({userId: user.id}, process.env.JWT_SECRET)
     return res.json({token})

})

export default router



