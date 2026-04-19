import cluster from "node:cluster";
import os from "node:os";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary Load Balancer ${process.pid} is running.`);
  console.log(`Forking server across ${numCPUs} CPU cores to handle high load...`);

  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Auto-heal if a worker crashes
  cluster.on("exit", (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} died. Spinning up a new worker to maintain capacity...`);
    cluster.fork();
  });
} else {
  // Workers run the main express server
  try {
    await import("./server.js");
  } catch (err) {
    console.error(`Failed to start worker ${process.pid}:`, err);
    process.exit(1);
  }
}
