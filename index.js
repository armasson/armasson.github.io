const links = {
    iOS: {
        intent: 'lumapps://a/lumapps-test/lca/ls/content/6538915907174121/2611-content-for-mobile',
        store: 'https://apps.apple.com/us/app/lumapps/id1237675892'
    },
    android: {
        intent: 'intent://apps.lumapps.link/lumapps/?link=https://login.lumapps.com/app-mobile/organizations/4664706704080896/signin&apn=com.lumapps.android&amv=3601&afl=https://play.google.com/store/apps/details?id%3Dcom.lumapps.android#Intent;package=com.google.android.gms;action=com.google.firebase.dynamiclinks.VIEW_DYNAMIC_LINK;scheme=https;S.browser_fallback_url=https://play.google.com/store/apps/details%3Fid%3Dcom.lumapps.android;end',
        store: 'https://play.google.com/store/apps/details?id=com.lumapps.android'
    }
};
const loginURL = 'https://login.lumapps.com/app-mobile/organizations/4664706704080896/signin';

const urlInput = document.querySelector('#urlInput');
const storeInput = document.querySelector('#storeInput');
const timeoutInput = document.querySelector('#timeoutInput');

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

urlInput.value = isAndroid ? links.android.intent : links.iOS.intent;
storeInput.value = isAndroid ? links.android.store : links.iOS.store;


// Fallback
let fallbackTimeout;
const setFallback = () => {
    fallbackTimeout = setTimeout(() => {
        console.log('Should redirect')
        if (isIOS) {
            window.location.href = links.iOS.store
        } else if(isAndroid) {
            window.location.href = links.android.store
        }
    }, timeoutInput.value);
}
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        clearTimeout(fallbackTimeout);
        console.log('Clear by visibilitychange')
    }
});
window.addEventListener("pagehide", () => {
    console.log('Clear by pageHide')
    clearTimeout(fallbackTimeout);
});

window.addEventListener('hashchange', function() {
    console.log('Page has changed hash');
    clearTimeout(fallbackTimeout);

});

// 0. Link to sign in
const linkToSignIn = document.querySelector('#linkToSignIn');
linkToSignIn.addEventListener('click', (e) => {
    setFallback();
});


// 1. Direct link URL attempt
const directLink = document.querySelector('#directLink');
// Update URL with link
directLink.setAttribute('href', urlInput.value);
urlInput.addEventListener('input', () => {
    directLink.setAttribute('href', urlInput.value);
});



// 2. Action button with location.href
const actionBtn = document.querySelector('#actionBtn');
actionBtn.addEventListener('click', () => {
    window.location.href = urlInput.value;
    setFallback();
});

// 3. Iframe test
const iframeBtn = document.querySelector('#iframeBtn');
iframeBtn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    setFallback();

    iframe.onload = () => {
        clearTimeout(fallbackTimeout);
    };

    iframe.src = urlInput.value;
});

// 4. Pre-fetch
const fetchBtn = document.querySelector('#fetchBtn');
fetchBtn.addEventListener('click', async () => {
    try {
       await fetch(loginURL);
    } catch (e) {
        alert('neinneinnein')
    }
});

// 5. Get installed app
const getInstalledApp = document.querySelector('#getInstalledApp');
// Check if the related app is installed
if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then((relatedApps) => {
        console.log(relatedApps);
        alert('Installed apps : ', relatedApps);
        if (relatedApps.length === 0) {
            console.log('App not installed');
            // No related apps installed, show the install prompt
            getInstalledApp.setAttribute('href', isIOS ? links.iOS.store : links.android.store);
        } else {
            console.log('App installed');
        }
    });
} else {
    alert('getInstalledRelatedApps not available');
    getInstalledApp.setAttribute('disabled', true );
}