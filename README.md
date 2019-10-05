# Nutrition App

## Background
This application allows a user to search for food items using two USDA databases and see their nutritional breakdown depending on the selected serving size. The quantity of the food item can be add to the food log and the totals calculated. You can also find foods based on a specific nutrient.

## Technologies Used
### Front-End
* HTML
* CSS
* JavaScript
* jQuery

### Back-end
* Pug - (Pug makes coding html easy and quicker, i've definetly missed this when using react)
* Node
* Express

### Database
* MongoDB (Atlas) - (I thought that a NoSql database would have been more practical considering that I would have otherwise needed to create multiple tables and have multiple primary keys and having to connect them all would be messey.

### Deployment
* Heroku - (Went with heroku as that's what I knew at the time and the CLI is pretty easy to work with and the documentation pretty clear.)


## Phases
### First Phase
* Create search and CRUD functionalty (DONE)
* Allow for food lookup and nutrition lookup (DONE)
* Breakdown nutrient info (DONE)
* Logs selected food items by quantity and serving size (DONE)

### Second Phase
* Create authentication
* Store logged items by date and increment
* Show breakdown of nutritional info (analysis) using visuals (D3.js, sunburst and bar chart) (DONE)
* Add in the omega and amino acid data
* Show macros by percentage breakdown (DONE)

## Third Phase
* Suggest recipes (or food items) based on nutrients that one is lacking in their diet
* Calculate nutritional info of recipe 
* Import nutritional info through the barcode

