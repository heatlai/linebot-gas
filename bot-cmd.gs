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
        let received = event.message.text.toLowerCase()
        for (let commandsKey in commands) {
            if (received.includes(commandsKey)) {
                return commandsKey
            }
            if (Array.isArray(commands[commandsKey]['alias'])) {
                let matches = commands[commandsKey]['alias'].find(function (item, index, array) {
                    return received.includes(item);
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
        "指令表": {
            public: true,
            description: "顯示可用指令",
            do(event) {
                let list = "可用指令：\n";
                let isAdmin = event.isAdmin();
                Object.keys(commands).forEach(function(cmd) {
                    if( commands[cmd].public || isAdmin) {
                        list += `${cmd} : ${commands[cmd].description}\n`;
                    }
                })
                event.reply(list);
            }
        },
        "飲料店": {
            public: true,
            description: "隨機挑選飲料店",
            alias: ['喝什麼', '口渴'],
            do(event) {
                let data = arrayRandom(DB.newQuery().table('飲料店').all());
                let msg = `隨機選中了一家飲料店\n`;
                Object.keys(data).forEach(function(col) {
                    msg += `${col} : ${data[col]}\n`
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
            do(event) {
                event.reply({
                    type: 'image',
                    originalContentUrl: 'https://drive.google.com/thumbnail?id=1wjkM7cNZQuqW_CVYl1RdASfc5A8XGn42&sz=w800-h600',
                    previewImageUrl: 'https://drive.google.com/thumbnail?id=1wjkM7cNZQuqW_CVYl1RdASfc5A8XGn42&sz=w640-h480'
                });
            }
        },
        "test2": {
            public: false,
            description: "測試2",
            do(event) {
                let original = GoogleDrive.open(GoogleDrive.IMAGES).getFileUrl('gozzila.jpg');
                let preview = GoogleDrive.getThumbnailUrl('gozzila.jpg', 640, 480);
                log('test2 reply', {
                    type: 'image',
                    originalContentUrl: original,
                    previewImageUrl: preview
                });
                event.reply({
                    type: 'image',
                    originalContentUrl: original,
                    previewImageUrl: preview
                });
            }
        }
    }

    return this;
}