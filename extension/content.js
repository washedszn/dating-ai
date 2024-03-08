// Function to create a promise that resolves when a selector is present in the DOM
function waitForSelector(selector) {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            if ($(selector).length > 0) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

async function detectFaces(imageUrl) {
    const img = await faceapi.fetchImage(imageUrl);

    // Enhance the detection with additional features: landmarks, expressions, age, and gender
    const detectionsWithDetails = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

    // Filter out images with more than one face detected
    if (detectionsWithDetails.length !== 1) return [];

    return detectionsWithDetails.map(detection => {
        // Basic detection box info
        const { x, y, width, height } = detection.detection.box;

        // Extract additional information
        const landmarks = detection.landmarks.positions; // Facial landmarks
        const expressions = detection.expressions; // Facial expressions
        const age = detection.age; // Estimated age
        const gender = detection.gender; // Gender

        // Instead of returning an image, return an object with all the extracted information
        return {
            box: { x, y, width, height },
            landmarks,
            expressions,
            age,
            gender
        };
    });
}


// Function to extract profile information
async function extractProfileInfo(html) {
    let profile = {
        faces: [], // Array to hold the face images
        name: '',
        age: '',
        isVerified: false,
        location: {},
        attributes: [],
        storyContent: [],
        spotifyArtists: []
    };
    let $html = $(html);

    // First, extract all the image URLs
    const faceDetectionPromises = $(".media-box__picture-image", $html).map((i, el) => {
        return detectFaces($(el).attr('src'));
    }).get();

    const facesResults = await Promise.all(faceDetectionPromises);
    profile.faces = facesResults.flat();

    // Extract name and age
    profile.name = $html.find(".encounters-story-profile__name").text();
    profile.age = $html.find(".encounters-story-profile__age").text().replace(",", "");

    // Extract verification status
    profile.isVerified = $html.find(".encounters-story-profile__verification-badge").length > 0;

    // Extract location information
    profile.location = {
        town: $html.find(".location-widget__town span").text(),
        distance: $html.find(".location-widget__distance span").text(),
        info: $html.find(".location-widget__info .pill__title div").text()
    };

    // Extract attributes (Active, Undergraduate degree, etc.)
    profile.attributes = [];
    $html.find(".pill").each(function () {
        let attr = {};
        let src = $html.find(this).find(".pill__image").attr("src");
        if (src) {
            attr.type = src.match(/(?<=ic_badge_profileChips_dating_)[a-z0-9_]+(?=v[0-9]+\.png)/gi)[0];
            attr.value = $html.find(this).find(".pill__title div").text();
            profile.attributes.push(attr);
        }
    });

    // Extract story content
    profile.storyContent = [];
    $html.find(".encounters-story__content .encounters-story-section").each(function () {
        let section = {};
        section.heading = $html.find(this).find(".encounters-story-section__heading-title h2").text();
        section.content = $html.find(this).find(".encounters-story-section__content p").text();
        if (section.content != '') {
            profile.storyContent.push(section);
        }
    });

    // Extract Spotify artist names
    profile.spotifyArtists = [];
    $html.find(".spotify-widget__artist").each(function () {
        let artistName = $html.find(this).find(".spotify-widget__artist-name div").text();
        profile.spotifyArtists.push(artistName);
    });

    return profile;
}

$(document).ready(async function () {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights'),
        faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights'),
        faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights'),
        faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights'),
        faceapi.nets.ageGenderNet.loadFromUri('https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights')
    ]);
    
    $(document).on('mousedown', '.encounters-action--like, .encounters-action--dislike', async function (event) {
        // Get the current HTML of the document
        let html = document.documentElement.innerHTML;
        
        // Extract the profile information
        let profile = await extractProfileInfo(html);
        console.log('Profile extracted');

        // Determine if the profile was liked based on the clicked button
        profile.liked = $(event.currentTarget).hasClass('encounters-action--like');
        console.log('Like/dislike determined');

        // Get existing profiles from localStorage
        let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        console.log('Existing profiles retrieved');

        // Add the profile to the list
        profiles.push(profile);
        console.log('Profile added to list');

        // Save the updated list to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));
        
        chrome.storage.local.set({profiles: profiles}, function() {
            console.log('Profiles saved to chrome.storage.local');
        });
        
        console.log('Profiles saved to localStorage');
    });
});