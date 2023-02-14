//dotenvの適用
import dotenv from 'dotenv'
// require('dotenv').config();
//.envからTOKENの呼び出し
const {TOKEN} = process.env;

// const { Client, GatewayIntentBits } = require('discord.js');
// const { default: addItem } = require('../notion/addItem');
import { Client, GatewayIntentBits } from 'discord.js';
import addItem from '../notion-example/addItem.js';

addItem('test')

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
    }
  };
  
  
async function onInteraction(interaction) {
    if (!interaction.isCommand()) {
      return;
    }
    return commands[interaction.commandName](interaction);
  }

client.on("interactionCreate", interaction => onInteraction(interaction).catch(err => console.error(err)));


//Discordへの接続
client.login(TOKEN);