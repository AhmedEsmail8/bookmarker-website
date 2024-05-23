document.getElementById("valCloseBtn").onclick = function () {
    document.getElementsByClassName("validation-window")[0].classList.add('d-none');
    document.getElementsByClassName("body-overlay")[0].classList.add('d-none');
}

function display_info() {
    document.getElementsByClassName("validation-window")[0].classList.remove('d-none');
    document.getElementsByClassName("body-overlay")[0].classList.remove('d-none');
}

var siteName = document.getElementById('siteName');
var siteUrl = document.getElementById('siteLink');
var submitBtn = document.getElementById('submitBtn');
var data;

siteName.oninput = function (){
    if (validName(siteName.value)){
        siteName.classList.remove('is-invalid');
        siteName.classList.add('is-valid');
    }
    else{
        siteName.classList.remove('is-valid');
        siteName.classList.add('is-invalid');
    }
}

siteUrl.oninput = function (){
    if (validUrl(siteUrl.value)){
        siteUrl.classList.remove('is-invalid');
        siteUrl.classList.add('is-valid');
    }
    else{
        siteUrl.classList.remove('is-valid');
        siteUrl.classList.add('is-invalid');
    }

}


if (localStorage.getItem('data') === null) {
    data = [];
}
else {
    data = JSON.parse(localStorage.getItem('data'));
    display(data)
}


submitBtn.onclick = function () {  
    var bookmark = {
        id: getLastId() + 1,
        name: siteName.value,
        url: siteUrl.value
    };

    if (bookmark.name === '' || bookmark.url === '')
        return;

    if (!validation(bookmark)) {
        display_info();
        return;
    }

    add_bookmark(bookmark);

    siteName.value = null;
    siteUrl.value = null;
    siteUrl.classList.remove('is-invalid');
    siteUrl.classList.remove('is-valid');
    siteName.classList.remove('is-invalid');
    siteName.classList.remove('is-valid');

}


function validUrl(url){
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res === null) 
        return false;

    for (let i = 0; i < data.length; i++) {
        if (url === data[i].url) {
            console.log('url exist');
            return false;
        }
    }
    return true;
}

function validName(name){
    if (name.length < 3)
        return false;
    for (let i = 0; i < data.length; i++) {
        if (name === data[i].name) {
            console.log('name exist');
            return false;
        }
    }
    return true;
}

function validation(bookmark){
    return validName(bookmark.name) && validUrl(bookmark.url);
}


function add_bookmark(bookmark) {
    data.push(bookmark);
    localStorage.setItem('data', JSON.stringify(data));
    display(data);
}

function getLastId(){
    var last_id = 0;
    for (let i = 0; i < data.length; i++)
        last_id = Math.max(last_id, data[i].id);
    return last_id;
}


function display(list) {
    var items = `<div class="col-12">
        <div class="row bg-white text-center fw-bold py-2 mt-4">
            <div class="col-md-2 col-3">ID</div>
            <div class="col-md-6 col-3">Website Name</div>
            <div class="col-md-2 col-3">Visit</div>
            <div class="col-md-2 col-3">Delete</div>
        </div>
    </div>`
    for (let i = 0; i < list.length; i++) {
        items += `<div class="col-12">
            <div class="row bg-white text-center fw-bold bookmark-item align-items-center">
                <div class="col-md-2 col-3">${list[i].id}</div>
                <div class="col-md-6 col-3 website-name">${list[i].name}</div>
                <div class="col-md-2 col-3">
                    <a href="${list[i].url}" target='_blank'>
                        <button class="btn visit">
                            <i class="fa-solid fa-eye pe-2"></i>
                            Visit
                        </button>
                    </a>
                </div>
                <div class="col-md-2 col-3">
                    <button class="btn btn-danger" onclick='delete_bookmark(${list[i].id})'>
                        <i class="fa-solid fa-trash-can"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>`
    }
    document.querySelector('#dataSection .container .row').innerHTML = items;
}

function delete_bookmark(bookmark_id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == bookmark_id) {
            data.splice(i, 1);
            localStorage.setItem('data', JSON.stringify(data));
            display(data);
            break;
        }
    }
}