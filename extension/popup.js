$(document).ready(function() {
    // Fetch the profiles from chrome.storage.local
    chrome.storage.local.get(['profiles'], function(result) {
        let profiles = result.profiles || [];
        
        // Count the number of profiles
        let profileCount = profiles.length;

        // Display the count in the #matchPercentage div
        $('#matchPercentage').text(`Profiles Analyzed: ${profileCount}`);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var downloadButton = document.getElementById('download'); // Assume you have a button with id="download"
    downloadButton.addEventListener('click', function() {
        // Fetch the profiles from chrome.storage.local
        chrome.storage.local.get(['profiles'], function(result) {
            if (result.profiles) {
                // Convert the profiles array to a JSON string
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.profiles));
                
                // Create a temporary link element
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "profiles.json");
                document.body.appendChild(downloadAnchorNode); // Required for Firefox
                
                // Trigger the download
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }
        });
    });
});
