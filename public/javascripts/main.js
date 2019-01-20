const burger_images = ['./images/burger_animation1.png', './images/burger_animation2.png', './images/burger_animation3.png', './images/burger_animation4.png'];
var burgerImage = null;
var biteEffectTimer = null;

function biteEffect(callback) {
    let count = 0;
    biteEffectTimer = setInterval(() => {
        let audioPlayer = $('#biteSound').clone().attr('autoplay', '').attr('preload', 'none').attr('id', Math.floor(Math.random() * 90000) + 10000);
        audioPlayer.on('ended', (e) => {
            $(e.target).remove();
            let currentImage = burger_images.indexOf(burgerImage.attr('src'));
            if (currentImage === 3) {
                setTimeout(() => {
                    burgerImage.attr('src', burger_images[0]);
                    callback();
                }, 500, callback);
            }
        });
        audioPlayer.on('play', (e) => {
            e.target.volume = 0.5;
            let currentImage = burger_images.indexOf(burgerImage.attr('src'));
            if (currentImage < 4) {
                burgerImage.attr('src', burger_images[currentImage + 1]);
            }
        });
        $('body').append(audioPlayer);
        if (count === 2) {
            clearInterval(biteEffectTimer);
        }
        count++;
    }, 750);
}

function AddBurgerToDevourList(id, name) {
    let burgerCard = $('#burger_card').clone().toggleClass('d-none').attr('id', id + name.replace(/\s/g, ''));
    burgerCard.find('h4').text(name);
    burgerCard.find('button').on('click', Devour_Click).attr('data-burgerid', id).attr('data-burgername', name);
    $('#BurgerList').append(burgerCard);
}

function AddBurgerToDevouredList(id, name) {
    let burgerCard = $('#burger_card').clone().toggleClass('d-none').attr('id', id);
    burgerCard.find('h4').text(name);
    burgerCard.find('button').remove();
    $('#DevouredList').append(burgerCard);
}

function Devour_Click() {
    let burgerId = $(this).attr('data-burgerid');
    let burgerName = $(this).attr('data-burgername');
    let buttons = $('#BurgerList').find('button');
    $.each(buttons, (index, value) => {
        $(value).attr('disabled', '');
    });
    biteEffect(() => {
        $.ajax({
            url: '/api/eatburger',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({id: burgerId}),
            method: 'PUT'
        }).done(()=>{
            $('#' + burgerId + burgerName.replace(/\s/g, '')).remove();
            AddBurgerToDevouredList(burgerId, burgerName);
        }).always(()=>{
            $.each(buttons, (index, value) => {
                $(value).removeAttr('disabled');
            });
        });
    });
}

$(document).ready(() => {
    burgerImage = $('#burger');
    $('#AddToListButton').on('click', () => {
        let burgerName = $('#BurgerName');
        let name = burgerName.val();
        if (name) {
            $.ajax({
                url: '/api/createburger',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({burgername: name}),
                method: 'POST'
            }).done((data) => {
                AddBurgerToDevourList(data.id, data.name);
                burgerName.val('');
            });
        }
    });

    $.ajax({
        url: '/api/getburgers',
        method: 'GET'
    }).done((data) => {
        $.each(data, (index, value) => {
            if (value.isDevoured) {
                AddBurgerToDevouredList(value.id, value.name);
            } else {
                AddBurgerToDevourList(value.id, value.name);
            }
        });
    });
});