# Shutdown Alerter
`Shutdown Alerter` is a little extension for VSCode that monitors `/run/systemd/shutdown/scheduled` looking for scheduled shutdown and
reboot events.

If an event is found, a notification dialog is displayed, along with a status bar notification message giving the type of event and the scheduled time.

# Motivation
When ssh'd in to a Linux machine, if a shutdown or reboot event is triggered there is a broadcast notification is shown on the ssh terminal.  However,
if connected via VSCode the notification isn't shown.  This extension monitors the shutdown schedule file and provides a notification.

# File Format
The expected format of the notification file is:

```
USEC=1563976800000000
WARN_WALL=1
MODE=reboot
```
Anything other than this is not supported.

### Example modal
![Example Modal](https://raw.githubusercontent.com/jamesbattersby/vscode-shutdown-alert/main/images/shutdown-modal.png)

### Example notification
![Example Notification](https://raw.githubusercontent.com/jamesbattersby/vscode-shutdown-alert/main/images/shutdown-notification.png)

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
