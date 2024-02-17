import { prisma } from "../database/db-provider";
import { transferAmount } from "../interfaces/account-interface";
import { ErrorMessages } from "../utils/constants";

function transfer(from: number, to: number, amount: number): Promise<transferAmount> {
  return prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.account.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        user_id: from,
      },
    });

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(ErrorMessages.insufficientBalance);
    }

    // 3. Increment the recipient's balance by amount
    const recipient = await tx.account.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        user_id: to,
      },
    });

    return { recipient, sender };
  });
}

export { transfer };
