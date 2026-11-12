import { zapFetch } from "../integrations/zap.js";

export async function checkAuthentication(url: string, validToken: string) {
    const sendRequest = async (token?: string) => {
        const response = await zapFetch(url, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        await response.arrayBuffer();

        return response;
    };

    try {
        const validResponse = await sendRequest(validToken);

        if (validResponse.status !== 200) {
            return {
                result: "INCONCLUSIVE",
                message: `Valid token returned ${validResponse.status}. Expected 200.`
            };
        }

        const noTokenResponse = await sendRequest();
        const invalidTokenResponse = await sendRequest("invalid-token");

        const message =
            `No token returned ${noTokenResponse.status}. ` +
            `Invalid token returned ${invalidTokenResponse.status}.`;

        if (noTokenResponse.ok || invalidTokenResponse.ok) {
            return {
                result: "FAIL",
                message
            };
        }

        if (noTokenResponse.status === 401 && invalidTokenResponse.status === 401) {
            return {
                result: "PASS",
                message
            };
        }

        return {
            result: "INCONCLUSIVE",
            message
        };
    } catch {
        return {
            result: "INCONCLUSIVE",
            message: "Request through ZAP failed or timed out"
        };
    }
}