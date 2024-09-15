import { titulos } from "./data.js";
import { intentos_clasico, finished as clasico_finished } from "./juego_clasico.js";
import { intentos_frase, finished as frase_finished } from "./juego_frase.js";
import { intentos_emoji, finished as emoji_finished } from "./juego_emoji.js";

var intervalID = 0;


// Returns a unique item from a list each day of the year - Deterministic
export function getElegidoParaFecha(chicos, fecha = new Date(), offset = 0) {
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

export function verify(expected, actual, row, idx) {
    if (expected == actual) {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'green');
        return true;
    } else {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'red');
        return false;
    }
}

export function verifyList(expected, actual, row, idx) {
    let commonCounter = 0;
    for (let i = 0; i < expected.length; i++) {
        for (let j = 0; j < actual.length; j++) {
            if (expected[i] === actual[j]) {
                commonCounter++;
            }
        }
    }

    if (commonCounter === expected.length) {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'green');
        return true;
    } else if (commonCounter > 0) {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'orange');
        return false;
    } else {
        $(row).find('td:eq(' + idx + ')').css('background-color', 'red');
        return false;
    }
}


function checkAllGamesFinished() {
    let allFinished = false;
    if ([clasico_finished, frase_finished, emoji_finished].every(Boolean)) { // If all are true
        console.log(intentos_clasico);
        console.log(intentos_frase);
        console.log(intentos_emoji);
        clearInterval(intervalID);
    }
}

$(document).ready(function () {
    $("#titulo").text(getElegidoParaFecha(titulos));

    intervalID = setInterval(() => checkAllGamesFinished(), 1000);
})


