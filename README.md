# Stocks Portfolio
A stock Portfolio and management application. allowing to add and remove stocks to the portfolio.
A user must be logged in to add/remove stocks to his portfolio. unautharized access is blocked.

## Note:
For this to work, you will need to add a few things to .env file, which is located on the root of the backend project, namely:

**API_KEY** : an api key for the stocks API as stated [here](https://site.financialmodelingprep.com/developer/docs)

**DB_URI** : the URI of mongodb, which contains a "users" collection

**JWT_EXPIRES**: a string/number containing the time of expiery for JWT tokens

**JWT_SECRET**: a random string, to be used as a secret for JWT encryption


# How To Run:

clone the repository:

```
git clone https://github.com/Ido-Kadosh/stocks-portfolio-backend.git
```

also clone the frontend repository:
```
git clone https://github.com/Ido-Kadosh/stocks-portfolio.git
```

navigate to backend folder, and run it using:
```
npm run start
```

navigate to frontend folder, and run it using:
```
npm run dev
```
