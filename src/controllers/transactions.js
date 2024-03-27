import { getAllTransactions } from "../models/transactions.js";
import logger from "../config/logger.js";
import { generatePDF } from "../utils/pdfMaker.js";

// Get transactions
export async function getAllTheTransactions(req, res) {
  try {
    const user_email = req.user_email;
    const transactions = await getAllTransactions(user_email);
    if (!transactions) {
      logger.error("No transactions carried out on this profile");
      return res
        .status(404)
        .json({ error: "No transactions carried out on this profile" });
    }
    logger.info("Transactions", transactions);
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=Transactions-history.pdf",
    });

    generatePDF(
      JSON.stringify(transactions, "", "\n"),
      (chunk) => stream.write(chunk),
      () => stream.end()
    );
    // return res.status(201).json({
    //   message: "Transactions",
    //   Details: transactions,
    // });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
