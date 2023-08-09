import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'holsten.fair.rechnen',
  appName: 'FAIRechnen',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
