import logger from "../config/logger.js";
import { createUserProfile } from "../models/userAuth.js";
import { userLogin } from "../models/userAuth.js";
import { sendResetLink } from "../models/userAuth.js";
import { reset } from "../models/userAuth.js";

// Create a user profile
export async function createAUserProfile(req, res) {
  try {
    const data = await createUserProfile(req.body);
    if (data === "Invalid payload") {
      logger.error("Invalid payload");
      return res.status(400).json({ error: "Invalid Request" });
    } else if (data === "User exists") {
      logger.error("User exists");
      return res
        .status(409)
        .json({ error: "An account with this email exists already" });
    }
    const { userData, token } = data;
    logger.info("REGISTRATION SUCCESSFUL", userData);
    res.cookie("token", token);
    return res.status(201).json({
      message: "REGISTRATION SUCCESSFUL",
      Your_Details: userData,
      token: token,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Log in a user
export async function logUser(req, res) {
  try {
    const data = await userLogin(req.body);
    if (data === "Invalid Request") {
      logger.error("Invalid Request");
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "User doesn't exist" || data === "Invalid Email/Password") {
      logger.error("Invalid Email/Password");
      return res.status(401).json({ error: "Invalid Email/Password" });
    }

    logger.info("LOGIN SUCCESSFUL", data);
    res.cookie("token", data, { httpOnly: true });
    return res.status(201).json({
      message: "LOGIN SUCCESSFUL",
      token: data,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Send a password reset link
export async function sendAResetLink(req, res) {
  try {
    const { response } = await sendResetLink(req.body);
    if (response === "Invalid Request") {
      logger.error("Invalid Request");
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (response === "User doesn't exist") {
      logger.error("User doesn't exist");
      return res.status(404).json({ error: "User with email doesn't exist" });
    }

    logger.info("YOUR RESET LINK HAS BEEN SENT TO YOUR EMAIL");
    return res.status(201).json({
      message: "YOUR RESET LINK HAS BEEN SENT TO YOUR EMAIL",
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Reset the user's password
export async function resetPassword(req, res) {
  try {
    const { email } = await req.user;
    const data = await reset(email, req.body);
    if (data === "Passwords don't match") {
      logger.error("Passwords don't match");
      return res.status(400).json({ error: "Passwords don't match" });
    } else if (data === "Unable to Update Database") {
      logger.error("Unable to Update Database");
      return res.status(500).json({
        message: "Internal Server Error",
        error: "Unable to Update Database",
      });
    }
    logger.info("PASSWORD HAS BEEN UPDATED SUCCESSFULLY");
    return res.status(201).json({
      message: "PASSWORD HAS BEEN UPDATED SUCCESSFULLY",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
