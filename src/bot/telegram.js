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

    let inlineKeyboard = {
            inline_keyboard: [
                [{ text: 'Посмотреть репозиторий', url: payload.repository.html_url }]]};

    let message = `📥 Новый пуш в ${payload.repository.full_name}\n` +
    `👤 Пушер: ${payload.pusher.name}\n`;
    
    for(let i = 0; i < commits.length; i++)
    {
        if(i >= 5) { return message += `\n\n... и еще ${commits.length - 5} коммитов.` }

        const msg = commits[i].message.split("\\n");
        console.log(msg);

        message += `\n\n~~~~~~~~${commits[i].timestamp.slice(0, 10)}~~~~~~~~~~~\n` +
            `~~~~~~~~~~~${commits[i].timestamp.slice(11, 16)}~~~~~~~~~~~~~\n` +
            `📌 [commit #${i+1}]` +
            `👤 Автор: ${commits[i].author.username}\n\n` +
            `📝 Название:\n<b>${msg[0]}</b>\n`

        if(msg.length >= 2) {
        message += `📃 Описание:\n<blockquote>${msg[1]}`
        for(let y = 2; y < msg.length; y++) {
            message += `\n${msg[y]}`
        }
        message += '</blockquote>'
        }

        inlineKeyboard.inline_keyboard.push([{ text: `Посмотреть коммит #${i+1}`, url: commits[i].url }]);
    }

    
    console.log(message);

    try {
        await bot.sendMessage(chatID, message, {parse_mode: "HTML", reply_markup: inlineKeyboard});
        console.log("[INFO/webhook] The message has been delivered.");
    } catch(error){
        console.log("[ERROR/webhook] The message was not delivered.", error.message);

    }
}

export async function sendPing(payload) {
    if (!bot) {
    console.error("[ERROR] Bot is not initialized.");
    return;
    }
    try {
        await bot.sendMessage(chatID, "📌 Подключён новый репозиторий.\n" +
            `${payload.repository.full_name}`, {reply_markup: { inline_keyboard: [[{ text: 'Посмотреть репозиторий', url: payload.repository.html_url }]] }});

        console.log("[INFO/ping] The message has been delivered.");
    } catch(error){

        console.log("[ERROR/ping] The message was not delivered.", error.message);
    }

}
