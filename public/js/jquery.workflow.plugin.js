($ => {
    $.fn.workflow = function(action) {
        this.children("section").not(".active").hide();
        this.children("section.active").show();
        return this;
    };
})(jQuery);