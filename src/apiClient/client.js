import axios from "axios"

const playlistBackward = function(selectedPlayer, promiseSuccessCallback, promiseFailCallback) {
    axios.post('http://172.17.0.20:3000/api/playlistmedia/'+selectedPlayer+'/backward',null, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then(
                promiseSuccessCallback()).catch(promiseFailCallback())
}

const playlistPause = function(selectedPlayer, promiseSuccessCallback, promiseFailCallback) {
    axios.post('http://172.17.0.20:3000/api/playlistmedia/'+selectedPlayer+'/pause',null, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then(
                promiseSuccessCallback()).catch(promiseFailCallback())
}

const playlistForward = function(selectedPlayer, promiseSuccessCallback, promiseFailCallback) {
    axios.post('http://172.17.0.20:3000/api/playlistmedia/'+selectedPlayer+'/forward',null, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then(
                promiseSuccessCallback()).catch(promiseFailCallback())
}

// const playlistApply = function(selectedPlayer, promiseSuccessCallback, promiseFailCallback) {
//     axios.post('http://172.17.0.20:3000/api/playlistmedia/'+selectedPlayer+'/forward',null, {
//                 auth: {
//                     username: "pi",
//                     password: "pi"
//                 }
//             }).then(
//                 promiseSuccessCallback()).catch(promiseFailCallback())
// }

export { playlistPause}
export { playlistBackward}
export { playlistForward}