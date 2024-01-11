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

async function getPatient(url, token) {
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        }),
    })
    .then(response => response.json())
    .then(async data => {
console.log(data)
        document.querySelector('[data-name]').textContent = data.name;
        document.querySelector('[data-birthday]').textContent =  `Дата рождения: ${await formatBirthday(data.birthday.split('T')[0])}`;
    })
    .catch(error => {
        console.error('Ошибка', error);
    });
}


async function getDictionary(url) {
    return fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      console.log(url);
      console.log(data);
      populateDictionary(data);
    })
    .catch(error => {
      console.error('Ошибка', error);
    });
  }

let queryString = window.location.search;
queryString = queryString.slice(1,-1);
const urlPatient = `https://mis-api.kreosoft.space/api/patient/${queryString}`;
console.log(urlPatient);
getPatient(urlPatient, token);

const urlDictionary = `https://mis-api.kreosoft.space/api/dictionary/icd10/roots`;
getDictionary(urlDictionary)


async function formatBirthday(originalDate){
    const dateParts = originalDate.split("-");
    console.log(originalDate)
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    originalDate = `${day}.${month}.${year}`;
    console.log(originalDate);
    return originalDate
}


function populateDictionary(dictionaries) {
    const selectDictionary = document.getElementById('selectDictionary');
    dictionaries.forEach(dictionary => {
      const option = document.createElement('option');
      option.value = dictionary.id;
      option.text = dictionary.name;
      selectDictionary.appendChild(option);
    });
  }