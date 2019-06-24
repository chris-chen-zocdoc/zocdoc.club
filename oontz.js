console.log('COOL');

function getSearchData() {
    const searchInput = document.querySelector('[data-test="universal-search-text-box"]');
    const text = searchInput.getAttribute('value');

    const visitReason = document.querySelector('[data-test="facet-chip-button"]');
    const specialty = document.querySelector('[data-test="search-seo-header"]');


    const t = {
        inputText: text,
        visitReason: visitReason.innerText,
        specialty: specialty ? (specialty.firstChild ? specialty.firstChild.innerText : "") : "",
    };

    console.log(t)

    return t;
}

function getGrid() {
    // const nodes = document.querySelectorAll('[data-test^="search-result-item"]');
    const nodes = document.querySelectorAll('[data-location-id]');
    console.log(nodes);

    let grid = [];

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        console.log(node);


        const reviewCountNode = node.querySelector('[data-test="doctor-card-review-count"]');
        let reviewCount = 0;
        if(reviewCountNode){
            reviewCount = parseInt(reviewCountNode.innerHTML.replace('(', '').replace(')', ''))
        } 

        let nextAvailBtn = node.querySelector('[data-test="ap-desktop-content-go-to-day-with-avail-btn"]');
        if(!nextAvailBtn) {
            nextAvailBtn = node.querySelector('[data-test="ap-desktop-content-preview-doctor-timeslot"]');
        }
        console.log(nextAvailBtn);

        const name = node.querySelector('[data-test="doctor-card-info-name-full"]');
        console.log(name)

        const rowNodes = node.querySelectorAll('[data-test="ap-desktop-content-grid-row"]');

        let row = [];
        for (let j = 0; j < rowNodes.length; j++) {

            const rowNode = rowNodes[j];
            const cellNodes = rowNode.querySelectorAll('[data-test="ap-desktop-content-grid-cell"]');



            for (let c = 0; c < cellNodes.length; c++) {
                const cell = cellNodes[c];

                const data = {};

                const tag = cell.firstChild.tagName;

                data.hasTime = !nextAvailBtn && (tag == 'A' || tag == 'BUTTON');

                data.slot = cell;
                data.reviewCount = reviewCount;
                data.nextAvailBtn = nextAvailBtn;
                data.name = name.innerText;

                row.push(data);
            }
        }
        console.log(row.map(p => p.hasTime ? 1 : 0));

        if(row.length > 0 ){
            grid.push(row);
        }
    }

    console.log(grid);

    return grid;
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
            decay: 0.23,
            sustain: 0.0,
            release: 0.23,
        },
    }).connect(lowPass);

    const poly = new Tone.PolySynth(6, Tone.Synth, {
        volume: 10,
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

function makeBassDrum() {
    const bd = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
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
            sustain: 0.91,
            release: 0.05,
            attackCurve: "exponential"
        }
    }).toMaster();

    const distort = new Tone.Distortion(0.8).toMaster();
    bd.connect(distort)
    return bd;
}


function playDrums(grid, startRow, animateCell) {
    if(startRow > grid.length -1){
        return startRow;
    }

    const bassDrum = makeBassDrum();

    const cymbal = new Tone.MetalSynth(
        {
            frequency: 700,
            envelope: {
                attack: 0.01,
                decay: .6,
                release: 0.2
            },
            harmonicity: 3,
            modulationIndex: 24,
            resonance: 1500,
            octaves: 1.7,
        }
    ).toMaster();
    cymbal.volume.value = -18;

    // const filter = new Tone.Filter({
    //     frequency: 10000
    // }).toMaster();

    // cymbal.connect(filter)

    const reverb = new Tone.Reverb().toMaster();
    cymbal.connect(reverb)


    const snare = createSnare();


    const events = [];
    for (let i = 0; i <= grid[0].length - 1; i++) {
        events.push(i);
    }

    const beats = [
        ['8n', '4n', false],
        ['16n', '8n', true],
        ['8n', '8n', false],
        // ['16n', '16n', true],
    ]

    const beat = beats[grid[startRow][0].name.length % beats.length]

    const sequence = new Tone.Sequence(
        (time, col) => {
            if (grid[startRow][col].hasTime) {
                let notes = ['G1', 'F1', 'E1']
                bassDrum.triggerAttackRelease(notes[grid[startRow][col].name.length % notes.length], beat[0], time);
                animateCell(startRow, col, true, beat[2])
            } else {
                animateCell(startRow, col, false)
            }

            if (grid[startRow+1][col].hasTime) {
                snare.noise.triggerAttack(time)
                snare.poly.triggerAttack(time);
                // snare.poly.triggerAttackRelease('C2', '16n', time);
                // snare.poly.triggerAttackRelease(['Eb3', 'G4', 'C5'], '16n', time);
                animateCell(startRow+1, col, true, beat[2])
            } else {
                animateCell(startRow+1, col, false)
            }

            if(grid[startRow+2][col].hasTime) {
                cymbal.frequency.setValueAtTime(100, time, Math.random() * 0.5 + 0.5);
                // cymbal.frequency.setValueAtTime(100, time);
                cymbal.triggerAttack(time)

                animateCell(startRow+2, col, true, beat[2])
            } else {
                animateCell(startRow+2, col, false)
            }
        },
        events,
        beat[1]
    );
    sequence.start();

    return startRow+3;
}

