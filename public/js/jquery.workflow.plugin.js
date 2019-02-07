($ => {
    $.fn.workflow = function(action) {
        if (action === "next") {
            const nextActive = this.children("section.active").next();
            this.children("section.active").removeClass("active");
            nextActive.addClass("active");
        }

        this.children("section").not(".active").hide();
        this.children("section.active").first().show();
        return this;
    };
})(jQuery);