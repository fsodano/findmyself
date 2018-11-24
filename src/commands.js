class Commands {
  constructor(bot, commands) {
    this.bot = bot;
    this.commands = commands;
    this.reply.bind(this);
  }

  executeCommandFromMessage(message) {
    try {
      this.executeMatchingCommandsFromMessage(message);
    } catch (e) {
      this.reply(message, 'Sorry, I can\'t do that yet');
    }
  }

  executeMatchingCommandsFromMessage(message) {
    let genValue;
    let atLeastOneCommandMatched = false;

    this.commands.forEach(async (command) => {
      const matches = command.accepts(message.text);
      if (matches) {
        atLeastOneCommandMatched = true;
        const gen = command.execute(message, matches, this.bot);
        genValue = (await gen.next()).value;
        while (genValue) {
          this.reply(message, genValue.responseText, genValue.options);
          genValue = (await gen.next()).value; // eslint-disable-line no-await-in-loop
        }
      }
    });

    if (!atLeastOneCommandMatched) {
      this.reply(message, 'Sorry, I can\'t do that yet');
    }
  }

  reply(originalMessage, responseText, options = {}) {
    this.bot.postMessage(
        originalMessage.channel,
        responseText,
        Object.assign({icon_emoji: ':handshake:'}, options),
    );
  }
}

module.exports = Commands;
