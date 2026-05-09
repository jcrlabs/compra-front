import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.jcrlabs.compra',
  appName: 'Compra',
  webDir: 'dist',
  server: {
    url: 'https://compra.jcrlabs.net',
    cleartext: false,
  },
  plugins: {
    SplashScreen: { launchShowDuration: 500, backgroundColor: '#111111' },
    StatusBar: { style: 'dark', backgroundColor: '#111111' },
  },
}

export default config
