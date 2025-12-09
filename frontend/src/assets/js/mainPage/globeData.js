
export async function getIpLocation(setData) {
    let data = {message: "error has happened in fetching location", latitude: 41, longitude: 41, country_name: "Nigeria"};
    try {
        // const response = await fetch(`https://ipapi.co/json/`);
        // data = await response.json();
        console.log(data);
    } catch (err) {
        console.error("API Error", err);
        setData(data);
    }
}