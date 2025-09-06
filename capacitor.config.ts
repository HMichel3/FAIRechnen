import { CapacitorConfig } from '@capacitor/cli'
import { Style } from '@capacitor/status-bar'

const config: CapacitorConfig = {
  appId: 'holsten.fair.rechnen',
  appName: 'FAIRechnen',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    EdgeToEdge: {
      backgroundColor: '#1f1f1f', // --ion-toolbar-background
    },
    StatusBar: {
      style: Style.Dark,
      backgroundColor: '#1f1f1f', // --ion-toolbar-background
    },
  },
  android: {
    adjustMarginsForEdgeToEdge: 'force', // Helps layout compensate correctly
  },
}

export default config
