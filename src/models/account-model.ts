import { prisma } from "../database/db-provider";
import { transfer } from "../helpers/account-helper";
import { transferAmount, transferFundsProps } from "../interfaces/account-interface";

const getAccountBalance = async (id: number) => {
  try {
    const getBalance = await prisma.account.findUnique({
      where: { user_id: id },
    });
    return getBalance;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const transferFunds = async ({to, fund, from}: transferFundsProps) => {
  try {
    const response: transferAmount = await transfer(from, to, fund);
    return response;
  } catch (e) {
    console.log('e: ', e);
    throw new Error((e as Error).message);
  }
};

export { getAccountBalance, transferFunds };
