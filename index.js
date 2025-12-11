const list = document.getElementById('list');
const countSpan = document.getElementById('count');
const totalSpan = document.getElementById('total');
const search = document.getElementById('search');
const download = document.getElementById("download-csv");
// search.setAttribute("class" , "search-container")
const guests = [
    "زری کرمی", "متقی", "جابر کوچکی ", "ینبتسینبتیبت"
];

totalSpan.textContent = guests.length;

function save() {
    localStorage.setItem('checkedGuests', JSON.stringify(
        guests.map((g, i) => document.getElementById('c' + i).checked)
    ));
}

function load() {
    const saved = localStorage.getItem('checkedGuests');
    return saved ? JSON.parse(saved) : [];
}

function updateCount() {
    const checked = guests.filter((_, i) => document.getElementById('c' + i).checked).length;
    countSpan.textContent = checked;
}

// Build the list
guests.forEach((guest, i) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.setAttribute("class", "checkbox")
    checkbox.type = 'checkbox';
    checkbox.id = 'c' + i;

    const label = document.createElement('label');
    label.setAttribute("class", "input_label")
    label.htmlFor = 'c' + i;
    label.textContent = guest;

    checkbox.addEventListener('change', () => {
        li.classList.toggle('checked', checkbox.checked);
        updateCount();
        save();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
});

// Load previous checks
const saved = load();
saved.forEach((checked, i) => {
    if (checked && document.getElementById('c' + i)) {
        const cb = document.getElementById('c' + i);
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
    }
});
updateCount();

// Live search
search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('li').forEach(li => {
        const name = li.querySelector('label').textContent.toLowerCase();
        li.style.display = name.includes(term) ? 'flex' : 'none';
    });
});


// download file csv or exel 
download.addEventListener("click", () => {
    const checkedGuests = guests.filter((_, i) =>
        document.getElementById('c' + i).checked
    );

    if (checkedGuests.length === 0) {
        alert("No guests have arrived yet!")
    }

    let csv = 'Name , Status\n';
    checkedGuests.forEach(name => {
        csv += `"${name}","Arrived"\n`;
    });

    // Download it
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'list-arrived-guests.csv';
    a.click();
    URL.revokeObjectURL(url);
})




