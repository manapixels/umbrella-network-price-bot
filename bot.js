const logger = require('winston')
const Discord = require('discord.js')
const { ethers } = require('ethers')
const { ContractRegistry, ChainContract, APIClient } = require('@umb-network/toolbox')

//
// Inintialisation
//
require('dotenv').config()

const { 
    UMBRELLA_API_URL, 
    UMBRELLA_API_KEY,
    UMBRELLA_REGISTRY_CONTRACT_ADDRESS,
    BLOCKCHAIN_PROVIDER_URL,
} = process.env

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, { colorize: true })
logger.level = 'debug'


//
// Initialize Discord Bot
//
const client = new Discord.Client()

client.on('ready', function (evt) {
    logger.info('Connected')
    logger.info('Logged in as: ' + client.user.username)
    getPriceData()
    setInterval(getPriceData, 30000) // Get new data every 30 secs
})

client.on("message", message => {
    logger.info("message: ", message.content)
    if (message.content === '!tickers' || message.content === '!ticker') {
        if (Object.keys(priceData).length > 0) {
            let supportedTickers = Object.keys(priceData).map(ticker => ticker).join(', ')
            message.reply(`\n\nSupported tickers:\n\n ${supportedTickers}`)
        }
    }
    else if (message.content && message.content[0] === '!' && message.content.length > 1) {
        const symbol = message.content.replace("!", "").toUpperCase()
        const price = priceData && priceData[symbol]
        if (price) {
            message.reply(`Changed bot price to ${symbol}`)
            client.user.setActivity(`${symbol} $${price}`, { type: 'WATCHING' })
                .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
                .catch(error => {
                    logger.error(error)
                    message.reply(`Error changing activity`)
                })
        } else {
            message.reply(`Ticker not supported. Let us know if you want ${symbol} included 😉`)
        }
    }
})

//
// Fetch Price Data
//

let apiClient = undefined
let priceData = {}

async function setApiClient() {
    const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_PROVIDER_URL)
    const contractRegistry = new ContractRegistry(provider, UMBRELLA_REGISTRY_CONTRACT_ADDRESS)
    const chainContractAddress = await contractRegistry.getAddress('Chain')
    const chainContract = new ChainContract(provider, chainContractAddress)
    
    apiClient = new APIClient({
        baseURL: UMBRELLA_API_URL,
        chainContract,
        apiKey: UMBRELLA_API_KEY,
    })

    getPriceData()
}
async function getPriceData() {
    if (apiClient === undefined) {
        await setApiClient()
    }
    else if (apiClient && BLOCKCHAIN_PROVIDER_URL && UMBRELLA_REGISTRY_CONTRACT_ADDRESS && UMBRELLA_API_KEY) {
        logger.info("Fetching price data...")
        const getNewestBlockResult = await apiClient.getNewestBlock()
        const getLeavesOfBlockResult = await apiClient.getLeavesOfBlock(getNewestBlockResult.blockId);

        let formattedResult = []
        for (let i=0; i<getLeavesOfBlockResult.length; i++) {
            const ticker = getLeavesOfBlockResult[i]
            // Store only USD values
            if (ticker.key.includes('-USD')) {
                formattedResult.push({
                    symbol: ticker.key.replace('-USD', ''),
                    value: ticker.value && parseFloat(ethers.utils.formatEther( ticker.value ))
                })
            }
        }
        formattedResult
            .map( j => {
                priceData[j.symbol] = j.value
            })
        logger.info(priceData)

        
        // Set default ticker to BTC if none is found

        if (client.user.presence && client.user.presence.activities && client.user.presence.activities.length === 0) {
            client.user.setActivity(`BTC $${priceData['BTC']}`, { type: 'WATCHING' })
                .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
                .catch(error => {
                    logger.error(error)
                    message.reply(`Error changing activity`)
                })
        }
    }
}

client.login(process.env.CLIENT_TOKEN)