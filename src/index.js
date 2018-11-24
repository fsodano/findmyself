const bodyParser = require('body-parser');
const express = require('express');
const SlackBot = require('slackbots');
const Commands = require('./commands.js');
const helloCommand = require('./commands/hello.js');
const pairCommand = require('./commands/pair.js');

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

const token = process.env.TOKEN;
const bot = new SlackBot({
  token: token,
  name: 'pair_me_up',
});

bot.oauth_token = token;

const USER_ID = 'UDHRCR7RT';

app.get('/', (req, res) => res.send('Pair me up is up'));
app.post('/', (req, res) => {
  res.send(req.body.challenge);
});

function getCommands() {
  const helloRegex = /^(hello|hey|hi|howdy|g'?day|how'?s it going|yo|sup).*/i;
  const pairRegex = /^pair me up$| with (:flag-[a-z]+:)$/i;
  return [
    {
      accepts: content => content.match(helloRegex),
      execute: helloCommand,
    },
    {
      accepts: content => content.match(pairRegex),
      execute: pairCommand,
    }
  ];
}

bot.on('message', (message) => {
  try {
    const commands = new Commands(bot, getCommands());
    let isDm = false;
    let isMention = false;

    if (message.text) {
      isMention = message.text.indexOf(`<@${USER_ID}>`) > -1;
    }

    if (message.channel) {
      isDm = message.channel.indexOf('D') === 0;
    }

    let shouldRespond = message.type === 'message';
    shouldRespond = shouldRespond && message.username !== 'pair_me_up';
    shouldRespond = shouldRespond && (isDm || isMention);
    if (shouldRespond) {
      console.log(message); // eslint-disable-line no-console
      commands.executeCommandFromMessage(message);
    }
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
});

app.listen(port, () => console.log(`PairMeUp listening on port ${port}!`)); // eslint-disable-line no-console
