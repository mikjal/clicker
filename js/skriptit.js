
const minimikoko = 0.25;
const maxkoko = 1.2;
let koko = minimikoko;
let klikit = 0;
let aikaid, aloitusaika, gpuid;
let varoitusPaalla = false;
let kokoKuorma = 0;
let klikkiKuorma = 0.1;
let lampotila = 24;
let nopeus = 10;
let debug = false;
let nykyinenProfiili = 0;
let animKohta = 0;

const paivitykset = [
    {
        id: 0,
        otsikko: "Solid sides",
        klikkiraja: 50,
        maksu: 0,
        edellisetPoistettava: false,
        poistettava: true,
        kuorma: 0.15,
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
        kuorma: 0.05,
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
        kuorma: 0.25,
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
        otsikko: "Increase rotation speed",
        klikkiraja: 175,
        maksu: 0,
        edellisetPoistettava: false,
        poistettava: false,
        kuorma: 0.05,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 5,
        otsikko: "Transparent shaded sides",
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
        otsikko: "Textured sides",
        klikkiraja: 250,
        maksu: 3,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.5,
        naytossa: false,
        kaytetty: false
    },
    {
        id: 7,
        otsikko: "Increase rotation speed",
        klikkiraja: 275,
        maksu: 0,
        edellisetPoistettava: false,
        poistettava: false,
        kuorma: 0.05,
        naytossa: false,
        kaytetty: false
    },
/*
    {
        id: 8,
        otsikko: "Transparent textured sides",
        klikkiraja: 300,
        maksu: 3,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.6,
        naytossa: false,
        kaytetty: false
    },
*/
    {
        id: 8,
        otsikko: "Animated sides",
        klikkiraja: 320,
        maksu: 2,
        edellisetPoistettava: true,
        poistettava: true,
        kuorma: 0.7,
        naytossa: false,
        kaytetty: false
    }

]

const tuuletinProfiili = [
    {
        rajaYlospain: 50,
        rajaAlaspain: 0,
        animAika: 0,
        viilennys: 0
    },
    {
        rajaYlospain: 60,
        rajaAlaspain: 42,
        animAika: 80,
        viilennys: 2
    },
    {
        rajaYlospain: 70,
        rajaAlaspain: 55,
        animAika: 60,
        viilennys: 3
    },
    {
        rajaYlospain: 80,
        rajaAlaspain: 65,
        animAika: 40,
        viilennys: 4
    },
    {
        rajaYlospain: 100,
        rajaAlaspain: 75,
        animAika: 20,
        viilennys: 5
    },
]


/* Kuution klikkaus */
document.querySelector('.kuutio').addEventListener('click', (event) => {
    /* Voidaanko kasvattaa kuution kokoa? */
    if (koko < maxkoko) { 
        /* kuution kokoa voi kasvattaa */
        document.querySelector('.kuutio').style.scale = koko - 0.02;
        setTimeout(() => {
            koko += 0.005;
            document.querySelector('.kuutio').style.scale = koko;
        },100);

        klikit += 1;
        document.querySelector('#klikit').innerHTML = klikit;

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
            aikaid = setInterval(kello, 1000);
        } else {
            /* Ei ollut ensimmäinen */
            tarkistaPaivitykset();
        }

        kokoKuorma += klikkiKuorma;
        kuormaMittari(kokoKuorma);
        
    } else {
        /* kuution kokoa ei voi enää kasvattaa */
        const ia = document.querySelector('#infoalue');
        ia.innerHTML = 'WARNING<br>Low VRAM! Cannot increase cube size.<br>Choose upgrades to increase GPU load.';
        ia.classList.replace('alert-info','alert-danger');
        ia.style.opacity = 0.8;
        varoitusPaalla = true;
    }



    //console.log(koko);
});

function kuormaMittari(a) {
    const km = document.querySelector('#kuormamittari');
    a = (Math.round(a)<100) ? Math.round(a) : 100;
    km.style.width = a +'%';
    if (a > 6) {
        km.innerHTML = a + '%';
    }
    let kuormavari = (a < 75) ? 'bg-success' : (a < 90) ? 'bg-warning' : 'bg-danger';
    let poistettavaVari = (km.classList.contains('bg-danger')) ? 'bg-danger' : (km.classList.contains('bg-warning')) ? 'bg-warning' : 'bg-success';
    if (kuormavari != poistettavaVari) {
        km.classList.replace(poistettavaVari,kuormavari);
    }
}

function lampotilaMittari(a) {
    a = (a <= 100) ? Math.round(a) : 100;
    const lm = document.querySelector('#lampotilamittari');
    lm.style.width = a +'%';
}

