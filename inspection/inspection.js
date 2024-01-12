// Get the current URL
const url = new URL(window.location.href);
console.log(url);
// Get the query parameters from the URL
const params = new URLSearchParams(url.search);

// Get the values of the parameters
const previousInspectionId = params.get('previousInspectionId');
const repeat = params.get('repeat');
console.log(previousInspectionId, repeat);