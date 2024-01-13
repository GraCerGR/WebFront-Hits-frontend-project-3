// Get the current URL
const url = new URL(window.location.href);
console.log(url);
// Get the query parameters from the URL
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


console.log(patient, previousInspectionId, repeat);

const urlPatient = `https://mis-api.kreosoft.space/api/patient/${patient}`;
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

const urlSpecialities = `https://mis-api.kreosoft.space/api/dictionary/speciality?size=30`;
getSpecialities(urlSpecialities, commentCount);


const urlPreviousInspections = `https://mis-api.kreosoft.space/api/patient/${patient}/inspections/search`;
getPreviousInspections(urlPreviousInspections, token)

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


document.getElementById('addConsultationBtn').addEventListener('click', function() {
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
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-consultation-btn')) {
      const consultationId = event.target.dataset.consultationId;
      const consultationElement = document.getElementById(consultationId);
      if (consultationElement) {
        consultationElement.remove();
      }
    }
  });