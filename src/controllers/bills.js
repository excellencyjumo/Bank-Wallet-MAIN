import { makeBillPayment } from "../models/bills.js";
import { getBillPayment } from "../models/bills.js";
import { getBillsOnAccount } from "../models/bills.js";
import logger from "../config/logger.js";

// Make a bill payment
export async function makeABillPayment(req, res) {
  try {
    const user_email = req.user_email;
    const data = await makeBillPayment(user_email, req.body);
    if (data === "Invalid Request") {
      logger.error("Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "We currently do not support this bill type at the moment") {
      logger.error("We currently do not support this bill type at the moment");
      return res.status(400).json({
        error: "We currently do not support this bill type at the moment",
      });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    if (data === "Insufficient funds") {
      logger.error("Insufficient funds");
      return res.status(403).json({
        error: "You do not have sufficient funds to complete this transaction",
      });
    }
    if (data === "Bill account doesn't exist") {
      logger.error("Bill account doesn't exist");
      return res.status(404).json({
        error: "Bill account doesn't exist",
      });
    }
    logger.info("Bill payment successful");
    return res.status(201).json({
      message: "Bill payment successful",
      bill_details: data,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Get details for a specific bill payment
export async function getABillPayment(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getBillPayment(user_email, req.body);
    if (data === "Invalid Request") {
      logger.error("Error Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      logger.error("No bill history with Id ");
      return res.status(404).json({
        error: "No bill history with Id ",
      });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    logger.info("Bill Payment", data);
    return res.status(201).json({
      message: "Bill Payment",
      bill_details: data,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Get bills associated with a user's account
export async function getBillsOnAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getBillsOnAccount(user_email, req.body);
    if (data === "Invalid Request") {
      logger.error("Error Invalid Request");
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "No Bills Associated with this account") {
      logger.error("No Bills Associated with this account");
      return res
        .status(404)
        .json({ error: "No Bills Associated with this account" });
    }
    if (data === "You are not allowed to carry out this action") {
      logger.error("You are not allowed to carry out this action");
      return res
        .status(401)
        .json({ error: "You are not allowed to carry out this action" });
    }
    logger.info("Bill payments", data);
    return res.status(201).json({
      message: "Bill payments",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
