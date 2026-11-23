# Tray icon for http2midi.
# Started by scripts/tray.js. Communicates with Node via stdin/stdout:
#   stdout (to Node):  show-log | open-docs | exit
#   stdin  (from Node): tooltip <text> | quit
# When stdin is closed (Node has exited), the icon is removed and the helper exits.
param(
    [Parameter(Mandatory)][string]$IconPath,
    [Parameter(Mandatory)][string]$Title,
    [Parameter(Mandatory)][string]$Info
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Send-Command([string]$cmd) {
    [Console]::Out.WriteLine($cmd)
    [Console]::Out.Flush()
}

$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Icon = New-Object System.Drawing.Icon($IconPath)
$tray.Text = $Title.Substring(0, [Math]::Min(63, $Title.Length))

$menu = New-Object System.Windows.Forms.ContextMenuStrip

$header = $menu.Items.Add($Info)
$header.Enabled = $false
[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))

$logItem = $menu.Items.Add('Log anzeigen')
$logItem.Font = New-Object System.Drawing.Font($logItem.Font, [System.Drawing.FontStyle]::Bold)
$logItem.add_Click({ Send-Command 'show-log' })

$docsItem = $menu.Items.Add('API-Docs im Browser öffnen')
$docsItem.add_Click({ Send-Command 'open-docs' })

[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))

$exitItem = $menu.Items.Add('http2midi beenden')
$exitItem.add_Click({ Send-Command 'exit' })

$tray.ContextMenuStrip = $menu
$tray.add_MouseDoubleClick({ Send-Command 'show-log' })
$tray.Visible = $true

# Read commands from Node without blocking the UI thread.
# Note: [Console]::In.ReadLineAsync() must not be used, in Windows PowerShell it blocks
# until a line arrives - the tray menu would then not react to any click.
$script:reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput())
$script:pending = $script:reader.ReadLineAsync()
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 250
$timer.add_Tick({
    if (-not $script:pending.IsCompleted) { return }
    $line = $null
    if (-not $script:pending.IsFaulted) { $line = $script:pending.Result }
    if ($null -eq $line -or $line -eq 'quit') {
        $timer.Stop()
        $tray.Visible = $false
        $tray.Dispose()
        [System.Windows.Forms.Application]::Exit()
        return
    }
    if ($line.StartsWith('tooltip ')) {
        $text = $line.Substring(8)
        $tray.Text = $text.Substring(0, [Math]::Min(63, $text.Length))
    }
    $script:pending = $script:reader.ReadLineAsync()
})
$timer.Start()

[System.Windows.Forms.Application]::Run()
