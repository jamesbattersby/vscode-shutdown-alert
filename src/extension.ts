import { existsSync, readFileSync } from 'fs';
import * as vscode from 'vscode';

let notificationStatusBar: vscode.StatusBarItem;
let monitorPath: string = "";
let monitorFile: string = "";

export function activate(context: vscode.ExtensionContext) {
    let settings = vscode.workspace.getConfiguration('shutdown-watcher');
    monitorPath = settings.get("schedulePath", "/run/systemd/shutdown/");
    monitorFile = settings.get("scheduleFile", "scheduled");
    if (existsSync(monitorPath)) {
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(monitorPath), `**/${monitorFile}`));
        notificationStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        watcher.onDidChange(uri => { shutdownUpdated(); });
        watcher.onDidCreate(uri => { shutdownUpdated(); });
        watcher.onDidDelete(uri => { shutdownCancelled(); });
        context.subscriptions.push(notificationStatusBar);
        shutdownUpdated();
    }
}

export function deactivate() { }

function shutdownUpdated() {
    let theTime: String = "";
    let mode: String = "";
    let schedule: String = readFileSync(`${monitorPath}${monitorFile}`).toString();
    let lines: String[] = schedule.split("\n");
    lines.forEach(line => {
        if (line.toUpperCase().startsWith("USEC")) {
            let ms: String = line.split("=")[1];
            var d: Date = new Date(parseInt(ms.toString(), 10) / 1000);
            theTime = d.toISOString();
        }
        else if (line.toUpperCase().startsWith("MODE")) {
            mode = line.split("=")[1];
        }
    });
    let message: String = "";
    let statusBarMessage: String = "";
    if (theTime !== "" && mode !== "") {
        message = `${mode} scheduled for ${theTime}.\nUse shutdown -c to cancel.`;
        statusBarMessage = `$(megaphone) ${mode} @ ${theTime}`;
        vscode.window.showWarningMessage(`${message}`, {modal : true});
    }
    notificationStatusBar.tooltip = `${message}`;
    notificationStatusBar.text = `${statusBarMessage}`;
    notificationStatusBar.show();
}

function shutdownCancelled() {
    notificationStatusBar.hide();
}

// /run/systemd/shutdown/scheduled

// $ date -d "@$( awk -F '=' '/USEC/{ $2=substr($2,1,10); print $2 }' /run/systemd/shutdown/scheduled )"
// Thu Jul 25 02:00:00 NZST 2019


// USEC=1563976800000000
// WARN_WALL=1
// MODE=reboot
