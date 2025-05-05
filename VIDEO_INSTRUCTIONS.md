# How to Use a Local Video Background

This guide explains how to replace the YouTube background with your own downloaded video.

## Step 1: Prepare Your Video File

1. Download or create a video file you want to use as background
2. Recommended specifications:
   - Format: MP4 (most compatible)
   - Resolution: 1920x1080 or 1280x720
   - Duration: 10-30 seconds is ideal (it will loop)
   - File size: Keep under 10MB for better performance
   - Content: Subtle movements work best as backgrounds

## Step 2: Add the Video to Your Project

1. Place your video file in the `public/videos/` directory
   - Example: `public/videos/my-background.mp4`
   - Create the directory if it doesn't exist

## Step 3: Configure the Video Background

1. Open `src/app/page.tsx`
2. Find these configuration lines:
   ```tsx
   const localVideoPath = "/videos/background.mp4";
   const useLocalVideo = true;
   ```
3. Update `localVideoPath` to match your video filename
   - Example: `const localVideoPath = "/videos/my-background.mp4";`
4. Make sure `useLocalVideo` is set to `true`

## Step 4: Audio Options

- By default, the video will be muted
- To enable audio, find the `isMuted` state and set it to `false` initially:
  ```tsx
  const [isMuted, setIsMuted] = useState(false);
  ```
- The volume control buttons will still work to toggle audio

## Troubleshooting

If your video doesn't play:

1. Check the file path is correct
2. Verify the video format is supported by browsers (MP4 is most compatible)
3. Try a different video file to isolate the issue
4. Check browser console for errors

## Converting Videos

If you need to convert a video to a web-friendly format:

1. Use online tools like [CloudConvert](https://cloudconvert.com/)
2. Use desktop software like [HandBrake](https://handbrake.fr/) (free)
3. Recommended settings:
   - Format: MP4
   - Codec: H.264
   - Resolution: 1280x720 or lower for web
   - Bitrate: 1-2 Mbps for good quality/size balance
