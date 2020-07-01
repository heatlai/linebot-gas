// 環境變數
const scriptProperties = PropertiesService.getScriptProperties();
const LINE_CHANNEL_ID = scriptProperties.getProperty('LINE_CHANNEL_ID');
const LINE_CHANNEL_SECRET = scriptProperties.getProperty('LINE_CHANNEL_SECRET');
const LINE_CHANNEL_ACCESS_TOKEN = scriptProperties.getProperty('LINE_CHANNEL_ACCESS_TOKEN');
const ADMIN_USERS = scriptProperties.getProperty('ADMIN_USERS').split(',');
const DB_SHEET_ID = scriptProperties.getProperty('DB_SHEET_ID');
const DEBUG = scriptProperties.getProperty('DEBUG');

// 主程序
function doPost(e) {
    e.method = 'post';
    log('POST request', e);

    const lineBot = new LineBot({
        channelId: LINE_CHANNEL_ID,
        channelSecret: LINE_CHANNEL_SECRET,
        channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
        adminUsers: ADMIN_USERS
    });

    const botCmd = new BotCommand(lineBot);

    lineBot.on('message', function(event){
        if( botCmd.isCommand(event) ) {
            botCmd.runCommand(event);
        }

        // let displayName = event.source.profile().displayName;
        // let msg = `${displayName} 剛才說的是:\n${event.message.text}`;
        // event.reply(msg);
        // log(`reply to ${displayName}`, msg);
    });

    lineBot.on('join', function (event) {
        event.reply("來來來吼伊係大反攻他媽的！");
    });

    try {
        lineBot.handler(e.postData.contents);
    } catch (exception) {
        if (exception instanceof SyntaxError) {
            logError(exception.name);
        } else {
            logError(exception.stack || exception.message || e);
        }
    }
}
