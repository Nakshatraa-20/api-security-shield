type AdminAccessCheck={
    url:string
    body: Record<string, unknown>
    userToken: string
    adminToken: string
}

export async function checkAdminAccess({
    url,
    body,
    userToken,
    adminToken
}: AdminAccessCheck){
    const sendRequest =(token: string)=>
        fetch(url, {
            method: "POST",
            headers:{
                "Content-type":"application/json",
                Authorization : `Bearer $(token)`
            },
            body: JSON.stringify(body),
            redirect:"manual",
            signal:AbortSignal.timeout(5000)
        })
        try {
            const userResponse= await sendRequest(userToken)
           if(userResponse.ok){
            return {
                result:"FAIL",
                message:`regular user received ${userResponse.status} on the admin route`
            }
           }
           if (userResponse.status !== 403) {
            return {
                result: "INCONCLUSIVE",
                message: `Expected 403 for the regular user, got ${userResponse.status}`
            };
        }

        const adminResponse= await sendRequest(adminToken)
        if(adminResponse.status !==201){
            return{
                result:"INCONCLUSIVE",
                message: `Expected 201 for the admin, got ${adminResponse.status}`
            }
        }
        return{
            result:"PASS",
            message:"Regular user was denied and admin could create the product"
        }

        }
        catch {
            return {
                result: "INCONCLUSIVE",
                message: "The request failed or timed out"
            };
        }
    }


   