(function($) {
    /**
     * Создание и заполнение колоды LINE 11 присвоение картам картинок по их значениям.
	 * m -> масть 0 = крести 1 = буби 2 = черви 3 = пики 
     * @param deck - колода
     */
    var fill_deck = function(deck){
        deck.empty();
        var i, m;
        for (i = 2; i<15; i++){
			for (m=0; m<4; m++){
                deck.append('<li class="card" data-value="'+i+'"><img src="./card/'+m+''+i+'.png"</img></li>');
            }
        }
    };
    /**
     *  Раздаем карты. Сначала раздается 26 карт первому игроку, далее второму.
     *  Чтобы увидеть числовую модель раздачи карты -=> Раскомментируем  30 line (наглядноть примера)
	 *  Когда размер колоды уменьшиться до 26 карт (.eq .appendTo) функция будет случайно раздавать карты 
	 *  второму игроку. Как таковой тусовки колоды не происходит, т.к. из колоды вытаскиваются случайные карты и
	 *  и последовательно присваиваются первому игроку и второму (начиная с i = 25 выпол else)
	 *  http://api.jquery.com/appendTo/
	 * 	http://api.jquery.com/eq/
	 *	deck - колода
     *  deck_g1 jQuery Колода первого игрока
     *  deck_g2 jQuery Колода второго игрока
	 *
     */
    var deal_deck = function(deck, deck_g1, deck_g2){
        var play1 = true;
        var i, card, k = deck.children().size();
        for (i=0; i < k; i++){
            card = Math.floor(Math.random() * deck.children().size());
			//$('body').append(i+'   '+card+'  '+deck.children().size()+'<br>');
			if (play1){
                deck.children().eq(card).addClass('close').appendTo(deck_g1);
            }else{
                deck.children().eq(card).addClass('close').appendTo(deck_g2);
            }
            play1 = !play1;
        }
    };

    /**
     * Проверка конца игры
     * deck_g1 jQuery cards g1
     * deck_g2 jQuery cards g2
	 * Перезагрузка страницы и немного рекламы =)
     */
    var gameover = function(deck_g1, deck_g2){
        if (deck_g1.children().size() == 0){
        $('button[data-modal^=modal-13]').click();
		setTimeout('window.location.reload()', 25000);
        }else
        if (deck_g2.children().size() == 0){
		$('button[data-modal^=modal-12]').click();
		setTimeout('window.location.reload()', 25000);
        }
    };
    /**
     * Логика игры на двоих
     * @param deck jQuery Колода для раздачи
     * @param deck_g1 jQuery Пустая колода первого игрока
     * @param deck_g2 jQuery Пустая колода второго игрока
     * @param deck_game1 jQuery Зона (колода), куда кладет карты первый игрок
     * @param deck_game2 jQuery Зона (колода), куда кладет карты второй игрок
     */
	
    var play = function(deck, deck_g1, deck_g2, deck_game1, deck_game2){
        var moves_cnt = 1; // Кол-во доступных ходов для пользователя
		
        // Раздача карт
        deal_deck(deck, deck_g1, deck_g2);
		
        // Ход пользователя
        deck_g2.on('click', '.card:last-child', function(e){
					var s1 = deck_g1.children().size();
					var s2 = deck_g2.children().size();
            if (moves_cnt){
                $(this).appendTo(deck_game2);
					$('h1').remove();
                    moves_cnt--;
					$('.g2_s').append('<h1>Карт: '+s2+'</h1>');
                    // Ход компа
                    deck_g1.children(':last-child').appendTo(deck_game1);
					$('.g1_s').append('<h1>Карт: '+s1+'</h1>');
                        // Открываем карты
                        if (moves_cnt==0){
                            var card1 = deck_game1.children(':last-child');
                            var card2 = deck_game2.children(':last-child');
                            card1.removeClass('close').addClass('animated flipInX');;
                            card2.removeClass('close').addClass('animated flipInX');;

                            /* Сравниваем, кто выиграл
							* Не забываем переводить строковое значение в числовое, вводом новой переменной v1
							*/
                            var id = setTimeout(function(){
                                clearInterval(id);
                                var v1 = parseInt(card1.attr('data-value'));
                                var v2 = parseInt(card2.attr('data-value'));
                                if (v1 > v2){
                                    deck_game1.children().appendTo(deck_game2);
                                    deck_game2.animate({right: "-=1000px"}, 100, function() {
                                        $(this).children().addClass('close').prependTo(deck_g1);
                                        $(this).css({right:'auto'});
                                        moves_cnt++;
                                    });
                                }else
                                if (v1 < v2){
                                    deck_game1.children().appendTo(deck_game2);
                                    deck_game2.animate({left: "-=1000px"}, 100, function() {
                                        $(this).children().addClass('close').prependTo(deck_g2);
                                        $(this).css({left:'auto'});
                                        moves_cnt++;
										});
                                }else{
                                    moves_cnt+=2;
                                }
                                // Проверка конца игры
                                gameover(deck_g1, deck_g2);
                            }, 300); // Длина анимации должна быть равна длине Animated (.animated flipInX (default = 1000)
						}
					}
				}
		);
							
    };
    /**
     * Обработка изменений размеров браузера
     * Центрирование окон
     */
	    /**
     * Показать окно
     * @param name Класс окна
     */
    var show_window = function(name){
        $('.window').hide();
        $(window).resize();
        $('.window.'+name).fadeIn(500, function(){
            $(window).resize();
        });
    };

    /**
     * Инициализация игры "Пьяница"
     */
    $(document).ready(function(){
        var deck = $('.deck_1');
        // Создание колоды
        fill_deck(deck);
            show_window('game');
            play(deck,
                $('.game .g1 .deck'),
                $('.game .g2 .deck'),
                $('.game .play .p2'),
                $('.game .play .p1')
            );
        
    });
})(jQuery);
