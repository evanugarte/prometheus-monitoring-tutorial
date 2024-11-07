const express = require('express');
const client = require('prom-client');

const app = express();

let register = new client.Registry();

const flipCount = new client.Counter({
    name: "flip_count",
    help: "Number of flips"
});

register.registerMetric(flipCount);

register.setDefaultLabels({
    app: 'coin-api'
});

client.collectDefaultMetrics({ register });

app.get('/flip-coin', (_, response) => {
    const randomNumber = Math.random();
    flipCount.inc();
    let result = 'heads';
    if (randomNumber < 0.5) {
        result = 'tails';
    }
    return response.status(200).send(result);
});

app.get('/metrics', async (_, response) => {
    response.setHeader('Content-type', register.contentType);
    response.end(await register.metrics());
});

app.listen(5000, () => {
    console.log('Started server. Listening on port 5000.');
});
