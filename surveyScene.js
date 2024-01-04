const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const { Scenes } = require("telegraf")
const fetch = require("node-fetch")
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');


module.exports = new Scenes.WizardScene("surveyScene", 
    async ctx => {
        ctx.scene.session.state = { age: 0, lvlOfIncome: "", workSphere: "", withExp: "", timeForInvestment: "", startSummForInvestment: "", firstName: "", lastName: "", phoneNumber: "" }
        await ctx.reply("Здравствуйте! Меня зовут Ольга, я ваш персональный менеджер по программе «Лента Вакансий»")
        await ctx.reply("Поздравляю! Теперь для Вас открыта возможность зарабатывать на акциях российских и зарубежных компаний и получать от 87 000Р уже с первых недель!\nПожалуйста, ответьте на следующие вопросы, чтобы я смогла оказать вам помощь и приступить к работе:")
        await ctx.reply("Являетесь ли вы гражданином РФ?", {reply_markup: {inline_keyboard: [[{text: "Да", callback_data: "russianCitizen"}, {text: "Нет", callback_data: "notRussianCitizen"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["russianCitizen", "notRussianCitizen"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        if(ctx.callbackQuery.data == "notRussianCitizen") {
            ctx.reply("Спасибо за желание участвовать в программе «Газпром Инвестиции», однако участие в ней могут принимать только граждане РФ, достигшие 25 лет. Хорошего дня!")
            return ctx.scene.leave()
        }
        ctx.reply("Сколько вам лет?", {reply_markup: {inline_keyboard: [[{text: "до 18", callback_data: "до 18"}, {text: "18-24", callback_data: "18-24"}], [{text: "25-40", callback_data: "25-40"}, {text: "40+", callback_data: "40+"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["до 18", "18-24", "25-40", "40+"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        if(["до 18", "18-24"].includes(ctx.callbackQuery.data)) {
            ctx.reply("Спасибо за желание участвовать в программе «Газпром Инвестиции», однако участие в ней могут принимать только граждане РФ, достигшие 25 лет. Хорошего дня!")
            return ctx.scene.leave()
        }
        ctx.scene.session.state.age = ctx.callbackQuery.data
        ctx.reply("Какой уровень дохода в месяц Вас бы устроил?", {reply_markup: {inline_keyboard: [[{text: "5 000 - 10 000 рублей", callback_data: "5000-10000"}], [{text: "10 000 - 25 000 рублей", callback_data: "10000-25000"}], [{text: "25 000 - 50 000 рублей", callback_data: "25000-50000"}], [{text: "50 000 - 100 000 рублей", callback_data: "50000-100000"}], [{text: "100 000 рублей +", callback_data: "100000+"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["5000-10000", "10000-25000", "25000-50000", "50000-100000", "100000+"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.lvlOfIncome = ctx.callbackQuery.data
        ctx.reply("Какая у вас сфера занятости?", {reply_markup: {inline_keyboard: [[{text: "Работаю на кого-то", callback_data: "Работаю на кого-то"}], [{text: "Работаю на себя", callback_data: "Работаю на себя"}], [{text: "Временно безработный", callback_data: "Временно безработный"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["Работаю на кого-то", "Работаю на себя", "Временно безработный"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.workSphere = ctx.callbackQuery.data
        ctx.reply("Имели ли вы опыт в инвестировнии?", {reply_markup: {inline_keyboard: [[{text: "Да", callback_data: "withExp"}, {text: "Нет", callback_data: "withoutExp"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["withExp", "withoutExp"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.withExp = ctx.callbackQuery.data == "withExp"
        ctx.reply("Сколько времени в день вы готовы уделять подработке в нашей компании?", {reply_markup: {inline_keyboard: [[{text: "30 минут", callback_data: "30 минут"}], [{text: "1 - 3 часа", callback_data: "1 - 3 часа"}], [{text: "6 часов", callback_data: "6 часов"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["30 минут", "1 - 3 часа", "6 часов"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.timeForInvestment = ctx.callbackQuery.data
        ctx.reply("С какой суммы Вы готовы начать инвестировать?", {reply_markup: {inline_keyboard: [[{text: "Не готов(а), нужно больше информации", callback_data: "0"}], [{text: "3 000 - 5 000 рублей", callback_data: "3000-5000"}], [{text: "5 000 - 10 000 рублей", callback_data: "5000-10000"}], [{text: "10 000 - 15 000 рублей", callback_data: "10000-15000"}], [{text: "15 000 рублей +", callback_data: "15000+"}]]}})
        return ctx.wizard.next()
    },
    async ctx => {
        if(!["0", "3000-5000", "5000-10000", "10000-15000", "15000+"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.startSummForInvestment = ctx.callbackQuery.data
        await ctx.reply("Спасибо за уделенное время и пройденный опрос! Теперь вам открыт доступ к персональной платформе проекта Газпром Инвестиции. Пожалуйста, оставьте свои контактные данные для регистрации в проекте. Ваш личный менеджер получит данные и свяжется с вами в течение 1 рабочего дня")
        await ctx.reply("Как вас зовут (имя)?")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста имя текстом")
        ctx.scene.session.state.firstName = ctx.message.text
        ctx.reply("Отлично, теперь введите пожалуйста фамилию")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста фамилию текстом")
        ctx.scene.session.state.lastName = ctx.message.text
        ctx.reply("Теперь пожалуйста отправьте номер телефона\nПример: +78005555535")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста номер телефона текстом")
        if(!validatePhoneNumber(ctx.message.text)) return ctx.reply("Пожалуйста введите номер телефона в правильном формате (+78005555535)")
        ctx.scene.session.state.phoneNumber = ctx.message.text
        ctx.replyWithPhoto("AgACAgIAAxkBAAMGZZbrAcvnUiXnmHqlmoqgdBpgwWcAAjbXMRszM7hIo0Ohf0RzeSgBAAMCAAN5AAM0BA", {caption: "Спасибо за уделенное время и пройденный опрос! Теперь вам открыт доступ к персональной платформе проекта Лента Вакансий. Пожалуйста, оставьте свои контактные данные для регистрации в проекте. Ваш личный менеджер получит данные и свяжется с вами в течение 1 рабочего дня"})
        console.log(ctx.scene.session.state)
        const { age, lvlOfIncome, workSphere, withExp, timeForInvestment, startSummForInvestment, firstName, lastName, phoneNumber } = ctx.scene.session.state
        saveToCRM(phoneNumber, firstName, lastName, generateRandomEmail(), age, lvlOfIncome, workSphere, withExp ? "Есть" : "Нет", timeForInvestment, startSummForInvestment)
        return ctx.scene.leave()
    }
)

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(phoneNumber);
}

async function saveToCRM(phoneNumber, firstName, lastName, email, age, lvlOfIncome, workSphere, withExp, timeForInvestment, startSummForInvestment) {
    var res = await fetch(new URL(`http://doza-traffic.com/api/wm/push.json?id=${process.env.apiToken}&offer=1&flow=214&site=272&phone=${phoneNumber}&name=${firstName}&last=${lastName}&email=${email}&comment=Возраст:${age}\nДоход, который устроит: ${lvlOfIncome}\nСфера работы: ${workSphere}\nОпыт в интвестировании: ${withExp}\nВремя, которое готов уделять в день: ${timeForInvestment}\nНачальная сумма: ${startSummForInvestment}`))
    console.log(await res.json());
}

function generateRandomEmail() {
    const randomName = faker.internet.userName();
    const randomDomain = faker.internet.domainName();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${randomName}_${randomHash}@${randomDomain}`;
}