
//database local se lekr aye hain songs ko 

let currentsong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}
//saare songs playlist main add kiye hain
async function main() {



    //all songs 
    let songs = await getsongs()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
                            <li class="flex playlists"><img src="music.jpg">
                                <ul>
                                    <li>${song.replaceAll("%20", " ")}</li>
                                    <li class="b1-minitext">Tesher, Jason Derulo</li>
                                </ul>
                            </li> 
        </li>`;
    }

    const playMusic = (track)=>{
        // let audio = new Audio(`/songs/` + track); 
        // audio.play();
        currentsong.src = `/songs/` + track
        currentsong.play();
        play.src = "pause.svg"
        document.querySelector(".songinfo").innerHTML = 
        `<div class="dashboard flex">
                <img src="music.jpg" height="60px">
                <ul class="dashboardul">
                    <li>${track}</li>
                    <li class="b1-minitext">Adam Levine</li>
                </ul>
                <img src="tick.svg" height="20px">
            </div>`

        document.querySelector(".songtime").innerHTML = "00:00/00:00"
    }

    //attached an event listiner each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        let songnameelement = e.querySelector(".playlists ul li");
        let raww;
        if (songnameelement) {
                raww = e.querySelector(".playlists ul li").innerHTML
            }

        e.addEventListener("click", element => {
            console.log(raww)
            playMusic(raww)
        })
    })

    //attached an event listiner to play pause next and previous
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "pause.svg"
        }
        else{
            currentsong.pause();   //remember that pause() is right not paused()
            play.src = "play.svg"
        }
    })

    //listien for timeupdate event 
    currentsong.addEventListener("timeupdate", ()=>{
        console.log (currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML = 
        `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })
    

    //add and event listiner to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentsong.currentTime = ( currentsong.duration * percent)/100
    })
}


main()



