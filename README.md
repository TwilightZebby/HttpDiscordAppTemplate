A Discord App Template made by TwilightZebby for himself.

# LICENSE
The license for this project, as well as all other projects by TwilightZebby, can be [found here](https://github.com/TwilightZebby/license/blob/main/license.md).

---

# Setup Guide
*Assumes you've already cloned this, and have NodeJS v20*

1. Run `npm install` to install the dependencies defined in the `package.json` file.
2. Ensure you have the following directories/folders - as these are where this App will look for Commands & Interactions:
  - `./Commands/ContextCommands/`
  - `./Commands/SlashCommands/`
  - `./Commands/TextCommands/`
  - `./Interactions/Buttons/`
  - `./Interactions/Modals/`
  - `./Interactions/Selects/`
3. Create a `config.js` file ***in the root*** (ie: `./config.js`), with the following information (replacing strings with relevant data of course):

```js
// DO NOT LEAK TOKENS
export const DISCORD_TOKEN = 'APP-TOKEN';

/** User ID of the App this code is for - ie: the App's Bot User */
export const DISCORD_APP_USER_ID = 'APP-BOT-USER-ID';

/** User ID of the App's Developer */
export const APP_DEVELOPER_USER_ID = 'DEVS-USER-ID';

/** Prefix for classic style text-based Commands */
export const TEXT_COMMAND_PREFIX = 'TEXT-PREFIX';

/** Webhook ID for the Webhook in the above Logging Channel */
export const LOG_WEBHOOK_ID = 'WEBHOOK-ID';

/** Webhook's Token for the Webhook in the above Logginc Channel. DO NOT LEAK */
export const LOG_WEBHOOK_TOKEN = 'WEBHOOK-TOKEN';
```

---

## Deploying Slash & Context Commands
To make deploying Slash & Context Commands easier, a `./deployCommands.js` file is included.

Just tweak it to your liking, and run `node deployCommands.js` to run that file ONCE.

> [!NOTE]
> You do **NOT** need to keep this file running. You only need to run it ONCE to register, unregister, or edit Slash/Context Commands.

---

## Running the App
To bring the App online, simply run `node index.js` to start up the actual App!
