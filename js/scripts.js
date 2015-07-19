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

$(document).ready(function(){
    $(function() {
        $('#login_form').on('submit', function(e) {
            e.preventDefault();  //prevent form from submitting
            var data = $('#login_form').serializeObject();
	    console.log(data);
            var irc = new Irc("omega.hira.io", 8765, data["nick"]);
        });
    });
});


