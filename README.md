Sonoff Control
======

Still in a **POC** mode. Please contribute if it doesn't fit your devices or needs.

Ewelink configuration
----


First configure your sonoff devices  with ewelink

Get the sonoff ids by running the `npm run list` command, and you should get :

```
yarn run v1.22.10
$ node sonoff/list.js
[ { id: '10006d2372', name: 'Radiateur Lili' },
{ id: '10010331ea', name: 'Nik' } ]
Done in 2.41s.

Process finished with exit code 0
```

The names above are the one you have in the eweLink app, we won't need them. But we need ids.


.env
------

Now we need ids of the devices and put them a name. OK, that's not optimized :D
Don't forget to put the region `us` or `eu` - (or the right one, sorry...) 


```
EMAIL=my.ewelink@mail.com
PASSWORD=ewelinkPassworde
# default is us
REGION=eu
DEVICES=[{"name":"LIVINGROOM","id":"10006d2372"},{"name":"BEDROOM","id":"10010331ea"}]
```
