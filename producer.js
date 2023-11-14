const { kafka } = require("./client");
const readline = require("readline");

const { log } = require("./logger");
log.setLevel("debug");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  log.debug("Connecting Producer");
  await producer.connect();
  log.debug("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();


  // <category>:<message>

  rl.on("line", async function (line) {
    const [category, message] = line.split(":");

    switch (category.toLowerCase()) {
        case "group": {
            await producer.send({
                topic: "group-messages",
                messages: [
                    {
                        key: "group-message",
                        value: JSON.stringify({ message }),
                    },
                ],
            });
            break;
        }
        case "user": {
            await producer.send({
                topic: "user-messages",
                messages: [
                    {
                        key: "user-message",
                        value: JSON.stringify({ message }),
                    },
                ],
            });
            break;
        }
        case "bot": {
            // message => "severity-message"
            const [severity, msg] = message.split("-");
            await producer.send({
                topic: "bot-messages",
                messages: [
                    {
                        partition: severity.toLowerCase() === "high" ? 0 : 1,
                        key: "bot-message",
                        value: JSON.stringify({ message: msg, severity }),
                    },
                ],
            });
            break;
        }
    }

  }).on("close", async () => {
    await producer.disconnect();
  });
}

try {
    init();
} catch (error) {
    log.error(error);
}