#  SainSmart Ethernet Control Board 16 Channel

This npm package provides Async operations to control SainSmart Ethernet Control Board. 

[![N|Solid](https://cdn.shopify.com/s/files/1/1978/9859/products/01_595_15_1_1024x1024.jpg)](https://www.sainsmart.com/products/rj45-ethernet-control-board-for-8-16-ch-relays-1?nosto=customers-also-bought)

###### `Notice: This board firmware will crash in the following conditions:`
- Commands sent too fast (this lib safely throttle the commands).
- More then one TCP connection is accessing the board. 

These will require the board to be hard-reset via power-cycle.
# Features!
  - On/Off channel/all. 
  - get/apply the state of all channels. 
  - switch channel/all. 
  - toggle (delay) channel/all. 
  - safely throttle the commands. From my experiences with the board `75ms` were stable for my tests. 
 
## Installation
```sh
$ npm install (TBD)
```
## Usage
#### Initialization
```js
import Api from "TBD";
const configuration = {
	port: 30000, 
	ip: "192.168.1.4" //default
}
const controller = Api(configuration);
```
#### turn on/off
```js
controller.turnOn(1);  // 1-16
controller.turnOff(1); // 1-16
controller.turnOnAll();
controller.turnOffAll();
```
#### get/apply state
```js
controller.getState().then(console.log);
controller.applyState(Array(16).fill(1)); 
```
#### switch
```js
controller.switch(1); // 1-16
controller.switchAll();
```

#### toggle
```js
controller.toggle(1, 1000)) // 1-16
	.then(async (cont)  => {
		return { state: await controller.getState(), continue: cont };
	})
	.then(async (r) => {
		console.log(r.state, "toggle applied");
		await r.continue();
	})
    .then(() => console.log "toggle done");
    
controller.toggleAll(1000))
	.then(async (cont)  => {
		return { state: await controller.getState(), continue: cont };
	})
	.then(async (r) => {
		console.log(r.state, "toggle applied");
		await r.continue();
	})
    .then(() => console.log "toggle done");
```
### Todos
 - publish npm package

License
----
MIT