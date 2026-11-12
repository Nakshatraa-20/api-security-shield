import "dotenv/config"
import {checkAuthentication} from "./checks/checkAuthentication.js"
import { zapRequest } from "./integrations/zap.js";

const userToken= process.env.DEMO_USER_TOKEN

if(!userToken){
    throw new Error("Add DEMO_USER_TOKEN to .env")

}

const result= await checkAuthentication(
    "http://host.docker.internal:4002/orders",
    userToken
)

console.log(result)
const queue = await zapRequest("/JSON/pscan/view/recordsToScan/");
console.log("Pending ZAP records:", queue.recordsToScan);