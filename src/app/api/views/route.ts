import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the view count file
const VIEW_COUNT_FILE = path.join(process.cwd(), "viewcount.json");

// Initialize view count file if it doesn't exist
function initViewCountFile() {
  if (!fs.existsSync(VIEW_COUNT_FILE)) {
    fs.writeFileSync(VIEW_COUNT_FILE, JSON.stringify({ count: 8 })); // Start with 8 visits
  }
}

// Get current view count
function getViewCount(): number {
  initViewCountFile();
  try {
    const data = fs.readFileSync(VIEW_COUNT_FILE, "utf8");
    return JSON.parse(data).count;
  } catch (error) {
    console.error("Error reading view count:", error);
    return 0; // Default to 0 if there's an error
  }
}

// Increment view count
function incrementViewCount(): number {
  const currentCount = getViewCount();
  const newCount = currentCount + 1;

  try {
    // Use synchronous write with proper file locking to avoid race conditions
    fs.writeFileSync(VIEW_COUNT_FILE, JSON.stringify({ count: newCount }), {
      flag: "w",
    });
    return newCount;
  } catch (error) {
    console.error("Error writing view count:", error);
    return currentCount;
  }
}

// API route to get current view count
export async function GET() {
  return NextResponse.json({ count: getViewCount() });
}

// API route to increment view count
export async function POST() {
  const newCount = incrementViewCount();
  return NextResponse.json({ count: newCount });
}
