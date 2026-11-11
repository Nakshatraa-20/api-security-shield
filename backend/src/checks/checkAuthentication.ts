export async function checkAuthentication(url:string, validToken: string){
    const sendRequest= (token?: string)=>{
        return fetch(url,{
            method:"GET",
            headers: token? {Authorization: `Bearer ${token}`} : {},
            redirect: "manual",
            signal: AbortSignal.timeout(5000)

        })
    }



try{
    const validResponse= await sendRequest(validToken)
    if (validResponse.status !== 200) {
        return {
            result: "INCONCLUSIVE",
            message: `Valid token returned ${validResponse.status}. Expected 200.`
        };
    }
    const notokenResponse= await sendRequest()
    const invalidTokenResponse= await sendRequest("invalid token")

    const message =
    `No token returned ${notokenResponse.status}. ` +
    `Invalid token returned ${invalidTokenResponse.status}.`

if(notokenResponse.ok|| invalidTokenResponse.ok){
    return {
        result:"FAIL",
        message
    }

}
if (notokenResponse.status === 401 && invalidTokenResponse.status === 401) {
    return { result: "PASS", message };
}
return { result: "INCONCLUSIVE", message }
}
catch {
    return {
        result: "INCONCLUSIVE",
            message: "The request failed or timed out"
    }
}
}