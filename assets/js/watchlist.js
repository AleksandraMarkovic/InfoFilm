window.onload = function(){
    $("#prazno").hide();
    var filmovi = JSON.parse(localStorage.getItem("filmovi"));
    console.log(filmovi)

    if(!filmovi || filmovi.length == 0){
        $("#tabela").hide();
        $("#prazno").show();
    }
    else {
        prikaziFilmove();
    }


    $("#lista").hide();
    $("#lista ul").show();
    $(".fa-bars").click(function(){
        var lista = $("#lista")
        $('#lista').slideToggle();
        console.log(lista)
    })
    $("#lista > ul > li").click(function(){
         $("#lista").slideToggle();
    })
}


function prikaziFilmove(){
    var filmovi = JSON.parse(localStorage.getItem("filmovi"));
    const izabrano = this.value;
    $.ajax({
        url: "data/filmovi.json",
        method: "GET",
        type: "json",
        success: function(data){
            data = data.filter(el => {
                for(let film of filmovi)
                {
                    if(el.id == film.id) {
                        return true;
                    }
                        
                }
            });

            if(izabrano == "najbolji"){
                data.sort(function(a,b){
                    if(a.ocena > b.ocena){
                        return -1;
                    }
                    else if(a.ocena == b.ocena) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "najpopularnije"){
                data.sort(function(a,b){
                    if(a.popularno > b.popularno){
                        return 1;
                    }
                    else if(a.popularno == b.popularno) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "najnovije"){
                filmovi.sort(function(a,b){
                    const datum1 = new Date(a.datum);
                    const datum2 = new Date(b.datum);

                    return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate());
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "adoz"){
                data.sort(function(a,b){
                    if(a.naziv > b.naziv){
                        return 1;
                    }
                    else if(a.naziv == b.naziv) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else {
                ispisiWatchlistu(data);
            }

            ispisiWatchlistu(data);

            ispisiWatchlistu(data);
        },
        error: function(err){
            console.error(err);
        }
    })
}


function ispisiWatchlistu(filmovi){
    var filmoviPostoje = JSON.parse(localStorage.getItem("filmovi"));
    var ispis = "";
    if(filmoviPostoje){ 
        filmovi.forEach(element => {
            ispis += `<tr>
                <td colspan="2">
                    <div class="filmWatchlist">
                        <div class="slikaWatchlist">
                            <a href="film.html?id=${element.id}"> <img src="${element.slikaMala}" alt="${element.naziv}" /> </a>
                        </div>
                        <div class="infoWatchlist">
                        <a href="film.html?id=${element.id}"> <h1>${element.naziv}</h1> </a>
                            <p>${datum(element.datum)} | ${element.trajanje} min | ${obrada(element.zanrovi)} | <i class="fa fa-star" aria-hidden="true"></i> ${element.ocena}</p>
                            <p>${element.opis}</p>
                            <p>Stars: ${obrada(element.ekipa.glumci)}</p>
                        </div> 
                    </div>
                    <input type="button" value="Remove" onclick="obrisiIzWatchliste(${element.id})" class="remove"/>
                </td>
            </tr>`
        });
            
    }

    document.getElementById("bodi").innerHTML = ispis;
    document.getElementById("sortirajWatchlist").addEventListener("change", prikaziFilmove);
    document.getElementById("brojFilmova").innerHTML = `Number of movies: ${filmoviPostoje.length}`;
}


function obrada(data){
    let ispis = "";
    data.forEach((element, i) => {
        if(typeof element == "object"){
            i == 0 ? ispis += element.nazivZanra : ispis += ", " + element.nazivZanra;
        }
        else {
            i == 0 ? ispis += element : ispis += ", " + element;
        }
    })

    return ispis;
}

function datum(datum){
    var datumObj = new Date(datum);

    return datumObj.getFullYear();
}

function obrisiIzWatchliste(id){
    var filmovi = JSON.parse(localStorage.getItem("filmovi"));
    var obrisano = filmovi.filter(function(el){
        return el.id != id;
    })

    localStorage.setItem("filmovi", JSON.stringify(obrisano));

    if(obrisano.length == 0){
        $("#tabela").hide();
        $("#prazno").show();
    }
    prikaziFilmove();   
}


