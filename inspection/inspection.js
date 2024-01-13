const url = new URL(window.location.href);
console.log(url);
const params = new URLSearchParams(url.search);
var token = localStorage.getItem('token');

// Get the values of the parameters
const previousInspectionId = params.get('previousInspectionId');
const patient = params.get('patient');
const repeat = params.get('repeat');
if (repeat === 'true') {
    document.getElementById('checkedRadioSwitch').checked = true;
} else {
    document.getElementById('checkedRadioSwitch').checked = false;
    console.log(repeat);
}

const checkedRadioSwitch = document.getElementById('checkedRadioSwitch');
const selectContainer = document.getElementById('selectContainer');

if (repeat === 'true' || checkedRadioSwitch.checked) {
    selectContainer.style.display = 'block';
} else {
    selectContainer.style.display = 'none';
}

checkedRadioSwitch.addEventListener('change', function () {
    if (this.checked) {
        selectContainer.style.display = 'block';
    } else {
        selectContainer.style.display = 'none';
        selectPreviousInspections.value = '';
    }
});

let diagnosCount = 1;
let commentCount = 1;
const checkConsultation = document.getElementById('checkConsultation');
const selectSpecialties = document.getElementById('selectSpecialties1');
const consultationComment = document.getElementById('consultationComment');
const addConsultation = document.getElementById('addConsultation');

checkConsultation.addEventListener('change', function () {
    if (this.checked) {
        selectSpecialties.style.display = 'block';
        consultationComment.style.display = 'block';
        addConsultation.style.display = 'block';
    } else {
        selectSpecialties.style.display = 'none';
        consultationComment.style.display = 'none';
        addConsultation.style.display = 'none';

        const consultations = document.querySelectorAll('[id^="consultation"]');
        for (let i = 2; i < consultations.length; i++) {
            consultations[i].remove();
        }
        commentCount = 1;
    }
});


const urlSpecialities = `https://mis-api.kreosoft.space/api/dictionary/speciality?size=30`;
getSpecialities(urlSpecialities, commentCount);

const urlPreviousInspections = `https://mis-api.kreosoft.space/api/patient/${patient}/inspections/search`;
getPreviousInspections(urlPreviousInspections, token)

//const urlDiagnosis = `https://mis-api.kreosoft.space/api/dictionary/icd10?page=1&size=5`;
//getDiagnosis(urlDiagnosis);

const urlPatient = `https://mis-api.kreosoft.space/api/patient/${patient}`;
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
            document.querySelector('[data-name]').textContent = data.name;
            document.querySelector('[data-birthday]').textContent = `Дата рождения: ${data.birthday ? await formatBirthday(data.birthday.split('T')[0]) : 'Не указано'}`;
            document.querySelector('[data-gender]').textContent = data.gender === 'Male' ? '♂' : data.gender === 'Female' ? '♀' : '';
        })
        .catch(error => {
            console.error('Ошибка', error);
        });
}

async function getPreviousInspections(url, token) {
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
            populateInspections(data);
        })
        .catch(error => {
            console.error('Ошибка', error);
        });
}


async function getSpecialities(url, i) {
    return fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log(url);
            console.log(data);
            populateSpecialties(data.specialties, i);
        })
        .catch(error => {
            console.error('Ошибка', error);
        });
}



async function getDiagnosis(url, i) {
    return fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log(url);
            console.log(data);
            const datalistElement = document.getElementById(`diagnoses${i}`);
            datalistElement.innerHTML = '';
            data.records.forEach((diagnosis) => {
                const optionElement = document.createElement('option');
                optionElement.value = diagnosis.code;
                optionElement.text = diagnosis.name;
                datalistElement.appendChild(optionElement);
            });
        })
        .catch(error => {
            console.error('Ошибка', error);
        });
}


function populateInspections(inspections) {
    const selectInspections = document.getElementById('request');
    inspections.forEach(inspection => {
        const option = document.createElement('option');
        option.value = formatBirthday(inspection.date);
        option.text = inspection.diagnosis.code;
        selectInspections.appendChild(option);
    });
}

