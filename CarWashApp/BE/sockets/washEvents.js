import { WASH_EVENTS } from "../../shared/events.js";

export function newWashEvent(io, wash) {
  console.log("Emitting NEW_WASH_BOOKED event for wash:", wash);
  io.to("washer").emit(WASH_EVENTS.NEW_WASH_BOOKED, wash);
  io.to("admin").emit(WASH_EVENTS.NEW_WASH_BOOKED, wash);
}

export function washStatusUpdatedEvent(io, custId, washId, status) {
  console.log(
    "Emitting WASH_STATUS_UPDATED event for washId:",
    washId,
    "with status:",
    status,
    "to customer:",
    custId,
  );

  console.log(
    io
      .in(`user:${custId}`)
      .fetchSockets()
      .then((sockets) => {
        console.log(
          `Sockets in room user:${custId}:`,
          sockets.map((s) => s.id),
        );
      }),
  );
  io.to(`user:${custId}`).emit(WASH_EVENTS.WASH_STATUS_UPDATED, {
    washId,
    status,
  });
  io.to("washer").emit(WASH_EVENTS.WASH_STATUS_UPDATED, { washId, status });
}
