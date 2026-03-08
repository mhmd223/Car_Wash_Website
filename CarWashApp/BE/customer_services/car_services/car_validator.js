import dotenv from "dotenv";

dotenv.config({
  path: "../../../../.env",
});

const old_car_regex = /((\d{3})[\s-]?(\d{2})[\s-]?(\d{3}))/;

const new_car_regex = /((\d{2})[\s-]?(\d{3})[\s-]?(\d{2}))/;
/***
 * checks if license plate number is in valid format
 * @param plate_num - car license plate number
 */
export function validatePlateFormat(plate_num) {
  let res_old = old_car_regex.test(plate_num);
  let res_new = new_car_regex.test(plate_num);
  return res_old || res_new;
}

/**
 * uses an API to fetch data on a car through it's license plate number
 * @param {*} plate_num
 * @returns data of the car
 */
export async function getCarData(plate_num) {
  const data = await fetch(
    `${process.env.CAR_DATA_API_URL}?resource_id=${process.env.CAR_DATA_API_RESOURCE}&q=${plate_num}`,
    { method: "GET" },
  );
  const car_data = await data.json();
  let car;
  if (car_data.success) {
    car = car_data.result.records.find((carToFind) => {
      return carToFind.mispar_rechev == plate_num;
    });

    return car;
  }

  return car;
}
