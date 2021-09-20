window.onload = function(){
    filtrirajFilm();

    document.getElementById("ok").addEventListener("click", function(){
        document.getElementById("popup").style.display = "none";
        document.getElementById("ocenaKorisnika").disabled = true;
    })

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


function ispisiFilm(film){
    let ispisi = "";
    let niz = film.slice(0, 1);

    niz.forEach(element =>{
        ispisi += `<div id="content">
                        <h1>${element.naziv}</h1>
                        <p>Release Date: ${datum(element.datum)}</p>
                        <p>Contry: ${element.zemlja}</p>
                        <p>Running Time: ${element.trajanje}min</p>
                        <p>Genre: ${obrada(element.zanrovi)}</p>
                        <p>Starring: ${obrada(element.ekipa.glumci)}</p>
                        <p>Written by: ${obrada(element.ekipa.pisci)}</p>
                        <p>Directed by: ${element.ekipa.direktor}</p>
                        <p><a href="${element.trailer}" target="_blank">Watch trailer</a></p>
                        <p><i class="fa fa-star" aria-hidden="true"></i>${element.ocena}/10</p>
                        <div id="userRating">
                            <p>Your rating: </p>
                            <select id="ocenaKorisnika" data-idFilma="${element.id}">`
                            for(let i = 1; i <= 10; i++){
                                ispisi += `<option value="${i}">${i}</option>`
                            }
                            ispisi += `
                            </select>
                        </div>
                    </div>
                    <div id="image">
                        <img src="${element.slikaVelika}" alt="${element.naziv}" />
                        <p>${element.opis}</p>
                    </div>`
    })

    document.getElementById("movie").innerHTML = ispisi;
    document.getElementById("ocenaKorisnika").addEventListener("change", ocenaKorisnika);
    var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));
    var disabled = JSON.parse(localStorage.getItem("disabled"));

    niz.filter(el => {
        for(let i=0; i<ocena.length; i++){
            if(el.id == ocena[i].id){
                document.getElementById("ocenaKorisnika").value = ocena[i].vrednost;
                document.getElementById("ocenaKorisnika").disabled = disabled;
            }
        }
    })

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


function filtrirajFilm(){
    var url = window.location.href;
    var idVrednost = url.split("?")[1].split("=")[1];

    $.ajax({
        url: "data/filmovi.json",
        method: "GET",
        type: "json",
        success: function(filmovi){
            const filtrirano = filmovi.filter(function(el){
                return el.id == idVrednost;
            })

            ispisiFilm(filtrirano);
        },
        error: function(err){
            console.error(err);
        }
    })
}


function datum(datum){
    var datumObj = new Date(datum);

    return datumObj.getDate() + "." + (datumObj.getMonth()+1) + "." + datumObj.getFullYear() +".";
}  


function ocenaKorisnika(){
    let id = this.dataset.idfilma;
    let vrednost = this.value;
    var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));

    if(ocena){
        var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));

        ocena.push({
            id : id,
            vrednost:vrednost
        });
        localStorage.setItem("ocenaKorisnika", JSON.stringify(ocena));
        document.getElementById("textModal").innerHTML = "Thank you for rating this movie!";
        document.getElementById("popup").style.display = "block";
        localStorage.setItem("disabled", true);
        
    }
    else {
        var ocena = [];
        ocena[0] = {
            id : id,
            vrednost:vrednost
        };
        localStorage.setItem("ocenaKorisnika", JSON.stringify(ocena));
        document.getElementById("textModal").innerHTML = "Thank you for rating this movie!";
        document.getElementById("popup").style.display = "block";
        localStorage.setItem("disabled", true);
    }

}


