module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Ettaweel',
        authors: 'Technox Education',
        exe: 'Ettaweel.exe',
        setupIcon: 'build/app_icon.ico', // Path to your icon file
        iconUrl: 'https://tq-box.com/public/app_icon.ico', // Required for Squirrel.Windows, host the icon somewhere accessible
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
