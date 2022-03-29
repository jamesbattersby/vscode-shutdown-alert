import { existsSync, readFileSync } from 'fs';
import {
    Disposable, window, FileSystemWatcher, workspace, Uri,
    ExtensionContext, StatusBarItem, StatusBarAlignment, RelativePattern
} from 'vscode';


class StatusBarNotification implements Disposable {
    private _watcher: FileSystemWatcher | undefined;
    private _notificationStatusBar: StatusBarItem;
    private _monitorPath: string = "";
    private _monitorFile: string = "";

    public constructor() {
        this._notificationStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, 100);
        this.settingsUpdated(true);
    }

    private _registerWatcherNotifications() {
        this._watcher?.onDidChange(uri => { this._shutdownUpdated(); });
        this._watcher?.onDidCreate(uri => { this._shutdownUpdated(); });
        this._watcher?.onDidDelete(uri => { this._shutdownCancelled(); });
    }

    private _shutdownUpdated(statusBarOnly: Boolean = false) {
        if (existsSync(`${this._monitorPath}${this._monitorFile}`)) {
            let theTime: String = "";
            let mode: String = "";
            let schedule: String = readFileSync(`${this._monitorPath}${this._monitorFile}`).toString();
            let lines: String[] = schedule.split("\n");
            lines.forEach(line => {
                if (line.toUpperCase().startsWith("USEC")) {
                    let microSeconds: String = line.split("=")[1];
                    var theDate: Date = new Date(parseInt(microSeconds.toString(), 10) / 1000);
                    theTime = theDate.toISOString();
                }
                else if (line.toUpperCase().startsWith("MODE")) {
                    mode = line.split("=")[1];
                }
            });
            let message: String = "";
            let statusBarMessage: String = "";
            let settings = workspace.getConfiguration('shutdown-alert');
            let modalNotification: boolean = settings.get("modalNotification", true);
            let popUpNotifications: boolean = settings.get("popUpNotifications", true);
            let useStatusBar: boolean = settings.get("useStatusBar", true);
            if (theTime !== "" && mode !== "") {
                message = `${mode} scheduled for ${theTime}.\nUse shutdown -c to cancel.`;
                statusBarMessage = `$(megaphone) ${mode} @ ${theTime}`;
                if (popUpNotifications && !statusBarOnly) {
                    window.showWarningMessage(`${message}`, { modal: modalNotification });
                }
            }
            if (useStatusBar) {
                this._notificationStatusBar.tooltip = `${message}`;
                this._notificationStatusBar.text = `${statusBarMessage}`;
                this._notificationStatusBar.show();
            }
        } else {
            this._shutdownCancelled();
        }
    }

    private _shutdownCancelled() {
        this._notificationStatusBar.hide();
    }

    settingsUpdated(init: Boolean = false) {
        const settings = workspace.getConfiguration('shutdown-alert');
        this._monitorPath = settings.get("schedulePath", "/run/systemd/shutdown/");
        this._monitorFile = settings.get("scheduleFile", "scheduled");
        if (this._watcher) {
            this._watcher.dispose();
        }
        if (!this._monitorPath.endsWith("/")) {
            this._monitorPath += "/";
        }
        this._watcher = workspace.createFileSystemWatcher(new RelativePattern(Uri.file(this._monitorPath), `**/${this._monitorFile}`));
        this._registerWatcherNotifications();
        if (!init) {
            if (!settings.get("useStatusBar", true)) {
                this._notificationStatusBar.hide();
            }
        }
        this._shutdownUpdated(!init);
    }

    dispose() {
        this._watcher?.dispose();
        this._notificationStatusBar.hide();
        this._notificationStatusBar.dispose();
    }
}

export function activate(context: ExtensionContext) {
    const statusBar: StatusBarNotification = new StatusBarNotification();
    context.subscriptions.push(statusBar);
    // Register actions on configuration change
    context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
        statusBar.settingsUpdated();
    }));
}

export function deactivate() { }
