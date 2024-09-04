import { Worker } from '@temporalio/worker';
import * as activities from '../activities/spendingActivities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('../workflows/spendingWorkflow'),
    activities,
    taskQueue: 'spending-tracker-task-queue',
  });
  await worker.run();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
