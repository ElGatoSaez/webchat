function Irc (host, port, nick, password) {
    this.host = host;
    this.port = port;
    this.connection = new WebSocket('ws://'+this.host+':'+this.port);
    this.connection.nick = nick;
    this.connection.password = password;
    this.connection.realname = "Hira's WebChat";
    this.connection.user = "webchat";
    
    this.connection.connected = false;
    this.connection.totallyconnected = false;
    this.connection.alreadyerrored = false;
    this.connection.channelcount = 0;
    // When the connection is open, send some data to the server
    this.connection.onopen = function () {
        this.lsend("CAP REQ :sasl");
        //this.send('NICK ' + this.nick);
        //this.send('USER ' + this.user + ' 8 * :' + this.realname);
    };
    // Log errors
    this.connection.onerror = function (error) {
      console.log('[ERROR] ' + error);
    };
    
    this.connection.lsend = function(data) { // log what we send
        console.debug(data)
        this.send(data);
    }
    
    // Log messages from the server
    this.connection.onmessage = function (e) {
        if(e.data == 'CONNECTED'){
            console.info('Connected!');
            this.connected = true
            return;
        }
        ircdata = JSON.parse(e.data)
        console.debug(e.data);
        
        // IRC parsing and stuff!
        if(ircdata['verb'] == "CAP" && ircdata['params'][1] == "ACK"){ // SASL ACK!
            this.lsend("AUTHENTICATE PLAIN");
        }else if(ircdata['verb'] == "AUTHENTICATE" && ircdata['params'][0] == "+"){
            this.lsend("AUTHENTICATE " + btoa(this.nick + "\0" + this.nick + "\0" + this.password));
        }else if(ircdata['verb'] == "903"){ // SASL auth successful!
            this.lsend("CAP END");
            this.lsend("NICK "+this.nick);
            this.lsend("USER " + this.user +" 8 * :" + this.realname);
        }else if(ircdata['verb'] == "904"){ // SASL auth error
            console.warn("Auth error.");
            this.alreadyerrored = true;
            unlockform()
            $('#formAlertBox').html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <b>Error authenticating</b><br/> Maybe your user/password is wrong?");
            $('#formAlertBox').removeClass('hidden');
        }else if(ircdata['verb'] == "433") { //Nickname on use
                console.warn("Nick in use!");
                this.alreadyerrored = true;
                unlockform();
                $('#formAlertBox').html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <b>Error</b><br/> Your nickname is already in use, try another nick or wait until it become available");
                $('#formAlertBox').removeClass('hidden');
         }else if(ircdata['verb'] == '001'){ //Ready!
                this.totallyconnected = true;
                changediv();
         }else if(ircdata['verb'] == 'PING'){ //Ping? Pong!
                this.lsend("PONG "+ircdata['params'][0]);
         }else if(ircdata['verb'] == "ERROR" && this.alreadyerrored == false){ // disconnected from the IRC
            if(this.totallyconnected == false){
                console.warn("Connection closed!");
                unlockform()
                $('#formAlertBox').html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <b>Error</b><br/> The connection to the chat was suddenly terminated :(");
                $('#formAlertBox').removeClass('hidden');
            }
         }else if(ircdata['verb'] == 'PRIVMSG'){//Message!
                var nick = ircdata['source'].split("!")[0];
                var channel = ircdata['params'][0].replace("#", "");
                var message = ircdata['params'][1];
                var parsed = '<div class="media well"><a href="#" class="pull-left"><img alt="{0}\'s avatar" src="http://lorempixel.com/64/64/" class="media-object"></a>\
                              <div class="media-body"><h4>{0}</h4>{1}</div></div>'.format(nick, message);
                $("#frame-"+channel).append(parsed);
         }else if(ircdata['verb'] == 'JOIN'){//Join
                var nick = ircdata['source'].split("!")[0];
                var channel = ircdata['params'][0];
                channel = channel.replace("#", "")
                if(nick == this.nick){
                    $("#group_list").append('<a href="#frame-{0}" onclick="activate(this)" class="list-group-item" data-toggle="tab"><span class="badge">0</span>{0}</a>'.format(channel));
                    $("#message_box").append('<div class="media well tab-pane fade" id="frame-{0}"></div>'.format(channel));
                    this.channelcount++;
                }
         }
    };
}
