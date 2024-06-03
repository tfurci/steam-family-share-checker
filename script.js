async function checkFamilyShare() {
    const appLink = document.getElementById('appLinkInput').value;
    const appId = extractAppId(appLink);
    
    if (!appId) {
        displayResult('Invalid Steam App Link');
        return;
    }

    displayResult('Fetching data...');

    try {
        const familyShareStatus = await fetchFamilyShareStatus(appId);

        if (familyShareStatus === null) {
            displayResult('Could not fetch data from SteamDB.');
        } else if (familyShareStatus) {
            displayResult('This game can be shared via Family Sharing.');
        } else {
            displayResult('This game cannot be shared via Family Sharing.');
        }
    } catch (error) {
        console.error('Error checking Family Sharing status:', error);
        displayResult('An error occurred while checking Family Sharing status.');
    }
}

function extractAppId(url) {
    const match = url.match(/\/app\/(\d+)/);
    return match ? match[1] : null;
}

async function fetchFamilyShareStatus(appId) {
    const targetUrl = `https://store.steampowered.com/app/${appId}/`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const categoryBlock = doc.getElementById('category_block');

    if (categoryBlock && categoryBlock.textContent.includes('Family Sharing')) {
        return true; // Game supports Family Sharing
    } else {
        return false; // Game does not support Family Sharing
    }
}

function displayResult(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
}
