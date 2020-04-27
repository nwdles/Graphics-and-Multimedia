let width = 500, // ширина изображения
    height = 0, // вычисляется на основе входящего потока
    filter = 'none',
    streaming = false; // текущая активность видеопотока

// DOM элементы
const video = document.getElementById('video');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
const startButton = document.getElementById('start-button');
const uploadButton = document.getElementById('upload-button');

uploadButton.addEventListener('change', function(e) {
  video.srcObject = null;
  video.src = null;

  const path = (window.URL || window.webkitURL).createObjectURL(uploadButton.files[0]);

  video.src = path;
  video.play();
});

startButton.addEventListener('click', function(e) {
// Получение медиапотока
navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(function(stream) {
    video.src = null;
    //Направление потока в элемент <video>
    video.srcObject = stream;
    // Запуск видео
    video.play();
  })
  .catch(function(err) {
    console.log(`Error: ${err}`);
  });
});

  // Обработчик события момента воспроизведения видеопотока
  video.addEventListener('canplay', function(e) {
    if(!streaming) {
      // Установка размеров видео
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);

      // Флаг предотвращения повторного выполнения
      streaming = true;
    }
  }, false);

  // Обработчик фильтрации
  photoFilter.addEventListener('change', function(e) {
    // Установка выбранным фильтров
    filter = e.target.value;
    // Установка фильтра для видео
    video.style.filter = filter;

    e.preventDefault(); 
  });

  // Сброс фильтров
  clearButton.addEventListener('click', function(e) {
    // Изменение на "Без фильтров"
    filter = 'none';
    // Установка фильтра
    video.style.filter = filter;
    // Сбрасываем индекс селектов
    photoFilter.selectedIndex = 0;
  });
