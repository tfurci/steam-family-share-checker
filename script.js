async function checkFamilyShare() {
    const appLink = document.getElementById('appLinkInput').value;
    const appId = extractAppId(appLink);
    
    if (!appId) {
        displayResult('Invalid Steam App Link');
        return;
    }

    displayResult('Fetching data...');

    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://store.steampowered.com/api/appdetails?appids=${appId}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }

        // Move the displayResult('Data received'); here
        displayResult('Data received');

        const data = await response.json();
        if (!data || !data[appId] || !data[appId].success || !data[appId].data) {
            throw new Error(`Game data not found for App ID: ${appId}`);
        }

        const gameData = data[appId].data;
        
        // Check if the game is free
        const isFree = gameData.is_free || false;

        // If the game is not free, check if it's sharable
        if (!isFree) {
            // Check if the "categories" array includes an object with the "description" "Family Sharing"
            const categories = gameData.categories || [];
            const hasFamilySharing = categories.some(category => category.description === "Family Sharing");

            if (hasFamilySharing) {
                displayResult('This game can be shared via Family Sharing.', 'green');
            } else {
                displayResult('This game cannot be shared via Family Sharing.', 'red');
            }
        } else {
            // If the game is free, display that information
            displayResult('This game is free to play.');
        }
    } catch (error) {
        console.error('Error checking game details:', error);
        displayResult('An error occurred while checking game details. Please check the console for more details.');
    }
}

function extractAppId(url) {
    const match = url.match(/\/app\/(\d+)/);
    return match ? match[1] : null;
}

function displayResult(message, color) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.style.color = color;
}
