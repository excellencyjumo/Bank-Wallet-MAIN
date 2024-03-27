import client from "../config/db.js";
import { depositSchema } from "../validation/Schemas.js";
import { getDepositSchema } from "../validation/Schemas.js";
import { getDepositsOnAccountSchema } from "../validation/Schemas.js";
import { currencyConverter } from "./layer.js";

// Deposit funds into a user's account, updating balance and recording the transaction.
export async function depositToAccount(user_email, payload) {
  const { error, value } = depositSchema.validate(payload);
  if (error) {
    console.error(error);
    return false;
  }
  const { account_number, amount, deposit_currency, description } = value;

  try {
    const query = `
    SELECT *
    FROM account
    WHERE account_number = $1 AND user_email = $2
  `;
    const values = [account_number, user_email];
    const result = await client.query(query, values);
    console.log(result.rows[0]);
    const account_currency = result.rows[0].currency_code;
    const account_balance = parseFloat(result.rows[0].account_balance);

    if (!result.rows[0]) {
      return "You are not allowed to carry out this action";
    }
    if (account_currency !== deposit_currency) {
      // Currency Conversion
      const data = await currencyConverter(
        account_currency,
        deposit_currency,
        amount
      );
      console.log(data);
      const converted_balance = data.result;
      const new_balance = account_balance + converted_balance;
      const new_balance_db = new_balance.toFixed(2);

      const query2 = `
    UPDATE account
    SET account_balance = $1
    WHERE account_number = $2 AND currency_code = $3
    RETURNING *
    `;
      const values2 = [new_balance_db, account_number, account_currency];
      const result2 = await client.query(query2, values2);
      console.log(result2.rows[0]);
      const now_balance = result2.rows[0].account_balance;

      const query3 = `
    INSERT INTO deposits (user_email, description, account_number, amount, currency_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
      const values3 = [
        user_email,
        description,
        account_number,
        amount,
        account_currency,
      ];
      const result3 = await client.query(query3, values3);
      const resulting = result3.rows[0];
      console.log(resulting);
      return { resulting, now_balance };
    } else {
      const new_balance = account_balance + amount;
      const new_balance_db = new_balance.toFixed(2);

      const query2 = `
    UPDATE account
    SET account_balance = $1
    WHERE account_number = $2 AND currency_code = $3
    RETURNING *
    `;
      const values2 = [new_balance_db, account_number, account_currency];
      const result2 = await client.query(query2, values2);
      console.log(result2.rows[0]);
      const now_balance = result2.rows[0].account_balance;

      const query3 = `
    INSERT INTO deposits (user_email, description, account_number, amount, currency_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
      const values3 = [
        user_email,
        description,
        account_number,
        amount,
        deposit_currency,
      ];
      const result3 = await client.query(query3, values3);
      const resulting = result3.rows[0];
      console.log(resulting);
      return { resulting, now_balance };
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Retrieve the details of a specific deposit.
export async function getDeposit(user_email, payload) {
  const { value, error } = getDepositSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const { account_number, deposit_id } = value;
  try {
    const query = `
      SELECT *
      FROM deposits
      WHERE deposit_id = $1 AND account_number = $2 
    `;
    const values = [deposit_id, account_number];
    const result = await client.query(query, values);
    if (!result.rows[0]) {
      console.log("No deposit found");
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

// Retrieve details of deposits associated with a specific account.
export async function getDepositsOnAccount(user_email, payload) {
  const { value, error } = getDepositsOnAccountSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const { account_number } = value;
  try {
    const query = `
      SELECT *
      FROM deposits
      WHERE account_number = $1
    `;
    const values = [account_number];
    const result = await client.query(query, values);
    if (!result.rows[0]) {
      return false;
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
