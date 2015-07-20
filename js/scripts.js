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
    $(document).ready(function() {
        document.title = 'Hira';
    });
}

function sendMessage(message){
    var clone = $('#group_list .active').clone() // TODO optimize
    clone.find('.badge').remove()
    $('#chattext').data("wysihtml5").el.context.innerHTML = "";
    var parsed = '<div class="media well"><a href="#" class="pull-left"><img alt="{0}\'s avatar" src="http://lorempixel.com/64/64/" class="media-object"></a>\
                  <div class="media-body"><h4>{0}</h4>{1}</div></div>'.format(window.irc.connection.nick, message);
    $("#frame-"+clone.html()).append(parsed);
    message = message.replace(/<b>|<\/b>/g, '\002')
    message = message.replace(/<i>|<\/i>/g, '\u001d')
    message = message.replace(/<u>|<\/u>/g, '\u001f')
    message = message.replace(/&nbsp;/g, ' ')
    message = message.replace(/<p>|<\/p>/g, '')
    message = message.split('<br>')[0] // TODO: send the other messages
    window.irc.connection.lsend("PRIVMSG #" + clone.html() + ' :' + message);
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
 var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

window.activate = function(el) {
    var current = document.querySelector('.active');
    if (current) {
        current.classList.remove('active');
    }
    el.classList.add('active');
}
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
}
