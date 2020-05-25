(use `apm` branch of `sentry-javascript` to test it out)


```sh
$ git clone https://github.com/getsentry/sentry-javascript.git
$ cd sentry-javascript
$ yarn
$ yarn build
$ yarn link:yarn
```

Now you will have all the packages linked locally. To use them just cd into this project and then:

```sh
$ yarn
$ yarn link @sentry/browser @sentry/core @sentry/hub @sentry/integrations @sentry/minimal @sentry/node @sentry/types @sentry/typescript @sentry/utils @sentry/apm
```

To run:

```sh
$ node index.js
// or
$ node minimal.js
```
