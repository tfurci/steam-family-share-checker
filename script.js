async function checkFamilyShare() {
    hideFamilyShareStatus();
    const appLink = document.getElementById('appLinkInput').value;
    const appId = extractAppId(appLink);
    
    if (!appId) {
        displayResult1('Invalid Steam App Link', 'white', false);
        return;
    }

    displayResult1('Fetching data', 'white', true);

    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://store.steampowered.com/api/appdetails?appids=${appId}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }

        // Move the displayResult('Data received'); here
        displayResult1('Data received', 'white', false);

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
                displayResult1(`${gameData.name} can be shared via Family Sharing.`, 'green', false);
            } else {
                displayResult1(`${gameData.name} cannot be shared via Family Sharing.`, 'red', false);
            }

            const statusIndicator = document.getElementById('statusIndicator');
            if (hasFamilySharing) {
                statusIndicator.textContent = '✓'; // Checkmark character
                statusIndicator.style.color = 'green';
            } else {
                statusIndicator.textContent = '✗'; // Cross mark character
                statusIndicator.style.color = 'red';
            }

            const familyShareStatus = document.getElementById('familyShareStatus');
            familyShareStatus.style.display = 'block'; // Show the hidden div

        } else {
            // If the game is free, display that information
            displayResult1(`${gameData.name} is free to play.`, 'white', false);
        }
    } catch (error) {
        console.error('Error checking game details:', error);
        displayResult1('An error occurred while checking game details. Please check the console for more details.', 'white');
    }
}


function extractAppId(url) {
    const match = url.match(/\/app\/(\d+)/);
    return match ? match[1] : null;
}

let intervalId1;

function displayResult1(message, color, animatee = false) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.style.color = color;

    // Clear any existing animation interval
    clearInterval(intervalId1);

    if (animatee) {
        let dots = '';
        intervalId1 = setInterval(() => {
            dots += '.';
            result.textContent = message + dots;
            if (dots.length === 4) {
                dots = '';
            }
        }, 500);
    }
}

function clearDisplayResult1() {
    displayResult1();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = ''; // Clear the text content
}

function hideFamilyShareStatus() {
    const familyShareStatus = document.getElementById('familyShareStatus');
    familyShareStatus.style.display = 'none'; // Hide the div
}