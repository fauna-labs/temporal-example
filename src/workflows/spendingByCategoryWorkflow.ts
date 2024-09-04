import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/spendingActivities';

const { getTransactionsForLast7Days, calculateSpendingByCategory } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function spendingByCategoryWorkflow() {
  // Step 1: Retrieve transactions for the last 7 days
  const transactions = await getTransactionsForLast7Days();

  // Step 2: Calculate total spending by category
  const spendingByCategory = await calculateSpendingByCategory(transactions);

  return spendingByCategory;
}
