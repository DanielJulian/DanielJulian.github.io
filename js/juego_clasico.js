import { chicos } from "./data.js";
import { getElegidoParaFecha, verify, verifyList } from "./utils.js"


var datatable;
const elegido = getElegidoParaFecha(chicos, new Date());
var intentos_clasico = 0;
var ultima_row_dibujada  = "";

function initializeAutocomplete() {
    const chicosArray = chicos.map(chico => {
        return {
            label: chico.name,
            value: chico
        };
    });

    $('#autocomplete').autocomplete({
        source: chicosArray,
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        select: function (event, ui) {
            event.preventDefault();

            // Make the search bar empty
            $('#autocomplete').val("")

            // Add the row to the table
            addRowGuessAutista(ui.item.value)
        },
    });
}

function addRowGuessAutista(chico) {
    $("#guesstable").show();
    $("#guesstable_parent").show();

    let tribus = chico['tribus'].join("<br>")

    datatable
        .row
        .add([
            chico['name'],
            chico['region'],
            chico['trabaja'],
            chico['pelo'],
            chico['color_de_piel'],
            chico['habilidad_lol'],
            chico['habilidad_cs'],
            chico['es_gil'],
            tribus
        ])
        .draw(false);
}

function initializeGuessTable() {
    return new DataTable('#guesstable', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
            if (ultima_row_dibujada !== row) {
                ultima_row_dibujada = row;
                rowCallback(row, data, index);
            }
        }
    });
}

function rowCallback(row, data, index) {
    let nombre = data[0];
    let region = data[1];
    let trabaja = data[2];
    let pelo = data[3];
    let colorPiel = data[4];
    let lol = data[5];
    let cs = data[6];
    let gil = data[7];
    let tribus = data[8].split("<br>");

    verify(nombre, elegido['name'], row, 0);
    verify(region, elegido['region'], row, 1);
    verify(trabaja, elegido['trabaja'], row, 2);
    verify(pelo, elegido['pelo'], row, 3);
    verify(colorPiel, elegido['color_de_piel'], row, 4);
    verify(lol, elegido['habilidad_lol'], row, 5);
    verify(cs, elegido['habilidad_cs'], row, 6);
    verify(gil, elegido['es_gil'], row, 7);
    verifyList(tribus, elegido['tribus'], row, 8);

    intentos_clasico++;
    console.log(intentos_clasico)
}

function getAutistaDeAyer() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    let elegidoAyer = getElegidoParaFecha(chicos, date)
    return "El autista de ayer fue " + elegidoAyer['name'];
}

$(document).ready(function () {
    initializeAutocomplete();
    datatable = initializeGuessTable();
    $("#autista_de_ayer").text(getAutistaDeAyer());
})

window.mostrarPista = function mostrarPista() {
    $("#pista").text(elegido['lore'])
}