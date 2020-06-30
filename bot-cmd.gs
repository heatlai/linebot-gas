const BotCommand = function (bot) {
    const that = this;

    this.isCommand = function (event) {
        return this.isTextMessage() && event.message.text.startsWith('神奇海螺');
    }

    this.isTextMessage = function (event) {
        return event.type === 'message' && event.message.type === 'text';
    }

    this.runCommand = function (event) {
        for (let commandsKey in commands) {
            if( event.message.text.contains(commandsKey) ) {
                commands[commandsKey].do(event);
            }
        }
    }

    let commands = {
        "指令表": {
            public: true,
            description: "顯示可用指令",
            do(event) {
                let list = "可用指令：\n";
                for (let cmd in commands) {
                    list += `${cmd} : ${commands[cmd].description}\n`;
                }
                event.reply(list);
            }
        },
        "喝什麼": {
            public: true,
            description: "隨機挑選飲料店",
            do(event) {
                let sheet = GoogleSheet.getSheetByName('喝什麼');
                let name = sheet.getRange("A2:A" + sheet.getLastRow()).getValues().map(function(row) {
                    return row[0];
                }).random();
                event.reply(name);
            }
        },
    }

    return this;
}