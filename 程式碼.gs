// 環境變數
const scriptProperties = PropertiesService.getScriptProperties();
const LINE_CHANNEL_ID = scriptProperties.getProperty('LINE_CHANNEL_ID');
const LINE_CHANNEL_SECRET = scriptProperties.getProperty('LINE_CHANNEL_SECRET');
const LINE_CHANNEL_ACCESS_TOKEN = scriptProperties.getProperty('LINE_CHANNEL_ACCESS_TOKEN');
const ADMIN_USERS = scriptProperties.getProperty('ADMIN_USERS').split(',');
const DB_SHEET_ID = scriptProperties.getProperty('DB_SHEET_ID');

// 主程序
function doPost(e) {
    e.method = 'post';
    const lineBot = new LineBot({
        channelId: LINE_CHANNEL_ID,
        channelSecret: LINE_CHANNEL_SECRET,
        channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
        adminUsers: ADMIN_USERS
    });

    lineBot.on('message', function(event){
        log(event);
        event.reply(`剛才說的是:\n${event.message.text}`);
    });

    try {
        lineBot.handler(e.postData.contents);
    } catch (e) {
        logError(e);
    }
}
