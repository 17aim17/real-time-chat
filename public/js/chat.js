const socket = io();

// const incr = document.querySelector('#incr');
// incr.addEventListener('click', () => {
//     console.log('clicked');
//     socket.emit('increment')
// })
// socket.on('countUpdated', (data) => {
//     console.log('The count has been updated ' + data);

// })
const msg_form = document.querySelector('#msg_form');
const msg_btn = document.querySelector('#msg_btn');
const msg_input = document.querySelector('#msg_input');
const msg_div = document.querySelector('#messages');

const msg_template = document.querySelector('#msg_template').innerHTML;


socket.on('newMessage', (data) => {
    console.log(data);
    const msg_template = document.querySelector('#msg_template').innerHTML;

    const html = Mustache.render(msg_template, {
        message: data.text,
        createdAt: moment(data.createdAt).format('k:m')
    });

    msg_div.insertAdjacentHTML('beforeend', html);
})


msg_form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!msg_input.value.trim()) {
        return
    }
    // disable here
    msg_btn.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', msg_input.value, (err) => {
        // enable here
        msg_btn.removeAttribute('disabled');
        msg_input.value = '';
        msg_input.focus();


        if (err) {
            return console.log(err);
        }
        console.log('Successfully sent');
    });
})


const share_loc_btn = document.querySelector('#share_loc_btn');

share_loc_btn.addEventListener('click', (e) => {
    // disable here
    if (!navigator.geolocation) {
        return alert('Your Browser does not support Geo Location')
    }
    share_loc_btn.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', { lat: position.coords.latitude, long: position.coords.longitude }, () => {
            // enable here
            share_loc_btn.removeAttribute('disabled');
            console.log('Successfully Shared location');
        });
    })

})

socket.on('newLocationMessage', (data) => {
    console.log(data);
    const msg_template = document.querySelector('#loc_msg_template').innerHTML;
    const html = Mustache.render(msg_template, {
        url: data.url,
        createdAt: moment(data.createdAt).format('k:m')
    });
    msg_div.insertAdjacentHTML('beforeend', html);
})