async function getIP() {
    let response = await fetch("https://api.ipify.org?format=json");
    let res = await response.json();
    console.log(res);
    let ip = res.ip;
    return ip;
}

async function showIpAddress() {
    let ip = await getIP();
    console.log(ip);
    // document.getElementById("ip_span").innerHTML = ip;
    return ip;
}
showIpAddress();

async function renderPostalData({postal}){
    try{
        let response = await fetch(`https://api.postalpincode.in/pincode/${postal} `);
        let data = await response.json();
        console.log('data:', data);
        return data[0].PostOffice;
    }catch(error){
        console.log(error)
    }
}



async function latlong() {
    let ip = await showIpAddress(); 
    let res = await fetch(`https://ipapi.co/${ip}/json/`);
    let response = await res.json();
    console.log(response);
    renderInfoData(response)
    renderLocationOnMap(response);
    let arrayData=await renderPostalData(response);
    console.log(arrayData)
    let arrayD = [...arrayData]; 
    // return response;
    console.log(arrayD)
    showData(arrayD)
}

function showData(data){
    let pgd = document.getElementById("bucket");
    pgd.innerHTML = "";
    data.forEach((col)=>{
        
       let d = document.createElement("div");
       d.setAttribute("class","post_div")
       d.innerHTML = `
       <p>Name: <span>${col.Name}</span></p>
       <p>Branch Type: <span>${col.BranchType}</span></p>
       <p>Delivery Status: <span>${col.DeliveryStatus}</span></p>
       <p>District: <span>${col.District}</span></p>
       <p>Division: <span>${col.Division}</span></p>`
   
       pgd.appendChild(d);
    })   
    
  
}

function renderLocationOnMap({latitude,longitude}){
    let map = document.getElementById("map_frame");
    map.setAttribute("src", `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`)
    console.log({latitude,longitude});
}

function renderInfoData(locationDetails) {
    let ipSpan = document.getElementById("ip_span_1");
    ipSpan.innerHTML = locationDetails.ip;

    let latitudeSpan = document.getElementById("lat_span");
    latitudeSpan.innerHTML = locationDetails.latitude;

    let citySpan = document.getElementById("city_span");
    citySpan.innerHTML = locationDetails.city;

    let organizationSpan = document.getElementById("org_span");
    organizationSpan.innerHTML = locationDetails.org;

    let longitudeSpan = document.getElementById("long_span");
    longitudeSpan.innerHTML = locationDetails.longitude;

    let regionSpan = document.getElementById("reg_span");
    regionSpan.innerHTML = locationDetails.region;

    let hostSpan = document.getElementById("host_span");
    hostSpan.innerHTML = locationDetails.asn; 

    let tzone = document.getElementById("updated_tzone_span");
    tzone.innerHTML = locationDetails.timezone;
    
    const formattedDateTime = new Date().toLocaleString('en-US', {timeZone: locationDetails.timezone});
    let dt_span = document.getElementById("updated_dt_span");
    dt_span.innerHTML = formattedDateTime;

    let pin_span = document.getElementById("updated_pin_span");
    pin_span.innerHTML = locationDetails.postal;
}

latlong();
