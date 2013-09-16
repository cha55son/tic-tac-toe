arraysEqual = function(arr1, arr2) {
    return arr1.toString() == arr2.toString() || arr1.toString() == arr2.concat().reverse().toString();
};

Test = function(testName) {
    this.name = testName;
};
Test.prototype.assert = function(val1, val2, errMsg) {
    if (val1 instanceof Array && val2 instanceof Array) {
        if (!arraysEqual(val1, val2))
            throw "[TestError] " + errMsg; 
    } else if (val1 != val2) {
        throw "[TestError] " + errMsg;
    }
    return true;
};
Test.prototype.test = function(callback) {
    try {
        callback();
        console.log('[' + this.name + '] passed.');
    } catch (e) {
        alert(e);
    }
};
