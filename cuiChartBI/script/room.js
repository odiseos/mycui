$(document).ready(function() {
    
    cuiChart = new $.cuiChartScale({
         put: function(){},
         call: function(){},
         end_trade: function(){}
     }, '#cui_chart');

//    socket.on("updateValor", function(snapshot){
//        cuiChart._addVertice(snapshot.v, snapshot.min, snapshot.max);
//
//    });

     function A()
     {
         var Rnd = function(min, max){return Math.random() * (max - min) + min;};
         var min=98.110001, max=99.739998;
         cuiChart._addVertice(Rnd(min, max), min, max);
         window.setTimeout(A, 2000);
     }
     A();

    

    $('#getNews').on('click', function(){
        $('#contInfo').append('<div class="noNews son">No News</div>');
        $('#contInfo').hide();
        $('#loadInfo').show();
        $('#contInfo').find('.son').remove();
        $('#sideInfo').animate({marginLeft: '6%'}, 400);
    });

    $('#getTop').on('click', function(){
        $('#contInfo').hide();
        $('#loadInfo').show();
        $('#contInfo').find('.son').remove();
        $('#sideInfo').animate({marginLeft: '6%'}, 400);

        

    });

    $('#getHistorial').on('click', function(){
        $('#contInfo').hide();
        $('#loadInfo').show();
        $('#contInfo').find('.son').remove();
        $('#sideInfo').animate({marginLeft: '6%'}, 400);

        
    });

    $('#getSeg').on('click', function(){
        $({blurRadius: 0}).animate({blurRadius: 10}, {
            duration: 400,
            easing: 'swing', // or "linear"
                             // use jQuery UI or Easing plugin for more options
            step: function(){
                $("#room_base").css({
                    "-webkit-filter": "blur("+this.blurRadius+"px)",
                    "-ms-filter": "blur("+this.blurRadius+"px)",
                    "-moz-filter": "blur("+this.blurRadius+"px)",
                    "filter": "blur("+this.blurRadius+"px)"
                });
            },
            complete: function(){

            }
        });
        $('#capa_seg').find('iframe').attr('src', 'seguimiento.html');
        $('#capa_seg').fadeIn(400);
    });

    $('#close_info').on('click', function(){
        $('#sideInfo').animate({marginLeft: '-310px'}, 400);
    });

    $('#close_seg').on('click', function(){
        $('#capa_seg').fadeOut(400);
        $({blurRadius: 10}).animate({blurRadius: 0}, {
            duration: 400,
            easing: 'swing', // or "linear"
                             // use jQuery UI or Easing plugin for more options
            step: function(){
                $("#room_base").css({
                    "-webkit-filter": "blur("+this.blurRadius+"px)",
                    "-ms-filter": "blur("+this.blurRadius+"px)",
                    "-moz-filter": "blur("+this.blurRadius+"px)",
                    "filter": "blur("+this.blurRadius+"px)"
                });
            },
            complete: function(){

            }
        });
        $('#capa_seg').find('iframe').attr('src', '');
    });

    $('.cui_pointer').on('click', function(){
        var temp = $(this);
        $('.cui_ball').css('background-color', '#f80000');
        temp.find('.cui_ball').css('background-color', '#00f800');
        $('#cui_currency').text(temp.data('currency'));
        //socket.emit("onlineUser", cuiue, temp.data('currency'));
        $('#cui_currencybox').fadeOut(400);
        cuiChart._resetChart();
    });

    $('#cui_selectcurrency').on('click', function(){
        $('#cui_currencybox').fadeIn(400);
    });

    $('#bet_val').on('input',function(e){
        $('#calc_bet').text( '$' + $(this).val()*porciento/100);
    });

    $('.numeric').on('keypress', function(evt){
        return isNumber(evt);
    })

});






