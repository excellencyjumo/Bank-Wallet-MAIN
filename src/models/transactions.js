/*
// Get all transactions details on a specific account
/accounts/:account_id/transactions

// Initiate a file download on account transactions
/accounts/:account_id/transactions/download
*/

import client from "../config/db.js";

export async function getAllTransactions(user_email) {
  try {
    const query = `
          SELECT users.first_name, bills.bill_id, bills.bill_type, bills.source_account_number,
          bills.amount, bills.currency_code, bills.description, bills.bill_account_number, bills.bill_date,
          deposits.deposit_id, deposits.account_number, deposits.amount, deposits.currency_code, 
          deposits.description, deposits.deposit_date,
          transfers.transfer_id, transfers.account_number, transfers.third_party_acct_no, transfers.amount,
          transfers.description, transfers.transfer_date,
          withdrawals.withdrawal_id, withdrawals.account_number, 
          withdrawals.amount, withdrawals.currency_code, withdrawals.description, withdrawals.withdrawal_date
          FROM users
          LEFT JOIN bills ON users.user_email = bills.user_email
          LEFT JOIN deposits ON users.user_email = deposits.user_email
          LEFT JOIN transfers ON users.user_email = transfers.user_email
          LEFT JOIN withdrawals ON users.user_email = withdrawals.user_email
          WHERE users.user_email = $1
          LIMIT 1
        `;
    const values = [user_email];
    const result = await client.query(query, values);
    if (!result.rows[0]) {
      console.log("No transactions found");
      return false;
    }
    console.log(result.rows[0]);
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw err;
  }
}
