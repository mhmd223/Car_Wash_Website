import test from "node:test";
import assert from "node:assert/strict";
import { scheduleSchema } from "../CarWashApp/BE/admin_services/schedule_services/schedule_validation.js";

test("accepts a valid weekly schedule and defaults missing notes", () => {
  const result = scheduleSchema.safeParse([
    { Day: "Monday", OpenTime: "08:00", CloseTime: "18:00" },
  ]);

  assert.equal(result.success, true);
  assert.equal(result.data[0].Notes, "");
});

test("rejects invalid schedule times", () => {
  const result = scheduleSchema.safeParse([
    { Day: "Monday", OpenTime: "25:00", CloseTime: "18:00", Notes: "" },
  ]);

  assert.equal(result.success, false);
});

test("rejects empty and oversized schedules", () => {
  assert.equal(scheduleSchema.safeParse([]).success, false);

  const oversizedSchedule = Array.from({ length: 32 }, (_, index) => ({
    Day: `Day ${index}`,
    OpenTime: "08:00",
    CloseTime: "18:00",
    Notes: "",
  }));

  assert.equal(scheduleSchema.safeParse(oversizedSchedule).success, false);
});
