import { zapRequest } from "./integrations/zap.js";

try {
    const result = await zapRequest("/JSON/core/view/version/");
    console.log(result);
} catch (error) {
    console.error(
        error instanceof Error ? error.message : "Unable to contact ZAP"
    );
}