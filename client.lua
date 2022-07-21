CZ = nil
local openMenus = {}
local openMenuId = nil
local openMenuIndex = nil
local display = false
local mouseMove = false

TriggerEvent("InitializeCipeZenFrameWork",function(cz)
    CZ = cz
    CZ.CreateThread(1,function(pause,reasume,delete)
        if display then
            if IsDisabledControlJustPressed(0, 25) then
                mouseMove = not mouseMove
                if mouseMove then
                    table.insert(DisableControls,1)
                    table.insert(DisableControls,2)
                else
                    table.remove(DisableControls,#DisableControls)
                    table.remove(DisableControls,#DisableControls)
                end
            end
            for k,v in pairs(DisableControls) do
                DisableControlAction(0,v,true)
            end
        end
    end)
    CZ.ControlPressed(194,function ()
        if display then
            if openMenuId ~= nil then
                if openMenus[openMenuId].data.Type == "menu" then
                    local menuId = openMenuId
                    function Close()
                        for k,v in pairs(openMenus) do
                            if v.id == menuId then
                                if openMenuId == menuId then
                                    if k == 1 then
                                        openMenuId = nil
                                        openMenuIndex = nil
                                        display = false
                                        SetNuiFocus(display,display)
                                        SetNuiFocusKeepInput(display)
                                        SendNUIMessage({
                                            type = v.data.Type,
                                            action = "close"
                                        })
                                        if mouseMove then
                                            table.remove(DisableControls,#DisableControls)
                                            table.remove(DisableControls,#DisableControls)
                                            mouseMove = false
                                        end
                                    else
                                        openMenuId = openMenus[k-1].id
                                        openMenuIndex = k-1
                                        SendNUIMessage({
                                            action = "open",
                                            Buttons = openMenus[k-1].data.Buttons,
                                            Title = openMenus[k-1].data.Title,
                                        })
                                    end
                                end
                                table.remove(openMenus,k)
                                break
                            end
                        end
                    end
                    openMenus[openMenuIndex].cb1(Close)
                end
            end
        end
    end)
end,function (cz)
	CZ = cz
end)

RegisterNetEvent("c_menu_z:closeAllMenu")
AddEventHandler("c_menu_z:closeAllMenu",function ()
    openMenus = {}
    openMenuId = nil
    openMenuIndex = nil
    display = false
    SetNuiFocus(display,display)
    SetNuiFocusKeepInput(display)
    SendNUIMessage({
        action = "closeall"
    })
    if mouseMove then
        table.remove(DisableControls,#DisableControls)
        table.remove(DisableControls,#DisableControls)
        mouseMove = false
    end
end)

RegisterNetEvent("c_menu_z:openMenu")
AddEventHandler("c_menu_z:openMenu",function(id,data,cb,cb1,cb2)
    --local randomint = math.random(0,100)..math.random(0,100)..math.random(0,100)..math.random(0,100)..math.random(0,100)..math.random(0,100)..math.random(0,100)
    local find = false
    for k,v in pairs(openMenus) do
        if v.id == id then
            find = true
            print("this menu is already open \'"..id.."\'")
            break
        end
    end
    if not find then
        table.insert(openMenus,{
            id = id,
            data = data,
            cb = cb,
            cb1 = cb1,
            cb2 = cb2,
        })
        display = true
        SetNuiFocus(display,display)
        SetNuiFocusKeepInput(display)
        openMenuId = id
        openMenuIndex = #openMenus
        SendNUIMessage({
            action = "open",
            Buttons = data.Buttons,
            Type = data.Type,
            Title = data.Title,
        })
    end
end)

function GetIndexOf(search,table)
    for k,v in pairs(search) do
        if v == table then
            return k
        end
    end
    return nil
end

RegisterNUICallback("pressButtonText", function(data)
    local menuId = openMenuId
    local menu = openMenus[openMenuIndex]
    function Close()
        local index = GetIndexOf(openMenus,menu)
        if index then
            if menuId == openMenuId then
                if #openMenus == 1 then
                    display = false
                    openMenuId = nil
                    openMenuIndex = nil
                    SetNuiFocus(display,display)
                    SetNuiFocusKeepInput(display)
                    SendNUIMessage({
                        type = menu.data.Type,
                        action = "close"
                    })
                    if mouseMove then
                        table.remove(DisableControls,#DisableControls)
                        table.remove(DisableControls,#DisableControls)
                        mouseMove = false
                    end
                    openMenus = {}
                else
                    openMenuId = openMenus[index-1].id
                    openMenuIndex = index-1
                    SendNUIMessage({
                        action = "open",
                        Buttons = openMenus[index-1].data.Buttons,
                        Title = openMenus[index-1].data.Title,
                    })
                    table.remove(openMenus,index)
                end
            end
        end
    end
    if data.confirm then
        menu.cb(data.value,Close)
    else
        menu.cb1(Close)
    end
end)

RegisterNUICallback("pressButton",function(data)
    local buttonIndex = data.Index
    local menuId = openMenuId
    function Close()
        for k,v in pairs(openMenus) do
            if v.id == menuId then
                if openMenuId == menuId then
                    if k == 1 then
                        openMenuId = nil
                        openMenuIndex = nil
                        display = false
                        SetNuiFocus(display,display)
                        SetNuiFocusKeepInput(display)
                        SendNUIMessage({
                            type = v.data.Type,
                            action = "close"
                        })
                        if mouseMove then
                            table.remove(DisableControls,#DisableControls)
                            table.remove(DisableControls,#DisableControls)
                            mouseMove = false
                        end
                        openMenus = {}
                    else
                        openMenuId = openMenus[k-1].id
                        openMenuIndex = k-1
                        SendNUIMessage({
                            action = "open",
                            Buttons = openMenus[k-1].data.Buttons,
                            Title = openMenus[k-1].data.Title,
                        })
                        table.remove(openMenus,k)
                    end
                end
                break
            end
        end
    end
    openMenus[openMenuIndex].cb(openMenus[openMenuIndex].data.Buttons[buttonIndex].value,Close)
end)