
const API_BASE_URL = 'https://web-production-53d09.up.railway.app';
const responseArea = document.getElementById('response-area');

function clearResponse() {
    responseArea.innerHTML = '';
}

function showLoading() {
    responseArea.innerHTML = '<div class="loading">⏳ Loading...</div>';
}

function showError(message) {
    responseArea.innerHTML = `<div class="error-message">❌ Error: ${message}</div>`;
}

function showSuccess(message) {
    responseArea.innerHTML = `<div class="success-message">✅ ${message}</div>`;
}

async function viewAllPatients() {
    clearResponse();
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/view`);
        const data = await response.json();
        
        if (Object.keys(data).length === 0) {
            responseArea.innerHTML = '<div class="welcome-message"><h2>No patients found</h2><p>Create a new patient to get started</p></div>';
            return;
        }
        
        let html = '<h2 style="color: #00d4ff; margin-bottom: 1.5rem;">All Patients</h2>';
        
        for (const [id, patient] of Object.entries(data)) {
            const verdictClass = `bmi-${patient.verdict.toLowerCase()}`;
            html += `
                <div class="patient-card">
                    <h3>${patient.name} (${id})</h3>
                    <div class="patient-info">
                        <div class="info-item"><strong>Age:</strong> ${patient.age} years</div>
                        <div class="info-item"><strong>Gender:</strong> ${patient.gender}</div>
                        <div class="info-item"><strong>City:</strong> ${patient.city}</div>
                        <div class="info-item"><strong>Height:</strong> ${patient.height} m</div>
                        <div class="info-item"><strong>Weight:</strong> ${patient.weight} kg</div>
                        <div class="info-item"><strong>BMI:</strong> ${patient.bmi}</div>
                    </div>
                    <span class="bmi-badge ${verdictClass}">${patient.verdict}</span>
                </div>
            `;
        }
        
        responseArea.innerHTML = html;
    } catch (error) {
        showError('Failed to fetch patients: ' + error.message);
    }
}

function showViewPatientForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>View Single Patient</h2>
            <div class="form-group">
                <label>Patient ID</label>
                <input type="text" id="view-patient-id" placeholder="e.g., P001">
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="viewSinglePatient()">View Patient</button>
            </div>
        </div>
    `;
}

