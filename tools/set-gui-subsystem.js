/**
 * Marks a Windows executable as GUI application (instead of console application).
 * Windows then starts it without a console window - http2midi is controlled via its tray icon.
 *
 * Usage: node tools/set-gui-subsystem.js dist/http2midi.exe
 */
const fs = require('node:fs');

const IMAGE_SUBSYSTEM_WINDOWS_GUI = 2;
const IMAGE_SUBSYSTEM_WINDOWS_CUI = 3;

const file = process.argv[2];
if(!file) {
    console.error('Usage: node tools/set-gui-subsystem.js <path to exe>');
    process.exit(1);
}

const fd = fs.openSync(file, 'r+');
try {
    const header = Buffer.alloc(4096);
    fs.readSync(fd, header, 0, header.length, 0);
    if(header.toString('ascii', 0, 2) !== 'MZ') throw new Error('Not a Windows executable (missing MZ header)');
    const peOffset = header.readUInt32LE(0x3C);
    if(header.toString('binary', peOffset, peOffset + 4) !== 'PE\0\0') throw new Error('PE header not found');
    // PE signature (4 bytes) + COFF file header (20 bytes) = start of the optional header,
    // the Subsystem field is at offset 68 of the optional header (PE32 and PE32+)
    const subsystemOffset = peOffset + 4 + 20 + 68;
    const current = header.readUInt16LE(subsystemOffset);
    if(current === IMAGE_SUBSYSTEM_WINDOWS_GUI) {
        console.log(`${file} is already a GUI application`);
    } else if(current === IMAGE_SUBSYSTEM_WINDOWS_CUI) {
        const value = Buffer.alloc(2);
        value.writeUInt16LE(IMAGE_SUBSYSTEM_WINDOWS_GUI);
        fs.writeSync(fd, value, 0, 2, subsystemOffset);
        console.log(`${file} is now a GUI application (no console window)`);
    } else {
        throw new Error(`Unexpected subsystem value ${current}`);
    }
} finally {
    fs.closeSync(fd);
}
