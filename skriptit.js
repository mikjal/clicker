
const minimikoko = 0.25;
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
        id: 1,
        otsikko: "Solid sides",
        klikkiraja: 50,
        maksu: 2,
        kuorma: 0.1,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 2,
        otsikko: "Increase rotation speed",
        klikkiraja: 75,
        maksu: 0,
        kuorma: 0.25,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 3,
        otsikko: "Transparent sides",
        klikkiraja: 100,
        maksu: 2,
        kuorma: 0.2,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 4,
        otsikko: "Shaded sides",
        klikkiraja: 150,
        maksu: 2,
        kuorma: 0.3,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 5,
        otsikko: "Transparent shaded sides",
        klikkiraja: 175,
        maksu: 2,
        kuorma: 0.3,
        naytossa: false,
        kaytetty: false
    },
    {
        id:6,
        otsikko: "Textured sides",
        klikkiraja: 200,
        maksu: 2,
        kuorma: 0.4,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 7,
        otsikko: "",
        klikkiraja: 250,
        maksu: 2,
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
    if (koko < 0.6) { /* 1.2 */
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

function tarkistaPaivitykset() {
    let sopivat = paivitykset.filter(pa => pa.kaytetty === false && pa.naytossa === false && klikit >= pa.klikkiraja - 20 );
    if (sopivat.length > 0) {
        let lista = document.querySelector('#paivityslista');
        if (lista.querySelectorAll('#listateksti').length != 0) {
            document.querySelector('#listateksti').remove();
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


