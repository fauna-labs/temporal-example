import {
  fql,
  AbortError,
  type DocumentT,
  type Page,
  ServiceError,
} from "fauna";
import { TransactionType } from "../client";
import { faunaClient } from "../database/fauna";

export async function calculateSpending(transactions: TransactionType[]): Promise<number> {
  return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
}

export async function processTransaction(spendAmount: number, accountId: string): Promise<boolean> {
  // Process transaction
  const { data } = await faunaClient.query(fql`
    let user = User.byId(${accountId}) {
      primaryAccount
    }
    if (user?.primaryAccount?.balance  < ${spendAmount}) {
      false
    } else {
      let account = user?.primaryAccount
      
      if (account == Null) {
        false
      } else {
        account!.update({
          balance: account!.balance + 1
        })
      }
    }
  `);

  if (data === false) {
    return false;
  }

  console.log(`Processed transaction: ${JSON.stringify(data)}`);
  return true;
}

export async function saveTransaction(transactions: any[], userId: string): Promise<void> {
  const { data } = await faunaClient.query(fql`
    let transactions = ${transactions}
    transactions.forEach(t => Transaction.create({
      description: t.description,
      amount: t.amount,
      date: Time.now(),
      account: Account.byId(${userId})
    }))  
  `); 
  console.log(`Saved transactions: ${JSON.stringify(data)}`);
}
