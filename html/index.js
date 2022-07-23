var MenuShow = false;
var MenuList = [];
var ShowHover = false;
var MenuShowText = false

const pos = [
    { "top": "25px", "left": "130px" },
    { "top": "55px", "right": "55px" },
    { "top": "130px", "right": "25px" },
    { "bottom": "55px", "right": "55px" },
    { "bottom": "25px", "left": "130px" },
    { "bottom": "55px", "left": "55px" },
    { "top": "130px", "left": "25px" },
    { "top": "55px", "left": "55px" },
];

const menu = document.getElementById("menu");
const description = document.getElementById("description");
document.body.addEventListener("mouseover", function(e) {
    if (e.target.id != "close") {
        if (e.target.tagName == "I" && ShowHover) {
            let atrb = e.target.getAttribute("value");
            for (i = 0; i < MenuList.length; i++) {
                if (MenuList[i].id == MenuShow) {
                    for (s = 0; s < MenuList[i].selection.length; s++) {
                        if (MenuList[i].selection[s]) {
                            if (MenuList[i].selection[s].value == atrb) {
                                description.innerHTML = MenuList[i].selection[s].description;
                            }
                        }
                    }
                }
            }
            description.style.display = "block";
            description.style.left = e.clientX;
            description.style.top = e.clientY;
        } else {
            description.style.display = "none";
        }
    }
});

document.body.addEventListener("mousedown", function(e) {
    if (e.target.id == "close") {
        $.post('http://cz_menu/close', JSON.stringify({ "menu": MenuList[MenuList.length - 1].id }));
    }
    if (e.target.id == "buttonTextConfirm") {
        if (MenuShowText) {
            $.post('http://cz_menu/textCallback', JSON.stringify({menu: MenuShow,value:$("#menuText").val()}));
        }
    }
    if (e.target.id == "buttonTextCancell") {
        if (MenuShowText) {
            $.post('http://cz_menu/textCallback', JSON.stringify({menu: MenuShow,cancell: true}));
        }
    }
    if (e.target.getAttribute("value") && ShowHover) {
        let atrb = e.target.getAttribute("value");
        $.post('http://cz_menu/callback', JSON.stringify({ "value": atrb, "menu": MenuShow }));
    }
});

function ShowMenu(selection) {
    LoadSelection(selection)
    menu.style.transform = "scale(1.5)";
    OpenAnim()
}

function getRandomInt(max) {
    return Number(String(Math.floor(Math.random() * max)) + String(Math.floor(Math.random() * max)) + String(Math.floor(Math.random() * max)));
}

function OpenAnim() {
    let c = menu.children;
    for (i = 0; i < c.length; i++) {
        c[i].style.transition = "0.0s";
        c[i].style.fontSize = "0px";
        c[i].style.top = "150px";
        c[i].style.left = "150px";
        c[i].style.transition = "0.25s";
    }
    document.getElementById("close").style.transition = "1.0s"
    document.getElementById("close").style.transform = "rotate(360deg)";
    setTimeout(() => {
        document.getElementById("close").style.transition = "0.25s"
    }, 1000);
    loop(c.length - 1);
}

function loop(i) {
    if (i < 0) { ShowHover = true; return; };
    if (MenuShow == null || MenuShow == false) return;
    setTimeout(function() {
        let c = document.getElementById("menu").children;
        let a = 7
        let cos = a - i
        c[cos].style.fontSize = "40px";
        if (pos[cos].top) {
            c[cos].style.top = pos[cos].top;
        } else {
            c[cos].style.top = "auto";
        }
        if (pos[cos].bottom) {
            c[cos].style.bottom = pos[cos].bottom;
        } else {
            c[cos].style.bottom = "auto";
        }
        if (pos[cos].left) {
            c[cos].style.left = pos[cos].left;
        } else {
            c[cos].style.left = "auto";
        }
        if (pos[cos].right) {
            c[cos].style.right = pos[cos].right;
        } else {
            c[cos].style.right = "auto";
        }
        loop(--i);
    }, 100);
}

function LoadSelection(selection) {
    let c = menu.children;
    for (i = 0; i < c.length; i++) {
        if (selection[i]) {
            c[i].style.display = "inline-block";
            c[i].className = selection[i].icon;
            c[i].setAttribute("value", selection[i].value)
        } else {
            c[i].style.display = "none"
        }
    }
}



window.addEventListener("message", function(event) {
    var data = event.data;
    switch (data.action) {
        case "openmenu":
            ShowHover = false;
            if (data.type == "menu") {
                document.getElementById("container").style.display = "block";
                document.getElementById("container2").style.display = "none";
                let menu2 = { "id": data.menu, "selection": data.selection };
                MenuList.push(menu2);
                MenuShow = menu2.id;
                MenuShowText = false;
                ShowMenu(menu2.selection);
            }else {
                document.getElementById("container").style.display = "none";
                document.getElementById("container2").style.display = "flex";
                let menu2 = { "id": data.menu, type:"text" };
                MenuList.push(menu2);
                $("#menuText").val("");
                if (data.title) $("#titleText").html(data.title);
                MenuShow = data.menu;
                MenuShowText = true;
            }
            break;
        case "closemenu":
            if (data.menu == MenuShow) {
                if (MenuList.length > 1) {
                    if (MenuList[MenuList.length - 1].type) {
                        MenuShow = MenuList[MenuList.length - 2].id;
                        document.getElementById("container2").style.display = "none";
                        LoadSelection(MenuList[MenuList.length - 2].selection);
                        MenuList = MenuList.splice(MenuList[MenuList.length - 1], 1);
                        OpenAnim();
                    }else {
                        MenuShow = MenuList[MenuList.length - 2].id;
                        document.getElementById("close").style.transition = "0.0s";
                        document.getElementById("close").style.transform = "rotate(0deg)";
                        document.getElementById("close").style.transition = "0.25s";
                        LoadSelection(MenuList[MenuList.length - 2].selection);
                        MenuList = MenuList.splice(MenuList[MenuList.length - 1], 1);
                        OpenAnim();
                    }
                } else {
                    MenuShow = false;
                    document.getElementById("container2").style.display = "none";
                    menu.style.transform = "scale(0)";
                    document.getElementById("close").style.transition = "0.7s";
                    document.getElementById("close").style.transform = "rotate(0deg)";
                    setTimeout(() => {
                        document.getElementById("close").style.transition = "0.25s";
                        $.post('http://cz_menu/closeall', JSON.stringify({}));
                        document.getElementById("container").style.display = "none";
                    }, 700);
                    MenuList = [];
                }
            } else {
                for (i = 0; i < MenuList.length; i++) {
                    if (MenuList[i].id == data.menu) {
                        MenuList.splice(i, 1);
                        break;
                    }
                }
            }
            break;
    }
});