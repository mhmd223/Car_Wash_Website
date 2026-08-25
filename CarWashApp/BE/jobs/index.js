import { rejectStillPendingWashes } from "./washJobs.js";

export async function initializeJobs() {
  await rejectStillPendingWashes();
}
