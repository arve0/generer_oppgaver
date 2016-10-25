var settings = document.getElementById('settings');

var defaultNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var state = {
    inputs: {},
    symbols: {}
};

update();

settings.onkeyup = update;
settings.onchange = update;

function update (event) {
    var opts = getOptions();

    updateInputState(settings);

    var symbols = getSymbols(opts.formula);
    updateSymbolState(symbols);

    if (!arraySimilar(symbols, getCurrentInputSymbols(settings))) {
        // need to add/remove input-field for symbol
        updateSymbolForm(symbols);
    }

    render(opts);
};

function updateInputState (form) {
    state.inputs = {};
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i += 1) {
        var input = inputs[i];
        state.inputs[input.name] = input.value;
    }
}

function updateSymbolState (symbols) {
    for (var i = 0; i < symbols.length; i += 1) {
        var symbol = symbols[i];
        var input = state.inputs['symbol-' + symbol] || state.symbols[symbol] || defaultNumbers;
        state.symbols[symbol] = splitAndTrim('' + input);
    }
}

function updateSymbolForm (symbols) {
    var labels = '';
    var inputs = '';

    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        var values = '' + state.symbols[symbol];
        labels += `<label for=symbol-${symbol}>${symbol}</label>`;
        inputs += `<input name=symbol-${symbol} id=symbol-${symbol} type=text value="${values}">`;
    }

    document.getElementById('symbols').innerHTML = labels;
    document.getElementById('symbol-inputs').innerHTML = inputs;
}

function render (opts) {
    var out = document.getElementById('out');

    var rows = '';
    for (var i = 0; i < opts.rows; i += 1) {
        rows += '<tr>';
        for (var j = 0; j < opts.cols; j += 1) {
            rows += '<td>';
            rows += fillQuestion(opts.formula, state.symbols);
            rows += '</td>';
        }
        rows += '</tr>';
    }

    out.innerHTML = rows;
    byTagName(out, 'td').map((el) => {
        el.style.border = opts.border ? '' : 'none';
        el.style.padding = opts.padding;
    });

    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
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
    if (symbols === null) {
        return [];
    }
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


/**
 * splitAndTrim('1 2 3,4,5, 6 ,7;8 1.01') => [1, 2, 3, 4, 5, 6, 7, 8, 1.01]
 */
function splitAndTrim (str) {
    if (typeof str !== 'string') {
        return [];
    }
    var delimiters = /[ ,;]/;
    return str.split(delimiters).map(n => parseFloat(n)).filter(isFinite);
}

function getCurrentInputSymbols (form) {
    var inputs = form.getElementsByTagName('input');
    var symbols = [];
    for (var i = 0; i < inputs.length; i += 1) {
        var input = inputs[i];
        if (input.name.indexOf('symbol-') === 0) {
            symbols.push(input.name[7]);
        }
    }
    return symbols;
}

function byTagName (context, tagName) {
    var nodeList = context.getElementsByTagName(tagName);
    return Array.prototype.slice.call(nodeList);
}
