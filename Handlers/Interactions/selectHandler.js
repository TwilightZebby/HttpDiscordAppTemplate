import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { UtilityCollections } from '../../Utility/utilityConstants.js';
import { localize } from '../../Utility/localizeResponses.js';
import { Selects } from '../../Utility/interactions.js';
import { JsonResponse } from '../../Utility/utilityMethods.js';


// *******************************
//  Exports

/**
 * Handles & Runs Buttons
 * @param {import('discord-api-types/v10').APIMessageComponentSelectMenuInteraction} interaction 
 * 
 * @returns {JsonResponse}
 */
export async function handleSelect(interaction) {
    // Grab select's name from Custom ID
    const SelectName = interaction.data.custom_id.split("_").shift();
    const Select = await Selects[SelectName]();

    // If no Select found, return
    if ( !Select ) { 
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'SELECT_ERROR_GENERIC')
            }
        });
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {import('discord-api-types/v10').APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Cooldown Checks
    // Set initial values
    const Now = Date.now();
    const CooldownStartTimestamp = UtilityCollections.SelectCooldowns.get(`${SelectName}_${interactionUser.id}`);
    const CooldownAmount = ( Select.Select.cooldown || 3 ) * 1000;

    // If an active Cooldown exists, show error. Otherwise, continue with executing Interaction
    if ( CooldownStartTimestamp != undefined ) {
        const ExpirationTime = CooldownStartTimestamp + CooldownAmount;

        if ( Now < ExpirationTime ) {
            let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

            // MINUTES
            if ( timeLeft >= 60 && timeLeft < 3600 ) {
                timeLeft = timeLeft / 60; // For UX
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SELECT_ERROR_COOLDOWN_MINUTES', timeLeft.toFixed(1))
                    }
                });
            }
            // HOURS
            else if ( timeLeft >= 3600 && timeLeft < 86400 ) {
                timeLeft = timeLeft / 3600; // For UX
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SELECT_ERROR_COOLDOWN_HOURS', timeLeft.toFixed(1))
                    }
                });
            }
            // DAYS
            else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 ) {
                timeLeft = timeLeft / 86400; // For UX
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SELECT_ERROR_COOLDOWN_DAYS', timeLeft.toFixed(1))
                    }
                });
            }
            // MONTHS
            else if ( timeLeft >= 2.628e+6 ) {
                timeLeft = timeLeft / 2.628e+6; // For UX
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SELECT_ERROR_COOLDOWN_MONTHS', timeLeft.toFixed(1))
                    }
                });
            }
            // SECONDS
            else {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SELECT_ERROR_COOLDOWN_SECONDS', timeLeft.toFixed(1))
                    }
                });
            }
        }
    }
    else {
        // Create new Cooldown
        UtilityCollections.SelectCooldowns.set(`${SelectName}_${interactionUser.id}`, Now);
        setTimeout(() => UtilityCollections.SelectCooldowns.delete(`${SelectName}_${interactionUser.id}`), CooldownAmount);
    }


    // Attempt to execute Interaction
    try { return await Select.Select.executeSelect(interaction, interactionUser); }
    catch (err) {
        console.error(err);
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'SELECT_ERROR_GENERIC')
            }
        });
    }
}
