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

    getCookie(data);
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
        document.title = 'Hira';
        $('#join_form').on('submit', function(e) {
            e.preventDefault();
            var data = $('#join_form').serializeObject();
            console.debug(data);
            window.irc.connection.lsend("JOIN #"+data["group_name"]);
            $('#joinGroup').modal('toggle');
        });
        $('#chattext').wysihtml5({toolbar: {"font-styles": false, "lists": false, "link": false, "image": false, "blockquote": false, "size":'xs'}});

        $('#chatStuffContainer .wysihtml5-toolbar .btn-group').append('<a class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-expanded="false"><span class="glyphicon glyphicon-font"></span><span class="current-font">Black</span><b class="caret"></b></a><ul class="dropdown-menu"><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="grey" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-gray">Grey</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="black" tabindex="-1" href="javascript:;" unselectable="on">Black</a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-blue">Blue</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-gren">Green</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-red">Red</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="orange" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-orange">Orange</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="yellow" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-yellow">Yellow</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="cyan" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-cyan">Cyan</span></a></li><li><a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="pink" tabindex="-1" href="javascript:;" unselectable="on"><span class="wysiwyg-color-pink">Pink</span></a></li></ul></li>')

        $('#chattext').keydown(function (event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                sendMessage($('#chattext').data("wysihtml5").el.context.innerHTML);
                event.preventDefault();
            }
        });
        $('#btnSubmit').on('click', function() {
             sendMessage($('#chattext').data("wysihtml5").el.context.innerHTML);
        });

        $(document).bind('keydown', 'alt+j', function() {
            $('#joinGroup').modal('toggle');
        });
        $('#joinGroup').on('shown.bs.modal', function () {
            $('#groupname').focus();
        })
        if (typeof String.prototype.startsWith != 'function') {
          String.prototype.startsWith = function (str){
            return this.slice(0, str.length) == str;
          };
        }
    });
}

function sendMessage(message){
    var clone = $('#group_list .active').clone() // TODO optimize
    clone.find('.badge').remove()
    var type = clone.attr('href').split("-")[1];
    $('#chattext').data("wysihtml5").el.context.innerHTML = "";
    //Put it on our window!
    if(window.irc.userAvatar[window.irc.connection.nick] == undefined){
        getAvatar(window.irc.connection.nick);
        hash=""
    } else {
      hash=window.irc.userAvatar[window.irc.connection.nick]
    }
    var parsed = '<div class="media well"><a href="#" class="pull-left"><img alt="{0}\'s avatar" src="http://www.gravatar.com/avatar/{2}" class="media-object avatar-{0}"></a>\
                  <div class="media-body"><h4>{0}</h4>{1}</div></div>'.format(window.irc.connection.nick, Autolinker.link(message, {truncate: 25}), hash);

    var t = $('#message_box')[0].scrollHeight - $('#message_box').scrollTop();
    if(t==$('#message_box').outerHeight() || t==$('#message_box').outerHeight()-1 || t==$('#message_box').outerHeight()+1){var bottom=true}else{var bottom=false;}

    $("#frame-"+type+"-"+clone.html()).append(parsed);
    if(bottom){ $('#message_box').scrollTop($('#message_box').prop('scrollHeight'));}
    console.log(message)
    message = message.replace(/<span class="wysiwyg-color-white">/g, '\00300');
    message = message.replace(/<span class="wysiwyg-color-black">/g, '\00301');
    message = message.replace(/<span class="wysiwyg-color-navy">/g, '\00302');
    message = message.replace(/<span class="wysiwyg-color-green">/g, '\00303');
    message = message.replace(/<span class="wysiwyg-color-red">/g, '\00304');
    message = message.replace(/<span class="wysiwyg-color-brown">/g, '\00305');
    message = message.replace(/<span class="wysiwyg-color-purple">/g, '\00306');
    message = message.replace(/<span class="wysiwyg-color-orange">/g, '\00307');
    message = message.replace(/<span class="wysiwyg-color-yellow">/g, '\00308');
    message = message.replace(/<span class="wysiwyg-color-lime">/g, '\00309');
    message = message.replace(/<span class="wysiwyg-color-teal">/g, '\00310');
    message = message.replace(/<span class="wysiwyg-color-cyan">/g, '\00311');
    message = message.replace(/<span class="wysiwyg-color-blue">/g, '\00312');
    message = message.replace(/<span class="wysiwyg-color-pink">/g, '\00313');
    message = message.replace(/<span class="wysiwyg-color-gray">/g, '\00314');
    message = message.replace(/<span class="wysiwyg-color-lightgray">/g, '\00315');
    message = message.replace(/<\/span>/g, '\003');
    message = message.replace(/<b>|<\/b>/g, '\002');
    message = message.replace(/<i>|<\/i>/g, '\u001d');
    message = message.replace(/<u>|<\/u>/g, '\u001f');
    message = message.replace(/&nbsp;/g, ' ');
    message = message.replace(/<p>|<\/p>/g, '');
    message = message.split('<br>')[0] // TODO: send the other messages
    message = $("<div/>").html(message).text();

    window.irc.connection.lsend("PRIVMSG "+ ((type == "user")?"":"#") + clone.html() + ' :' + message);
    // TODO: Parse line breaks
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
    var current = $("#group_list").find('.active').get(0);
    $(el).tab("show")
    if (current) {
        current.classList.remove('active');
    }
    el.classList.add('active');
    $('#chatStuffContainer').removeClass('invisible');
}
function escapeHtml(string) {

    return String(string).replace(/[&<>"']/g, function (s) {
      return entityMap[s];
    });
}

function parseColors(message) {
    var rex = /\003([0-9]{1,2})[,]?([0-9]{1,2})?([^\003]+)/,matches,colors;
    if (rex.test(message)) {
        while (cp = rex.exec(message)) {
            if (cp[2]) {
                var cbg = cp[2];
            }
            var message = message.replace(cp[0],'<span class="fg'+cp[1]+' bg'+cbg+'">'+cp[3]+'</span>');
        }
    }
    var bui = [
        [/\002([^\002]+)(\002)?/, ["<b>","</b>"]],
        [/\037([^\037]+)(\037)?/, ["<u>","</u>"]],
        [/\035([^\035]+)(\035)?/, ["<i>","</i>"]]
    ];
    for (var i=0;i < bui.length;i++) {
        var bc = bui[i][0];
        var style = bui[i][1];
        if (bc.test(message)) {
            while (bmatch = bc.exec(message)) {
                var message = message.replace(bmatch[0], style[0]+bmatch[1]+style[1]);
            }
        }
    }
    message = message.replace(/\u000f/g, ''); // TODO: Parse those "end of everything" codes.
    return message;
}
function getCookie(data){
  $.ajax({
           url: "https://auth.polsaker.com/auth",
           type: "POST",
           crossDomain: true,
           data: {user: data["nick"], password: data["password"]},
           dataType: "json",
           success: function (response) {
               window.irc = new Irc("omega.hira.io", 8765, data["nick"], response["authcookie"]);
           },
           error: function (xhr, status) {
               console.error(xhr);
           }
       });
}
function getAvatar(nick){
  $.ajax({
           url: "https://auth.polsaker.com/getHash",
           type: "POST",
           crossDomain: true,
           data: {user: nick},
           dataType: "json",
           success: function (response) {
               window.irc.userAvatar[nick] = response["hash"]
               $(".avatar-"+nick).attr("src", "http://www.gravatar.com/avatar/"+response["hash"]);
           },
           error: function (xhr, status) {
               console.error(xhr);
           }
       });
}
