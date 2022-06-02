const once = true;
const name = 'guildMemberAdd';

async function invoke(interaction) {
  const GENERAL_CHAT_ID = '595459557518737410';
  let generalChannel = interaction.member.guild.channels.cache.get(GENERAL_CHAT_ID);
  generalChannel.send('Welcome ' + interaction.member.user + ' to the server');
}