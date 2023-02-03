document.addEventListener("DOMContentLoaded", () => {
  ItcCustomSelect.create("#select-1", {
    name: "age",
    targetValue: "Молодой",
    options: [
      ["от 18 до 25", "Молодой"],
      ["от 25 до 45", "Cтар"],
      ["от 45", "Супер стар"],
    ],
    onSelected(select, option) {
      // выбранное значение
      console.log(`Выбранное значение: ${select.value}`);
      // индекс выбранной опции
      console.log(`Индекс выбранной опции: ${select.selectedIndex}`);
      // выбранный текст опции
      const text = option ? option.textContent : "";
      console.log(`Выбранный текст опции: ${text}`);
    },
  });
  document
    .querySelector(".itc-select")
    .addEventListener("itc.select.change", (e) => {
      const btn = e.target.querySelector(".itc-select__toggle");
      // выбранное значение
      console.log(`Выбранное значение: ${btn.value}`);
      // индекс выбранной опции
      console.log(`Индекс выбранной опции: ${btn.dataset.index}`);
      // выбранный текст опции
      const selected = e.target.querySelector(".itc-select__option_selected");
      const text = selected ? selected.textContent : "";
      console.log(`Выбранный текст опции: ${text}`);
    });

  //  ОТПРАВКА И ВАЛИДАЦИЯ ФОРМ
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);
  async function formSend(e) {
    e.preventDefault(); //запрещаем отправку формы

    // Валидация форм
    let error = formValidate(form);

    let formData = new FormData(form);
    formData.append("image", formImage.files[0]);

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      } else {
        alert("Ошибка");
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      formRemoveError(input);

      if (input.classList.contains("_email")) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        formAddError(input);
        error++;
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }
  //   Функция теста email
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.\w{2,8}])+$/.test(input.value);
  }

  //   Получаем инпут file в переменную
  const formImage = document.getElementById("formImage");
  //   Получаем див для превью в переменную
  const formPreview = document.getElementById("formPreview");

  //   слушаем изменения в инпуте file
  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });
  function uploadFile(file) {
    // проверяем тип файла
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Разрешены только изображения.");
      formImage.value = "";
      return;
    }
    // проверим размер файла(< 2Мб)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл должен быть менее 2 Мб.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
    };
    reader.onerror = function (e) {
      alert("Ошибка");
    };
    reader.readAsDataURL(file);
  }
});