function playSynths(grid, startRow, animateCell, scale) {

    if(startRow > grid.length -1){
        return startRow;
    }

    const synth = new Tone.PolySynth(
        {

        }
    ).toMaster();

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

    const beats = [
        ['4n', '4n', false],
        ['8n', '8n', false],
        ['4n', '8n', false],
        ['16n', '8n', false],
    ]

    const beat = beats[grid[startRow][0].name.length % beats.length]

    const sequence = new Tone.Sequence(
        (time, col) => {
            let chord = [];
            const last = Math.min(grid.length-1, startRow + 3)
            for (let i = startRow; i <= last; i++) {
                if (grid[i][col].hasTime) {
                    chord.push(notes[i - startRow])
                    animateCell(i, col, true, beat[2])
                } else {
                    animateCell(i, col, false)
                }
            }

            // console.log(chord);
            synth.triggerAttackRelease(chord, beat[0], time);
        },
        events,
        beat[1] 
    );
    sequence.start();

    return startRow + 4
}

function playLead(grid, startRow, animateCell, scale){
    if(startRow > grid.length -1){
        return startRow;
    }

    const makeSynth = () => {
        let synth = new Tone.FMSynth({
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
                "type" : "sine2"
            },
            "modulationEnvelope" : {
                "attack" : 0.5,
                "decay" : 0.01
            }
        }).toMaster();
        return synth;
    }

    // const synth = makeSynth();

    // const notes = ["C5", "Eb5", "G5", "Bb5"];
    const notes = Tone.Frequency(scale.note).harmonize(scale.intervals)
    console.log(notes.map(s => s.toNote()))
    const synths = [];
    for(let i = 0; i < 4; i++){
        synths.push(makeSynth());
    }

    const reverb = new Tone.Reverb().toMaster();
    reverb.generate()

    const vibrato = new Tone.Vibrato({
        frequency: 2,
        depth: 0.1
    }).toMaster();

    synths.forEach(s => {
        s.connect(reverb).connect(vibrato)
        s.volume.value = -6;
    })


    const events = [];
    for (let i = 0; i <= grid[0].length - 1; i++) {
        events.push(i);
    }

    const beats = [
        ['4n', '4n', false],
        ['8n', '8n', false],
        ['4n', '8n', false],
        ['16n', '8n', true],
    ]

    const beat = beats[grid[startRow][0].name.length % beats.length]

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
                    // synth.triggerAttackRelease(note, '8n', time + ((Math.random() * .5) - .25));
                    synth.triggerAttackRelease(note, beat[0], time);
                    animateCell(i, col, true, beat[2])
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
        beat[1]
    );
    sequence.start();
}

