const phone_regex = /(^(\+\d{3})?[\s]?(\d{3}[\s-]?){2}(\d{4}))/;
import bcrypt from "bcrypt";

export async function check_username(username) {
  return username.toString().length >= 8;
}

export async function check_phone(phone) {
  return phone.match(phone_regex);
}

export async function hash_password(password) {
  try {
    const hash_password = await bcrypt.hash(password, 5);
    return hash_password;
  } catch (err) {
    return err;
  }
}

export async function compare_hash(hashed, unhashed) {
  try {
    const result = await bcrypt.compare(unhashed, hashed);
    return result;
  } catch (err) {
    return err;
  }
}
