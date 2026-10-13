const { AndroidConfig, withAndroidManifest, withAndroidStyles } = require('@expo/config-plugins');

// Keep these settings in CNG so clean EAS builds and school templates retain them.
module.exports = function withAndroidWindowCompatibility(config) {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifest);
    mainActivity.$['android:screenOrientation'] = 'unspecified';
    mainActivity.$['android:resizeableActivity'] = 'true';

    // expo-camera's Play Services scanner declares portrait in its library manifest.
    // Override that declaration in the merged manifest as well as our own activity.
    const scannerName = 'com.google.mlkit.vision.codescanner.internal.GmsBarcodeScanningDelegateActivity';
    let scanner = application.activity.find((activity) => activity.$['android:name'] === scannerName);
    if (!scanner) {
      scanner = { $: { 'android:name': scannerName } };
      application.activity.push(scanner);
    }
    scanner.$['android:screenOrientation'] = 'unspecified';
    const replacements = new Set((scanner.$['tools:replace'] || '').split(',').map((value) => value.trim()).filter(Boolean));
    replacements.add('android:screenOrientation');
    scanner.$['tools:replace'] = [...replacements].join(',');
    return config;
  });

  return withAndroidStyles(config, (config) => {
    // expo-splash-screen adds this legacy color even when edge-to-edge is enabled.
    // System bars are transparent; the app's safe-area background supplies the color.
    for (const style of config.modResults.resources.style || []) {
      if (style.$.name === 'AppTheme' && style.item) {
        style.item = style.item.filter((item) => item.$.name !== 'android:statusBarColor');
      }
    }
    return config;
  });
};
