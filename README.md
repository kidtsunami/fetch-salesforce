# fetch-salesforce

`fetch-salesforce` is a wrapper for the Salesforce.com REST API using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This library was initially developed to be used in React Native projects that needed to access the Salesforce API, but it can be used in any environment that supports `fetch`. 

## Install

```
yarn add fetch-salesforce
```

## Usage

### Setup
```ts
import { SalesforceOptions, FetchSalesforce } from 'fetch-salesforce';
const options: any = {
  clientID: '',
  authorizationServiceURL: '',
  tokenServiceURL: '',
  redirectUri: '',
  apiVersion: 39.0,
  logLevel: 'DEBUG',
}

const fetchSalesforce = new FetchSalesforce(options);
```

### Insert

```ts
fetchSalesforce.fetchSObject.insert('Account', {
  Name: 'My Account'
})
.then((res) => {
  console.log(res);
});
```

### Query

```ts
fetchSalesforce.fetchQuery.query('SELECT ID FROM Account LIMIT 10')
.then((res) => {
  console.log(res);
});
```

... you get the idea!

## Developing `fetch-salesforce`

### Install

```
git clone https://github.com/kidtsunami/fetch-salesforce
cd fetch-salesforce
```

### Compiling

```
tsc
```

### Running Tests
```
yarn test
```
