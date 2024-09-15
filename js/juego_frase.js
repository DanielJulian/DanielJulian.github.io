import { getElegidoParaFecha, verify } from "./global.js";
import { frases_chicos } from "./data.js";


var datatableFrase;
var ultima_row_dibujada  = "";
const elegido_frase = getElegidoParaFecha(frases_chicos, new Date(), 10)
const frase_hoy = getElegidoParaFecha(elegido_frase['frases'], new Date(), 10)
export var intentos_frase = 0;
export var finished = false;

function initializeAutocomplete() {
    var chicosFrasesArray = frases_chicos.map(chico => {
        return {
            label: chico.name,
            value: chico
        };
    });

    $('#autocomplete_frase').autocomplete({
        source: chicosFrasesArray,
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        select: function (event, ui) {
            event.preventDefault();

            // Make the search bar empty
            $('#autocomplete_frase').val("")

            // Add the row to the table
            addRowGuessFrase(ui.item.value)

            // Remove the selected item from the search bar
            chicosFrasesArray = jQuery.grep(chicosFrasesArray, function(element) {
                return element.value != ui.item.value;
            });
            $('#autocomplete_frase').autocomplete('option', 'source', chicosFrasesArray);
        },
    });
}


function addRowGuessFrase(chico) {
    $("#guesstable_frase").show();
    $("#guesstable_frase_parent").show();
    datatableFrase
        .row
        .add([
            chico['name']
        ])
        .draw(false);
}


function initializeGuessTableFrase() {
    return new DataTable('#guesstable_frase', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
            if (ultima_row_dibujada !== row) {
                ultima_row_dibujada = row;
                rowCallbackFrase(row, data, index);
            }
        }
    });
}


function rowCallbackFrase(row, data, index) {
    intentos_frase++;
    let nombre = data[0];
    let asserted = verify(nombre, elegido_frase['name'], row, 0);
    if (asserted) {
        finished=true;
    }
}

function getFraseDeAyer() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    let elegidoAyer = getElegidoParaFecha(frases_chicos, date, 10)
    let fraseAyer =  getElegidoParaFecha(elegidoAyer['frases'], date, 10)
    return "Frase de ayer: " + fraseAyer;
}


$(document).ready(function () {
    initializeAutocomplete();
    datatableFrase = initializeGuessTableFrase();
    $("#frase_de_ayer").text(getFraseDeAyer());
    $("#frase_hoy").text(frase_hoy);
})