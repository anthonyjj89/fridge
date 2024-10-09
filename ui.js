// UI-related functions

function initializeUI() {
    addScrollFunctionality();
    createResetButton();
    createExportButton();
}

function addScrollFunctionality() {
    document.getElementById('scroll-left').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: -100, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: 100, behavior: 'smooth' });
    });
}

function createResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset All Chores';
    resetButton.addEventListener('click', window.resetAllChores);
    document.body.appendChild(resetButton);
}

function createExportButton() {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Chore Data';
    exportButton.addEventListener('click', () => {
        const data = window.exportChoreData();
        console.log('Exported chore data:', data);
        // You could add code here to save the data to a file or send it to a server
    });
    document.body.appendChild(exportButton);
}
