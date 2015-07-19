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
    $("#main").load("chat.html #main");
}


