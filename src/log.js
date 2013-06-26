/**
 * Logging library that is made for mobile devices or devices that don't have javascript console.
 * It prints the logs on a specified DOM element.
 * There is a helper CSS file that allows styling these logs but that is totally optional.
 * When the target element is not available (ex. temporary hidden or before the page DOM is ready), it buffers the log messages.
 * As soon as the DOM element is set, all the queued messages are printed
 * The DOM element can be changed at run time and the log messages will be written to the new element from then on.
 * It has some cool features for identifying the module name and special message codes.
 */
;var Log = (function() {

    /** the dom element that is used for showing the log items on the screen */
    var domElement;

    /** this queue will be used as a temporary storage until the dom element is set */
    var queue = [];

    /** makes a new log item and shows it if DOM element is initialized, queues it otherwise */
    function LogItem ( log, type, message, code ) {

        this.date = new Date();
        this.log = log;
        this.type = type;
        this.message = message;
        this.code = code;

        if ( domElement ) {
            domElement.appendChild( this.createElement() );
        } else {
            queue.push( this );
        }
    }

    /** creates a DOM element representation of this log item */
    LogItem.prototype.createElement = function () {
        var ret = document.createElement( 'pre' );
        ret.className = this.type + '-log-item log-item';
        ret.setAttribute( 'title', this.date );
        ret.appendChild( document.createTextNode( this.toString() ) );
        return ret;
    };

    /** returns a string representation of this log item */
    LogItem.prototype.toString = function () {
        var ret = this.type + '@' + this.log._moduleName;
        if ( this.code ) {
            ret += '[' + this.code + ']';
        }
        ret += ': ' + this.message;
        return ret;
    };

    /** Creates a new instance of a logger that is bound to a specific moule name */
    function Log ( moduleName ) {
        this._moduleName = moduleName;
        this.info( 'Created log object' );
    }

    /** Sets the element that is used for printing out the logs on DOM */
    Log.prototype.setElement = function ( id ) {
        domElement = document.getElementById( id );
        //if the id didn't match any element, fail
        if ( !domElement ) {
            alert( 'Cannot initialize the log system with a non-existing id: ' + id );
        }
        for ( var i = 0; i < queue.length; i++ ) {
            domElement.appendChild( queue[ i ].createElement() )
        }
        //empty the queue
        queue.length = 0;
    };

    /** Log an information message */
    Log.prototype.info = function ( message, code ) {
        return new LogItem( this, 'info', message, code );
    };

    /** Log a warning message */
    Log.prototype.warn = function ( message, code ) {
        return new LogItem( this, 'warn', message, code );
    };

    /** Log an error message */
    Log.prototype.error = function ( message, code ) {
        return new LogItem( this, 'error', message, code );
    };

    Log.prototype.i = Log.prototype.info;
    Log.prototype.w = Log.prototype.warn;
    Log.prototype.e = Log.prototype.error;

    return Log;
})();