$(function() {
    $('#carousel-example-generic').height($(window).height()-$('#panel-title').height());
});

$(window).resize(function(){
    $('#carousel-example-generic').height($(window).height()-$('#panel-title').height());
});