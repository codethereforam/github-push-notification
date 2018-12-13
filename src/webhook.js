const crypto = require('crypto');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const app = new Koa();
const KoaBodyParser = require('koa-bodyparser');
const mail = require('./mail');
const config = require('./config');

app.use(KoaBodyParser());

router.post('/webhook', ctx => {
    console.log("-----------------------------------");

    let userAgent = ctx.request.header['user-agent'];
    let xGitHubEvent = ctx.request.header['x-github-event'];
    let xHubSignature = ctx.request.header['x-hub-signature'];

    console.log(`user-agent: ${userAgent}`);
    console.log(`x-github-event: ${xGitHubEvent}`);
    console.log(`x-hub-signature: ${xHubSignature}`);

    if (!userAgent.includes('GitHub')) {
        console.log("user-agent is not correct...");
        ctx.status = 404;
        return;
    }
    if (xGitHubEvent !== 'push') {
        console.log("x-github-event is not correct...");
        ctx.status = 404;
        return;
    }

    let requestBody = ctx.request.rawBody;
    let signature = 'sha1=' + crypto.createHmac('sha1', config.encryption.secret).update(requestBody).digest('hex');
    console.log(`calculated signature: ${signature}`);
    if (signature === xHubSignature) {
        ctx.status = 200;
        ctx.body = 'Authorize success...';
        let bodyJson = JSON.parse(requestBody);
        mail.send(`GitHub repo <${bodyJson.repository.name}> push notification`, `${bodyJson.pusher.name} pushed to <${bodyJson.repository.name}> at ${new Date((bodyJson.repository.pushed_at + 8 * 60 * 60) * 1000)}`);
    } else {
        console.log("signature is not match...");
        ctx.status = 401;
        ctx.body = 'Authorize fail...';
    }
});
app.use(router.routes());
app.listen(config.server.listenPort);