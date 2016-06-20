$(document).ready(function(){
    $('body').css("width",$(window).width()-30);
    $('body').css("height",$(window).height()-30);
    $(window).resize(function(){
        $('body').css("width",$(window).width()-30);
        $('body').css("height",$(window).height()-30);
    });

});

