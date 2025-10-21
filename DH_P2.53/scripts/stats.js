// Scripts for the stats page
const PLAYER_STATS_SHEET_ID = '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
const API_BASE = 'https://api.sleeper.app/v1';

function showPage(pageId, clickedTab) {
    document.getElementById('page-1qb').style.display = 'none';
    document.getElementById('page-sflx').style.display = 'none';
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.getElementById(pageId).style.display = 'block';
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
}

async function fetchSheetData(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    const response = await fetch(url);
    const csvText = await response.text();
    return parseCsv(csvText);
}

function parseCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) {
        return [];
    }
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
        const rowData = {};
        headers.forEach((header, index) => {
            rowData[header] = values[index];
        });
        return rowData;
    });
    return rows;
}

async function loadStatsData() {
    const [data1QB, dataSFLX, sleeperPlayers] = await Promise.all([
        fetchSheetData('STAT_1QB'),
        fetchSheetData('STAT_SFLX'),
        fetchSleeperData()
    ]);

    const mergedData1QB = mergeData(data1QB, sleeperPlayers);
    const mergedDataSFLX = mergeData(dataSFLX, sleeperPlayers);

    window.data1QB = mergedData1QB;
    window.dataSFLX = mergedDataSFLX;
    renderTable(mergedData1QB, 'playerTableBody-1qb', 'ALL');
    renderTable(mergedDataSFLX, 'playerTableBody-sflx', 'ALL');

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    document.getElementById('searchInput-1qb').addEventListener('input', (e) => handleSearch(e, 'playerTableBody-1qb'));
    document.getElementById('searchInput-sflx').addEventListener('input', (e) => handleSearch(e, 'playerTableBody-sflx'));
}

