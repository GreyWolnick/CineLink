$(document).ready(function() {
    var inner = $(".inner");
    var img_cont = $(".img-container img:first");
    $(inner).css("width", $(img_cont).height());
    $(inner).css("height", $(img_cont).height());

    $(inner).each(function(index, element) {
        $(element).css("top", Math.floor(Math.random() * 101) - 50);
        $(element).css("left", Math.floor(Math.random() * 101) - 50);
    });

    $("#quick-button").click(function() {
        window.location.href = "/quickplay";
    });

    $("#chain-button").click(function() {
        window.location.href = "/chain";
    });
});