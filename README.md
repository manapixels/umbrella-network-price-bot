# Setup your own

1. Clone this repo
    ```
    git clone https://github.com/zhenyangg/umbrella-network-price-bot.git
    ```
2. Create your Discord bot [here](https://discord.com/developers/applications)
2. Set up environment variables:
    1. Create a .env file in the project root folder
    2. Input the following in the file:
        ```
        DISCORD_BOT_TOKEN=XXX
        UMBRELLA_API_KEY=XXX
        UMBRELLA_API_URL=https://api.dev.umb.network
        UMBRELLA_REGISTRY_CONTRACT_ADDRESS=XXX
        BLOCKCHAIN_PROVIDER_URL=https://kovan.infura.io/v3/YOUR_KEY_HERE
        ```
        - DISCORD_BOT_TOKEN [How to get](https://www.bitdegree.org/learn/how-to-make-a-discord-bot)
        - UMBRELLA_API_KEY [How to get](https://umbrella-network.readme.io/docs/api-token)
        - UMBRELLA_API_URL [Available networks](https://umbrella-network.readme.io/docs/developer-api)
        - BLOCKCHAIN_PROVIDER_URL [Get from infura](https://infura.io/)
3. Run
    ```
    node bot.js
    ```

<br/><br/>

# Or add my demo 😉

1. Go to https://discord.com/api/oauth2/authorize?client_id=868744432411873280&permissions=0&scope=bot
2. Add it to your server
3. Once added, the default ticker price shown will be BTC.

<br/><br/>
## Discord Bot Commands
### List supported tickers:

```
!tickers
```

### To change any supported ticker, e.g. ETH

```
!eth
```

![Demo animation](https://raw.githubusercontent.com/zhenyangg/umbrella-network-price-bot/master/demo.webp)