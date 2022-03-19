// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file("/home/james/test/"), '**/*.js'));
	watcher.onDidChange(uri => { console.log('Changed'); }); // listen to files being changed
	watcher.onDidCreate(uri => { console.log('Created'); }); // listen to files/folders being created
	watcher.onDidDelete(uri => { console.log('Deleted'); }); // listen to files/folders getting deleted
	// context.subscriptions.push(watcher);

	//watcher.dispose(); // dispose after usage
}

// this method is called when your extension is deactivated
export function deactivate() {}
