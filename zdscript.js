console.log('COOL');

function getSearchData() {
    const searchInput = document.querySelector('data-test="universal-search-text-box"');
    const text = searchInput.getAttribute('value');

    return {
        inputText: text
    };
}

function getGrid() {
    // const nodes = document.querySelectorAll('[data-test^="search-result-item"]');
    const nodes = document.querySelectorAll('[data-location-id]');
    console.log(nodes);

    let grid = []

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        console.log(node);


        const reviewCountNode = node.querySelector('[data-test="doctor-card-review-count"]');
        let reviewCount = 0;
        if(reviewCountNode){
            reviewCount = parseInt(reviewCountNode.innerHTML.replace('(', '').replace(')', ''))
        } 

        const nextAvailBtn = node.querySelector('[data-test="ap-desktop-content-go-to-day-with-avail-btn"]');
        console.log(nextAvailBtn)

        const rowNodes = node.querySelectorAll('[data-test="ap-desktop-content-grid-row"]');

        let row = [];
        for (let j = 0; j < rowNodes.length; j++) {

            const rowNode = rowNodes[j];
            const cellNodes = rowNode.querySelectorAll('[data-test="ap-desktop-content-grid-cell"]');



            for (let c = 0; c < cellNodes.length; c++) {
                const cell = cellNodes[c];

                const data = {}

                const tag = cell.firstChild.tagName;

                data.hasTime = !nextAvailBtn && (tag == 'A' || tag == 'BUTTON')

                data.slot = cell;
                data.reviewCount = reviewCount;
                data.nextAvailBtn = nextAvailBtn;

                row.push(data)
            }
        }
        console.log(row.map(p => p.hasTime ? 1 : 0))

        if(row.length > 0 ){
            grid.push(row)
        }
    }

    console.log(grid);

    return grid;
}

function createTestGrid() {
        //  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    let grid = [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [1, 1, 0, 1, 0, 1, 1, 0, 1, 1],

         [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
         [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
         [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],

         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],

        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        // [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    ];

    // let actualGrid = [
    //     // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    //     [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    //     [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],

    //     [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    //     [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
    //     [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
    //     [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],

    //     [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    //     [1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    //     [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1]
    // ]

    // return grid;
    let g = grid;

    let output = new Array(g.length);
    for(let i = 0; i < g.length; i++){

        let row = new Array(g[i].length);
        for(let j = 0; j < g[i].length; j++){
            row[j] = {
                hasTime: g[i][j] == 1,
                slot: undefined,
                reviewCount: 100
            }
        }
        output[i] = row;
    }

    return output;
}


function createSnare() {
    const lowPass = new Tone.Filter({
        frequency: 11000,
    }).toMaster();

    const noise = new Tone.NoiseSynth({
        volume: -6,
        noise: {
            type: 'pink',
            playbackRate: 3,
        },
        envelope: {
            attack: 0.001,
            decay: 0.13,
            sustain: 0,
            release: 0.03,
        },
    }).connect(lowPass);

    const poly = new Tone.PolySynth(6, Tone.Synth, {
        volume: 0,
        oscillator: {
            partials: [0, 2, 3, 4],
        },
        envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0,
            release: 0.1,
        },
    }).toMaster();

    // const notes = ['C2', 'D#2', 'G2'];
    const notes = ["C2", "Eb2", "G2", "Bb2"];

    const freqEnv = [];
    poly.voices.forEach((v, i) => {
        const env = new Tone.FrequencyEnvelope({
            attack: 0.001,
            decay: 0.08,
            release: 0.08,
            baseFrequency: Tone.Frequency(notes[i]),
            octaves: Math.log2(13),
            releaseCurve: 'exponential',
            exponent: 3.5,
        });
        env.connect(v.oscillator.frequency);
        freqEnv[i] = env;
    });

    const part = new Tone.Part(
        (time) => {
            poly.voices.forEach((v, i) => {
                freqEnv[i].triggerAttackRelease('16n', time);
                v.envelope.triggerAttackRelease('16n', time);
            });
            noise.triggerAttackRelease('16n', time);
        },
        ['0:1', '0:3'],
    );

    return {
        noise,
        poly,
        part
    }
}


function playDrums(grid, startRow, animateCell) {
    const bassDrum = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: {
            type: "fmsine",
            phase: 140,
            modulationType: "sine",
            modulationIndex: 0.8,
            partials: [1] //1,0.1,0.01,0.01
        },
        envelope: {
            attack: 0.01,
            decay: 0.74,
            sustain: 0.71,
            release: 0.05,
            attackCurve: "exponential"
        }
    }).toMaster();

    const cymbal = new Tone.MetalSynth(
        {
            frequency: 100,
            envelope: {
                attack: 0.01,
                decay: .4,
                release: 0.2
            },
            harmonicity: 5,
            modulationIndex: 32,
            resonance: 1000,
            octaves: .7 
        }
    ).toMaster();
    cymbal.volume.value = -18;

    const snare = createSnare();


    const events = [];
    for (let i = 0; i <= grid[0].length - 1; i++) {
        events.push(i);
    }


    const sequence = new Tone.Sequence(
        (time, col) => {
            if (grid[startRow][col].hasTime) {
                bassDrum.triggerAttackRelease('G1', '16n', time);
                animateCell(startRow, col, true)
            } else {
                animateCell(startRow, col, false)
            }

            if (grid[startRow+1][col].hasTime) {
                // cymbal.frequency.setValueAtTime(100, time, Math.random() * 0.5 + 0.5);
                // cymbal.frequency.setValueAtTime(100, time);
                cymbal.triggerAttack(time)
                animateCell(startRow+1, col, true)
            } else {
                animateCell(startRow+1, col, false)
            }

            if(grid[startRow+2][col].hasTime) {
                animateCell(startRow+2, col, true)
                snare.noise.triggerAttack(time)
                snare.poly.triggerAttack(time);
                // snare.poly.triggerAttackRelease('C2', '16n', time);
                // snare.poly.triggerAttackRelease(['Eb3', 'G4', 'C5'], '16n', time);
            } else {
                animateCell(startRow+2, col, false)
            }
        },
        events,
        '8n'
    );
    sequence.start();

    return startRow+3;
}

