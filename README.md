# 🧙‍♂️ Discord Activity Display

A visually rich, anime-inspired single-page app showcasing your Discord activity in real-time with background music.

![image](https://github.com/user-attachments/assets/de047b82-c904-45ec-9310-b0909b90b41d)

## 🌟 Features

- 🎮 Real-time Discord activity display using the Lanyard API
- 🎵 Anime-inspired design with smooth animations
- 💻 Responsive and mobile-friendly

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/discord-activity-display.git
   cd discord-activity-display
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🔌 Discord Activity Setup

To display your real-time Discord activity:

1. **Get your Discord ID**:

   - Enable Developer Mode in Discord settings
   - Right-click on your profile and select "Copy ID"

2. **Join the Lanyard Discord server**:

   - Join https://discord.gg/UrXF2cfJ7F

3. **Update the configuration**:
   - Open `src/components/DiscordActivity.tsx`
   - Replace `YOUR_DISCORD_ID` with your actual Discord ID

See [DISCORD_SETUP.md](DISCORD_SETUP.md) for detailed instructions.

## 🛠️ Troubleshooting

If you encounter build errors:

1. **Next.js version issues**:

   - Make sure your Next.js version is correct in package.json
   - This project uses Next.js 13.5.6 for compatibility

2. **Image component errors**:

   - If you get errors with the Image component, use standard `<img>` tags instead
   - Configure next.config.js with the proper domains for images

3. **Missing dependencies**:

   - Run `npm install` to ensure all dependencies are properly installed

4. **Package.json errors**:
   - If you see errors about package.json, make sure there are no invalid characters
   - Run `npm init -y` in your user directory if needed

For more detailed troubleshooting, see our [troubleshooting guide](TROUBLESHOOTING.md).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Lanyard API](https://github.com/Phineas/lanyard) for Discord activity data
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

## How to Use Local Video Background

1. Place your video file in the `public/videos/` directory
2. Supported video formats: MP4, WebM, Ogg
3. Update the video path in `src/app/page.tsx`:

```tsx
const localVideoPath = "/videos/your-video-filename.mp4";
const useLocalVideo = true;
```

4. For best performance, optimize your video:
   - Resolution: 1920x1080 or lower
   - Codec: H.264
   - File size: Under 10MB if possible
   - Duration: 10-30 seconds (will loop automatically)

### Tips for Video Background

- Keep the video simple with subtle movements
- Use darker videos to ensure text remains readable
- If your video has audio, set `isMuted={false}` to enable sound
