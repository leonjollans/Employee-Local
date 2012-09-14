window.templog = [];

window.Log = function (message) {
    console.log(message);
    templog.push(message);
};

window.getLog = function () {
    return tempLog;
};