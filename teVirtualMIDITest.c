/* teVirtualMIDI C interface
 *
 * Copyright 2009-2019, Tobias Erichsen
 * All rights reserved, unauthorized usage & distribution is prohibited.
 *
 *
 * File: teVirtualMIDITest.c
 *
 * This file contains a sample using the TeVirtualMIDI-dll-interface, which
 * implements a simple loopback-MIDI-port.
 */

#include <stdio.h>
#include <conio.h>
#include "teVirtualMIDI.h"

#define MAX_SYSEX_BUFFER	65535


char *binToStr( const unsigned char *data, DWORD length ) {
	static char dumpBuffer[ MAX_SYSEX_BUFFER * 3 ];
	DWORD index = 0;

	while ( length-- ) {
		sprintf( dumpBuffer+index, "%02x", *data );
		if ( length ) {
			strcat( dumpBuffer, ":" );
		}
		index+=3;
		data++;
	}
	return dumpBuffer;
}

void CALLBACK teVMCallback( LPVM_MIDI_PORT midiPort, LPBYTE midiDataBytes, DWORD length, DWORD_PTR dwCallbackInstance ) {
	if ( ( NULL == midiDataBytes ) || ( 0 == length ) ) {
		printf( "empty command - driver was probably shut down!\n" );
		return;
	}
	if ( !virtualMIDISendData( midiPort, midiDataBytes, length ) ) {
		printf( "error sending data: %d\n" + GetLastError() );
		return;
	}
      printf( "command: %s\n", binToStr( midiDataBytes, length ) );
}


int main( int argc, const char *argv[] ) {

	LPVM_MIDI_PORT port;

	printf( "teVirtualMIDI C loopback sample\n" );
	printf( "using dll-version:    %ws\n", virtualMIDIGetVersion( NULL, NULL, NULL, NULL ));
	printf( "using driver-version: %ws\n", virtualMIDIGetDriverVersion( NULL, NULL, NULL, NULL ));

	virtualMIDILogging( TE_VM_LOGGING_MISC | TE_VM_LOGGING_RX | TE_VM_LOGGING_TX );

	port = virtualMIDICreatePortEx2( L"C loopback", teVMCallback, 0, MAX_SYSEX_BUFFER, TE_VM_FLAGS_PARSE_RX );
	if ( !port ) {
		printf( "could not create port: %d\n", GetLastError() );
		return;
	}

	printf( "Virtual port created - press enter to close port again\n" );
	_getch();

	virtualMIDIClosePort( port );
	printf( "Virtual port closed - press enter to terminate application\n" );
	_getch();
}
