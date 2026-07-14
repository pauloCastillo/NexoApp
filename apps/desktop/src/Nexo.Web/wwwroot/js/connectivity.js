window.nexoConnectivity = {
    _dotNetRef: null,
    init: function (dotNetRef) {
        this._dotNetRef = dotNetRef;
        window.addEventListener('online', this._onOnline = () => dotNetRef.invokeMethodAsync('OnStatusChanged', true));
        window.addEventListener('offline', this._onOffline = () => dotNetRef.invokeMethodAsync('OnStatusChanged', false));
        return navigator.onLine;
    },
    dispose: function () {
        window.removeEventListener('online', this._onOnline);
        window.removeEventListener('offline', this._onOffline);
        this._dotNetRef = null;
    }
};
