var token = localStorage.getItem('token');

async function post(url, data=null){
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' : 'application/json'
        })
    }).then(response => response.json());
}

async function get(url, token) {
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    })
    .then(response => response.json())
    .then(data => {
console.log(data)
    })
    .catch(error => {
        console.error('Ошибка', error);
    });
}

function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 10 - fullStars;
    const decimalPart = rating % 1;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="active"></span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span></span>';
    }
    return starsHTML;
}

let queryString = window.location.search;
queryString = queryString.slice(1,-1);
const url = `https://mis-api.kreosoft.space/api/patient/${queryString}`;
console.log(url);
get(url, token);