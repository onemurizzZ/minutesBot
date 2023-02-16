//dotenvの適用
import dotenv from 'dotenv';

// コマンド設定部分
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

// const ping = new SlashCommandBuilder()
//     .setName('ping')
//     .setDescription('pong!')

//  //0.13.0以降
// const hello = new SlashCommandBuilder()
//     .setName('hello')
//     .setDescription('挨拶をします。')
//     .addStringOption(option =>
//         option
//             .setName('language')
//             .setDescription('言語を指定します。')
//             .setRequired(true) //trueで必須、falseで任意
//             .addChoices(
//                 {name:'Japanese', value:'ja'},
//                 {name:'English', value:'en'}
//             )
//     );


const minutes = new SlashCommandBuilder()
                .setName('minutes')
                .setDescription('議事録を作成します')
                .addStringOption(option =>
                    option
                    .setName('title')
                    .setDescription('タイトルを設定してください')
                    .setRequired(false)
                );
                
const commands = [minutes];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function main(){
    await rest.put(
            Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
            { body: commands }
        )
        .then(() => console.log('commands are registered!'))
        .catch(console.error);
}

main().catch(err => console.log(err))
