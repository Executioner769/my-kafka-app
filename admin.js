const { kafka } = require("./client");

const { log } = require("./logger");
log.setLevel("debug");

async function init() {
  const admin = kafka.admin();
  log.debug("Admin connecting ...");
  admin.connect();
  log.debug("Admin Connection Success ...");

  log.debug("Creating Topics ...");
  await admin.createTopics({
    topics: [
      {
        topic: "group-messages",
        numPartitions: 2,
      },
      {
        topic: "user-messages",
        numPartitions: 2,
      },
      {
        topic: "bot-messages",
        numPartitions: 2,
      },
    ],
  });
  log.debug("Topics Created Success ...");

  log.debug("Disconnecting Admin ...");
  await admin.disconnect();
}

try {
    init();
} catch (error) {
    log.error(error);
}