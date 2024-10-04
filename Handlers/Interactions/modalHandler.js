import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { Modals } from '../../Utility/interactions.js';
import { JsonResponse } from '../../Utility/utilityMethods.js';


// *******************************
//  Exports

/**
 * Handles & Runs Buttons
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction 
 * 
 * @returns {JsonResponse}
 */
export async function handleModal(interaction) {
    // Grab modal's name from Custom ID
    const ModalName = interaction.data.custom_id.split("_").shift();
    const Modal = await Modals[ModalName]();

    // If no Modal found, return
    if ( !Modal ) { 
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'MODAL_ERROR_GENERIC')
            }
        });
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {import('discord-api-types/v10').APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Attempt to execute Interaction
    try { return await Modal.Modal.executeModal(interaction, interactionUser); }
    catch (err) {
        console.error(err);
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'MODAL_ERROR_GENERIC')
            }
        });
    }
}
