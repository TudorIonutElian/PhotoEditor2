	//1. Initializare variabile
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var mouse = false;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	var positionX, positionY;

	//Identificare elemente in pagina si creare legaturi 
	var pensula = document.getElementById("pensula");
	var radiera = document.getElementById("radiera");
	var color = document.getElementById("selectedColor");
	var size = document.getElementById("valoareButon");
	var reseteazaButton = document.getElementById("reseteaza");
	var saveLink = document.getElementById("saveLink");
	var linie = document.getElementById('linie');

	//Setare culori intiale
	var selectedColor = color.value;
	ctx.strokeStyle = selectedColor;

	//Set dimensiune initiala al elementului
	document.getElementById('range').addEventListener('input', function(e){
		document.getElementById('range-value-setata').style.color = "#1dd1a1";
		document.getElementById('range-value-setata').style.fontWeight = "bold";
		document.getElementById('range-value-setata').innerText = e.target.value;
	});

	var mySize = size.value;
	ctx.lineWidth = mySize;

	pensula.style.border = "2px solid red";
	canvas.style.cursor = "pointer";

	canvas.addEventListener("mousedown", pensulaDown, false);
	canvas.addEventListener("mousemove", pensulaMove, false);
	canvas.addEventListener("mouseup", pensulaUp, false);

	//4. Schimbarea culorii
	function colorChange() {
		selectedColor = color.value;
		ctx.strokeStyle = selectedColor;
	}

	//5. Schimbarea dimensiunii
	function sizeChange() {
		mySize = size.value;
		ctx.lineWidth = mySize;
	}
	//2. Setarea pensulei
	function getCoordinates(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	function pensulaDraw(canvas, positionX, positionY) {
		if(mouse) {
			ctx.lineTo(positionX, positionY);
			ctx.stroke();
			canvas.style.cursor = "pointer";
		}
	}

	function pensulaDown(e) {
		var executareSound = new sound('./sounds/executare.mp3');
		executareSound.play();
		mouse = true;
		var coordinates = getCoordinates(canvas, e);
		canvas.style.cursor = "pointer";
		positionX = coordinates.x;
		positionY = coordinates.y;
		ctx.beginPath();
		ctx.moveTo(positionX, positionY);
		ctx.lineTo(positionX, positionY);
		ctx.stroke();
	}

	function pensulaMove(e) {
		var coordinates = getCoordinates(canvas, e);
		positionX = coordinates.x;
		positionY = coordinates.y;
		pensulaDraw(canvas, positionX, positionY);
	}

	function pensulaUp() {
		mouse = false;
		canvas.style.cursor = "default";
	}

	function pensulaClick() {
		var pensulaSound = new sound('./sounds/pensula.mp3');
		pensulaSound.play();
		var pensulaColor = document.getElementById("selectedColor");
		ctx.strokeStyle = pensulaColor.value; 
		pensula.style.border = "2px solid red";
		radiera.style.border = "none";
		linie.style.border = "none";
		
		canvas.addEventListener("mousedown", pensulaDown, false);
		canvas.addEventListener("mousemove", pensulaMove, false);
		canvas.addEventListener("mouseup", pensulaUp, false);
	}

	function radieraClick() {
		var radieraSound = new sound('./sounds/radiera.mp3');
		radieraSound.play();
		ctx.strokeStyle = "white";
		radiera.style.border = "2px solid red";
		pensula.style.border = "none";
		linie.style.border = "none";
		
		canvas.addEventListener("mousedown", pensulaDown, false);
		canvas.addEventListener("mousemove", pensulaMove, false);
		canvas.addEventListener("mouseup", pensulaUp, false);
	}


	function linieClick(){
		var linieSound = new sound('./sounds/linie.mp3');
		linieSound.play();
		ctx.strokeStyle = document.getElementById('selectedColor').value;
		linie.style.border = "2px solid red";
		pensula.style.border = "none";
		radiera.style.border = "none";

		canvas.addEventListener("mousedown", pensulaDown, false);
		canvas.addEventListener("mousemove", pensulaMove, false);
		canvas.addEventListener("mouseup", pensulaUp, false);
	}

	//4. Setarre buton de reset prin reincarcarea paginii
		function reseteazaButtonClick() {
			window.location.reload();
		}

		function verificareCanvasBlank(canvasToCheck) {
			return !canvasToCheck.getContext('2d')
			  .getImageData(0, 0, canvasToCheck.width, canvasToCheck.height).data
			  .some(channel => channel !== 0);
		  }
		  function verificareCrop(){
				let cropLeft = document.getElementById('valoareButonCropLeft').value;
				let cropRight = document.getElementById('valoareButonCropRight').value;
				if(cropLeft != 0 && cropRight !=0){
					return{
						x: cropLeft,
						y: cropRight
					}
				}else{
					return{
						x: 0,
						y: 0
					}
				}
		  }

	//5. Setare buton save pentru salvearea imgaginii 
	function saveClick() {
		if(verificareCanvasBlank(canvas)){
			alert('Nu ati modificat niciun pixel, fisier inutil!');
			return;
		}
		var salveazaSound = new sound('./sounds/salveaza.mp3');
		salveazaSound.play();
		var data = canvas.toDataURL();
		saveLink.href = data;
		saveLink.download = "myImage.png";
	}

	//Event Listeners
	pensula.addEventListener("click", pensulaClick);
	radiera.addEventListener("click", radieraClick);
	color.addEventListener("change", colorChange); 
	size.addEventListener("change", sizeChange);
	reseteazaButton.addEventListener("click", reseteazaButtonClick);
	saveLink.addEventListener("click", saveClick);
	linie.addEventListener("click", linieClick);


	//Definire functie de creare a unui obiect de tip sunet
	function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "none");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function(){
			this.sound.play();
		}
		this.stop = function(){
			this.sound.pause();
		}    
	}