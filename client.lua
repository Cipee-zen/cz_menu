CZ = nil
local Display = false
local MenuList = {}
local Freezvisual = false
local ControlToEnable = {32,33,34,35,30,31,63,64,59,71,71,75,23}
local controlToEnable = {}

TriggerEvent("InitializeCipeZenFrameWork",function(cz)
    CZ = cz
end)

Citizen.CreateThread(function ()
    while true do
        Wait(1)
        if Display then
            DisableAllControlActions(0)
            for k,v in pairs(controlToEnable) do
                EnableControlAction(0,v,true)
            end
            if not Freezvisual then
                EnableControlAction(0, 1, true)
                EnableControlAction(0, 2, true)
            end
            if IsDisabledControlJustPressed(0, 25) then
                Freezvisual = not Freezvisual
            end
        end
    end
end)

RegisterNUICallback("closeall", function ()
    Display = false
    MenuList = {}
    SetNuiFocus(false, false)
    Freezvisual = false
end)

RegisterNUICallback("close", function (data)
    for k, v in pairs(MenuList) do
        if v.id == data.menu then
            v.cb2({
                close = function ()
                    TriggerEvent("cz_menu:closeMenu",data.menu)
                end,
                id = data.menu
            })
            return
        end
    end
end)

RegisterNUICallback("callback", function (data)
    for k,v in pairs(MenuList) do
        if v.id == data.menu then
            for s,t in pairs(v.selection) do
                if t and t.value == data.value then
                    v.cb1({
                        close = function ()
                            TriggerEvent("cz_menu:closeMenu",data.menu)
                        end,
                        id = data.menu
                    },data.value)
                    return
                end
            end
        end
    end
end)

RegisterNUICallback("textCallback", function(data)
    for k,v in pairs(MenuList) do
        if v.id == data.menu then
            if data.cancell then
                v.cb2({
                    close = function ()
                        TriggerEvent("cz_menu:closeMenu",data.menu)
                    end,
                    id = data.menu
                })
                return
            else
                v.cb1({
                    close = function ()
                        TriggerEvent("cz_menu:closeMenu",data.menu)
                    end,
                    id = data.menu
                },data.value)
                return
            end
        end
    end
end)

RegisterNetEvent("cz_menu:closeMenu")
AddEventHandler("cz_menu:closeMenu", function (menu)
    for k, v in pairs(MenuList) do
        if v.id == menu then
            SendNUIMessage({
                action = "closemenu",
                menu = menu,
            })
            table.remove(MenuList,k)
            break
        end
    end
    controlToEnable = ControlToEnable
end)

RegisterNetEvent("cz_menu:openMenu")
AddEventHandler("cz_menu:openMenu", function (selection,t,cb1,cb2)
    SetNuiFocus(true,true)
    SetNuiFocusKeepInput(true)
    Display = true
    local id = Verifyid()
    table.insert(MenuList,{id = id,selection = selection,type = t,cb1 = cb1,cb2 = cb2})
    if t == "text" then
        controlToEnable = {}
        SendNUIMessage({
            action = "openmenu",
            menu = id,
            title = selection,
            type = t
        })
    else
        controlToEnable = ControlToEnable
        SendNUIMessage({
            action = "openmenu",
            menu = id,
            selection = selection,
            type = t
        })
    end
end)

RegisterNetEvent("cz_menu:closeAllMenu")
AddEventHandler("cz_menu:closeAllMenu", function()
    for k, v in pairs(MenuList) do
        SendNUIMessage({
            action = "closemenu",
            menu = menu,
        })
    end
    MenuList = {}
    CurrentMenuOpen = nil
end)

function Verifyid()
    local id = math.random(0,9)..math.random(0,9)..math.random(0,9)
    local find = false
    for k,v in pairs(MenuList) do
        if v.id == id then
            find = true
            return verifyid()
        end
    end
    if find == false then
        return id
    end
end
