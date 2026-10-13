const { withAppBuildGradle } = require('@expo/config-plugins');

// SDK 54's default file contains -dontoptimize. Keep this change in CNG so
// clean EAS builds use R8 optimization, together with app.json's Field keep rule.
module.exports = function withAndroidReleaseOptimization(config) {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults;
    if (gradle.language !== 'groovy') {
      throw new Error('withAndroidReleaseOptimization expects the Expo Groovy build.gradle template.');
    }
    const defaultFile = /getDefaultProguardFile\(\s*(['"])proguard-android(?:-optimize)?\.txt\1\s*\)/g;
    if (!defaultFile.test(gradle.contents)) {
      throw new Error('Cannot find the default ProGuard file; review the Android release configuration.');
    }
    gradle.contents = gradle.contents.replace(
      defaultFile,
      'getDefaultProguardFile("proguard-android-optimize.txt")'
    );
    return config;
  });
};
