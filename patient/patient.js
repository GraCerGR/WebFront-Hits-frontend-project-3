var token = localStorage.getItem('token');
let page = 1;

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

        const urlInspection = `https://mis-api.kreosoft.space/api/patient/${data.id}/inspections?grouped=false&page=1&size=5`;
        getInspection(urlInspection, token)
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


  async function getInspection(url, token) {
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


  function createCard(data) {
    const cardContainerWrapper = document.querySelector('.row.list');
    data.inspections.forEach(async patient => {

      const cardContainer = document.createElement('div');
      cardContainer.classList.add('col-lg-6');
      
      const container2 = document.createElement('div');
      container2.classList.add('container2', 'container', 'p-2', 'my-2');
      const queryString = new URLSearchParams(patient.id).toString();
      const url = `/patient/patient.html?${queryString}`;
      container2.innerHTML = `
          <div class="background">
          ${await formatBirthday(patient.date.split('T')[0])}
          </div>
          <strong>Амбулаторный осмотр</strong>
          <div>Заключение: <strong>${patient.conclusion}</strong></div>
          <div>Основной диагноз: <strong>${patient.diagnosis.name}</strong></div>
          <div class="fw-light">Медицинский работник: ${patient.doctor}</div>

      `;
      
      cardContainer.appendChild(container2);
      cardContainerWrapper.appendChild(cardContainer);
   //   cardContainer.addEventListener('click', () => {
   //     window.location.href = url;
   //   });
    });
  }


  function updatePagination(maxPagination) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    const currentPage = parseInt(page); // текущая страница
    const totalPages = maxPagination; // общее количество страниц
    let startPage, endPage;
    if (totalPages <= 5) {
      // Если общее количество страниц меньше или равно 5, то отображаем все страницы
      startPage = 1;
      endPage = totalPages;
      console.log(page)
    } else {
      // Иначе вычисляем начальную и конечную страницы
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
        console.log(page)
      } else if (currentPage + 2 >= totalPages) {
        console.log(currentPage + 2)
        console.log(totalPages)
        startPage = totalPages - 4;
        endPage = totalPages;
        console.log(totalPages)
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
        console.log(page)
      }
    }
  
    // Создаем элементы для номеров страниц и добавляем их в пагинацию
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.href = '#';
      a.innerText = i;
      console.log(i);
      if (i === currentPage) {
        li.classList.add('active'); // выделяем текущую страницу
      }
      li.appendChild(a);
      pagination.appendChild(li);
    }
  
    const firstPageLink = document.createElement('a');
    firstPageLink.classList.add('page-link');
    firstPageLink.href = '#';
    firstPageLink.innerHTML = '&laquo;';
    const lastPageLink = document.createElement('a');
    lastPageLink.classList.add('page-link');
    lastPageLink.href = '#';
    lastPageLink.innerHTML = '&raquo;';
  
    const firstPageItem = document.createElement('li');
    firstPageItem.classList.add('page-item');
    firstPageItem.appendChild(firstPageLink);
    const lastPageItem = document.createElement('li');
    lastPageItem.classList.add('page-item');
    lastPageItem.appendChild(lastPageLink);
  
    pagination.insertBefore(firstPageItem, pagination.firstChild);
    pagination.appendChild(lastPageItem);
  }