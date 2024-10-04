import { InteractionContextType, PermissionFlagsBits } from 'discord-api-types/v10';
import { DISCORD_TOKEN } from '../config.js';


// *******************************
//  Exports

/**
 * Checks the Tag/Discrim of the given APIUser, to see if they're on the new Username System or not.
 * 
 * Note: This shouldn't be used as much now that all non-App/Bot Users HAVE been fully migrated at this point
 * @param {import('discord-api-types/v10').APIUser} user 
 * 
 * @returns {Boolean} True if on the new Username System
 */
export function checkPomelo(user) {
    if ( user.discriminator === '0' ) { return true; }
    else { return false; }
}

/**
 * Checks if the App can use External Server Emojis in its Interaction responses
 * @param {import('discord-api-types/v10').APIInteraction} interaction 
 * 
 * @returns {Boolean} True if App does have USE_EXTERNAL_EMOJIS Permission
 */
export function checkExternalEmojiPermission(interaction) {
    let hasPermission = false;
    let appPermissions = BigInt(interaction.app_permissions);

    if ( (appPermissions & PermissionFlagsBits.UseExternalEmojis) == PermissionFlagsBits.UseExternalEmojis ) { hasPermission = true; }

    return hasPermission;
}

/**
 * Convert raw Guild Feature Flags into title case
 * @param {String} featureFlag
 * 
 * @returns {String}
 */
export function titleCaseGuildFeature(featureFlag) {
    return featureFlag.toLowerCase()
    .replace(/guild/, "server")
    .split("_")
    .map(subString => subString.charAt(0).toUpperCase() + subString.slice(1))
    .join(" ");
}

/**
 * Helper method for seeing if an interaction was triggered in a Guild App or User App context
 * @param {import('discord-api-types/v10').APIInteraction} interaction
 * 
 * @returns {'GUILD_CONTEXT'|'USER_CONTEXT'} Context this was triggered in
 */
export function getInteractionContext(interaction) {
    if ( interaction.context === InteractionContextType.Guild ) { return 'GUILD_CONTEXT'; }
    else { return 'USER_CONTEXT'; }
}

// Json Response Class
export class JsonResponse extends Response {
    constructor(body, init) {
        const jsonBody = JSON.stringify(body);
        init = init || {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bot ${DISCORD_TOKEN}`,
            },
        };
        super(jsonBody, init);
    }
}
