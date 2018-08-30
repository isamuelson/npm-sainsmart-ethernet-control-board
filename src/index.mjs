const defaults = {
	ip: "192.168.1.4",
	port: "30000"
}

import AsyncMutex from "async-mutex";
import Axios from "axios"; 
import { timeout } from "./utils";

const mutex =  new AsyncMutex.Mutex();
const axios = Axios.create({ timeout: 5000 });

const DELAY = 75;

class Api {

	constructor(config = defaults) {
		this.baseUrl = "http://" + config.ip + "/" + config.port + "/";
	}

	async turnOn(channel) {
		const release = await mutex.acquire();
		try {
	  		const url = this.baseUrl + (channel * 2 -1).toString().padStart(2, '0')
    		const response = await axios.get(url);
  			return true;
		} finally {
			await timeout(DELAY).then(release);
		}
	}

	async turnOff(channel) {
		const release = await mutex.acquire();
		try {
		  	const url = this.baseUrl + (channel * 2 -2).toString().padStart(2, '0')
    		const response = await axios.get(url);
  			return true;
		} finally {
			await timeout(DELAY).then(release);
		}
	}

	async getState() {
		const release = await mutex.acquire();
		try {
  			const url = this.baseUrl + "99";
    		const response = await axios.get(url);
    		const data = />(.\d*)</.exec(response.data);
    		return data[1].split("").map(Number);
		} finally {
			await timeout(DELAY).then(release);
		}
	}

	async applyState(state, force = false) { 
		const currentState = !force && await this.getState();
		for (var i = 0; i < 16; i++) {
			if (force == false) {
				if (state[i] != 0 && state[i] != 1) continue;
 	 			if (state[i] == currentState[i]) continue;
 	 		}
 	 		if (state[i] == 1) {
 	 			await this.turnOn(i + 1);
 	 		}
 	 		else {
 	 			await this.turnOff(i + 1);
 	 		}
		}
	}

	async turnOnAll () {
		const state = Array(16).fill(1);
		return await this.applyState(state);
	}

	async turnOffAll () {
		const state = Array(16).fill(0);
		return await this.applyState(state);
	}

	async switch(channel) {
		const currentState = await this.getState();
		if (currentState[channel - 1] == 0) {
			await this.turnOn(channel)
			
		} else {
			await this.turnOff(channel);
		}
	}

	async switchAll() {
		const currentState = await this.getState();
		const desiredState = currentState.map(x => +!x );
		return await this.applyState(desiredState, true);
	}

	async toggle(channel, delay = 250 - DELAY) {
		await this.switch(channel);
		return async () => {
			await timeout(delay)
			return await this.switch(channel);
		}	
	}

	async toggleAll(delay = 250 - DELAY) {
		await this.switchAll();

		return async () => {
			await timeout(delay);
			return await this.switchAll();
		}
	}
}

export default function(config) { return new Api(config); }