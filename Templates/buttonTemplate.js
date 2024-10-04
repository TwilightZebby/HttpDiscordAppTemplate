import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { JsonResponse } from '../Utility/utilityMethods.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "buttonName",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Button's Description",

    /** Button's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 3,

    /** Runs the Button
     * @param {import('discord-api-types/v10').APIMessageComponentButtonInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     */
    async executeButton(interaction, interactionUser) {
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "This Button has not yet been implemented yet!"
            }
        });
    }
}
