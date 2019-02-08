($ => {
    let username = "";
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
            osmUrl = "https://nominatim.openstreetmap.org/reverse?json_callback=?";
            $.getJSON(osmUrl, {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    format: "json"
                })
                .done(data => {
                    const city = data.address.village || data.address.town || data.address.city;
                    $("#localisation").val(`${city}, ${data.address.country}`);
                })
                .fail(() => {
                    $("#geoloc").prop("disabled", false);
                })
        }, () => $("#geoloc").prop("disabled", false));
    }

    function connectToChat() {
        const ws = new window.WebSocket('ws://localhost:3000/ws');

        ws.onopen = () => {
            $("#status").html("Connnected");
            $("#input").prop("disabled", false);
        };

        ws.onerror = () => {
            $("#status").html("Echec de connexion");
            $("#input").prop("disabled", false);
        };

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            $("#content").append(`<p><small>@${data.username}</small> ${data.msg}</p>`);
        };

        $("#send").click(() => {
            if($("#input").val()) {
                ws.send(JSON.stringify({
                    username,
                    msg: $("#input").val()
                }));
            }
        });
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

    $("#validate-profile").click((e) => {
        e.preventDefault();
        if($("#profile-form")[0].checkValidity()) {
            username = $("#username").val();
            $("main").workflow("next");
            connectToChat();
        } else {
            $("#profile-form")[0].reportValidity();
        }
    });

    updateChatLabel();
})(jQuery);