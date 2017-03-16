(function() {
	
	//var imagePath = '/howard-hughes/assets/';
	var imagePath = '../assets/';
	var streaming = false;
	var video = null;
	var canvas = null;
	var photo = null;
	var video = null;
	var ctx = null;
	var startButton = document.getElementById('startbutton');
	var secondButton = document.getElementById('secondButton');
	var thirdButton = document.getElementById('thirdButton');
	var fourthButton = document.getElementById('fourthButton');
	var fifthButton = document.getElementById('fifthButton');

	var videoButton = document.getElementById('videoButton');
		
	
	var foundColors = [];
	
	var canvasWidth = null;
	var canvasHeight = null;


	var imgButtons = document.querySelectorAll('.img-button');
	var imgList = [];
	for (var i = 0; i < imgButtons.length; i++) { 
			var img = new Image();
			img.src = imagePath + imgButtons[i].dataset.img;	
			imgList.push(img);
			imgButtonClick(i);
	}
	
	function imgButtonClick(elButton){
	    imgButtons[elButton].addEventListener('click', function(ev){				
	  		v.pause();
	  		dynamicLogo(imgList[elButton]);
	      	ev.preventDefault();
	    }, false);
	}
	
	
	var selectSvg = document.getElementById('selectSvg');
	var paths = selectSvg.querySelectorAll('path');
	var dynamicPathData = []
	
	for (var i = 0; i < paths.length; i++) { 
		var orgD = paths[i].getAttribute('d');
		var orgString = orgD.substring(1);
		var orgPath = orgString.split(' ');
		var pathArray = []
		
		for (var j = 0; j < orgPath.length; j++) { 
			if(orgPath[j]) {
				var xY = orgPath[j].split(',');
				xY[0] = Math.floor(xY[0]);
				xY[1] = Math.floor(xY[1]);
				pathArray.push(xY);
			}
		}
		dynamicPathData.push(pathArray);
	}
		
	var shapeData = [
		[[28,12],[65,12],[65,80]], // Left Top 
		[[65,111],[65,191],[28,191]], // Left Bottom
		[[65,80],[65,111],[28,191],[28,111],[28,12]], //Left Bar
		[[135,80],[135, 12],[172 ,12]], // Right Top
		[[172,191],[135,191],[135,111]], //Right bottom
		[[172,191],[135,111],[135, 80],[172 ,12]], // Right Bar
		[[65,80],[65,111],[99.5,95.5]], // Center L
		[[135,111],[65,111],[99.5,95.5]], // Center B
		[[135,80],[135,111],[99.5,95.5]], // Center R
		[[135,80],[65,80], [99.5,95.5]], // Center T
	]
	


	function startup() {
		canvas = document.getElementById('canvas');
		video = document.getElementById('v');
		ctx = canvas.getContext('2d');
	}
	
	var clickCount = 0;
	
	videoButton.addEventListener('click', function(){
		if(v.paused || v.ended) {
			v.play();
	
			canvasWidth = video.videoWidth;
			canvasHeight = video.videoHeight;
	
		    canvas.setAttribute('width', canvasWidth);
		    canvas.setAttribute('height', canvasHeight);
			dynamicVideo(v,ctx,video.videoWidth,video.videoHeight);
		} else {
			v.pause();
		}
		clickCount++;
	},false);
  
  
	function drawVideo(v,c,w,h) {
		if(v.paused || v.ended) return false;
		
		
		
		
		canvasWidth = w;
		canvasHeight = h;
		var halfHeight = canvasHeight/2;
		var halfWidth = canvasWidth/2;
		
		
		
	    canvas.setAttribute('width', canvasWidth);
	    canvas.setAttribute('height', (canvasHeight*2));
		
		c.drawImage(v,0,0,w,h);		
		//StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 30);
				
		
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,canvasHeight,halfWidth,canvasHeight);
		ctx.fillStyle = "#000";
		ctx.fillRect(halfWidth,canvasHeight,halfWidth,canvasHeight);
		

		var zeroWidth = 28;
		var zeroHeight = 12;
		var shapeWidth = 172 - zeroWidth;
		var shapeHeight = 191 - zeroHeight;

		//var transX = 300;
		//var transY = 150;
		var transX = 0 + (canvasWidth/2) - zeroWidth - (shapeWidth/2) ;
		var transY = 0 + (canvasHeight/2) - zeroHeight - (shapeHeight/2);

		for (var i = 0; i < shapeData.length; i++) { 		
		var pathData =	shapeData[i];
		var pathString = 'M'
		var shapeGradient;
		var pointColors = [];
		var pointX = [];
		var pointY = [];

		var reds = 0;
		var blues = 0;
		var greens = 0;

		for (var j = 0; j < pathData.length; j++) {
			var x = Math.floor(pathData[j][0]+transX);
			var y = Math.floor(pathData[j][1]+transY);

			pathString = pathString + x +' '+y+' ';
			var pixel = ctx.getImageData(x, y, 1, 1);
			var rgb = 'rgb(' + pixel.data[0] + ',' + pixel.data[1] +',' + pixel.data[2] +')';
			pointColors.push(rgb);

			reds += pixel.data[0];
			blues += pixel.data[1];
			greens += pixel.data[2];

			pointX.push(x);
			pointY.push(y);
			}

			var minX = Math.min.apply(null, pointX);
			var maxX = Math.max.apply(null, pointX);
			var minY = Math.min.apply(null, pointY);
			var maxY = Math.max.apply(null, pointY);

			shapeGradient= ctx.createLinearGradient(minX,0,maxX,0);

			var avgRed = Math.floor(reds / pathData.length);
			var avgBlue = Math.floor(blues / pathData.length);
			var avgGreen = Math.floor(greens / pathData.length);		
			var avgColor = 'rgb('+avgRed+', '+avgBlue+', '+avgGreen+')';

			//console.log(pointColors);

			//var color1 =  pointColors[Math.floor(Math.random() * pointColors.length)];
			//var color2 =  pointColors[Math.floor(Math.random() * pointColors.length)];

			var color1 =  pointColors[0];
			var color2 =  pointColors[1];


			shapeGradient.addColorStop(0,color1);
			shapeGradient.addColorStop(1,color2);


			var path = new Path2D(pathString);
			ctx.fillStyle=shapeGradient;
			ctx.fill(path);
			
			ctx.save()
				ctx.translate(- (halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
		
			ctx.save()
				ctx.translate((halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();

		}
		setTimeout(drawVideo,20,v,c,w,h);
	}
  

	function clearphoto() {
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#AAA";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var data = canvas.toDataURL('image/png');
	}
	
	function canvasH(imgEl) {	
		
		canvasWidth = imgEl.width;
		canvasHeight = imgEl.height;
		var halfHeight = canvasHeight/2;
		var halfWidth = canvasWidth/2;
		
		
		
	    canvas.setAttribute('width', canvasWidth);
	    canvas.setAttribute('height', (canvasHeight*2));

		ctx = canvas.getContext('2d');
		ctx.drawImage(imgEl, 0, 0);	
			
		//StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 30);

	
		var zeroWidth = 28;
		var zeroHeight = 12;
		var shapeWidth = 172 - zeroWidth;
		var shapeHeight = 191 - zeroHeight;
		
		//var transX = 300;
		//var transY = 150;
		var transX = 0 + (canvas.width/2) - zeroWidth - (shapeWidth/2) ;
		var transY = 0 + (canvasHeight/2) - zeroHeight - (shapeHeight/2);
			
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,canvasHeight,halfWidth,canvasHeight);
		ctx.fillStyle = "#000";
		ctx.fillRect(halfWidth,canvasHeight,halfWidth,canvasHeight);

		for (var i = 0; i < shapeData.length; i++) { 		
			var pathData =	shapeData[i];
			var pathString = 'M';
			var shapeGradient;
			var pointColors = [];
			var pointX = [];
			var pointY = [];
	
			var reds = 0;
			var blues = 0;
			var greens = 0;
		
			for (var j = 0; j < pathData.length; j++) {
				var x = Math.floor(pathData[j][0]+transX);
				var y = Math.floor(pathData[j][1]+transY);
			
				pathString = pathString + x +' '+y+' ';

				var pixel = ctx.getImageData(x, y, 1, 1);
				var rgb = 'rgb(' + pixel.data[0] + ',' + pixel.data[1] +',' + pixel.data[2] +')';
				pointColors.push(rgb);
						
				reds += pixel.data[0];
				blues += pixel.data[1];
				greens += pixel.data[2];
			
				pointX.push(x);
				pointY.push(y);
			}
		
			var minX = Math.min.apply(null, pointX);
			var maxX = Math.max.apply(null, pointX);
			var minY = Math.min.apply(null, pointY);
			var maxY = Math.max.apply(null, pointY);
		
			shapeGradient= ctx.createLinearGradient(minX,0,maxX,0);
		
			var avgRed = Math.floor(reds / pathData.length);
			var avgBlue = Math.floor(blues / pathData.length);
			var avgGreen = Math.floor(greens / pathData.length);		
			var avgColor = 'rgb('+avgRed+', '+avgBlue+', '+avgGreen+')';
		
			//console.log(pointColors);
		
			//var color1 =  pointColors[Math.floor(Math.random() * pointColors.length)];
			//var color2 =  pointColors[Math.floor(Math.random() * pointColors.length)];
	
			var color1 =  pointColors[0];
			var color2 =  pointColors[1];
	
		
			shapeGradient.addColorStop(0,color1);
			shapeGradient.addColorStop(1,color2);
		
		
			var path = new Path2D(pathString);
			ctx.fillStyle=shapeGradient;
			//ctx.fillStyle = avgColor;
			//ctx.globalAlpha = 0.9
			ctx.fill(path);
			
			//ctx.translate(1,1);
			//ctx.fill(path);
			
			ctx.save()
				ctx.translate(- (halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
			
			ctx.save()
				ctx.translate((halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
			
			

		}
	
	}
	
	
	
	/* */
	function dynamicVideo(v,c,w,h) {
		if(v.paused || v.ended) return false;
		
		canvasWidth = w;
		canvasHeight = h;
		var halfHeight = canvasHeight/2;
		var halfWidth = canvasWidth/2;
		
		
		
	    canvas.setAttribute('width', canvasWidth);
	    canvas.setAttribute('height', (canvasHeight*2));
		
		c.drawImage(v,0,0,w,h);		
		//StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 30);
				
		
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,canvasHeight,halfWidth,canvasHeight);
		ctx.fillStyle = "#000";
		ctx.fillRect(halfWidth,canvasHeight,halfWidth,canvasHeight);
		

		var zeroWidth = 28;
		var zeroHeight = 12;
		var shapeWidth = 172 - zeroWidth;
		var shapeHeight = 191 - zeroHeight;

		//var transX = 300;
		//var transY = 150;
		var transX = 0 + (canvasWidth/2) - zeroWidth - (shapeWidth/2) ;
		var transY = 0 + (canvasHeight/2) - zeroHeight - (shapeHeight/2);

		for (var i = 0; i < dynamicPathData.length; i++) { 		
		var pathData =	dynamicPathData[i];
		var pathString = 'M'
		var shapeGradient;
		var pointColors = [];
		var pointX = [];
		var pointY = [];

		var reds = 0;
		var blues = 0;
		var greens = 0;

		for (var j = 0; j < pathData.length; j++) {
			var x = Math.floor(pathData[j][0]+transX);
			var y = Math.floor(pathData[j][1]+transY);

			pathString = pathString + x +' '+y+' ';
			var pixel = ctx.getImageData(x, y, 1, 1);
			var rgb = 'rgb(' + pixel.data[0] + ',' + pixel.data[1] +',' + pixel.data[2] +')';
			pointColors.push(rgb);

			reds += pixel.data[0];
			blues += pixel.data[1];
			greens += pixel.data[2];

			pointX.push(x);
			pointY.push(y);
			}

			var minX = Math.min.apply(null, pointX);
			var maxX = Math.max.apply(null, pointX);
			var minY = Math.min.apply(null, pointY);
			var maxY = Math.max.apply(null, pointY);

			shapeGradient= ctx.createLinearGradient(minX,0,maxX,0);

			var avgRed = Math.floor(reds / pathData.length);
			var avgBlue = Math.floor(blues / pathData.length);
			var avgGreen = Math.floor(greens / pathData.length);		
			var avgColor = 'rgb('+avgRed+', '+avgBlue+', '+avgGreen+')';

			//console.log(pointColors);

			//var color1 =  pointColors[Math.floor(Math.random() * pointColors.length)];
			//var color2 =  pointColors[Math.floor(Math.random() * pointColors.length)];

			var color1 =  pointColors[0];
			var color2 =  pointColors[1];


			shapeGradient.addColorStop(0,color1);
			shapeGradient.addColorStop(1,color2);


			var path = new Path2D(pathString);
			ctx.fillStyle=shapeGradient;
			ctx.fill(path);
			
			ctx.save()
				ctx.translate(- (halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
		
			ctx.save()
				ctx.translate((halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();

		}
		setTimeout(dynamicVideo,20,v,c,w,h);
	}
	/* */
	
	function dynamicLogo(imgEl) {	
		
		canvasWidth = imgEl.width;
		canvasHeight = imgEl.height;
		var halfHeight = canvasHeight/2;
		var halfWidth = canvasWidth/2;
	
	    canvas.setAttribute('width', canvasWidth);
	    canvas.setAttribute('height', (canvasHeight*2));

		ctx = canvas.getContext('2d');
		ctx.drawImage(imgEl, 0, 0);	
			
	
		var zeroWidth = 28;
		var zeroHeight = 12;
		var shapeWidth = 172 - zeroWidth;
		var shapeHeight = 191 - zeroHeight;
		
		//var transX = 300;
		//var transY = 150;
		var transX = 0 + (canvas.width/2) - zeroWidth - (shapeWidth/2) ;
		var transY = 0 + (canvasHeight/2) - zeroHeight - (shapeHeight/2);
			
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,canvasHeight,halfWidth,canvasHeight);
		ctx.fillStyle = "#000";
		ctx.fillRect(halfWidth,canvasHeight,halfWidth,canvasHeight);

		for (var i = 0; i < dynamicPathData.length; i++) { 		
			var pathData =	dynamicPathData[i];
			var pathString = 'M';
			var shapeGradient;
			var pointColors = [];
			var pointX = [];
			var pointY = [];
	
			var reds = 0;
			var blues = 0;
			var greens = 0;
		
			for (var j = 0; j < pathData.length; j++) {
				var x = Math.floor(pathData[j][0]+transX);
				var y = Math.floor(pathData[j][1]+transY);
			
				pathString = pathString + x +' '+y+' ';

				var pixel = ctx.getImageData(x, y, 1, 1);
				var rgb = 'rgb(' + pixel.data[0] + ',' + pixel.data[1] +',' + pixel.data[2] +')';
				pointColors.push(rgb);
						
				reds += pixel.data[0];
				blues += pixel.data[1];
				greens += pixel.data[2];
			
				pointX.push(x);
				pointY.push(y);
			}
		
			var minX = Math.min.apply(null, pointX);
			var maxX = Math.max.apply(null, pointX);
			var minY = Math.min.apply(null, pointY);
			var maxY = Math.max.apply(null, pointY);
		
			shapeGradient= ctx.createLinearGradient(minX,0,maxX,0);
		
			var avgRed = Math.floor(reds / pathData.length);
			var avgBlue = Math.floor(blues / pathData.length);
			var avgGreen = Math.floor(greens / pathData.length);		
			var avgColor = 'rgb('+avgRed+', '+avgBlue+', '+avgGreen+')';
	
			var color1 =  pointColors[0];
			var color2 =  pointColors[1];
	
		
			shapeGradient.addColorStop(0,color1);
			shapeGradient.addColorStop(1,color2);
		
		
			var path = new Path2D(pathString);
			ctx.fillStyle=shapeGradient;
			ctx.fill(path);
			
			ctx.save()
				ctx.translate(- (halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
			
			ctx.save()
				ctx.translate((halfWidth/2),canvasHeight);
				var fart = new Path2D(pathString);
				ctx.fillStyle=shapeGradient;
				ctx.fill(fart);
			ctx.restore();
			
			

		}
	
	}
	
	window.addEventListener('load', startup, false);  
})();

