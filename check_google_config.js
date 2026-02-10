console.log("--- Google OAuth Configuration Check ---");
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error("❌ ERROR: REACT_APP_GOOGLE_CLIENT_ID is not set in your environment.");
  console.log("Please create a .env file in supermarket-frontend/ and add:");
  console.log("REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here");
} else if (clientId === "YOUR_GOOGLE_CLIENT_ID") {
  console.error("❌ ERROR: You are still using the placeholder 'YOUR_GOOGLE_CLIENT_ID'.");
  console.log("Please replace it with your actual Client ID from Google Cloud Console.");
} else {
  console.log("✅ REACT_APP_GOOGLE_CLIENT_ID is set to: " + clientId);
  if (!clientId.endsWith(".apps.googleusercontent.com")) {
    console.warn("⚠️ WARNING: Your Client ID usually ends with '.apps.googleusercontent.com'. Please double-check it.");
  }
}
console.log("---------------------------------------");
