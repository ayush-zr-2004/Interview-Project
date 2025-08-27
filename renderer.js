const { ipcRenderer } = require('electron');

document.getElementById('checkBtn').onclick = async () => {
  const infoDiv = document.getElementById('info');
  infoDiv.innerHTML = "<em>Loading...</em>";
  try {
    // Invoke the main process to get the system info
    const data = await ipcRenderer.invoke('get-system-info');

    // Display the system info in the infoDiv
    infoDiv.innerHTML = `
      <h2>System Info</h2>
      <p><strong>OS Name:</strong> ${data.osName}</p>
      <p><strong>CPU:</strong> ${data.cpuInfo}</p>
      <p><strong>RAM:</strong> ${data.ramSize}</p>
      <h3>Running Processes:</h3>
      <div class="processes">
        <ul>${data.processes.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `;
  } catch (err) {
    // Show error message on failure
    infoDiv.innerHTML = `<span style="color: red;">Error: ${err.message}</span>`;
  }
};