function handleSearch(event, tableBodyId) {
    const searchTerm = event.target.value.toLowerCase();
    const tableBody = document.getElementById(tableBodyId);
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const playerName = row.cells[1].textContent.toLowerCase();
        if (playerName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function handleFilterClick(event) {
    const view = event.target.dataset.position;
    document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    renderTable(window.data1QB, 'playerTableBody-1qb', view);
    renderTable(window.dataSFLX, 'playerTableBody-sflx', view);
}

function renderTable(data, tableBodyId, view = 'ALL') {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';
    const headers = {
        'ALL': ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'YDS(t)', 'YPG(t)', 'OPP', 'IMP', 'IMP/OPP'],
        'QB': ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'paRTG', 'paYDS', 'paTD', 'paATT', 'CMP', 'YDS(t)', 'paYPG', 'ruYDS', 'ruTD', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE'],
        'RB': ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'CAR', 'ruYDS', 'YPC', 'ruTD', 'REC', 'recYDS', 'TGT', 'YDS(t)', 'ruYPG', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD', 'rec1D', 'YAC', 'IMP/G', 'FUM', 'FPOE'],
        'WR': ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM'],
        'TE': ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM'],
    };
    const currentHeaders = headers[view];

    const thead = tableBody.parentElement.querySelector('thead');
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    currentHeaders.forEach((headerText, index) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        if (index < 3) {
            th.classList.add('sticky-col');
            th.style.left = `${index * 100}px`;
        }
        if (['paRTG', 'paYDS', 'paTD', 'paATT', 'CMP', 'paYPG', 'pa1D', 'pIMP', 'pIMP/A', 'TTT', 'PRS%', 'SAC', 'INT'].includes(headerText)) {
            th.classList.add('stats-table-header-passing');
        } else if (['CAR', 'ruYDS', 'YPC', 'ruTD', 'ruYPG', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D'].includes(headerText)) {
            th.classList.add('stats-table-header-rushing');
        } else if (['TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'RR'].includes(headerText)) {
            th.classList.add('stats-table-header-receiving');
        } else {
            th.classList.add('stats-table-header-all');
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach(player => {
        const row = document.createElement('tr');
        currentHeaders.forEach((header, index) => {
            const cell = document.createElement('td');
            if (index < 3) {
                cell.classList.add('sticky-col');
                cell.style.left = `${index * 100}px`;
            }
            const value = player[header] || '';

            if (header === 'PLAYER') {
                const playerNameButton = document.createElement('button');
                playerNameButton.textContent = value;
                playerNameButton.onclick = () => {
                    const playerData = {
                        id: player.SLPR_ID,
                        name: player.PLAYER,
                        pos: player.POS,
                        team: player.TM,
                        ktc: player.VALUE,
                    };
                    handlePlayerNameClick(playerData);
                };
                cell.appendChild(playerNameButton);
            } else {
                cell.textContent = value;
            }

            if (header === 'RK') {
                cell.style.color = getRankColor(value);
            }
            if (header === 'VALUE') {
                cell.style.color = getValueColor(value);
            }
            if (header === 'AGE') {
                cell.style.color = getAgeColor(player.POS, value);
            }
            if (header === 'FPTS') {
                cell.style.color = getFptsColor(value);
            }
            if (header === 'PPG') {
                cell.style.color = getPpgColor(value);
            }
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

function getRankColor(rank) {
    if (rank <= 10) return '#ff0000';
    if (rank <= 25) return '#ff4500';
    if (rank <= 50) return '#ff8c00';
    return '#ffffff';
}

function getValueColor(value) {
    if (value >= 9000) return '#00ff00';
    if (value >= 8000) return '#32cd32';
    if (value >= 7000) return '#7cfc00';
    return '#ffffff';
}

function getAgeColor(pos, age) {
    const ageNum = parseFloat(age);
    if (isNaN(ageNum)) return '#ffffff';

    const ageScales = {
        wrTe: [{ value: 22.5, color: '#00ffc4' }, { value: 25, color: '#85fff3' }, { value: 26, color: '#56dfe8' }, { value: 27, color: '#7dd1ff' }, { value: 29, color: '#89a3ff' }, { value: 30, color: '#957cff' }, { value: 31, color: '#a642ff' }, { value: 32, color: '#cf60ff' }, { value: 33, color: '#ff6fe1' }],
        rb: [{ value: 22.5, color: '#00ffc4' }, { value: 24, color: '#85fff3' }, { value: 25, color: '#56dfe8' }, { value: 26, color: '#7dd1ff' }, { value: 27, color: '#89a3ff' }, { value: 28, color: '#957cff' }, { value: 29, color: '#a642ff' }, { value: 30, color: '#cf60ff' }, { value: 31, color: '#ff6fe1' }],
        qb: [{ value: 25.5, color: '#00ffc4' }, { value: 28, color: '#85fff3' }, { value: 29, color: '#7dd1ff' }, { value: 31, color: '#48a6ff' }, { value: 33, color: '#957cff' }, { value: 36, color: '#a642ff' }, { value: 40, color: '#cf60ff' }, { value: 44, color: '#ff6fe1' }]
    };

    let scale;
    if (pos === 'WR' || pos === 'TE') {
        scale = ageScales.wrTe;
    } else if (pos === 'RB') {
        scale = ageScales.rb;
    } else if (pos === 'QB') {
        scale = ageScales.qb;
    } else {
        return '#ffffff';
    }

    for (const tier of scale) {
        if (ageNum <= tier.value) {
            return tier.color;
        }
    }
    return scale[scale.length - 1].color;
}

function getFptsColor(fpts) {
    const fptsNum = parseFloat(fpts);
    if (isNaN(fptsNum)) return '#ffffff';
    if (fptsNum >= 300) return '#00ff00';
    if (fptsNum >= 250) return '#32cd32';
    if (fptsNum >= 200) return '#7cfc00';
    return '#ffffff';
}

function getPpgColor(ppg) {
    const ppgNum = parseFloat(ppg);
    if (isNaN(ppgNum)) return '#ffffff';
    if (ppgNum >= 20) return '#00ff00';
    if (ppgNum >= 15) return '#32cd32';
    if (ppgNum >= 10) return '#7cfc00';
    return '#ffffff';
}

async function fetchSleeperData() {
    const response = await fetch(`${API_BASE}/players/nfl`);
    const sleeperPlayers = await response.json();
    return sleeperPlayers;
}

function mergeData(sheetData, sleeperPlayers) {
    return sheetData.map(row => {
        const sleeperId = row.SLPR_ID;
        const playerData = sleeperPlayers[sleeperId];
        if (playerData) {
            row.FPTS = playerData.fantasy_points?.ppr || 0;
            row.PPG = playerData.fantasy_points?.ppr / playerData.games_played || 0;
        }
        return row;
    });
}

document.addEventListener('DOMContentLoaded', loadStatsData);
