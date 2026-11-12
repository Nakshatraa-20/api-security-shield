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

export async function waitForPassiveScan() {
    const deadline = Date.now() + 30000;

    while (Date.now() < deadline) {
        const queue = await zapRequest("/JSON/pscan/view/recordsToScan/");
        const pending = Number(queue.recordsToScan);

        if (!Number.isInteger(pending) || pending < 0) {
            throw new Error("Unexpected ZAP queue response");
        }

        if (pending === 0) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    throw new Error("ZAP passive scan did not finish within 30 seconds");
}

export async function getZapAlerts(targetUrl: string) {
    const alerts = [];
    let start = 0;

    while (true) {
        const params = new URLSearchParams({
            baseurl: targetUrl,
            start: String(start),
            count: "100"
        });

        const data = await zapRequest(
            `/JSON/alert/view/alerts/?${params}`
        );

        if (!Array.isArray(data.alerts)) {
            throw new Error("Unexpected ZAP alerts response");
        }

        alerts.push(...data.alerts);

        if (data.alerts.length < 100) {
            return alerts;
        }

        start += 100;
    }
}

