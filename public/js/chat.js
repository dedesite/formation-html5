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

    function geoLocaliseProfile() {
        $("#geoloc").prop("disabled", true);
        navigator.geolocation.getCurrentPosition((pos) => {
            // Get the town name from reverse geocoding
            console.log(pos);
            osmUrl = "https://nominatim.openstreetmap.org/reverse?json_callback=?";
            $.getJSON(osmUrl, {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    format: "json"
                })
                .done(data => {
                    $("#localisation").val(`${data.address.village}, ${data.address.country}`);
                })
                .fail(() => {
                    $("#geoloc").prop("disabled", false);
                })
        }, () => $("#geoloc").prop("disabled", false));
    }

    $("main").workflow();

    $("#join").click(() => {
        $("main").workflow("next");
    });

    $("#geoloc").click((e) => {
        //Do not validate form
        e.preventDefault();
        geoLocaliseProfile();
    });

    $("#profile-form").on("input", updateChatLabel);

    updateChatLabel();
})(jQuery);