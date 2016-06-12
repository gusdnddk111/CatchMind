
$(document).ready(function() {
	var socket = io.connect(serverURL);
	var undoHistory = [];

	function saveActions() {
		var imgData = document.getElementById("canvas").toDataURL("image/png");
		undoHistory.push(imgData);

		$('#btn-undo').removeAttr('disabled');
	}

	function undoDraw() {

		//만약에 history에 뭔가 있다면 들어가
		if (undoHistory.length > 0) {
			var undoImg = new Image();
			$(undoImg).load(function () {
				var context = document.getElementById("canvas").getContext("2d");
				//그 전 이미지 그려줘
				context.drawImage(undoImg, 0, 0);

				var imgtodata = document.getElementById("canvas").toDataURL("image/png");
				socket.emit('toServerImg',{room:room,img:imgtodata});
			});

			//history에 하나 pop해주고
			undoImg.src = undoHistory.pop();

			//history 길이가 0이면 undo버튼 비활성화
			if (undoHistory.length == 0) {
				$('#btn-undo').attr('disabled', 'disabled');
			}
		}
	}


	function canvasInit() {
		context = document.getElementById("canvas").getContext("2d");

		//선스타일 "둥글게''
		context.lineCap = "round";
		//위에 스타일 저장
		context.save();

		//캔버스초기화
		//캔버스 색(흰색으로 덮어버림)
		context.fillStyle = '#fff';
		//캔버스크기
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		//선스타일 "둥글게" 다시 불러옴
		context.restore();
	}

// create a function to pass touch events and coordinates to drawer
	function draw(event) {

		//coors객체 -> x,y좌표의 정보를 가지고 있음
		var coors = {
			x: event.targetTouches[0].pageX,
			y: event.targetTouches[0].pageY
		};

		// pass the coordinates to the appropriate handler
		//??
		drawer[event.type](coors);
	}


	$(function () {
		var canvas, cntxt, draw = 0;
		var canvas = document.getElementById("canvas");
		cntxt = canvas.getContext("2d");


		canvasInit();

		//캔버스에다가 eventListener붙여줌
		canvas.addEventListener('touchstart', draw, false);
		canvas.addEventListener('touchmove', draw, false);
		canvas.addEventListener('touchend', draw, false);

		//drawer객체는 이런것들을 관리함
		var drawer = {
			isDrawing: false,
			touchstart: function (coors) {
				cntxt.beginPath();
				cntxt.moveTo(coors.x, coors.y);
				this.isDrawing = true;
			},

			touchmove: function (coors) {
				if (this.isDrawing) {
					cntxt.lineTo(coors.x, coors.y);
					cntxt.stroke();
				}
			},

			touchend: function (coors) {
				if (this.isDrawing) {
					this.touchmove(coors);
					this.isDrawing = false;
				}
			}
		};

		//Drawing Code
		$('#canvas').mousedown(function (e) {
			if (e.button == 0) {
				draw = 1;
				saveActions();

				cntxt.beginPath();
				cntxt.moveTo(e.pageX - $('#canvas').offset().left , e.pageY - $('#canvas').offset().top );
			}

			else {
				draw = 0;
			}
		})

			.mouseup(function (e) {
				if (e.button != 0) {
					draw = 1;
				}

				else {
					draw = 0;
					cntxt.lineTo(e.pageX - $('#canvas').offset().left + 1, e.pageY - $('#canvas').offset().top +1);
					cntxt.stroke();
					cntxt.closePath();
				}
			})

			.mousemove(function (e) {
				if (draw == 1) {
					cntxt.lineTo(e.pageX - $('#canvas').offset().left + 1, e.pageY - $('#canvas').offset().top + 1);
					cntxt.stroke();

					var imgtodata = document.getElementById("canvas").toDataURL("image/png");
					socket.emit('toServerImg',{room:room,img:imgtodata});
					
				}
			});

		//reset버튼 listener
		$('#btn-reset').click(function (e) {
			e.preventDefault();
			canvas.width = canvas.width;
			canvas.height = canvas.height;
			canvasInit();

			var imgtodata = document.getElementById("canvas").toDataURL("image/png");
			socket.emit('toServerImg',{room:room,img:imgtodata});


			//tool상태, history 초기화해줌
			$('#colors li:first').click();
			$('#brush_size').change();
			undoHistory = [];
			$('#btn-undo').attr('disabled', 'disabled');

		});

		//브러쉬사이즈 조절
		$('#brush_size').change(function (e) {
			cntxt.lineWidth = $(this).val();
		});

		//color table listener
		$('#colors li').click(function (e) {
			e.preventDefault();

			$('#colors li').removeClass('selected');
			$(this).addClass('selected');
			cntxt.strokeStyle = $(this).css('background-color');
		});

		//Undo 버튼 listener
		$('#btn-undo').click(function (e) {
			e.preventDefault();
			undoDraw();

		});

		$('#brush_size').change();
		$('#colors li:first').click();

	});

});