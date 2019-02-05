($ => {
    $("main").workflow();

    $("#join").click(() => {
        $("main").workflow("next");
    })
})(jQuery);