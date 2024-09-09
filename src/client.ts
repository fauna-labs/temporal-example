import { Connection, WorkflowClient } from '@temporalio/client';
import { spendingWorkflow } from './workflows/spendingWorkflow';
import { spendingByCategoryWorkflow } from './workflows/spendingByCategoryWorkflow'; // Import spendingByCategoryWorkflow

export type TransactionType = {
  id: number;
  description: string;
  amount: number;
}

async function runSpendingWorkflow() {
  // Step 1: Establish a connection to the Temporal server
  const connection = await Connection.connect({
    address: 'localhost:7233', // Temporal server address
  });

  // Step 2: Create a Workflow Client
  const client = new WorkflowClient({
    connection,
  });

  // Step 3: Define some transactions (example data)
  const transactions: TransactionType[] = [
    { id: 111, description: 'Groceries', amount: 50 },
    { id: 222, description: 'Restaurant', amount: 30 },
    { id: 333, description: 'Transport', amount: 20 },
  ];

  const userId = '408073692904423501';

  // Step 4: Start the spendingWorkflow
  const handle = await client.start(spendingWorkflow, {
    args: [transactions, userId], // Pass the transactions array to the workflow
    taskQueue: 'spending-tracker-task-queue', // Ensure it matches the task queue in the worker
    workflowId: 'spending-workflow-001', // Optional unique ID for the workflow
  });

  console.log(`Started spendingWorkflow with ID: ${handle.workflowId}`);

  // Step 5: Await workflow result (optional, you can also use signals/queries)
  const result = await handle.result();
  console.log(`spendingWorkflow result: ${result}`);
}

async function runSpendingByCategoryWorkflow() {
  // Step 1: Establish a connection to the Temporal server
  const connection = await Connection.connect({
    address: 'localhost:7233', // Temporal server address
  });

  // Step 2: Create a Workflow Client
  const client = new WorkflowClient({
    connection,
  });

  // Step 3: Start the spendingByCategoryWorkflow
  const handle = await client.start(spendingByCategoryWorkflow, {
    args: ['408073692904423501'], // Pass the accountId to the workflow
    taskQueue: 'spending-tracker-task-queue', // Ensure it matches the task queue in the worker
    workflowId: 'spending-category-workflow-001', // Optional unique ID for the workflow
  });

  console.log(`Started spendingByCategoryWorkflow with ID: ${handle.workflowId}`);

  // Step 4: Await workflow result (optional, you can also use signals/queries)
  const result = await handle.result();
  console.log(`spendingByCategoryWorkflow result: ${result}`);
}

// Uncomment the following lines to run the Spending workflow
// runSpendingWorkflow().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

runSpendingByCategoryWorkflow().catch((err) => {
  console.error(err);
  process.exit(1);
});
