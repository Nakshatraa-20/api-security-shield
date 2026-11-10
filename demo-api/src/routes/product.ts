import {Router} from "express"
import {prisma} from "../db.js"
import {z} from "zod"
import {authMiddleware} from "../middleware/auth.js"

const router= Router()

const productSchema = z.object({
    name: z.string().trim().min(1).max(100),
    price: z.number().positive().max(99_999_999.99).multipleOf(0.01),
  });
  

router.get("/get-product",async(req, res)=>
{
    const products = await prisma.product.findMany()

    return res.json(products)
})

router.get("/:id", (req,res)=>

{
    const product= prisma.product.findMany({
        where:{
            id: req.params.id
        }
    })

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }
    return res.json(product)
})

router.post("/create-products", authMiddleware,async(req, res)=>{
const userId= (req as any).userId

if (typeof userId !== "string" || !userId)
{
    return res.status(401).json({
        message:"invalid user ID"
    })
}

const user= await prisma.user.findUnique({
    where:{
     id: userId,
    },
    select:{
        role: true
    }
})

if(!user || user.role !== "ADMIN"){
    return res.status(401).json({
        message: "only admin can create products"
    })
}

const result= productSchema.safeParse(req.body)

if(!result.success){
    return res.status(400).json({
        message:"invalid product details"
    })
}

const {name,price}= result.data
const product= await prisma.product.create({
    data:{name, price}
})
     return res.status(201).json(product)
})

export default router