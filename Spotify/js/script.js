let searchResult = [];
let page = 1;

var settings = {
    "url": "https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=0",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "",
        "Accept": "application/json"
    },
};






function init() {

    $('#btn-previouse')[0].addEventListener('click', previous);
    $('#btn-next')[0].addEventListener('click', next);

    $('#artists')[0].addEventListener('click', search);
    $('#tracks')[0].addEventListener('click', search);

    $('#limit')[0].addEventListener('change', search);

    $('#btn-modal-save')[0].addEventListener('click', function() {
        settings.headers.Authorization = "Bearer " + $('#modalTokenInput')[0].value;
        search();
    });

    $('#searchKey')[0].addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            search();
        }
    });

}


function search() {
    page = 1;
    if ($('#searchKey')[0].value != "") {
        if (document.getElementById("artists").checked) {
            settings.url = `https://api.spotify.com/v1/search?q=${$('#searchKey')[0].value}&type=artist&market=US&limit=${$('#limit')[0].value}&offset=0`;
            getArtists();
        } else {
            settings.url = `https://api.spotify.com/v1/search?q=${$('#searchKey')[0].value}&type=track&market=US&limit=${$('#limit')[0].value}&offset=0`
            getTracks();
        }
    }

}



function next() {
    page++;
    console.log(page);
    if (document.getElementById("artists").checked) {
        settings.url = searchResult.next;
        getArtists();
    } else {
        settings.url = searchResult.next;
        getTracks();
    }
}

function previous() {
    page--;
    console.log(page);
    if (document.getElementById("artists").checked) {
        settings.url = searchResult.previous;
        getArtists();
    } else {
        settings.url = searchResult.previous;
        getTracks();
    }
}


function pagination() {
    $('#btn-previouse')[0].disabled = searchResult.previous != null ? false : true;
    $('#btn-next')[0].disabled = searchResult.next != null ? false : true;
    $('#btn-number')[0].innerHTML = page;

}

function getArtists() {
    $.ajax(settings).done(function(response) {
        console.log(response);
        searchResult = response.artists;
        showArtists();
    }).fail(function() {
        $("#modal").modal()
    });
}

function showArtists() {

    pagination();

    let cardsHtml = "";
    searchResult.items.forEach(element => {

        let generos = element.genres.map(function(wizard) {
            return '<li>' + wizard + '</li>';
        }).join('') + '</ul>';

        let name = element.name.length > 30 ? element.name.substring(0, 27).concat("...") : element.name;


        cardsHtml += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex">
                    <div class="card text-dark ">
                        <div class="img1"><img src="cardBackground.gif" alt=""></div>
                        <div class="img2"><img src=${element.images.length != 0? element.images[0].url:"default-image.jpg"} alt=""></div>
                        <div class="main-text">
                            <h2 id="name">${name}</h2>
                            <div id="followers">
                                <p><i class="fa fa-users" aria-hidden="true"></i> ${element.followers.total}</p>
                            </div>
                            <div id="popularity">
                                <p><i class="fa fa-fire" aria-hidden="true"></i> ${element.popularity}</p>
                            </div>
                            <div id="genreTitle">
                                <p><i class="fa fa-music" aria-hidden="true"></i> Genres</p>
                            </div>
                            <div id="genres" class="genresrItems mx-5">
  
                                ${ generos}
                                
                            </div>
    
                        </div>
                        <div class="socials">
                            <a href= ${element.external_urls.spotify}><i class="fa fa-link" aria-hidden="true"></i></a>
                        </div>
                    </div>
                </div>
            `;
    });

    $('#cards-row')[0].innerHTML = cardsHtml;


}

function getTracks() {

    $.ajax(settings).done(function(response) {
        console.log(response);
        searchResult = response.tracks;
        showTracks();
    }).fail(function() {
        $("#modal").modal()
    });
}

function showTracks() {
    pagination();

    let cardsHtml = "";
    searchResult.items.forEach(element => {

        let name = element.name.length > 30 ? element.name.substring(0, 27).concat("...") : element.name;


        cardsHtml += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex">
                <div class="card text-dark ">
                    <div class="img1"><img src="cardBackground.gif" alt=""></div>
                    <div class="img2"><img src=${element.album.images.length != 0? element.album.images[0].url:"default-image.jpg"} alt=""></div>
                    <div class="main-text">
                        <h2 id="name">${name}</h2>
                        <div id="album-name">
                            <p><i class="fas fa-compact-disc"></i> ${element.album.name}</p>
                        </div>
                        <div id="release-date">
                            <p><i class="fas fa-calendar-day"></i> ${element.album.release_date}</p>
                        </div>
                        <div id="artist-name">
                            <p><i class="fas fa-user"></i> ${element.album.artists[0].name}</p>
                        </div>
                        <audio controls class="d-inline-flex mb-4" style=" width: 85%;">
                             ${element.preview_url!=null?" <source src="+element.preview_url+"type=audio/mpeg":""} 
                        </audio>

                    </div>

                    <div class="socials">
                        <a href=${element.external_urls.spotify}><i class="fa fa-link" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
            `;
    });

    $('#cards-row')[0].innerHTML = cardsHtml;



}







init();