window.tempLog = [];
var messagepending = false;

window.Log = function (message) {
    console.log(message);
    if ($ && $('#debug-info').length > 0) {
        for (var idx in tempLog) {
            $('#debug-info').append('<li>LOG: ' + tempLog[idx] + '</li>');
        }
        messagepending = false;
        $('#debug-info').append('<li>LOG: ' + message + '</li>');
    }
    else {
        tempLog.push(message);
        messagepending = true;
    }
};