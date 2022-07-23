# cz_menu

## Requirements
- [CipeZen](https://github.com/Cipee-zen/CipeZen) - v1.1.0
## Usage
```lua
local elements = {
	nil,-- 1
	nil,-- 2
	{icon="fas fa-thumbs-up",value="yes",description = "some description"},-- 3
	nil,-- 4
	nil,-- 5
	nil,-- 6
	{icon="fas fa-thumbs-down",value="no",description = "some description"},-- 7
    nil,-- 8
}
--type = "text" or "menu"

TriggerEvent("cz_menu:openMenu",elements,"menu",function(menu,value)
    if value == "yes" then
        print("yes")
    end
end,function(menu)
    menu.close()
end)

--text menu type
TriggerEvent("cz_menu:openMenu","description","text",function(menu,value)
    print(value)
end,function(menu)
    menu.close()
end)

--close all menu
TriggerEvent("cz_menu:closeAllMenu")

--close single menu
CZ.Menu("menu",elements,function (menu,value)
  CZ.CloseMenu(menu.id)
  -- or
  menu.close()
end,function (menu)
  	menu.close()
end)
```