import { Platform } from 'react-native';
import FCM, { FCMEvent } from "react-native-fcm";

export function registerAppListener(navigation) {
  FCM.on(FCMEvent.Notification, notif => {
    console.log("Notification", notif);
    
    if (notif.opened_from_tray) {
      if (notif.targetScreen === "detail") {
        setTimeout(() => {
          navigation.navigate("Detail");
        }, 500);
      }      
    }

    if (Platform.OS === "ios") {
      //optional
      //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
      //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
      //notif._notificationType is available for iOS platfrom
      switch (notif._notificationType) {
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
          // this type of notificaiton will be called only when you are in foreground.
          // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
          break;
      }
    }
  });

  FCM.on(FCMEvent.RefreshToken, token => {
    console.log("TOKEN (refreshUnsubscribe)", token);
  });

  FCM.enableDirectChannel();
  FCM.on(FCMEvent.DirectChannelConnectionChanged, data => {
    console.log("direct channel connected" + data);
  });
  setTimeout(function() {
    FCM.isDirectChannelEstablished().then(d => console.log(d));
  }, 1000);
}
