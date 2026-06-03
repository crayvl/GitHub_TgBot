import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();


const token = process.env.BOT_TOKEN;
const chatID = process.env.CHAT_ID; // for test
let bot = null;

export async function startBot() {
    if (bot) {
        console.log('[Warning] Bot is already running.');
        return bot;
    }
    
    console.log('launching Telegram bot.');
    bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, async (msg) => {
    
    await bot.sendMessage(chatID, "Hi! I'll notify you about new commits.\n by ~crayvl");

});
}



export async function sendWebhook(payload) {
    if (!bot) {
        console.error("[ERROR] Bot is not initialized.");
        return;
    }
    const commits = payload.commits;

    let message = `📥 Новый пуш в ${payload.repository.full_name}\n \
                    👤 Пушер: ${payload.pusher.name}\n`;
    
    for(let i = 0; i < commits.length; i++)
    {
        const msg = commits[i].message.split("\n");
        console.log(msg);

        message += `\n~~~~~~~~${commits[i].timestamp.slice(10)}~~~~~~~~~~\n \
            ~~~~~~~~~~~~${commits[i].timestamp.slice(11, 16)}~~~~~~~~~~~~\n \
            📌 [commit #${i+1}] \
            👤 Автор: ${commits[i].author.username}\n\n \
            📝 Название:\n<b>${msg[0]}</b>\n`

        if(msg.length >= 2) {
        message += `📃 Описание:\n<blockquote>`
        for(let y = 1; y < msg.length; y++) {
            message += `${msg[y]}`
        }
        message += '</blockquote>'
        }
    }

    
    console.log(message);

    try {
        await bot.sendMessage(chatID, message, {parseMode: "HTML"});
        console.log("[INFO] The message has been delivered.");
    } catch(error){
        console.log("[ERROR] The message was not delivered.", error.message);

    }
            
}