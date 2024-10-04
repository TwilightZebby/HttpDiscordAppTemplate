import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { JsonResponse } from '../Utility/utilityMethods.js';


export const Modal = {
    /** The Modals's name - set as the START of the Modal's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "modalName_extraData"
     * @type {String}
     */
    name: "modalName",

    /** Modal's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Modal's Description",

    /** Runs the Modal
     * @param {import('discord-api-types/v10').APIModalSubmitInteraction|import('discord-api-types/v10').APIModalSubmitGuildInteraction|import('discord-api-types/v10').APIModalSubmitDMInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     */
    async executeModal(interaction, interactionUser) {
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "This Input Modal has not yet been implemented yet!"
            }
        });
    }
}
