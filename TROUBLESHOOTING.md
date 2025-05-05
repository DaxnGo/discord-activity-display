# Troubleshooting Guide

This guide addresses common issues you might encounter when working with this Discord Activity Display application.

## Build Errors

### Next.js Compilation Errors

**Issue**: Errors related to Next.js compilation, such as:

```
Failed to compile
Module not found: C:\Users\[username]\package.json (directory description file): SyntaxError: C:\Users\[username]\package.json (directory description file): SyntaxError: Unexpected token '<', is not valid JSON
```

**Solution**:

1. Check if you have a `package.json` file in your user directory (`C:\Users\[username]\`) that might be corrupted
2. If it exists, fix the format or delete it if it's not needed
3. Run `npm init -y` in your user directory to create a valid package.json file
4. Ensure your project's package.json is valid and has the correct dependencies

### Image Component Errors

**Issue**: Errors when using Next.js Image component with external sources.

**Solution**:

1. Use standard HTML `<img>` tags instead of Next.js `Image` component for external sources
2. If you need to use the Image component, configure next.config.js:
   ```js
   // next.config.js
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: "https",
           hostname: "**",
         },
       ],
     },
   };
   ```

## Discord Integration Issues

### Lanyard API Not Working

**Issue**: Discord activity not showing or updating.

**Solution**:

1. Confirm you've joined the Lanyard Discord server: https://discord.gg/UrXF2cfJ7F
2. Verify your Discord ID is correct in the DiscordActivity.tsx file
3. Make sure you're not in "Invisible" mode on Discord
4. Check that "Display current activity as a status message" is enabled in Discord settings
5. If you're still having issues, check the console for API errors

### YouTube Background Issues

**Issue**: YouTube background video not playing or controls showing.

**Solution**:

1. Make sure the YouTube URL includes all the required parameters: `autoplay=1&mute=1&controls=0`
2. Some browsers block autoplay. Click somewhere on the page to enable interactions
3. Try a different YouTube video ID if one particular video causes issues
4. To debug, temporarily remove the `pointer-events-none` class from the iframe

## Styling Issues

### Tailwind Classes Not Applying

**Issue**: Tailwind CSS classes don't seem to work.

**Solution**:

1. Ensure your Tailwind configuration properly includes all your files:
   ```js
   // tailwind.config.js
   module.exports = {
     content: ["./src/**/*.{js,ts,jsx,tsx}"],
     // rest of config
   };
   ```
2. Make sure you've imported the Tailwind directives in your global CSS file
3. Try running `npm run build` to see if Tailwind generates all styles properly

### Dark Mode Toggle Not Working

**Issue**: Light/dark mode toggle doesn't change the appearance.

**Solution**:

1. Make sure you've properly set up the ThemeProvider from next-themes
2. Verify your CSS includes styles for both `.dark` and regular (light) mode
3. Check browser localStorage to see if a theme preference is being saved
4. Try clearing localStorage and reloading

## Installation Issues

### Dependencies Not Installing Correctly

**Issue**: `npm install` fails or dependencies seem to be missing.

**Solution**:

1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Try installing again with `npm install`
4. If specific packages cause issues, try installing them separately

### Node.js Version Compatibility

**Issue**: Errors suggesting incompatible Node.js version.

**Solution**:

1. Check your Node.js version with `node -v`
2. Use a Node.js version manager like nvm to install the recommended version (v16+)
3. Update your package.json to specify the required Node.js version:
   ```json
   "engines": {
     "node": ">=16.0.0"
   }
   ```

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the browser console for specific error messages
2. Look at the terminal output for server-side errors
3. Try running with verbose logging: `NODE_ENV=development npm run dev`
4. Consider opening an issue on GitHub with details about your problem
