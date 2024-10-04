const appLocales = {
    'en-GB': await import('../Locales/en-GB.cjs')
};
// Why the fuck is that import dumping the stuff under an extra DEFAULT object


/**
 * Localize responses using the Locale field given in Discord's Interactions
 * @param {String} locale 
 * @param {String} stringKey 
 * @param  {...any} params 
 * 
 * @returns {String} Localized String
 */
export function localize(locale, stringKey, ...params) {
    // Attempt to fetch localised string right away
    let localizedString = appLocales[locale]?.default[stringKey];

    // If no localised string is found (either because missing or language not supported yet), default to UK English
    if (!localizedString) {
        localizedString = appLocales['en-GB'].default[stringKey];
    }

    // Edge-case check - if string is STILL not found, return error handling string instead
    if (!localizedString) {
        localizedString = `Error: Localisation not found.`;
    }


    // For when params are given to add to the localised strings
    if (localizedString) { if (params.length > 0) { for (let i = 0; i < params.length; i++) {
        localizedString = localizedString.replace(`{{${i}}}`, params[i]);
    } } }

    // Return localised string
    return localizedString;
}
