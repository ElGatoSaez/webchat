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
    
    var irc = new Irc("omega.hira.io", 8765, data["nick"], data["password"]);
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
            irc.lsend("JOIN "+data["group_name"]);
        });
    });
}

function sendMessage(message){
    $('#chattext').data("wysihtml5").el.context.innerHTML = "";
    
    // TODO: Parse line breaks, bold, etc
}

$(function() {
    $('#groupname').on('keypress', function(e) {
        if (e.which == 32)
            return false;
    });
});

