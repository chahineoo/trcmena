# trcedu-landing
# Instruction to TRC EDU


# Contents:

- General informatioin
- Installation instructions
- Description of endpoints


# General info

The repository consists of two folders - backend and frontend, deployed separately. Information on the backend part of the application will be provided below. 



# Installation guide

## Backend
Node version: 22.11.0
Stack: Nest.js, Prisma, Typescript
Readme: In folder /backend
Install:
```bash
$ npm run build
$ npm run start
```

## Frontend
Node version: 22.11.0
Stack: Next.js, React, Typescript
Readme: In folder /frontend
Install:
```bash
$ yarn build
$ yarn start
```


# Endpoint description

## List of endpoints:
- GET     /v1/calculate-fee
- GET     /v1/payment
- POST  /v1/payment

## Authorization:
No authorization is required, but there is a limit of 1 request per 5 seconds on the POST /v1/payment request

## GET /v1/calculate-fee:
Description: Returns a number with the commission included, as well as the commission percentage itself. The commission percentage is taken from the settings of the backend part of the application.

Parameters:
amount - the number to be calculated. Mandatory field, must be greater than zero

Example request:
GET 
http://localhost:3000/v1/calculate-fee?amount=7637.928

Query result:
```bash
{
	amount: string - returned number with commission
	percent: string - percentage,
}
```

## GET /v1/payment:
Description: Returns information about a payment by its identifier

Parameters:
id - payment identifier. Optional parameter, consists of digits only.
timestamp - UTC time value in seconds.
Mark: one of these values must be present

Example request:
GET 
http://localhost:3000/v1/payment?id=1234567890

Query result:
```bash
{
	id: string - payment identifier
	status: string - payment status, available options: 
		“new” - new
		“waiting_for_customer” - awaiting
		“waiting_for_deposit” - waiting
		“exchanging” - exchange is in progress
		“on_hold” - delayed
		“sending” - is being sent
		“finished” - successfully completed
		“failed” - something went wrong
		“expired” - expired
		“canceled” - canceled
		“refunded” - returned due to risk leverage.
	clientName: string - client name
	payerName: string - payer name
	amount: string - original amount without commission fee
	fee: string - commission
	createdAt: string - date of payment creation
	redirectUrl: string - link to payment
}
```

## POST /v1/payment:
Description: Initializes the payment and saves the data to the database, returns information about the payment

Parameters:
amount - the number to be calculated. Mandatory field, must be greater than zero

Example request:
POST 
http://localhost:3000/v1/payment,
Request body raw:
```bash
{
  amount: number - commission-free amount, in the currency specified in the backend application settings, mandatory parameter, must be greater than zero and maximum 2 decimal places
  email: number - e-mail, mandatory parameter
  clientName: string - client name, mandatory parameter,
	payerName: string - payer name, mandatory parameter,
  passport: passport number, cardId or other personal identification data, mandatory parameter,
  dateBirthday: “MM.DD.YYYY” - date of birth, mandatory parameter
  currencyFrom: string - fiat currency in which the payment will be made, mandatory parameter
}
```

Query result:
```bash
{
	id: string - payment identifier
	status: string - payment status: 
		“new”
	clientName: string - client name
	payerName: string - payer name
	amount: string - original amount without commission fee
	fee: string - commission
	createdAt: string - date of payment creation
	redirectUrl: string - link to payment
}
```
