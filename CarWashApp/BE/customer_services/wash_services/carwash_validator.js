export function validateWashBooking(Car_Plate, Wash_Date, Category_ID) {
  if (!Car_Plate || !Wash_Date || !Category_ID) {
    return {
      isValid: false,
      code: "INVALID_BOOKING",
      message: "Car, time, and category are required",
    };
  }

  return { isValid: true };
}

export function validateWashDate(Wash_Date) {
  const washDateTime = new Date(Wash_Date);
  if (Number.isNaN(washDateTime.getTime()) || washDateTime <= new Date()) {
    return {
      isValid: false,
      code: "INVALID_WASH_DATE",
      message: "Choose a future wash time.",
    };
  }
  return { isValid: true };
}
