import { zapFetch } from "./integrations/zap.js";

try {
    const response = await zapFetch(
        "http://host.docker.internal:4002/product/get-product"
    );

    console.log("Status:", response.status);
    console.log(await response.text());
} catch (error) {
    console.error(
        error instanceof Error ? error.message : "Request failed"
    );
}

