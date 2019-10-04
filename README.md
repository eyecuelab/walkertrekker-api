# Welcome to Walkertrekker-api

**Last Update: 10/05/2019**

Walkertrekker-api is the companion repo to [walkertreker](https://github.com/eyecuelab/walkertreker). It is a zombified game to motivate human people to walk more. Built in React Native for iOS and Android. 

It was created by 3 groups of EyeCue Lab interns:
* [Joe](https://github.com/josephfriesen) and [Josh](https://github.com/gearjosh)
* [Kim](https://github.com/kimmcconnell) and [Ward](https://github.com/wchamberlain89)
* [Stuart](https://github.com/MCStuart) and [Brooke](https://github.com/BrookeZK)

With the support of EyeCue Lab employees - thank you! (:

### Are you a walkertrekker developer? Or want to learn more about the stack? 
### Check out the [walkertrekker-api wiki](https://github.com/eyecuelab/walkertrekker-api/wiki)

# Handy Commands:

## Database Migration
```
npm run migrate
```

## Heroku DB migrate
```
heroku run npm run migrate -a walkertrekker
```

## Heroku db reset
```
heroku pg:reset DATABASE_URL -a walkertrekker
```

## API Doc

### Regenerate:
```
npm run apidoc
```

### Open:
```
open public/doc/index.html
```
