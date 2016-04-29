function setCarouselSize() {
    var wWidth = $(window).width();
    var wHeight = $(window).height();
    
    var originalImageHeight = 1080;
    var originalImageWidth = 1920;
    
    if (wHeight > wWidth) {        
        var containerHeight = originalImageHeight * wWidth / originalImageWidth;   
        $('#carousel-example-generic').height(containerHeight);
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