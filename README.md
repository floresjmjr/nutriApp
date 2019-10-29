# Nutrition App

## Background
This application allows a user to search for food items using two USDA databases and see their nutritional breakdown depending on the selected serving size. The quantity of the food item can be added to the food log and the totals calculated. You can also find foods based on a specific nutrient and see a total nutritional breakdown of the foods in the food log.

## Technologies Used
#### Front-End
* HTML
* CSS
* JavaScript
* jQuery
* D3.js

#### Back-end
* Pug - (Pug makes coding html easy and quicker, i've definetly missed this when using react)
* Node
* Express

#### Database
* MongoDB (Atlas) - (I thought that a NoSql database would have been more practical considering that I would have otherwise needed to create multiple tables and have multiple primary keys and having to connect them all would be messy).

#### Deployment
* Heroku - (CLI is pretty straightword and the documentation is excellent)


## Phases
#### First Phase
**COMPLETED**
* Create search and CRUD functionalty
* Allow for food lookup and nutrition lookup
* Breakdown nutrient info
* Logs selected food items by quantity and serving size

#### Second Phase
**COMPLETED**
* Show breakdown of nutritional info (analysis) using visuals (D3.js, sunburst and bar chart) 
* Show macros by percentage breakdown

**CURRENTLY IN PROGRESS**
* Create authentication through AWS Cognito and AWS Amplify

**PLANNED TO DO**
* Store logged items by date and increment date
* Add in the omega and amino acid data

#### Third Phase
**PLANNED TO DO**
* Suggest recipes (or food items) based on nutrients that one is lacking in their diet (log)
* Calculate nutritional info based on specific measurements and ingredients of a given receipe 
* Import nutritional info through the barcode