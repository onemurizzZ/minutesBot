//dotenvの適用
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
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
    /**
     * 
     * @param {Discord.CommandInteraction} interaction 
     * @returns 
     */
    async ping(interaction) {
      const now = Date.now();
      const msg = [
        "pong!",
        "",
        `gateway: ${interaction.client.ws.ping}ms`,
      ];
      await interaction.reply({ content: msg.join("\n"), ephemeral: true });
      await interaction.editReply([...msg, `往復: ${Date.now() - now}ms`].join("\n"));
      return;
    },
    /**
     * 
     * @param {Discord.CommandInteraction} interaction 
     * @returns 
     */
    async hello(interaction) {
      const source = {
        en(name){
          return `Hello, ${name}!`
        },
        ja(name){
          return `こんにちは、${name}さん。`
        }
      };
      const name = interaction.member?.displayName ?? interaction.user.username;
      const lang = interaction.options.get("language");
      return interaction.reply(source[lang.value](name));
    },
    /**
     * 
     * @param {Discord.CommandInteraction} interaction 
     * @returns {string} url
     */
    async minutes(interaction) {
      const now = new Date
      let format = 'YYYY/MM/DD hh:mm'
      format = format.replace(/YYYY/g, now.getFullYear());
      format = format.replace(/MM/g, ('0' + (now.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + now.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + now.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + now.getMinutes()).slice(-2));
      const title = interaction.options.get("input");
      if (!title) {
        const response = await addItem(format);
        return interaction.reply(response.url);
      } else {
        const response = await addItem(title.value);
        return interaction.reply(response.url);
      }
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