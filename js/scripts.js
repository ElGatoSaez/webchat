$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function unlockform(){
    $('#nick').attr('disabled', false);
    $('#password').attr('disabled', false);
    $('#remember').attr('disabled', false);
    $('#btnSubmit').button('not loading'); // :p
    $('#btnSubmit').html('Log in');
}

function connect(data){
    console.info("Connecting...");
    $('#nick').attr('disabled', true);
    $('#password').attr('disabled', true);
    $('#remember').attr('disabled', true);
    $('#btnSubmit').button('loading');
    
    window.irc = new Irc("omega.hira.io", 8765, data["nick"], data["password"]);
}

$(document).ready(function(){
    $(function() {
        $('#login_form').on('submit', function(e) {
            e.preventDefault();
            var data = $('#login_form').serializeObject();
            console.debug(data);
            
            connect(data);
        });
    });
});
function changediv(){
    $("#main").load("chat.html #main", function( response, status, xhr ) {
        $('#join_form').on('submit', function(e) {
            e.preventDefault();
            var data = $('#join_form').serializeObject();
            console.debug(data);
            window.irc.connection.lsend("JOIN #"+data["group_name"]);
            $('#joinGroup').modal('toggle');
        });
        $('#chattext').wysihtml5({toolbar: {"font-styles": false, "lists": false, "link": false, "image": false, "blockquote": false, "size":'xs'}});
        $('#chattext').keydown(function (event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                sendMessage($('#chattext').data("wysihtml5").el.context.innerHTML);
                event.preventDefault();
            }
        });
        $('#btnSubmit').on('click', function() {
             sendMessage($('#chattext').data("wysihtml5").el.context.innerHTML);
        });
    });
}

function sendMessage(message){
    $('#chattext').data("wysihtml5").el.context.innerHTML = "";
    message = message.repl
    // TODO: Parse line breaks, bold, etc
}

$(function() {
    $('#groupname').on('keypress', function(e) {
        if (e.which == 32)
            return false;
    });
});
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

