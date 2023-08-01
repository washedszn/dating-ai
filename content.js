// Use jQuery to select all profiles
let profiles = $("article.encounters-story").map(function(i) {
    // Initialize an empty object for this profile
    let profile = {};

    // Get the name and age
    let name = $(this).find("span.encounters-story-profile__name").text();
    let age = $(this).find("span.encounters-story-profile__age").text().replace(',', '');
    profile["name"] = name;
    profile["age"] = age;

    // Get the image URL
    let image = $(this).find("img.media-box__picture-image").attr('src');
    profile["image_url"] = image;

    // Get the verification status
    let verification = $(this).find("span.encounters-story-profile__verification-text").text().trim();
    profile["verification"] = verification;

    // Get the about information
    let about = $(this).find("h2.p-2.font-weight-medium").text();
    profile["about"] = about;

    // Get badges
    let badges = $(this).find("div.pill__title").map(function() {
        return $(this).text().trim();
    }).get();
    profile["badges"] = badges;

    return profile;
}).get();

console.log(profiles);
