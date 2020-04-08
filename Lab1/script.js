var canvas_img = document.querySelector(".canvas.img"); // Присваиваем HTML-элемент canvas
//Установка размера
var c_w = parseInt(getComputedStyle(canvas_img).width);
var c_h = parseInt(getComputedStyle(canvas_img).height);
canvas_img.width = c_w;
canvas_img.height = c_h;

class CanvasEdit {
	constructor(options) {
		this.blurRadius = options.blur || 3; // Значение радиуса размытия
		
	}
	initCanvas(canvas){
		//Установка начальных значений
		this.canvas = canvas;
		// Создаем объект для рисования на холсте CanvasRenderingContext2D
		this.ctx = canvas.getContext('2d');
		let w = canvas.width;
		let h = canvas.height;

		//Сохранение значений canvas путем создания нового HTML-элемента
		this.canvas_off = document.createElement("canvas");
		this.ctx_off = this.canvas_off.getContext("2d");
		this.canvas_off.width = w;
		this.canvas_off.height = h;
		this.ctx_off.drawImage(canvas, 0, 0);
	}
	recoverCanvas(){
		//Для сброса изменений присваиваем основному canvas значения сохраненного canvas_off
		let w = this.canvas_off.width;
		let h = this.canvas_off.height;
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx.drawImage(this.canvas_off,0,0);
	}
	gBlur(blur) {
		blur = blur || this.blurRadius; //Устанавливаем радиус размытия
		let canvas = this.canvas;
		let ctx = this.ctx;
		
		let step = blur < 3 ? 1 : 2;
		ctx.globalAlpha = 0.15; //Устанавливаем прозрачность

		for (let y = -blur; y <= blur; y += step) {
			for (let x = -blur; x <= blur; x += step) {
				ctx.drawImage(canvas,x,y); //Отрисовка "прозрачных" смещенных изображений
			}
		}
		ctx.globalAlpha = 1; //Исходное значение прозрачности
	}
    blackWhite(){
		let ctx = this.ctx;
		//Получаем объект изображения
        let imageData = ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

		//Перебор пикселей изображения
        for (let i = 0; i < imageData.data.length; i += 4) {
			//Среднее значение RGB = ч/б
            const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3
            imageData.data[i] = average
            imageData.data[i + 1] = average
            imageData.data[i + 2] = average
        }
		//Отрисовываем данные из imageData на холст
        ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);		
    }
    negative(){
		let ctx = this.ctx;
		//Получаем объект изображения
        let imageData = ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

		//Перебор значений(цвета) каждого пикселя изображения
        for(var i = 0; i < imageData.data.length; i += 4)
        {

            var r = imageData.data[i]; // Красный
            var g = imageData.data[i + 1]; // Зеленый
            var b = imageData.data[i + 2]; // Синий

			//Вычитаем текущее значение цвета из 255
            var invertedRed = 255 - r;
            var invertedGreen = 255 - g;
            var invertedBlue = 255 - b;

			//Присваиваем новые значения обратно
            imageData.data[i] = invertedRed;
            imageData.data[i + 1] = invertedGreen;
            imageData.data[i + 2] = invertedBlue;
		}
		//Отрисовываем данные из imageData на холст
        ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);		
    }
	
}
/*******************************************************************************/
//Создаем объект пользовательского класса для работы с фильтрами
var canvasImg = new CanvasEdit({
	blur: 6 //Начальное значение радиуса размытия
});
//Вызовы функций при "click"
document.querySelector("#g_blur").addEventListener("click", function() {
	var blur = document.querySelector("#blur_val").value;
	canvasImg.gBlur(blur);
});
document.querySelector("#recover").addEventListener("click", function() {
	canvasImg.recoverCanvas();
});
document.querySelector("#blackandwhite").addEventListener("click", function() {
    canvasImg.blackWhite();
});
document.querySelector("#negative").addEventListener("click",function() {
    canvasImg.negative();
});
document.getElementById('downloadPNG').addEventListener('click', () => {
    const aElement = document.createElement('a')
    aElement.setAttribute('download', "image.png")
    aElement.href = canvas_img.toDataURL("image/png")
    aElement.click()
})
document.getElementById('downloadJPG').addEventListener('click', () => {
    const aElement = document.createElement('a')
    aElement.setAttribute('download', "image.jpg")
    aElement.href = canvas_img.toDataURL("image/jpg")
    aElement.click()
})
document.getElementById('downloadGIF').addEventListener('click', () => {
    const aElement = document.createElement('a')
    aElement.setAttribute('download', "image.gif")
    aElement.href = canvas_img.toDataURL("image/gif")
    aElement.click()
})
/**********************************************************************************/

document.querySelector("#open").addEventListener("click", function() {
	// установка размера изображения( + в стилях) для корректного отображения на странице
	canvas_img.width = c_w;
	canvas_img.style.width = c_w + "px";
	canvas_img.height = c_h;
	canvas_img.style.height = c_h + "px";
	openFile();
});

function openFile() {
	//Создаем скрытый элемент input для выбора файла
	var input = document.querySelector("#open_file");
	if(!input){
	    input = document.createElement('input');
		input.id = "open_file";
	}
	input.style.display = "none";
	document.body.appendChild(input);
	input.addEventListener('change', readFile, false);
	input.type = 'file';
	input.accept = 'image/*';
	//Открытие диалового окна выбора файла
	input.click();
}

function readFile() {
	var file = this.files[0]; //Получение входного изображения
	//Проверка, соответствует ли данная строка регулярному выражению
	if (!/image\/\w+/.test(file.type)) {
		alert("Необходимо выбрать изображение!");
		return;
	}
	var reader = new FileReader();
	reader.readAsDataURL(file); //Преобразование в base64
	reader.onload = function(e) { //При успешном чтении происходит отрисовка пользовательского изображения
		drawToCanvas(this.result);
	}
}

function drawToCanvas(imgData) {
	var context = canvas_img.getContext('2d'); // Создаем объект для рисования на холсте CanvasRenderingContext2D
	//Создаем новый экземпляр HTMLImageElement, иниициируем загрузку рисунка
	var img = new Image(); 
	img.src = imgData;
	//Отображение загружаемого изображения
	img.onload = function() {
		context.clearRect(0, 0, canvas_img.width, canvas_img.height); //Очищаем заданную область внутри прямоугольника (нашего canvas)
		//Масштабируем изображение (на случай, если изображение больше виличины canvas)
		var img_w = img.width > canvas_img.width ? canvas_img.width : img.width;
		var img_h = img.height > canvas_img.height ? canvas_img.height : img.height;
		// Величина масштаба. В зависимости от того, на сколько отличаются ширина/высота загружаемого от установленных значений canvas
		var scale = (img_w / img.width < img_h / img.height) ? (img_w / img.width) : (img_h / img.height); 
		img_w = img.width * scale;
		img_h = img.height * scale;
		//Установка корректного размера изображения (+ в стилях) для корректного отображения
		canvas_img.style.width = img_w + "px";
		canvas_img.style.height = img_h + "px";
		canvas_img.width = img_w;
		canvas_img.height = img_h;
		//Отрисовка изображения на холсте
		context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img_w, img_h);
		//Инициализация canvas
		canvasImg.initCanvas(canvas_img);
	}
}