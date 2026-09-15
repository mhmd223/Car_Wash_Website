// Startup entry point for scheduled maintenance jobs.
import { rejectStillPendingWashes } from "./washJobs.js";

export async function initializeJobs() {
  await rejectStillPendingWashes();
}
