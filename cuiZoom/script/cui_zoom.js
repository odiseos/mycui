var cuiZoom = function() {},
    img,
    pscale, pblur, vascale=1, vablur=8, rmd = [], fin = true, up = true, va=0, limite=4, animating = true, w=0, h=0, left=0, topp=0;


cuiZoom.prototype.init = function() {
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
            window.oCancelRequestAnimationFrame     	||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout
    } )();

    img = $('.cui_zoom .cui_cont .img');
    limite=100;
    pscale = 0.5/limite;
    pblur = 10/limite;
    va=0;
    fin = true;
    up = true;
    vascale=1;
    vablur=8;
    w = $('.cui_zoom .cui_cont').width() - $('.cui_zoom').width();
    h = $('.cui_zoom .cui_cont').height() - $('.cui_zoom').height();
    left = -w/2;
    topp = -h/2;
    $('.cui_zoom .cui_cont').css('left', left+'px');
    $('.cui_zoom .cui_cont').css('top', topp+'px');
    
    window.addEventListener('load', cuiZoom._onLoad, false);
};

cuiZoom._onLoad = function(e)
{
    //$('#data').text(left+' '+w+'  '+$('.cui_zoom .cui_cont').width()+'  '+$('.cui_zoom').width());
    va++;
    if(fin)
    {
        fin = false;
        for(var i=0; i<10; i++)
        {
           var n = cuiZoom._getRandomInt(0, img.length-1);
           if(!cuiZoom._containt(rmd, n)){
              rmd.push(n);
           }
        }
    }

     if(up){
        vascale+=pscale;
        vablur-=pblur;
    }
    else
    {
        vascale-=pscale;
        vablur+=pblur;
    }

    for(var i=0; i<rmd.length; i++){
       
       var el = $(img[rmd[i]]);
       el.css('z-index', '10');
       el.css('-ms-transform', 'scale('+vascale+', '+vascale+')');
       el.css('-webkit-transform', 'scale('+vascale+', '+vascale+')');
       el.css('-moz-transform', 'scale('+vascale+', '+vascale+')');
       el.css('transform', 'scale('+vascale+', '+vascale+')');

       el.css('filter', 'blur('+vablur+'px)');
    }
    if(va>=limite)
    {
        up = !up;
        if(up)
        {
            fin = !fin;
            for(var i=0; i<rmd.length; i++){

               var el = $(img[rmd[i]]);
               vascale=1;
               vablur=8;
               el.css('z-index', '2');
               el.css('-ms-transform', 'scale('+vascale+', '+vascale+')');
               el.css('-webkit-transform', 'scale('+vascale+', '+vascale+')');
               el.css('-moz-transform', 'scale('+vascale+', '+vascale+')');
               el.css('transform', 'scale('+vascale+', '+vascale+')');

               el.css('filter', 'blur('+vablur+'px)');
            }
            rmd = [];
            cancelAnimationFrame(cuiZoom._onLoad);
            
            animating = false;
            left -= cuiZoom._getRandomInt(left, $('.cui_zoom .cui_cont').width() - ($('.cui_zoom').width() + Math.abs(left)) );
            //topp -= cuiZoom._getRandomInt(topp, $('.cui_zoom .cui_cont').height() - ($('.cui_zoom').height() + Math.abs(top)) );

            $({blurRadius: 10}).animate({blurRadius: 0}, {
                duration: 950,
                easing: 'swing', // or "linear"
                                 // use jQuery UI or Easing plugin for more options
                step: function(now) {
                    img.css({
                        "-webkit-filter": "blur("+this.blurRadius+"px)",
                        "filter": "blur("+this.blurRadius+"px)"
                    });
                    $('#data').text(now);
                },
                complete: function(){
                    $({blurRadius: 0}).animate({blurRadius: 10}, {
                        duration: 950,
                        easing: 'swing', // or "linear"
                                         // use jQuery UI or Easing plugin for more options
                        step: function(){
                            img.css({
                                "-webkit-filter": "blur("+this.blurRadius+"px)",
                                "filter": "blur("+this.blurRadius+"px)"
                            });
                        },
                        complete: function(){
                            animating = true;
                            requestAnimFrame(cuiZoom._onLoad);
                        }
                    });
                }
            });

            $('.cui_zoom .cui_cont').animate(
                {
                    'left': left+'px'
                },
                {
                    duration: 2000,
                    step: function(){

                    },
                    complete: function(){
                        
                    }
                }
            );
        }
        va=0;
    }
    if(animating)requestAnimFrame(cuiZoom._onLoad);
};

cuiZoom._getRandomInt = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
    //return Math.random() * (max - min) + min;
};

cuiZoom._containt = function(a,v)
{
    for(var k=0; k<a.length; k++)
        if(a[k]==v)return true;
    return false;
};




var next = function()
       {
           for(var i=0; i<_self.img.length; i++){
               var n = _self._getRandomInt(0, _self.img.length-1);
               var el = $(_self.img[n]);


               el.css('z-index', '10');
               el.css('-ms-transition-duration', '1.6s');
               el.css('-webkit-transition-duration', '1.6s');
               el.css('-moz-transition-duration', '1.6s');
               el.css('transition-duration', '1.6s');

               el.css('-ms-transform', 'scale(1.5, 1.5)');
               el.css('-webkit-transform', 'scale(1.5, 1.5)');
               el.css('-moz-transform', 'scale(1.5, 1.5)');
               el.css('transform', 'scale(1.5, 1.5)');

               el.css('filter', 'blur(0px)');
           }
       }
