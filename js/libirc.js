function Irc (host, port, nick) {
    this.host = host;
    this.port = port;
    this.nick = nick;
    this.realname = "Hira's WebChat"
    this.user = "webchat"
    this.connection = new WebSocket('ws://'+this.host+':'+this.port);
    // When the connection is open, send some data to the server
    this.connection.onopen = function () {
      this.send('NICK ' + this.nick);
      this.send('USER ' + this.user + ' 8 * :' + this.realname);
    };
    // Log errors
    this.connection.onerror = function (error) {
      console.log('[ERROR] ' + error);
    };
    // Log messages from the server
    this.connection.onmessage = function (e) {
      console.log('[DEBUG] ' + e.data);
    };
}
