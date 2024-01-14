var token = localStorage.getItem('token');

const url = new URL(window.location.href);
console.log(url);
const params = new URLSearchParams(url.search);

const inspectionId = params.get('inspectionId');
const patient = params.get('patient');

const urlPatient = `https://mis-api.kreosoft.space/api/inspection/${inspectionId}`;
console.log(urlPatient);
getPatient(urlPatient, token);


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
            document.querySelector('[data-data]').textContent = `Амбулаторный осмотр от ` + await formatDataTime(data.date);
            document.querySelector('[data-name]').textContent = 'Пациент: ' + data.patient.name;
            document.querySelector('[data-gender]').textContent = data.patient.gender === 'Male' ? 'Пол: Мужской' : data.patient.gender === 'Female' ? 'Пол: Женский' : '';
            document.querySelector('[data-birthday]').textContent = `Дата рождения: ${data.patient.birthday ? await formatBirthday(data.patient.birthday.split('T')[0]) : 'Не указано'}`;
            document.querySelector('[data-doctor]').textContent = `Медицинский работник: ` + data.doctor.name;

            document.querySelector('[data-complaints]').textContent = data.complaints;
            document.querySelector('[data-anamnesis]').textContent = data.anamnesis;



            document.querySelector('[data-treatment]').textContent = data.treatment;
            //document.querySelector('[data-conclusion]').textContent = data.conclusion === 'Disease' ? 'Болезнь' : data.conclusion === 'Recovery' ? 'Выздоровление' : data.conclusion === 'Death' ? 'Смерть' : '';
            var conclusionElement = document.querySelector('[data-conclusion]');
            var conclusionText = '';
            
            if (data.conclusion === 'Disease') {
                conclusionText = 'Болезнь';
                document.querySelector('[data-visit]').textContent = 'Дата следующего визита: ' + await formatDataTime(data.nextVisitDate);
            } else if (data.conclusion === 'Death') {
                conclusionText = 'Смерть';
                document.querySelector('[data-visit]').textContent = 'Дата и время смерти: ' + await formatDataTime(data.deathDate);
            } else if (data.conclusion === 'Recovery') {
                conclusionText = 'Выздоровление';
            }
            
            conclusionElement.innerHTML = conclusionText;

            consultations(data);
            diagnoses(data.diagnoses)

            //document.querySelector('[data-consultations]').textContent = `Специализация консультанта: ` + data.consultations[i].speciality.name;

        })
        .catch(error => {
            console.error('Ошибка', error);
        });
}



async function formatBirthday(originalDate) {
    const dateParts = originalDate.split("-");
    console.log(originalDate)
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    originalDate = `${day}.${month}.${year}`;
    console.log(originalDate);
    return originalDate
}

function formatDataTime(originalDate) {
    const dateParts = originalDate.split("T")[0].split("-");
    const timeParts = originalDate.split("T")[1].split(":");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    return formattedDate;
}

function consultations(data) {
    var consultationsContainer = document.querySelector('[data-consultations]');

for (var i = 0; i < data.consultations.length; i++) {
  var consultation = data.consultations[i];
  
  var container = document.createElement('div');
  container.classList.add('container', 'container2', 'py-2', 'my-2');
  
  var label = document.createElement('label');
  label.classList.add('form-label', 'py-1', 'fw-bold', 'blue');
  label.textContent = 'Консультация';
  
  var consultationElement = document.createElement('div');
  consultationElement.classList.add('col', 'd-flex', 'align-items-center');
  consultationElement.innerHTML = 'Специализация консультанта: ' + consultation.speciality.name;
  
  var doctorElement = document.createElement('div');
  doctorElement.classList.add('fw-light');
  doctorElement.setAttribute('data-doctor', '');
  
  container.appendChild(label);
  container.appendChild(consultationElement);
  container.appendChild(doctorElement);
  
  consultationsContainer.appendChild(container);
}
}

function diagnoses(diagnosesData ) {
    var diagnosesContainer = document.querySelector('[data-diagnoses]');
    var diagnosesHTML = '';

    for (var i = 0; i < diagnosesData.length; i++) {
        var diagnosis = diagnosesData[i];
    
        var html = `
            <div class="container container3 py-2 my-2">
                <div class="col d-flex align-items-center">
                    <h6>(${diagnosis.code}) ${diagnosis.name}</h6>
                </div>
                <div class="fw-light">Тип в осмотре: ${diagnosis.type  === 'Main' ? 'Основной' : diagnosis.type === 'Concomitant' ? 'Сопутствующий' : 'Осложнение'}</div>
                <div class="fw-light">Расшифровка: ${diagnosis.description}</div>
            </div>
        `;
    
        diagnosesHTML += html;
    }
    
    diagnosesContainer.innerHTML = diagnosesHTML;
}