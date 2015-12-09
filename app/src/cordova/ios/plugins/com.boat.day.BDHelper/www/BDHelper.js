cordova.define("com.boat.day.BDHelper.BDHelper", function(require, exports, module) { var BDHelper = {
    initialize: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'BDHelper',
            'initialize',
            []
        );
    },

    getInstallationId: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'BDHelper',
            'getInstallationId',
            []
        );
    },

    getInstallationObjectId: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'BDHelper',
            'getInstallationObjectId',
            []
        );
    },
};
module.exports = BDHelper;
});
