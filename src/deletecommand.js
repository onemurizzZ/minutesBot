//dotenvの適用
import * as dotenv from 'dotenv';
dotenv.config();

// コマンド設定部分
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function main() {
    await rest.get(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        })
        .then(() => console.log("commands are deleted!"))
        .catch(console.error);
}

main().catch(err => console.log(err))