$.cuiScene = function(options, element)
{
    this.$el = $( element );
    this._init( options );
};

$.cuiScene.defaults = {
   
   css: {},
   pin: "",
   duracion: 0,
   offset: 0,
   friccion: 30,
   limite: {},
   from: {
       x: null,
       y: null,
       scale: null,
       rotate: null,
       opacidad: null
   },
   to: {
       x: null,
       y: null,
       scale: null,
       rotate: null,
       opacidad: null
   },
   stopup: 0,
   stopdown: 0
};

$.cuiScene.prototype = {
    _init : function( options )
    {
        var _self = this;
        this.options = $.extend( true, {}, $.cuiScene.defaults, options );

        this.window = $(window);
        var InterExp = navigator.userAgent.indexOf("MSIE") != -1; // Si es IE
        this.h_screen = InterExp ? window.screen.height : window.innerHeight;
        this.w_screen = InterExp ? window.screen.width : window.innerWidth;
        this.w_viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.h_viewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.h_scroll = document.body.scrollHeight;

        this.scale = 1;
        this.rotate = 0;
        this.x = 0;
        this.y=0
        this.opacidad = 1;

        this.pX=0;
        this.pY=0;
        this.pRotate = 0;
        this.pScale = 1;
        this.pOpacidad = 1;

        this.puX=0;
        this.puY=0;
        this.puRotate = 0;
        this.puScale = 1;
        this.puOpacidad = 1;

        this.pdX=0;
        this.pdY=0;
        this.pdRotate = 0;
        this.pdScale = 1;
        this.pdOpacidad = 1;

        this.up=1;
        this.down=0;
        this.event_scroll = false;

        $.when( this._createScene() ).done( function() {
            _self._loadEvents();
        });
    },

    _createScene : function()
    {
        var temp = this.$el.clone();
        var tempP = this.$el.parent();

        if(this.options.pin)
        {
            this.pin = $(this.options.pin);
            this.pin.addClass('cuiPin');
        }
        if(!this.pin)
        {

            this.$el.remove();
            tempP.append('<div class="cuiPin"></div>');
            this.pin = $("div.cuiPin", tempP);
            this.pin.append(temp);
            this.$el = temp
        }

        if(this.options.duracion>0)
        {
            this.h_scroll = document.body.scrollHeight;

            var mb = this.$el.css('margin-bottom') ? this.$el.css('margin-bottom').substr(0, this.$el.css('margin-bottom').length-2) : 0;
            var padding = this.h_scroll < this.h_screen ?  this.options.duracion + Math.abs(this.options.offset) : 0;

            var pb = this.pin.css('padding-bottom').substr(0, this.pin.css('padding-bottom').length-2);
            pb = pb ? parseInt(pb) : 0;
            this.pin.css('padding-bottom', (Math.max(padding, pb))  + 'px');

            this.h_scroll = document.body.scrollHeight;
        }

        this._createPortions();

//        this.$el.css('-ms-transition-duration', '1.6s');
//        this.$el.css('-webkit-transition-duration', '1.6s');
//        this.$el.css('-moz-transition-duration', '1.6s');
//        this.$el.css('transition-duration', '1.6s');

        var s_cssini=1, r_cssini=0, x_cssini=0, y_cssini=0, o_cssini=1;
        if(this.options.from.scale!=null)s_cssini = this.options.from.scale;
        if(this.options.from.rotate!=null)r_cssini = this.options.from.rotate;
        if(this.options.from.x!=null)x_cssini = this.options.from.x;
        if(this.options.from.y!=null)y_cssini = this.options.from.y;
        if(this.options.from.opacidad!=null)o_cssini = this.options.from.opacidad;
        this.$el.css('-ms-transform', 'scale('+s_cssini+','+s_cssini+') ' + 'rotate('+r_cssini+'deg) ' + 'translate('+x_cssini+'px, '+y_cssini+'px)');
        this.$el.css('-webkit-transform', 'scale('+s_cssini+','+s_cssini+') ' + 'rotate('+r_cssini+'deg) ' + 'translate('+x_cssini+'px, '+y_cssini+'px)');
        this.$el.css('-moz-transform', 'scale('+s_cssini+','+s_cssini+') ' + 'rotate('+r_cssini+'deg) ' + 'translate('+x_cssini+'px, '+y_cssini+'px)');
        this.$el.css('transform', 'scale('+s_cssini+','+s_cssini+') ' + 'rotate('+r_cssini+'deg) ' + 'translate('+x_cssini+'px, '+y_cssini+'px)');
        if(this.options.from.opacidad!=null)this.$el.css('opacity', o_cssini);
        this._scrollControl(1, this.window.scrollTop());
    },

    _loadEvents : function()
    {
        var _self = this;
    },

    _scrollControl: function(move_scroll, scrollTop){
        var o = this;
        if(scrollTop-(o.pin.offset().top - o.options.offset) >= 0 && scrollTop-(o.pin.offset().top - o.options.offset) <= o.options.duracion )
        {
            var hay = false;
            var scale = "", rotate = "", translate="";
            if(o.options.to.scale!=null && o.options.from.scale!=null)
            {
                o.scale = o.options.from.scale + (move_scroll==1 ? o.puScale : o.pdScale)*(scrollTop-(o.pin.offset().top - o.options.offset));
                scale = 'scale('+o.scale+','+o.scale+')';
                hay = true;
            }

            if(o.options.to.rotate!=null && o.options.from.rotate!=null)
            {
                o.rotate = o.options.from.rotate + (move_scroll==1 ? o.puRotate : o.pdRotate)*(scrollTop-(o.pin.offset().top - o.options.offset));
                rotate = 'rotate('+o.rotate+'deg)';
                hay = true;
            }

            if((o.options.to.x!=null && o.options.from.x!=null) || (o.options.to.y!=null && o.options.from.y!=null))
            {
                o.x = o.options.from.x + (move_scroll==1 ? o.puX : o.pdX)*(scrollTop-(o.pin.offset().top - o.options.offset));
                o.y = o.options.from.y + (move_scroll==1 ? o.puY : o.pdY)*(scrollTop-(o.pin.offset().top - o.options.offset));
                translate = 'translate('+o.x+'px, '+o.y+'px)';
                hay = true;                
            }

            if(o.options.to.opacidad!=null && o.options.from.opacidad!=null)
            {
                o.opacidad = o.options.from.opacidad + (move_scroll==1 ? o.puOpacidad : o.pdOpacidad)*(scrollTop-(o.pin.offset().top - o.options.offset));
                hay = true;
            }

            if(hay)
            {
                o.$el.css('-ms-transform', scale + ' ' + rotate + ' ' + translate);
                o.$el.css('-webkit-transform', scale + ' ' + rotate + ' ' + translate);
                o.$el.css('-moz-transform', scale + ' ' + rotate + ' ' + translate);
                o.$el.css('transform', scale + ' ' + rotate + ' ' + translate);
                if(o.options.to.opacidad!=null && o.options.from.opacidad!=null)o.$el.css('opacity', o.opacidad);
            }
        }
    },

    _scrollStop: function()
    {

    },

    _createPortions: function()
    {
        var porciento = 0/100;
        if(this.options.to.scale!=null && this.options.from.scale!=null)
        {
            this.pScale = (this.options.to.scale-this.options.from.scale)/this.options.duracion;
            var u = (this.options.to.scale-this.options.from.scale) - (this.options.to.scale-this.options.from.scale)*porciento;
            this.puScale = u/this.options.duracion;
            var d = (this.options.to.scale-this.options.from.scale) + (this.options.to.scale-this.options.from.scale)*porciento;
            this.pdScale = d/this.options.duracion;
        }
        if(this.options.to.rotate!=null && this.options.from.rotate!=null)
        {
            this.pRotate = (this.options.to.rotate-this.options.from.rotate)/this.options.duracion;
            var u = (this.options.to.rotate-this.options.from.rotate) - (this.options.to.rotate-this.options.from.rotate)*porciento;
            this.puRotate = u/this.options.duracion;
            var d = (this.options.to.rotate-this.options.from.rotate) + (this.options.to.rotate-this.options.from.rotate)*porciento;
            this.pdRotate = d/this.options.duracion;
        }
        if(this.options.to.x!=null && this.options.from.x!=null)
        {
            this.pX = (this.options.to.x-this.options.from.x)/this.options.duracion;
            var u = (this.options.to.x-this.options.from.x) - (this.options.to.x-this.options.from.x)*porciento;
            this.puX = u/this.options.duracion;
            var d = (this.options.to.x-this.options.from.x) + (this.options.to.x-this.options.from.x)*porciento;
            this.pdX = d/this.options.duracion;
        }
        if(this.options.to.y!=null && this.options.from.y!=null)
        {
            this.pY = Math.abs(this.options.to.y-this.options.from.y)/this.options.duracion;
            var u = (this.options.to.y-this.options.from.y) - (this.options.to.y-this.options.from.y)*porciento;
            this.puY = u/this.options.duracion;
            var d = (this.options.to.y-this.options.from.y) + (this.options.to.y-this.options.from.y)*porciento;
            this.pdY = d/this.options.duracion;
        }
        if(this.options.to.opacidad!=null && this.options.from.opacidad!=null)
        {
            this.pOpacidad = (this.options.to.opacidad-this.options.from.opacidad)/this.options.duracion;
            var u = (this.options.to.opacidad-this.options.from.opacidad) - (this.options.to.opacidad-this.options.from.opacidad)*porciento;
            this.puOpacidad = u/this.options.duracion;
            var d = (this.options.to.opacidad-this.options.from.opacidad) + (this.options.to.opacidad-this.options.from.opacidad)*porciento;
            this.pdOpacidad = d/this.options.duracion;
        }
    }
};

$.fn.cuiScene = function( options ) {
    this.each(function() {
            var instance = $.data( this, 'cuiScene' );
            if ( !instance ) {
                $.data( this, 'cuiScene', new $.cuiScene( options, this ) );
            }
    });
    return this;
};