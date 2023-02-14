//dotenvの適用
require('dotenv').config();
//.envからTOKENの呼び出し
const {TOKEN} = process.env;

// コマンド設定部分
const { SlashCommandBuilder } = require("discord.js")
 
const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong!')

 //0.13.0以降
const hello = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('挨拶をします。')
    .addStringOption(option =>
        option
            .setName('language')
            .setDescription('言語を指定します。')
            .setRequired(true) //trueで必須、falseで任意
            .addChoices(
                {name:'Japanese', value:'ja'},
                {name:'English', value:'en'}
            )
    );
 
const commands = [ping, hello]

const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(TOKEN)
async function main(){
await rest.put(
        Routes.applicationCommands("1073913475895668796"),
        { body: commands }
    )
}

main().catch(err => console.log(err))