function populateSpecialties(specialties, i) {
    const selectSpecialties = document.getElementById(`selectSpecialties${i}`);
    console.log(selectSpecialties);
    specialties.forEach(specialty => {
        const option = document.createElement('option');
        option.value = specialty.id;
        option.text = specialty.name;
        selectSpecialties.appendChild(option);
    });
}

function formatBirthday(originalDate) {
    const dateParts = originalDate.split("T")[0].split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
}


//------------------------Consultation--------------------

document.getElementById('addConsultationBtn').addEventListener('click', function () {
    commentCount++;
    const consultationId = 'consultation' + commentCount;
    const newConsultation = document.createElement('div');
    newConsultation.id = consultationId;
    newConsultation.innerHTML = `
      <div class="d-flex align-items-center my-3">
        <div class="form-check form-switch col">
        </div>
        <div class="col">
          <select class="form-select" id="selectSpecialties${commentCount}" required>
          </select>
        </div>
      </div>
      <div id="${consultationId}Comment">
        <label class="form-label fw-light py-1">Комментарий</label>
        <textarea class="form-control" rows="3"></textarea>
      </div>
      <button class="btn btn-danger delete-consultation-btn my-1" data-consultation-id="${consultationId}">- Удалить консультацию</button>
    `;
    getSpecialities(urlSpecialities, commentCount);
    const consultationContainer = document.getElementById('consultation1');
    consultationContainer.parentNode.insertBefore(newConsultation, consultationContainer.nextSibling);
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-consultation-btn')) {
        const consultationId = event.target.dataset.consultationId;
        const consultationElement = document.getElementById(consultationId);
        if (consultationElement) {
            consultationElement.remove();
        }
    } else if (event.target.classList.contains('delete-diagnos-btn')) {
        const diagnosId = event.target.dataset.diagnosId;
        const diagnosElement = document.getElementById(diagnosId);
        if (diagnosElement) {
            diagnosElement.remove();
        }
    }
});

//------------------------Diagnosies--------------------
const inputElement1 = document.getElementById('selectDiagnoses1');
inputElement1.addEventListener('input', function () {
    const input = event.target.value;
    const url = `https://mis-api.kreosoft.space/api/dictionary/icd10?request=${input}&page=1&size=5`;
    getDiagnosis(url, 1);
});


document.getElementById('addDiagnosBtn').addEventListener('click', function () {
    diagnosCount++;
    const diagnosId = 'diagnos' + diagnosCount;
    const newDiagnos = document.createElement('div');
    newDiagnos.id = diagnosId;
    newDiagnos.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="col">
                <label class="form-label fw-light py-1">Болезни</label>
                <input type="text" class="form-control" placeholder="" id="selectDiagnoses${diagnosCount}" list="diagnoses${diagnosCount}">
                <datalist id="diagnoses${diagnosCount}">
                </datalist>
            </div>
        </div>
        <div id="${diagnosId}DiagnosComment">
            <textarea class="form-control my-2" rows="1"></textarea>
        </div>
        <label class="form-label fw-light py-1">Тип диагноза в осмотре</label>
        <div class="form-group">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="Radios${diagnosCount}" id="Main${diagnosCount}" value="Main">
            <label class="form-check-label">
              Основной
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="Radios${diagnosCount}" id="Concomitant${diagnosCount}" value="Concomitant" checked>
            <label class="form-check-label">
              Сопутствующий
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="Radios${diagnosCount}" id="Complication${diagnosCount}" value="Complication">
            <label class="form-check-label">
              Осложнение
            </label>
          </div>
        </div>
        <p id="diagnos1"></p>
        <div class="col my-2" id="addDiagnos">
            <button class="btn btn-danger delete-diagnos-btn my-1" data-diagnos-id="${diagnosId}">- Удалить диагноз</button>
        </div>
    `;
    const diagnosContainer = document.getElementById('diagnos1');
    diagnosContainer.parentNode.insertBefore(newDiagnos, diagnosContainer.nextSibling);

    const inputElement = document.getElementById(`selectDiagnoses${diagnosCount}`);
    inputElement.addEventListener('input', function () {
        const input = event.target.value;
        const url = `https://mis-api.kreosoft.space/api/dictionary/icd10?request=${input}&page=1&size=5`;
        getDiagnosis(url, diagnosCount);
    });
});




