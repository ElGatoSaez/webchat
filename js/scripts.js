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
        $('#btnSubmit').on('click', function() {
            var data = $('#login_form').serializeObject();
            console.debug(data);
            
            connect(data);
        });
    });
});


