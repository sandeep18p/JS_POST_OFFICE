async function getIP() {
    let response = await fetch("https://api.ipify.org?format=json");
    let res = await response.json();
    let ip = res.ip;
    return ip;
}

async function showIpAddress() {
    let ip = await getIP();
    return ip;
}

async function renderPostalData({postal}){
    try {
        let response = await fetch(`https://api.postalpincode.in/pincode/${postal}`);
        let data = await response.json();
        return data[0].PostOffice;
    } catch(error) {
        console.log(error);
    }
}

let arrayD;

async function latlong() {
    let ip = await showIpAddress();
    let res = await fetch(`https://ipapi.co/${ip}/json/`);
    let response = await res.json();
    
    renderInfoData(response);
    renderLocationOnMap(response);
    
    let arrayData = await renderPostalData(response);
    arrayD = [...arrayData]; 
    showData(arrayD);
}

function showData(data){
    let pgd = document.getElementById("bucket");
    pgd.innerHTML = "";
    data.forEach((col) => {
        let d = document.createElement("div");
        d.setAttribute("class", "post_div");
        d.innerHTML = `
            <p>Name: <span>${col.Name}</span></p>
            <p>Branch Type: <span>${col.BranchType}</span></p>
            <p>Delivery Status: <span>${col.DeliveryStatus}</span></p>
            <p>District: <span>${col.District}</span></p>
            <p>Division: <span>${col.Division}</span></p>
        `;
        pgd.appendChild(d);
    });
}

function renderLocationOnMap({latitude, longitude}) {
    let map = document.getElementById("map_frame");
    map.setAttribute("src", `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`);
}

function renderInfoData(locationDetails) {
    document.getElementById("ip_span_1").innerHTML = locationDetails.ip;
    document.getElementById("lat_span").innerHTML = locationDetails.latitude;
    document.getElementById("city_span").innerHTML = locationDetails.city;
    document.getElementById("org_span").innerHTML = locationDetails.org;
    document.getElementById("long_span").innerHTML = locationDetails.longitude;
    document.getElementById("reg_span").innerHTML = locationDetails.region;
    document.getElementById("host_span").innerHTML = locationDetails.asn; 
    document.getElementById("updated_tzone_span").innerHTML = locationDetails.timezone;
    
    const formattedDateTime = new Date().toLocaleString('en-US', {timeZone: locationDetails.timezone});
    document.getElementById("updated_dt_span").innerHTML = formattedDateTime;
    document.getElementById("updated_pin_span").innerHTML = locationDetails.postal;
}

latlong();

function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function op() {
    let searchTerm = document.getElementById('hop').value.trim().toLowerCase();
    let filteredData = arrayD.filter(postOffice => postOffice.Name.toLowerCase().includes(searchTerm));
    showData(filteredData);
}

document.getElementById('hop').addEventListener('input', debounce(op, 300));
