// Updated Bmi Bot 
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_API_TOKEN' with the token you got from the BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Function to calculate BMI
function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

// Function to generate advice based on BMI
function getAdvice(bmi) {
  if (bmi < 18.5) {
    return `Your BMI is ${bmi}, which is considered underweight. You might want to consult with a healthcare provider for a personalized plan. Here are some resources:
- [Underweight Health Risks](https://www.nhs.uk/live-well/healthy-weight/advice-for-underweight-adults/)
- [Healthy Eating](https://www.choosemyplate.gov/eathealthy/what-is-myplate)`;
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return `Your BMI is ${bmi}, which is considered normal. Keep maintaining your healthy lifestyle! Here are some tips:
- [Healthy Living](https://www.who.int/news-room/fact-sheets/detail/healthy-diet)
- [Physical Activity Guidelines](https://www.cdc.gov/physicalactivity/basics/adults/index.htm)`;
  } else if (bmi >= 25 && bmi < 29.9) {
    return `Your BMI is ${bmi}, which is considered overweight. It's a good idea to look into ways to achieve a healthier weight. Here are some resources:
- [Weight Loss Tips](https://www.cdc.gov/healthyweight/losing_weight/index.html)
- [Healthy Weight](https://www.nhs.uk/live-well/healthy-weight/)`;
  } else {
    return `Your BMI is ${bmi}, which is considered obese. It's important to take steps towards a healthier weight. Consult with a healthcare provider and check these resources:
- [Obesity Health Risks](https://www.who.int/health-topics/obesity)
- [Weight Management](https://www.nhlbi.nih.gov/health/educational/lose_wt/index.htm)`;
  }
}

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Inline keyboard options
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Calculate BMI', callback_data: 'calculate_bmi' }],
        [{ text: 'Help', callback_data: 'help' }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Welcome! Choose an option:', options);
});

// Handle callback queries from inline keyboard
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;

  if (callbackQuery.data === 'calculate_bmi') {
    bot.sendMessage(chatId, 'Send your weight in kg followed by your height in cm (e.g., 70 170).');
  } else if (callbackQuery.data === 'help') {
    bot.sendMessage(chatId, 'Send your weight in kg followed by your height in cm to calculate your BMI.');
  }

  // Acknowledge the callback
  bot.answerCallbackQuery(callbackQuery.id);
});

// Handle messages containing weight and height
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore messages that are callback queries
  if (msg.hasOwnProperty('data')) {
    return;
  }

  // Check if the message contains two numbers
  const match = text.match(/^(\d+(\.\d+)?)\s+(\d+(\.\d+)?)$/);
  if (match) {
    const weight = parseFloat(match[1]);
    const height = parseFloat(match[3]);
    const bmi = calculateBMI(weight, height);
    const advice = getAdvice(bmi);
    bot.sendMessage(chatId, advice, { parse_mode: 'Markdown' });
  } else if (text !== '/start') {
    bot.sendMessage(chatId, 'Please send your weight in kg followed by your height in cm (e.g., 70 170).');
  }
});
