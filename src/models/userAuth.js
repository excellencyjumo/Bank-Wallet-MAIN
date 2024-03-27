import client from "../config/db.js";
import { hashPassword } from "../utils/hash.js";
import { passwordMatches } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { createProfileSchema } from "../validation/Schemas.js";
import { loginSchema } from "../validation/Schemas.js";
import { resetSchema } from "../validation/Schemas.js";
import { sendEmail } from "../utils/nodeMailer.js";
import { sendRegisterEmail } from "../utils/nodeMailer.js";

// Check if a user with the specified email exists in the database.
async function checkIfUserExists(email) {
  const query = `
  SELECT COUNT(*) as count
  FROM users
  WHERE user_email = $1
    `;
  const values = [email];
  const result = await client.query(query, values);
  return +result.rows[0].count;
}

// Create a user profile and store it in the database.
export async function createUserProfile(payload) {
  const { error, value } = createProfileSchema.validate(payload);
  if (error) {
    return "Invalid payload";
  }
  const { first_name, last_name, email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      return "User exists";
    }
    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (first_name, last_name, user_email, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [first_name, last_name, email, hashedPassword];
    const result = await client.query(query, values);
    const details = result.rows[0];
    const userData = {
      first_name: details.first_name,
      last_name: details.last_name,
      user_email: details.user_email,
    };
    const token = await generateToken(value);
    sendRegisterEmail(email);
    return { userData, token };
  } catch (error) {
    console.error(error.message);
    throw new Error("User registration failed");
  }
}

// Authenticate a user's login and generate an authentication token.
export async function userLogin(payload) {
  const { error, value } = loginSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      return "User doesn't exist";
    }
    const query = `
      SELECT password
      FROM users
      WHERE user_email = $1
    `;
    const values = [email];
    const result = await client.query(query, values);
    const dbPassword = result.rows[0] ? result.rows[0].password : null;
    if (!dbPassword) {
      return "Invalid Email/Password";
    }
    const isMatch = await passwordMatches(password, dbPassword);
    if (!isMatch) {
      return "Invalid Email/Password";
    }
    const token = await generateToken(value);
    return token;
  } catch (error) {
    throw error;
  }
}

// Send a reset password link to a user's email.
export const sendResetLink = async (payload) => {
  const { error, value } = resetSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { email } = value;

  const userExists = await checkIfUserExists(email);
  if (!userExists) {
    return "User doesn't exist";
  }

  try {
    const token = await generateToken(value);
    const response = sendEmail(email, token);
    return { response };
  } catch (error) {
    console.error(error);
    return "Email sending failed";
  }
};

// Reset a user's password in the database.
export async function reset(user_email, userPassword) {
  const { password, confirm_password } = userPassword;
  if (password !== confirm_password) {
    console.log("Passwords don't match");
    return "Passwords don't match";
  }
  const hashedPassword = await hashPassword(confirm_password);
  try {
    const query0 = `
      UPDATE users
      SET password = $1
      WHERE user_email = $2
      RETURNING *
    `;
    const values0 = [hashedPassword, user_email];
    const result = await client.query(query0, values0);
    if (result.rowCount === 0) {
      return "Unable to Update Database";
    }
    return result.rows;
  } catch (err) {
    console.error(err.message);
    throw new Error("Password reset failed");
  }
}
