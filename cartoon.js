function setCarouselSize() {
    var wWidth = $(window).width();
    var wHeight = $(window).height();
    
    if (wHeight > wWidth) {
        var containerHeight = wHeight * $('.img-cartoon').width() / wWidth;   
    } else {
        $('#carousel-example-generic').height($(window).height()-$('#panel-title').height());
    }
}

$(function() {
    setCarouselSize();
});

$(window).resize(function(){
    setCarouselSize();
});