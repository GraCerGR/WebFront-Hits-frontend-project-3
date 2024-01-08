var token = localStorage.getItem('token');
console.log(token)

async function get(url, token) {
    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        "Authorization": `Bearer ${token}`
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(url);
      console.log(data);
        createCard(data);
    })
    .catch(error => {
      console.error('Ошибка', error);
    });
  }
const url = `https://mis-api.kreosoft.space/api/patient`;
get(url, token)



function createCard(data) {
    const cardContainerWrapper = document.querySelector('.row.list');
    data.patients.forEach(patient => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('col-lg-6', 'container', 'container2', 'p-2', 'my-2');
      cardContainer.innerHTML = `
          <h6>${patient.name}</h6>
          Пол: ${patient.gender === 'Male' ? 'Мужчина' : patient.gender === 'Female' ? 'Женщина' : 'Не указано'}<BR>
          Дата рождения - ${patient.birthday ? patient.birthday.split('T')[0] : 'Не указано'}<BR>
      `;
      cardContainerWrapper.appendChild(cardContainer);
    });
  }
  

  function searchPatients() {
    const name = document.getElementById('inputName').value;
    const conclusions = Array.from(document.getElementById('conclusionsSelect').selectedOptions).map(option => `conclusions=${option.value}`).join('&');
    const scheduledVisits = document.getElementById('scheduledVisitsSwitch').checked;
    const onlyMine = document.getElementById('myPatientsSwitch').checked;
    const sorting = document.getElementById('sortSelect').value;
    const pageSize = document.getElementById('pageSizeInput').value;
    
    const urlParams = new URLSearchParams();
    urlParams.set('name', name);
    urlParams.set('sorting', sorting);
    urlParams.set('scheduledVisits', scheduledVisits);
    urlParams.set('onlyMine', onlyMine);
    urlParams.set('page', 1);
    urlParams.set('size', pageSize);
    
    const url = `https://mis-api.kreosoft.space/api/patient?${conclusions}&${urlParams.toString()}`;
    
    // Выполните нужные вам действия с полученной ссылкой
    console.log(url);
    console.log(name);
  
    get(url, token);
  }
  
  document.getElementById('searchButton').addEventListener('click',searchPatients);