import "dotenv/config"
import {checkAuthentication} from "./checks/checkAuthentication.js"
import { zapRequest } from "./integrations/zap.js";

import {
    waitForPassiveScan,
    getZapAlerts
} from "./integrations/zap.js";

const userToken= process.env.DEMO_USER_TOKEN

if(!userToken){
    throw new Error("Add DEMO_USER_TOKEN to .env")

}

const result= await checkAuthentication(
    "http://host.docker.internal:4002/orders",
    userToken
)

console.log(result)
await waitForPassiveScan();
console.log("ZAP passive scan finished");

await waitForPassiveScan();

const alerts = await getZapAlerts(
    "http://host.docker.internal:4002/orders"
);

console.log("ZAP alerts:", alerts);