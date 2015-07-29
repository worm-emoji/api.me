api.me
===============

This API aggregates data about *you* into a single source. Data is refreshed constantly and cached, which provides real-time data with low latency. A live example where this real-time data is used can be found [on Luke Miles' website](https://lukemil.es/is/).

## Endpoints

### Index

[`/v1/`](https://api.lukemil.es/v1/): This is the index. Returns basic information about e such as age. Also lists all other endpoints.

**Example response**
``` JSON
{
  "status": 200,
  "name": "Luke Miles",
  "age": 17.668431469675,
  "interests": [
    "Coffee",
    "Programming",
    "Food",
    "Photography"
  ],
  "location": "San Francisco Bay Area",
  "endpoints": [
    "\/v1\/github",
    "\/v1\/github\/contributions",
    "\/v1\/github\/last",
    "\/v1\/music",
    "\/v1\/music\/recent",
    "\/v1\/music\/weekly",
    "\/v1\/sleep",
    "\/v1\/walking"
  ]
}
```

## GitHub 
[`/v1/github`](https://api.lukemil.es/v1/github/): Returns latest github commit and number of contributions. For just the latest commit, use [`/v1/github/last`](https://api.lukemil.es/v1/github/last), and for just the number of contributions, use [`/v1/github/contributions`](https://api.lukemil.es/v1/github/contributions).

**Example response**
``` JSON
{
  "lastPush": {
    "repo_url": "https:\/\/github.com\/lukemiles\/stolen-color",
    "commit_url": "https:\/\/github.com\/lukemiles\/stolen-color\/commit\/4580c6f71f72781df71e373f3a8b2513083c4f23",
    "commit_message": "add readme",
    "time": "2015-02-05T08:17:17Z",
    "repo_name": "lukemiles\/stolen-color"
  },
  "contributions": 104,
  "status": 200,
  "lastUpdated": "Monday, February 9th 2015, 2:50:01 pm -08:00"
}
```
## Music

[`/v1/music`](https://api.lukemil.es/v1/music/): Returns latest music data from my [last.fm profile](http://last.fm/user/notlukemiles). Includes recent song plays and weekly stats. For just weekly song plays, use [`/v1/music/weekly`](https://api.lukemil.es/v1/music/weekly), and for just recent song data, use [`/v1/music/recent`](https://api.lukemil.es/v1/music/recent).

**Example response**
``` JSON
{
  "recent": [
    {
      "artist": "Aphex Twin",
      "name": "minipops 67 (source field mix)",
      "album": "Syro",
      "image": "http:\/\/userserve-ak.last.fm\/serve\/300x300\/101196567.png",
      "url": "http:\/\/www.last.fm\/music\/Aphex+Twin\/_\/minipops+67+(source+field+mix)",
      "artistUrl": "http:\/\/www.last.fm\/music\/Aphex+Twin"
    },
    {
      "artist": "Sweet Trip",
      "name": "Female Lover",
      "album": "You Will Never Know Why",
      "image": "http:\/\/userserve-ak.last.fm\/serve\/300x300\/70158662.png",
      "url": "http:\/\/www.last.fm\/music\/Sweet+Trip\/_\/Female+Lover",
      "artistUrl": "http:\/\/www.last.fm\/music\/Sweet+Trip"
    }
  ],
  "weeklyPlays": 159,
  "weeklyTopArtist": {
    "name": "Bones",
    "count": 48
  },
  "weeklyUniqueArtists": 36,
  "status": 200,
  "lastUpdated": "Monday, February 9th 2015, 2:54:01 pm -08:00"
}
```

## Sleep

[`/v1/sleep`](https://api.lukemil.es/v1/sleep/): You can track my sleep with the Android app [Sleep as Android](https://play.google.com/store/apps/details?id=com.urbandroid.sleep&hl=en) and use the [SleepCloud addon](https://play.google.com/store/apps/details?id=com.urbandroid.sleep.addon.port&hl=en) to sync my changes with Google Drive. This endpoint returns my daily sleep (including naps) for the past fourteen days. `time` is the UNIX timestamp of the beginning of the day (12:00:00 California time). 

**Example response**
``` JSON
{
  "days": [
    {
      "time": 1423468800,
      "hours": 8.97
    },
    ...
    {
      "time": 1422345600,
      "hours": 6.56
    }
  ],
  "total": 104.01,
  "countedDays": 14,
  "oldest": 1422312901,
  "interval": 14,
  "average": 7.43,
  "status": 200,
  "lastUpdated": "Monday, February 9th 2015, 2:55:01 pm -08:00"
}
```

## Walking

[`/v1/walking`](https://api.lukemil.es/v1/walking/): This endpoint provides recent walking data as retrieved from Fitbit's API.

**Example response**
``` JSON
{
  "steps": 1041,
  "interval": 1,
  "distance": 0.48,
  "units": "en_US",
  "status": 200,
  "lastUpdated": "Monday, February 9th 2015, 3:00:01 pm -08:00"
}
```
