import { readFileSync } from 'fs';
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {

    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file("/home/james/test/"), '**/scheduled'));
    watcher.onDidChange(uri => { shutdownUpdated(); });
    watcher.onDidCreate(uri => { shutdownUpdated(); });
    watcher.onDidDelete(uri => { vscode.window.showWarningMessage("Shutdown Cancelled"); });
}

export function deactivate() { }

function shutdownUpdated() {
    let theTime: String = "";
    let mode: String = "";
    let schedule: String = readFileSync("/home/james/test/scheduled").toString();
    let lines: String[] = schedule.split("\n");
    lines.forEach(line => {
        if (line.toUpperCase().startsWith("USEC")) {
            let ms: String = line.split("=")[1];
            var d: Date = new Date(parseInt(ms.toString(), 10) / 1000);
            theTime = d.toString();
        }
        else if (line.toUpperCase().startsWith("MODE")) {
            mode = line.split("=")[1];
        }
    });
    if (theTime !== "" && mode !== "") {
        vscode.window.showWarningMessage(`${mode} scheduled for ${theTime}.\nUse shutdown -c to cancel.`);
    }
}

// /run/systemd/shutdown/scheduled

// $ date -d "@$( awk -F '=' '/USEC/{ $2=substr($2,1,10); print $2 }' /run/systemd/shutdown/scheduled )"
// Thu Jul 25 02:00:00 NZST 2019


// USEC=1563976800000000
// WARN_WALL=1
// MODE=reboot
