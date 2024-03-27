import { checkIfAdminExists } from "./admin.js";
import client from "../config/db.js";
import { passwordMatches } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { generateAdminToken } from "../utils/jwt.js";
import { loginSchema } from "../validation/Schemas.js";
import { createAdminSchema } from "../validation/Schemas.js";
import { sendAdminRegisterTokenEmail } from "../utils/nodeMailer.js";

export async function superAdminLogin(payload) {
  const { error, value } = loginSchema.validate(payload);
  if (error) {
    console.log(error.details);
    return "Invalid Request";
  }
  const { email, password } = value;
  try {
    const adminExists = await checkIfAdminExists(email);
    if (!adminExists) {
      console.log("Admin doesn't exist");
      return "Admin doesn't exist";
    }
    const query = `
          SELECT admin_password
          FROM admin
          WHERE admin_email = $1
          `;
    const values = [email];
    const result = await client.query(query, values);
    const dbPassword = result.rows[0].admin_password;
    console.log(dbPassword);
    const isMatch = await passwordMatches(password, dbPassword);
    console.log("the hell");
    if (!isMatch) {
      console.log("passwords don't match");
      return false;
    }
    const token = await generateToken(value);
    console.log("Login Successful, user token generated");
    console.log(token);
    return token;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export async function sendAdminToken(super_admin_email, payload) {
  const { error, value } = createAdminSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { email } = value;
  try {
    const adminExists = await checkIfAdminExists(super_admin_email);
    if (!adminExists) {
      console.log("Admin does not exist");
      return "Admin does not exist";
    }
    const token = await generateAdminToken(value);
    await sendAdminRegisterTokenEmail(email, token);
    return "DONE";
  } catch (error) {
    throw error;
  }
}
