import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { UtilityCollections } from '../../Utility/utilityConstants.js';
import { localize } from '../../Utility/localizeResponses.js';
import { SlashCommands } from '../../Utility/interactions.js';
import { JsonResponse } from '../../Utility/utilityMethods.js';


// *******************************
//  Exports

/**
 * Handles & Runs Slash Commands
 * @param {import('discord-api-types/v10').APIChatInputApplicationCommandInteraction} interaction 
 * 
 * @returns {JsonResponse}
 */
export async function handleSlashCommand(interaction) {
    const Command = await SlashCommands[interaction.data.name]();

    // If no Command found, return
    if ( !Command ) { 
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_GENERIC')
            }
        });
    }


    // Throw Command name into its own variable, so we can handle subcommand and group specific cooldowns easier
    const CheckSubcommand = interaction.data.options?.find(option => option.type === ApplicationCommandOptionType.Subcommand);
    const CheckCommandGroup = interaction.data.options?.find(option => option.type === ApplicationCommandOptionType.SubcommandGroup);
    let commandName = "";
    let isSubcommand = false;
    let isGroupCommand = false;

    // Both Group & Subcommand are present
    if ( CheckCommandGroup != undefined && CheckSubcommand != undefined ) {
        commandName = `${interaction.data.name}_${CheckCommandGroup.name}_${CheckSubcommand.name}`;
        isSubcommand = true;
        isGroupCommand = true;
    }
    // Subcommand is present, Group is not
    else if ( CheckCommandGroup == undefined && CheckSubcommand != undefined ) {
        commandName = `${interaction.data.name}_${CheckSubcommand.name}`;
        isSubcommand = true;
    }
    // HIGHLY DOUBT this is even possible, but just in case: Group is present, Subcommand is not
    if ( CheckCommandGroup != undefined && CheckSubcommand == undefined ) {
        commandName = `${interaction.data.name}_${CheckCommandGroup.name}`;
        isGroupCommand = true;
    }
    // Neither Subcommand nor Group are present
    else {
        commandName = `${interaction.data.name}`;
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {import('discord-api-types/v10').APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Cooldown Checks
    // Set initial values
    const Now = Date.now();
    const CooldownStartTimestamp = UtilityCollections.SlashCooldowns.get(`${commandName}_${interactionUser.id}`);
    const CooldownAmount = isGroupCommand || isSubcommand ? ( Command.SlashCommand.subcommandCooldown[commandName] || 3 ) * 1000
        : ( Command.SlashCommand.cooldown || 3 ) * 1000;

    // If an active Cooldown exists, show error. Otherwise, continue with executing Command
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
                        content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_COOLDOWN_MINUTES', timeLeft.toFixed(1))
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
                        content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_COOLDOWN_HOURS', timeLeft.toFixed(1))
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
                        content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_COOLDOWN_DAYS', timeLeft.toFixed(1))
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
                        content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_COOLDOWN_MONTHS', timeLeft.toFixed(1))
                    }
                });
            }
            // SECONDS
            else {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_COOLDOWN_SECONDS', timeLeft.toFixed(1))
                    }
                });
            }
        }
    }
    else {
        // Create new Cooldown
        UtilityCollections.SlashCooldowns.set(`${commandName}_${interactionUser.id}`, Now);
        setTimeout(() => UtilityCollections.SlashCooldowns.delete(`${commandName}_${interactionUser.id}`), CooldownAmount);
    }


    // Attempt to execute Command
    try { return await Command.SlashCommand.executeCommand(interaction, interactionUser, commandName); }
    catch (err) {
        console.error(err);
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: localize(interaction.locale, 'SLASH_COMMAND_ERROR_GENERIC')
            }
        });
    }
}
