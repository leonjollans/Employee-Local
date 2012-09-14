window.tempLog = [];

window.Log = function (message) {
    console.log(message);
    tempLog.push(message);
};

window.getLog = function () {
    return tempLog;
};