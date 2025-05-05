# Setting Up Real-Time Discord Activity

This website uses the [Lanyard API](https://github.com/Phineas/lanyard) to display your real-time Discord status, including your current activity, game status, Spotify listening data, and more.

## How to Set Up

1. **Find Your Discord User ID**

   - Open Discord
   - Go to Settings > Advanced > Turn on Developer Mode
   - Right-click on your name in any message or in the user list and click "Copy ID"

2. **Update Your Code**

   - Open `src/components/DiscordActivity.tsx`
   - Replace the placeholder `YOUR_DISCORD_ID` with your actual Discord user ID:
     ```typescript
     const DISCORD_ID = "123456789012345678"; // Your Discord ID here
     ```

3. **Join the Lanyard Discord Server**

   - Lanyard requires you to join their Discord server to monitor your status
   - Join the Lanyard Discord server: https://discord.gg/UrXF2cfJ7F

4. **Test Your Integration**
   - Start your development server with `npm run dev`
   - Open the website and your Discord status should appear in real-time
   - If you change your activity on Discord (play a game, listen to Spotify, etc.), it should update on your site within 15 seconds

## Troubleshooting

If your Discord status isn't showing:

1. Make sure you've joined the Lanyard Discord server
2. Confirm your Discord ID is correct
3. Ensure your Discord status is not set to "Invisible"
4. Check that you have "Display current activity as a status message" enabled in Discord settings
5. If you're still having issues, the site will fall back to the default mock data

## Advanced Usage

The Lanyard API provides detailed information about your Discord status. You can customize the display by modifying the `DiscordActivity.tsx` component to show different information or styling.

For more information, check out the [Lanyard API documentation](https://github.com/Phineas/lanyard).
