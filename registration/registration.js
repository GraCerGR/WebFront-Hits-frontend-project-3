const inputTel = document.getElementById('inputTel');
  
inputTel.addEventListener('input', function(e) {
  let value = e.target.value;
  value = value.replace(/\D/g, ''); // Удаляем все, кроме цифр

  // Добавляем символы "+7 (", ")" и "-" последовательно
  let formattedValue = '';
  if (value.length > 0) {
    formattedValue = '+7';
  }
  if (value.length >= 2) {
    formattedValue += ' (' + value.slice(1, 4);
  }
  if (value.length >= 5) {
    formattedValue += ') ' + value.slice(4, 7);
  }
  if (value.length >= 8) {
    formattedValue += '-' + value.slice(7, 9);
  }
  if (value.length >= 10) {
    formattedValue += '-' + value.slice(9, 11);
  }

  e.target.value = formattedValue;
});

