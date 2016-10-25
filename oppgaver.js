var settings = document.getElementById('settings');

var state = {};

render(getOptions());

settings.onchange = function (event) {
    var opts = getOptions();
    var symbols = getSymbols(opts.formula);
    if (!arraySimilar(symbols, state.symbols)) {
        // symbolFormUpdate(symbols);
    }

    render(opts);
};

function render (opts) {
    var out = document.getElementById('out');
    var rows = '';
    for (var i = 0; i < opts.rows; i += 1) {
        rows += '<tr>';
        for (var j = 0; j < opts.cols; j += 1) {
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

    out.innerHTML = rows;
}


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

/**
 * getSymbols('x + y / z + x') => ['x', 'y', 'z']
 */
function getSymbols (str) {
    var r = /[a-zA-Z]/g
    var symbols = str.match(r);
    var uniq = [];
    for (var i = 0; i < symbols.length; i += 1) {
        if (uniq.indexOf(symbols[i]) === -1) {
            uniq.push(symbols[i]);
        }
    }
    return uniq;
}

function getOptions () {
    var settings = document.getElementById('settings');
    return {
        rows: parseInt(settings.rows.value),
        cols: parseInt(settings.cols.value),
        padding: parseInt(settings.padding.value) + 'px',
        border: settings.border.checked,
        formula: settings.formula.value,
    };
}

/**
 * arraySimilar(['x', 'y'], ['x', 'y']) => true
 * arraySimilar(['x', 'y'], ['y', 'x']) => true
 * arraySimilar(['x', 'y'], ['y']) => false
 */
function arraySimilar (a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }
    if (a.length != b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i += 1) {
        if (b.indexOf(a[i]) === -1) {
            return false;
        }
    }
    return true;
}