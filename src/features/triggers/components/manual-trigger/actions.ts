"use server";

import { getSubscriptionToken , type Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";

export type ManulTriggerToken = Realtime.Token<
    typeof manualTriggerChannel,
    ["status"]
>;

export async function fetchManualTriggerRealTimeToken(): Promise<ManulTriggerToken>{
    const token = await getSubscriptionToken(inngest , {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });
    return token;
}