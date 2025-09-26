const admin = require("firebase-admin");

// Initialize with service account
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notification
export default function sendPushNotification(token, title, body) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: "chat",
      chatId: "123",
      userId: "456"
    },
    token: token, // FCM token from React Native app
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
}

