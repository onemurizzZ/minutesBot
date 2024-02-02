// envファイルのインポート
import * as dotenv from 'dotenv'
dotenv.config()

// discord関連
import { Octokit } from 'octokit';


// firebase関係
import {
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  deleteDoc,
  orderBy,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const firebaseFirestore = getFirestore(app);


import { Client, EmbedBuilder, GatewayIntentBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import addItem from '../notion/addItem.js';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

//起動確認
client.once('ready', () => {
  console.log(`${client.user.tag} Ready`);
});

//返答
client.on('messageCreate', async message => {
  if (message.author.bot) {
    return;
  }

  // メッセージがbotへのメンションかどうかを確認
  console.log(message.content);
  console.log(message.mentions.has(process.env.APPLICATION_ID));
  if (!message.mentions.has(process.env.APPLICATION_ID)) return;
  // messageのcotentからメンション部分を削除したものを取得
  const contentFromMessage = message.content.slice(22);
  const contentReply = contentFromMessage === "" 
    ? "# あんちゃん何て言ってるか分からんわ〜 もう少しハキハキしゃべったらどうだい？"
    : "# え？\n " + contentFromMessage + "\n# だって？ そんなん知るかボケ！"
  await message.reply({
    content: contentReply,
    ephemeral: true,
  });

});

const commands = {
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
        .setTitle(`😼 ${format}`)
        .setDescription(`<@!${interaction.user.id}>が議事録を作成しました`)
        .setURL(response.url)
        .setColor("#ff4500")
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
      return;
    } else {
      const response = await addItem(title.value);

      const embed = new EmbedBuilder()
        .setTitle(`😼 ${title.value}`)
        .setDescription(`<@!${interaction.user.id}>が議事録を作成しました`)
        .setURL(response.url)
        .setColor("#ff4500")
        .setTimestamp()
      await interaction.reply({ embeds: [embed] });
      return;
    }
  },

  /**
   * 
   * @param {Discord.CommandInteraction} interaction 
   * @returns {void} 
   */
  async issue(interaction) {

    // トークンが保存されているかを確認
    const docRef = doc(firebaseFirestore, "teams", interaction.guildId, "github", interaction.user.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists) {
      interaction.reply({
        content: "githubのトークンが保存されていません",
        ephemeral: true,
      });
      return;
    }
    const githubToken = docSnap.data()?.token;



    // githubの接続
    const octokit = new Octokit({
      auth: githubToken,
    });
    await octokit.rest.users.getAuthenticated();



    // モーダルウィンドウの準備
    const modal = new ModalBuilder()
      .setCustomId('makeIssue')
      .setTitle('issueの作成');

    const titleInput = new TextInputBuilder()
      .setCustomId('titleInput')
      .setLabel("タイトル")
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('descriptionInput')
      .setLabel("本文")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);


    // モーダルウィンドウで入力された値の送信
    interaction.awaitModalSubmit({ time: 60000 })
      .then(async interaction => {
        const title = interaction.fields.getTextInputValue('titleInput');
        const descritption = interaction.fields.getTextInputValue('descriptionInput');
        const { data: newIssue } = await octokit.rest.issues.create({
          owner: "UnyteDAO",
          repo: "Unyte-Discord",
          title: title,
          body: descritption,
        });
        const embed = new EmbedBuilder()
          .setColor("#40e0d0")
          .setTitle("**issueが作成されました**")
          .setDescription(`\u002A\u002A<${title}>\u002A\u002A\n${descritption}`)
          .setFields(
            { name: "**作成者**", value: `<@!${interaction.user.id}>`, inline: true },
            { name: "**リンク**", value: newIssue.html_url, inline: true },
          )
          .setTimestamp()
        await interaction.reply({ embeds: [embed] });
      })
      .catch(console.error);
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
