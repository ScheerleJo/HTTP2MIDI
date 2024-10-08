# Command List

This list includes all currently functioning Commands for HTTP-Requests with this application. A short description for nearly any request can be found on the GUI.

## Swagger / GUI

When entering the following URL you get to a Graphic Interface, where you can test all functions, that http2midi has to offer. This can be helpful when debugging your system.

```URL
http://*myIP*:8010/api-docs
```

Note: *myIP* has to be the IP of the computer running http2midi. When all of the handling and calling is done on a single Workstation you can replace the IP with `localhost`

## /kill

This branch does not offer any query string Object, when the following URL is called, http2midi shuts itself down.

```url
http://*myIP*:8010/kill
```

## Actions

### /studioOne

The `/studioOne` branch is for requesting action triggering some function in either Studio One or Presenter.
A command in the `/studioOne` branch is created like this

```url
http://*myIP*:8010/studioOne?action=*myAction*
```

- action=startRec
- action=stopRec
- action=setMarker
- action=setEndMarker
- action=normalize
- action=exportAudio

### /presenter

the `/presenter` branch does basically the same thing as the `/studioOne` branch but for the software Presenter by Worship Tools.

```url
http://*myIP*:8010/studioOne?action=*myAction*
```

- action=changeItem
- action=prevItem
- action=nextItem
- action=changeSlide
- action=prevSlide
- action=nextSlide

## /get

This branch is only needed for status requests with Companion. If you set up a trigger in Companion, the way to get any status reliable from http2midi is with `/get`.

```url
http://*myIP*:8010/get?feedback=*myFeedback*
```

- feedback=recStatus
- feedback=markerCount
