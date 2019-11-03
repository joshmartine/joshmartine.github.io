showdown.setFlavor('github');

$(function() {
    var converter = new showdown.Converter();
    $.get($("#post-script").attr("name"), function(data) {
        $('#post').html(converter.makeHtml(data));
    });
})