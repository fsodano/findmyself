const axios = require('axios');

async function* pair(originalMessage, matches, bot) {
  const flag = matches[1];
  const pairByCountry = Boolean(flag);
  const url = `https://slack.com/api/users.list?token=${bot.oauth_token}`;

  if (flag) {
    yield {responseText: `Sure thing! Finding someone from ${flag} to pair you up with...`};
  } else {
    yield {responseText: 'Sure thing! Finding someone to pair you up with...'};
  }

  const usersList = await axios.get(url);
  const members = usersList.data.members;

  const filteredMembers = members.filter((member) => {
    if (member.id === 'USLACKBOT') {
      return false;
    }

    if (member.is_bot) {
      return false;
    }

    if (originalMessage.user === member.id) {
      return false;
    }

    const sameCountry = member.profile.status_emoji.indexOf(flag) !== -1;
    if (pairByCountry && !sameCountry) {
      return false;
    }

    return true;
  });

  const randomIndex = Math.floor(Math.random() * filteredMembers.length);
  const randomMember = filteredMembers[randomIndex];

  if (!randomMember) {
    yield {responseText: 'We couldn\'t find anyone to pair you with :(, try a random pair up by typing `pair me up`'};
  }

  yield {responseText: `You've been paired up with <@${randomMember.id}>!`};

  const openUrl = `https://slack.com/api/conversations.open?token=${bot.oauth_token}&users=${originalMessage.user},${randomMember.id}`;
  const response = await axios.post(openUrl);

  bot.postMessage(
      response.data.channel.id,
      `Hi <@${originalMessage.user}> and <@${randomMember.id}>! You've been paired up together :handshake:!`,
  );
}

module.exports = pair;
