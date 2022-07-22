# cz_menu

## Requirements
- [CipeZen](https://github.com/Cipee-zen/CipeZen) - version v1.0.0
## Usage
- ### Event
    - ### c_menu_z:openMenu
    >this event allows you to open the **client-side** menu

    ```lua
        TriggerEvent("c_menu_z:openMenu","id",{
            Title = "title",
            Type = "menu", -- optional , menu or text
            Buttons = {{value = "dog",label = "Dog",icon = ""}} -- icons https://ionic.io/ionicons
        },function(Value,Close)

        end,function(Close)
            Close()
        end)
    ```
