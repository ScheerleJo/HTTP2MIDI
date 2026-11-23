const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

/**
 * Tray icon (Windows notification area) for http2midi.
 * The icon is shown by a small PowerShell helper (scripts/tray.ps1), which uses the
 * Windows Forms NotifyIcon that is built into Windows - no additional software is needed.
 */
class Tray {
    /**
     * @param {object} options
     * @param {string} options.title tooltip of the tray icon
     * @param {string} options.info first (disabled) line of the tray menu
     * @param {string} options.logFile log file that is shown via "Log anzeigen"
     * @param {string} options.docsUrl URL of the Swagger docs
     * @param {Function} options.onExit called when "Beenden" is clicked
     */
    constructor({ title, info, logFile, docsUrl, onExit }) {
        this.logFile = logFile;
        this.docsUrl = docsUrl;
        this.onExit = onExit;
        this.child = null;
        try {
            const { scriptPath, iconPath } = extractResources();
            this.child = spawn('powershell.exe', [
                '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden',
                '-File', scriptPath, '-IconPath', iconPath, '-Title', title, '-Info', info,
            ], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
        } catch (err) {
            console.error(`Tray icon could not be started: ${err.message}`);
            return;
        }
        this.child.on('error', err => console.error(`Tray icon could not be started: ${err.message}`));
        this.child.stderr.on('data', data => console.error(`Tray: ${data.toString().trim()}`));
        this.child.stdout.setEncoding('utf8');
        let buffer = '';
        this.child.stdout.on('data', data => {
            buffer += data;
            let index;
            while((index = buffer.indexOf('\n')) >= 0) {
                this.handleCommand(buffer.slice(0, index).trim());
                buffer = buffer.slice(index + 1);
            }
        });
        this.child.on('exit', () => { this.child = null; });
    }

    handleCommand(command) {
        if(command === 'show-log') this.showLog();
        else if(command === 'open-docs') openUrl(this.docsUrl);
        else if(command === 'exit') this.onExit();
    }

    /**
     * Opens a separate window that shows the log live. Closing this window does not stop http2midi.
     */
    showLog() {
        showLogWindow(this.logFile);
    }

    setTooltip(text) {
        if(this.child) this.child.stdin.write(`tooltip ${text.replace(/\r?\n/g, ' ')}\n`);
    }

    /**
     * Removes the tray icon
     * @returns {Promise<void>} resolves when the helper has exited (max. 2 seconds)
     */
    stop() {
        if(!this.child) return Promise.resolve();
        const child = this.child;
        return new Promise(resolve => {
            const timer = setTimeout(() => { child.kill(); resolve(); }, 2000);
            child.once('exit', () => { clearTimeout(timer); resolve(); });
            child.stdin.end('quit\n');
        });
    }
}

/**
 * Copies the PowerShell script and the icon to the temp folder,
 * because they are packed inside the exe and PowerShell needs real files.
 */
function extractResources() {
    const dir = path.join(os.tmpdir(), 'http2midi');
    fs.mkdirSync(dir, { recursive: true });
    const scriptPath = path.join(dir, 'tray.ps1');
    const iconPath = path.join(dir, 'http2midi.ico');
    // Windows PowerShell 5.1 needs a BOM to read the script as UTF-8 (umlauts in the menu)
    const BOM = String.fromCharCode(0xFEFF);
    let script = fs.readFileSync(path.join(__dirname, 'tray.ps1'), 'utf8');
    if(script.startsWith(BOM)) script = script.slice(1);
    fs.writeFileSync(scriptPath, BOM + script, 'utf8');
    fs.writeFileSync(iconPath, fs.readFileSync(path.join(__dirname, '..', 'Logo.ico')));
    return { scriptPath, iconPath };
}

/**
 * Opens a new console window that follows the log file
 * @param {string} logFile path of the log file
 */
function showLogWindow(logFile) {
    if(!logFile) return;
    const escaped = logFile.replace(/'/g, "''");
    const command = `$Host.UI.RawUI.WindowTitle = 'http2midi Log'; ` +
        `Write-Host 'Dieses Fenster kann geschlossen werden, http2midi laeuft weiter.' -ForegroundColor Cyan; ` +
        `Get-Content -LiteralPath '${escaped}' -Encoding UTF8 -Tail 300 -Wait`;
    // -EncodedCommand avoids any quoting problems with paths
    const encoded = Buffer.from(command, 'utf16le').toString('base64');
    // "start" opens a new, visible console window. (spawn with detached: true would start
    // PowerShell without any console, so the window would stay invisible.)
    spawn('cmd.exe', [
        `/d /c start "http2midi Log" powershell.exe -NoProfile -NoExit -ExecutionPolicy Bypass -EncodedCommand ${encoded}`,
    ], { windowsVerbatimArguments: true, windowsHide: true, stdio: 'ignore' });
}

/**
 * Opens a URL in the default browser
 * @param {string} url
 */
function openUrl(url) {
    spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { detached: true, stdio: 'ignore' }).unref();
}

module.exports = { Tray, showLogWindow };
