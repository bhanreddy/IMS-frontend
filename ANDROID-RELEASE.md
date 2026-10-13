# Android release configuration

This project uses Expo SDK 54, React Native 0.81.5, Hermes, and EAS Build with
Continuous Native Generation. `android/` and `ios/` are generated and ignored by
Git. Keep release settings in `app.json` and `app.template.json` so school-build
scripts and clean prebuilds retain them.

## Play Console recommendations for release 21 (5.1.9)

Both configs use `orientation: "default"`. The
`plugins/withAndroidWindowCompatibility.js` plugin sets MainActivity's orientation
to `unspecified` and `resizeableActivity` to `true`. It also overrides the portrait
orientation declared by
`com.google.mlkit.vision.codescanner.internal.GmsBarcodeScanningDelegateActivity`
in Expo Camera's Play Services dependency. The scanner override uses
`tools:replace="android:screenOrientation"` so the library manifest cannot restore
the portrait lock during merging.

Expo SDK 54 already enables edge-to-edge. App StatusBar components now set icon
style without the deprecated `backgroundColor` and `translucent` props. The plugin
also removes the legacy `android:statusBarColor` item added to AppTheme by the
splash-screen plugin. The existing school ribbon and safe-area backgrounds paint
behind the system bars.

This addresses the app-owned settings, but does **not** guarantee that Play's
deprecated-API recommendation disappears. The reported calls also exist inside
React Native 0.81.5 (`StatusBarModule`, `WindowUtilKt`), React Native Screens,
Material dialogs, and Expo Image Picker. Removing JavaScript props does not remove
those native methods from the binary. Expo SDK 54 has a matching
[upstream report](https://github.com/expo/expo/issues/47323). Follow compatible
upstream fixes and recheck the next AAB's exact findings; changing app config alone
cannot remove all these library calls. Keep edge-to-edge enabled. R8 is configured separately with the Expo record
annotation protection described below; it does not replace these UI fixes.

Verify before publishing:

- Run `npx expo prebuild --platform android --no-install` and inspect the generated
  manifest and AppTheme. Native directories are ignored, so keep fixes in the
  configs and plugin rather than editing generated files.
- Run `:app:processReleaseMainManifest` and inspect the merged release manifest.
  Both reported activities must use `screenOrientation="unspecified"`, and
  MainActivity must use `resizeableActivity="true"`.
- On Android 16 and an earlier supported Android version, test phone/tablet
  rotation, fold/unfold, split-screen resizing, gesture and three-button navigation,
  keyboard-open forms, dialogs, login, and barcode scanning. Check content near
  cutouts and system bars and confirm form state survives resizing.
- Build and upload a new store AAB using `school-17-production` after device
  validation. EAS `autoIncrement` supplies the next version code. These native
  manifest changes cannot be delivered by OTA; Play's findings for release 21
  remain attached to that uploaded binary.

## R8 optimization with SecureStore compatibility

Android release minification and resource shrinking are enabled in `app.json`
and `app.template.json`. `plugins/withAndroidReleaseOptimization.js` selects
`proguard-android-optimize.txt` during prebuild so SDK 54's default
`-dontoptimize` does not disable logical optimization.

### Why the extra keep rule is required

Release 3.1.2 (20) failed to read saved sessions after R8 was enabled:

```text
The 2nd argument cannot be cast to type expo.modules.securestore.SecureStoreOptions
(received class com.facebook.react.bridge.ReadableNativeMap)
Caused by: java.lang.NullPointerException
```

Release 5.1.9 disabled shrinking as a workaround. Expo Modules Core 3.0.30
already keeps classes implementing `Record`, including `SecureStoreOptions`,
but does not keep the `Field` annotation used by its reflection-based converter.
Both build configs now backport the focused protection from
[Expo PR #51206](https://github.com/expo/expo/pull/51206):

```proguard
-keep @interface expo.modules.kotlin.records.Field { *; }
```

The rule is supplied through `expo-build-properties.android.extraProguardRules`;
there are no edits to installed packages. Keep this rule until the compatible
Expo dependency includes the upstream fix and release upgrade testing passes.
`withAndroidSounds.js` retains custom notification sounds referenced by name
when resource shrinking runs.

### Session preservation and release validation

This build change does not modify the application ID, signing credentials,
SecureStore service/keys, session format, or authentication logic. Use the same
EAS project and Play app signing identity to update existing installations.
Never uninstall the app or clear its data as part of an upgrade test: that
would destroy the saved state the test must verify.

1. Run the session regression tests:
   `npx jest --runInBand src/services/secureTokenStore.test.ts src/services/authService.security.test.ts src/hooks/useAuth.session.test.tsx src/services/biometricService.test.ts src/services/fingerprintGate.test.ts`.
   These cover existing session formats, transient storage failures, token
   rotation, explicit logout, and biometric state. SecureStore is mocked in
   these tests, so they do not establish native R8 compatibility by themselves.
2. Run `npx expo prebuild --platform android --no-install`. Confirm generated
   `android/gradle.properties` has both `android.enableMinifyInReleaseBuilds=true`
   and `android.enableShrinkResourcesInReleaseBuilds=true`; confirm the app
   Gradle file uses `proguard-android-optimize.txt` and its ProGuard rules include
   the `Field` keep rule.
3. Build a release APK for local/device validation. Confirm
   `:app:minifyReleaseWithR8` runs and the merged R8 configuration and mapping
   retain the `Field` annotation and `SecureStoreOptions` members.
4. For a production-session upgrade test, upload the candidate store AAB to
   Play internal testing and update a device with an existing signed-in Play
   installation. An APK signed with the local debug/upload key cannot replace
   a Play-installed app signed with a different Play app signing key.
5. Verify the existing account remains signed in after update, force-stop,
   restart, and an offline launch. Verify fresh login, explicit logout,
   token refresh, biometric login, camera/image picker, notifications with
   custom sounds, and background bus tracking. Check native logs for options
   conversion failures. Do not ship if any of these regress.
6. Check the actual uploaded AAB's DEX size and Google Play obfuscation,
   shrinking, and optimization percentages. Enabling R8 alone does not prove
   all Play thresholds are met. Release 21's findings remain attached to its
   old binary.

### Verification on 2026-10-13

- All 128 tests in the five session/storage/biometric suites above passed.
- Expo Android prebuild passed. The Gradle plugin was checked against the
  generated template, including repeated application and unsupported-template
  failures. Both configs retain their prior app identity and update settings.
- Local ARM64 `:app:assembleRelease` passed with R8 and resource shrinking
  enabled. The final R8 mapping keeps `expo.modules.kotlin.records.Field` and
  `SecureStoreOptions` unrenamed; the merged configuration contains the
  annotation keep rule and no global `-dontoptimize`, `-dontobfuscate`, or
  `-dontshrink` flags.
- The APK resource table and archive retain all eight custom notification
  sounds. APK size is 68.63 MiB; uncompressed DEX totals 11.49 MiB. These sizes
  are local build observations, not Play Console optimization scores.
- Native runtime and existing-session upgrade verification remain pending.
  No device was connected and the isolated emulator could not start because
  the Mac had insufficient free disk space. A successful build and mocked
  storage tests do not prove that every installed session survives an update.
- The local APK uses the generated debug signing configuration and is for
  local testing only. No EAS build, Play upload, or production rollout was run.

## Release build

From `SchoolIMS-Frontend`, use the existing school-specific build profiles.
EAS `autoIncrement` assigns the next Android version code. Preserve the
existing signing identity and increment the user-facing version as appropriate.

```bash
npx eas-cli build --platform android --profile school-17-production-apk --clear-cache
```

After local/device validation, create the store bundle:

```bash
npx eas-cli build --platform android --profile school-17-production --clear-cache
```

These are native binary changes and require a new APK/AAB; an OTA update cannot
change the installed R8 output. Promote the internally tested AAB to production
only after the existing-session upgrade and Play metrics have been checked.
