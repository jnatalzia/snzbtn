window.LevelSelect = function()
{
	var LevelSelect = function() // init parameters
	{
		this.dragCircle;

		var screenTitle, variables, functions, loops, conditionals, lessonOne, lessonTwo, lessonThree, lessonFour;

		//this.lessonHitBox = {pos:getCorrectedPosition({x: ,y: }),size:getCorrectedSize({x:150,y:150})};
		this.gameState = 0;
		this.STATE_TRANSITION = 1;

		this.startTimeout = undefined;

		this.loadAssets();
		
		this.mainAlpha = 0;

		this.currentCaption = captions.pick_task;
		this.textPos = getCorrectedPosition({x:50 + 110,y:350-50});
		this.timer = 0;
		this.onloaded();

		this.step = 0;
	}

	var p = LevelSelect.prototype;

	p.loadAssets = function()
	{
		//pretend i have a 1920x1080 resolution im using to test this
		this.lessonHitBox = {
			pos: getCorrectedPosition({x:0,y:0}),
			size: getCorrectedSize({width:150,height:150})
		};

		//change this title to be bigger better becuase it's a little too small atm for the rest of the levels to be able to be clicked comfortably
		this.screenTitle = new SpriteNode("img/levelSelect/title.png",1,-1,{width:1920,height:875},{x:1920/2 + 120,y:40},1,1,true);

		this.variables = new SpriteNode("img/levelSelect/variables.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.functions = new SpriteNode("img/levelSelect/functions.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.loops = new SpriteNode("img/levelSelect/loops.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.conditionals = new SpriteNode("img/levelSelect/conditionals.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});

		this.lessonOne = new SpriteNode("img/levelSelect/1.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonTwo = new SpriteNode("img/levelSelect/2.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonThree = new SpriteNode("img/levelSelect/3.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonFour = new SpriteNode("img/levelSelect/4.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonLock = new SpriteNode("img/levelSelect/lock.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});

		var whaleSize = {width:483,height:313};
		this.normalWhale = new SpriteNode("img/lvl1/whale_fly.png",162,3,whaleSize,{x:50,y:550},18,9,true);
		this.talkingWhale = new SpriteNode("img/lvl1/whale_talking.png",161,2,{width:whaleSize.width-1,height:whaleSize.height},{x:50,y:550},23,7,true);
		this.whaleSprite = this.talkingWhale;

		this.whaleSprite.play();

		this.loadingAnimation = new SpriteNode('img/loading_animation.png',48,2,{width:201,height:201},{x:0,y:0},5,10,true);
		this.loadingAnimation.stop();

		this.speechBubble = new SpriteNode('img/speechBubble.png',1,1,{width:486,height:336},{x:100,y:230},1,1,true);

	}
	p.onloaded = function()
	{
		this.tempHand = new Hand();
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;
	}
	p.update = function(ctx,frame)
	{
		//console.log(this.gameState);
		if (this.gameState != this.STATE_TRANSITION)
		{ 
			this.mainAlpha+= .0075;
			if (this.mainAlpha >1) this.mainAlpha = 1;
		}
		else
		{
			this.mainAlpha -= .0125;
			if (this.mainAlpha <= 0) levelChange(2);
		}

		//ctx.globalAlpha = this.mainAlpha;
		this.drawUI(frame,ctx);
		if (this.gameState != this.STATE_TRANSITION)
		{ this.nextLevel(frame,ctx); }

		this.timer++;
		if (this.timer > 400)
			this.currentCaption = captions.point_and_hold;
		//this.speechBubble.draw(ctx);
		if (this.currentCaption != undefined)
		{
			//console.log('running');
			var maxSize = getCorrectedSize({width:325,height:300});

			var maxwidth = maxSize.width;

			//var lines = this.currentCaption.split("\n");
			//console.log(lines);

			//if (this.gameState != this.STATE_TO_LEVEL_SELECT) var textPos = 
			//else var textPos = 
			var lineHeight = 20;
			var breakNum = 0;

			var line = ""
			var words = this.currentCaption.split(" ");

			//console.log(words);

			ctx.fillStyle = "#1E1E1E";

			var fontSize = 16;

			ctx.font=fontSize+"px GothamMedium";
			ctx.textAlign = 'left';

			this.speechBubble.draw(ctx);

			for (var i =0 ; i < words.length; i++)
			{
				var testline = line + words[i] + " ";
				var metrics = ctx.measureText(testline);
				var testwidth = metrics.width;

				//console.log(testline);

				if (testwidth > maxwidth)
				{
					ctx.fillText(testline,this.textPos.x,this.textPos.y+(breakNum*lineHeight));
					breakNum++;
					line = "";
					//words.splice(0,i);
				}
				else if (i == words.length - 1)
				{
					ctx.fillText(testline,this.textPos.x,this.textPos.y+(breakNum*lineHeight));
				}
				else
				{
					line = testline;
				}
			}
		}
		this.tempHand.draw(frame,ctx);
		//ctx.globalAlpha = 1;
	}
	p.drawFingers = function(frame,ctx)
	{
			
	}
	p.nextLevel = function(frame,ctx)
	{
		//console.log(this.tempHand);
		if(frame.hands[0])
		{
			var hand = frame.hands[0];
			var x = hand.palmPosition[0];
			var y = hand.palmPosition[1];

			var handX = map(x,-150,150,0,browserWidth);
			var handY = map(y,100,300,browserHeight,0);

			
			//console.log(handX);
			//console.log(handY);

			if(hand.fingers.length == 1)
			{
				//console.log(hand.fingers.length);

				var f = hand.palmPosition;
				var fpos = f;

				var x = fpos[0];
				var y = fpos[1];
				//console.log(hand);

				var fx = map(x,-150,150,0,browserWidth) - 15;
				var fy = map(y,100,300,browserHeight,0) - 45;

				var lhb = this.lessonHitBox; // lessonHitBox still needs to be defined as an object
				// this object should reflect the lesson level

				//console.log(lhb);

				//ctx.strokeRect(lhb.pos.x,lhb.pos.y,lhb.size.width,lhb.size.height);

				if(fx > lhb.pos.x && fx < lhb.pos.x + lhb.size.width &&
					fy > lhb.pos.y && fy < lhb.pos.y + lhb.size.height)
				{
					//still need timeout and interaction here
					var self = this;

					this.loadingAnimation.pos = {x:fx - this.loadingAnimation.size.width/2, y:fy - this.loadingAnimation.size.height/2};
					this.loadingAnimation.play();

					this.loadingAnimation.draw(ctx);


					if (this.startTimeout == undefined)
					{
						this.startTimeout = setTimeout(function()
							{
								//start game
								self.gameState = self.STATE_TRANSITION;
								console.log('start');
								
							},1600);
					}
				}
				else
				{
					clearTimeout(this.startTimeout);
					this.startTimeout = undefined;
					this.loadingAnimation.frameNumber = 0;
					this.loadingAnimation.stop();
				}

			}
			else
			{
				clearTimeout(this.startTimeout);
				this.startTimeout = undefined;
				this.loadingAnimation.frameNumber = 0;
				this.loadingAnimation.stop();
			}
		}
		else
		{
			clearTimeout(this.startTimeout);
			this.startTimeout = undefined;
			this.loadingAnimation.frameNumber = 0;
			this.loadingAnimation.stop();
		}
	}
	p.drawUI = function(frame,ctx)
	{
		//arrays of the topics and lessons for drawing the menu
		var topics = [this.variables,this.functions,this.loops,this.conditionals]; 
		var lessons = [this.lessonOne,this.lessonTwo,this.lessonThree,this.lessonFour];
		
		//set variable zeros ------ set for the correct screen resolution  currently 1920x1080
		var tpx = 320; //sets zero for the starting topic x value 1920/2 = 192 ...not sure how to responsively scale this yet
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;

		for(var i=0;i <topics.length; i++)
		{
			topics[i].alpha = this.mainAlpha;
			tpx = tpx + 300;
			tpy = 200;

			var topicsPos = getCorrectedPosition({x:tpx,y:tpy});

			topics[i].pos = topicsPos;
			topics[i].draw(ctx);
			
			for(var k= 0; k < lessons.length; k++)
			{
				lessons[k].alpha = this.mainAlpha;
				this.lessonLock.alpha = this.mainAlpha;

				lpy = lpy + tpy + 160;
				lpx = tpx + 80;

				

				var lessonsPos = getCorrectedPosition({x:lpx,y:lpy});
				lessons[k].pos = lessonsPos; 

				if (k == 0 && i == 0)
				{
					this.lessonHitBox.pos = {x:lessonsPos.x,y:lessonsPos.y};
					lessons[0].draw(ctx);
				}
				else
				{
					this.lessonLock.pos = lessonsPos;
					this.lessonLock.draw(ctx);
				}
				
				
				
			
				tpy = 0;
			}

			lpy = 0; //reset the start point of the y value for the lessons lists
		}
		//draw hands and screen title
		this.screenTitle.alpha = this.mainAlpha;
		this.screenTitle.draw(ctx);

		this.step+=0.04;
        this.whaleSprite.pos.y = this.whaleSprite.initialPos.y +( 5*(Math.sin(this.step)));

		this.whaleSprite.draw(ctx);

		

	}
	return LevelSelect;
}();