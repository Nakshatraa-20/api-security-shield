import "dotenv/config";

export async function zapRequest(path: string) {
    const zapUrl = process.env.ZAP_URL;
    const apiKey = process.env.ZAP_API_KEY;

    if (!zapUrl || !apiKey) {
        throw new Error("ZAP_URL or ZAP_API_KEY is missing");
    }

    const url = new URL(path, zapUrl);
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url, {
        proxy: false,
        redirect: "error",
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`ZAP returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.code) {
        throw new Error(`ZAP API error: ${data.code}`);
    }

    return data;
}

export function zapFetch(url: string, options: RequestInit = {}) {
    const zapUrl = process.env.ZAP_URL;

    if (!zapUrl) {
        throw new Error("ZAP_URL is missing");
    }

    return fetch(url, {
        ...options,
        proxy: {
            url: zapUrl,
            respectNoProxy: false
        },
        redirect: "manual",
        signal: AbortSignal.timeout(10000)
    });
}