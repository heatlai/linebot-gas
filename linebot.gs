class LineBot {
    constructor(options) {
        this.options = options || {};
        this.options.channelAccessToken = options.channelAccessToken || '';
        this.options.adminUsers = options.adminUsers || [];
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.options.channelAccessToken
        };
        this.endpoint = 'https://api.line.me/v2/bot';
        this.listeners = {};
    }

    /**
     * types: postback, message, join, leave, memberJoined, memberLeft, follow, unfollow
     */
    on(type, listener) {
        this.listeners[type] = listener;
    }

    handler(rawBody) {
        const that = this;
        const req = JSON.parse(rawBody);
        if (!req || !req.events || !Array.isArray(req.events)) {
            logError('Requests Parameters Invalid.', rawBody);
            return;
        }
        req.events.forEach(function (event) {
            event.reply = function (message) {
                return that.reply(event.replyToken, message);
            };
            event.isAdmin = function() {
                if( event.source ) {
                    return that.options.adminUsers.includes(event.source.userId);
                }
                return false;
            }
            if (event.source) {
                event.source.profile = function () {
                    if (event.source.type === 'group') {
                        return that.getGroupMemberProfile(event.source.groupId, event.source.userId);
                    }
                    if (event.source.type === 'room') {
                        return that.getRoomMemberProfile(event.source.roomId, event.source.userId);
                    }
                    return that.getUserProfile(event.source.userId);
                };
            }
            if (event.message) {
                event.message.content = function () {
                    return that.getMessageContent(event.message.id);
                };
            }

            let type = event.type;
            if (typeof that.listeners[type] === 'function') {
                that.listeners[type](event);
            } else {
                log(`unset listener type "${type}"`, event);
            }
        });
    }

    static createMessages(message) {
        if (typeof message === 'string') {
            return [{type: 'text', text: message}];
        }
        if (Array.isArray(message)) {
            return message.map(function (m) {
                if (typeof m === 'string') {
                    return {type: 'text', text: m};
                }
                return m;
            });
        }
        return [message];
    }

    reply(replyToken, message) {
        const url = '/message/reply';
        const body = {
            replyToken: replyToken,
            messages: LineBot.createMessages(message)
        };
        return JSON.parse(this.post(url, body).getContentText());
    }

    push(to, message) {
        const url = '/message/push';
        if (Array.isArray(to)) {
            return to.map(recipient => this.push(recipient, message));
        }
        const body = {
            to: to,
            messages: LineBot.createMessages(message)
        };
        return JSON.parse(this.post(url, body).getContentText());
    }

    getMessageContent(messageId) {
        const url = `/message/${messageId}/content`;
        return this.get(url).getContent();
    }

    getUserProfile(userId) {
        const url = `/profile/${userId}`;
        return JSON.parse(this.get(url).getContentText());
    }

    getGroupMemberProfile(groupId, userId) {
        const url = `/group/${groupId}/member/${userId}`;
        let profile = JSON.parse(this.get(url).getContentText());
        profile.groupId = groupId;
        return profile;
    }

    getRoomMemberProfile(roomId, userId) {
        const url = `/room/${roomId}/member/${userId}`;
        let profile = JSON.parse(this.get(url).getContentText());
        profile.roomId = roomId;
        return profile;
    }

    leaveGroup(groupId) {
        const url = `/group/${groupId}/leave`;
        return JSON.parse(this.post(url).getContentText());
    }

    leaveRoom(roomId) {
        const url = `/room/${roomId}/leave`;
        return JSON.parse(this.post(url).getContentText());
    }

    get(path) {
        const url = this.endpoint + path;
        const options = {method: 'get', headers: this.headers};
        return UrlFetchApp.fetch(url, options);
    }

    post(path, body) {
        const url = this.endpoint + path;
        const options = {method: 'post', headers: this.headers, payload: JSON.stringify(body)};
        return UrlFetchApp.fetch(url, options);
    }
}