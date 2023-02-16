//dotenvの適用
import dotenv from 'dotenv';

// コマンド設定部分
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.get(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });