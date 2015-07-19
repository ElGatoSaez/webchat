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
            
        }else if(ircdata['verb'] == "904"){ // SASL auth error
            console.warn("Auth error.");
            unlockform()
            $('#formAlertBox').html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <b>Error authenticating</b><br/> Maybe your user/password is wrong?");
            $('#formAlertBox').removeClass('hidden');
        }else if(ircdata['verb'] == "ERROR"){ // disconnected from the IRC
            if(this.totallyconnected == false){
                console.warn("Connection closed!");
                unlockform()
                $('#formAlertBox').html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <b>Error</b><br/> The connection to the chat was suddenly terminated :(");
                $('#formAlertBox').removeClass('hidden');
            }

        }
    };
}
