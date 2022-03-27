# Shutdown Alerter

`Shutdown Alerter` is a little extension for VSCode that monitors `/run/systemd/shutdown/scheduled` looking for scheduled shutdown and
reboot event.

If an event is found, a notification dialog is displayed, along with a status bar notification message giving the type of event and the scheduled time.

# File Format
The expected format of the notification file is:

```
USEC=1563976800000000
WARN_WALL=1
MODE=reboot
```
Anything other than this is not supported.

# Settings

| Setting               | Description                                     | Default                  |
|-----------------------|-------------------------------------------------|--------------------------|
| schedulePath          | Path to the systemd shutdown schedule directory | `/run/systemd/shutdown/` |
| scheduleFile          | The systemd shutdown file                       | `schedule`               |
| modalNotification     | Use a modal dialog for notifications            | `true`                   |
| popUpNotifications    | Use pop up notifications                        | `true`                   |
| useStatusBar          | Show notifications in the status bar            | `true`                   |

# Icons
Man with megaphone: https://pixabay.com/vectors/loudspeaker-man-boy-holding-1459128/
