# github-push-notification
a Node.js server that sends email notification when someone push to GitHub repo via Webhooks

## why create this repo

I want to receive email notification when someone push to my repository.

## what you need

1. a personal GitHub repository
1. an email account to send email
1. a VPS to deploy this project (installed npm and node)

## how to run

1. download, configure, deploy, run

```bash
git clone https://github.com/codethereforam/github-push-notification.git
cd github-push-notification/src
mv config.js.template config.js
vim config.js   # edit it to use your config
npm install
nohup npm start > webhook.log 2>&1 &
```

2. set GitHub repository Webhooks
- Payload URL: http://`[VPS IP]`:`[listenPort in config.js]`/webhook
- Content type: application/json
- Secret: `[secret in config.js]`
- Just the push event
- Active


## license

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
