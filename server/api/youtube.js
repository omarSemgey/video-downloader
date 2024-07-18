const express = require('express');
let router = express.Router();
const ytdl = require('ytdl-core');
const fs = require('fs');
const path =require('path');

module.exports = router;
router.route('/getTitle').post(async (req, res) =>{
    try{
        const videoUrl=req.body.link;
        if(!ytdl.validateURL(videoUrl)){
            return res.status(500).send('invalid url');
        }

        const info = await ytdl.getInfo(videoUrl);
        const title=info.videoDetails.title;
        res.status(200).send(title);
        //const description =info.videoDetails.description;

    }
    catch(err){
        console.log(err);
        res.status(500).send('internal server error');
    }
});

router.route('/downloadingVideo').post(async (req, res) => {
    try{
        //get the video url from the front-end request
        const videoUrl = req.body.link;

        //check if the video url is valid
        if(!ytdl.validateURL(videoUrl)){
            return res.status(500).send('invalid url');
        }

        //the download options
        const options= {
            //video quality
            quality: 'highestvideo',
            //video or audio
            filter: 'videoandaudio'
        };

        //stor the video info
        const info = await ytdl.getInfo(videoUrl);
        const title=info.videoDetails.title;

        //store the video in the temp folder
        const videoPath=path.join(__dirname,'temp',`${title}.mp4`);
        //download the video on the server
        const videoWriteStream=fs.createWriteStream(videoPath);
        ytdl(videoUrl,options).pipe(videoWriteStream);

        //when the download is finished download on the user then deleted it
        videoWriteStream.on('finish',() => {
            res.download(videoPath,`${title}.mp4`,() =>{
                fs.unlinkSync(videoPath);
            });
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send('internal server error');
    }
});