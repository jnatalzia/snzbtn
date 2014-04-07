window.LevelOne = function()
{
	var LevelOne = function() //takes in all init parameters here
	{
		//toolbox vars
		this.debug = true;

		this.previousFrame = null;
		this.paused = false;
		this.pauseOnGesture = false;
		this.browserWidth= 0;
		this.browserHeight=0;
		this.circdi=20;

		this.startDragY = -1;

		this.dragCircle;

		this.STATE_CAN_PINCH = false;
		this.STATE_PINCH = false;
		this.STATE_CAN_ZOOM = false;
		this.STATE_ZOOM = false;
		this.currentMag = 100;

		this.floatingBlocks = [];

		this.STATE_CAN_DRAG = false;
		this.STATE_DRAG = 1;


		//gamestates
		this.toolboxState = 1;

		this.STATE_TOOLBOX_OPEN = 0;
		this.STATE_TOOLBOX_CLOSED= 1;
		this.STATE_TOOLBOX_CLOSING = 2;

		this.gameState = 0;
		this.STATE_WHALE_SCARED = 0;
		this.STATE_BUILDING = 1;
		this.STATE_RUNNING = 2;

		//substates (for helping hands and stuff)
		this.substate = 0;
		this.SUBSTATE_FIRST_OPEN = 1;
		this.SUBSTATE_SECOND_OPEN = 2;
		this.SUBSTATE_BG_TRANSITION = 3;


		this.startTimeout = undefined;

		this.loadAssets();

		//all init logic goes here
		var blockOptions = [
			{
				title:"cancel",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return false;
				}
			},
			{
				title:"glass",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/glassVariable.png';
				}
			},
			{
				title:"metal",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/metalVariable.png';
				}
			},
			{
				title:"wood",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/woodVariable.png';
				}
			},

		];

		//init variable blocks
		this.blocks = [
			new VariableBlock({x:300,y:200},{width:150,height:150},blockOptions),
			new VariableBlock({x:800,y:200},{width:150,height:150},blockOptions),
			new VariableBlock({x:1300,y:200},{width:150,height:150},blockOptions)
		];

		var spotSize = {width:150,height:150};
		var spotPos = [{x:550,y:980},{x:750,y:980},{x:950,y:980}];

		this.spotsToDrag = [];

		for (var i = 0; i < 3; i++)
		{
			var pos = spotPos[i];
			this.spotsToDrag.push(new DragSpot(pos.x,pos.y,spotSize.width,spotSize.height));
		}

		this.startHitBox = {
			pos:getCorrectedPosition({x:1700,y:890}),
			size:getCorrectedSize({width:175,height:175})
		};

	}

	var p = LevelOne.prototype;

	p.loadAssets = function()
	{
		var lvl1Size = {width:490,height:243};
		var lvl2Size = {width:490,height:268};
		var lvl3Size = {width:490,height:267};

		var lvl1Pos = {x:700,y:600},
		lvl2Pos = {x:700,y:350},
		lvl3Pos = {x:700,y:95};
		
		//var whaleSize = getCorrectedSize({width:350,height:222});
		var whaleSize = {width:483,height:313};

		var wood1 = new SpriteNode("img/lvl1/wood_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,true);
		
		var wood2 = new SpriteNode("img/lvl1/wood_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,true);
		
		var wood3 = new SpriteNode("img/lvl1/wood_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,true);

		var metal1 = new SpriteNode("img/lvl1/metal_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,false);
		
		var metal2 = new SpriteNode("img/lvl1/metal_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,false);
		
		var metal3 = new SpriteNode("img/lvl1/metal_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,false);

		var glass1 = new SpriteNode("img/lvl1/glass_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,false);
		
		var glass2 = new SpriteNode("img/lvl1/glass_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,false);
		
		var glass3 = new SpriteNode("img/lvl1/glass_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,false);

		var placeholder1 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl1Size,lvl1Pos,1,1,true),
		placeholder2 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl2Size,lvl2Pos,1,1,true),
		placeholder3 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl3Size,lvl3Pos,1,1,true);

		this.emptyLevels = [placeholder1,placeholder2,placeholder3];

		this.normalWhale = new SpriteNode("img/lvl1/whale_fly.png",162,3,whaleSize,{x:-500,y:400},18,9,true);

		this.whaleSprite = this.normalWhale;

		this.whaleSprite.play();

		this.lightbg = new SpriteNode("img/lvl1/bg-light.png",1,-1,{width:1920,height:875},{x:0,y:0},1,1,true);
		this.darkbg = new SpriteNode("img/lvl1/bg-dark.png",1,-1,{width:1920,height:875},{x:0,y:0},1,1,true);

		//tracks current bg
		this.currentbg = this.lightbg;

		this.houseSprites = {
			bottom_wood:wood1,
			middle_wood:wood2,
			top_wood:wood3,
			bottom_metal:metal1,
			middle_metal:metal2,
			top_metal:metal3,
			bottom_glass:glass1,
			middle_glass:glass2,
			top_glass:glass3,
		};

		//toolbox assets
		this.toolboxIMG = new Image();
		this.toolBox = undefined;
		this.toolboxIMG.src = "img/wires/toolBox/closed.png";

		this.buildBar = new Image();
		this.buildBar.src = "img/wires/buildBar.png";

		this.runBtnActive = new Image();
		this.runBtnActive.src = "img/wires/runBTN_active.png";

		this.runBtnInactive = new Image();
		this.runBtnInactive.src = "img/wires/runBTN_inactive.png";

		this.exitBtn = new Image();
		this.exitBtn.src = "img/wires/exitBTN.png";

		this.arrowIcon = new Image();
		this.arrowIcon.src = "img/wires/arrow.png";

		//helper grab hand
		this.grabHelper = new SpriteNode('img/lvl1/grab_hand.png',1,1,{width:108,height:102},{x:135,y:920},1,1,true);


		this.bees = [
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-50,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:0,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-30,y:500},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-100,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-50,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-80,y:500},49,2,true)
		];
		this.zombies = [
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-100,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:0,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-225,y:650},32,5,true)
		];

	}
	p.onloaded = function()
	{
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;

  		this.tempHand = new Hand();
	}

	p.update = function(ctx,frame)
	{
		if (this.gameState === this.STATE_WHALE_SCARED)
		{
			//move the whale
			var speed = 10;
			var destination = getCorrectedPosition({x:1400,y:400});


			if (isCloseToDestination(this.whaleSprite.pos,destination))
			{
				this.gameState = this.STATE_BUILDING;
				//console.log('working');	
				this.substate = this.SUBSTATE_FIRST_OPEN;
			}
			else
			{
				var idealVec = getSubtractedVector(this.whaleSprite.pos,destination);
				//arbitrary block speed
				idealVec = getNormalizedVector(idealVec);
				idealVec = getScaledVector(idealVec,speed);

				this.whaleSprite.pos.x += idealVec.x;
				this.whaleSprite.pos.y += idealVec.y;	

			}
		}

		for (var s in this.houseSprites)
		{
			this.houseSprites[s].isOnScreen = false;
		}
		for (var i = 0; i < this.spotsToDrag.length;i++)
		{
			var spot = this.spotsToDrag[i];
			if (spot.slottedBlock != undefined)
			{
				var block = spot.slottedBlock;
				if (block.value != '')
				{
					var level = '';
					switch(i)
					{
						case 0:
							level = 'bottom';
						break;
						case 1:
							level = 'middle';
						break;
						case 2:
							level = 'top';
						break;
					}

					var obj = this.houseSprites[level+'_'+block.value];

					this.emptyLevels[i].isOnScreen = false;
					obj.isOnScreen = true;
				}
				else
				{
					this.emptyLevels[i].isOnScreen = true;
				}
			}
			else
			{
				this.emptyLevels[i].isOnScreen = true;
			}
		}
		if (this.substate === this.SUBSTATE_BG_TRANSITION)
		{
			this.darkbg.alpha += .025;
			this.currentbg = this.darkbg;

			//console.log(this.darkbg.alpha);

			if (this.darkbg.alpha >= 1)
			{	
				
				this.substate = this.SUBSTATE_SECOND_OPEN;
			}

			this.lightbg.draw(ctx);
			
		}
		this.currentbg.draw(ctx);
		//all drawing and update logic goes here

		for (var s in this.houseSprites)
		{
			var obj = this.houseSprites[s];

			obj.draw(ctx);
		}
		for (var s in this.emptyLevels)
		{
			this.emptyLevels[s].draw(ctx);
		}

		this.whaleSprite.draw(ctx);

		if (this.debug) this.drawFingers(frame,ctx);
		this.drawUI(frame,ctx);

		this.previousFrame = frame;

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
		//DRAW COMMON UI ELEMENTS
		var toolboxPos = getCorrectedPosition({x:100,y:890});
		var toolboxSize = getCorrectedSize({width:this.toolboxIMG.width,height:this.toolboxIMG.height});

		ctx.fillStyle = "#919191";
		ctx.drawImage(this.toolboxIMG,toolboxPos.x,toolboxPos.y, toolboxSize.width, toolboxSize.height);


		var stagePos = getCorrectedPosition({x:0,y:0}),
		stageSize = getCorrectedSize({width:1920, height:875});
		ctx.strokeStyle = "#000";
		ctx.strokeRect( stagePos.x,stagePos.y,stageSize.width,stageSize.height);

		var runPos = getCorrectedPosition({x:1700,y:890}),
		runSize = getCorrectedSize({width:175,height:175});

		ctx.drawImage(this.runBtnActive,runPos.x,runPos.y, runSize.width, runSize.height);
		//placeholder toolbar
		//ctx.strokeRect(browserWidth /10 + 100, browserHeight - 150, browserWidth/3*2, 100);

		//actual toolbar
		var buildSize = getCorrectedSize({width:this.buildBar.width,height:this.buildBar.height});
		var buildPos = getCorrectedPosition({x:350, y:880});
		ctx.drawImage(this.buildBar,buildPos.x,buildPos.y,buildSize.width,buildSize.height);

		if (this.debug) ctx.strokeRect(this.startHitBox.pos.x,this.startHitBox.pos.y,this.startHitBox.size.width,this.startHitBox.size.height);


		//draw current blocks
		for (var i in this.spotsToDrag)
		{
			var s = this.spotsToDrag[i];
			var b = s.slottedBlock;

			if (b != undefined)
			{
				/*ctx.fillStyle = "#000";
				ctx.fillRect(s.x-.width/2,s.y-s.height/2,s.width,s.height);*/
				ctx.drawImage(b.image,b.position.x,b.position.y,b.size.width,b.size.height);
			}
		}

		//set dragcircleSize to toolbox size
		this.dragCircle.width = toolboxSize.width;
		this.dragCircle.height = toolboxSize.height;

		if (this.gameState === this.STATE_BUILDING)
		{
		//ui
			this.updateToolbox(frame,ctx);
			if (this.substate === this.SUBSTATE_FIRST_OPEN)
			{
				var start_pos = getCorrectedPosition({x:135,y:920});
				var destination = getCorrectedPosition({x:135,y:800});
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
			}
		}
		else if (this.gameState == this.STATE_RUNNING)
		{
			//move all the bad things
			var zombiespeed = 1.5,
			beespeed = 3;

			var destination = getCorrectedPosition({x:700,y:0});

			for (var i in this.bees)
			{
				var bee = this.bees[i];
				
				if (bee.pos.x >= destination.x)
				{
					
				}
				else
				{
					var idealVec = getSubtractedVector(bee.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,beespeed);

					bee.pos.x += idealVec.x;
					//bee.pos.y += idealVec.y;

					//return true;	
				}

				bee.draw(ctx);
			}
			for (var i in this.zombies)
			{
				var zombie = this.zombies[i];

				if (zombie.pos.x >= destination.x)
				{
					
				}
				else
				{
					var idealVec = getSubtractedVector(zombie.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,zombiespeed);

					zombie.pos.x += idealVec.x;
					//bee.pos.y += idealVec.y;

					//return true;	
				}

				zombie.draw(ctx);
			}

		}
		this.tempHand.draw(frame,ctx);
		/*pinch(frame);
		zoom(frame);*/
	}

	p.updateToolbox = function(frame,ctx)
	{
		if (this.toolboxState === this.STATE_TOOLBOX_CLOSED)
			{
				//console.log('closed');
				/*ctx.beginPath();
				//ctx.arc(dragCircle.x,dragCircle.y,dragCircle.radius,0,2*Math.PI);  // makes a Circle for the toolbox opening
				ctx.rect(toolboxPos.x,toolboxPos.y,this.dragCircle.width,this.dragCircle.height); // makes a rect for the toolbox opening
				ctx.fill();
				ctx.closePath();*/


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
						this.dragCircle.y = this.browserHeight - 50;
					}
					if (circlesIntersect(c1,this.dragCircle) && hand.fingers.length <= 0 && this.startDragY == -1)
					{
						console.log("PALM");
						this.startDragY = c1.y;
					}
					if (this.startDragY != -1)
					{
						this.dragCircle.y = c1.y;
						if (this.startDragY - c1.y > 100)
						{
							//console.log("UITHINGSHAPPEN");
							this.openToolbox();
						}
					}

					//test for intersection between one finger and startbtn
					if (hand.fingers.length == 1)
					{
						var f = hand.fingers[0];
						var fpos = f.stabilizedTipPosition;

						var x = fpos[0];
						var y = fpos[1];
						//console.log(hand);

						var fx = map(x,-150,150,0,browserWidth);
						var fy = map(y,100,300,browserHeight,0);

						var shb = this.startHitBox;


						if (fx > shb.pos.x &&
							fx < shb.pos.x + shb.size.width &&
							fy > shb.pos.y &&
							fy < shb.pos.y + shb.size.height
							)
						{
							//console.log("hover");
							if (this.startTimeout == undefined)
							{
								var self = this;
								this.startTimeout = setTimeout(function()
									{
										self.runCode();
									},2500);
							}
						}
						else
						{
							//cut the timer out
							clearTimeout(this.startTimeout);
							this.startTimeout = undefined;
						}
					}
					else
					{
						clearTimeout(this.startTimeout);
						this.startTimeout = undefined;
					}
					
				}

				//test
			}
			else if (this.toolboxState === this.STATE_TOOLBOX_OPEN)
			{
				if (this.substate == this.SUBSTATE_FIRST_OPEN)
				{
					this.substate = this.SUBSTATE_SECOND_OPEN;
				}

				ctx.globalAlpha = .75;
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,this.browserWidth,this.browserHeight);
				ctx.globalAlpha = 1;

				//draw spots to drag

				if (this.floatingBlocks.length == 0)
				{
					this.floatingBlocks = this.blocks;
					//console.log("running");
				}

				for (var i in this.floatingBlocks)
				{
					var b = this.floatingBlocks[i];

					if (isCloseToDestination(b.position,b.destination))
					{
						b.isMoving = false;
					}
					else
					{
						b.isMoving = true;
					}
					if (b.isMoving && !b.isSlotted)
					{

						var idealVec = getSubtractedVector(b.position,b.destination);
						//arbitrary block speed
						idealVec = getNormalizedVector(idealVec);
						idealVec = getScaledVector(idealVec,12);

						b.position.x += idealVec.x;
						b.position.y += idealVec.y;
						
					}
					else
					{
						//perlin noise it around;

					}
					//draw it
					b.draw(globalFrame,ctx);
				}

				if (this.previousFrame.fingers.length == 5)
				{
					//retract blocks
					var gestureRecognized = false;
					for (var i in frame.gestures)
					{
						var g = frame.gestures[i];
						if(g.type == "swipe" && !this.gestureRecognized)
						{
							if (g.direction[1] < -.75)
							{
								console.log("CLOSE");
								this.gestureRecognized = true;
								for (var i in this.floatingBlocks)
								{
									var b = this.floatingBlocks[i];
									b.isMoving = true;
									b.destination = b.initialPosition;
									this.toolboxState = this.STATE_TOOLBOX_CLOSING;
								}
							}
							//console.log(g.direction[1]);
						}
					}
					//console.log(frame.gestures);
				}

							//temp array of center locations
				var spotsToDrag = this.spotsToDrag;

				for (var i = spotsToDrag.length - 1; i >= 0; i--) {
					var s = spotsToDrag[i];

					ctx.strokeStyle = "#ff0000";
					ctx.lineWidth = 4;
					ctx.strokeRect(s.position.x - 50,s.position.y - 50,s.size.width,s.size.height);
				};

				//console.log(spotsToDrag);
				this.gestureRecognized = false;
				this.drag(globalFrame,spotsToDrag);
				//drawFingers(frame);
			}
			//fix this to impolemetn in the STATE_TOOLBOX OPEN
			else if (this.toolboxState == this.STATE_TOOLBOX_CLOSING){
				console.log('closing');

				ctx.globalAlpha = .75;
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,this.browserWidth,this.browserHeight);
				ctx.globalAlpha = 1;

				//console.log(this.spotsToDrag);

				this.toolboxState = this.STATE_TOOLBOX_CLOSED;
				//drawFingers(frame);

			}
	}
	p.drag = function(frame, spotsToDrag){
		if(frame.hands.length == 1)
		{
			var grab = frame.hands[0];
			//check for a fist or grab
			if(grab.fingers.length == 0)
			{
				var one_finger = true;
				//find the position of the fist
				var grab_position;
				grab_position = grab.palmPosition;

				var grab_positionX = map(grab_position[0], -150, 150,0,browserWidth);
				var grab_positionY = map(grab_position[1], 100, 300, browserHeight,0);

				for(var i in this.floatingBlocks)
				{
					var b = this.floatingBlocks[i];
					var bx = b.position.x;
					var by = b.position.y;

					if(b.isBeingDragged)
						{	
							b.position.x = grab_positionX - b.size.width/2;
							b.position.y = grab_positionY - b.size.height/2;

							//check for collision with spots to drag
							var distSub = getSubtractedVector(b.position,spotsToDrag[0]);
							var dist = getMagnitude(distSub);



								var touchingSpots = [];
								for (var k in spotsToDrag)
								{
									var s = spotsToDrag[k];

									var spotSize = s.size;
									var sPos = s.position;
									var sOrigin = {x:sPos.x-spotSize.width/2,y:sPos.y-spotSize.height/2};

									//debugger;

									if(!(b.position.y+b.size.height < sOrigin.y ||
									   b.position.y > sOrigin.y+spotSize.height ||
									   b.position.x > sOrigin.x+spotSize.width ||
									   b.position.x+b.size.width < sOrigin.x
									   ))
									{
										//debugger;
										touchingSpots.push(s);
									}

								}
								if (touchingSpots.length == 1)
								{
									var spot = touchingSpots[0];
									b.destination = {x:spot.position.x-spot.size.width/2,y:spot.position.y-spot.size.height/2};
									b.position = {x:spot.position.x-spot.size.width/2,y:spot.position.y-spot.size.height/2};
									
									spot.slottedBlock = b;
									//console.log(spot.slottedBlock);
									b.isSlotted = true;
									b.slot = spot;

									//console.log('touching spots = 1');
								}
								else
								{
									//console.log('touchingSpots = 0');
									b.destination = b.initialPosition;
									//console.log('called');
									b.isSlotted = false;
									if (b.slot) b.slot.slottedBlock = undefined;
									//console.log('called');
									b.slot = undefined;
								}
								//console.log(spotsToDrag[k].slottedBlock);
							if (dist > 400)
							{
								b.destination = b.initialPosition;
								//console.log('called');
								b.isSlotted = false;
								if (b.slot)	b.slot.slottedBlock = undefined;
								b.slot = undefined;
							}
					}
					else if(grab_positionX <= bx + 100 && grab_positionX >= bx - 100 && grab_positionY <= by + 100 && grab_positionY >= by - 100)
					{
							//console.log(b);
							var canDrag = true;
							for (var k in this.floatingBlocks)
							{
								var b2 = this.floatingBlocks[k];
								if (b2.isBeingDragged)
								{
									canDrag = false;
								}
							}
							if (canDrag)
								b.isBeingDragged  = true;
					}
						
					
				}
				
			}
			else
			{
				for(var i in this.floatingBlocks)
				{
					if (this.floatingBlocks[i].isBeingDragged)
					{
						var f = this.floatingBlocks[i];
						f.isBeingDragged = false;
						f.isMoving = true;
					}
				}
			}
			
		}
	}

	p.openToolbox = function()
	{
		//console.log(toolboxIMG);

		this.toolboxState = this.STATE_TOOLBOX_OPEN;
	}
	p.runCode = function()
	{
		//check if the program can run
		
		this.gameState = this.STATE_RUNNING;
		this.substate = this.SUBSTATE_BG_TRANSITION;
		this.darkbg.alpha = 0;

		//console.log(this.gameState);
		for (var i in this.bees)
		{
			this.bees[i].play();
			this.bees[i].frameNumber = Math.floor(Math.random()*97);
		}
		for (var i in this.zombies)
		{
			this.zombies[i].play();
			this.zombies[i].frameNumber = Math.floor(Math.random()*141);
		}
	}
	/*p.pinch = function(frame){
		STATE_CAN_PINCH = false;
		if(frame.hands.length == 2)
		{
			var h1 = frame.hands[0];
			var h2 = frame.hands[1];

			if(h1.fingers.length == 1 && h2.fingers.length == 1)
			{
				STATE_CAN_PINCH = true;
				gameState = STATE_CAN_PINCH;
				var f1 = frame.fingers[0];
				var f2 = frame.fingers[1];
				f1.x = f1.tipPosition[0];
				f1.y = f1.tipPosition[1];
				f2.x = f2.tipPosition[0];
				f2.y = f2.tipPosition[1];
				var sub = getSubtractedVector(f1,f2);
				var mag = getMagnitude(sub);
				//console.log('Magnitude: '+mag);
				
				if (mag < 100)
				{
					if(currentMag-mag > 0)
					{
						//console.log('pinching');
						STATE_CAN_PINCH = false;
						STATE_PINCH = true;
						gameState = STATE_PINCH;
						currentMag = mag;
						//console.log('currentMag: '+currentMag);
						if (mag < 30)
						{
							//console.log("touching");
							STATE_PINCH = false;
						}
					}
				}
			}
		}
	}
	p.zoom = function(frame){
		if(frame.hands.length == 2)
		{
			var h1 = frame.hands[0];
			var h2 = frame.hands[1];

			if(h1.fingers.length == 1 && h2.fingers.length == 1)
			{
				STATE_CAN_ZOOM = true;
				gameState = STATE_CAN_ZOOM;
				var f1 = frame.fingers[0];
				var f2 = frame.fingers[1];
				f1.x = f1.tipPosition[0];
				f1.y = f1.tipPosition[1];
				f2.x = f2.tipPosition[0];
				f2.y = f2.tipPosition[1];
				var sub = getSubtractedVector(f1,f2);
				var mag = getMagnitude(sub);
				
				if (mag > 30)
				{
					if(currentMag-mag < 0)
					{
						//console.log('zooming');
						STATE_CAN_ZOOM = false;
						STATE_ZOOM = true;
						gameState = STATE_ZOOM;
						currentMag = mag;
						//console.log('currentMag: '+currentMag);
						if (mag > 100)
						{
							//console.log("zoomed");
							STATE_ZOOM = false;
						}
					}
				}
				
				
			}
		}
	}*/

	return LevelOne;
}();