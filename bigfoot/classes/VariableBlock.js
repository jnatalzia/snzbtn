window.VariableBlock = function(dest,size,options,fn)
{
	this.destination = getCorrectedPosition(dest);
	this.size = getCorrectedSize(size);



	this.isBeingDragged= false;

	this.initialImageSRC = "img/empty_variable_animation.png";
	this.image = new Image();
	this.image.src = 'img/empty_variable_animation.png';

	this.position = getCorrectedPosition({
			x:browserWidth/2 - this.size.width/2,
			y:browserHeight + this.size.height/2
		});

	this.frameNumber = fn;


	this.count = 0;

	this.initialPosition = this.destination;

	this.displayOptions = false;
	this.optionTimer = undefined;

	this.optionBlockWidth = 150;
	this.optionBlockHeight = 40;
	this.optionBlockPadding = 20;

	this.isMoving = false;

	this.selectedOption=undefined;

	this.startAngles = [];

	this.value = "";
	this.radialX = 0;
	this.radialY = 0;
	this.radialMenu = new SpriteNode('img/lvl1/radialMenu.png',25,2,{width:528,height:527},{x:this.radialX,y:this.radialY},1,25,true);

	this.loadingAnimation = new SpriteNode('img/loading_animation.png',48,2,{width:201,height:201},{x:this.position.x,y:this.position.y},5,10,true);
	this.loadingAnimation.stop();

	var glassTitle = new Image();
	glassTitle.src = "img/wires/radialMenu/bottomLeft.png";
	var metalTitle = new Image();
	metalTitle.src = "img/wires/radialMenu/topLeft.png";
	var woodTitle = new Image();
	woodTitle.src = "img/wires/radialMenu/topRight.png";
	var cancelTitle = new Image();
	cancelTitle.src = "img/wires/radialMenu/bottomRight.png";
	var buttonSnd = new Audio('button');

	this.isSlotted = false;
	this.slot = undefined;

	this.pointIsInside = function(pt)
	{
		return (pt.x > this.position.x && pt.x < this.position.x + this.size.width && pt.y > this.position.y && pt.y < this.position.y + this.size.height);
	}
	//test options
	this.options = options;
	this.getCenterPos = function(){
		return {x:this.position.x + (this.size.width/2),y:this.position.y + (this.size.height/2)};
	}
	//test function
	this.sayHi = function()
	 {
	 	console.log('hi');
	 }
	 this.draw = function (frame,ctx){
		//
		var block = this;

		this.loadingAnimation.pos = {x:this.position.x + this.size.width/2 - this.loadingAnimation.size.width/2,y:this.position.y + this.size.height/2 - this.loadingAnimation.size.height/2};

		this.radialMenu.pos.x = (this.position.x + this.size.width/2) - this.radialMenu.size.width/2;
		this.radialMenu.pos.y = (this.position.y + this.size.height/2) - this.radialMenu.size.height/2;
		//draw block
		//fix this stuff
		var wheelRadius = this.radialMenu.size.width/2;
		if (frame.hands.length == 1 && frame.hands[0].fingers.length == 1)
		{

			var finger = frame.hands[0].palmPosition;
			var pos = finger;

			//console.log(finger);

			var fx = pos[0];
			var fy = pos[1];
			var fz = pos[2];
					
					
				//draw the finger on screen
			fx = map(fx,-150,150,0,browserWidth) - 15;
			fy = map(fy,100,300,0,browserHeight) + 45;

			fy = browserHeight - fy;

			ctx.fillStyle = "#000";
			ctx.fillRect(fx,fy,10,10);

			if (this.pointIsInside({x:fx,y:fy}))
			{
				if (!this.displayOptions) {
					this.loadingAnimation.pos = {x:fx - this.loadingAnimation.size.width/2, y:fy - this.loadingAnimation.size.height/2};
					this.loadingAnimation.play();
				}
				else
				{
					this.loadingAnimation.frameNumber = 0;
					this.loadingAnimation.stop();
				}
				//console.log(this.loadingAnimation.pos);
				//console.log('works');
				var self = this;
				if (this.optionTimer == undefined) this.optionTimer = setTimeout(function()
				{
					//self.checkDisplay();
					block.displayOptions = true;
					buttonSnd.play();
					//this.radialMenu.play();
				},1600);

			}else
			{
				clearTimeout(this.optionTimer);
				this.optionTimer = undefined;
				this.loadingAnimation.frameNumber = 0;
				this.loadingAnimation.stop();
			}


			//check to see if the person's finger is on an display option
			if (block.displayOptions)
			{
				this.radialX = block.position.x + block.size.width;
				this.radialY = block.position.y + block.size.height;
				
				var e = this.radialMenu;
				
				e.reversed = false;

				//console.log(e.frameNumber + ", " + e.numFrames);

				if ((e.frameNumber) == e.numFrames-1)
				{
					e.stop();
				}
				else
				{
					e.play();
				}

				var fAngle = angleFromPointToPoint(block.getCenterPos(),{x:fx,y:fy});

				//console.log(fAngle);

				for (var i = 0; i < block.startAngles.length; i++)
				{
					var a = block.startAngles[i];
					var na = block.startAngles[(i+1)%block.startAngles.length];
					if (na == 0 && i == block.startAngles.length - 1)
						na = Math.PI*2;

					if (fAngle > a && fAngle < na)
					{
						//highlight it!
						block.options[i].isHighlighted  = true;
					}
					else
						block.options[i].isHighlighted  = false;
				}

				//get distance from center of finger to center of block
				var fingVec = getSubtractedVector(block.getCenterPos(),{x:fx,y:fy});
				var fVecLen = getMagnitude(fingVec);

				if (fVecLen > wheelRadius)
				{
					var selected;
					//the person has selected an option!
					for (var i in block.options)
					{
						if (block.options[i].isHighlighted)
						{
							selected = block.options[i];
							block.displayOptions = false;
							clearTimeout(this.optionTimer);
							this.optionTimer = undefined;
							console.log(selected.title);
							if (selected.title != 'cancel') 
							{
								block.value = selected.title;

								this.image.src = selected.onSelect();
							}
							break;
						}
					}

					clearTimeout(this.optionTimer);
					this.optionTimer = undefined;
					this.displayOptions = false;
					//console.log(selected);
				}
			}
		}
		else
		{
			clearTimeout(this.optionTimer);
			this.optionTimer = undefined;
			this.displayOptions = false;
			this.loadingAnimation.frameNumber = 0;
			this.loadingAnimation.stop();
		}

		if (block.displayOptions && !block.isSlotted)
		{
			//console.log('running');
			

			var linePoints = [];
			//log where each options' angle starts
			block.startAngles = [];
			//draw lines to options
			for (var i = 0; i < block.options.length;i++)
			{
				//get points along the circle
				var division = i/block.options.length;

				var xPos = Math.cos(Math.PI*2*division) * wheelRadius;
				var yPos = Math.sin(Math.PI*2*division) * wheelRadius;

				xPos += block.getCenterPos().x;
				yPos += block.getCenterPos().y;

				linePoints.push({x:xPos,y:yPos});
			}
			for (var i = 0; i < linePoints.length;i++)
			{
				var p = linePoints[i];
				var np = linePoints[(i+1)%linePoints.length];

				//get the size of each angle in radians
				var angleSize = Math.PI*2/linePoints.length;

				//get start and end
				var sAngle = angleSize*i;
				var eAngle = sAngle+angleSize;

				block.startAngles.push(sAngle);

				//draw arc
				
				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(block.position.x + block.size.width/2,block.position.y+ block.size.height/2);
				ctx.lineTo(p.x,p.y);
				ctx.arc(block.position.x + block.size.width/2,block.position.y + block.size.height/2,wheelRadius,sAngle,eAngle);
				ctx.lineTo(np.x,np.y);
				ctx.lineTo(block.position.x + block.size.width/2,block.position.y+ block.size.height/2);
				ctx.closePath();
				//ctx.stroke();
				if (block.options[i].isHighlighted)
				{
					ctx.globalAlpha = .4;
					ctx.fillStyle = "#ccc";
					ctx.fill();
					ctx.globalAlpha = 1;
				}


				//draw text for debugging
				ctx.fillStyle = "#000";
				ctx.font = "24pt Arial";
				ctx.textAlign = "center";

				//ctx.fillText(i,p.x,p.y);

			}
			this.radialMenu.draw(ctx);

			//console.log(block.startAngles);
		}

		if (!this.displayOptions)
		{
			this.radialMenu.frameNumber = 0;
		}
		ctx.fillStyle = "#000";

		if (this.value == '')
		{
			//console.log('woo');
			this.count++;

			if (this.count % 60 == 0)
			{
				this.frameNumber++;
				if (this.frameNumber > 2) this.frameNumber = 0;
				this.count = 0;
			}

			ctx.drawImage(this.image,228 * this.frameNumber,0,228,228,this.position.x,this.position.y,this.size.width,this.size.height);
		}
		else if (!this.isSlotted) ctx.drawImage(this.image,this.position.x,this.position.y,this.size.width,this.size.height);

		this.loadingAnimation.draw(ctx);
	}


}