const express = require('express');
const app = express();
const client = require('prom-client');

let register = new client.Registry();

const headsCount = new client.Counter({
    name: "heads_count",
    help: "Number of heads"
});

const tailsCount = new client.Counter({
    name: "tails_count",
    help: "Number of tails"
});

const flipCount = new client.Counter({
    name: "flip_count",
    help: "Number of flips"
});

register.registerMetric(headsCount);
register.registerMetric(tailsCount);
register.registerMetric(flipCount);

register.setDefaultLabels({
    app: 'coin-api'
});

client.collectDefaultMetrics({ register });

app.get('/flip-coins', (request, response) => {
    const times = request.query.times;
    if (times && times > 0) {
        flipCount.inc(Number(times));
        let heads = 0;
        let tails = 0;
        for (let i = 0; i < times; i++) {
            let randomNumber = Math.random();
            if (randomNumber < 0.5) {
                heads++;
            } else {
                tails++;
            }
        }
        headsCount.inc(heads);
        tailsCount.inc(tails);
        response.json({ heads, tails });
    } else {
        response.send('hello! i work!!');
    }
});

app.get('/metrics', async (request, response) => {
    response.setHeader('Content-type', register.contentType);
    response.end(await register.metrics());
});

app.listen(5000, () => {
    console.log('Started server. Listening on port 5000.');
});
