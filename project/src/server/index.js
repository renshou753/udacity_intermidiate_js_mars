require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
var url = require('url');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/rovers', async (req, res) => {
    const qs = url.parse(req.url, true).query;
    const rover = qs.rover
    let max_date, launch_date, landing_date, status

    // query rover manifests
    try {
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        max_date = manifest.photo_manifest.max_date
        landing_date = manifest.photo_manifest.landing_date
        launch_date = manifest.photo_manifest.launch_date
        status = manifest.photo_manifest.status
        
    } catch (err) {
        console.log('error:', err);
    }
    
    // query rover image
    try {
        let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${max_date}s&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ 
            "max_date": max_date,
            "images": images,
            "launch_date": launch_date,
            "landing_date": landing_date,
            "status": status
         })
    } catch (err) {
        console.log('error:', err);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))