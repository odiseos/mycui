var animate, createHead, createHoras,
points = [],
vertices = [],
horas = [],
indice = 0,
indiceV = 0,
cuiLayer1, canvas1,
cuiLayer2, canvas2,
cuiLayer3, canvas3,
shadow=1,
shadowD = true,
hx = -4, hy = -4,
lineColor, headColor, backgroundColor,
w, h,
dx = 60, x=0, dxt = 60,
max=Number.MIN_VALUE, rmin=Number.MAX_VALUE, rmax=Number.MIN_VALUE, k=1, eje=0, ejeX = 0, ejeY = 0,
idAnime, negative = false, fierst = 0,
yapinto = false,
time_bet=0, value_bet, beting=false;


$.cuiChart = function(options, element)
{
    this.$el = $( element );
    this._init( options );
};

$.cuiChart.defaults = {
   lineColor: "rgb(0,255,0)",
   headColor: "rgb(0,255,0)",
   backgroundColor: "rgba(33,33,33,.9)"
};

$.cuiChart.prototype = {
    _init : function( options )
    {
        var _self = this;
        this.options = $.extend( true, {}, $.cuiChart.defaults, options );
        lineColor = this.options.lineColor;
        headColor = this.options.headColor;
        backgroundColor = this.options.backgroundColor;

        $.when( this._createChart() ).done( function() {
            _self._loadEvents();
        });
    },
    _createChart : function()
    {
        //var InterExp = navigator.userAgent.indexOf("MSIE") != -1; // Si es IE
        this.h = h = this.$el.height();
        this.w = w = this.$el.width();
        eje = this.$el.height();
        min = eje;
        var pntIni={x: 0, y: eje, xr: 0, yr: eje};
        //vertices.push(pntIni);

        this.$el.append('<canvas id="cuiLayer1" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 1; background-color: '+this.options.backgroundColor+';"></canvas>');
        this.$el.append('<canvas id="cuiLayer2" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 2;"></canvas>');
        this.$el.append('<canvas id="cuiLayer3" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 3;"></canvas>');
        this._createRequestAnimationFrame();

        canvas1 = document.getElementById("cuiLayer1");
        cuiLayer1 = canvas1.getContext("2d");
        cuiLayer1.lineCap = "round";
        cuiLayer1.strokeStyle = lineColor;
        cuiLayer1.fillStyle = headColor;
        cuiLayer1.lineWidth=2;

        canvas2 = document.getElementById("cuiLayer2");
        cuiLayer2 = canvas2.getContext("2d");
        cuiLayer2.lineCap = "round";
        cuiLayer2.strokeStyle = headColor;
        cuiLayer2.fillStyle = headColor;

        canvas3 = document.getElementById("cuiLayer3");
        cuiLayer3 = canvas3.getContext("2d");
        cuiLayer3.lineCap = "round";
        cuiLayer3.strokeStyle = "#fff"
        cuiLayer3.fillStyle = '#fff';

        this._calcWaypoints();

    },
    _loadEvents : function()
    {
        var _self = this;
       createHead = this._createHead;
       createHoras = this._createHoras;
       animate = this._animate;
       this._animate();
       $(window).on('resize', function(){
           _self.w = w = _self.$el.width();
       });
       $('#cuiLayer3').on('mousemove', function(e){
           _self._createCordenadas(e);
       });

       $('#cuiLayer3').on('mouseout', function(e){
           cuiLayer3.clearRect(0,0,w,h);
       });
    },

    _animate : function()
    {
        idAnime = requestAnimationFrame(animate);
        createHead();
        if(indice<points.length)
        {
            cuiLayer1.beginPath();
            if( points[indice].x%dx==0 && !yapinto)
            {
                cuiLayer1.arc( points[indice].x, points[indice].y, 3, 0, 2 * Math.PI, false);
                yapinto = true;
            }
            else
            {
                yapinto = false;
            }

            cuiLayer1.strokeStyle = lineColor;
            cuiLayer1.moveTo(points[indice - 1].x, points[indice - 1].y);
            cuiLayer1.lineTo(points[indice].x, points[indice].y);
            cuiLayer1.stroke();

            indice++;
        }
    },

    _calcKscala : function(){
        k = (eje-eje/2)/(max);
    },

    _calcEje : function(){
        eje = negative ? h/2 : h*3/4;
    },

    _reconstruyeChart : function()
    {
        this._calcKscala();
        cuiLayer1.clearRect(0,0,this.$el.width(), this.$el.height());

        for(var i=0; i<vertices.length-1;i++)
        {
            vertices[i].y = eje - k*vertices[i].yr;
            vertices[i+1].y = eje - k*vertices[i+1].yr;

            if(i<indiceV-1 && (i)<vertices.length)
            {
                cuiLayer1.beginPath();
                cuiLayer1.moveTo(vertices[i].x,vertices[i].y);
                cuiLayer1.lineTo(vertices[i+1].x,vertices[i+1].y);
                cuiLayer1.arc( vertices[i+1].x,vertices[i+1].y, 3, 0, 2 * Math.PI, false);
                cuiLayer1.stroke();
            }
        }
    },

    _addVerticeRandom : function()
    {
        var y = cuiChart._getRandomInt(-1.3,1.3);

        var f=new Date();
        var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
        horas.push(hora);

        if(y<0 && fierst ==0)
        {
            negative = true;
            fierst = 1;
        }
        else if(fierst==1)fierst=2;

        this._calcEje();
        this._calcKscala();
        //$('#pnt').text("{ x: "+x+", y: "+(y*k)+", yr: "+ y + ", xr: "+x+" }");
        var change = false;

        if(rmin>y) rmin=y;
        if(rmax<y)rmax=y;

        if((max<Math.abs(y)/* && Math.abs(y)>eje*/) || fierst==1)
        {
            cancelAnimationFrame(idAnime);
            max = Math.abs(y);
            var v = {x: x, y: y*k, xr: x, yr: y};
            vertices.push(v);
            this._reconstruyeChart();
            indice=1;
            points = [];
            change = true;
        }
        else
        {
            var v = {x: x, y: eje - y*k, xr: x, yr: y};
            vertices.push(v);
        }
        if(x>(w-w/20))
        {
            cancelAnimationFrame(idAnime);
            cuiLayer1.clearRect(0,0,this.$el.width(), this.$el.height());
            var temp = ((w/2) - (w/2)%dx);
            x = temp;
            for(var i=vertices.length-1; i>=vertices.length - x/dx -1; i--)
            {
                vertices[i].x = temp;
                temp-=dx;
            }

//            var tempV = [];
//            var tempH = [];
//            for(var i=vertices.length - x/dx -1; i<vertices.length; i++)
//            {
//                tempV[i - (vertices.length - x/dx -1)] = vertices[i];
//                tempH[i - (vertices.length - x/dx -1)] = horas[i];
//            }
//            vertices = tempV;
//            indiceV = vertices.length -1;
//            horas = tempH;

            var ltemp = vertices.length;
            vertices.splice(0, ltemp - x/dx -1);
            horas.splice(0, ltemp - x/dx -1);
            indiceV = vertices.length -1;

            for(var i=0; i<vertices.length-2;i++)
            {
                cuiLayer1.beginPath();
                cuiLayer1.moveTo(vertices[i].x,vertices[i].y);
                cuiLayer1.lineTo(vertices[i+1].x,vertices[i+1].y);
                cuiLayer1.arc( vertices[i+1].x,vertices[i+1].y, 3, 0, 2 * Math.PI, false);
                cuiLayer1.stroke();
            }
            indice=1;
            points = [];
            change = true;
        }


        //$('#pnt').text($('#pnt').text()+"    max: "+ max + "    min: " + min + "    eje: "+eje+ "    k: "+k);

        this._calcWaypoints();
        indiceV++;
        x+=dx;
        if(change)
        {
            this._animate();
        }
    },

    _addVertice : function(v)
    {
        vertices.push(v);
        this._calcWaypoints();
        indiceV++;
        x+=dx;
    },

    _createHead : function()
    {
        if(indice<points.length)
        {
            hx = points[indice].x;
            hy = points[indice].y;
        }

        cuiLayer2.clearRect(0,0,w,h);

        createHoras();

        cuiLayer2.beginPath();
        cuiLayer2.shadowBlur = 0;
        cuiLayer2.strokeStyle = '#00d800';
        cuiLayer2.moveTo(0,eje-rmax*k);
        cuiLayer2.lineTo(w,eje-rmax*k);
        cuiLayer2.stroke();

        cuiLayer2.beginPath();
        cuiLayer2.shadowBlur = 0;
        cuiLayer2.strokeStyle = '#d80000';
        cuiLayer2.moveTo(0,eje-rmin*k);
        cuiLayer2.lineTo(w,eje-rmin*k);
        cuiLayer2.stroke();

        if(vertices.length>1)
        {
            cuiLayer2.font = '16px "Tahoma"';
            cuiLayer2.shadowBlur = 0;
            cuiLayer2.fillStyle = headColor;
            cuiLayer2.fillText(vertices[vertices.length-1].yr, hx+15, hy-15);
            cuiLayer2.fillStyle = '#00d800';
            cuiLayer2.fillText(rmax, hx-20, eje-rmax*k-15);
            cuiLayer2.fillStyle = '#d80000';
            cuiLayer2.fillText(rmin, hx-20, eje-rmin*k+30);
            cuiLayer2.stroke();
            cuiLayer2.fill();
        }

        cuiLayer2.beginPath();
        cuiLayer2.shadowBlur = 0;
        cuiLayer2.strokeStyle = headColor;
        cuiLayer2.moveTo(0,hy);
        cuiLayer2.lineTo(w,hy);
        cuiLayer2.stroke();

        cuiLayer2.beginPath();
        cuiLayer2.shadowOffsetX = 0;
        cuiLayer2.shadowOffsetY = 0;
        cuiLayer2.shadowBlur = shadow;
        cuiLayer2.shadowColor = headColor;
        cuiLayer2.fillStyle = headColor;
        cuiLayer2.strokeStyle = headColor;
        cuiLayer2.arc(hx, hy, 4, 0, 2 * Math.PI, false);
        cuiLayer2.fill();
        cuiLayer2.stroke();

        if(beting)
        {
            cuiLayer2.beginPath();
            cuiLayer2.shadowBlur = 5;
            cuiLayer2.shadowColor = '#d80000';
            cuiLayer2.strokeStyle = '#000';
            cuiLayer2.moveTo(0,value_bet.y);
            cuiLayer2.lineTo(w,value_bet.y);
            cuiLayer2.fill();
            cuiLayer2.stroke();
        }



        if(shadowD)shadow++;
        else shadow--;
        if(shadow>10)shadowD=!shadowD;
        if(shadow<0)shadowD=!shadowD;
    },

     _createHoras : function()
    {
        var va = 0;
        for(var i=0; i<horas.length; i++)
        {
            cuiLayer2.font = '12px "Tahoma"';
            cuiLayer2.shadowBlur = 0;
            cuiLayer2.fillStyle = '#fff';
            cuiLayer2.textAlign = "center";
            cuiLayer2.fillText(horas[i], va, h-10);
            cuiLayer2.stroke();
            cuiLayer2.fill();
            va+=dxt;
        }
    },

    _createCordenadas: function(evt)
    {
        cuiLayer3.clearRect(0,0,w,h);
        var rect = canvas3.getBoundingClientRect();
        var p = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        cuiLayer3.beginPath();
        cuiLayer3.strokeStyle = 'rgba(255,255,255,.5)';
        cuiLayer3.lineWidth=.5;
        cuiLayer3.moveTo(0,p.y);
        cuiLayer3.lineTo(w,p.y);
        cuiLayer3.stroke();

        cuiLayer3.beginPath();
        cuiLayer3.strokeStyle = 'rgba(255,255,255,.5)';
        cuiLayer3.lineWidth=.5;
        cuiLayer3.moveTo(p.x,0);
        cuiLayer3.lineTo(p.x,h);
        cuiLayer3.stroke();

        cuiLayer3.font = '16px "Tahoma"';
        cuiLayer3.shadowBlur = 0;
        cuiLayer3.fillStyle = "#fff";
        cuiLayer3.fillText((eje-p.y)/k, p.x+15, p.y+30);
        cuiLayer3.stroke();
        cuiLayer3.fill();


    },

    _createBet: function(time)
    {
        cancelAnimationFrame(idAnime);
        time_bet = time;
        value_bet = vertices[vertices.length-1];
        beting = true;
        this._animate();
    },




    /////////////UTIL/////////////////
    _createRequestAnimationFrame : function()
    {
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
            var id = window.setTimeout(function () {
                callback();
            }, 17);
            return id;
        };

        if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    },

    _calcWaypoints : function() {
        if(vertices.length>1)
        {
            var waypoints = [];
            var fact = 30;
            for (var i = indiceV; i < vertices.length; i++) {
                var pt0 = vertices[i - 1];
                var pt1 = vertices[i];
                var dx = pt1.x - pt0.x;
                var dy = pt1.y - pt0.y;
                for (var j = 0; j < fact; j++) {
                    var x = pt0.x + dx * j / fact;
                    var y = pt0.y + dy * j / fact;
                    points.push({
                        x: x,
                        y: y
                    });
                }
            }
        }
    },

    _getRandomInt : function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        //return Math.random() * (max - min) + min;
    }
};


$.fn.cuiChart = function( options ) {
    this.each(function() {
            var instance = $.data( this, 'cuiChart' );
            if ( !instance ) {
                $.data( this, 'cuiChart', new $.cuiChart( options, this ) );
            }
    });
    return this;
};