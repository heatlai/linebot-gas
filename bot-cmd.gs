const BotCommand = function (bot) {
    const that = this;

    this.isCommand = function (event) {
        return this.isTextMessage(event)
            && (event.source.type === 'user' || event.message.text.startsWith('神奇海螺'));
    }

    this.isTextMessage = function (event) {
        return event.type === 'message' && event.message.type === 'text';
    }
    this.existsCommand = (event) => {

        for (let commandsKey in commands) {
            if (event.message.text.includes(commandsKey)) {
                return commandsKey
            }
            if (Array.isArray(commands[commandsKey]['alias'])) {
                let matches = commands[commandsKey]['alias'].find(function (item, index, array) {
                    return event.message.text.includes(item);
                });
                if (matches) {
                    return commandsKey;
                }
            }
        }
    }
    this.runCommand = function (event) {
        let cmd = this.existsCommand(event);
        if (cmd) {
            log('runCommand', cmd);
            return commands[cmd].do(event);
        }
        log('Unknown Command', event.message.text);
    }

    this.getCommands = () => commands;

    let commands = {
        "指令表": {
            public: true,
            description: "顯示可用指令",
            do(event) {
                let list = "可用指令：\n";
                Object.keys(commands).forEach(function(cmd) {
                    list += `${cmd} : ${commands[cmd].description}\n`;
                })
                event.reply(list);
            }
        },
        "飲料店": {
            public: true,
            description: "隨機挑選飲料店",
            alias: ['喝什麼'],
            do(event) {
                let data = arrayRandom(DB.newQuery().table('飲料店').all());
                let msg = '';
                Object.keys(data).forEach(function(col) {
                    msg += `${col} : ${data[col]}`
                })
                event.reply(msg);
            }
        },
        "離開": {
            public: true,
            description: "叫我滾",
            alias: ['leave'],
            do(event) {
                if( ['room', 'group'].includes(event.source.type) ) {
                    event.reply(`我是賽亞人的驕傲！`);
                    if (event.source.type === 'room') {
                        bot.leaveRoom(event.source.roomId);
                    } else if (event.source.type === 'group') {
                        bot.leaveGroup(event.source.groupId);
                    }
                }
            }
        }
    }

    return this;
}