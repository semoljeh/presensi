const GAS_URL = 'https://script.google.com/macros/s/AKfycbxqvIIVOOmqNccdnSidFy59m4XBwwk38vX2t2QG7WdxMUsNTd2GzNIVyu-OykQEGEjFpg/exec';

function buildGasUrl() {
    const separator = GAS_URL.includes('?') ? '&' : '?';
    const nonce = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    return `${GAS_URL}${separator}__madasa_cb=${encodeURIComponent(nonce)}`;
}

function gasFetch(options = {}) {
    return fetch(buildGasUrl(), {
        ...options,
        cache: 'no-store',
        redirect: 'follow'
    });
}

window.buildGasUrl = buildGasUrl;
window.gasFetch = gasFetch;