const ffmpeg = require('ffmpeg');

const splitTimeTitle = infoString =>
    infoString.split('-').map(a => a.trim())

const timeToSeconds = time => {
    let sec = 0
    time = time.split('').reverse()
    let multiplier = [1, 10, 60, 600, 3600, 36000]
    let multIdx = 0
    time.forEach(t => {
        if (t !== ':')
            sec += t * multiplier[multIdx++]
    })
    return sec
}

const unixSpaces = title =>
    title.split(" ").join("\\ ")

const toObj = arr => {
    return {
        start_time: arr[0],
        duration: undefined,
        title: arr[1]
    }
}

const findDuration = list => {
    for (var i = 0; i < list.length; i++) {
        // only add end time if not last record
        let cur = list[i]
        if (i !== list.length - 1) {
            cur.duration = list[i + 1].start_time - cur.start_time
        }
    }
    return list
}

const songInfo = list => {
    let finalList = []
    const split = list.split('\n')
    split.forEach(
        a => {
            let tmp = splitTimeTitle(a)
            tmp[0] = timeToSeconds(tmp[0])
            tmp[1] = unixSpaces(tmp[1])
            finalList.push(toObj(tmp))
        }
    )
    return findDuration(finalList)
}


const splitFile = (fPath, splits, dir, callBack) => {
    try {
        // console.log(fPath)
        // console.log(dir)
        dir = unixSpaces(dir)
        fPath = unixSpaces(fPath)
        let proc = new ffmpeg(fPath)
        proc.then(audio => {
            let suc = true;
            splits.forEach(s => {
                // console.log(s);
                // console.log("to: " + dir + "/" + s.title);
                audio.fnSplitSoundToMP3(
                    dir + "/" + s.title,
                    s.start_time,
                    s.duration,
                    (err, file) => {
                        if (err) {
                            suc = false
                            callBack({
                                status: "err",
                                err: err
                            })
                        } else {
                            callBack({
                                status: "ok",
                                fName: s.title
                            })
                        }
                    }
                )
            })
            return {
                status: suc
            }
        }, err => { console.log("error reading file")
        })
        .then(val => {
            callBack(val)
        })
    } catch (e) {
        console.log("Error making ffmpeg obj");
        console.log(e.code, e.msg);
        return {
            status: "error",
            code: e.code
        }
    }
}

module.exports = {
    split: splitFile,
    splitTimeTitle: splitTimeTitle,
    timeToSeconds: timeToSeconds,
    unixSpaces: unixSpaces,
    toObj: toObj,
    findDuration: findDuration,
    songInfo: songInfo
}

//Tests
// const test_list = "0:00 - Song 1\n2:25 - song 2\n04:56 - song 3"
// const splits = songInfo(test_list)
// splitFile("test/Boromir.mp3", splits)

// var fs = require('fs')
// if (fs.existsSync("test/splits/Song\ 1.mp3")) {
//     console.log("EXISTS");
// } else {
//     console.log("NOPE");
// }


/*
"0:00 - Song 1\n2:25 - song 2\n04:56 - song 3"
["0:00 - Song 1", "2:25 - song 2", "04:56 - song 3"]
[
    ["0:00", "Song 1"],
    ["2:25", "song 2"],
    ["4:56", "song 3"],
]
[
    ["00:00", "Song 1"],
    ["02:25", "song 2"],
    ["04:56", "song 3"],
]
[
    {
        start_time: "00:00",
        end_time: "02:25",
        title: Song 1
    },
    {
        start_time: "02:25",
        end_time: "04:56",
        title: song 2
    },
    {
        start_time: "04:56",
        end_time: null,
        title: song 3
    },
]
*/
