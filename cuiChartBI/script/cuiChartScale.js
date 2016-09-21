var points = [], indPnt = 0,
vertices = [], indVert = 0,
horas = [], indHr = 0,

min=Number.MAX_VALUE, max=Number.MIN_VALUE,
coo_min=0, coo_max=0,min_day=0,max_day=0,
//min=-10, max=10,
pm=0, delta=0, k=0,

x=0, dx=20,

toFix = 1,

startCronometro = false, stopCronometro = false, timeCronometro = 50,

hours=0, minutos=0, segundos=0, milesimas=0, fin_hours=0, fin_segundos=0, fin_minutos=0,

yapinto = false, betingCall = false, betingPut= false, value_bet, first_endtrade=false,

lastIquals=0,

idAnime = 0,
shadowD = true, shadow=1, hx=0, hy=0;

$.cuiChartScale = function(options, element)
{
    this.$el = $( element );
    this._init( options );
};

$.cuiChartScale.defaults = {
   minColor: "#f80000",
   maxColor: "00f800",
   chartColor: "#ffffff",
   headColor: "#01A4EF",
   backgroundColor: "rgba(33,33,33,.9)",
   padding: 150,
   put: function(){},
   call: function(){},
   end_trade: function(){}
};


$.cuiChartScale.prototype = {
    _init : function( options )
    {
        var _self = this;
        this.options = $.extend( true, {}, $.cuiChartScale.defaults, options );

        minColor=this.options.minColor;
        maxColor=this.options.maxColor;
        chartColor=this.options.chartColor;
        headColor=this.options.headColor;
        backgroundColor=this.options.backgroundColor;
        padding=this.options.padding;

        $.when( this._create() ).done( function() {
            _self._loadEvent();
        });
    },

    _create : function()
    {
        this.h = h = this.$el.height();
        this.w = w = this.$el.width();
        this.eje = eje = this.$el.height()/2;

        this.$el.append('<canvas id="cuiLayer1" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 1; background-color: '+this.options.backgroundColor+';"></canvas>');
        this.$el.append('<canvas id="cuiLayer2" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 2;"></canvas>');
        this.$el.append('<canvas id="cuiLayer3" width="'+this.$el.width()+'px" height="'+this.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 3;"></canvas>');
        $.cuiChartScale._createRequestAnimationFrame();

        var canvas1 = document.getElementById("cuiLayer1");
        this.cuiLayer1 = canvas1.getContext("2d");
        this.cuiLayer1.lineCap = "round";
        this.cuiLayer1.strokeStyle = this.options.chartColor;
        this.cuiLayer1.fillStyle = this.options.headColor;
        this.cuiLayer1.lineWidth=2;
        cuiLayer1 = this.cuiLayer1;

        var canvas2 = document.getElementById("cuiLayer2");
        this.cuiLayer2 = canvas2.getContext("2d");
        this.cuiLayer2.lineCap = "round";
        this.cuiLayer2.strokeStyle = this.options.chartColor;
        this.cuiLayer2.fillStyle = this.options.headColor;
        this.cuiLayer2.lineWidth=2;
        cuiLayer2 = this.cuiLayer2;

        canvas3 = document.getElementById("cuiLayer3");
        this.cuiLayer3 = canvas3.getContext("2d");
        this.cuiLayer3.lineCap = "round";
        this.cuiLayer3.strokeStyle = this.options.chartColor;
        this.cuiLayer3.fillStyle = this.options.headColor;
        this.cuiLayer3.lineWidth=2;
        cuiLayer3 = this.cuiLayer3;
    },

    _loadEvent : function()
    {
        var _self = this;
        _drawLayer1 = this._drawLayer1;
        _drawLayer2 = this._drawLayer2;
        _drawLayer3 = this._drawLayer3;
        _animate = this._animate;
        _end_trade = this.options.end_trade;
        this._animate();

        $('#cuiLayer3').on('mousemove', function(e){
           _self._mousemoveChart(e);
        });

        $('#cuiLayer3').on('mouseout', function(e){
           cuiLayer3.clearRect(0,0,w,h);
        });

        $('#cuiCall').on('click', function(){_self._call()});
        $('#cuiPut').on('click', function(){_self._put()});
        $('#plusOperacion').on('click', function(){
            startCronometro = false, stopCronometro = false, timeCronometro = 50,
            hours=0, minutos=0, segundos=0, milesimas=0, fin_hours=0, fin_segundos=0, fin_minutos=0
            betingCall = false, betingPut= false;
            $('#cuiCall').on('click', function(){_self._call()});
            $('#cuiPut').on('click', function(){_self._put()});
            $('#plusOperacion').css('height', '0px');
            first_endtrade = false;
        });

        $(window).on('resize', function(){
            cancelAnimationFrame(idAnime);
            _self.h = h = _self.$el.height();
            _self.w = w = _self.$el.width();
            _self.eje = eje = _self.$el.height()/2;
            
            $('#cuiLayer1').remove();
            $('#cuiLayer2').remove();
            $('#cuiLayer3').remove();

            _self.$el.append('<canvas id="cuiLayer1" width="'+_self.$el.width()+'px" height="'+_self.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 1; background-color: '+_self.options.backgroundColor+';"></canvas>');
            _self.$el.append('<canvas id="cuiLayer2" width="'+_self.$el.width()+'px" height="'+_self.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 2;"></canvas>');
            _self.$el.append('<canvas id="cuiLayer3" width="'+_self.$el.width()+'px" height="'+_self.$el.height()+'px" style="position: absolute; left: 0; top: 0; z-index: 3;"></canvas>');
            $.cuiChartScale._createRequestAnimationFrame();

            var canvas1 = document.getElementById("cuiLayer1");
            _self.cuiLayer1 = canvas1.getContext("2d");
            _self.cuiLayer1.lineCap = "round";
            _self.cuiLayer1.strokeStyle = _self.options.chartColor;
            _self.cuiLayer1.fillStyle = _self.options.headColor;
            _self.cuiLayer1.lineWidth=2;
            cuiLayer1 = _self.cuiLayer1;

            var canvas2 = document.getElementById("cuiLayer2");
            _self.cuiLayer2 = canvas2.getContext("2d");
            _self.cuiLayer2.lineCap = "round";
            _self.cuiLayer2.strokeStyle = _self.options.chartColor;
            _self.cuiLayer2.fillStyle = _self.options.headColor;
            _self.cuiLayer2.lineWidth=2;
            cuiLayer2 = _self.cuiLayer2;

            canvas3 = document.getElementById("cuiLayer3");
            _self.cuiLayer3 = canvas3.getContext("2d");
            _self.cuiLayer3.lineCap = "round";
            _self.cuiLayer3.strokeStyle = _self.options.chartColor;
            _self.cuiLayer3.fillStyle = _self.options.headColor;
            _self.cuiLayer3.lineWidth=2;
            cuiLayer3 = _self.cuiLayer3;

            $('#cuiLayer3').on('mousemove', function(e){
               _self._mousemoveChart(e);
            });
            $('#cuiLayer3').on('mouseout', function(e){
               cuiLayer3.clearRect(0,0,w,h);
            });

            points = [];indPnt = 1;
            _self._calcKscala();
            _self._reconstruyeChart();
            _self._animate();
       });

    },

    _drawLayer1: function()
    {
        if(indPnt<points.length)
        {
            cuiLayer1.beginPath();
            if( points[indPnt].x%dx==0 && !yapinto)
            {
                if(betingCall) cuiLayer1.strokeStyle= '#00f800';
                else if(betingPut) cuiLayer1.strokeStyle= '#f80000';
                else cuiLayer1.strokeStyle= '#ffffff';
                cuiLayer1.arc( points[indPnt].x, points[indPnt].y, 3, 0, 2 * Math.PI, false);
                yapinto = true;
            }
            else
            {
                yapinto = false;
                //cuiLayer1.strokeStyle = chartColor;
            }
            
            cuiLayer1.moveTo(points[indPnt - 1].x, points[indPnt - 1].y);
            cuiLayer1.lineTo(points[indPnt].x, points[indPnt].y);
            cuiLayer1.stroke();

            indPnt++;
        }
    },

    _drawLayer2: function()
    {
        if(indPnt<points.length)
        {
            hx = points[indPnt].x;
            hy = points[indPnt].y;
        }
        cuiLayer2.clearRect(0,0,w,h);

        var va = 0;
        for(var i=0; i<horas.length; i++)
        {
            if(i%3==0){
                cuiLayer2.font = '12px Segoe UI';
                cuiLayer2.shadowBlur = 0;
                cuiLayer2.fillStyle = '#fff';
                cuiLayer2.textAlign = "center";
                cuiLayer2.fillText(horas[i], va, h-10);
                cuiLayer2.stroke();
                cuiLayer2.fill();
            }
            va+=dx;
        }

        if(vertices.length>1)
        {
            cuiLayer2.font = '16px Segoe UI';
            cuiLayer2.shadowBlur = 0;
            cuiLayer2.fillStyle = headColor;
            cuiLayer2.fillText(vertices[vertices.length-1].yr/*.toFixed(toFix)*/, hx+15, hy-15);
            cuiLayer2.fillStyle = '#00d800';
            cuiLayer2.fillText(max_day, hx-20, coo_max-15);
            cuiLayer2.fillStyle = '#d80000';
            cuiLayer2.fillText(min_day, hx-20, coo_min+30);
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

        cuiLayer2.beginPath();
        cuiLayer2.shadowBlur = 0;
        cuiLayer2.strokeStyle = '#00d800';
        cuiLayer2.moveTo(0,coo_max);
        cuiLayer2.lineTo(w,coo_max);
        cuiLayer2.stroke();

        cuiLayer2.beginPath();
        cuiLayer2.shadowBlur = 0;
        cuiLayer2.strokeStyle = '#d80000';
        cuiLayer2.moveTo(0,coo_min);
        cuiLayer2.lineTo(w,coo_min);
        cuiLayer2.stroke();


        /*cronometro*/
        if(startCronometro && !stopCronometro)
        {
            milesimas++;
            if(milesimas+17==100){
                segundos++;
                milesimas=0;
            }
            if(segundos==60){
                minutos++;
                segundos=0;
            }
            if(minutos==60){
                hours++;
                minutos=0;
            }
            if(segundos==fin_segundos && minutos==fin_minutos && hours==fin_hours)stopCronometro=true;
        }
        if(startCronometro && !stopCronometro){
            var seg = segundos.toString().length==1 ? "0"+segundos : segundos;
            var minut = minutos.toString().length==1 ? "0"+minutos : minutos;
            var hou = hours.toString().length==1 ? "0"+hours : hours;

            cuiLayer2.font = '55px "Segoe UI Light"';
            cuiLayer2.shadowBlur = 0;
            cuiLayer2.fillStyle = (segundos>=fin_segundos-5 && minutos==fin_minutos && hours==fin_hours) ? '#f80000' : headColor;
            cuiLayer2.fillText(hou+" : "+minut+" : "+seg, w/2, padding/3+48);
            cuiLayer2.stroke();
            cuiLayer2.fill();
        }
        if(startCronometro && stopCronometro)
        {
            if(!first_endtrade)
            {
                _end_trade();
                first_endtrade = true;
            }
            var win = 'You Tied', color=headColor;
            if(value_bet.yr<vertices[vertices.length-1].yr && betingCall)
            {
                win='You Win!!!';
                color='#00f800';
            }
            else if(value_bet.yr>vertices[vertices.length-1].yr && betingCall)
            {
                win='You Lost!!!';
                color='#f80000';
            }
            else if(value_bet.yr>vertices[vertices.length-1].yr && betingPut)
            {
                win='You Win!!!';
                color='#00f800';
            }
            else if(value_bet.yr<vertices[vertices.length-1].yr && betingPut)
            {
                win='You Lost!!!';
                color='#f80000';
            }
            else 
            {
                win = '!!!You Tied!!!';
                color=headColor;
            }
            cuiLayer2.font = '55px "Segoe UI Light"';
            cuiLayer2.shadowBlur = 0;
            cuiLayer2.fillStyle = color;
            cuiLayer2.fillText(win, w/2, padding/3+48);
            cuiLayer2.stroke();
            cuiLayer2.fill();

            if($('#plusOperacion').css('height')=='0px')$('#plusOperacion').css('height', '100%');
        }

        /*CRONOMETRO*/

        if(betingCall || betingPut)
        {
            cuiLayer2.beginPath();
            cuiLayer2.shadowBlur = 2;
            cuiLayer2.shadowColor = betingCall ? '#00d800' : '#d80000';
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

    _drawLayer3: function()
    {

    },

    _animate: function(o)
    {
        idAnime = requestAnimationFrame(_animate);
        _drawLayer1();
        _drawLayer2();
        //_drawLayer3();
    },

    _calcKscala: function()
    {
        var tmp = Math.floor(this._calcPontencia10(delta)*delta*10);
        k = tmp==0 ? 0 : (h-2*padding)/tmp;
    },

    _addVertice: function(v, min_d, max_d)
    {
        if(stopCronometro)return;
        if(vertices.length>2 && vertices[vertices.length-1].yr==v)
        {
            if(lastIquals<5)
            {
                lastIquals++;
                return;
            }
            else
            {
                lastIquals=0;
            }
        }

        var f=new Date();
        var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
        horas.push(hora);

        var cambio = false;
        if(min>v)
        {
            min = Math.min(v, (min_d || min_d==0) ? min_d : v);
            cambio = true;
        }
        if(max<v)
        {
            max = Math.max(v, (max_d || max_d==0) ? max_d : v);
            cambio = true;
        }
        min_day=min_d ? min_d : min;
        max_day=max_d ? max_d : max;
        coo_min = this._calcCoordenadas(min_day);
        coo_max = this._calcCoordenadas(max_day);
        toFix = this._calcPontencia10Max()+2;

        pm = (min+max)/2;
        delta = max-min;
        this._calcKscala();

        var new_v = {x: x, y: this._calcCoordenadas(v), xr: x, yr: v};
        vertices.push(new_v);

        if(cambio)
        {
            cancelAnimationFrame(idAnime);
            this._reconstruyeChart();
            indPnt=1;
            points = [];
        }

        if(x>(w-w/20))
        {
            cancelAnimationFrame(idAnime);
            this._reconstruyeChartX();
            cambio=true;
        }
        if(vertices.length>1)this._calcWaypoints();
        this._calcPorcientoAcierto();
        indVert++;
        x+=dx;
        if(cambio)
        {
            this._animate();
        }
    },

    _calcCoordenadas: function(v)
    {
        var tmp = pm-v;
        var tmp1 = tmp!=0 ? tmp/Math.abs(tmp) : 1;
        tmp = Math.abs(tmp);
        tmp = Math.floor(this._calcPontencia10(tmp)*tmp);
        tmp *= k*tmp1;
        return eje+tmp;
    },

    _reconstruyeChart: function()
    {
        cuiLayer1.clearRect(0,0,this.$el.width(), this.$el.height());

        for(var i=0; i<vertices.length-1;i++)
        {
            vertices[i].y = this._calcCoordenadas(vertices[i].yr);
            vertices[i+1].y = this._calcCoordenadas(vertices[i+1].yr);

            if(i<indVert-1 && (i)<vertices.length)
            {
                cuiLayer1.beginPath();
                cuiLayer1.moveTo(vertices[i].x,vertices[i].y);
                cuiLayer1.lineTo(vertices[i+1].x,vertices[i+1].y);
                cuiLayer1.arc( vertices[i+1].x,vertices[i+1].y, 3, 0, 2 * Math.PI, false);
                cuiLayer1.stroke();
            }
        }
    },

    _reconstruyeChartX: function()
    {
        cuiLayer1.clearRect(0,0,this.$el.width(), this.$el.height());
        var temp = ((w/2) - (w/2)%dx);
        x = temp;
        for(var i=vertices.length-1; i>=vertices.length - x/dx -1; i--)
        {
            vertices[i].x = temp;
            temp-=dx;
        }

        var ltemp = vertices.length;
        vertices.splice(0, ltemp - x/dx -1);
        horas.splice(0, ltemp - x/dx -1);
        indVert = vertices.length -1;

        for(var i=0; i<vertices.length-2;i++)
        {
            cuiLayer1.beginPath();
            cuiLayer1.moveTo(vertices[i].x,vertices[i].y);
            cuiLayer1.lineTo(vertices[i+1].x,vertices[i+1].y);
            cuiLayer1.arc( vertices[i+1].x,vertices[i+1].y, 3, 0, 2 * Math.PI, false);
            cuiLayer1.stroke();
        }
        indPnt=1;
        points = [];
    },

    _mousemoveChart: function(evt)
    {
        cuiLayer3.clearRect(0,0,w,h);
        var rect = canvas3.getBoundingClientRect();
        var p = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        var inverso = p.y-eje;
        inverso/=k;
        inverso/= Math.pow(10, this._calcPontencia10Max()+eje.toFixed().toString().length-1);
        inverso = -(inverso - pm);

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
        cuiLayer3.fillText(inverso.toFixed(toFix), p.x+15, p.y+30);
        cuiLayer3.stroke();
        cuiLayer3.fill();
    },

    _calcPorcientoAcierto: function()
    {
        var baj = 0;
        var sup = 0;
        
        for (i = 0; i < vertices.length; i++)
        {
            var valp =  Number(parseFloat(vertices[i].yr));
            if(valp>pm)sup++;
            else if(valp<pm) baj++;
        }
        var dPut, dCall;
        if(sup==0 && baj==0)
        {
            dPut = 50;
            dCall = 50;
        }
        else
        {
            dPut = Math.floor((100*sup)/vertices.length);
            dCall = 100-dPut;
        }

        $('#previsor .barra').css('width',dPut+'%');
        $('#previsor .barra .s_put').text(dPut+'%');
        $('#previsor .s_call').text(dCall+'%');
    },

    _stopCronometro: function()
    {
        stopCronometro = true;
    },

    _call: function()
    {
        $('#cuiCall').off();
        $('#cuiPut').off();
        cancelAnimationFrame(idAnime);
        this.options.call();
        value_bet = vertices[vertices.length-1];
        betingCall=true;
        startCronometro = true;
        var temp = this._readTime($('#timewait').val());
        fin_hours = temp.h;fin_minutos=temp.m;fin_segundos=temp.s;
        this._animate();
    },

    _put: function()
    {
        $('#cuiPut').off();
        $('#cuiCall').off();
        cancelAnimationFrame(idAnime);
        this.options.call();
        value_bet = vertices[vertices.length-1];
        betingPut=true;
        startCronometro = true;
        var temp = this._readTime($('#timewait').val());
        fin_hours = temp.h;fin_minutos=temp.m;fin_segundos=temp.s;
        this._animate();
    },
    
    _end_trade: function()
    {
        this.options.end_trade();
    },

    _resetChart: function(){

        cancelAnimationFrame(idAnime);
        points = [];indPnt = 0;
        vertices = [];indVert = 0;
        horas = [];indHr = 0;

        min=Number.MAX_VALUE;max=Number.MIN_VALUE;
        coo_min=0;coo_max=0;min_day=0;max_day=0;
        //min=-10; max=10;
        pm=0;delta=0;k=0;

        x=0;dx=20;

        toFix = 1;

        startCronometro = false;stopCronometro = false;timeCronometro = 50;

        hours=0;minutos=0;segundos=0;milesimas=0;fin_hours=0;fin_segundos=0;fin_minutos=0;

        yapinto = false;betingCall = false;betingPut= false;value_bet;

        lastIquals=0;

        idAnime = 0;
        shadowD = true;shadow=1;hx=0;hy=0;

        cuiLayer1.clearRect(0,0,w,h);
        cuiLayer2.clearRect(0,0,w,h);
        cuiLayer3.clearRect(0,0,w,h);
        this._animate();
    },


    /////////////UTIL/////////////////
    _calcWaypoints : function() {
        if(vertices.length>1)
        {
            var fact = 30;
            for (var i = indVert; i < vertices.length; i++) {
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

    _calcPontencia10: function(v)
    {
       var temp = v.toString();
       var indO = Math.max(temp.indexOf('.'), temp.indexOf(','));
       if(indO>-1 && -1<v && v<1)
       {
           var pot = 0;
           indO++;
           while(temp[indO]==0)
           {
                pot++;
                indO++;
           }
           var htemp = eje.toFixed().toString();
           var pmax = this._calcPontencia10Max();

           pot += (pmax-pot) + htemp.length-1;
           return Math.pow(10, pot);
       }
       else
       {
           var htemp = eje.toFixed().toString();
           var pow = Math.max((htemp.length-1) - v.toFixed().toString().length, 0);
           return Math.pow(10, pow);
       }
    },

    _calcPontencia10Max: function()
    {
       var v = max-pm;
       var temp = v.toString();
       var indO = Math.max(temp.indexOf('.'), temp.indexOf(','));
       if(indO>-1 && -1<v &&v<1)
       {
           var pot = 0;
           indO++;
           while(temp[indO]==0)
           {
                pot++;
                indO++;
           }
           return pot;
       }
       else
       {
           var htemp = eje.toFixed().toString();
           var pow = Math.max((htemp.length-1) - v.toFixed().toString().length, 1);
           return pow;
       }
    },

    _readTime: function(ct)
    {
        var sal = {};
        var temp = ct.split("_");
        if(temp.length>1)
        {
            sal = {
                    h: parseInt(parseInt(temp[0])/60),
                    m: parseInt(temp[0])%60,
                    s:parseInt(temp[1])
                  }
        }
        return sal;
    },

    _getRandomInt : function(min, max)
    {
        //return Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.random() * (max - min) + min;
    }

};

$.cuiChartScale._createRequestAnimationFrame = function()
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
};

$.fn.cuiChartScale = function( options ) {
    this.each(function() {
            var instance = $.data( this, 'cuiChartScale' );
            if ( !instance ) {
                $.data( this, 'cuiChartScale', new $.cuiChartScale( options, this ) );
            }
    });
    return this;
};

