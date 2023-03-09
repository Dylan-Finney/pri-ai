export function timeToString(timestamp){
    var now = new Date(timestamp)
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var postfix = ""
    var hour = 0
    var minutes = ""
    switch(now.getHours()){
      case 23:
      case 22:
      case 21:
      case 20:
      case 19:
      case 18:
      case 17:
      case 16:
      case 15:
      case 14:
      case 13:
        postfix = "pm"
        hour =  now.getHours()-12
        break
      case 12:
        postfix = "pm"
        hour =  now.getHours()
        break
      case 11:
      case 10:
      case 9:
      case 8:
      case 7:
      case 6:
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
        postfix = "am"
        hour =  now.getHours()
        break
      case 0:
        postfix = "am"
        hour =  12
        break
      default:
        hour = 0
        postfix = "am"
    }
    switch(now.getMinutes()){
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        minutes = `0${now.getMinutes()}`
        break
      default:
        minutes = now.getMinutes()
        break
    }
    return `${weekday[now.getDay()]} ${hour}:${minutes}${postfix}`
}

export function getAppLogo (app) {
    switch(app){
      case "23andMe":
        return "23andme.svg"
      case "Airbnb":
        return "airbnb.svg"
      case "Amazon":
        return "amazon.svg"
      case "Ancestry":
        return "ancestry.svg"
      case "Apple Health":
        return "apple-health.svg"
      case "Bosch":
        return "bosch.svg"
      case "Doordash":
        return "doordash.svg"
      case "Evernote":
        return "evernote.svg"
      case "Facebook":
        return "facebook.svg"
      case "Fitbit":
        return "fitbit.svg"
      case "Google Calendar":
        return "google-cal.svg"
      case "Google Maps":
        return "google-maps.svg"
      case "Google":
        return "google.svg"
      case "Instacart":
        return "instacart.svg"
      case "Instagram":
        return "instagram.svg"
      case "iTunes":
        return "itunes.svg"
      case "Linkedin":
        return "linkedin.svg"
      case "Lyft":
        return "lyft.svg"
      case "Maps":
        return "maps.svg"
      case "Medium":
        return "medium.svg"
      case "Movesense":
        return "movesense.svg"
      case "Netflix":
        return "netflix.svg"
      case "Notion":
        return "notion.svg"
      case "Oura":
        return "oura.svg"
      case "Peloton":
        return "peloton.svg"
      case "Polar":
        return "polar.svg"
      case "Prime Video":
        return "prime-video.svg"
      case "Reddit":
        return "reddit.svg"
      case "Runkeeper":
        return "runkeeper.svg"
      case "Snapchat":
        return "snapchat.svg"
      case "Spotify":
        return "spotify.svg"
      case "Strava":
        return "strava.svg"
      case "Suunto":
        return "suunto.svg"
      case "Tiktok":
        return "tiktok.svg"
      case "Tripadvisor":
        return "tripadvisor.svg"
      case "Twitch":
        return "twitch.svg"
      case "Twitter":
        return "twitter.svg"
      case "Uber Eats":
        return "uber-eats.svg"
      case "Uber":
        return "uber.svg"
      case "Waze":
        return "waze.svg"
      case "Withings":
        return "withings.svg"
      case "Youtube":
        return "youtube.svg"
      default:
        return ""
    }
  }

export function getCountryLogo (country) {
    switch(country){
      case "United States":
        return "US.svg"
      default:
        return ""
    }
  }