async function viewSinglePatient() {
    const patientId = document.getElementById('view-patient-id').value;
    
    if (!patientId) {
        showError('Please enter a patient ID');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/patient/${patientId}`);
        
        if (!response.ok) {
            throw new Error('Patient not found');
        }
        
        const patient = await response.json();
        const verdictClass = `bmi-${patient.verdict.toLowerCase()}`;
        
        responseArea.innerHTML = `
            <h2 style="color: #00d4ff; margin-bottom: 1.5rem;">Patient Details</h2>
            <div class="patient-card">
                <h3>${patient.name} (${patientId})</h3>
                <div class="patient-info">
                    <div class="info-item"><strong>Age:</strong> ${patient.age} years</div>
                    <div class="info-item"><strong>Gender:</strong> ${patient.gender}</div>
                    <div class="info-item"><strong>City:</strong> ${patient.city}</div>
                    <div class="info-item"><strong>Height:</strong> ${patient.height} m</div>
                    <div class="info-item"><strong>Weight:</strong> ${patient.weight} kg</div>
                    <div class="info-item"><strong>BMI:</strong> ${patient.bmi}</div>
                </div>
                <span class="bmi-badge ${verdictClass}">${patient.verdict}</span>
            </div>
        `;
    } catch (error) {
        showError(error.message);
    }
}

function showSortForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>Sort Patients</h2>
            <div class="form-group">
                <label>Sort By</label>
                <select id="sort-by">
                    <option value="height">Height</option>
                    <option value="weight">Weight</option>
                    <option value="bmi">BMI</option>
                </select>
            </div>
            <div class="form-group">
                <label>Order</label>
                <select id="sort-order">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="sortPatients()">Sort</button>
            </div>
        </div>
    `;
}

async function sortPatients() {
    const sortBy = document.getElementById('sort-by').value;
    const order = document.getElementById('sort-order').value;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/sort?sort_by=${sortBy}&order=${order}`);
        console.log(response)
        const data = await response.json();
        
        let html = `<h2 style="color: #00d4ff; margin-bottom: 1.5rem;">Sorted by ${sortBy} (${order})</h2>`;
        
        data.forEach(patient => {
            const verdictClass = `bmi-${patient.verdict.toLowerCase()}`;
            html += `
                <div class="patient-card">
                    <h3>${patient.name}</h3>
                    <div class="patient-info">
                        <div class="info-item"><strong>Age:</strong> ${patient.age} years</div>
                        <div class="info-item"><strong>Gender:</strong> ${patient.gender}</div>
                        <div class="info-item"><strong>City:</strong> ${patient.city}</div>
                        <div class="info-item"><strong>Height:</strong> ${patient.height} m</div>
                        <div class="info-item"><strong>Weight:</strong> ${patient.weight} kg</div>
                        <div class="info-item"><strong>BMI:</strong> ${patient.bmi}</div>
                    </div>
                    <span class="bmi-badge ${verdictClass}">${patient.verdict}</span>
                </div>
            `;
        });
        
        responseArea.innerHTML = html;
    } catch (error) {
        showError('Failed to sort patients: ' + error.message);
    }
}

function showCreateForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>Create New Patient</h2>
            <div class="form-group">
                <label>Patient ID *</label>
                <input type="text" id="create-id" placeholder="e.g., P001">
            </div>
            <div class="form-group">
                <label>Name *</label>
                <input type="text" id="create-name" placeholder="Enter name">
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="create-city" placeholder="Enter city">
            </div>
            <div class="form-group">
                <label>Age *</label>
                <input type="number" id="create-age" placeholder="Enter age" min="1" max="120">
            </div>
            <div class="form-group">
                <label>Gender *</label>
                <select id="create-gender">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div class="form-group">
                <label>Height (meters) *</label>
                <input type="number" id="create-height" placeholder="e.g., 1.75" step="0.01">
            </div>
            <div class="form-group">
                <label>Weight (kg) *</label>
                <input type="number" id="create-weight" placeholder="e.g., 70" step="0.1">
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="createPatient()">Create Patient</button>
                <button class="btn btn-secondary" onclick="showCreateForm()">Reset</button>
            </div>
        </div>
    `;
}

async function createPatient() {
    const patient = {
        id: document.getElementById('create-id').value,
        name: document.getElementById('create-name').value,
        city: document.getElementById('create-city').value,
        age: parseInt(document.getElementById('create-age').value),
        gender: document.getElementById('create-gender').value,
        height: parseFloat(document.getElementById('create-height').value),
        weight: parseFloat(document.getElementById('create-weight').value)
    };
    
    if (!patient.id || !patient.name || !patient.city || !patient.age || !patient.gender || !patient.height || !patient.weight) {
        showError('Please fill all required fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
        
        showSuccess('Patient created successfully!');
        setTimeout(() => viewAllPatients(), 5000);
    } catch (error) {
        showError(error.message);
    }
}

function showUpdateForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>Update Patient</h2>
            <div class="form-group">
                <label>Patient ID *</label>
                <input type="text" id="update-id" placeholder="e.g., P001">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="update-name" placeholder="Leave empty to keep current">
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" id="update-city" placeholder="Leave empty to keep current">
            </div>
            <div class="form-group">
                <label>Age</label>
                <input type="number" id="update-age" placeholder="Leave empty to keep current">
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select id="update-gender">
                    <option value="">Keep current</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div class="form-group">
                <label>Height (meters)</label>
                <input type="number" id="update-height" placeholder="Leave empty to keep current" step="0.01">
            </div>
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" id="update-weight" placeholder="Leave empty to keep current" step="0.1">
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="updatePatient()">Update Patient</button>
                <button class="btn btn-secondary" onclick="showUpdateForm()">Reset</button>
            </div>
        </div>
    `;
}

async function updatePatient() {
    const patientId = document.getElementById('update-id').value;
    
    if (!patientId) {
        showError('Please enter a patient ID');
        return;
    }
    
    const updates = {};
    
    const name = document.getElementById('update-name').value;
    if (name) updates.name = name;
    
    const city = document.getElementById('update-city').value;
    if (city) updates.city = city;
    
    const age = document.getElementById('update-age').value;
    if (age) updates.age = parseInt(age);
    
    const gender = document.getElementById('update-gender').value;
    if (gender) updates.gender = gender;
    
    const height = document.getElementById('update-height').value;
    if (height) updates.height = parseFloat(height);
    
    const weight = document.getElementById('update-weight').value;
    if (weight) updates.weight = parseFloat(weight);
    
    if (Object.keys(updates).length === 0) {
        showError('Please provide at least one field to update');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/edit/${patientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
        
        showSuccess('Patient updated successfully!');
        setTimeout(() => viewAllPatients(), 1500);
    } catch (error) {
        showError(error.message);
    }
}

function showDeleteForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>Delete Patient</h2>
            <div class="form-group">
                <label>Patient ID</label>
                <input type="text" id="delete-id" placeholder="e.g., P001">
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="deletePatient()" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">Delete Patient</button>
            </div>
            <p style="color: #e74c3c; margin-top: 1rem;">⚠️ Warning: This action cannot be undone!</p>
        </div>
    `;
}

async function deletePatient() {
    const patientId = document.getElementById('delete-id').value;
    
    if (!patientId) {
        showError('Please enter a patient ID');
        return;
    }
      
    if (!confirm(`Are you sure you want to delete patient ${patientId}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${patientId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
        
        showSuccess('Patient deleted successfully!');
        setTimeout(() => viewAllPatients(), 1500);
    } catch (error) {
        showError(error.message);
    }
}

function showAgentForm() {
    clearResponse();
    responseArea.innerHTML = `
        <div class="form-container">
            <h2>AI Agent Assistant</h2>
            <div class="form-group">
                <label>Your Input</label>
                <input type="text" id="agent-input" placeholder="Ask the AI agent...">
            </div>
            <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="agent-name" placeholder="Enter your name">
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="callAgent()">Ask Agent</button>
            </div>
        </div>
    `;
}

async function callAgent() {
    const userInput = document.getElementById('agent-input').value;
    const name = document.getElementById('agent-name').value;
    
    if (!userInput || !name) {
        showError('Please fill both fields');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/use_agent?user_input=${userInput}&name=${name}`);
        const data = await response.text();
        
        responseArea.innerHTML = `
            <h2 style="color: #00d4ff; margin-bottom: 1.5rem;">Agent Response</h2>
            <div class="patient-card">
                <p style="font-size: 1.1rem; line-height: 1.6;">${data}</p>
            </div>
        `;
    } catch (error) {
        showError('Failed to get agent response: ' + error.message);
    }
}