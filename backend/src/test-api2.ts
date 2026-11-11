import "dotenv/config"
import {checkAuthentication} from "./checks/checkAuthentication.js"

const userToken= process.env.DEMO_USER_TOKEN

if(!userToken){
    throw new Error("Add DEMO_USER_TOKEN to .env")

}

const result= await checkAuthentication(
    "http://localhost:4002/orders",
    userToken
)

console.log(result)