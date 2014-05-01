window.Intro = function()
{
	var Intro = function()
	{
		var openingVideo;
		this.loadAssets();

		this.toolboxTopPos = getCorrectedPosition({x:868,y:500});
		this.toolboxBottomPos = getCorrectedPosition({x:868,y:590});
		this.toolboxAlpha = 1;

		//get gamestates and stuff
		this.gameState = 0;

		this.STATE_INIT = 0;
		this.STATE_TOOLBOX_OPENED = 1;
		this.STATE_TRANSITION = 2;
		this.STATE_WHALE_SLEEPING = 3;
		this.STATE_WHALE_AWAKE = 4;
		this.STATE_BLOCK_DROPPED = 5;
		this.STATE_TASK_SEARCH = 6;

		this.flickerCount = 0;
		this.flickerIndex = 0;
		this.flickerCounts = [40,100,160,200,205,207];

		this.startDragY = -1;

		this.dragPos= getCorrectedPosition({x:960,y:525});

		this.blockHasBeenDragged = false;

		this.dragCircle;

		this.transitionAlpha = 0;

		this.blockVelocity = 2;
		this.step = 0;

		this.searchDestinations = [getCorrectedPosition({x:200,y:400}),getCorrectedPosition({x:-400,y:400})];
		this.destination = this.searchDestinations[0];

		this.currentCaption = undefined;
		this.timer = 0;
	}
	var p = Intro.prototype;
	p.loadAssets = function()
	{	
		openingVideo = new Video(canvas,ctx,'opening'); //load the opening video

		var whaleSize = {width:483,height:313};
		this.normalWhale = new SpriteNode("img/lvl1/whale_fly.png",162,3,whaleSize,{x:1200,y:550},18,9,true);
		this.hitWhale = new SpriteNode("img/intro/whaleHit.png",14,2,{width:whaleSize.width-1,height:whaleSize.height-12},{x:1200,y:550},7,2,true);
		this.whaleSprite = this.normalWhale;

		this.whaleSprite.play();

		this.textBox = new SpriteNode('img/text-box.png',1,1,{width:1732,height:419},{x:565,y:725},1,1,true,{width:1299,height:314});

		this.block = new SpriteNode('img/lvl1/metalVariable.png',1,1,{width:228,height:228},{x:400,y:200},1,1,true);
		//this.block = new VariableBlock({x:400,y:200},{width:150,height:150},[]);
		this.block.stop();

		this.closedHand = new SpriteNode('img/lvl1/grab_hand.png',1,1,{width:108,height:102},{x:900,y:450},1,1,true);

		this.openHand = new SpriteNode('img/open_hand.png',1,1,{width:108,height:102},{x:1250,y:this.block.pos.y},1,1,true);

		this.grabHelper = this.closedHand;


		this.toolboxTopIMG = new Image();
		this.toolBoxTop = undefined;
		this.toolboxTopIMG.src = "img/toolbox-top.png";

		this.toolboxBottomIMG = new Image();
		this.toolBoxBottom = undefined;
		this.toolboxBottomIMG.src = "img/toolbox-btm.png";
		// block info ----------------------------------------------
		var spotPos = [{x:500,y:980},{x:700,y:980},{x:900,y:980}];
		new SpriteNode('img/lvl1/box1-empty.png',1,1,{width:155,height:155},{x:spotPos[0].x-77,y:spotPos[0].y-77},1,1,true);

		this.speechBubble = new SpriteNode('img/speechBubble.png',1,1,{width:486,height:336},{x:1250,y:200},1,1,true);
	}
	p.onloaded = function()
	{	
		this.tempHand = new Hand();
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		//var pos = getCorrectedPosition({x:960,y:525});
  		this.dragCircle.x = this.dragPos.x

  		this.dragCircle.y = this.dragPos.y;
  		this.dragCircle.radius = 50;

		/*openingVideo.play();
		openingVideo.addEventListener('ended',function(){
			return('hi');
		});*/
	}
	p.drawUI = function(ctx,frame)
	{
		this.step+=0.04;
        this.whaleSprite.pos.y = this.whaleSprite.initialPos.y +( 5*(Math.sin(this.step)));
		if (this.gameState == this.STATE_INIT)
		{

			//draw the toolbox
			//DRAW COMMON UI ELEMENTS
			if (this.startDragY != -1)
			{
				var toolboxTopPos = getCorrectedPosition({x:868,y:10});
				toolboxTopPos.y=this.dragCircle.y;
			}
			else
			{
				var toolboxTopPos = {x:this.toolboxTopPos.x,y:this.toolboxTopPos.y};
			}
			var toolboxBottomPos = {x:this.toolboxBottomPos.x,y:this.toolboxBottomPos.y};
			//insert toolbox draw code here
			
			
			var toolboxTopSize = getCorrectedSize({width:this.toolboxTopIMG.width,height:this.toolboxTopIMG.height});


			

			ctx.fillStyle = "#919191";
			ctx.drawImage(this.toolboxBottomIMG,toolboxBottomPos.x,toolboxBottomPos.y, toolboxTopSize.width, toolboxTopSize.height);
			ctx.drawImage(this.toolboxTopIMG,toolboxTopPos.x,toolboxTopPos.y, toolboxTopSize.width, toolboxTopSize.height);

			if (this.flickerCount <= this.flickerCounts[this.flickerCounts.length-1])
			{
				//keep flickers
				this.flickerCount++;
				var flick = this.flickerCounts[this.flickerIndex];
				if (this.flickerCount >= flick)
				{
					this.flickerIndex++;
					console.log('flick!');
				}
			}
			else
			{
				console.log('light stays on!');
				var start_pos = getCorrectedPosition({x:900,y:450});
				var destination = getCorrectedPosition({x:900,y:350});
				var speed = 1;
				
				if (isCloseToDestination(this.grabHelper.pos,destination))
				{
					this.grabHelper.alpha -= .05;
					if (this.grabHelper.alpha <= -5)
					{
						this.grabHelper.pos = start_pos;
						this.grabHelper.alpha = 1;
					}
				}
				else
				{
					var idealVec = getSubtractedVector(this.grabHelper.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,speed);

					this.grabHelper.pos.x += idealVec.x;
					this.grabHelper.pos.y += idealVec.y;	
				}

				this.grabHelper.draw(ctx);

				//test for toolbox drag
				//this.testToolboxOpen(frame);
			}

			if (frame.hands[0])
			{
				var hand = frame.hands[0];
				var x = hand.palmPosition[0];
				var y = hand.palmPosition[1];
				//console.log(hand);

				var handX = map(x,-150,150,0,browserWidth);
				var handY = map(y,100,300,browserHeight,0);

				//console.log(handX+", "+handY);

				ctx.fillStyle = "#4CE083";
				ctx.beginPath();
				ctx.arc(handX,handY,20,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
				//check for placement over pullup
				var c1 = {};
				c1.x = handX;
				c1.y = handY;
				c1.radius = 20;
				if (hand.fingers.length > 0)
				{
					this.startDragY = -1;
					this.dragCircle.y = this.dragPos.y;
				}
				if (circlesIntersect(c1,this.dragCircle) && hand.fingers.length <= 0 && this.startDragY == -1)
				{
					console.log("PALM");
					this.startDragY = c1.y;
				}
				if (this.startDragY != -1)
				{
					this.dragCircle.y = c1.y;

					console.log(c1.y);

					if (this.startDragY - c1.y > 150)
					{
						//console.log("UITHINGSHAPPEN");
						this.openToolbox();
					}
				}

			}
			
		}
		else if (this.gameState == this.STATE_TOOLBOX_OPENED)
		{
			var toolboxTopPos = getCorrectedPosition({x:868,y:10});
			toolboxTopPos.y=this.dragCircle.y;
			var toolboxBottomPos = {x:this.toolboxBottomPos.x,y:this.toolboxBottomPos.y};
			//insert toolbox draw code here
			
			
			var toolboxTopSize = getCorrectedSize({width:this.toolboxTopIMG.width,height:this.toolboxTopIMG.height});


			this.toolboxAlpha -= .0125;

			var alpha = this.toolboxAlpha >= 0 ? this.toolboxAlpha : 0;

			ctx.fillStyle = "#919191";
			ctx.globalAlpha = alpha;
			ctx.drawImage(this.toolboxBottomIMG,toolboxBottomPos.x,toolboxBottomPos.y, toolboxTopSize.width, toolboxTopSize.height);
			ctx.drawImage(this.toolboxTopIMG,toolboxTopPos.x,toolboxTopPos.y, toolboxTopSize.width, toolboxTopSize.height);
			ctx.globalAlpha = 1;

			if (this.toolboxAlpha <= -.5)
			{
				this.gameState = this.STATE_TRANSITION;
			}
		}
		else if (this.gameState == this.STATE_TRANSITION)
		{
			
			//console.log(this.transitionAlpha);
			if (this.transitionAlpha < 1)
			{
				this.transitionAlpha += .0125;
			}
			else
			{
				this.transitionAlpha = 1;
				this.gameState = this.STATE_WHALE_SLEEPING;
				this.grabHelper.pos = getCorrectedPosition({x:this.block.pos.x+100,y:this.block.pos.y+100});
			}
			

			this.whaleSprite.alpha = this.transitionAlpha;
			this.block.alpha = this.transitionAlpha;

			this.whaleSprite.draw(ctx);
			this.block.draw(ctx);

			//ctx.globalAlpha = 1;
		}
		else if (this.gameState == this.STATE_WHALE_SLEEPING)
		{

			var start_pos = getCorrectedPosition({x:this.block.pos.x+100,y:this.block.pos.y+100});
			var destination = getCorrectedPosition({x:1250,y:this.block.pos.y});
			var speed = 5;
				
			if (isCloseToDestination(this.grabHelper.pos,destination))
			{
				this.grabHelper = this.openHand;
				//this.grabHelper.pos = {x:destination.x,y:destination.y};
				this.timer++;
				if (this.timer > 60)
				{
					
					this.grabHelper.alpha -= .05;
					if (this.grabHelper.alpha <= -5)
					{
						this.grabHelper = this.closedHand;
						this.grabHelper.pos = start_pos;
						this.grabHelper.alpha = 1;
						this.timer = 0;
						this.openHand.alpha = 1;
						
					}
				}
				
			}
			else
			{
				var idealVec = getSubtractedVector(this.grabHelper.pos,destination);
				//arbitrary block speed
				idealVec = getNormalizedVector(idealVec);
				idealVec = getScaledVector(idealVec,speed);

				this.grabHelper.pos.x += idealVec.x;
				this.grabHelper.pos.y += idealVec.y;	
			}

			

			this.whaleSprite.draw(ctx);
			this.block.draw(ctx);
			if (!this.blockHasBeenDragged) this.grabHelper.draw(ctx);
			this.testDrag(ctx,frame);
		}
		else if (this.gameState == this.STATE_BLOCK_DROPPED)
		{
			this.blockVelocity += .6;

			this.block.pos.y += this.blockVelocity;

			this.whaleSprite.draw(ctx);
			this.block.draw(ctx);


			if (this.block.pos.y + this.block.size.width/2 >= this.whaleSprite.pos.y)
			{
				this.gameState = this.STATE_WHALE_AWAKE;
				this.transitionAlpha = 1;
				this.whaleSprite = this.hitWhale;
				this.whaleSprite.play();
			}
		}
		else if (this.gameState == this.STATE_WHALE_AWAKE)
		{
			if (this.transitionAlpha >0)
			{
				this.transitionAlpha -= .025;
				this.block.alpha = this.transitionAlpha;
				this.speechBubble.alpha = 1-this.transitionAlpha;
			}
			else
			{
				this.currentCaption = captions.wake_up;
			}
			this.whaleSprite.draw(ctx);
			this.block.draw(ctx);

			

			this.timer++;
			if (this.timer > 400)
			{
				this.gameState = this.STATE_TASK_SEARCH;
				this.currentCaption = captions.snoozer_intro;
				this.whaleSprite = this.normalWhale;
				this.timer = 0;
			}
		}
		else if (this.gameState == this.STATE_TASK_SEARCH)
		{
			//make whale move
			this.whaleSprite.draw(ctx);

			this.timer++;
			if (this.timer > 300)
			{
				//start movement
				this.currentCaption = undefined;
				var speed = 10;
				//this.whaleSprite = this.sadWhale;


				if (isCloseToDestination(this.whaleSprite.pos,this.destination))
				{
					if (this.destination == this.searchDestinations[0])
					{
						this.destination = this.searchDestinations[1];
						//this.whaleSprite.pos.x -= 80;
						console.log('going back');
					}
					else
					{
						console.log('going forward');
						this.destination = this.searchDestinations[0];
						//this.whaleSprite.pos.x += 80;
					}
				}
				else
				{
					var idealVec = getSubtractedVector(this.whaleSprite.pos,this.destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,speed);

					this.whaleSprite.pos.x += idealVec.x;
					this.whaleSprite.pos.y += idealVec.y;	
					//console.log('moving');
				}
			}
			
		}

		//caption drawing
		if (this.currentCaption != undefined)
		{
			//console.log('running');

			var lines = this.currentCaption.split("\n");
			//console.log(lines);
			var textPos = getCorrectedPosition({x:1290,y:280});
			var lineHeight = 20;

			//this.textBox.draw(ctx);
			this.speechBubble.draw(ctx);

			for (var i = 0; i < lines.length;i++)
			{
				ctx.fillStyle = "#1E1E1E";

				var fontSize = (20 * .75) * 1920/window.innerWidth;

				ctx.font=fontSize+"px GothamMedium";
				ctx.textAlign = 'left';

				ctx.fillText(lines[i],textPos.x,textPos.y+(lineHeight*i));
			}
		}
		
		//var pos = getCorrectedPosition({x:960,y:525})

		//draw whale
		//this.whaleSprite.draw(ctx);
		
		//draw textbox
		//this.textBox.draw(ctx);

		//draw helper hand
		/*if (this.substate === this.SUBSTATE_FIRST_OPEN)
			{
				//this.whaleSprite = this.talkingWhale;

				var start_pos = getCorrectedPosition({x:window.innerWidth/2,y:350});
				var destination = getCorrectedPosition({x:window.innerWidth/2,y:450});
				var speed = 1;
				
				if (isCloseToDestination(this.grabHelper.pos,destination))
				{
					this.grabHelper.alpha -= .05;
					if (this.grabHelper.alpha <= -5)
					{
						this.grabHelper.pos = start_pos;
						this.grabHelper.alpha = 1;
					}
				}
				else
				{
					var idealVec = getSubtractedVector(this.grabHelper.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,speed);

					this.grabHelper.pos.x += idealVec.x;
					this.grabHelper.pos.y += idealVec.y;	
				}

				this.grabHelper.draw(ctx);
			}*/

		//draw hands
		this.tempHand.draw(frame,ctx);
		
	}
	p.testDrag = function(ctx,frame)
	{
		if(frame.hands.length == 1)
		{

			var grab = frame.hands[0];
			if(grab.fingers.length == 0)
				{

				var one_finger = true;
				//find the position of the fist
				var grab_position;
				grab_position = grab.palmPosition;

				var grab_positionX = map(grab_position[0], -150, 150,0,browserWidth);
				var grab_positionY = map(grab_position[1], 100, 300, browserHeight,0);
				var b = this.block;
				var bx = b.pos.x;
				var by = b.pos.y;

				if(b.isBeingDragged)
				{	
						b.pos.x = grab_positionX - b.size.width/2;
						b.pos.y = grab_positionY - b.size.height/2;

				}
				else if(grab_positionX <= bx + 100 && grab_positionX >= bx - 100 && grab_positionY <= by + 100 && grab_positionY >= by - 100)
				{
						//console.log(b);
						var canDrag = true;
						if (canDrag)
							b.isBeingDragged  = true;

						this.blockHasBeenDragged = true;
				}

			}
			else this.block.isBeingDragged = false;
		}
		else this.block.isBeingDragged = false;

		if (!this.block.isBeingDragged && this.block.pos.x > this.whaleSprite.pos.x)
		{
			//console.log('dropped!');
			this.gameState = this.STATE_BLOCK_DROPPED;
			this.timer = 0;
		}
	}
	p.openToolbox = function()
	{
		this.gameState = this.STATE_TOOLBOX_OPENED;

		//do some crazy stuff with the blocks
	}

	p.update = function(ctx,frame)
	{
		this.drawUI(ctx,frame);
	}
	
	return Intro;
}();