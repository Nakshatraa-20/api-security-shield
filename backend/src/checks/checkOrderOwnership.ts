
type TestCustomer={
    token: string
    orderId: string
}

export async function checkOrderOwnership(
    url:string,
    alice:TestCustomer,
    bob: TestCustomer
)
{
    const getOrderIds= async(token:string): Promise<string[]> =>{
        const response= await fetch(url, {
            headers:{Authorization:`Bearer ${token}`},
            redirect:"manual",
            signal: AbortSignal.timeout(5000)
        })

        if(response.status != 200){
            throw new Error(`Expected 200 from GET /orders, got ${response.status}`)
        }

        const orders= await response.json()
        if (!Array.isArray(orders)) {
            throw new Error("Expected an array of orders");
        }

    }
}