function kello() {
    let ero = Math.round((new Date().getTime() - aloitusaika));
    let s = Math.floor(ero / 60000);
    ero = ero - s * 60000;
    s = s.toString().padStart(2,'0') + ':' +(Math.round(ero / 1000)).toString().padStart(2,'0');
    if (document.querySelector('#aika').innerHTML != '-') {
        document.querySelector('#aika').innerHTML = s;
    }

    /* tuuletinprofiili */
    for (i=0; i<tuuletinProfiili.length; i++) {
        if (lampotila < tuuletinProfiili[i].rajaYlospain) { /* vaihdetaanko asetuksia? */
            if (i<nykyinenProfiili) { /* pitäisikö vaihtaa alaspäin ? */
                if (lampotila < tuuletinProfiili[nykyinenProfiili].rajaAlaspain) {
                    /* lämpötila on laskenut alle nykyisten asetusten alarajan -> vaihdetaan edellisiin asetuksiin */
                    nykyinenProfiili = i;
                    /* näytönohjaimen animaation päivitys */
                    animGPU(nykyinenProfiili);
                }
            } else { 
                if (nykyinenProfiili != i) { /* vaihdetaan seuraaviin asetuksiin */
                    nykyinenProfiili=i;
                    /* näytönohjaimen animaation päivitys */
                    animGPU(nykyinenProfiili);
                }

            } 
            break;
        }
    }


    let kl = kokoKuorma / 25; /* kuorman lämpötilaa nostava vaikutus */
    let vi = tuuletinProfiili[nykyinenProfiili].viilennys; /* viilennyksen jäähdyttävä vaikutus */
    let yv = kl - vi; /* kuorman vaikutuksesta vähennetään viilennys */

    lampotila += yv; /* lämpötila nousee tai laskee yhteisvaikutuksen verran */
    lampotilaMittari(lampotila); /* päivitetään lämpömittarin näkymä */

    /* debug päällä? */
    if (debug == true) {
        document.querySelector('#debug_aika').innerHTML = s;
        document.querySelector('#debug_koko').innerHTML = koko.toString().slice(0,5);
        document.querySelector('#debug_nopeus').innerHTML = nopeus + 's';
        document.querySelector('#debug_kuorma').innerHTML = kokoKuorma.toString().slice(0,5);
        document.querySelector('#debug_kuormalis').innerHTML = klikkiKuorma.toString().slice(0,4);
        document.querySelector('#debug_lampotila').innerHTML = lampotila.toString().slice(0,5);
        document.querySelector('#debug_tuuletinprof').innerHTML = nykyinenProfiili;
        document.querySelector('#debug_kuormalamp').innerHTML = kl.toString().slice(0,4);
        document.querySelector('#debug_viilennys').innerHTML = vi;
        document.querySelector('#debug_lampvaikutus').innerHTML = yv.toString().slice(0,4);
    }

}

function animGPU(p) {
    if (typeof gpuid != 'undefined') {
        clearInterval(gpuid);
    }
    if (p != 0) {
        gpuid = setInterval(() => {
        animKohta = (animKohta < 3*156) ? animKohta + 156 : 0;
        document.querySelector('#nayttis').style.backgroundPosition = '0px -'+animKohta+'px';
        }, tuuletinProfiili[p].animAika)
    }
}

function asetaKuutionArvo(s,a) {
    document.querySelectorAll('.kuutio_sivu').forEach((cur) => {
        cur.style.setProperty(s,a)
    });
}

function haeKuutionArvo(s) {
    return getComputedStyle(document.querySelector('.kuutio_sivu')).getPropertyValue(s);
}

function asetaSivujenArvo(s,a) {
    if (!Array.isArray(a)) { /* yksittäinen arvo -> tehdään siitä array */
        a = Array(6).fill(a);
    }
    for (i=1;i<7;i++) {
        document.querySelector('#sivu'+i).style.setProperty(s,a[i-1]);
    }
}

function tarkistaPaivitykset() {
    /* löytyykö päivityksiä jotka pitäisi lisätä näkyville (klikkausrajaan on 20 tai alle) */
    let sopivat = paivitykset.filter(pa => pa.kaytetty === false && pa.naytossa === false && klikit >= pa.klikkiraja - 50 );
    if (sopivat.length > 0) {
        let lista = document.querySelector('#paivityslista');
        if (lista.querySelectorAll('#listateksti').length != 0) {
            document.querySelector('#listateksti').style.display = 'none';
        }
        sopivat.forEach((item) => {
            let ele = document.createElement('button');
            ele.type = 'button';

            let teksti = '<strong>'+item.otsikko+'</strong><small class="float-end align-bottom">'+ item.klikkiraja +' clicks required</small>';
            if (item.maksu != 0) {
                teksti += '<hr class="my-1"><small>Cost:</small><small class="float-end">-'+Math.round(100/item.maksu)+'% cube size';
                if (item.edellisetPoistettava == true) {
                    teksti += ' + previous side upgrades removed';
                }
                teksti += '</small>';
            }

            ele.innerHTML = teksti;
            ele.classList.add('btn','btn-success','text-start','disabled');
            ele.id = 'upgrade' + item.id;
            ele.addEventListener('click',() => { upgradeButton(item.id) });
            document.querySelector('#paivityslista').appendChild(ele);
            paivitykset[item.id].naytossa = true;
        });
    }
    /* löytyykö päivityksiä joiden napin käyttö pitää sallia? */
    sopivat = paivitykset.filter(pa => pa.kaytetty === false && pa.naytossa === true && klikit >= pa.klikkiraja);
    if (sopivat.length > 0) {
        sopivat.forEach((item) => {
            let e = document.querySelector('#upgrade'+item.id);
            e.classList.replace('disabled','enabled');
        });
    }

}

