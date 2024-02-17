import { Request, Response } from "express";
import { transferFundsSchema } from "../validators/account-validator";
import { ErrorMessages } from "../utils/constants";
import { getAccountBalance, transferFunds } from "../models/account-model";

export const accountBalanceController = async (req: Request, res: Response) => {
  try {
    let { user } = req.body;
    const userAccount = await getAccountBalance(user?.id);
    return res.json({
      msg: "User account balance fetched successfully",
      data: { balance: userAccount?.balance ?? 0 },
    });
  } catch (e) {
    console.log("e: ", e);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

export const fundTransferController = async (req: Request, res: Response) => {
  try {
    const { to, fund, user } = req.body;
    const parsed = transferFundsSchema.safeParse({ fund, to });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ msg: "Invalid request", error: parsed.error });
    }

    const transferred = await transferFunds({from: user.id, to, fund});

    return res.json({
      msg: "Amount transferred successfully",
      data: { balance: transferred.sender.balance },
      status: true,
    });
  } catch (e) {
      console.log('e: ', e);
    if (e instanceof Error) {
      if (e.message == ErrorMessages.insufficientBalance) {
        return res.status(417).send({ msg: ErrorMessages.insufficientBalance });
      }
    }
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
