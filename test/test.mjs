import Api from "../src/index";
import { randomState } from "./helper";

var configuration = {
	port: 30000,
	ip: "10.76.55.100"
}

const controller = Api(configuration);

const test = async(startTime) => {

	controller.getState().then((state) => console.log(state, "current"))
	.then(randomState)
	.then((state) => {
		console.log(state, "desired"); 
		return state;
	})
	.then((state) => controller.applyState(state))
	.then(() => controller.getState())
	.then((state) => console.log(state, "applied"))
	.then(console.log(""))
	.then(() => controller.switchAll())
	.then(() => controller.getState())
	.then((state) => console.log(state, "switched"))
	.then(() => controller.toggleAll(1000))
	.then(async (cont)  => {
		return { state: await controller.getState(), continue: cont };
	})
	.then(async (r) => {
		console.log(r.state, "toggle applied");
		await r.continue();
	})
	.then(() => controller.getState())
	.then((state) => console.log(state, "toggle done"))
	.then(() => test());
}

controller.turnOffAll().then(test);
