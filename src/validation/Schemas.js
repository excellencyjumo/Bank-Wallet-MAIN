import Joi from "joi";

export const createProfileSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const createAdminSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const resetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const payBillSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  bill_type: Joi.string().required(),
  bill_account_number: Joi.number().integer().min(0).max(9999999999).required(),
  amount: Joi.number().positive().precision(2).required(),
  currency_code: Joi.string().required(),
  description: Joi.string().required(),
});

export const getBillSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  bill_id: Joi.string().required(),
});

export const getBillsOnAccountSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
});

export const depositSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  amount: Joi.number().positive().precision(2).required(),
  deposit_currency: Joi.string().required(),
  description: Joi.string().required(),
});

export const getDepositSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  deposit_id: Joi.string().required(),
});

export const getDepositsOnAccountSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
});

export const transferSchema = Joi.object({
  user_account_number: Joi.number().integer().min(0).max(9999999999).required(),
  receiver_account_number: Joi.number()
    .integer()
    .min(0)
    .max(9999999999)
    .required(),
  amount: Joi.number().positive().precision(2).required(),
  currency_code: Joi.string().required(),
  description: Joi.string().required(),
});

export const getTransferSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  transfer_id: Joi.string().required(),
});

export const getTransfersOnAccountSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
});

export const withdrawSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  amount: Joi.number().positive().precision(2).required(),
  account_currency: Joi.string().required(),
  description: Joi.string().required(),
});

export const getWithdrawalSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  withdrawal_id: Joi.string().required(),
});

export const getWithdrawalsOnAccountSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
  currency_code: Joi.string().required(),
});

export const currencySchema = Joi.object({
  currency_code: Joi.string().required(),
});

export const accountSchema = Joi.object({
  account_number: Joi.number().integer().min(0).max(9999999999).required(),
});
