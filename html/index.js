let allButtons = []

function CreateMenu() {
    $("#buttonsselection").empty();
    for (i = 0; i < allButtons.length; i++) {
        $("#buttonsselection").append(`
        <div index="${i+1}" class="buttons">
            <div class="buttonslogo">
                <ion-icon name="${allButtons[i].icon}"></ion-icon>
            </div>
            <div class="buttonstext">
                ${allButtons[i].label}
            </div>
        </div>`);
    }
}

window.onmousedown = (e) => {
    if (e.target.className == "buttons" && e.button == 0) {
        let atrb = e.target.getAttribute("index");
        $.post('http://cz_menu/pressButton', JSON.stringify({ Index: Number(atrb) }));
    }
    if (e.target.id == "confirmcontainer2") {
        $.post('http://cz_menu/pressButtonText', JSON.stringify({ confirm: true, value: $("#inputcontainer2").val() }));
    }
    if (e.target.id == "cancelcontainer2") {
        $.post('http://cz_menu/pressButtonText', JSON.stringify({ confirm: false }));
    }
}

window.addEventListener("message", function(event) {
    var data = event.data;
    switch (data.action) {
        case "open":
            if (data.Type == "menu") {
                if (data.Buttons) {
                    $("#container").css("display", "flex");
                    allButtons = data.Buttons;
                    $("#titlecontainer").html(data.Title);
                    CreateMenu();
                }
            } else if (data.Type == "text") {
                $("#container2").css("display", "flex");
                $("#inputcontainer2").val("");
                $("#bg").css("display", "block");
                $("#titlecontainer2").html(data.Title);
            }
            break;
        case "close":
            if (data.type == "text") {
                $("#container2").css("display", "none");
                $("#bg").css("display", "none");
            } else {
                $("#container").css("display", "none");
            }
            break;
        case "closeall":
            $("#container").css("display", "none");
            $("#container2").css("display", "none");
            break;
    }
});