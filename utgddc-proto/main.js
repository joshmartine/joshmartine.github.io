const pages = ['section1', 'section2', 'section3'];
let windowHeight = $(window).height();

$(window).resize(function () {
    windowHeight = $(window).height();
});

$(document).scroll(function () {
    const distance = $(document).scrollTop();
    const page = Math.floor(distance / windowHeight);
    $('#' + pages[page]).css({ 'opacity': '1', 'padding-top': '50px' });
});