var ut = document.getElementById('ut');

var rekker = 10;
var kolonner = 7;

var rows = '';
for (var i = 0; i < rekker; i += 1) {
    rows += '<tr>';
    for (var j = 0; j < kolonner; j += 1) {
        rows += '<td>';
        rows += '<small>Hvem er størst?</small><br>';
        rows += '<span>';
        rows += fillQuestion('a/b', {
            a: [1, 2, 3, 4, 5],
            b: [1, 2, 3, 4, 5, 10]
        });
        rows += '</span>';
        rows += '<span class="second">';
        rows += fillQuestion('a/b', {
            a: [1, 2, 3, 4, 5],
            b: [1, 2, 3, 4, 5, 10]
        });
        rows += '</span>';
        rows += '</td>';
    }
    rows += '</tr>';
}

ut.innerHTML = rows;


/**
 * fillQuestion('x+y', { x: [1, 2, 3], y: [3, 4, 5] })
 * gives '2+5', where 2 and 5 is picked at random
 */
function fillQuestion (question, numbers) {
    var out = '';
    for (var i = 0; i < question.length; i += 1) {
        var char_ = question[i];
        if (Array.isArray(numbers[char_])) {
            out += pick(numbers[char_]); 
        } else {
            out += char_;
        }
    }
    return '`' + out + '`';
}

function pick (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}