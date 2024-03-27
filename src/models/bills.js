import client from "../config/db.js";
import { payBillSchema } from "../validation/Schemas.js";
import { getBillSchema } from "../validation/Schemas.js";
import { getBillsOnAccountSchema } from "../validation/Schemas.js";
import { currencyConverter } from "./layer.js";

// Retrieve the account balance of a user's account.
async function getAccountBalance(account_number) {
  const query = `
    SELECT account_balance 
    FROM account 
    WHERE account_number = $1`;
  const { rows } = await client.query(query, [account_number]);
  return rows[0].account_balance;
}

// Retrieve the account balance and currency code for a receiver's account.
async function getReceiverAccountBalance(account_number) {
  const query = `
      SELECT *
      FROM account 
      WHERE account_number = $1 `;
  const values = [account_number];
  const { rows } = await client.query(query, values);
  const balance = parseFloat(rows[0].account_balance);
  const currency = rows[0].currency_code;
  return { balance, currency };
}

// Update the account balance of a user's account.
async function updateAccountBalance(account_number, amount) {
  const query = `
    UPDATE account
    SET account_balance = $1
    WHERE account_number = $2
    RETURNING *
  `;
  const values = [amount, account_number];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Make a bill payment
export async function makeBillPayment(user_email, payload) {
  const { error, value } = payBillSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const {
    account_number,
    bill_type,
    bill_account_number,
    amount,
    currency_code,
    description,
  } = value;
  if (
    bill_type !== "airtime" &&
    bill_type !== "betting" &&
    bill_type !== "electricity"
  ) {
    return "We currently do not support this bill type at the moment";
  }
  try {
    const account_balance = await getAccountBalance(account_number);
    if (!account_balance) {
      console.log("You are not allowed to carry out this action");
      return "You are not allowed to carry out this action";
    }

    if (account_balance < amount) {
      console.log("Insufficient funds");
      return "Insufficient funds";
    }
    const new_balance_sender = account_balance - amount;

    const receiver = await getReceiverAccountBalance(bill_account_number);
    if (!receiver) {
      return "No account associated with provided account number";
    }
    const receiver_balance = receiver.balance;
    const bill_receiver_currency = receiver.currency;
    console.log(`reciever account correct, balance: ${receiver_balance}`);
    if (currency_code !== bill_receiver_currency) {
      const data = await currencyConverter(
        bill_receiver_currency,
        currency_code,
        amount
      );
      const converted_amount = data.result;
      const new_balance_receiver = receiver_balance + converted_amount;

      const result3 = await updateAccountBalance(
        account_number,
        new_balance_sender
      );
      console.log(result3);
      const result4 = await updateAccountBalance(
        bill_account_number,
        new_balance_receiver
      );
      console.log(result4);
    } else {
      const new_balance_receiver = receiver_balance + amount;

      const result3 = await updateAccountBalance(
        account_number,
        new_balance_sender
      );
      console.log(result3);
      const result4 = await updateAccountBalance(
        bill_account_number,
        new_balance_receiver
      );
      console.log(result4);
    }

    const query5 = `
    INSERT INTO bills (user_email, bill_type, description, source_account_number, currency_code, amount, bill_account_number )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `;
    const values5 = [
      user_email,
      bill_type,
      description,
      account_number,
      currency_code,
      amount,
      bill_account_number,
    ];
    const result5 = await client.query(query5, values5);
    console.log(result5.rows[0]);
    console.log("Bill payment successful");
    return result5.rows[0];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Make a bill payment and update account balances accordingly.
export async function getBillPayment(user_email, payload) {
  const { value, error } = getBillSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const { account_number, bill_id } = value;
  try {
    const query = `
    SELECT *
    FROM bills
    WHERE bill_id = $1 AND source_account_number = $2
  `;
    const values = [bill_id, account_number];
    const result = await client.query(query, values);
    console.log(result.rows);
    if (!result.rows[0]) {
      console.log("No bill found");
      return false;
    }
    if (result.rows[0].user_email !== user_email) {
      console.log("You are not allowed to carry out this action");
      return "You are not allowed to carry out this action";
    }

    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(err.message);
    throw err;
  }
}

// Retrieve bill details associated with a specific account.
export async function getBillsOnAccount(user_email, payload) {
  const { value, error } = getBillsOnAccountSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const { account_number } = value;
  try {
    const query = `
      SELECT *
      FROM bills
      WHERE source_account_number = $1 AND user_email = $2
    `;
    const values = [account_number, user_email];
    const result = await client.query(query, values);
    if (!result.rows[0]) {
      return "No Bills Associated with this account";
    }
    if (result.rows[0].user_email !== user_email) {
      console.log("You are not allowed to carry out this action");
      return "You are not allowed to carry out this action";
    }

    return result.rows;
  } catch (error) {
    console.error(err.message);
    throw err;
  }
}
