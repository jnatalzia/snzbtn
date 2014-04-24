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
		
		//set variable zeros 
		var tpx = 0;
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;
		
		/*
		pos:getCorrectedPosition({x:1700,y:890}),
		size:getCorrectedSize({width:175,height:175})
		*/

		for(var i in topics)
		{
			//console.log('topics loop');

			tpx = tpx + 200;
			tpy = 100;
			

			ctx.drawImage(topics[i],tpx,tpy); // draws the topic number circles 
			
			
			for(var k in lessons)
			{
				lpy = lpy + tpy + 100;
				lpx = tpx + 55;

				
				ctx.drawImage(lessons[k],lpx,lpy); // draws the lesson number circles
		
				tpy = 0;
			}

			lpy = 0; //reset the start point of the y value for the lessons
			
		}
	}
	return LevelSelect;
}();