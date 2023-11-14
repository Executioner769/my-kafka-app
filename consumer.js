const { kafka } = require("./client");
const { log } = require("./logger");
log.setLevel("debug");

if (process.argv.length != 3) {
    console.log("Usage: node consumer.js <group>");
    process.exit(-1);
}

const group = process.argv[2].toLowerCase();

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  if(group === "admin") {
    await consumer.subscribe({ topics: ["group-messages", "user-messages", "bot-messages"], fromBeginning: true });
  } else {
    await consumer.subscribe({ topics: [`${group}-messages`], fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}

try {
    init();
} catch (error) {
    log.error(error);
}