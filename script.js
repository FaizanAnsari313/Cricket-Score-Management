let totalScore = 0;
let wickets = 0;
let over = 0;
let balls = 0; // balls in current over (0-5)
let ballNumber = 1;
let overCompletedTimeout;

function updateDisplay() {
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('wickets').textContent = wickets;
    document.getElementById('over').textContent = over;
    document.getElementById('balls').textContent = balls;
}
function showOverCompletedMsg() {
    const msgDiv = document.getElementById('overCompletedMsg');
    msgDiv.textContent = "Over Completed!";
    clearTimeout(overCompletedTimeout);
    overCompletedTimeout = setTimeout(() => msgDiv.textContent = "", 1400);
}

function addSheetEntry(run, extra, wicket, outOnThisBall=false) {
    const tbody = document.getElementById('sheetBody');
    let tr = document.createElement('tr');
    tr.className = outOnThisBall ? 'out-row' : '';
    tr.innerHTML = `
      <td>${ballNumber++}</td>
      <td>${run !== '' ? run : ''}</td>
      <td>${extra ? extra : ''}</td>
      <td>${wicket ? 'W' : ''}</td>
    `;
    tbody.appendChild(tr);
}
// --- Ball Types Logic ---
function addScore(run) {
    totalScore += run;
    balls++;
    addSheetEntry(run, '', '', false);
    checkOver();
    updateDisplay();
}

function dotBall() {
    balls++;
    addSheetEntry(0, '', '', false);
    checkOver();
    updateDisplay();
}

function wideBall() {
    totalScore += 1;
    addSheetEntry('', 'Wide', '', false); // ball is NOT counted
    updateDisplay();
}

function batsmanOut() {
    balls++;
    wickets++;
    addSheetEntry(0, '', true, true);
    checkOver();
    updateDisplay();
}

// --- Modal Logic for No Ball ---
let noBallRun = null;
function openNoBallModal() {
  document.getElementById('noBallModal').style.display = 'block';
  document.getElementById('noBallOut').style.display = 'none';
  noBallRun = null;
}
function closeNoBallModal() {
  document.getElementById('noBallModal').style.display = 'none';
  document.getElementById('noBallOut').style.display = 'none';
  noBallRun = null;
}

// From run buttons
function submitNoBall(runs) {
  noBallRun = runs;
  document.getElementById('noBallOut').style.display = 'block';
}

// From OUT button directly
function submitNoBallOutDirect() {
  totalScore += 1; // No ball only, no run by batsman
  showNoBallIndicator();
  addSheetEntry('0', 'No Ball', '', true);
  closeNoBallModal();
  updateDisplay();
}

// OUT/NOT OUT after run selection
function submitNoBallOut(isOut) {
  const runVal = parseInt(noBallRun);
  totalScore += 1 + runVal; // 1 for no ball, plus scored runs if any
  showNoBallIndicator();
  addSheetEntry(
    `${runVal}`,
    'No Ball',
    '',
    isOut
  );
  // Ball does not count, wicket does not increment
  closeNoBallModal();
  updateDisplay();
}

// ---- Modal Logic for Dead Ball ----
function openDeadBallModal() {
  document.getElementById('deadBallModal').style.display = 'block';
}
function closeDeadBallModal() {
  document.getElementById('deadBallModal').style.display = 'none';
}
function submitDeadBall(runs) {
  totalScore += parseInt(runs);
  addSheetEntry(
    runs, 'Dead Ball', '', false
  );
  closeDeadBallModal();
  updateDisplay();
  // On dead ball, run is added, but ball is NOT counted
}

// --- Indicator for No Ball ---
function showNoBallIndicator(){
    const indi = document.getElementById('noBallIndicator');
    indi.textContent = "No Ball!";
    indi.style.display = "inline-block";
    setTimeout(()=>{ indi.textContent = ""; }, 1500);
}

// --- Over Check ---
function checkOver() {
    if (balls >= 6) {
        over += 1;
        balls = 0;
        showOverCompletedMsg();
    }
}

// ---- Modal close on click outside ----
window.onclick = function(event) {
  const noBallModal = document.getElementById('noBallModal');
  const deadBallModal = document.getElementById('deadBallModal');
  if (event.target === noBallModal) {
    closeNoBallModal();
  }
  if (event.target === deadBallModal) {
    closeDeadBallModal();
  }
}

// For page refresh
window.onload = updateDisplay;