function upgradeButton(bid) {

    if (paivitykset[bid].maksu != 0) {
        
        koko = (koko - koko / paivitykset[bid].maksu < minimikoko) ? minimikoko : koko - koko / paivitykset[bid].maksu;
        if (varoitusPaalla == true) {
            varoitusPaalla = false;
            document.querySelector('#infoalue').style.opacity = 0;
        }
    }

    switch (bid) {
        case 0: /* solid sides */
            /* vihreä #428457, sininen 425784, violetti #574284, vaalena vihreä #578442, oranssi #845742, punainen #844257 */
            asetaKuutionArvo('opacity','1');
            asetaSivujenArvo('background-color',['#425784','#428457','#574284','#578442','#844257','#845742']);
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
        case 1: /* increase speed */
        case 4:
        case 7:
            let sis = document.querySelector('#sisalto');
            sis.style.opacity = 0;
            nopeus -= 2;
            setTimeout(() => {
                document.querySelector('.kuutio').style.animationDuration = nopeus+'s';
                sis.style.opacity = 1;
            },750);
            klikkiKuorma += paivitykset[bid].kuorma;
            break;
        case 2: /* transparent sides */
            asetaKuutionArvo('opacity','0.6');
            asetaSivujenArvo('background-color',['#425784','#428457','#574284','#578442','#844257','#845742']);
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
        case 3: /* shaded sides */
            asetaKuutionArvo('border','none');
            asetaKuutionArvo('opacity','1');
            asetaSivujenArvo('background-image',['linear-gradient(45deg, #a2b0d0, #425784)','linear-gradient(-135deg, #a2d0b0, #428457)','linear-gradient(135deg, #b0a2d0, #574284)','linear-gradient(-45deg, #b0d0a2, #578442)','linear-gradient(-135deg, #d0a2b0, #844257)','linear-gradient(135deg, #d0b0a2, #845742)']);
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
        case 5: /* tranparent shaded sides */
            asetaKuutionArvo('border','none');
            asetaKuutionArvo('opacity','0.6');
            asetaSivujenArvo('background-image',['linear-gradient(45deg, #a2b0d0, #425784)','linear-gradient(-135deg, #a2d0b0, #428457)','linear-gradient(135deg, #b0a2d0, #574284)','linear-gradient(-45deg, #b0d0a2, #578442)','linear-gradient(-135deg, #d0a2b0, #844257)','linear-gradient(135deg, #d0b0a2, #845742)']);
/*            asetaSivujenArvo('background-image',['linear-gradient(45deg, #425784, #428457)','linear-gradient(45deg, #844257, #845742)','linear-gradient(45deg, #425784, #428457)','linear-gradient(45deg, #425784, #428457)','linear-gradient(45deg, #425784, #428457)','linear-gradient(45deg, #425784, #428457)']); */
            /* asetaSivujenArvo('background-image','linear-gradient(45deg, #425784, #428457)'); */
            /* '#844257','#845742' */
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
        case 6: /* textured sides */
            asetaKuutionArvo('border','none');
            asetaKuutionArvo('opacity','1');
            asetaKuutionArvo('background-image','url("/img/marmori.jpg")');
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
/*
            case 8:
            asetaKuutionArvo('opacity','0.6');
            klikkiKuorma = paivitykset[bid].kuorma;
            break;
*/
        case 8: /* animated sides */
            asetaKuutionArvo('border','none');
            asetaKuutionArvo('opacity','0.8');
            asetaSivujenArvo('background-size','100%');
            asetaSivujenArvo('background-repeat','no-repeat');
            asetaSivujenArvo('background-color','#1a2033')
            asetaSivujenArvo('background-image',[
                'url("/img/anim1.gif")',
                'url("/img/anim2.gif")',
                'url("/img/anim3.gif")',
                'url("/img/anim2.gif")',
                'url("/img/anim1.gif")',
                'url("/img/anim1.gif")'
            ]);
            klikkiKuorma = paivitykset[bid].kuorma;
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


document.addEventListener('keypress', (eve) => {
    if (eve.key == 'D') {
        if (document.querySelector('#debug').style.display == 'none' && klikit > 0) {
            document.querySelector('#debug').style.display = 'initial';
            debug = true;
            document.querySelector('#aika').innerHTML = '-';
        } else {
            document.querySelector('#debug').style.display = 'none';
            debug = false;
        }
    }
});







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

