(function () {
  const scoreBody = document.getElementById('scoreBody');
  const summary = document.getElementById('summary');
  const overIndicator = document.getElementById('overIndicator');
  const buttons = document.querySelectorAll('.keypad button');

  let events = [];
  let totalRuns = 0;
  let legalBallCount = 0; // counts only legal balls
  let extrasInCurrentOver = 0;
  let lastOverAnnounced = 0;

  function addEvent({ runs, extra = null }) {
    if (extra === 'wide' || extra === 'no-ball') {
      totalRuns += 1 + runs;
      extrasInCurrentOver++;
      // legal balls not increased for extras
    } else {
      totalRuns += runs;
      legalBallCount++;
      if (legalBallCount % 6 === 1) {
        // New over started, reset extras count
        extrasInCurrentOver = 0;
      }
    }

    events.push({
      ball: events.length + 1,
      runs,
      extra,
      totalScore: totalRuns,
    });

    renderScoreSheet();
    checkOverCompletion();
  }

  function renderScoreSheet() {
    scoreBody.innerHTML = '';

    events.forEach((e) => {
      const tr = document.createElement('tr');

      const ballTd = document.createElement('td');
      ballTd.textContent = e.ball;
      tr.appendChild(ballTd);

      const runsTd = document.createElement('td');
      runsTd.textContent = e.runs;
      tr.appendChild(runsTd);

      const extraTd = document.createElement('td');
      extraTd.textContent = e.extra
        ? e.extra.charAt(0).toUpperCase() + e.extra.slice(1).replace('-', ' ')
        : '';
      tr.appendChild(extraTd);

      const totalTd = document.createElement('td');
      totalTd.textContent = e.totalScore;
      tr.appendChild(totalTd);

      scoreBody.appendChild(tr);
    });

    const completedOvers = Math.floor(legalBallCount / 6);
    const ballsThisOver =
      legalBallCount % 6 === 0 && legalBallCount > 0
        ? 6
        : legalBallCount % 6;
    summary.textContent = `Total Runs: ${totalRuns} | Overs: ${completedOvers}.${
      ballsThisOver === 0 && legalBallCount > 0 ? 6 : ballsThisOver
    }`;
  }

  function checkOverCompletion() {
    let completedOvers = Math.floor(legalBallCount / 6);
    if (completedOvers > 0 && completedOvers > lastOverAnnounced) {
      lastOverAnnounced = completedOvers;
      showOverCompleteMessage(completedOvers);
    }
  }

  function showOverCompleteMessage(overNumber) {
    overIndicator.textContent = `🏏 Over Complete! (Over ${overNumber} finished)`;
    overIndicator.style.display = 'flex';

    setTimeout(() => {
      overIndicator.style.display = 'none';
      overIndicator.textContent = '';
    }, 3000);
  }

  function resetAll() {
    events = [];
    totalRuns = 0;
    legalBallCount = 0;
    extrasInCurrentOver = 0;
    lastOverAnnounced = 0;
    scoreBody.innerHTML = '';
    summary.textContent = `Total Runs: 0 | Overs: 0.0`;
    overIndicator.style.display = 'none';
    overIndicator.textContent = '';
  }

  resetAll();

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('clear')) {
        resetAll();
        return;
      }

      if (button.hasAttribute('data-run')) {
        const runValue = parseInt(button.getAttribute('data-run'), 10);
        addEvent({ runs: runValue, extra: null });
      } else if (button.hasAttribute('data-extra')) {
        const extraType = button.getAttribute('data-extra');
        addEvent({ runs: 0, extra: extraType });
      }
    });
  });
})();
