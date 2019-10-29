(use `apm` branch of `sentry-javascript` to test it out)


```sh
$ git clone https://github.com/getsentry/sentry-javascript.git
$ cd sentry-javascript
$ yarn
$ yarn build
$ cd packages/browser
$ for i in {browser,core,hub,integrations,minimal,node,types,typescript,utils}; do cd ../$i && yarn link; done;
```

Now you will have all the packages linked locally. To use them just cd into this project and then:

```sh
$ yarn
$ yarn link @sentry/browser @sentry/core @sentry/hub @sentry/integrations @sentry/minimal @sentry/node @sentry/types @sentry/typescript @sentry/utils
```

To run:

```sh
$ node index.js
// or
$ node minimal.js
```
