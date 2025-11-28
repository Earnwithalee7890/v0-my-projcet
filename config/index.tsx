import { cookieStorage, createStorage, createConfig, http } from "wagmi"
import { mainnet, base, arbitrum, celo } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { defineChain } from "viem"

// Custom Monad Testnet network
const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
})

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

export const networks = [base, mainnet, arbitrum, celo, monadTestnet] as const

export const config = createConfig({
  chains: networks,
  connectors: [injected()],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
})
