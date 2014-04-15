window.VariableBlock = function(dest,size,options)
{
	this.destination = getCorrectedPosition(dest);
	this.size = getCorrectedSize(size);

	this.isBeingDragged= false;

	this.image = new Image();
	this.image.src = 'img/emptyVariable.png';

	this.position = getCorrectedPosition({
			x:browserWidth/2 - this.size.width/2,
			y:browserHeight + this.size.height/2
		});

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

	var glassTitle = new Image();
	glassTitle.src = "img/wires/radialMenu/bottomLeft.png";
	var metalTitle = new Image();
	metalTitle.src = "img/wires/radialMenu/topLeft.png";
	var woodTitle = new Image();
	woodTitle.src = "img/wires/radialMenu/topRight.png";
	var cancelTitle = new Image();
	cancelTitle.src = "img/wires/radialMenu/bottomRight.png";

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
		//draw block
		//fix this stuff
		var wheelRadius = block.size.width+130;
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
				//console.log('works');
				if (this.optionTime == undefined) this.optionTimer = setTimeout(function()
				{
					block.displayOptions = true;
				},2000);

			}else
			{
				clearTimeout(this.optionTimer);
				this.optionTimer = undefined;
			}


			//check to see if the person's finger is on an display option
			if (block.displayOptions)
			{
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

				//get distance from center of finger to cetner of block
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
					//console.log(selected);
				}
			}
		}
		else
		{
			clearTimeout(this.optionTimer);
			this.optionTimer = undefined;
			this.displayOptions = false;
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
				ctx.drawImage(glassTitle,block.position.x+ block.size.width/2-wheelRadius, block.position.y + block.size.height/2);
				ctx.drawImage(metalTitle,block.position.x+ block.size.width/2-wheelRadius, block.position.y + block.size.height/2-wheelRadius);
				ctx.drawImage(woodTitle,block.position.x+ block.size.width/2, block.position.y + block.size.height/2-wheelRadius);
				ctx.drawImage(cancelTitle,block.position.x+ block.size.width/2, block.position.y + block.size.height/2);
				ctx.stroke();
				if (block.options[i].isHighlighted)
				{
					ctx.fillStyle = "#ccc";
					ctx.fill();
				}

				//draw text for debugging
				ctx.fillStyle = "#000";
				ctx.font = "24pt Arial";
				ctx.textAlign = "center";

				//ctx.fillText(i,p.x,p.y);

			}

			//console.log(block.startAngles);
		}
		ctx.fillStyle = "#000";
		ctx.drawImage(this.image,this.position.x,this.position.y,this.size.width,this.size.height);
	}


}