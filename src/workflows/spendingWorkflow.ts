import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/spendingActivities';

const { calculateSpending, saveTransaction } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// Workflow function
export async function spendingWorkflow(transactions: any[]) {
  const totalSpending = await calculateSpending(transactions);
  await saveTransaction(transactions);
  return totalSpending;
}
