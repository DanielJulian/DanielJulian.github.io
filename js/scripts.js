import { chicos, frases_chicos, emojis_chicos } from "./data.js"

const question_mark = "❓";


var datatable;
var datatableFrase;
var datatableEmoji;


// Returns a unique item from a list each day of the year - Deterministic
function getElegidoParaFecha(chicos, fecha, offset = 0) {
  const today = fecha;

  // Get the day of the year (1-365 or 366)
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Simple seed-like approach using the dayOfYear
  const seed = dayOfYear + offset;

  // Use the seed to get a "random" index
  const index = seed % chicos.length;

  // Return the item from the list
  return chicos[index];
}


const elegido = getElegidoParaFecha(chicos, new Date())
const elegido_frase = getElegidoParaFecha(frases_chicos, new Date(), 10)
const frase_hoy = getElegidoParaFecha(elegido_frase['frases'], new Date(), 10)
const elegido_emoji = getElegidoParaFecha(emojis_chicos, new Date(), 20);
var intentos_emoji = 0;

var ultima_row_emoji  = "";


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

    const chicosFrasesArray = frases_chicos.map(chico => {
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
        },
    });

    const chicosEmojiArray = emojis_chicos.map(chico => {
        return {
            label: chico.name,
            value: chico
        };
    });

    $('#autocomplete_emoji').autocomplete({
        source: chicosEmojiArray,
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        select: function (event, ui) {
            event.preventDefault();

            // Make the search bar empty
            $('#autocomplete_emoji').val("")

            // Add the row to the table
            addRowGuessEmoji(ui.item.value)
        },
    });
}

function initializeGuessTable() {
    return new DataTable('#guesstable', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
          rowCallback(row, data, index);
        }
    });
}

function initializeGuessTableFrase() {
    return new DataTable('#guesstable_frase', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
          rowCallbackFrase(row, data, index);
        }
    });
}

function initializeGuessTableEmoji() {
    return new DataTable('#guesstable_emoji', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
            if (ultima_row_emoji != row) { // Para evitar callbacks llamados dos veces
                ultima_row_emoji = row;
                rowCallbackEmoji(row, data, index);
            }
        }
    });
}

function verify(expected, actual, row, idx) {
    if (expected == actual) {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'green');
        return true;
    } else {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'red');
        return false;
    }
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

    verify(nombre, elegido['name'], row, 0);
    verify(region, elegido['region'], row, 1);
    verify(trabaja, elegido['trabaja'], row, 2);
    verify(pelo, elegido['pelo'], row, 3);
    verify(colorPiel, elegido['color_de_piel'], row, 4);
    verify(lol, elegido['habilidad_lol'], row, 5);
    verify(cs, elegido['habilidad_cs'], row, 6);
    verify(gil, elegido['es_gil'], row, 7);
}

function rowCallbackFrase(row, data, index) {
    let nombre = data[0];
    verify(nombre, elegido_frase['name'], row, 0);
}

function rowCallbackEmoji(row, data, index) {
    let nombre = data[0];
    let asserted = verify(nombre, elegido_emoji['name'], row, 0);
    if (!asserted) {
        intentos_emoji++;
        drawEmojis();
    }

}

function addRowGuessAutista(chico) {
    $("#guesstable").show();
    $("#guesstable_parent").show();


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
            chico['es_gil']
        ])
        .draw(false);
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

function addRowGuessEmoji(chico) {
    $("#guesstable_emoji").show();
    $("#guesstable_emoji_parent").show();

    datatableEmoji
        .row
        .add([
            chico['name']
        ])
        .draw(false);
}

function getAutistaDeAyer() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    let elegidoAyer = getElegidoParaFecha(chicos, date)
    return "El autista de ayer fue " + elegidoAyer['name'];
}

function getFraseDeAyer() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    let elegidoAyer = getElegidoParaFecha(frases_chicos, date, 10)
    let fraseAyer =  getElegidoParaFecha(elegidoAyer['frases'], date, 10)
    return "Frase de ayer: " + fraseAyer;
}

function initializeEmojiGame() {
    var array_emojis = Array(elegido_emoji.icons.length).fill(question_mark);


    $("#emojis").text(array_emojis.join(' '))
}

function drawEmojis() {
    var array_emojis = Array(elegido_emoji.icons.length).fill(question_mark);

    for (let i = 0; i <= intentos_emoji; i++) {
        array_emojis[i] = elegido_emoji.icons[i]
    }

    $("#emojis").text(array_emojis.join(' '))
}

$(document).ready(function () {
    initializeAutocomplete();
    datatable = initializeGuessTable();
    datatableFrase = initializeGuessTableFrase();
    datatableEmoji = initializeGuessTableEmoji();

    $("#autista_de_ayer").text(getAutistaDeAyer());
    $("#frase_de_ayer").text(getFraseDeAyer());

    $("#frase_hoy").text(frase_hoy);

    initializeEmojiGame();
    drawEmojis();
})


window.mostrarPista = function mostrarPista() {
    $("#pista").text(elegido['lore'])
}