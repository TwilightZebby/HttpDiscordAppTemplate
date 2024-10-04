import { InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { isChatInputApplicationCommandInteraction, isContextMenuApplicationCommandInteraction, isMessageComponentButtonInteraction, isMessageComponentSelectMenuInteraction } from 'discord-api-types/utils';
import { AutoRouter } from 'itty-router';
import { verifyKey } from 'discord-interactions';

import { handleSlashCommand } from './Handlers/Commands/slashCommandHandler.js';
import { handleContextCommand } from './Handlers/Commands/contextCommandHandler.js';
import { handleButton } from './Handlers/Interactions/buttonHandler.js';
import { handleSelect } from './Handlers/Interactions/selectHandler.js';
import { handleAutocomplete } from './Handlers/Interactions/autocompleteHandler.js';
import { handleModal } from './Handlers/Interactions/modalHandler.js';
import { DISCORD_APP_PUBLIC_KEY, DISCORD_APP_USER_ID } from './config.js';
import { JsonResponse } from './Utility/utilityMethods.js';









// *******************************
// Create Router
const router = AutoRouter();


/** Wave to verify CF worker is working */
router.get('/', (request, env) => {
    return new Response(`👏 ${DISCORD_APP_USER_ID}`);
});









// *******************************
/** Main route for all requests sent from Discord. They will include a JSON payload */
router.post('/', async (request, env) => {
    // Verify request
    const { isValid, interaction } = await server.verifyDiscordRequest(request, env);
    
    if ( !isValid || !interaction ) {
        return new Response('Bad request signature.', { status: 401 });
    }


    // Handle PING Interaction
    if ( interaction.type === InteractionType.Ping ) {
        return new JsonResponse({ type: InteractionResponseType.Pong });
    }

    // Now split off & handle each Interaction type
    if ( isChatInputApplicationCommandInteraction(interaction) ) {
        return await handleSlashCommand(interaction);
    }
    else if ( isContextMenuApplicationCommandInteraction(interaction) ) {
        return await handleContextCommand(interaction);
    }
    else if ( isMessageComponentButtonInteraction(interaction) ) {
        return await handleButton(interaction);
    }
    else if ( isMessageComponentSelectMenuInteraction(interaction) ) {
        return await handleSelect(interaction);
    }
    else if ( interaction.type === InteractionType.ApplicationCommandAutocomplete ) {
        return await handleAutocomplete(interaction);
    }
    else if ( interaction.type === InteractionType.ModalSubmit ) {
        return await handleModal(interaction);
    }
    else {
        console.info(`****Unrecognised or new unhandled Interaction Type triggered: ${interaction.type}`);
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
});

router.all('*', () => new Response('Not Found.', { status: 400 }));









// *******************************
async function verifyDiscordRequest(request, env) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    const isValidRequest =
      signature &&
      timestamp &&
      (await verifyKey(body, signature, timestamp, DISCORD_APP_PUBLIC_KEY));
    if (!isValidRequest) {
      return { isValid: false };
    }
  
    return { interaction: JSON.parse(body), isValid: true };
}
  
const server = {
    verifyDiscordRequest,
    fetch: router.fetch,
};

export default server;
