import { InteractionResponseType } from 'discord-api-types/v10';
import { localize } from '../../Utility/localizeResponses.js';
import { SlashCommands } from '../../Utility/interactions.js';
import { JsonResponse } from '../../Utility/utilityMethods.js';


// *******************************
//  Exports

/**
 * Handles & Runs Autocompletes
 * @param {import('discord-api-types/v10').APIApplicationCommandAutocompleteInteraction} interaction 
 * 
 * @returns {JsonResponse}
 */
export async function handleAutocomplete(interaction) {
    const Command = await SlashCommands[interaction.data.name]();

    // If no Command found, return
    if ( !Command ) { 
        return new JsonResponse({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: [{ name: localize(interaction.locale, 'AUTOCOMPLETE_ERROR_GENERIC'), value: `INVALID_COMMAND_OPTION` }]
            }
        });
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {import('discord-api-types/v10').APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Attempt to execute interaction
    try { return await Command.SlashCommand.handleAutoComplete(interaction, interactionUser); }
    catch (err) {
        console.error(err);
        return new JsonResponse({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: [{ name: localize(interaction.locale, 'AUTOCOMPLETE_ERROR_GENERIC'), value: `AUTOCOMPLETE_ERROR` }]
            }
        });
    }
}
