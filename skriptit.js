
const minimikoko = 0.25;
const maxkoko = 1.2;
let koko = minimikoko;
let klikit = 0;
let aikaid, aloitusaika;
let varoitusPaalla = false;
let kokoKuorma = 0;
let lampotila = 24;

/* 
otsikko:
klikit:
maksu:
naytetaan:
kaytetty:
*/

const paivitykset = [
    {
        id: 0,
        otsikko: "Solid sides",
        klikkiraja: 50,
        maksu: 0,
        edellisetPoistettava: false,
        poistettava: true,
        kuorma: 0.1,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 1,
        otsikko: "Increase rotation speed",
        klikkiraja: 75,
        maksu: 0,
        edellisetPoistettava: false,
        poistettava: false,
        kuorma: 0.25,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 2,
        otsikko: "Transparent sides",
        klikkiraja: 100,
        maksu: 4,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.2,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 3,
        otsikko: "Shaded sides",
        klikkiraja: 150,
        maksu: 4,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.3,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 4,
        otsikko: "Transparent shaded sides",
        klikkiraja: 175,
        maksu: 3,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.3,
        naytossa: false,
        kaytetty: false
    },
    {
        id:5,
        otsikko: "Textured sides",
        klikkiraja: 200,
        maksu: 3,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.4,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 6,
        otsikko: " ",
        klikkiraja: 250,
        maksu: 2,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.5,
        naytossa: false,
        kaytetty: false
    }

]

/*
solid sides
transparent sides
shaded sides
transparent shaded sides with image
textured sides
animated sides ?
*/
/* Kuution klikkaus */
document.querySelector('.kuutio').addEventListener('click', (event) => {
    if (koko < maxkoko) { 
        document.querySelector('.kuutio').style.scale = koko - 0.02;
        setTimeout(() => {
            koko += 0.005;
            document.querySelector('.kuutio').style.scale = koko;
        },100);

        klikit += 1;
        document.querySelector('#klikit').innerHTML = klikit;
    } else {
        /* koko = ((koko / 2) < minimikoko) ? minimikoko : koko / 2; */
        const ia = document.querySelector('#infoalue');
        ia.innerHTML = 'WARNING<br>Low VRAM! Cannot increase cube size.<br>Choose upgrades to increase GPU load.';
        ia.classList.replace('alert-info','alert-danger');
        ia.style.opacity = 0.8;
    }

    /* Paksumpi viiva jos kuutio on pieni */
    let bw = (koko > 0.5) ? '1px' : '2px';
    if (haeKuutionArvo('border-width') != bw){
        asetaKuutionArvo('border-width',bw);
    }

    /* Oliko ensimmäinen klikkaus? */
    if (klikit == 1) {
        /* Oli ensimmäinen klikkaus */
        document.querySelector('#infoalue').style.opacity = 0;
        aloitusaika = new Date().getTime();
        aikaid = setInterval(() => {
            let ero = Math.round((new Date().getTime() - aloitusaika));
            let s = Math.floor(ero / 60000);
            ero = ero - s * 60000;
            s = s.toString().padStart(2,'0') + ':' +(Math.round(ero / 1000)).toString().padStart(2,'0');
            document.querySelector('#aika').innerHTML = s;
        }, 1000);
    } else {
        /* Ei ollut ensimmäinen */
        tarkistaPaivitykset();
    }

    //console.log(koko);
});

function asetaKuutionArvo(s,a) {
    document.querySelectorAll('.kuutio_sivu').forEach((cur) => {
        cur.style.setProperty(s,a)
    });
}

function haeKuutionArvo(s) {
    return getComputedStyle(document.querySelector('.kuutio_sivu')).getPropertyValue(s);
}

function asetaSivujenArvo(s,a) {
    for (i=1;i<7;i++) {
        document.querySelector('#sivu'+i).style.setProperty(s,a[i-1]);
    }
}

