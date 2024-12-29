// ReownAppKitProvider.tsx
import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// wagmi / viem
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'

// 1) queryClient
const queryClient = new QueryClient()

// 2) projectId с https://cloud.reown.com (или docs)
const projectId = '0a3322884659683f2e0f1caf0a7f575d'

// 3) metadata (домен, иконка)
const metadata = {
  name: 'GameFrog',
  description: 'DApp with Reown AppKit',
  url: 'https://gamefrog.vip', 
  icons: ['https://example.com/logo.png'],
}

// 4) Сети
const networks = [mainnet, arbitrum, sepolia]

// 5) Создаём WagmiAdapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false, 
})

// 6) Регистрируем AppKit (внутри создаст Web3Modal)
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})

// 7) Обёртка React
export function ReownAppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
