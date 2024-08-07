document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#work-hours-table tbody");

    for (let i = 1; i <= 31; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="time" id="check-in-${i}" onchange="saveTableData()"></td>
            <td><input type="time" id="check-out-${i}" onchange="saveTableData()"></td>
            <td id="hours-${i}">0</td>
        `;
        tableBody.appendChild(row);
    }

    tableBody.addEventListener("input", () => {
        for (let i = 1; i <= 31; i++) {
            const checkIn = document.getElementById(`check-in-${i}`).value;
            const checkOut = document.getElementById(`check-out-${i}`).value;
            if (checkIn && checkOut) {
                const hours = calculateHours(checkIn, checkOut);
                document.getElementById(`hours-${i}`).innerText = hours;
            }
        }
    });

    // Load saved data from localStorage
    loadTableData();
});

function calculateHours(checkIn, checkOut) {
    const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
    const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

    let totalMinutes = (checkOutHours * 60 + checkOutMinutes) - (checkInHours * 60 + checkInMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} ساعة و ${minutes} دقيقة`;
}

function calculateTotalHours() {
    let totalMinutes = 0;
    for (let i = 1; i <= 31; i++) {
        const checkIn = document.getElementById(`check-in-${i}`).value;
        const checkOut = document.getElementById(`check-out-${i}`).value;
        if (checkIn && checkOut) {
            const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
            const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

            let minutes = (checkOutHours * 60 + checkOutMinutes) - (checkInHours * 60 + checkInMinutes);
            if (minutes < 0) minutes += 24 * 60; // Handle overnight shifts

            totalMinutes += minutes;
        }
    }
    
    const totalHours = Math.floor(totalMinutes / 60);
    const totalExtraMinutes = totalMinutes % 60;
    alert(`إجمالي الساعات: ${totalHours} ساعة و ${totalExtraMinutes} دقيقة`);
}

function resetTable() {
    for (let i = 1; i <= 31; i++) {
        document.getElementById(`check-in-${i}`).value = "";
        document.getElementById(`check-out-${i}`).value = "";
        document.getElementById(`hours-${i}`).innerText = "0";
    }

    // Clear data from localStorage
    localStorage.clear();
}

function loadTableData() {
    for (let i = 1; i <= 31; i++) {
        const checkIn = localStorage.getItem(`check-in-${i}`);
        const checkOut = localStorage.getItem(`check-out-${i}`);
        if (checkIn) document.getElementById(`check-in-${i}`).value = checkIn;
        if (checkOut) document.getElementById(`check-out-${i}`).value = checkOut;
        if (checkIn && checkOut) {
            const hours = calculateHours(checkIn, checkOut);
            document.getElementById(`hours-${i}`).innerText = hours;
        }
    }
}

function saveTableData() {
    for (let i = 1; i <= 31; i++) {
        const checkIn = document.getElementById(`check-in-${i}`).value;
        const checkOut = document.getElementById(`check-out-${i}`).value;
        if (checkIn) localStorage.setItem(`check-in-${i}`, checkIn);
        if (checkOut) localStorage.setItem(`check-out-${i}`, checkOut);
    }
}

// Save data to localStorage before the window is closed
window.addEventListener("beforeunload", saveTableData);
