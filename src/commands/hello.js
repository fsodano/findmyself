function* hello(originalMessage) {
  yield {
    responseText: `Hi <@${originalMessage.user}> :wave:! Thanks for using PairUpBot :robot_face:.
  If you tell me \`pair me up\`, I will find someone to pair you up with :handshake:!
  If you prefer to pair up with someone from your a specific country, try \`pair me up\` :flag-sd: and I'll try to find someone who fits the description!`,
  };
}

module.exports = hello;
