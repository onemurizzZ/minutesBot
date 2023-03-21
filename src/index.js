//dotenvの適用
import * as dotenv from 'dotenv';
dotenv.config();

import { Octokit, App } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

import { Client, EmbedBuilder, GatewayIntentBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import addItem from '../notion/addItem.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

//起動確認
client.once('ready', () => {
  console.log(`${client.user.tag} Ready`);
});

//返答
client.on('messageCreate', message => {
  if (message.author.bot) {
    return;
  }

  if (message.content == 'hi') {
    message.channel.send('hi!');
  }
});

const commands = {
  // /**
  //  * 
  //  * @param {Discord.CommandInteraction} interaction 
  //  * @returns 
  //  */
  // async ping(interaction) {
  //   const now = Date.now();
  //   const msg = [
  //     "pong!",
  //     "",
  //     `gateway: ${interaction.client.ws.ping}ms`,
  //   ];
  //   await interaction.reply({ content: msg.join("\n"), ephemeral: true });
  //   await interaction.editReply([...msg, `往復: ${Date.now() - now}ms`].join("\n"));
  //   return;
  // },
  // /**
  //  * 
  //  * @param {Discord.CommandInteraction} interaction 
  //  * @returns 
  //  */
  // async hello(interaction) {
  //   const source = {
  //     en(name){
  //       return `Hello, ${name}!`
  //     },
  //     ja(name){
  //       return `こんにちは、${name}さん。`
  //     }
  //   };
  //   const name = interaction.member?.displayName ?? interaction.user.username;
  //   const lang = interaction.options.get("language");
  //   return interaction.reply(source[lang.value](name));
  // },
  /**
   * 
   * @param {Discord.CommandInteraction} interaction 
   * @returns {string} url
   */
  async minutes(interaction) {
    const now = new Date()
    now.setTime(now.getTime() + 1000 * 60 * 60 * 9)
    let format = 'YYYY/MM/DD hh:mm'
    format = format.replace(/YYYY/g, now.getFullYear());
    format = format.replace(/MM/g, ('0' + (now.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + now.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + now.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + now.getMinutes()).slice(-2));
    const title = interaction.options.get("title");
    if (!title) {
      const response = await addItem(format);

      const embed = new EmbedBuilder()
        .setTitle(`😼${format}`)
        .setDescription(`\n\n議事録に使ってね☝️`)
        .setURL(response.url)
        .setColor("#ff4500")
        .setTimestamp()

      return interaction.reply({ embeds: [embed] });
    } else {
      const response = await addItem(title.value);

      const embed = new EmbedBuilder()
        .setTitle(`😼${title.value}`)
        .setDescription(`\n\n議事録に使ってね☝️`)
        .setURL(response.url)
        .setColor("#ff4500")
        .setTimestamp()

      return interaction.reply({ embeds: [embed] });
    }
  },

  /**
   * 
   * @param {Discord.CommandInteraction} interaction 
   * @returns {void} 
   */
  async issue(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('makeIssue')
      .setTitle('issueの作成');

    const ageInput = new TextInputBuilder()
      .setCustomId('titleInput')
      .setLabel("タイトル")
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('descriptionInput')
      .setLabel("本文")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(ageInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
};


async function onInteraction(interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  return commands[interaction.commandName](interaction);
};

client.on("interactionCreate", interaction => onInteraction(interaction).catch(err => console.error(err)));

//Discordへの接続
client.login(process.env.TOKEN);