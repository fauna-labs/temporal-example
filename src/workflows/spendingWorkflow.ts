import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/spendingActivities';

const { calculateSpending, saveTransaction, processTransaction } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// Workflow function
export async function spendingWorkflow(transactions: any[], userId: string) {
  const totalSpending = await calculateSpending(transactions);
  const canSpend = await processTransaction(totalSpending, userId);
  if (!canSpend) {
    return { totalSpending, message: 'Insufficient funds' };
  }
  await saveTransaction(transactions, userId);
  return totalSpending;
}
