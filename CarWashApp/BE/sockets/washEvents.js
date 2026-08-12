export function newWashEvent(io, wash) {
  console.log("Emitting NEW_WASH_BOOKED event for wash:", wash);
  io.to("washer").emit("NEW_WASH_BOOKED", wash);
  io.to("admin").emit("NEW_WASH_BOOKED", wash);
}
