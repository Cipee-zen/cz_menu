let allButtons = [
    { text: "ciao come nutta", icons: "accessibility-outline" }
]

function CreateMenu() {
    $("#buttonsselection").empty();
    for (i = 0; i < allButtons.length; i++) {
        $("#buttonsselection").append(`
        <div index="${i+1}" class="buttons">
            <div class="buttonslogo">
                <ion-icon name="${allButtons[i].icons}"></ion-icon>
            </div>
            <div class="buttonstext">
                ${allButtons[i].text}
            </div>
        </div>`);
    }
}

window.onmousedown = (e) => {
    if (e.target.className == "buttons" && e.button == 0) {
        let atrb = e.target.getAttribute("index");
        //post jquery
        $.post('http://cz_menu/pressButton', JSON.stringify({ Index: Number(atrb) }));
    }
}

CreateMenu()

window.addEventListener("message", function(event) {
    var data = event.data;
    switch (data.action) {
        case "open":
            if (data.Buttons) {
                $("#container").css("display", "flex");
                allButtons = data.Buttons;
                $("#titlecontainer").html(data.Title);
                CreateMenu();
            }
            break;
        case "close":
            $("#container").css("display", "none");
            break;
    }
});