
var token = localStorage.getItem('token');

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

        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = '';
  
        if (response.message) {
          errorMessage.textContent = response.message;
          console.log(response.message);
        }
  
        if (response.title) {
          errorMessage.textContent = response.title;
          console.log(response.title);
        }
      })
      .catch(error => {
        console.error('Ошибка', error);
      });
  }

async function populateDictionary(dictionaries) {
    const selectDictionary = document.getElementById('select-1');
    dictionaries.forEach(dictionary => {
      var option = document.createElement('option');
      option.value = dictionary.id;
      option.text = dictionary.code;
      selectDictionary.appendChild(option);
      console.log(option.text);
    });
  }
  
  const urlDictionary = `https://mis-api.kreosoft.space/api/dictionary/icd10/roots`;
  getDictionary(urlDictionary);


  document.getElementById("submitButton").addEventListener("click", function() {
    let icdRoot = '';
    const inputDataStart = document.getElementById("inputDataStart").value;
    const inputDataEnd = document.getElementById("inputDataEnd").value;
    const selectOptions = document.getElementById("select-1").selectedOptions;
    let icdRoots = "";
    for (let i = 0; i < selectOptions.length; i++) {
        icdRoots += selectOptions[i].value;
        if (i !== selectOptions.length - 1) {
            icdRoots += "&";
        }
        if (!selectOptions.length == 0){
            icdRoot = '&icdRoots=';
        }
    }
    const url = `https://mis-api.kreosoft.space/api/report/icdrootsreport?start=${inputDataStart}&end=${inputDataEnd}${icdRoot}${icdRoots}`;
    get(url, token);
});



//--------------------------Multiselect-------------------------------------

  let multiselect_block = document.querySelectorAll(".multiselect_block");
  multiselect_block.forEach(parent => {
      let label = parent.querySelector(".field_multiselect");
      let select = parent.querySelector(".field_select");
      let text = label.innerHTML;
      select.addEventListener("change", function(element) {
          let selectedOptions = this.selectedOptions;
          label.innerHTML = "";
          for (let option of selectedOptions) {
              let button = document.createElement("button");
              button.type = "button";
              button.className = "btn_multiselect";
              button.textContent = option.text;
              button.onclick = _ => {
                  option.selected = false;
                  button.remove();
                  if (!select.selectedOptions.length) label.innerHTML = text
              };
              label.append(button);
          }
      })
  })
