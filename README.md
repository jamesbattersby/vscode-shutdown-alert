# Shutdown Watcher

`Shutdown Watcher` is a little extension for VSCode that monitors `/run/systemd/shutdown/scheduled` looking for scheduled shutdown and
reboot event.

If an event is found, a notification dialogue is displayed, along with a status bar notification message giving the type of event and the scheduled time.
