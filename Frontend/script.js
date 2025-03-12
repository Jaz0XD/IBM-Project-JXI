const API_URL = 'http://localhost:5000';


async function addStation(event) {
    event.preventDefault();

    const stationName = document.getElementById('stationName').value;
    const location = document.getElementById('location').value;
    const capacity = document.getElementById('capacity').value;
    const status = document.getElementById('stationStatus').value;

    try {
        const response = await fetch(`${API_URL}/add-station`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stationName,
                location,
                capacity,
                status
            })
        });

        const data = await response.json();
        alert(data.message);
        fetchStations(); 
    } catch (error) {
        console.error('Error adding station:', error);
    }
}


async function fetchStations() {
    try {
        const response = await fetch(`${API_URL}/stations`);
        const stations = await response.json();

        const stationList = document.getElementById('stationList');
        stationList.innerHTML = '';

        stations.forEach(station => {
            const row = `<tr>
                <td>${station[0]}</td>
                <td>${station[1]}</td>
                <td>${station[2]}</td>
                <td>${station[3]}</td>
                <td>${station[4]}</td>
                <td>
                    <button class="btn btn-warning" onclick="editStation(${station[0]}, '${station[1]}', '${station[2]}', ${station[3]}, '${station[4]}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStation(${station[0]})">Delete</button>
                </td>
            </tr>`;
            stationList.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching stations:', error);
    }
}


async function editStation(id, name, location, capacity, status) {
    document.getElementById('stationId').value = id;
    document.getElementById('stationName').value = name;
    document.getElementById('location').value = location;
    document.getElementById('capacity').value = capacity;
    document.getElementById('stationStatus').value = status;

    document.getElementById('submitButton').innerText = 'Update Station';

    document.getElementById('submitButton').onclick = async (e) => {
        e.preventDefault();

        const updatedName = document.getElementById('stationName').value;
        const updatedLocation = document.getElementById('location').value;
        const updatedCapacity = document.getElementById('capacity').value;
        const updatedStatus = document.getElementById('stationStatus').value;

        try {
            const response = await fetch(`${API_URL}/update-station/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stationName: updatedName,
                    location: updatedLocation,
                    capacity: updatedCapacity,
                    status: updatedStatus
                })
            });

            const data = await response.json();
            alert(data.message);
            fetchStations(); 
            resetForm();
        } catch (error) {
            console.error('Error updating station:', error);
        }
    };
}


async function deleteStation(id) {
    if (confirm('Are you sure you want to delete this station?')) {
        try {
            const response = await fetch(`${API_URL}/delete-station/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            alert(data.message);
            fetchStations(); 
        } catch (error) {
            console.error('Error deleting station:', error);
        }
    }
}


function resetForm() {
    document.getElementById('stationId').value = '';
    document.getElementById('stationName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('capacity').value = '';
    document.getElementById('stationStatus').value = '';
    document.getElementById('submitButton').innerText = 'Submit';

    document.getElementById('submitButton').onclick = addStation;
}


document.getElementById('submitButton').addEventListener('click', addStation);


document.addEventListener('DOMContentLoaded', fetchStations);
