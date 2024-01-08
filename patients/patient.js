var token = localStorage.getItem('token');
console.log(token)
let page = 1;

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

    maxPagination = data.pagination.count;
    updatePagination(maxPagination);
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
    console.log(page);
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
    if (event && event.target.id === 'searchButton') {
        page = 1; // Установите значение page равным 1 при нажатии на кнопку searchButton
      }
    urlParams.set('page', page); // Используйте переданную страницу
    urlParams.set('size', pageSize);

    const url = `https://mis-api.kreosoft.space/api/patient?${conclusions}&${urlParams.toString()}`;

    const cardContainerWrapper = document.querySelector('.row.list');
    cardContainerWrapper.innerHTML = '';
    
    // Выполните нужные вам действия с полученной ссылкой
    console.log(url);
    console.log(name);
  
    get(url, token);
  }

  document.getElementById('searchButton').addEventListener('click',searchPatients);

  pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const link = event.target;
    if (!link.classList.contains('page-link')) {
      return;
    }
    console.log(maxPagination);
    if (link.innerText === '«') {
        //console.log(currentPage);
        page = page - 1; // Получаем предыдущий номер страницы
        console.log(page);
      } else if (link.innerText === '»') {
        console.log(page);
        page = parseInt(page) + 1; // Получаем следующий номер страницы
        console.log(page);
      }
       if (page <= 1){
        page = 1;
      } else if (page >= maxPagination){
        page = maxPagination;
        console.log(page);
      } 
      if(link.innerText >= 1 && link.innerText <=maxPagination)  {
        page = link.innerText; // Получите номер страницы из текста ссылки
      }
      console.log(page)
    
    searchPatients(page);
  });



  function updatePagination(maxPagination) {
    while (pagination.firstChild) {
      pagination.removeChild(pagination.firstChild);
    }
  
  for (let i = 1; i <= maxPagination; i++) {
    //console.log(maxPagination);
    const li = document.createElement('li');
    li.classList.add('page-item');
    const a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.innerText = i;
    li.appendChild(a);
    pagination.appendChild(li);
  }
  const firstPageLink = document.createElement('a');
  firstPageLink.classList.add('page-link');
  firstPageLink.href = '#';
  firstPageLink.innerHTML = '&laquo;'; // Символ «
  const lastPageLink = document.createElement('a');
  lastPageLink.classList.add('page-link');
  lastPageLink.href = '#';
  lastPageLink.innerHTML = '&raquo;'; // Символ »
  
  const firstPageItem = document.createElement('li');
  firstPageItem.classList.add('page-item');
  firstPageItem.appendChild(firstPageLink);
  
  const lastPageItem = document.createElement('li');
  lastPageItem.classList.add('page-item');
  lastPageItem.appendChild(lastPageLink);
  
  pagination.insertBefore(firstPageItem, pagination.firstChild);
  pagination.appendChild(lastPageItem);
  }
  