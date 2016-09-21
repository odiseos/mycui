$.cuiAnime = function(options)
{
    this._init( options );
};

$.cuiAnime.defaults = {
   cuiScenes: [],
   friccion: 30
};

$.cuiAnime.prototype = {
    _init : function( options )
    {
        var _self = this;
        this.options = $.extend( true, {}, $.cuiAnime.defaults, options );

        this.window = $(window);
        this.scroll_star = this.window.scrollTop();
        
        $.when( this._createAnime() ).done( function() {
            _self._loadEvents();
        });
    },
    
    _createAnime : function()
    {
        this.scroll_star = this.window.scrollTop();
        this.scroll_escene = new Array(this.options.cuiScenes.length);
        for (var i = 0; i < this.options.cuiScenes.length; i++) {
            this.scroll_escene[i] = this.window.scrollTop();
        }
    },

    _loadEvents : function()
    {
        var _self = this;
        this._onScroll();
    },
    _onScroll1: function()
    {
        var scrollTop = this.window.scrollTop();
        var move_scroll =  this.scroll_star - scrollTop <= 0 ? 1 : -1;
        if( Math.abs(this.scroll_star-scrollTop)>0.1)
        {
            if( Math.abs(this.scroll_star-scrollTop)<=0.1)
            {
                this.scroll_star=scrollTop;
            }
            var velocidad = Math.abs(scrollTop - this.scroll_star)/this.options.friccion;
            move_scroll ==1 ? this.scroll_star+=velocidad : this.scroll_star-=velocidad;
            var scenes = this.options.cuiScenes;
            for(var i=0; i<scenes.length; i++)
            {
                scenes[i]._scrollControl(move_scroll, this.scroll_star);
            }
        }
        window.requestAnimationFrame($.proxy(this._onScroll, this));
    },
    _onScroll: function()
    {
        var scrollTop = this.window.scrollTop();
        var scenes = this.options.cuiScenes;
        for(var i=0; i<scenes.length; i++)
        {
            var move_scroll =  this.scroll_escene[i] - scrollTop <= 0 ? 1 : -1;
            if( Math.abs(this.scroll_escene[i]-scrollTop)>0.1)
            {
                if( Math.abs(this.scroll_escene[i]-scrollTop)<=0.1)
                {
                    this.scroll_star=scrollTop;
                }
                var velocidad = Math.abs(scrollTop - this.scroll_escene[i])/scenes[i].options.friccion;
                move_scroll ==1 ? this.scroll_escene[i]+=velocidad : this.scroll_escene[i]-=velocidad;
                scenes[i]._scrollControl(move_scroll, this.scroll_escene[i]);
            }
        }
        window.requestAnimationFrame($.proxy(this._onScroll, this));
    }
};

$.fn.cuiAnime = function( options ) {
    this.each(function() {
            var instance = $.data( this, 'cuiAnime' );
            if ( !instance ) {
                $.data( this, 'cuiAnime', new $.cuiAnime( options, this ) );
            }
    });
    return this;
};


window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
                window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = ( function() {
        return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame         ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();