function tarkistaPaivitykset() {
    /* löytyykö päivityksiä jotka pitäisi lisätä näkyville (klikkausrajaan on 20 tai alle) */
    let sopivat = paivitykset.filter(pa => pa.kaytetty === false && pa.naytossa === false && klikit >= pa.klikkiraja - 20 );
    if (sopivat.length > 0) {
        let lista = document.querySelector('#paivityslista');
        if (lista.querySelectorAll('#listateksti').length != 0) {
            /* document.querySelector('#listateksti').remove(); */
            document.querySelector('#listateksti').style.display = 'none';
        }
        sopivat.forEach((item) => {
            let ele = document.createElement('button');
            ele.type = 'button';

            /*
            let teksti = '<strong>'+item.otsikko+'</strong><hr class="my-1"><small>'+item.klikkiraja+' clicks required</small>';
            if (item.maksu != 0) {
                teksti += '<small class="float-end">Cost: -'+Math.round(100/item.maksu)+'% cube size</small>';
            }
            */
            
            let teksti = '<strong>'+item.otsikko+'</strong><small class="float-end align-bottom">'+ item.klikkiraja +' clicks required</small>';
            if (item.maksu != 0) {
                teksti += '<hr class="my-1"><small>Cost:</small><small class="float-end">-'+Math.round(100/item.maksu)+'% cube size';
                if (item.edellisetPoistettava == true) {
                    teksti += ' + previous side upgrades removed';
                }
                teksti += '</small>';
            }
            /* <hr class="my-1"><small>'+item.klikkiraja+' clicks required</small>'; */

            ele.innerHTML = teksti;
            ele.classList.add('btn','btn-success','text-start','disabled');
            ele.id = 'upgrade' + item.id;
            ele.addEventListener('click',() => { upgradeButton(item.id) });
            document.querySelector('#paivityslista').appendChild(ele);
            paivitykset[item.id].naytossa = true;
        });
    }
    /* löytyykö päivityksiä joiden napin käyttö pitää sallia? */
    sopivat = paivitykset.filter(pa => pa.kaytetty === false && pa.naytossa === true && klikit == pa.klikkiraja);
    if (sopivat.length > 0) {
        sopivat.forEach((item) => {
            let e = document.querySelector('#upgrade'+item.id);
            e.classList.replace('disabled','enabled');
        });
    }

}

function upgradeButton(bid) {
    console.log(koko);

    if (paivitykset[bid].maksu != 0) {
        
        koko = (koko - koko / paivitykset[bid].maksu < minimikoko) ? minimikoko : koko - koko / paivitykset[bid].maksu;
    }

    console.log(koko);

/*
shaded sides
transparent shaded sides with image
textured sides
animated sides ?
*/
    switch (bid) {
        case 0: /* solid sides */
            /* vihreä #428457, sininen 425784, violetti #574284, vaalena vihreä #578442, oranssi #845742, punainen #844257 */
            asetaKuutionArvo('opacity','1');
            asetaSivujenArvo('background-color',['#425784','#428457','#574284','#578442','#844257','#845742']);
            break;
        case 1: /* increase speed */
            document.querySelector('.kuutio').style.animationDuration = '5s';
            break;
        case 2: /* transparent sides */
            asetaKuutionArvo('opacity','0.6');
            asetaSivujenArvo('background-color',['#425784','#428457','#574284','#578442','#844257','#845742']);
            break;
        case 3: /* shaded sides */
            break;
        case 4: /* transparent shaded sides */
            break;
        case 5: /* textured sides */
            break;
        case 6: /* textured sides */
            break;
        }

    /* poista edelliset side upgradet jos sitä vaaditaan ja niitä on */
    if (paivitykset[bid].edellisetPoistettava == true) {
        poistaEdelliset(bid);
    }

    document.querySelector('.kuutio').style.scale = koko;
    paivitykset[bid].kaytetty = true;
    document.querySelector('#upgrade'+bid).remove();

    if (document.querySelector('#paivityslista').querySelectorAll('button').length == 0) {
        document.querySelector('#listateksti').style.display = 'initial';
    }
}

function poistaEdelliset(num) {
    if (num > 0) {
        for (i=0;i<num;i++) {
            if (paivitykset[i].poistettava == true && document.querySelector('#paivityslista').querySelectorAll('#upgrade'+i).length != 0) {
                paivitykset[i].kaytetty = true;
                document.querySelector('#upgrade'+i).remove();
            }
        }
    }
}

//let imgPos = 0;


//document.querySelector('#nappula').addEventListener('click', () => {
//    const cube = document.querySelector('.kuutio');
//    const sivu1 = document.querySelector('#sivu1');

    // Värin muuttaminen taustavärin mukaan
    /*
    const vari = window.getComputedStyle( document.body, null).getPropertyValue('background-color');
    let rgb = vari.match(/[\d\.]+/g);
    for (let i=0; i<rgb.length; i++) {
        rgb[i] = 255 - rgb[i];
    }
    const sivut = document.querySelectorAll('.kuutio_sivu');
    for (let sivu of sivut) {
        sivu.style.borderColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    }
    */


    // Näytönohjaimen animointi
    /*
    setInterval(() => {

        if (imgPos < 3*156) {
            imgPos += 156;
        } else {
            imgPos = 0;
            console.log('#');
        }
        
        document.querySelector('#img').style.backgroundPosition = '0px -'+imgPos+'px';
    
    },100);
    */

//});

// Kuution suurentaminen ja pienentäminen
/*
function zoomi() {
    if (koko == 1) {
        koko = 0.8;
    } else {
        koko = 1;
    }

    document.querySelector('.kuutio').style.scale = koko;
}

setInterval(zoomi,10000);
*/

/* Kuution pienennys kun sitä klikataan */
/*
document.querySelector('.kuutio').addEventListener('click', (event) => {
    document.querySelector('.kuutio').style.scale = 0.97;
    setTimeout(() => {
        document.querySelector('.kuutio').style.scale = 1;
    },100);
    console.log(event.clientX,event.clientY);
});
*/


