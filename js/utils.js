import { titulos } from "./data.js";

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


$(document).ready(function () {
    $("#titulo").text(getElegidoParaFecha(titulos))
})