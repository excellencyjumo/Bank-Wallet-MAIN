import { withdraw } from "../models/withdrawals.js";
import { getWithdrawal } from "../models/withdrawals.js";
import { getWithdrawalsOnAccount } from "../models/withdrawals.js";
import logger from "../config/logger.js";

// Withdraw cash from an account
export async function withdrawCash(req, res) {
  try {
    const user_email = req.user_email;
    const data = await withdraw(user_email, req.body);
    if (!data) {
      logger.error("Error Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    if (data === "Insufficient funds") {
      logger.error(
        "You do not have sufficient funds to complete this transaction"
      );
      return res.status(403).json({
        error: "You do not have sufficient funds to complete this transaction",
      });
    }
    logger.info("Withdrawal successful", data.resulting);
    return res.status(201).json({
      message: "Withdrawal successful",
      withdrawal_details: data.resulting,
      balance: data.now_balance,
    });
  } catch (error) {
    logger.error("Internal Server Error", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Get details of a specific withdrawal
export async function getAWithdrawal(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getWithdrawal(user_email, req.body);
    if (data === "Invalid Request") {
      logger.error("Error Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      logger.error("No withdrawal with specified id found");
      return res
        .status(404)
        .json({ error: " No withdrawal with specified id found" });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    logger.info("Withdrawal details", data);
    return res.status(201).json({
      message: "Withdrawal details",
      details: data,
    });
  } catch (error) {
    logger.error("Internal Server Error", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Get a list of withdrawals for a specific account
export async function getWithdrawalOnAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getWithdrawalsOnAccount(user_email, req.body);
    if (data === "Invalid Request") {
      logger.error("Error Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      logger.error("No withdrawals found");
      return res.status(404).json({ error: "No withdrawals found" });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    logger.info("Withdrawals(s)", data);
    return res.status(201).json({
      message: "Withdrawals(s)",
      details: data,
    });
  } catch (error) {
    logger.error("Internal Server Error", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
