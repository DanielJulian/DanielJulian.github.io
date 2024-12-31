import { getElegidoParaFecha, verify } from "./global.js";
import { guess_character_fotos } from "./data.js";


var datatableCharacter;
const elegido_guess_character = getElegidoParaFecha(guess_character_fotos, new Date(), 10)
const foto_hoy = getElegidoParaFecha(elegido_guess_character['nombre_archivos'], new Date(), 10)


export var intentos_character = 0;
export var finished = false;

function initializeAutocomplete() {
    var chicosFotosArray = guess_character_fotos.map(chico => {
        return {
            label: chico.name,
            value: chico
        };
    });

    $('#autocomplete_guess_character').autocomplete({
        source: chicosFotosArray,
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        select: function (event, ui) {
            event.preventDefault();

            // Make the search bar empty
            $('#autocomplete_guess_character').val("")

            // Add the row to the table
            addRowGuessCharacter(ui.item.value)

            // Remove the selected item from the search bar
            chicosFotosArray = jQuery.grep(chicosFotosArray, function(element) {
                return element.value != ui.item.value;
            });
            $('#autocomplete_guess_character').autocomplete('option', 'source', chicosFotosArray);
        },
    });
}


function addRowGuessCharacter(chico) {
    $("#guesstable_character").show();
    $("#guesstable_character_parent").show();
    datatableCharacter
        .row
        .add([
            chico['name']
        ])
        .draw(false);
}


function initializeGuessTableCharacter() {
    return new DataTable('#guesstable_character', {
        info: false,
        ordering: false,
        paging: false,
        searching: false,
        createdRow: function(row, data, index) {
            rowCallbackFrase(row, data, index);
        }
    });
}


function rowCallbackFrase(row, data, index) {
    intentos_character++;
    let nombre = data[0];
    let asserted = verify(nombre, elegido_guess_character['name'], row, 0);
    if (asserted) {
        finished=true;
    }
}

function getCharacterDeAyer() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    let elegidoAyer = getElegidoParaFecha(guess_character_fotos, date, 10)
    return "El autista de ayer fue: " + elegidoAyer['name'];
}


$(document).ready(function () {
    initializeZoom();
    initializeAutocomplete();
    datatableCharacter = initializeGuessTableCharacter();
    $("#guess_character_foto_de_ayer").text(getCharacterDeAyer());
    $("#foto_hoy").text(foto_hoy);
    $("#guess_character_foto").attr("src", "../assets/img/guess_character/" + foto_hoy);



    // Attach event listener to the button
    button.addEventListener("click", zoomOut);
})


// Funcionalidad para zoom de la foto

const image = document.getElementById("guess_character_foto");
let zoomLevel = 3; // Initial zoom level
let isZoomingOut = false;

// Function to zoom in at a random position
function initializeZoom() {
  const randomX = Math.random() * 100; // Random percentage for X origin
  const randomY = Math.random() * 100; // Random percentage for Y origin

  // Set transform origin to the random point
  image.style.transformOrigin = `${randomX}% ${randomY}%`;

  // Apply zoom
  image.style.transform = `scale(${zoomLevel})`;
}

// Function to gradually zoom out
function zoomOut() {
  if (isZoomingOut || zoomLevel <= 1) return; // Prevent multiple clicks

  isZoomingOut = true;

  const zoomOutInterval = setInterval(() => {
    zoomLevel -= 0.1; // Decrease zoom level
    image.style.transform = `scale(${zoomLevel.toFixed(1)})`;

    if (zoomLevel <= 1) {
      clearInterval(zoomOutInterval); // Stop when fully zoomed out
      image.style.transform = "scale(1)";
      isZoomingOut = false;
    }
  }, 100); // Adjust the speed (in milliseconds)
}



const button = document.getElementById("zoomOutButton");