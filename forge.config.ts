import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { MakerDMG } from '@electron-forge/maker-dmg';
import MakerWix from '@electron-forge/maker-wix';

const config: ForgeConfig = {
  buildIdentifier: 'prod',
  
  packagerConfig: {
    asar: true,
    name: 'unreallife_launcher',
    appBundleId: 'com.unreallife.launcher',
    executableName: 'UnrealLife - Launcher',
    icon: './src/images/icon.ico',
    extraResource: ['./src/images'],
    overwrite: true,
    
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Joaquinee',
          name: 'unreallife_launcher',
        },
        prerelease: false,
        tagPrefix: '',
        force: true
      },
    },
  ],
  rebuildConfig: {

  },
  makers: [
    new MakerSquirrel({
      name: 'unreallife_launcher',
      setupIcon: './src/images/icon.ico',
      iconUrl: 'https://raw.githubusercontent.com/Joaquinee/unreallife_launcher/master/src/images/icon.ico',
      authors: 'Joaquinee',
      title: 'UnrealLife Launcher', 
      skipUpdateIcon: true,
  }), 
  new MakerZIP({


  }, ['darwin']), 
  new MakerRpm({
      
      options: {
        name: 'unreallife_launcher',
        icon: './src/images/icon.ico',
        productName: 'UnrealLife Launcher',
        description: 'UnrealLife Launcher',
      }
  }),
   new MakerDeb({

      options: {
        name: 'unreallife_launcher',
        productName: 'UnrealLife Launcher',
        icon: './src/images/icon.png',
        description: 'UnrealLife Launcher',
      }

  }),
  new MakerDMG({
    name: 'unreallife_launcher',
    iconSize: 80,
    format: 'ULFO',
    icon: './src/images/icon.ico',
  }),
 
  ],
  
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      
      build: [
       
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
