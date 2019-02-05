($ => {
    function getAge(birthday) {
        const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 364;
        return Math.floor((new Date() - birthday) / MS_PER_YEAR);
    }

    function updateChatLabel() {
        let label = "";
        if ($("#displayname").val()) {
            label = `<div>${$("#displayname").val()} <small>(@${$("#username").val()})</small>`;
        } else {
            label = `<div>@${$("#username").val()}`;
        }

        if ($("#birthday").val()) {
            label += `, ${getAge(new Date($("#birthday").val()))} ans`;
        }

        label += `</div><small>${$("#localisation").val()}</small>`
        $("#chatlabel").html(label);
    }

    $("main").workflow();

    $("#join").click(() => {
        $("main").workflow("next");
    });

    $("#profile-form").on("input", updateChatLabel);

    updateChatLabel();
})(jQuery);