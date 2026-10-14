const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

// expo-audio declares a media playback foreground service in its library
// manifest. Remove the component as well as blocking its permission in app.json.
// In-app playback uses AudioPlayer directly and never enables lock-screen controls.
module.exports = function withAndroidForegroundAudioOnly(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const serviceName = 'expo.modules.audio.service.AudioControlsService';
    application.service = (application.service || []).filter(
      (service) => service.$['android:name'] !== serviceName
    );
    application.service.push({
      $: { 'android:name': serviceName, 'tools:node': 'remove' },
    });
    return config;
  });
};