function calculateBpm(grid, startRow, endRow){
    if(grid.length == 0){
        return 70;
    }

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

function playGrids(grid, searchData, animateCell) {
    console.log('playing', grid);

    let a = 'A'.charCodeAt(0);
    let diff = 'G'.charCodeAt(0) - a;

    let c;
    if(searchData.specialty.length > 0){

        let total = 0;
        for(let i = 0; i < searchData.specialty.length; i++){
            total += searchData.specialty.charCodeAt(i);
        }

        let z = total % (diff * 2)
        console.log('z ', z)

        c = Tone.Frequency('A2').harmonize([z])[0].toNote()
    } else {
        c = 'A2'
    }

    console.log(c);

    const intervals = [
        [0, 3, 7, 10],
        [0, 4, 7, 10],
        // [0, 3, 5, 9, 11],
        // [0, 4, 8, 11],
    ]

    let interval = intervals[0]
    console.log(interval);

    if(searchData.visitReason.length > 0){
        let total = 0;
        for(let i = 0; i < searchData.visitReason.length; i++){
            total += searchData.visitReason.charCodeAt(i);
        }
        
        interval = intervals[total % intervals.length]
    }

    let scale = {
        note: `${c}`,
        intervals: interval
    }

    const r1 = playDrums(grid, 0, animateCell);

    const r2 = playSynths(grid, r1, animateCell, scale);

    const shifts = [-12, -8, 8, 12, 16, 24]
    const cool = shifts[searchData.specialty.length % shifts.length]

    console.log('shifts', cool)

    scale.note = Tone.Frequency(`${c}`).harmonize([cool])[0].toNote()
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
    let searchData = getSearchData();

    const animateCell = (r, c, play, fast = false) => {
        const cell = grid[r][c]

        if(cell.slot !== undefined && !cell.nextAvailBtn){
            // console.log('animateCell ', r, c)
            cell.slot.classList.remove('idle-note')
            cell.slot.classList.add('play-note')
            setTimeout(() => {
                cell.slot.classList.remove('play-note')
                cell.slot.classList.add('idle-note')
            }, fast ? 100: 200);
        }
    }
    

    playGrids(grid, searchData, animateCell);

    const prefixes = document.querySelectorAll('[data-test="doctor-card-info-name-prefix"]');
    console.log(prefixes)
    if(prefixes){
        for(let i = 0; i < prefixes.length; i++){
            prefixes[i].innerText = "DJ "
        }
    }

    addCss();

    specialFX();
}

var crap;

function specialFX() {
    console.log('fxxx');

    const sidebar = document.querySelector('[data-test="search-sidebar"]');

    let overlay = document.getElementById('dj-overlay')

    if(!overlay){
        overlay = document.createElement('div');
        overlay.setAttribute('id', 'dj-overlay');
        sidebar.appendChild(overlay);
    }

    let clubber = document.getElementById('dj-club-container')
    if(!clubber){
        const clubContainer = document.createElement('div');
        clubContainer.setAttribute('id', 'dj-club-container');


        const club = document.createElement('span');
        club.setAttribute('id', 'dj-club');
        club.innerText = "Oontz";

        clubContainer.appendChild(club)

        sidebar.appendChild(clubContainer)
    }

    hideStuff(false);
}

function hideStuff(s) {
    let overlay = document.getElementById('dj-overlay')
    if(overlay){
        if(!s && (overlay.style.display == 'none' || overlay.style.display == '')){
            overlay.style.display = 'block';
        } else if(s && (overlay.style.display == 'block')){
            overlay.style.display = 'none';
        }
    }

    let clubber = document.getElementById('dj-club-container')
    if(clubber){
        if(!s && (clubber.style.display == 'none' || clubber.style.display == '')){
            clubber.style.display = 'block';
        } else if(s && (clubber.style.display == 'block')){
            clubber.style.display = 'none';
        }
    }

        if(!s){
            if(crap){
                clearInterval(crap);
                crap = undefined;
            }

            crap = setInterval(() => {
                const images = document.querySelectorAll('[data-test="doctor-card-photo-image"]');
                for(let i = 0; i < images.length; i++){
                    images[i].parentNode.parentNode.classList.add('rotate')
                }
            }, 500)
        } else {
            if(crap){
                clearInterval(crap);
                crap = undefined;

            }

            crap = setInterval(() => {
                const images = document.querySelectorAll('[data-test="doctor-card-photo-image"]');
                for(let i = 0; i < images.length; i++){
                    images[i].parentNode.parentNode.classList.remove('rotate')
                }
            }, 500)

        }

}

function fuckNo(){
    Tone.Transport.stop();
    hideStuff(true)

}

function addCss(){
    const css =
    `
    .play-note {
        outline: 10px black solid;
        transition: outline-width 0.1s ease-out;
        z-index: 1;
    }
    
    .idle-note {
        outline: 0px black solid;
        transition: outline-width 0.1s linear;
    }
    
    
    #dj-overlay {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: rgba(0,0,0,0.8);
        z-index: 9999999;
        cursor: pointer;
        pointer-events: none;
    
        /* animation: bouncey .2s infinite alternate; */
    }
    
    /* @keyframes bouncey {
        0% { right: -100px;}
        100%{ right: 0px;}
    } */
    
    #dj-club {
        z-index: 99999999;
        display: block;
        padding-right: 150px;
        padding-bottom: 10px;
        color: white;
        border-bottom: 12px solid white;
    
        font-size: 72pt;
        font-style: italic;
        font-family: Arial;
        font-weight: bold;
    }
    
    #dj-club-container {
        z-index: 99999999;
        position: fixed;
        bottom: 10px;
        right: 0;
        animation: bouncey .2s infinite alternate;
    }     
    
    @keyframes bouncey {
        0% { right: -100px;}
        100%{ right: 0px;}
    }
    
    
    .rotate {
        animation: rotation .7s infinite linear;
    }
    
    @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
    `;

    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerText = css;
    document.getElementsByTagName('head')[0].appendChild(style);
}

const script = document.createElement('script');
script.onload = function () {
    window.addEventListener('click', function(e) {
        if(Tone.Transport.state == 'started'){
            fuckNo();
        }
    });

    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 192) {
            if(Tone.Transport.state == 'started'){
                fuckNo();
            } else {
                Tone.Transport.cancel();
                fuckYeah();
            }
        }
    });
};
script.src = 'https://unpkg.com/tone@13.4.9/build/Tone.js';
document.head.appendChild(script);