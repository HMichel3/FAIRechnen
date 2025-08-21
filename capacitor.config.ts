import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'holsten.fair.rechnen',
  appName: 'FAIRechnen',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffffff',
      overlaysWebView: false,
    },
  },
}

export default config
