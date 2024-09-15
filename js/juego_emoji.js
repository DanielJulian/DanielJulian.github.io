import { emojis_chicos } from "./data.js"
import { getElegidoParaFecha, verify} from "./global.js"

const question_mark = "❓";
const elegido_emoji = getElegidoParaFecha(emojis_chicos, new Date(), 20);
var datatableEmoji;
export var intentos_emoji = 0;
export var finished = false;

var ultima_row_dibujada  = ""; // Para evitar callbacks llamados dos veces

function initializeAutocomplete() {
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

function initializeGuessTableEmoji() {
    return new DataTable('#guesstable_emoji', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        rowCallback: function(row, data, index) {
            if (ultima_row_dibujada !== row) {
                ultima_row_dibujada = row;
                rowCallbackEmoji(row, data, index);
            }
        }
    });
}

function rowCallbackEmoji(row, data, index) {
    intentos_emoji++;
    let nombre = data[0];
    let asserted = verify(nombre, elegido_emoji['name'], row, 0);
    if (!asserted) {
        drawEmojis();
    } else { // Si adivinó, dibujamos todos los emojis
        drawEmojis(true);
        finished=true;
    }
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

function initializeEmojiGame() {
    var array_emojis = Array(elegido_emoji.icons.length).fill(question_mark);
    $("#emojis").text(array_emojis.join(' '))
}

function drawEmojis(draw_all=false) {
    var array_emojis = Array(elegido_emoji.icons.length).fill(question_mark);

    if (draw_all) {
        $("#emojis").text(elegido_emoji.icons.join(' '))
    } else {
        for (let i = 0; i <= intentos_emoji; i++) {
            array_emojis[i] = elegido_emoji.icons[i]
        }
        $("#emojis").text(array_emojis.join(' '))
    }
}

$(document).ready(function () {
    initializeAutocomplete();
    datatableEmoji = initializeGuessTableEmoji();
    initializeEmojiGame();
    drawEmojis();
})
