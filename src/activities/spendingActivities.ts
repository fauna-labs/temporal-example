export async function calculateSpending(transactions: any[]): Promise<number> {
  return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
}

export async function saveTransaction(transactions: any[]): Promise<void> {
  for (const transaction of transactions) {
    // Save transaction to database
    console.log(`Saved transaction: ${transaction}`);
  }
}
