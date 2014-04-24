window.LevelSelect = function()
{
	var LevelSelect = function() // init parameters
	{
		this.dragCircle;

		var variables, functions, loops, conditionals, lessonOne, lessonTwo, lessonThree, lessonFour;

		this.loadAssets();
		
	}

	var p = LevelSelect.prototype;

	p.loadAssets = function()
	{
		/*  Need new images for the title and 
		var screenTitle = new Image(); // title for levelSelect
		screenTitle.src = "img/levelSelect/";
		*/

		variables = new Image(); // variables topic
		variables.src = "img/levelSelect/variables.png";

		console.log(variables);

		functions = new Image(); // funcitons topic
		functions.src = "img/levelSelect/functions.png";

		loops = new Image(); // loops topic
		loops.src = "img/levelSelect/loops.png";

		conditionals = new Image(); // conditionals topic
		conditionals.src = "img/levelSelect/conditionals.png";

		lessonOne = new Image(); // lesson one
		lessonOne.src = "img/levelSelect/1.png";

		lessonTwo = new Image(); // lesson two
		lessonTwo.src = "img/levelSelect/2.png";

		lessonThree = new Image(); // lesson three
		lessonThree.src = "img/levelSelect/3.png";

		lessonFour = new Image(); // lesson four
		lessonFour.src = "img/levelSelect/4.png";
	}
	p.onloaded = function()
	{
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;
	}
	p.update = function(ctx,frame)
	{
		this.drawUI(frame,ctx);
	}
	p.drawFingers = function(frame,ctx)
	{
		for (var i in frame.hands)
			for (var k in frame.hands[i].fingers)
			{
				var finger = frame.hands[i].fingers[k];
				var pos = finger.stabilizedTipPosition;

				var fx = pos[0];
				var fy = pos[1];
				var fz = pos[2];
						
						
					//draw the finger on screen
				fx = map(fx,-150,150,0,browserWidth);
				fy = map(fy,100,300,0,browserHeight);

				fy = browserHeight - fy;
				ctx.fillStyle = "#E04C4C";
				ctx.beginPath();
				ctx.arc(fx,fy,10,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
			}
			
	}
	p.drawUI = function(frame,ctx)
	{
		
		var topics = [variables,functions,loops,conditionals]; 
		var lessons = [lessonOne,lessonTwo,lessonThree,lessonFour];
		
		/*
		var topics = [this.variables,this.functions,this.loops,this.conditionals]; 
		var lessons = [this.lessonOne,this.lessonTwo,this.lessonThree,this.lessonFour];
		*/

		var tpx = 0;
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;


		for(var i in topics)
		{
			//console.log('loop function');
			tpx = tpx + 200;
			tpy = 100;
			console.log(topics[i]);

			ctx.drawImage(topics[i],tpx,tpy);
			/*

			ctx.fillStyle = "#E04C4C"
			ctx.beginPath();
			ctx.rect(tpx,tpy,70,50);
			ctx.fill();
			ctx.closePath();
			*/
			
			for(var k in lessons)
			{
				lpy = lpy + tpy + 100;
				lpx = tpx + 55;

				//width of topic image, divided by half the width of lesson number circle

				ctx.drawImage(lessons[k],lpx,lpy);
				/*
				//replace this with drawing the lesson images
				ctx.fillStyle = "#E04C4C"
				ctx.beginPath();
				ctx.arc(lpx,lpy,10,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
				*/
				tpy = 0;
			}

			lpy = 0;
			
		}
	}
	return LevelSelect;
}();