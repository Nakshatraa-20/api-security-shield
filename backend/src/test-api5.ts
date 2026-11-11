import "dotenv/config"
import {checkAdminAccess} from "./checks/checkAdminAccess.js"

const userToken= process.env.DEMO_USER_TOKEN
const adminToken= process.env.DEMO_ADMIN_TOKEN

if(!userToken || !adminToken) {
    throw new Error("add both demo API tokens to the scanner backend")
}

const result= await checkAdminAccess({
    url:"http://localhost:4002/admin/products",
    body: {name:`API5 test product ${Date.now()}`, price:99},
    userToken,
    adminToken
})

console.log(result)