import nodeConfig from "config"

interface Config {
  dbConnectionString: string

  /** The value for the web app frontent. */
  frontendEndpoint: string

  /** The value for the telegram bot token. */
  botToken: string

  /** The port number the server will run on. */
  webServerPort: number

  /** The comission the casino gets on each victory */
  houseEdge: number

  /** Stripe token given by telegram */
  stripeToken: string
}

const config: Config = {
  botToken: nodeConfig.get<string>("botToken"),
  webServerPort: nodeConfig.get<number>("webServerPort"),
  frontendEndpoint: nodeConfig.get<string>("frontendEndpoint"),

  // ИСПРАВЛЕНО: Заменили 'mongodb' на '127.0.0.1'
  // Docker пробрасывает порт 27017 на ваш компьютер (localhost), поэтому подключаемся туда.
  dbConnectionString: `mongodb://root:example@127.0.0.1:27017/main?authSource=admin`,

  houseEdge: nodeConfig.get<number>("houseEdge"),
  stripeToken: nodeConfig.get<string>("stripeToken"),
}

export default config