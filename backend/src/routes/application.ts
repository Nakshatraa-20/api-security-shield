import {Router} from "express"
import {z} from "zod";


const router= Router()
const createApplicationSchema= z.object({
    name:z.string().trim().min(1).max(100),
    description:z.string().trim().max(1000)
})

router.post("/",async(req,res)=>
{
    const data= createApplicationSchema.parse(req.body)

    const application= await prisma.application.create({
        data,
    })

    res.status(201).json(application)


})

export default router;