import {Router} from "express"
import {prisma} from "../db.js"

const router= Router()

router.get("/",async(req, res)=>
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

router.post()