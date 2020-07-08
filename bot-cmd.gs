const BotCommand = function (bot) {
    const that = this;

    this.isCommand = function (event) {
        return this.isTextMessage(event)
            // && (event.source.type === 'user' || event.message.text.startsWith('神奇海螺'));
    }

    this.isTextMessage = function (event) {
        return event.type === 'message' && event.message.type === 'text';
    }
    this.existsCommand = (event) => {
        let message_array = event.message.text.toLowerCase().split(' ');
        let message = message_array[0];
        for (let commandsKey in commands) {
            if (message === commandsKey) {
                return commandsKey
            }
            if (Array.isArray(commands[commandsKey]['alias'])) {
                let matches = commands[commandsKey]['alias'].find(function (item, index, array) {
                    return message === item;
                });
                if (matches) {
                    return commandsKey;
                }
            }
            if (Array.isArray(commands[commandsKey]['includes'])) {
                let matches = commands[commandsKey]['includes'].find(function (item, index, array) {
                    return message.includes(item);
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
            if ( commands[cmd].public || event.isAdmin()) {
                log('runCommand', cmd);
                commands[cmd].do(event);
            } else {
                log('cannot runCommand', cmd);
            }
            return;
        }
        log('Unknown Command', event.message.text);
    }

    this.getCommands = () => commands;

    let commands = {
        "指令": {
            public: true,
            description: "顯示可用指令",
            do(event) {
                let list = "";
                Object.keys(commands).forEach(function(cmd) {
                    if( commands[cmd].public ) {
                        list += `${cmd} : ${commands[cmd].description}\n`;
                    }
                })
                event.reply(list);
            }
        },
        "全部指令": {
            public: false,
            description: "顯示全部可用指令",
            do(event) {
                let list = "";
                Object.keys(commands).forEach(function(cmd) {
                    list += `${cmd} : ${commands[cmd].description}\n`;
                })
                event.reply(list);
            }
        },
        "抽飲料店": {
            public: true,
            description: "隨機挑選飲料店",
            includes: ['喝什麼', '口渴'],
            do(event) {
                let data = arrayRandom(DB.newQuery().table('飲料店').all());
                let msg = '';
                Object.keys(data).forEach(function(col) {
                    msg += `${col} : ${data[col]}\n`
                })
                msg += '我們就喝這家吧！';
                event.reply(msg);
            }
        },
        "!滾": {
            public: true,
            description: "叫我滾",
            alias: ['！滾'],
            do(event) {
                if( ['room', 'group'].includes(event.source.type) ) {
                    event.reply(`我是賽亞人的驕傲！`);
                    if (event.source.type === 'room') {
                        bot.leaveRoom(event.source.roomId);
                    } else if (event.source.type === 'group') {
                        bot.leaveGroup(event.source.groupId);
                    }
                } else {
                    event.reply(`看我幹嘛？我他媽還能去哪？`);
                }
            }
        },
        "擲骰子": {
            public: true,
            description: "擲出三顆骰子",
            alias: ['遊戲boy'],
            do(event) {
                let num = randomInt(3, 18);
                let msg = `哼！遊戲boy 擲出了點數 : ${num}`;
                event.reply(msg);
            }
        },
        "test": {
            public: false,
            description: "測試",
            alias: ['測試'],
            do(event) {
                let image = GoogleDrive.open('images/test').randomFile();
                let imageInfo = GoogleDrive.getImageInfo(image);
                let msg = {
                    type: 'image',
                    originalContentUrl: imageInfo.origin,
                    previewImageUrl: imageInfo.thumbnail
                }
                log('test reply', msg);
                event.reply(msg);
            }
        }
    }

    return this;
}