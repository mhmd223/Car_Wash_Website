import { reject_still_pending_washes } from "../customer_services/wash_services/carwash_queries.js";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function rejectStillPendingWashes() {
  await reject_still_pending_washes();

  if (!global._intervalRejectPendingWashes) {
    console.log("Setting up interval to reject still pending washes every 24 hours.");
    global._intervalRejectPendingWashes = setInterval(
      reject_still_pending_washes,
      TWENTY_FOUR_HOURS,
    ); // runs every 24 hours
  }
}
