// sendPushNotification.js
const admin = require("firebase-admin");

// Initialize with service account
const serviceAccount = require("./firebaseServiceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Function to send notification
function sendPushNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: "chat",
      chatId: "123",
      userId: "456",
    },
    android: {
      priority: "high", // important for delivery
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          alert: {
            title: title,
            body: body,
          },
          sound: "default", // ensures sound/alert
        },
      },
    },
  };

  return admin.messaging().send(message)
    .then((response) => {
      console.log(`Notification sent to ${token}:`, response);
    })
    .catch((error) => {
      console.error(`Error sending notification to ${token}:`, error);
    });
}

module.exports = sendPushNotification;
