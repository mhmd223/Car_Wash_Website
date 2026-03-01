import dotenv from "dotenv";

dotenv.config({
  path: "../../../../.env",
});

const car_regex = /((\d{3})[\s]?(\d{2})[\s]?(\d{2,3}))/;
/***
 * checks if license plate number is in valid format
 * @param plate_num - car license plate number
 */
export function validatePlateFormat(plate_num) {
  return car_regex.test(plate_num);
}

/**
 * uses an API to fetch data on a car through it's license plate number
 * @param {*} plate_num
 * @returns data of the car
 */
export async function getCarData(plate_num) {
  const data = await fetch(
    `${process.env.CAR_DATA_API_URL}?resource_id=${process.env.CAR_DATA_API_RESOURCE}&q=${Car_Plate}`,
    { method: "GET" },
  );

  const car_data = await data.json();
  let car;
  if (data.success) {
    car = car_data.result.records.find((carToFind) => {
      return carToFind.mispar_rechev === plate_num;
    });

    return car;
  }

  return car;
}