function playSynths(grid, startRow, animateCell, scale) {
    const synth = new Tone.PolySynth().toMaster();

    const notes = Tone.Frequency(scale.note).harmonize(scale.intervals)
    console.log(notes.map(s => s.toNote()))
    // const notes = ["C3", "Eb3", "G3", "Bb3"];
    // const notes = [
    //     "A2",
    //     "C#3",
    //     "E3",
    //     "F#3",
    // ];
    const events = [];
    for (let i = 0; i <= grid[0].length - 1; i++) {
        events.push(i);
    }

    const sequence = new Tone.Sequence(
        (time, col) => {
            let chord = [];
            const last = Math.min(grid.length-1, startRow + 3)
            for (let i = startRow; i <= last; i++) {
                if (grid[i][col].hasTime) {
                    chord.push(notes[i - startRow])
                    animateCell(i, col, true)
                } else {
                    animateCell(i, col, false)
                }
            }

            // console.log(chord);
            synth.triggerAttackRelease(chord, '4n', time);
        },
        events,
        '4n'
    );
    sequence.start();

    return startRow + 4
}

function playLead(grid, startRow, animateCell, scale){
    const makeSynth = () => {
        let synth = new Tone.AMSynth({
            "harmonicity" : 2.5,
            "oscillator" : {
                "type" : "fatsawtooth"
            },
            "envelope" : {
                "attack" : 0.1,
                "decay" : 0.2,
                "sustain" : 0.2,
                "release" : 0.3
            },
            "modulation" : {
                "type" : "square"
            },
            "modulationEnvelope" : {
                "attack" : 0.5,
                "decay" : 0.01
            }
        }).toMaster();
        return synth;
    }

    // const synth = makeSynth();

    const events = [];
    // const notes = ["C5", "Eb5", "G5", "Bb5"];
    const notes = Tone.Frequency(scale.note).harmonize(scale.intervals)
    console.log(notes.map(s => s.toNote()))
    const synths = [];
    for(let i = 0; i < 4; i++){
        synths.push(makeSynth());
    }

    for (let i = 0; i <= grid[0].length - 1; i++) {
        events.push(i);
    }

    const sequence = new Tone.Sequence(
        (time, col) => {
            let chord = [];
            const last = Math.min(grid.length-1, startRow + 3)
            for (let i = startRow; i <= last; i++) {
                if (grid[i][col].hasTime) {
                    // chord.push(notes[i - startRow])
                    // let note = notes[i - startRow]
                    // synth.triggerAttackRelease(note, '8n', time);

                    let synth = synths[i - startRow];
                    let note = notes[i - startRow]
                    synth.triggerAttackRelease(note, '8n', time);
                    animateCell(i, col, true)
                } else {
                    animateCell(i, col, false)
                }
            }

            // console.log(chord);
            // for( let i = 0; i < chord.length; i++){
            //     synth.triggerAttackRelease(chord[chord.length-1], '8n', time);
            // }
            // if(chord.length > 0){
            //     synth.triggerAttackRelease(chord[chord.length-1], '8n', time);
            // }
        },
        events,
        '8n'
    );
    sequence.start();
}

function calculateBpm(grid, startRow, endRow){
    let sum = 0;
    let count = 0;
    for(let r = startRow; r <= endRow; r++){
        for(let c = 0; c < grid[r].length; c++){
            sum += grid[r][c].reviewCount
            count++
        }
    }
    return Math.max(Math.min(sum/count, 200), 70);
}

function playGrids(grid, animateCell) {
    console.log('playing', grid);

    let scale = {
        note: "C3",
        // intervals: [0, 4, 7, 10]
        intervals: [0, 3, 7, 10]
    }

    const r1 = playDrums(grid, 0, animateCell);

    const r2 = playSynths(grid, r1, animateCell, scale);

    scale.note = "D#3"
    playLead(grid, r2, animateCell, scale)

    const bpm = calculateBpm(grid, 0, grid.length-1)
    console.log("bpm is ", bpm);
    Tone.Transport.bpm.value = bpm;

    Tone.Transport.start();
}


function fuckYeah() {
    console.log('fuck yeah 2');

    // let grid = createTestGrid();

    let grid = getGrid();


    const animateCell = (r, c, play) => {
        const cell = grid[r][c]

        if(cell.slot !== undefined && !cell.nextAvailBtn){
            // console.log('animateCell ', r, c)
            cell.slot.classList.remove('idle-note')
            cell.slot.classList.add('play-note')
            setTimeout(() => {
                cell.slot.classList.remove('play-note')
                cell.slot.classList.add('idle-note')
            }, 200);
        }
    }
    

    playGrids(grid, animateCell);

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'http://localhost:8000/src/anim.css');
    document.getElementsByTagName('head')[0].appendChild(link);
}

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 192) {
        if (e.shiftKey) {
            Tone.Transport.stop();
        } else {
            fuckYeah();
        }
    }
});