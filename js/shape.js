function shape(copy,canvas,cobj,xpobj,selectobj){
    this.copy=copy;
    this.canvas=canvas;
    this.cobj=cobj;
    this.xpobj=xpobj;
    this.selectobj=selectobj;
    this.lineWidth=1;
    this.type="stroke";
    this.shapes="line";
    this.fillColor="#000";
    this.borderColor="#000";
    this.width=canvas.width;
    this.height=canvas.height;
    this.history=[];
    this.selectFlag=true;
}
shape.prototype={
    init:function(){
        this.xpobj.css("display","none");
        this.selectobj.css("display","none");
        if (this.temp) {
            this.history.push(this.cobj.getImageData(0, 0, this.width, this.height));
            this.temp = null;
        }
        this.cobj.lineWidth=this.lineWidth;
        this.cobj.fillStyle=this.fillColor;
        this.cobj.strokeStyle=this.borderColor;
    },
    draw:function(){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                that[that.shapes](startx,starty,endx,endy);
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.closePath();
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    circle:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.beginPath();
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    five:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/3;
        this.cobj.beginPath();
        this.cobj.moveTo(x+r,y);
        for(var i=1;i<10;i++){
            if(i%2==0){
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r)
            }else{
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1)
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    pen:function(){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    xp:function(xpobj,w,h){
        var that=this;
        that.init();
        that.copy.onmousemove=function(e){
            var ox = e.offsetX;
            var oy = e.offsetY;
            xpobj.css({display:"block",width:w,height:h})
            var ox = e.offsetX;
            var oy = e.offsetY;
            var lefts = ox - w / 2;
            var tops = oy - h / 2;
            if (lefts < 0) {
                lefts = 0;
            }
            if (lefts > that.width - w) {
                lefts = that.width - w
            }
            if (tops < 0) {
                tops = 0;
            }
            if (tops > that.height - h) {
                tops = that.height - h
            }
            xpobj.css({
                left: lefts,
                top: tops
            })
        }
        that.copy.onmousedown=function() {
            that.init();
            that.copy.onmousemove = function (e) {
                var ox = e.offsetX;
                var oy = e.offsetY;
                var lefts = ox - w / 2;
                var tops = oy - h / 2;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w
                }
                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h
                }
                xpobj.css({
                    left: lefts,
                    top: tops,
                    display:"block"
                })
                that.cobj.clearRect(lefts, tops, w, h);

            }
            that.copy.onmouseup=function(){
                xpobj.css("display","none");
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.xp(xpobj,w,h)
            }
        }
    },

    select:function(selectareaobj){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
           var startx= e.offsetX;
           var starty= e.offsetY,minx,miny, w,h;
            that.init();
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    display:"block",
                    left:minx,
                    top:miny,
                    width:w,
                    height:h

                })

            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);

            }
        }

    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
            }
        }

        that.copy.onmousedown=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;
            var cy=oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
                return;
            }
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!==0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts=that.width-w
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops=that.height-h
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                });
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            }

            that.copy.onmouseup=function(){
                  that.copy.onmouseup=null;
                  that.copy.onmousemove=null;
                  that.drag(x,y,w,h,selectareaobj)

            }
        }
    }
}