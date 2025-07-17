import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

// Hyperion Testnet configuration
export const hyperionTestnet: Chain = {
  id: 133717,
  name: 'Hyperion Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tMetis',
    symbol: 'tMetis',
  },
  rpcUrls: {
    default: {
      http: ['https://hyperion-testnet.metisdevops.link'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperion Testnet Explorer',
      url: 'https://hyperion-testnet-explorer.metisdevops.link',
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'Consentra',
  projectId: '2f45349ae455b4e38362aeaff3d3ff7b', // Placeholder project ID
  chains: [hyperionTestnet],
  ssr: false,
});