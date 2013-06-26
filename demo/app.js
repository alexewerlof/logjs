var log = new Log( 'app' );
log.w( 'DOM is not ready yet' );

log.i( 'Going to set the DOM element', 'A12' );
log.setElement( 'log-output' );
log.i( 'DOM element set successfully', 'B13' );
